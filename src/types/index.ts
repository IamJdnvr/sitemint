import { z } from "zod";

// ========== User & Auth ==========
export type User = {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
};

// ========== Website / Project ==========
export type WebsiteStatus = "draft" | "published" | "unpublished";

export type Website = {
  id: string;
  user_id: string;
  name: string;
  business_name: string;
  category: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  button_style: "rounded" | "pill" | "square";
  dark_mode: boolean;
  status: WebsiteStatus;
  pages: Page[];
  global_seo: SEOData;
  template_id: string;
  published_url?: string;
  published_at?: string;
  visitor_count: number;
  created_at: string;
  updated_at: string;
};

// ========== Page ==========
export type Page = {
  id: string;
  website_id: string;
  name: string;
  slug: string;
  sort_order: number;
  seo?: SEOData;
  sections: Section[];
  created_at: string;
  updated_at: string;
};

// ========== SEO ==========
export type SEOData = {
  title: string;
  meta_description: string;
  keywords: string;
  og_image?: string;
  favicon?: string;
};

// ========== Section ==========
export type SectionType =
  | "navbar"
  | "hero"
  | "features"
  | "about"
  | "services"
  | "gallery"
  | "testimonials"
  | "faq"
  | "contact"
  | "footer"
  | "spacer"
  | "divider";

export type Section = {
  id: string;
  page_id: string;
  type: SectionType;
  sort_order: number;
  content: SectionContent;
  styles: SectionStyles;
  visibility: boolean;
};

export type SectionContent = Record<string, any>;

export type SectionStyles = {
  padding?: string;
  margin?: string;
  background_color?: string;
  background_image?: string;
  background_gradient?: string;
  text_alignment?: "left" | "center" | "right";
  dark_mode?: boolean;
  [key: string]: any;
};

// ========== Template ==========
export type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  preview_url?: string;
  pages: TemplatePage[];
  global_settings: {
    primary_color: string;
    secondary_color: string;
    font_family: string;
    button_style: "rounded" | "pill" | "square";
  };
};

export type TemplatePage = {
  name: string;
  slug: string;
  sections: {
    type: SectionType;
    content: SectionContent;
    styles: SectionStyles;
  }[];
};

// ========== Media ==========
export type MediaItem = {
  id: string;
  user_id: string;
  name: string;
  url: string;
  type: "image" | "video" | "svg" | "logo";
  size: number;
  created_at: string;
};

// ========== Contact Submission ==========
export type ContactSubmission = {
  id: string;
  website_id: string;
  page_id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
};

// ========== Zod Schemas ==========
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const websiteCreateSchema = z.object({
  name: z.string().min(1, "Website name is required"),
  business_name: z.string().min(1, "Business name is required"),
  category: z.string().min(1, "Category is required"),
  logo_url: z.string().optional(),
  primary_color: z.string(),
  secondary_color: z.string(),
});

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export const profileSchema = z.object({
  display_name: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email"),
});
