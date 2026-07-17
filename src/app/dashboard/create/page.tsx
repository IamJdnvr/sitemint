"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  Layout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { templates, categories, fontOptions } from "@/lib/templates";
import { useToast } from "@/hooks/use-toast";
import type { Template, Website, Page, Section, SectionType } from "@/types";

const defaultColors = [
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#059669" },
  { name: "Purple", value: "#7C3AED" },
  { name: "Red", value: "#DC2626" },
  { name: "Orange", value: "#EA580C" },
  { name: "Pink", value: "#DB2777" },
  { name: "Teal", value: "#0D9488" },
  { name: "Brown", value: "#8B4513" },
];

export default function CreateWebsitePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [secondaryColor, setSecondaryColor] = useState("#EFF6FF");
  const [websiteName, setWebsiteName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [fontFamily, setFontFamily] = useState("Inter");

  const handleCreateWebsite = () => {
    if (!selectedTemplate || !websiteName || !businessName || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const templateData = selectedTemplate;

    const pages: Page[] = templateData.pages.map((tp, pageIndex) => {
      const sections: Section[] = tp.sections.map((ts, sectionIndex) => ({
        id: crypto.randomUUID(),
        page_id: crypto.randomUUID(),
        type: ts.type as SectionType,
        sort_order: sectionIndex,
        content: ts.content,
        styles: {
          padding: ts.styles.padding || "60px 0",
          background_color: ts.styles.background_color || "#FFFFFF",
          text_alignment: (ts.styles.text_alignment as "left" | "center" | "right") || "left",
        },
        visibility: true,
      }));

      return {
        id: crypto.randomUUID(),
        website_id: crypto.randomUUID(),
        name: tp.name,
        slug: tp.slug,
        sort_order: pageIndex,
        sections,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    const website: Website = {
      id: crypto.randomUUID(),
      user_id: "local",
      name: websiteName,
      business_name: businessName,
      category: category,
      logo_url: logoUrl || undefined,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      font_family: fontFamily,
      button_style: templateData.global_settings.button_style,
      dark_mode: false,
      status: "draft",
      pages,
      global_seo: {
        title: businessName,
        meta_description: `Welcome to ${businessName}`,
        keywords: category,
        favicon: undefined,
        og_image: undefined,
      },
      template_id: templateData.id,
      visitor_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to localStorage
    const stored = localStorage.getItem("sitemint_websites");
    const websites: Website[] = stored ? JSON.parse(stored) : [];
    websites.push(website);
    localStorage.setItem("sitemint_websites", JSON.stringify(websites));

    toast({
      title: "Website created!",
      description: "Let's start building your site.",
      variant: "success",
    });

    router.push(`/builder?id=${website.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Create Website
              </h1>
              <p className="text-sm text-gray-500">Step {step} of 2</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`w-8 h-1 rounded-full transition-colors ${
                  s <= step ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Tell us about your business</CardTitle>
                  <CardDescription>
                    This information helps us set up your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Website Name *</Label>
                      <Input
                        placeholder="My Amazing Website"
                        value={websiteName}
                        onChange={(e) => setWebsiteName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Business Name *</Label>
                      <Input
                        placeholder="My Business"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                            category === cat
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex gap-2 flex-wrap">
                        {defaultColors.map((c) => (
                          <button
                            key={c.value}
                            onClick={() => setPrimaryColor(c.value)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              primaryColor === c.value
                                ? "border-gray-900 scale-110"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: c.value }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex gap-2 flex-wrap">
                        {defaultColors.map((c) => (
                          <button
                            key={c.value}
                            onClick={() => setSecondaryColor(c.value + "20")}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              secondaryColor === c.value + "20"
                                ? "border-gray-900 scale-110"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: c.value + "20" }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Font</Label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {fontOptions.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Logo URL (optional)</Label>
                    <Input
                      placeholder="https://example.com/logo.png"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => {
                        if (!websiteName || !businessName || !category) {
                          toast({
                            title: "Missing information",
                            description:
                              "Please fill in all required fields.",
                            variant: "destructive",
                          });
                          return;
                        }
                        setStep(2);
                      }}
                      className="gap-2"
                    >
                      Choose Template
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Choose a Template
                </h2>
                <p className="text-gray-600">
                  Start with a professionally designed template
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template as unknown as Template)}
                    className={`template-card text-left rounded-2xl border-2 overflow-hidden transition-all ${
                      selectedTemplate?.id === template.id
                        ? "border-blue-600 shadow-lg shadow-blue-500/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="h-36 p-4 flex flex-col justify-between"
                      style={{
                        background: `linear-gradient(135deg, ${template.global_settings.primary_color}22, ${template.global_settings.secondary_color})`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">
                          {getEmoji(template.category)}
                        </span>
                        {selectedTemplate?.id === template.id && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium opacity-60">
                          {template.category}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-1 mt-3 text-sm text-blue-600 font-medium">
                        Preview <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleCreateWebsite}
                  disabled={!selectedTemplate}
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Create Website
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function getEmoji(category: string): string {
  const map: Record<string, string> = {
    Restaurant: "🍽️",
    "Coffee Shop": "☕",
    Salon: "💇",
    Portfolio: "🎨",
    Freelancer: "💻",
    Agency: "🚀",
    "Small Business": "🏪",
    "Landing Page": "📄",
  };
  return map[category] || "🌐";
}
