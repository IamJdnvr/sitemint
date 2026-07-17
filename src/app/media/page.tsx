"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Image,
  Trash2,
  FileVideo,
  FileCode,
  Loader2,
  Copy,
  ExternalLink,
  HardDrive,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { storage, type StorageFile } from "@/lib/storage";
import { createClient } from "@/lib/supabase";
import OptimizedImage from "@/components/OptimizedImage";

export default function MediaLibraryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const client = createClient();
  const [storageMode, setStorageMode] = useState<"supabase" | "local">("local");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStorageMode(client.storage ? "supabase" : "local");
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }
    loadMedia();
  }, [user, authLoading]);

  const loadMedia = async () => {
    try {
      const files = await storage.list("media");
      setMediaItems(files);
    } catch (e) {
      console.error("Error loading media:", e);
    }
    setLoading(false);
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    let uploaded = 0;

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: `File too large: ${file.name}`,
          description: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
          variant: "destructive",
        });
        continue;
      }

      try {
        await storage.upload("media", file, (pct) => setUploadProgress(pct));
        uploaded++;
      } catch (err) {
        toast({ title: `Failed to upload: ${file.name}`, description: String(err), variant: "destructive" });
      }
    }

    if (uploaded > 0) {
      await loadMedia();
      toast({ title: `${uploaded} file(s) uploaded successfully`, variant: "success" });
    }

    setUploading(false);
    setUploadProgress(0);
    e.target.value = "";
  };

  const handleDelete = async (id: string) => {
    await storage.delete(id);
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
    toast({ title: "File deleted" });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "image": return <Image className="w-6 h-6" />;
      case "video": return <FileVideo className="w-6 h-6" />;
      case "svg": return <FileCode className="w-6 h-6" />;
      default: return <Image className="w-6 h-6" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center brutal-bg-light">
        <div className="animate-spin rounded-full h-8 w-8"
          style={{ border: "3px solid var(--mint-light)", borderTopColor: "var(--mint)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen brutal-bg-light">
      {/* Header */}
      <header className="px-6 py-4 brutal-bg-white brutal-divider-bottom">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <span className="inline-flex items-center justify-center w-10 h-10 font-bold text-sm brutal-border-3 brutal-bg-white brutal-text-dark">
                ←
              </span>
            </Link>
            <div>
              <h1 className="text-xl font-black brutal-text-dark">Media Library</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                {storageMode === "supabase" ? (
                  <Database className="w-3 h-3" style={{ color: "var(--mint-deep)" }} />
                ) : (
                  <HardDrive className="w-3 h-3 brutal-text-muted-light" />
                )}
                <span className="text-xs font-bold" style={{ color: storageMode === "supabase" ? "var(--mint-deep)" : "#888" }}>
                  {storageMode === "supabase" ? "Supabase Storage" : "Local Storage"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <span className="brutal-btn brutal-btn-sm brutal-btn-mint cursor-pointer">
              <label className="cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Files"}
                <input
                  type="file"
                  accept="image/*,video/*,.svg"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </span>
          </div>
        </div>
      </header>

      {/* Upload progress */}
      {uploading && (
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <div className="w-full h-4 brutal-bg-white brutal-border-3">
            <div
              className="h-full transition-all duration-200"
              style={{ width: `${uploadProgress}%`, background: "var(--mint)" }}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--mint-deep)" }} />
            <span className="text-xs font-bold brutal-text-dark">Uploading... {uploadProgress}%</span>
          </div>
        </div>
      )}

      {/* Media grid */}
      <main className="max-w-6xl mx-auto p-6">
        {mediaItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group"
              >
                <div className="brutal-card">
                  <div
                    className="aspect-square relative overflow-hidden"
                    style={{ background: "#F8FAFC" }}
                  >
                    {item.type === "image" || item.type === "svg" ? (
                      <OptimizedImage
                        src={item.url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ color: "#BBB" }}>
                        {getIcon(item.type)}
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                      style={{ background: "rgba(10,10,10,0.6)" }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <span className="inline-flex items-center justify-center w-8 h-8 cursor-pointer transition-all duration-100 brutal-bg-white"
                            style={{ border: "2px solid var(--brutal-black)", color: "var(--brutal-black)" }}>
                            <ExternalLink className="w-4 h-4" />
                          </span>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{item.name}</DialogTitle>
                          </DialogHeader>
                          <div className="flex items-center justify-center bg-gray-100 p-4"
                            style={{ border: "3px solid var(--brutal-black)" }}>
                            <OptimizedImage
                              src={item.url}
                              alt={item.name}
                              width={800}
                              height={600}
                              className="max-w-full max-h-[60vh] object-contain"
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Input
                              value={item.url}
                              readOnly
                              className="text-xs font-mono"
                              style={{ borderRadius: 0, border: "3px solid var(--brutal-black)" }}
                            />
                            <span
                              className="inline-flex items-center justify-center w-9 h-9 cursor-pointer brutal-bg-white"
                              style={{ border: "3px solid var(--brutal-black)", color: "var(--brutal-black)" }}
                              onClick={() => {
                                navigator.clipboard.writeText(item.url);
                                toast({ title: "URL copied!" });
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </span>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 cursor-pointer"
                        style={{ background: "#DC2626", border: "2px solid var(--brutal-black)", color: "#ffffff" }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5" style={{ borderTop: "2px solid var(--brutal-black)" }}>
                    <p className="text-xs font-bold truncate brutal-text-dark">{item.name}</p>
                    <p className="text-xs font-medium brutal-text-muted-light">
                      {(item.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
              style={{ background: "var(--mint-light)", border: "4px solid var(--brutal-black)", boxShadow: "8px 8px 0px var(--brutal-black)" }}>
              <Image className="w-10 h-10" style={{ color: "var(--mint-deep)" }} />
            </div>
            <h3 className="text-2xl font-black mb-3 brutal-text-dark">No media yet</h3>
            <p className="font-medium mb-8 max-w-md mx-auto brutal-text-muted">
              Upload images, videos, and SVGs to use in your website designs. Files are stored in Supabase Storage.
            </p>
            <span className="brutal-btn brutal-btn-mint brutal-btn-lg cursor-pointer">
              <label className="cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Your First File
                <input
                  type="file"
                  accept="image/*,video/*,.svg"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
