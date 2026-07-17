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
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
    try {
      const stored = localStorage.getItem("sitemint_websites");
      if (stored) setWebsites(JSON.parse(stored));
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
    saveWebsites(websites.filter((w) => w.id !== id));
    toast({ title: "Website deleted", description: "The website has been removed permanently." });
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
    saveWebsites([...websites, duplicate]);
    toast({ title: "Website duplicated", description: `"${duplicate.name}" created.` });
  };

  const handleRename = (id: string, newName: string) => {
    saveWebsites(websites.map((w) => (w.id === id ? { ...w, name: newName, updated_at: new Date().toISOString() } : w)));
  };

  const filteredWebsites = websites.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.business_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const draftWebsites = filteredWebsites.filter((w) => w.status === "draft");
  const publishedWebsites = filteredWebsites.filter((w) => w.status === "published");

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center brutal-bg-light">
        <div className="animate-spin rounded-full h-8 w-8" style={{ border: "3px solid var(--mint-light)", borderTopColor: "var(--mint)" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen brutal-bg-light">
      {/* ─── Sidebar ─────────────────────────────── */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 brutal-bg-white brutal-border-3 hidden lg:flex flex-col z-20"
        style={{ borderLeft: "none", borderTop: "none", borderBottom: "none" }}>
        <div className="p-6 brutal-divider-bottom">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 brutal-bg-mint brutal-border-3 brutal-monogram text-lg">S</div>
            <span className="text-lg font-black brutal-text-dark">
              Site<span className="brutal-text-mint">Mint</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-black brutal-bg-mint text-white brutal-border-3"
            style={{ boxShadow: "4px 4px 0px var(--brutal-black)" }}>
            <Layout className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/create"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold brutal-text-dark hover:brutal-bg-light brutal-border-3"
            style={{ borderColor: "transparent" }}>
            <FilePlus className="w-5 h-5" />
            New Website
          </Link>
          <Link href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold brutal-text-dark hover:brutal-bg-light brutal-border-3"
            style={{ borderColor: "transparent" }}>
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4" style={{ borderTop: "3px solid var(--brutal-black)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 brutal-bg-mint brutal-border-3 brutal-monogram text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black brutal-text-dark truncate">
                {user?.display_name || user?.email?.split("@")[0]}
              </p>
              <p className="text-xs font-bold truncate brutal-text-muted">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main content ──────────────────────────── */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="px-6 py-4 brutal-bg-white brutal-divider-bottom">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-2xl font-black brutal-text-dark hidden sm:block">Dashboard</h1>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 brutal-text-muted" />
                <Input
                  placeholder="Search websites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  style={{ borderRadius: 0, border: "3px solid var(--brutal-black)" }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/create">
                <span className="brutal-btn brutal-btn-sm brutal-btn-mint">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Website</span>
                </span>
              </Link>
              <button
                onClick={() => { signOut(); router.push("/"); }}
                className="lg:hidden flex items-center justify-center w-10 h-10 brutal-border-3 brutal-bg-white brutal-text-dark"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* ─── Stats ────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { label: "Total Websites", value: websites.length, icon: Globe, color: "var(--mint)" },
              { label: "Published", value: publishedWebsites.length, icon: Eye, color: "var(--mint-deep)" },
              { label: "Drafts", value: draftWebsites.length, icon: FileText, color: "#D97706" },
              { label: "Total Visits", value: websites.reduce((acc, w) => acc + (w.visitor_count || 0), 0), icon: BarChart3, color: "#8B5CF6" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="brutal-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold brutal-text-muted">{stat.label}</p>
                      <p className="text-3xl font-black mt-1 brutal-text-dark">{stat.value}</p>
                    </div>
                    <div
                      className="w-12 h-12 brutal-border-3 flex items-center justify-center"
                      style={{ background: `${stat.color}20`, color: stat.color }}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ─── Drafts ───────────────────────────── */}
          {draftWebsites.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="brutal-badge brutal-badge-mint">DRAFTS</span>
                <h2 className="text-lg font-black brutal-text-dark">{draftWebsites.length} Website{draftWebsites.length !== 1 ? "s" : ""}</h2>
              </div>
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

          {/* ─── Published ────────────────────────── */}
          {publishedWebsites.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="brutal-badge" style={{ background: "var(--mint-deep)", color: "#ffffff" }}>PUBLISHED</span>
                <h2 className="text-lg font-black brutal-text-dark">{publishedWebsites.length} Website{publishedWebsites.length !== 1 ? "s" : ""}</h2>
              </div>
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

          {/* ─── Empty state ──────────────────────── */}
          {filteredWebsites.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <div
                className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: "var(--mint-light)",
                  border: "4px solid var(--brutal-black)",
                  boxShadow: "8px 8px 0px var(--brutal-black)",
                }}
              >
                {searchQuery ? (
                  <Search className="w-10 h-10" style={{ color: "var(--mint-deep)" }} />
                ) : (
                  <Sparkles className="w-10 h-10" style={{ color: "var(--mint-deep)" }} />
                )}
              </div>
              <h3 className="text-2xl font-black mb-3 brutal-text-dark">
                {searchQuery ? "No websites found" : "Welcome to SiteMint!"}
              </h3>
              <p className="font-medium mb-8 max-w-md mx-auto brutal-text-muted">
                {searchQuery
                  ? "Try a different search term."
                  : "Create your first website in minutes. No coding required."}
              </p>
              {!searchQuery && (
                <Link href="/dashboard/create">
                  <span className="brutal-btn brutal-btn-mint brutal-btn-lg">
                    <Plus className="w-5 h-5" />
                    Create Your First Website
                  </span>
                </Link>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── Website Card ───────────────────────────────────────────────

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

  const isPublished = website.status === "published";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="brutal-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Status icon */}
            <div
              className="w-12 h-12 brutal-border-3 flex items-center justify-center"
              style={{
                background: isPublished ? "#D1FAE5" : "#FEF3C7",
                color: isPublished ? "var(--mint-deep)" : "#D97706",
              }}
            >
              {isPublished ? <Globe className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-black brutal-text-dark truncate">{website.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className="w-3.5 h-3.5 brutal-text-muted" />
                <p className="text-sm font-bold brutal-text-muted">
                  {isPublished
                    ? `Published ${new Date(website.published_at || "").toLocaleDateString()}`
                    : `Edited ${new Date(website.updated_at).toLocaleDateString()}`}
                </p>
              </div>
            </div>

            {/* Published URL */}
            {isPublished && website.published_url && (
              <a
                href={`https://${website.published_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 text-sm font-bold"
                style={{ color: "var(--mint-deep)" }}
              >
                <ExternalLink className="w-4 h-4" />
                View site
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href={`/builder?id=${website.id}`}>
              <span className={`brutal-btn brutal-btn-sm ${isPublished ? "" : "brutal-btn-mint"}`}>
                {isPublished ? "Edit" : "Continue"}
              </span>
            </Link>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center w-10 h-10 brutal-border-3 brutal-bg-white brutal-text-dark">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Website Actions</DialogTitle>
                  <DialogDescription>Manage your website settings</DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  {/* Rename */}
                  <div className="flex items-center gap-3 p-3" style={{ border: "3px solid var(--brutal-black)" }}>
                    <Edit3 className="w-5 h-5" style={{ color: "var(--mint-deep)" }} />
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 text-sm font-bold bg-transparent outline-none"
                      style={{ borderBottom: "2px solid var(--brutal-black)" }}
                      placeholder="Website name"
                    />
                    <span
                      className="brutal-btn brutal-btn-sm cursor-pointer"
                      onClick={() => {
                        onRename(website.id, newName);
                        setIsOpen(false);
                      }}
                    >
                      Rename
                    </span>
                  </div>

                  {/* Duplicate */}
                  <button
                    onClick={() => { onDuplicate(website); setIsOpen(false); }}
                    className="flex items-center gap-3 w-full p-3 brutal-border-3 brutal-bg-white brutal-text-dark cursor-pointer"
                  >
                    <Copy className="w-5 h-5" style={{ color: "var(--mint-deep)" }} />
                    <span className="text-sm font-bold">Duplicate</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => { onDelete(website.id); setIsOpen(false); }}
                    className="flex items-center gap-3 w-full p-3 cursor-pointer"
                    style={{ border: "3px solid #DC2626", color: "#DC2626" }}
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-sm font-bold">Delete</span>
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
