"use client";

import Image from "next/image";
import { useState } from "react";

// ─── Helpers ──────────────────────────────────────────────────

/** Check if a URL is a Supabase Storage public URL — eligible for Next.js optimization */
function isSupabaseUrl(url: string): boolean {
  return url.includes("supabase.co/storage/");
}

/** Check if a URL is a base64 data URL — must use unoptimized */
function isDataUrl(url: string): boolean {
  return url.startsWith("data:");
}

/** Check if a URL is an SVG — Next/Image can optimize SVGs in later versions */
function isSvg(url: string): boolean {
  return url.toLowerCase().endsWith(".svg") || url.includes("image/svg");
}

/** Generate a smaller transform URL for Supabase images (resize on the CDN) */
export function getOptimizedSupabaseUrl(
  url: string,
  width: number
): string {
  if (!isSupabaseUrl(url)) return url;
  try {
    const base = url.split("?")[0];
    return `${base}?width=${width}&quality=75&format=webp`;
  } catch {
    return url;
  }
}

// ─── Component ───────────────────────────────────────────────

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onClick?: React.MouseEventHandler;
}

/**
 * Smart image component that uses Next.js `<Image>` with optimization
 * for Supabase Storage URLs, and falls back to unoptimized rendering
 * for base64 data URLs, SVGs, and external images.
 *
 * Usage:
 *   <OptimizedImage src={url} alt="Hero" fill className="object-cover" />
 *   <OptimizedImage src={url} alt="Card" width={300} height={200} />
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes,
  onClick,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Data URLs, SVGs, or broken images must use unoptimized
  const needsUnoptimized = isDataUrl(src) || isSvg(src) || error;

  // For Supabase URLs, use the CDN transform to request smaller images
  const imageSrc = isSupabaseUrl(src) && !needsUnoptimized
    ? getOptimizedSupabaseUrl(src, fill ? 1200 : width || 600)
    : src;

  if (!fill && !width && !height) {
    // Fall back to plain img if no dimensions are given
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? undefined : "lazy"}
      />
    );
  }

  return (
    <div className={`relative ${fill ? "w-full h-full" : ""}`} onClick={onClick}>
      <Image
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        unoptimized={needsUnoptimized}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={
          sizes ||
          (fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined)
        }
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      {!loaded && !error && (
        <div
          className="absolute inset-0 animate-pulse rounded-none"
          style={{ background: "var(--mint-light)" }}
        />
      )}
    </div>
  );
}
