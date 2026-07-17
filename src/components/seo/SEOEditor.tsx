"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Globe,
  Image,
  FileText,
  Save,
  Loader2,
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
import { useToast } from "@/hooks/use-toast";
import type { SEOData, Website } from "@/types";

export function SEOEditor({
  website,
  onUpdate,
}: {
  website: Website;
  onUpdate: (seo: SEOData) => void;
}) {
  const { toast } = useToast();
  const [seo, setSeo] = useState<SEOData>(website.global_seo);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSeo(website.global_seo);
  }, [website.global_seo]);

  const handleSave = () => {
    setSaving(true);
    onUpdate(seo);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "SEO settings saved!", variant: "success" });
    }, 500);
  };

  const googlePreview = {
    title: seo.title || website.business_name || "My Website",
    url: `${(website.name || "mysite").toLowerCase().replace(/\s+/g, "-")}.sitemint.app`,
    description: seo.meta_description || "Welcome to my website",
  };

  return (
    <div className="space-y-6">
      {/* Google Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-blue-600" />
            Google Search Preview
          </CardTitle>
          <CardDescription>
            How your site will appear in search results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl border border-gray-200 bg-white max-w-xl">
            <p className="text-xs text-green-700 mb-1">{googlePreview.url}</p>
            <p className="text-lg text-blue-700 font-medium hover:underline cursor-pointer mb-1">
              {googlePreview.title}
            </p>
            <p className="text-sm text-gray-600">{googlePreview.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* SEO Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            Title Tag
          </Label>
          <Input
            value={seo.title}
            onChange={(e) => setSeo({ ...seo, title: e.target.value })}
            placeholder="My Website - Best Services"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 text-right">
            {seo.title.length}/60 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            Meta Description
          </Label>
          <Textarea
            value={seo.meta_description}
            onChange={(e) => setSeo({ ...seo, meta_description: e.target.value })}
            placeholder="Describe your website for search engines..."
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-gray-500 text-right">
            {seo.meta_description.length}/160 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            Keywords
          </Label>
          <Input
            value={seo.keywords}
            onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
            placeholder="business, services, local, quality"
          />
          <p className="text-xs text-gray-500">
            Separate keywords with commas
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Image className="w-4 h-4 text-gray-400" />
              Open Graph Image URL
            </Label>
            <Input
              value={seo.og_image || ""}
              onChange={(e) => setSeo({ ...seo, og_image: e.target.value })}
              placeholder="https://example.com/og-image.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              Favicon URL
            </Label>
            <Input
              value={seo.favicon || ""}
              onChange={(e) => setSeo({ ...seo, favicon: e.target.value })}
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save SEO Settings
        </Button>
      </div>
    </div>
  );
}

// Simple Textarea component since we don't have a shadcn one
function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className || ""}`}
      {...props}
    />
  );
}
