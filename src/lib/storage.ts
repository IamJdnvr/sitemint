// ─── Storage Service ──────────────────────────────────────────
// Dual-mode: uses Supabase Storage when configured, otherwise
// stores files as base64 data URLs in localStorage.
//
// Usage:
//   import { storage } from "@/lib/storage";
//   const url = await storage.upload("media", file);
//   const items = await storage.list("media");

import { createClient } from "./supabase";
import { generateId } from "./uuid";
import type { MediaItem } from "@/types";

const LOCAL_STORAGE_KEY = "sitemint_media";

// ─── Types ────────────────────────────────────────────────────

export interface StorageFile {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "svg" | "logo";
  size: number;
  created_at: string;
  /** Supabase storage path (for deletion) */
  storage_path?: string;
  /** Bucket name (for deletion) */
  bucket?: string;
}

// ─── Local helpers ────────────────────────────────────────────

function getLocalFiles(): StorageFile[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalFiles(files: StorageFile[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(files));
}

// ─── Supabase helpers ──────────────────────────────────────────

/** Re-export the same heuristic from supabase.ts */
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return url.startsWith("https://") && key.startsWith("eyJ");
}

/** Guess the content-type from the bucket name or file extension */
function guessContentType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png": return "image/png";
    case "jpg": case "jpeg": return "image/jpeg";
    case "gif": return "image/gif";
    case "webp": return "image/webp";
    case "svg": return "image/svg+xml";
    case "mp4": return "video/mp4";
    default: return "application/octet-stream";
  }
}

// ─── Public API ───────────────────────────────────────────────

export const storage = {
  /**
   * Upload a file. Returns the public URL on success.
   *
   * - **Supabase mode**: uploads to the given bucket and returns the
   *   public URL from Supabase Storage.
   * - **Local mode**: reads the file as a data URL and stores it in
   *   localStorage (max ~4 MB total).
   */
  async upload(
    bucket: string,
    file: File,
    onProgress?: (pct: number) => void
  ): Promise<StorageFile> {
    const client = createClient();

    // ── Supabase path ──────────────────────────────────
    if (isSupabaseConfigured() && client.storage?.from) {
      // Create bucket if it doesn't exist (silently fails if it does)
      await client.storage.createBucket(bucket, { public: true }).catch(() => {});

      const ext = file.name.split(".").pop() || "png";
      const filePath = `${generateId()}.${ext}`;

      const { data, error } = await client.storage
        .from(bucket)
        .upload(filePath, file, {
          contentType: guessContentType(file.name),
          upsert: false,
        });

      if (error || !data) {
        // Try reading as data URL fallback
        const dataUrl = await readFileAsDataURL(file);
        const localFile: StorageFile = {
          id: generateId(),
          name: file.name,
          url: dataUrl,
          type: inferType(file),
          size: file.size,
          created_at: new Date().toISOString(),
        };
        const files = [localFile, ...getLocalFiles()];
        saveLocalFiles(files);
        onProgress?.(100);
        return localFile;
      }

      const { data: urlData } = client.storage.from(bucket).getPublicUrl(filePath);

      const remoteFile: StorageFile = {
        id: generateId(),
        name: file.name,
        url: urlData.publicUrl,
        type: inferType(file),
        size: file.size,
        created_at: new Date().toISOString(),
        storage_path: filePath,
        bucket,
      };

      // Also keep a local record
      const files = [remoteFile, ...getLocalFiles()];
      saveLocalFiles(files);
      onProgress?.(100);
      return remoteFile;
    }

    // ── Local fallback path ────────────────────────────
    const dataUrl = await readFileAsDataURL(file);
    const localFile: StorageFile = {
      id: generateId(),
      name: file.name,
      url: dataUrl,
      type: inferType(file),
      size: file.size,
      created_at: new Date().toISOString(),
    };
    const files = [localFile, ...getLocalFiles()];
    saveLocalFiles(files);
    onProgress?.(100);
    return localFile;
  },

  /**
   * List all files in a bucket/folder.
   */
  async list(_bucket: string): Promise<StorageFile[]> {
    const client = createClient();

    if (client.storage) {
      // Get files from local record — Supabase doesn't return files
      // efficiently without knowing paths. We use the localStorage
      // index as the source of truth for metadata.
      return getLocalFiles();
    }

    return getLocalFiles();
  },

  /**
   * Delete a file by its local record id.
   */
  async delete(id: string): Promise<void> {
    const files = getLocalFiles();
    const target = files.find((f) => f.id === id);
    if (!target) return;

    // Delete from Supabase Storage if we have the path
    if (target.storage_path && target.bucket && isSupabaseConfigured()) {
      const client = createClient();
      try {
        await client.storage.from(target.bucket).remove([target.storage_path]);
      } catch {
        // Ignore deletion errors — the local record is removed
      }
    }

    saveLocalFiles(files.filter((f) => f.id !== id));
  },

  /**
   * Convert a local MediaItem (from types/index.ts) to a StorageFile.
   */
  fromMediaItem(item: MediaItem): StorageFile {
    return {
      id: item.id,
      name: item.name,
      url: item.url,
      type: item.type as StorageFile["type"],
      size: item.size,
      created_at: item.created_at,
    };
  },

  /**
   * Convert a StorageFile back to MediaItem shape.
   */
  toMediaItem(file: StorageFile): MediaItem {
    return {
      id: file.id,
      user_id: "user",
      name: file.name,
      url: file.url,
      type: file.type,
      size: file.size,
      created_at: file.created_at,
    };
  },

  /**
   * Check if Supabase Storage is available.
   */
  get isAvailable(): boolean {
    const client = createClient();
    return !!client.storage;
  },
};

// ─── Internal helpers ────────────────────────────────────────

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function inferType(file: File): "image" | "video" | "svg" {
  if (file.type.startsWith("video")) return "video";
  if (file.type.includes("svg") || file.name.endsWith(".svg")) return "svg";
  return "image";
}
