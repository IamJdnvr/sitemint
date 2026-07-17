"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Globe,
  FileText,
  MoreHorizontal,
  Copy,
  Trash2,
  Edit3,
  ExternalLink,
  Clock,
  Eye,
  BarChart3,
  LogOut,
  Settings,
  Layout,
  FilePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Website } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }
    loadWebsites();
  }, [user, authLoading]);

  const loadWebsites = async () => {
    // For MVP, we'll use localStorage
    try {
      const stored = localStorage.getItem("sitemint_websites");
      if (stored) {
        setWebsites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading websites:", e);
    }
    setLoading(false);
  };

  const saveWebsites = (updated: Website[]) => {
    setWebsites(updated);
    localStorage.setItem("sitemint_websites", JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = websites.filter((w) => w.id !== id);
    saveWebsites(updated);
    toast({
      title: "Website deleted",
      description: "The website has been removed permanently.",
    });
  };

  const handleDuplicate = (website: Website) => {
    const duplicate: Website = {
      ...website,
      id: crypto.randomUUID(),
      name: `${website.name} (Copy)`,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_url: undefined,
      published_at: undefined,
      visitor_count: 0,
    };
    const updated = [...websites, duplicate];
    saveWebsites(updated);
    toast({
      title: "Website duplicated",
      description: `"${duplicate.name}" has been created.`,
    });
  };

  const handleRename = (id: string, newName: string) => {
    const updated = websites.map((w) =>
      w.id === id ? { ...w, name: newName, updated_at: new Date().toISOString() } : w
    );
    saveWebsites(updated);
  };

  const filteredWebsites = websites.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.business_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const draftWebsites = filteredWebsites.filter((w) => w.status === "draft");
  const publishedWebsites = filteredWebsites.filter(
    (w) => w.status === "published"
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold text-gray-900">SiteMint</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600"
          >
            <Layout className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/create"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <FilePlus className="w-5 h-5" />
            New Website
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.display_name || user?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">
                Dashboard
              </h1>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search websites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/create">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Website</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
                className="lg:hidden"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Websites",
                value: websites.length,
                icon: Globe,
                color: "text-blue-600 bg-blue-100",
              },
              {
                label: "Published",
                value: publishedWebsites.length,
                icon: Eye,
                color: "text-green-600 bg-green-100",
              },
              {
                label: "Drafts",
                value: draftWebsites.length,
                icon: FileText,
                color: "text-amber-600 bg-amber-100",
              },
              {
                label: "Total Visits",
                value: websites.reduce(
                  (acc, w) => acc + (w.visitor_count || 0),
                  0
                ),
                icon: BarChart3,
                color: "text-purple-600 bg-purple-100",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
                      >
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Drafts */}
          {draftWebsites.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Draft Websites
              </h2>
              <div className="grid gap-4">
                {draftWebsites.map((website, i) => (
                  <WebsiteCard
                    key={website.id}
                    website={website}
                    index={i}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onRename={handleRename}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Published */}
          {publishedWebsites.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Published Websites
              </h2>
              <div className="grid gap-4">
                {publishedWebsites.map((website, i) => (
                  <WebsiteCard
                    key={website.id}
                    website={website}
                    index={i}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onRename={handleRename}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {filteredWebsites.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Layout className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery
                  ? "No websites found"
                  : "Welcome to SiteMint!"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "Try a different search term."
                  : "Create your first website in minutes. No coding required."}
              </p>
              {!searchQuery && (
                <Link href="/dashboard/create">
                  <Button size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Create Your First Website
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

function WebsiteCard({
  website,
  index,
  onDelete,
  onDuplicate,
  onRename,
}: {
  website: Website;
  index: number;
  onDelete: (id: string) => void;
  onDuplicate: (w: Website) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState(website.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="dashboard-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  website.status === "published"
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {website.status === "published" ? (
                  <Globe className="w-5 h-5" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {website.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {website.status === "published"
                    ? `Published ${new Date(website.published_at || "").toLocaleDateString()}`
                    : `Last edited ${new Date(website.updated_at).toLocaleDateString()}`}
                </p>
              </div>
              {website.status === "published" && website.published_url && (
                <a
                  href={`https://${website.published_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  View site
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/builder?id=${website.id}`}>
                <Button variant="outline" size="sm">
                  {website.status === "published" ? "Edit" : "Continue"}
                </Button>
              </Link>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Website Actions</DialogTitle>
                    <DialogDescription>
                      Manage your website settings
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <Edit3 className="w-5 h-5 text-gray-500" />
                      <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 text-sm bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none pb-1"
                        placeholder="Website name"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          onRename(website.id, newName);
                          setIsOpen(false);
                        }}
                      >
                        Rename
                      </Button>
                    </div>
                    <button
                      onClick={() => {
                        onDuplicate(website);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Copy className="w-5 h-5 text-gray-500" />
                      <span className="text-sm">Duplicate</span>
                    </button>
                    <button
                      onClick={() => {
                        onDelete(website.id);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-red-600">Delete</span>
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
