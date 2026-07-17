"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { getBlurDataUrl, getBlurSupabaseUrl } from "@/lib/blur";
import { useOptimizedSrc, needsOptimization } from "@/lib/optimize";
import { resolveSizes, generateSizes, presets, supabaseLoader, type ResponsivePreset, type SizesOptions } from "@/lib/sizes";

// ─── Helpers ──────────────────────────────────────────────────

/** Check if a URL is a Supabase Storage public URL — eligible for Next.js optimization */
function isSupabaseUrl(url: string): boolean {
  return url.includes("supabase.co/storage/");
}

/** Check if a URL is an SVG — Next/Image can optimize SVGs in later versions */
function isSvg(url: string): boolean {
  return url.toLowerCase().endsWith(".svg") || url.includes("image/svg");
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
  /**
   * Explicit `sizes` attribute. When provided alongside `responsive`,
   * the explicit value takes precedence.
   */
  sizes?: string;
  /**
   * Responsive sizes preset or custom configuration.
   * Automatically generates a `sizes` string based on viewport breakpoints.
   * Ignored when the explicit `sizes` prop is set.
   *
   * Presets:
   *   "hero"   – full-width on every viewport
   *   "half"   – 1 col mobile, 2 cols ≥768px
   *   "third"  – 1 col mobile, 2 cols ≥768px, 3 cols ≥1024px
   *   "fourth" – 1 col mobile, 2 cols ≥768px, 4 cols ≥1024px
   *   "masonry"– 1 col mobile, 2 cols ≥768px, 3 cols ≥1280px
   *
   * Or pass a custom `SizesOptions`:
   *   { default: 1, breakpoints: [{ at: 600, cols: 0.5 }] }
   */
  responsive?: ResponsivePreset | SizesOptions;
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
  responsive,
  onClick,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Proxy data URLs through the Sharp optimize API for WebP conversion
  // For HTTP URLs, this is a synchronous passthrough (no-op).
  const { optimizedSrc } = useOptimizedSrc(
    src,
    needsOptimization(src) ? fill ? 1200 : width || 600 : 0
  );

  // SVGs or broken images must use unoptimized
  const needsUnoptimized = isSvg(src) || error || needsOptimization(src);

  // For Supabase URLs (non-data), use the CDN loader for responsive srcSet
  // The loader tells Next.js to build width variants via Supabase CDN transforms
  // instead of the default _next/image pipeline, saving serverless calls.
  const usesSupabaseLoader = isSupabaseUrl(src) && !needsUnoptimized;
  const imageSrc = usesSupabaseLoader ? src : optimizedSrc;

  // Generate a responsive `sizes` attribute if no explicit sizes was given
  const autoSizes = useMemo<string | undefined>(() => {
    if (sizes) return sizes; // explicit takes precedence
    if (responsive) return resolveSizes(responsive);
    // Fallback for fill-mode images with no configuration
    if (fill) return generateSizes(presets.hero);
    return undefined;
  }, [sizes, responsive, fill]);

  // Compute a blur data URL that matches the image aspect ratio
  const blurUrl = useMemo<string>(() => {
    // Try Supabase image transform first (gives a real miniature of the image)
    if (isSupabaseUrl(src)) {
      const transformed = getBlurSupabaseUrl(src);
      if (transformed) return transformed;
    }
    // Fall back to flat mint SVG placeholder
    if (width && height) return getBlurDataUrl(width, height, "#D1FAE5");
    return getBlurDataUrl(4, 3, "#D1FAE5");
  }, [src, width, height]);

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
        loader={usesSupabaseLoader ? supabaseLoader : undefined}
        placeholder="blur"
        blurDataURL={blurUrl}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        unoptimized={needsUnoptimized}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={autoSizes}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}
