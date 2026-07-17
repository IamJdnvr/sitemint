"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Layout,
  Paintbrush,
  Globe,
  Zap,
  Shield,
  Smartphone,
  Check,
  Menu,
  X,
  Sparkles,
  Star,
  ChevronRight,
  Quote,
  Upload,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { storage, type StorageFile } from "@/lib/storage";

const BRUTAL_BLACK = "#0A0A0A";
const MINT = "#00D4AA";
const MINT_DEEP = "#059669";
const MINT_LIGHT = "#D1FAE5";
const BG_LIGHT = "#ECFDF5";

// ─── Default curated images (fallback when no uploaded images) ─

const DEFAULT_HERO = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80";

const DEFAULT_TEMPLATES = [
  { name: "Restaurant", tag: "Food & Drink", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80", color: MINT },
  { name: "Coffee Shop", tag: "Café", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&q=80", color: "#0D9488" },
  { name: "Salon & Spa", tag: "Beauty", img: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=300&q=80", color: "#8B5CF6" },
  { name: "Portfolio", tag: "Creative", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&q=80", color: "#3B82F6" },
  { name: "Freelancer", tag: "Services", img: "https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?w=300&q=80", color: MINT_DEEP },
  { name: "Agency", tag: "Business", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&q=80", color: "#7C3AED" },
  { name: "Small Business", tag: "Local", img: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=300&q=80", color: "#1D4ED8" },
  { name: "Landing Page", tag: "Marketing", img: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=300&q=80", color: "#DC2626" },
];

// ─── Components ─────────────────────────────────────────────────

function BrutalCard({
  children,
  className = "",
  mint = false,
}: {
  children: React.ReactNode;
  className?: string;
  mint?: boolean;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        border: `4px solid ${BRUTAL_BLACK}`,
        boxShadow: mint
          ? `8px 8px 0px ${MINT}`
          : `8px 8px 0px ${BRUTAL_BLACK}`,
        background: mint ? MINT : "#FFFFFF",
      }}
    >
      {children}
    </div>
  );
}

function BrutalButton({
  children,
  href,
  mint = false,
  className = "",
  size = "default",
}: {
  children: React.ReactNode;
  href: string;
  mint?: boolean;
  className?: string;
  size?: "default" | "lg";
}) {
  const base = size === "lg" ? "text-lg px-8 py-4" : "text-sm px-5 py-2.5";
  return (
    <Link href={href}>
      <span
        className={`inline-flex items-center gap-2 font-bold ${base} transition-all duration-100 ${className}`}
        style={{
          border: `4px solid ${BRUTAL_BLACK}`,
          boxShadow: mint ? `5px 5px 0px ${MINT}` : `5px 5px 0px ${BRUTAL_BLACK}`,
          background: mint ? MINT : "#FFFFFF",
          color: mint ? "#FFFFFF" : BRUTAL_BLACK,
        }}
        onMouseEnter={(e) => {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          e.currentTarget.style.transform = "translate(2px, 2px)";
          e.currentTarget.style.boxShadow = mint ? `3px 3px 0px ${MINT}` : `3px 3px 0px ${BRUTAL_BLACK}`;
        }}
        onMouseLeave={(e) => {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          e.currentTarget.style.transform = "translate(0px, 0px)";
          e.currentTarget.style.boxShadow = mint ? `5px 5px 0px ${MINT}` : `5px 5px 0px ${BRUTAL_BLACK}`;
        }}
      >
        {children}
      </span>
    </Link>
  );
}

function GeoDecoration({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg width="200" height="200" viewBox="0 0 200 200" className="w-full h-full">
        <polygon points="100,10 190,50 190,150 100,190 10,150 10,50" fill={MINT} opacity="0.15" />
        <polygon points="100,30 170,60 170,140 100,170 30,140 30,60" fill={MINT} opacity="0.1" />
        <rect x="40" y="40" width="120" height="120" fill={MINT_DEEP} opacity="0.08" transform="rotate(15 100 100)" />
      </svg>
    </div>
  );
}

// ─── Template image picker component ─────────────────────────

function ImagePicker({
  uploadedImages,
  onSelect,
  currentSrc,
  defaultSrc,
  label,
}: {
  uploadedImages: StorageFile[];
  onSelect: (url: string) => void;
  currentSrc: string;
  defaultSrc: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <img
        src={currentSrc || defaultSrc}
        alt={label}
        className="w-full h-full object-cover"
        loading="lazy"
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      />
      {open && uploadedImages.length > 0 && (
        <div
          className="absolute top-0 left-0 w-full h-full z-10 overflow-y-auto p-2"
          style={{ background: "rgba(10,10,10,0.85)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white">Swap image</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white font-bold text-sm px-2"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {uploadedImages
              .filter((f) => f.type === "image" || f.type === "svg")
              .slice(0, 9)
              .map((img) => (
                <button
                  key={img.id}
                  onClick={() => {
                    onSelect(img.url);
                    setOpen(false);
                  }}
                  className="aspect-square overflow-hidden cursor-pointer"
                  style={{ border: `2px solid ${img.url === currentSrc ? MINT : "transparent"}` }}
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
          </div>
          <button
            onClick={() => {
              onSelect(defaultSrc);
              setOpen(false);
            }}
            className="w-full mt-2 py-1.5 text-xs font-bold text-white text-center"
            style={{ border: `2px solid #555` }}
          >
            Reset to default
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function HomePage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<StorageFile[]>([]);

  // State for user-swappable images
  const [heroImage, setHeroImage] = useState(DEFAULT_HERO);
  const [templateImages, setTemplateImages] = useState(DEFAULT_TEMPLATES.map((t) => t.img));

  // Load uploaded media from Supabase Storage / localStorage
  useEffect(() => {
    storage.list("media").then((files) => {
      const images = files.filter((f) => f.type === "image" || f.type === "svg");
      setUploadedImages(images);
      if (images.length > 0) {
        // Use the most recent image as hero if available
        setHeroImage(images[0].url);
      }
    }).catch(() => {});
  }, []);

  const handleHeroSwap = (url: string) => {
    setHeroImage(url);
  };

  const handleTemplateSwap = (index: number, url: string) => {
    setTemplateImages((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  return (
    <div className="min-h-screen" style={{ background: BG_LIGHT }}>
      {/* ─── Navigation ─────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "#FFFFFF", borderBottom: `4px solid ${BRUTAL_BLACK}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-9 h-9 flex items-center justify-center"
                style={{ background: MINT, border: `3px solid ${BRUTAL_BLACK}` }}
              >
                <span className="text-white font-black text-lg" style={{ fontFamily: "monospace" }}>S</span>
              </div>
              <span className="text-xl font-black" style={{ color: BRUTAL_BLACK }}>
                Site<span style={{ color: MINT }}>Mint</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="font-bold text-sm hover:underline underline-offset-4" style={{ color: BRUTAL_BLACK, textDecorationThickness: "3px", textDecorationColor: MINT }}>Features</Link>
              <Link href="#templates" className="font-bold text-sm hover:underline underline-offset-4" style={{ color: BRUTAL_BLACK, textDecorationThickness: "3px", textDecorationColor: MINT }}>Templates</Link>
              <Link href="/media" className="font-bold text-sm hover:underline underline-offset-4" style={{ color: BRUTAL_BLACK, textDecorationThickness: "3px", textDecorationColor: MINT }}>
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                Media
              </Link>
              {user ? (
                <Link href="/dashboard">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 font-bold text-sm" style={{ border: `3px solid ${BRUTAL_BLACK}`, boxShadow: `4px 4px 0px ${MINT}`, background: MINT, color: "#FFFFFF" }}>Dashboard</span>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login"><span className="font-bold text-sm px-4 py-2" style={{ color: BRUTAL_BLACK }}>Sign In</span></Link>
                  <Link href="/auth/register"><span className="inline-flex items-center gap-2 px-5 py-2.5 font-bold text-sm" style={{ border: `3px solid ${BRUTAL_BLACK}`, boxShadow: `4px 4px 0px ${BRUTAL_BLACK}`, background: "#FFFFFF", color: BRUTAL_BLACK }}>Get Started</span></Link>
                </div>
              )}
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" style={{ color: BRUTAL_BLACK }} /> : <Menu className="w-6 h-6" style={{ color: BRUTAL_BLACK }} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ borderTop: `3px solid ${BRUTAL_BLACK}`, background: "#FFFFFF" }}>
            <div className="px-4 py-4 space-y-3">
              <Link href="#features" className="block font-bold py-2" style={{ color: BRUTAL_BLACK }} onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="#templates" className="block font-bold py-2" style={{ color: BRUTAL_BLACK }} onClick={() => setMobileMenuOpen(false)}>Templates</Link>
              <Link href="/media" className="block font-bold py-2" style={{ color: BRUTAL_BLACK }} onClick={() => setMobileMenuOpen(false)}>Media Library</Link>
              {user ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}><span className="block w-full text-center font-bold px-5 py-2.5" style={{ background: MINT, color: "#FFFFFF", border: `3px solid ${BRUTAL_BLACK}` }}>Dashboard</span></Link>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}><span className="block w-full text-center font-bold px-5 py-2.5" style={{ border: `3px solid ${BRUTAL_BLACK}`, color: BRUTAL_BLACK }}>Sign In</span></Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}><span className="block w-full text-center font-bold px-5 py-2.5" style={{ background: BRUTAL_BLACK, color: "#FFFFFF", border: `3px solid ${BRUTAL_BLACK}` }}>Get Started Free</span></Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* ─── Hero ──────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden" style={{ background: "#FFFFFF", borderBottom: `4px solid ${BRUTAL_BLACK}` }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${BRUTAL_BLACK} 1px, transparent 1px), linear-gradient(90deg, ${BRUTAL_BLACK} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <GeoDecoration className="top-10 right-10 w-64 h-64" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 font-bold text-sm mb-8" style={{ border: `3px solid ${BRUTAL_BLACK}`, background: MINT_LIGHT, color: BRUTAL_BLACK }}>
                <Sparkles className="w-4 h-4" style={{ color: MINT_DEEP }} />
                No-code website builder
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6" style={{ color: BRUTAL_BLACK }}>
                Build a Website{" "}
                <span className="px-2 py-1" style={{ background: MINT, color: "#FFFFFF", boxShadow: `6px 6px 0px ${BRUTAL_BLACK}`, display: "inline-block" }}>
                  in Minutes
                </span>
              </h1>
              <p className="text-lg sm:text-xl mb-10 max-w-lg font-medium" style={{ color: "#555" }}>
                No coding required. Drag, drop, and publish a professional site that looks like you hired a designer.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
                <BrutalButton href={user ? "/dashboard" : "/auth/register"} mint size="lg">Start Building <ArrowRight className="w-5 h-5" /></BrutalButton>
                <BrutalButton href="#features">See How It Works</BrutalButton>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold" style={{ color: BRUTAL_BLACK }}>
                <span className="flex items-center gap-2"><span className="w-5 h-5 flex items-center justify-center" style={{ background: MINT_DEEP, color: "#FFFFFF", fontSize: "12px" }}>✓</span>No credit card</span>
                <span className="flex items-center gap-2"><span className="w-5 h-5 flex items-center justify-center" style={{ background: MINT_DEEP, color: "#FFFFFF", fontSize: "12px" }}>✓</span>Free templates</span>
                <span className="flex items-center gap-2"><span className="w-5 h-5 flex items-center justify-center" style={{ background: MINT_DEEP, color: "#FFFFFF", fontSize: "12px" }}>✓</span>Publish instantly</span>
              </div>
            </motion.div>

            {/* Right — Hero Image (click to swap with uploaded images) */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="relative">
              <BrutalCard className="overflow-hidden">
                {/* Hero image picker overlay — click to swap */}
                <div className="relative">
                  <img src={heroImage} alt="Website builder dashboard" className="w-full h-auto object-cover" style={{ display: "block" }} />
                  {uploadedImages.length > 0 && (
                    <div className="absolute top-2 right-2 z-10">
                      <ImagePicker
                        uploadedImages={uploadedImages}
                        onSelect={handleHeroSwap}
                        currentSrc={heroImage}
                        defaultSrc={DEFAULT_HERO}
                        label="Hero image"
                      />
                    </div>
                  )}
                </div>
                <div className="absolute top-4 left-4 px-3 py-1.5 font-bold text-xs" style={{ background: MINT, border: `3px solid ${BRUTAL_BLACK}`, boxShadow: `3px 3px 0px ${BRUTAL_BLACK}`, color: "#FFFFFF" }}>✦ Drag & Drop</div>
                <div className="absolute bottom-4 right-4 px-3 py-1.5 font-bold text-xs" style={{ background: "#FFFFFF", border: `3px solid ${BRUTAL_BLACK}`, color: BRUTAL_BLACK }}>⚡ No Code</div>
              </BrutalCard>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 z-10" style={{ background: MINT, border: `4px solid ${BRUTAL_BLACK}`, transform: "rotate(12deg)" }}>
                <div className="w-full h-full flex items-center justify-center font-black text-white text-2xl" style={{ fontFamily: "monospace" }}>S</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────── */}
      <section id="features" className="py-24 px-4" style={{ background: BG_LIGHT }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="inline-block px-4 py-1.5 font-bold text-sm mb-4" style={{ background: MINT, color: "#FFFFFF", border: `3px solid ${BRUTAL_BLACK}` }}>✦ FEATURES</div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: BRUTAL_BLACK }}>Everything You Need</h2>
            <p className="text-lg font-medium max-w-xl" style={{ color: "#555" }}>Powerful features designed for non-technical users. No tutorials required.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Layout, title: "Drag & Drop Builder", desc: "Intuitive visual editor. Just drag sections, drop them, and customize." },
              { icon: Paintbrush, title: "Beautiful Templates", desc: "Start with 8 professionally designed templates for any business type." },
              { icon: Globe, title: "Instant Publishing", desc: "Publish with one click. Get your own sitemint.app subdomain immediately." },
              { icon: Smartphone, title: "Fully Responsive", desc: "Preview on desktop, tablet, and mobile. Your site looks perfect everywhere." },
              { icon: Zap, title: "Autosave Magic", desc: "Never lose your work. Changes are saved automatically every 15 seconds." },
              { icon: Shield, title: "SEO Built-In", desc: "Edit titles, descriptions, meta tags, and generate sitemaps automatically." },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="relative group cursor-pointer">
                <div
                  className="p-8 h-full transition-all duration-100"
                  style={{ background: "#FFFFFF", border: `4px solid ${BRUTAL_BLACK}`, boxShadow: `6px 6px 0px ${BRUTAL_BLACK}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-2px, -2px)"; e.currentTarget.style.boxShadow = `8px 8px 0px ${MINT}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0px, 0px)"; e.currentTarget.style.boxShadow = `6px 6px 0px ${BRUTAL_BLACK}`; }}
                >
                  <div className="w-14 h-14 flex items-center justify-center mb-6" style={{ background: MINT_LIGHT, border: `3px solid ${BRUTAL_BLACK}` }}>
                    <feature.icon className="w-7 h-7" style={{ color: MINT_DEEP }} />
                  </div>
                  <h3 className="text-xl font-black mb-3" style={{ color: BRUTAL_BLACK }}>{feature.title}</h3>
                  <p className="font-medium" style={{ color: "#666" }}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Templates ─────────────────────────────── */}
      <section id="templates" className="py-24 px-4" style={{ background: "#FFFFFF", borderTop: `4px solid ${BRUTAL_BLACK}`, borderBottom: `4px solid ${BRUTAL_BLACK}` }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-block px-4 py-1.5 font-bold text-sm mb-4" style={{ background: BRUTAL_BLACK, color: "#FFFFFF", border: `3px solid ${BRUTAL_BLACK}` }}>✦ TEMPLATES</div>
              <h2 className="text-4xl sm:text-5xl font-black" style={{ color: BRUTAL_BLACK }}>Choose Your Style</h2>
            </div>
            <p className="font-medium max-w-xs" style={{ color: "#666" }}>
              8 expertly designed templates. Click any image to swap with your own uploads.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEFAULT_TEMPLATES.map((template, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group cursor-pointer"
              >
                <div
                  className="overflow-hidden transition-all duration-100"
                  style={{ border: `4px solid ${BRUTAL_BLACK}`, boxShadow: `6px 6px 0px ${BRUTAL_BLACK}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-3px, -3px)"; e.currentTarget.style.boxShadow = `9px 9px 0px ${template.color}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0px, 0px)"; e.currentTarget.style.boxShadow = `6px 6px 0px ${BRUTAL_BLACK}`; }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <ImagePicker
                      uploadedImages={uploadedImages}
                      onSelect={(url) => handleTemplateSwap(i, url)}
                      currentSrc={templateImages[i]}
                      defaultSrc={template.img}
                      label={template.name}
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 font-bold text-xs" style={{ background: template.color, border: `2px solid ${BRUTAL_BLACK}`, color: "#FFFFFF" }}>{template.tag}</div>
                  </div>
                  <div className="p-4" style={{ background: "#FFFFFF" }}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-black" style={{ color: BRUTAL_BLACK }}>{template.name}</h3>
                      <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" style={{ color: BRUTAL_BLACK }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─────────────────────────────── */}
      <section style={{ background: BRUTAL_BLACK }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "Templates" },
              { number: "10K+", label: "Websites Built" },
              { number: "99.9%", label: "Uptime" },
              { number: "60s", label: "Average Setup" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl font-black mb-1" style={{ color: MINT }}>{stat.number}</div>
                <div className="font-bold text-sm" style={{ color: "#888" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────── */}
      <section className="py-24 px-4" style={{ background: BG_LIGHT }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 font-bold text-sm mb-4" style={{ background: MINT, color: "#FFFFFF", border: `3px solid ${BRUTAL_BLACK}` }}>✦ HOW IT WORKS</div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: BRUTAL_BLACK }}>Three Simple Steps</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose a Template", desc: "Pick from 8 professionally designed templates that match your business type.", icon: Star },
              { step: "02", title: "Customize with Drag & Drop", desc: "Add sections, edit text, swap images, and change colors — all visually.", icon: Layout },
              { step: "03", title: "Publish to the Web", desc: "Go live with one click. Get a free sitemint.app subdomain instantly.", icon: Globe },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="p-8 text-center h-full" style={{ background: "#FFFFFF", border: `4px solid ${BRUTAL_BLACK}`, boxShadow: `6px 6px 0px ${BRUTAL_BLACK}` }}>
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center font-black text-2xl" style={{ background: MINT, border: `3px solid ${BRUTAL_BLACK}`, color: "#FFFFFF" }}>{item.step}</div>
                  <item.icon className="w-8 h-8 mx-auto mb-4" style={{ color: MINT_DEEP }} />
                  <h3 className="text-xl font-black mb-3" style={{ color: BRUTAL_BLACK }}>{item.title}</h3>
                  <p className="font-medium" style={{ color: "#666" }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonial ───────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "#FFFFFF", borderTop: `4px solid ${BRUTAL_BLACK}` }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <BrutalCard mint className="p-10 sm:p-14 text-center">
              <Quote className="w-10 h-10 mx-auto mb-6" style={{ color: "#FFFFFF" }} />
              <blockquote className="text-xl sm:text-2xl font-bold mb-6 leading-relaxed text-white">
                "I built my entire coffee shop website in under 20 minutes. No coding, no stress. SiteMint is absolutely game-changing."
              </blockquote>
              <div className="flex items-center justify-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-current" style={{ color: BRUTAL_BLACK }} />))}
              </div>
              <cite className="font-bold text-sm not-italic" style={{ color: BRUTAL_BLACK }}>— Sarah J., Coffee Shop Owner</cite>
            </BrutalCard>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: BRUTAL_BLACK }}>
        <GeoDecoration className="top-0 right-0 w-96 h-96 opacity-30" />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center relative">
          <div className="inline-block px-4 py-1.5 font-bold text-sm mb-6" style={{ background: MINT, color: BRUTAL_BLACK, border: `3px solid #FFFFFF` }}>✦ GET STARTED</div>
          <h2 className="text-4xl sm:text-5xl font-black mb-6 text-white">Ready to Build Your Website?</h2>
          <p className="text-lg font-medium mb-10" style={{ color: "#AAA" }}>Join thousands of small business owners who built their online presence with SiteMint. No credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? "/dashboard" : "/auth/register"}>
              <span
                className="inline-flex items-center gap-2 text-lg px-8 py-4 font-bold transition-all duration-100"
                style={{ background: MINT, color: BRUTAL_BLACK, border: `4px solid #FFFFFF`, boxShadow: `6px 6px 0px ${MINT_DEEP}` }}
                onMouseEnter={(e) => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = `4px 4px 0px ${MINT_DEEP}`; }}
                onMouseLeave={(e) => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; e.currentTarget.style.transform = "translate(0px, 0px)"; e.currentTarget.style.boxShadow = `6px 6px 0px ${MINT_DEEP}`; }}
              >
                Start Building Free <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ────────────────────────────────── */}
      <footer className="py-10 px-4" style={{ background: BRUTAL_BLACK, borderTop: `4px solid ${MINT_DEEP}` }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center" style={{ background: MINT, border: `2px solid #FFFFFF` }}><span className="text-white font-black text-sm" style={{ fontFamily: "monospace" }}>S</span></div>
              <span className="font-black" style={{ color: "#FFFFFF" }}>Site<span style={{ color: MINT }}>Mint</span></span>
            </div>
            <p className="text-sm font-medium" style={{ color: "#666" }}>© {new Date().getFullYear()} SiteMint. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
