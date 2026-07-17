// ─── Image Optimization Helpers ───────────────────────────────
// Utility functions for proxying images through the Sharp-based
// /api/optimize-image endpoint.
//
// Usage:
//   const { optimizedSrc } = useOptimizedSrc(src, width);
//   <Image src={optimizedSrc} ... />

"use client";

import { useState, useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────

const API_ENDPOINT = "/api/optimize-image";
const CACHE = new Map<string, string>(); // shared in-memory cache
const MAX_CACHE_SIZE = 50;

// ─── Helpers ──────────────────────────────────────────────────

/** Check whether a URL is a base64 data URL that needs optimization */
export function needsOptimization(src: string): boolean {
  return src.startsWith("data:");
}

/** Build a GET URL for the optimize API (for HTTP URLs) */
export function getOptimizeApiUrl(
  src: string,
  width: number,
  quality: number = 75,
  format: string = "webp"
): string {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality),
    format,
  });
  return `${API_ENDPOINT}?${params.toString()}`;
}

// ─── Hook ─────────────────────────────────────────────────────

interface UseOptimizedSrcResult {
  optimizedSrc: string;
  isOptimizing: boolean;
}

/**
 * A React hook that accepts an image URL (including base64 data URLs)
 * and returns an optimized WebP blob URL by proxying through the
 * Sharp-based `/api/optimize-image` endpoint.
 *
 * - HTTP(S) URLs are directly rewritten to the API GET URL.
 * - Data URLs are POSTed to the API and converted to a blob URL.
 *
 * @param src  - The original image URL (data: or http(s):)
 * @param width - Desired max width for resizing (0 = no resize)
 */
export function useOptimizedSrc(
  src: string,
  width: number = 0
): UseOptimizedSrcResult {
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const cleanupRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Reset state on src/width change
    setOptimizedSrc(src);
    setIsOptimizing(false);

    // HTTP(S) URLs → use GET API directly (fast, no blob needed)
    if (!needsOptimization(src)) {
      return;
    }

    // Data URLs → POST to API, get optimized WebP blob
    setIsOptimizing(true);

    // Check in-memory cache first
    const cacheKey = `${src}_${width}`;
    const cached = CACHE.get(cacheKey);
    if (cached) {
      setOptimizedSrc(cached);
      setIsOptimizing(false);
      return;
    }

    let cancelled = false;

    fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: src, width, quality: 75 }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const blobUrl = URL.createObjectURL(blob);
        cleanupRef.current.add(blobUrl);
        // Evict oldest entry when cache exceeds limit
        if (CACHE.size >= MAX_CACHE_SIZE) {
          const oldest = CACHE.keys().next().value;
          if (oldest !== undefined) CACHE.delete(oldest);
        }
        CACHE.set(cacheKey, blobUrl);
        setOptimizedSrc(blobUrl);
        setIsOptimizing(false);
      })
      .catch(() => {
        // Fallback: show original data URL (unoptimized but functional)
        if (!cancelled) {
          setIsOptimizing(false);
        }
      });

    return () => {
      cancelled = true;
      // Revoke any blob URLs created by this effect run
      cleanupRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      cleanupRef.current.clear();
    };
  }, [src, width]);

  return { optimizedSrc, isOptimizing };
}
