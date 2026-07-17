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
  Card,
  CardContent,
} from "@/components/ui/card";
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

const BRUTAL_BLACK = "#0A0A0A";
const MINT = "#00D4AA";
const MINT_DEEP = "#059669";
const MINT_LIGHT = "#D1FAE5";
const BG_LIGHT = "#ECFDF5";

function BrutalCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        border: `4px solid ${BRUTAL_BLACK}`,
        boxShadow: `6px 6px 0px ${BRUTAL_BLACK}`,
        background: "#FFFFFF",
      }}
    >
      {children}
    </div>
  );
}

export default function MediaLibraryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check if Supabase Storage is available
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

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
          description: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
          variant: "destructive",
        });
        continue;
      }

      try {
        await storage.upload("media", file, (pct) => {
          setUploadProgress(pct);
        });
        uploaded++;
      } catch (err) {
        toast({
          title: `Failed to upload: ${file.name}`,
          description: String(err),
          variant: "destructive",
        });
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG_LIGHT }}>
        <div className="animate-spin rounded-full h-8 w-8" style={{ border: `3px solid ${MINT_LIGHT}`, borderTopColor: MINT }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: BG_LIGHT }}>
      {/* Header */}
      <header
        className="px-6 py-4"
        style={{
          background: "#FFFFFF",
          borderBottom: `4px solid ${BRUTAL_BLACK}`,
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <span
                className="inline-flex items-center justify-center w-10 h-10 font-bold text-sm"
                style={{
                  border: `3px solid ${BRUTAL_BLACK}`,
                  background: "#FFFFFF",
                  color: BRUTAL_BLACK,
                }}
              >
                ←
              </span>
            </Link>
            <div>
              <h1 className="text-xl font-black" style={{ color: BRUTAL_BLACK }}>
                Media Library
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                {storageMode === "supabase" ? (
                  <Database className="w-3 h-3" style={{ color: MINT_DEEP }} />
                ) : (
                  <HardDrive className="w-3 h-3" style={{ color: "#888" }} />
                )}
                <span className="text-xs font-bold" style={{ color: storageMode === "supabase" ? MINT_DEEP : "#888" }}>
                  {storageMode === "supabase" ? "Supabase Storage" : "Local Storage"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 font-bold text-sm cursor-pointer transition-all duration-100"
              style={{
                border: `3px solid ${BRUTAL_BLACK}`,
                boxShadow: `4px 4px 0px ${MINT}`,
                background: MINT,
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                e.currentTarget.style.transform = "translate(2px, 2px)";
                e.currentTarget.style.boxShadow = `2px 2px 0px ${MINT}`;
              }}
              onMouseLeave={(e) => {
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                e.currentTarget.style.transform = "translate(0px, 0px)";
                e.currentTarget.style.boxShadow = `4px 4px 0px ${MINT}`;
              }}
            >
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

      {/* Upload progress bar */}
      {uploading && (
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <div className="w-full h-4" style={{ background: "#FFFFFF", border: `3px solid ${BRUTAL_BLACK}` }}>
            <div
              className="h-full transition-all duration-200"
              style={{
                width: `${uploadProgress}%`,
                background: MINT,
              }}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: MINT_DEEP }} />
            <span className="text-xs font-bold" style={{ color: BRUTAL_BLACK }}>
              Uploading... {uploadProgress}%
            </span>
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
                <BrutalCard>
                  <div
                    className="aspect-square relative overflow-hidden"
                    style={{ background: "#F8FAFC" }}
                  >
                    {item.type === "image" || item.type === "svg" ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
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
                          <span
                            className="inline-flex items-center justify-center w-8 h-8 cursor-pointer transition-all duration-100"
                            style={{
                              background: "#FFFFFF",
                              border: `2px solid ${BRUTAL_BLACK}`,
                              color: BRUTAL_BLACK,
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </span>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{item.name}</DialogTitle>
                          </DialogHeader>
                          <div className="flex items-center justify-center bg-gray-100 p-4 rounded-none" style={{ border: `3px solid ${BRUTAL_BLACK}` }}>
                            <img
                              src={item.url}
                              alt={item.name}
                              className="max-w-full max-h-[60vh] object-contain"
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Input
                              value={item.url}
                              readOnly
                              className="text-xs font-mono rounded-none"
                            />
                            <span
                              className="inline-flex items-center justify-center w-9 h-9 cursor-pointer"
                              style={{
                                border: `3px solid ${BRUTAL_BLACK}`,
                                background: "#FFFFFF",
                                color: BRUTAL_BLACK,
                              }}
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
                        style={{
                          background: "#DC2626",
                          border: `2px solid ${BRUTAL_BLACK}`,
                          color: "#FFFFFF",
                        }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5" style={{ borderTop: `2px solid ${BRUTAL_BLACK}` }}>
                    <p className="text-xs font-bold truncate" style={{ color: BRUTAL_BLACK }}>
                      {item.name}
                    </p>
                    <p className="text-xs font-medium" style={{ color: "#888" }}>
                      {(item.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </BrutalCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div
              className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
              style={{
                background: MINT_LIGHT,
                border: `4px solid ${BRUTAL_BLACK}`,
                boxShadow: `8px 8px 0px ${BRUTAL_BLACK}`,
              }}
            >
              <Image className="w-10 h-10" style={{ color: MINT_DEEP }} />
            </div>
            <h3 className="text-2xl font-black mb-3" style={{ color: BRUTAL_BLACK }}>
              No media yet
            </h3>
            <p className="font-medium mb-8 max-w-md mx-auto" style={{ color: "#666" }}>
              Upload images, videos, and SVGs to use in your website designs. Files are stored in Supabase Storage.
            </p>
            <span
              className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm cursor-pointer"
              style={{
                border: `4px solid ${BRUTAL_BLACK}`,
                boxShadow: `6px 6px 0px ${MINT}`,
                background: MINT,
                color: "#FFFFFF",
              }}
            >
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
