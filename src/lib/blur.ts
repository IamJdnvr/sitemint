// ─── Blur Data URL Helper ─────────────────────────────────────
// Generates a tiny SVG-based blur placeholder for Next.js Image
// `placeholder="blur"`, with a mint-tinted default.
//
// Usage:
//   import { getBlurDataUrl } from "@/lib/blur";
//   <Image ... placeholder="blur" blurDataURL={getBlurDataUrl(3, 2)} />

// ─── Helpers ──────────────────────────────────────────────────

/** Cross-environment base64 encoding (works in Node.js and browser) */
function toBase64(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64");
  }
  return btoa(str);
}

// ─── Public API ───────────────────────────────────────────────

/**
 * Generate a tiny SVG data URI for use as a `blurDataURL` with
 * Next.js `<Image placeholder="blur" />`.
 *
 * @param aspectW - Aspect ratio width (default 20)
 * @param aspectH - Aspect ratio height (default 15 — 4:3-ish)
 * @param color   - Fill color, defaults to mint-light (#D1FAE5)
 *
 * The SVG is rendered at 20px × (20 * aspectH / aspectW) px, which is
 * tiny enough for Next.js to accept as a valid blur placeholder.
 * Next.js applies a CSS blur filter on top, so even a flat fill
 * produces a smooth, visually pleasing transition.
 */
export function getBlurDataUrl(
  aspectW: number = 20,
  aspectH: number = 15,
  color: string = "#D1FAE5"
): string {
  const h = Math.round((20 * aspectH) / aspectW);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="${h}" viewBox="0 0 ${aspectW} ${aspectH}">
  <rect width="${aspectW}" height="${aspectH}" fill="${color}" />
</svg>`;
  return `data:image/svg+xml;base64,${toBase64(svg)}`;
}

/**
 * Attempt to build a Supabase Storage CDN transform URL at a tiny
 * size (20 px wide) so the blur placeholder is a genuine miniature
 * of the actual image. Returns `null` if the URL isn't a Supabase
 * Storage URL or if an error occurs.
 *
 * Requires the **Supabase Image Transformation** add-on (paid Pro
 * plan feature). If the add-on is not enabled, the URL is silently
 * ignored and the server serves the original image (still works,
 * just no bandwidth savings on the placeholder).
 *
 * To disable the transform entirely, call `getBlurDataUrl()` instead.
 */
export function getBlurSupabaseUrl(url: string): string | null {
  if (!url.includes("supabase.co/storage/")) return null;
  try {
    const base = url.split("?")[0];
    return `${base}?width=20&quality=10`;
  } catch {
    return null;
  }
}
