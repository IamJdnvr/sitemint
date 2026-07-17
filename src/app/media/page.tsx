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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { generateId } from "@/lib/uuid";
import type { MediaItem } from "@/types";

export default function MediaLibraryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }
    loadMedia();
  }, [user, authLoading]);

  const loadMedia = () => {
    try {
      const stored = localStorage.getItem("sitemint_media");
      if (stored) {
        setMediaItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading media:", e);
    }
    setLoading(false);
  };

  const saveMedia = (items: MediaItem[]) => {
    setMediaItems(items);
    localStorage.setItem("sitemint_media", JSON.stringify(items));
  };

  const TOTAL_QUOTA = 4 * 1024 * 1024; // 4MB total limit for localStorage
  const MAX_FILE_SIZE = 500 * 1024; // 500KB per file

  const getStorageUsed = () => {
    let total = 0;
    for (const item of mediaItems) {
      total += item.url.length * 0.75; // Approximate for base64
    }
    return total;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentUsage = getStorageUsed();

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: `File too large: ${file.name}`,
          description: `Maximum file size is ${MAX_FILE_SIZE / 1024}KB. Your file is ${(file.size / 1024).toFixed(1)}KB.`,
          variant: "destructive",
        });
        continue;
      }

      const estimatedSize = file.size * 1.37; // base64 overhead
      if (currentUsage + estimatedSize > TOTAL_QUOTA) {
        toast({
          title: "Storage limit reached",
          description: `You've used ${(currentUsage / 1024 / 1024).toFixed(1)}MB of ${TOTAL_QUOTA / 1024 / 1024}MB. Delete some files or use Supabase storage for larger needs.`,
          variant: "destructive",
        });
        break;
      }
    }

    setUploading(true);
    const newItems: MediaItem[] = [];
    let quotaWarning = false;

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) continue;

      try {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });

        const type = file.type.startsWith("video")
          ? "video"
          : file.type.includes("svg")
          ? "svg"
          : "image";

        newItems.push({
          id: generateId(),
          user_id: user?.id || "local",
          name: file.name,
          url: dataUrl,
          type: type as "image" | "video" | "svg",
          size: file.size,
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        toast({
          title: `Failed to read: ${file.name}`,
          variant: "destructive",
        });
      }
    }

    if (newItems.length > 0) {
      saveMedia([...newItems, ...mediaItems]);
      const newUsage = currentUsage + newItems.reduce((acc, item) => acc + item.url.length * 0.75, 0);

      if (newUsage > TOTAL_QUOTA * 0.8) {
        toast({
          title: `Storage at ${(newUsage / 1024 / 1024).toFixed(1)}MB / ${TOTAL_QUOTA / 1024 / 1024}MB`,
          description: "Consider using Supabase storage for larger files.",
          variant: "default",
        });
      } else {
        toast({
          title: `${newItems.length} file(s) uploaded`,
          variant: "success",
        });
      }
    }

    setUploading(false);
    // Reset input
    e.target.value = "";
  };

  const handleDelete = (id: string) => {
    const updated = mediaItems.filter((m) => m.id !== id);
    saveMedia(updated);
    toast({ title: "File deleted" });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-6 h-6" />;
      case "video":
        return <FileVideo className="w-6 h-6" />;
      case "svg":
        return <FileCode className="w-6 h-6" />;
      default:
        return <Image className="w-6 h-6" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
          </div>
          <div>
            <Button asChild className="gap-2">
              <label className="cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload Files
                <input
                  type="file"
                  accept="image/*,video/*,.svg"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {uploading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Uploading...</span>
          </div>
        )}

        {mediaItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="overflow-hidden group">
                  <div className="aspect-square bg-gray-100 relative">
                    {item.type === "image" || item.type === "svg" ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {getIcon(item.type)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="w-8 h-8"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{item.name}</DialogTitle>
                          </DialogHeader>
                          <div className="flex items-center justify-center bg-gray-100 rounded-xl p-4">
                            <img
                              src={item.url}
                              alt={item.name}
                              className="max-w-full max-h-[60vh] object-contain rounded-lg"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              value={item.url}
                              readOnly
                              className="text-xs font-mono"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(item.url);
                                toast({ title: "URL copied!" });
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="w-8 h-8"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-2">
                    <p className="text-xs text-gray-600 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(item.size / 1024).toFixed(1)} KB
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Image className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No media yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Upload images, videos, and SVGs to use in your website designs.
            </p>
            <Button asChild>
              <label className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
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
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
