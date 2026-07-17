"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { Undo2,
  Redo2,
  Save,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Globe,
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  Image,
  Type,
  Layout,
  Palette,
  Layers,
  PanelRightOpen,
  PanelRightClose,
  Sun,
  Moon,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Website, Page, Section, SectionType, SectionContent, SectionStyles, ContactSubmission } from "@/types";
import { sectionTypes } from "@/lib/templates";
import { generateId } from "@/lib/uuid";
import { ThemeEditor } from "@/components/builder/ThemeEditor";
import { ContactForm } from "@/components/builder/ContactForm";
import * as Tabs from "@radix-ui/react-tabs";

// Dynamic section renderer (simplified for MVP)
function SectionRenderer({ section, buttonStyle, darkMode, onContactSubmit }: { section: Section; buttonStyle?: string; darkMode?: boolean; onContactSubmit?: (name: string, email: string, phone: string, message: string) => void }) {
  const content = section.content;
  const styles = section.styles;

  const getBtnClass = (defaultClass: string) => {
    const styleMap: Record<string, string> = {
      rounded: "rounded-lg",
      pill: "rounded-full",
      square: "rounded-none",
    };
    const btnStyle = buttonStyle || "rounded";
    return defaultClass.replace(/rounded-\w+/g, styleMap[btnStyle] || "rounded-lg");
  };

  switch (section.type) {
    case "navbar":
      return (
        <nav
          className="flex items-center justify-between px-6 py-4"
          style={{
            backgroundColor: styles.background_color || "transparent",
            padding: styles.padding,
          }}
        >
          <div className="text-xl font-bold">{content.logo_text || "Logo"}</div>
          <div className="hidden md:flex items-center gap-6">
            {content.links?.map((link: any, i: number) => (
              <a key={i} href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                {link.label}
              </a>
            ))}
          </div>              {content.cta_button && (
            <button
              className={`px-4 py-2 text-sm font-medium text-white ${getBtnClass("rounded-full")}`}
              style={{ backgroundColor: "var(--primary-color, #2563EB)" }}
            >
              {content.cta_button.label}
            </button>
          )}
        </nav>
      );
    case "hero":
      return (
        <section
          className="relative px-6 overflow-hidden"
          style={{
            padding: styles.padding,
            backgroundColor: styles.background_color || "#0F172A",
            textAlign: styles.text_alignment || "center",
          }}
        >
          {content.overlay && (
            <div className="absolute inset-0 bg-black/40" />
          )}
          <div className="relative max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 whitespace-pre-line">
              {content.headline || "Your Headline Here"}
            </h1>
            {content.subheadline && (
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {content.subheadline}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {content.primary_button && (
                <button className={`px-6 py-3 text-sm font-medium text-white ${getBtnClass("rounded-lg")}`} style={{ backgroundColor: "var(--primary-color, #2563EB)" }}>
                  {content.primary_button.label}
                </button>
              )}
              {content.secondary_button && (
                <button className={`px-6 py-3 text-sm font-medium border border-white text-white hover:bg-white/10 ${getBtnClass("rounded-lg")}`}>
                  {content.secondary_button.label}
                </button>
              )}
            </div>
          </div>
        </section>
      );
    case "features":
      return (
        <section
          className="px-6"
          style={{
            padding: styles.padding,
            backgroundColor: styles.background_color || "#FFFFFF",
          }}
        >
          <div className="max-w-6xl mx-auto">
            {content.headline && (
              <h2 className="text-3xl font-bold text-center mb-12">{content.headline}</h2>
            )}
            <div className="grid md:grid-cols-3 gap-8">
              {content.items?.map((item: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--secondary-color, #EFF6FF)" }}>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: "var(--primary-color, #2563EB)" }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "about":
      return (
        <section
          className="px-6"
          style={{
            padding: styles.padding,
            backgroundColor: styles.background_color || "#F8FAFC",
          }}
        >
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">{content.headline || "About Us"}</h2>
              <p className="text-gray-600 leading-relaxed">{content.body || "Your about content here."}</p>
              {content.stats && (
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {content.stats.map((stat: any, i: number) => (
                    <div key={i}>
                      <p className="text-2xl font-bold" style={{ color: "var(--primary-color, #2563EB)" }}>{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
              {content.image_url ? (
                <img src={content.image_url} alt="About" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Image className="w-12 h-12" />
              )}
            </div>
          </div>
        </section>
      );
    case "services":
      return (
        <section
          className="px-6"
          style={{
            padding: styles.padding,
            backgroundColor: styles.background_color || "#FFFFFF",
          }}
        >
          <div className="max-w-6xl mx-auto">
            {content.headline && <h2 className="text-3xl font-bold text-center mb-12">{content.headline}</h2>}
            <div className="grid md:grid-cols-3 gap-6">
              {content.items?.map((item: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "contact":
      return (
        <section
          className="px-6"
          style={{
            padding: styles.padding,
            backgroundColor: styles.background_color || "#FFFFFF",
          }}
        >
          <div className="max-w-2xl mx-auto">
            {content.headline && <h2 className="text-3xl font-bold text-center mb-4">{content.headline}</h2>}
            {content.email && (
              <p className="text-center text-gray-600 mb-8">{content.email}</p>
            )}
            {content.show_form && onContactSubmit && (
              <ContactForm
                onContactSubmit={onContactSubmit}
                buttonStyle={buttonStyle}
                primaryColor="var(--primary-color, #2563EB)"
              />
            )}
          </div>
        </section>
      );
    case "footer":
      return (
        <footer
          className="px-6"
          style={{
            padding: styles.padding,
            backgroundColor: styles.background_color || "#0F172A",
          }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-2">{content.logo_text || "Logo"}</h3>
            {content.description && (
              <p className="text-gray-400 mb-4">{content.description}</p>
            )}
            {content.social_links && (
              <div className="flex items-center justify-center gap-4 mb-6">
                {content.social_links.map((link: any, i: number) => (
                  <a key={i} href={link.url} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
            {content.copyright && (
              <p className="text-sm text-gray-500">{content.copyright}</p>
            )}
          </div>
        </footer>
      );
    case "testimonials":
      return (
        <section
          className="px-6"
          style={{
            padding: styles.padding,
            backgroundColor: styles.background_color || "#FFFFFF",
          }}
        >
          <div className="max-w-4xl mx-auto">
            {content.headline && <h2 className="text-3xl font-bold text-center mb-12">{content.headline}</h2>}
            <div className="grid md:grid-cols-2 gap-6">
              {content.items?.slice(0, 2).map((item: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-gray-50">
                  <p className="text-gray-700 italic mb-4">"{item.quote}"</p>
                  <p className="font-semibold">{item.author}</p>
                  {item.role && <p className="text-sm text-gray-500">{item.role}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "gallery":
      return (
        <section
          className="px-6"
          style={{
            padding: styles.padding,
            backgroundColor: styles.background_color || "#F8FAFC",
          }}
        >
          <div className="max-w-6xl mx-auto">
            {content.headline && <h2 className="text-3xl font-bold text-center mb-12">{content.headline}</h2>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(content.images || Array(6).fill("")).map((_: any, i: number) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  <Image className="w-8 h-8" />
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "faq":
      return (
        <section
          className="px-6"
          style={{
            padding: styles.padding,
            backgroundColor: styles.background_color || "#FFFFFF",
          }}
        >
          <div className="max-w-3xl mx-auto">
            {content.headline && <h2 className="text-3xl font-bold text-center mb-12">{content.headline}</h2>}
            <div className="space-y-4">
              {content.items?.map((item: any, i: number) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between p-4 rounded-xl bg-gray-50 cursor-pointer font-medium">
                    {item.question}
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="p-4 text-gray-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );
    case "spacer":
      return <div style={{ height: styles.padding || "60px" }} />;
    case "divider":
      return (
        <div className="px-6" style={{ padding: styles.padding || "30px 0" }}>
          <hr className="border-gray-200" />
        </div>
      );
    default:
      return <div className="p-6 text-gray-400">Unknown section type</div>;
  }
}

function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const websiteId = searchParams.get("id");

  const [website, setWebsite] = useState<Website | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showProperties, setShowProperties] = useState(true);
  const [showSectionPanel, setShowSectionPanel] = useState(true);
  const [history, setHistory] = useState<Website[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [pageSelectorOpen, setPageSelectorOpen] = useState(false);
  const [renamingPage, setRenamingPage] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState("");
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  // Load website
  useEffect(() => {
    if (!websiteId) {
      router.push("/dashboard");
      return;
    }
    const stored = localStorage.getItem("sitemint_websites");
    if (stored) {
      const websites: Website[] = JSON.parse(stored);
      const found = websites.find((w) => w.id === websiteId);
      if (found) {
        setWebsite(found);
        setCurrentPage(found.pages[0] || null);
        setHistory([structuredClone(found)]);
        setHistoryIndex(0);
      }
    }
  }, [websiteId]);

  // Autosave
  useEffect(() => {
    if (!website) return;
    if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    autoSaveTimer.current = setInterval(() => {
      saveToStorage(false);
    }, 15000);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [website]);

  const saveToStorage = (showToast = true) => {
    if (!website) return;
    const stored = localStorage.getItem("sitemint_websites");
    if (stored) {
      const websites: Website[] = JSON.parse(stored);
      const index = websites.findIndex((w) => w.id === website.id);
      if (index >= 0) {
        websites[index] = { ...website, updated_at: new Date().toISOString() };
        localStorage.setItem("sitemint_websites", JSON.stringify(websites));
        if (showToast) {
          toast({ title: "Saved!", variant: "success" });
        }
      }
    }
  };

  const addToHistory = (updatedWebsite: Website) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(structuredClone(updatedWebsite));
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0 && history[historyIndex - 1]) {
      const prev = structuredClone(history[historyIndex - 1]);
      setWebsite(prev);
      setCurrentPage(prev.pages.find((p: Page) => p.id === currentPage?.id) || prev.pages[0]);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && history[historyIndex + 1]) {
      const next = structuredClone(history[historyIndex + 1]);
      setWebsite(next);
      setCurrentPage(next.pages.find((p: Page) => p.id === currentPage?.id) || next.pages[0]);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const updateCurrentPage = (sections: Section[]) => {
    if (!website || !currentPage) return;
    const updatedPage = { ...currentPage, sections, updated_at: new Date().toISOString() };
    const updatedPages = website.pages.map((p) => (p.id === currentPage.id ? updatedPage : p));
    const updatedWebsite = { ...website, pages: updatedPages, updated_at: new Date().toISOString() };
    setWebsite(updatedWebsite);
    setCurrentPage(updatedPage);
    addToHistory(updatedWebsite);
  };

  const addSection = (type: SectionType) => {
    if (!currentPage) return;
    const newSection: Section = {
      id: generateId(),
      page_id: currentPage.id,
      type,
      sort_order: currentPage.sections.length,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      visibility: true,
    };
    const sections = [...currentPage.sections, newSection];
    updateCurrentPage(sections);
    setSelectedSection(newSection.id);
    toast({ title: "Section added", description: `${type} section added to page.` });
  };

  const removeSection = (id: string) => {
    if (!currentPage) return;
    const sections = currentPage.sections.filter((s) => s.id !== id);
    updateCurrentPage(sections);
    setSelectedSection(null);
    toast({ title: "Section removed" });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !currentPage || active.id === over.id) return;
    const oldIndex = currentPage.sections.findIndex((s) => s.id === active.id);
    const newIndex = currentPage.sections.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const sections = arrayMove(currentPage.sections, oldIndex, newIndex).map((s, i) => ({
      ...s,
      sort_order: i,
    }));
    updateCurrentPage(sections);
  };

  const updateWebsiteInStorage = (updatedWebsite: Website) => {
    const stored = localStorage.getItem("sitemint_websites");
    if (stored) {
      const websites: Website[] = JSON.parse(stored);
      const idx = websites.findIndex((w) => w.id === updatedWebsite.id);
      if (idx >= 0) {
        websites[idx] = updatedWebsite;
        localStorage.setItem("sitemint_websites", JSON.stringify(websites));
      }
    }
  };

  const handleContactSubmit = (name: string, email: string, phone: string, message: string) => {
    if (!website || !currentPage) return;
    const submission: ContactSubmission = {
      id: generateId(),
      website_id: website.id,
      page_id: currentPage.id,
      name,
      email,
      phone: phone || undefined,
      message,
      created_at: new Date().toISOString(),
    };
    const stored = localStorage.getItem("sitemint_submissions");
    const submissions: ContactSubmission[] = stored ? JSON.parse(stored) : [];
    submissions.push(submission);
    localStorage.setItem("sitemint_submissions", JSON.stringify(submissions));
    toast({ title: "Message sent! ✅", description: "We'll get back to you soon.", variant: "success" });
  };

  const handleThemeUpdate = (updates: Partial<Website>) => {
    if (!website) return;
    const updatedWebsite = { ...website, ...updates, updated_at: new Date().toISOString() };
    setWebsite(updatedWebsite);
    addToHistory(updatedWebsite);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!website || !currentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading builder...</p>
        </div>
      </div>
    );
  }

  const selectedSectionData = currentPage.sections.find((s) => s.id === selectedSection);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Toolbar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white z-20">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <span className="font-semibold text-gray-900 truncate max-w-[140px] text-sm">
            {website.name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            website.status === "published"
              ? "bg-green-100 text-green-700"
              : website.status === "unpublished"
              ? "bg-gray-100 text-gray-600"
              : "bg-amber-100 text-amber-700"
          }`}>
            {website.status === "published" ? "Published" : website.status === "unpublished" ? "Unpublished" : "Draft"}
          </span>
          {/* Page selector */}
          <div className="relative">
            <button
              onClick={() => setPageSelectorOpen(!pageSelectorOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Layout className="w-3.5 h-3.5" />
              <span>{currentPage?.name || "Page"}</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {pageSelectorOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-30">
                {website.pages.map((page) => (
                  <div key={page.id} className="flex items-center gap-1 px-2">
                    {renamingPage === page.id ? (
                      <input
                        value={renamingValue}
                        onChange={(e) => setRenamingValue(e.target.value)}
                        onBlur={() => {
                          if (renamingValue.trim()) {
                            const updatedPages = website.pages.map((p) =>
                              p.id === page.id ? { ...p, name: renamingValue, slug: renamingValue.toLowerCase().replace(/\s+/g, "-") } : p
                            );
                            const updatedWebsite = { ...website, pages: updatedPages };
                            setWebsite(updatedWebsite);
                            addToHistory(updatedWebsite);
                          }
                          setRenamingPage(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          if (e.key === "Escape") setRenamingPage(null);
                        }}
                        className="flex-1 text-sm px-2 py-1.5 border rounded outline-none"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => {
                          setCurrentPage(page);
                          setPageSelectorOpen(false);
                        }}
                        className={`flex-1 text-left text-sm px-2 py-1.5 rounded transition-colors ${
                          currentPage?.id === page.id
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page.name}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setRenamingPage(page.id);
                        setRenamingValue(page.name);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    {website.pages.length > 1 && (
                      <button
                        onClick={() => {
                          const updatedPages = website.pages.filter((p) => p.id !== page.id);
                          const updatedWebsite = { ...website, pages: updatedPages };
                          setWebsite(updatedWebsite);
                          addToHistory(updatedWebsite);
                          if (currentPage?.id === page.id) {
                            setCurrentPage(updatedPages[0] || null);
                          }
                          setPageSelectorOpen(false);
                          toast({ title: "Page deleted" });
                        }}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      const newPage: Page = {
                        id: generateId(),
                        website_id: website.id,
                        name: `Page ${website.pages.length + 1}`,
                        slug: `page-${website.pages.length + 1}`,
                        sort_order: website.pages.length,
                        sections: [],
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      };
                      const updatedWebsite = {
                        ...website,
                        pages: [...website.pages, newPage],
                      };
                      setWebsite(updatedWebsite);
                      setCurrentPage(newPage);
                      addToHistory(updatedWebsite);
                      setPageSelectorOpen(false);
                      toast({ title: "Page added", description: `"${newPage.name}" created.` });
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <Button variant="ghost" size="sm" onClick={() => saveToStorage(true)}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            {(["desktop", "tablet", "mobile"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                className={`p-2 transition-colors ${
                  previewMode === mode
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title={mode.charAt(0).toUpperCase() + mode.slice(1)}
              >
                {mode === "desktop" ? (
                  <Monitor className="w-4 h-4" />
                ) : mode === "tablet" ? (
                  <Tablet className="w-4 h-4" />
                ) : (
                  <Smartphone className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          {website.status === "published" || website.status === "unpublished" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  saveToStorage(false);
                  const updatedWebsite = { ...website, status: "published" as const, published_at: new Date().toISOString(), published_url: `${website.name.toLowerCase().replace(/\s+/g, "-")}.sitemint.app` };
                  setWebsite(updatedWebsite);
                  updateWebsiteInStorage(updatedWebsite);
                  toast({ title: "Published! 🎉", description: `Your site is live at ${updatedWebsite.published_url}`, variant: "success" });
                }}
              >
                <Globe className="w-4 h-4 mr-1" />
                Republish
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-500"
                onClick={() => {
                  const updatedWebsite = { ...website, status: "unpublished" as const };
                  setWebsite(updatedWebsite);
                  updateWebsiteInStorage(updatedWebsite);
                  addToHistory(updatedWebsite);
                  toast({ title: "Unpublished", description: "Your site is no longer live." });
                }}
              >
                Unpublish
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                saveToStorage(false);
                const updatedWebsite = { ...website, status: "published" as const, published_at: new Date().toISOString(), published_url: `${website.name.toLowerCase().replace(/\s+/g, "-")}.sitemint.app` };
                setWebsite(updatedWebsite);
                updateWebsiteInStorage(updatedWebsite);
                toast({ title: "Published! 🎉", description: `Your site is live at ${updatedWebsite.published_url}`, variant: "success" });
              }}
            >
              <Globe className="w-4 h-4 mr-1" />
              Publish
            </Button>
          )}
        </div>
      </header>

      {/* Builder Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Sections */}
        <AnimatePresence>
          {showSectionPanel && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-gray-200 bg-gray-50 overflow-y-auto flex-shrink-0"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Sections</h3>
                  <button
                    onClick={() => setShowSectionPanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <PanelRightClose className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  {sectionTypes.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => addSection(st.id as SectionType)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-white transition-all group"
                    >
                      <span className="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <Plus className="w-3 h-3" />
                      </span>
                      <span className="capitalize">{st.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {!showSectionPanel && (
          <button
            onClick={() => setShowSectionPanel(true)}
            className="fixed left-4 top-20 z-10 w-10 h-10 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:shadow-lg transition-all"
          >
            <Layers className="w-5 h-5" />
          </button>
        )}

        {/* Center - Preview */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div
            className={`min-h-full flex justify-center ${
              website.dark_mode ? "dark" : ""
            }`}
            style={{
              fontFamily: website.font_family || "Inter",
              "--primary-color": website.primary_color || "#2563EB",
              "--secondary-color": website.secondary_color || "#EFF6FF",
            } as React.CSSProperties}
          >
            <div
              className={`bg-white shadow-lg my-8 ${
                previewMode === "desktop"
                  ? "w-full max-w-5xl"
                  : previewMode === "tablet"
                  ? "w-[768px]"
                  : "w-[375px]"
              }`}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={currentPage.sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {currentPage.sections.map((section, index) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      buttonStyle={website.button_style}
                      darkMode={website.dark_mode}
                      isSelected={selectedSection === section.id}
                      onSelect={() => setSelectedSection(section.id)}
                      onRemove={() => removeSection(section.id)}
                      onContactSubmit={handleContactSubmit}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {currentPage.sections.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Layout className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium mb-2">No sections yet</p>
                  <p className="text-sm">Add sections from the left panel</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Properties & Theme */}
        <AnimatePresence>
          {showProperties && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-200 bg-white overflow-y-auto flex-shrink-0"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Properties</h3>
                  <button
                    onClick={() => setShowProperties(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <PanelRightClose className="w-4 h-4" />
                  </button>
                </div>

                <Tabs.Root defaultValue={selectedSectionData ? "section" : "theme"} className="w-full">
                  <Tabs.List className="flex border-b border-gray-200 mb-4">
                    <Tabs.Trigger
                      value="section"
                      className="flex-1 pb-2 text-sm font-medium text-gray-500 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-colors"
                    >
                      Section
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="theme"
                      className="flex-1 pb-2 text-sm font-medium text-gray-500 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-colors"
                    >
                      Theme
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="section" className="outline-none">
                    {selectedSectionData ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {selectedSectionData.type}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeSection(selectedSectionData.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Background Color</Label>
                            <Input
                              type="text"
                              value={selectedSectionData.styles.background_color || "#FFFFFF"}
                                              onChange={(e) => {
                                const sections = currentPage.sections.map((s) =>
                                  s.id === selectedSectionData.id
                                    ? { ...s, styles: { ...s.styles, background_color: e.target.value } }
                                    : s
                                );
                                updateCurrentPage(sections);
                              }}
                              className="font-mono text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Headline</Label>
                            <Input
                              value={selectedSectionData.content.headline || ""}
                              onChange={(e) => {
                                const sections = currentPage.sections.map((s) =>
                                  s.id === selectedSectionData.id
                                    ? { ...s, content: { ...s.content, headline: e.target.value } }
                                    : s
                                );
                                updateCurrentPage(sections);
                              }}
                              className="text-sm"
                            />
                            <div className="flex gap-2 flex-wrap">
                              {["#FFFFFF", "#F8FAFC", "#EFF6FF", "#F0FDF4", "#FEF2F2", "#0F172A", "#1A0F07", "#F9F5F0"].map(
                                (color) => (
                                  <button
                                    key={color}
                                    onClick={() => {
                                      const sections = currentPage.sections.map((s) =>
                                        s.id === selectedSectionData.id
                                          ? { ...s, styles: { ...s.styles, background_color: color } }
                                          : s
                                      );
                                      updateCurrentPage(sections);
                                    }}
                                    className={`w-6 h-6 rounded-full border-2 ${
                                      selectedSectionData.styles.background_color === color
                                        ? "border-blue-600"
                                        : "border-transparent"
                                    }`}
                                    style={{ backgroundColor: color }}
                                  />
                                )
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Padding</Label>
                            <Input
                              value={selectedSectionData.styles.padding || "60px 0"}
                              onChange={(e) => {
                                const sections = currentPage.sections.map((s) =>
                                  s.id === selectedSectionData.id
                                    ? { ...s, styles: { ...s.styles, padding: e.target.value } }
                                    : s
                                );
                                updateCurrentPage(sections);
                              }}
                              className="text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Text Alignment</Label>
                            <div className="flex gap-2">
                              {(["left", "center", "right"] as const).map((align) => (
                                <button
                                  key={align}
                                  onClick={() => {
                                    const sections = currentPage.sections.map((s) =>
                                      s.id === selectedSectionData.id
                                        ? { ...s, styles: { ...s.styles, text_alignment: align } }
                                        : s
                                    );
                                    updateCurrentPage(sections);
                                  }}
                                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedSectionData.styles.text_alignment === align
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                >
                                  {align.charAt(0).toUpperCase() + align.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <Palette className="w-8 h-8 mx-auto mb-3" />
                        <p className="text-sm">Select a section to edit its properties</p>
                      </div>
                    )}
                  </Tabs.Content>

                  <Tabs.Content value="theme" className="outline-none">
                    <ThemeEditor
                      website={website}
                      onUpdate={handleThemeUpdate}
                    />
                  </Tabs.Content>
                </Tabs.Root>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {!showProperties && (
          <button
            onClick={() => setShowProperties(true)}
            className="fixed right-4 top-20 z-10 w-10 h-10 bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:shadow-lg transition-all"
          >
            <PanelRightOpen className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function SortableSection({
  section,
  buttonStyle,
  darkMode,
  isSelected,
  onSelect,
  onRemove,
  onContactSubmit,
}: {
  section: Section;
  buttonStyle?: string;
  darkMode?: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onContactSubmit?: (name: string, email: string, phone: string, message: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`builder-section relative group cursor-pointer ${
        isSelected ? "selected" : ""
      }`}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <div
        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <div className="w-6 h-8 bg-gray-100 rounded-l-lg flex items-center justify-center cursor-grab text-gray-400 hover:text-gray-600">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
      <SectionRenderer section={section} buttonStyle={buttonStyle} darkMode={darkMode} onContactSubmit={onContactSubmit} />
    </div>
  );
}

function getDefaultContent(type: SectionType): SectionContent {
  switch (type) {
    case "navbar":
      return {
        logo_text: "My Brand",
        links: [
          { label: "Home", href: "#" },
          { label: "About", href: "#about" },
          { label: "Contact", href: "#contact" },
        ],
      };
    case "hero":
      return {
        headline: "Your Headline Here",
        subheadline: "Your compelling subheadline goes here.",
        primary_button: { label: "Get Started", href: "#" },
        secondary_button: { label: "Learn More", href: "#" },
      };
    case "features":
      return {
        headline: "Features",
        items: [
          { icon: "Star", title: "Feature 1", description: "Description of feature 1" },
          { icon: "Star", title: "Feature 2", description: "Description of feature 2" },
          { icon: "Star", title: "Feature 3", description: "Description of feature 3" },
        ],
      };
    case "about":
      return { headline: "About Us", body: "Your about content here.", stats: [{ label: "Years", value: "10+" }, { label: "Clients", value: "100+" }, { label: "Projects", value: "500+" }] };
    case "services":
      return { headline: "Our Services", items: [{ icon: "Briefcase", title: "Service 1", description: "Description" }, { icon: "Briefcase", title: "Service 2", description: "Description" }, { icon: "Briefcase", title: "Service 3", description: "Description" }] };
    case "contact":
      return { headline: "Contact Us", email: "hello@example.com", show_form: true };
    case "footer":
      return { logo_text: "Brand", description: "Your tagline here.", social_links: [{ platform: "Facebook", url: "#" }, { platform: "Twitter", url: "#" }, { platform: "Instagram", url: "#" }], copyright: `© ${new Date().getFullYear()} All rights reserved.` };
    case "gallery":
      return { headline: "Gallery", images: Array(6).fill(""), columns: 3 };
    case "testimonials":
      return { headline: "Testimonials", items: [{ quote: "Great service!", author: "Happy Client", role: "Customer", rating: 5 }] };
    case "faq":
      return { headline: "FAQ", items: [{ question: "Question 1?", answer: "Answer 1" }, { question: "Question 2?", answer: "Answer 2" }] };
    case "spacer":
      return {};
    case "divider":
      return {};
    default:
      return {};
  }
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading builder...</p>
          </div>
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}

function getDefaultStyles(type: SectionType): SectionStyles {
  const base = { padding: "60px 0", text_alignment: "left" as const };
  switch (type) {
    case "navbar":
      return { ...base, padding: "16px 0", background_color: "#FFFFFF" };
    case "hero":
      return { ...base, padding: "100px 0", background_color: "#0F172A", text_alignment: "center" };
    case "footer":
      return { ...base, background_color: "#0F172A" };
    case "features":
      return { ...base, background_color: "#FFFFFF" };
    case "about":
      return { ...base, background_color: "#F8FAFC" };
    case "services":
      return { ...base, background_color: "#FFFFFF" };
    case "gallery":
      return { ...base, background_color: "#F8FAFC" };
    case "testimonials":
      return { ...base, background_color: "#FFFFFF" };
    case "faq":
      return { ...base, background_color: "#FFFFFF" };
    case "contact":
      return { ...base, background_color: "#FFFFFF" };
    case "spacer":
      return { padding: "60px 0" };
    case "divider":
      return { padding: "30px 0" };
    default:
      return base;
  }
}
