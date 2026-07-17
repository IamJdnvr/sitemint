// ─── Responsive Image Sizes Generator ─────────────────────────
// Generates the `sizes` attribute string for Next.js `<Image>` based
// on viewport breakpoints and column fractions.
//
// Usage:
//   import { generateSizes, presets } from "@/lib/sizes";
//
//   // Preset
//   <Image sizes={generateSizes(presets.hero)} ... />
//
//   // Custom
//   <Image sizes={generateSizes({
//     default: 1,
//     breakpoints: [{ at: 768, cols: 0.5 }, { at: 1024, cols: 1/3 }],
//   })} ... />

// ─── Types ────────────────────────────────────────────────────

/** A single breakpoint definition */
export interface BreakpointDef {
  /** Viewport min‑width in px (e.g. 640, 768, 1024) */
  at: number;
  /** Fraction of viewport width the image occupies (1 = full, 0.5 = half) */
  cols: number;
}

/** Configuration for `generateSizes()` */
export interface SizesOptions {
  /**
   * Default viewport‑width fraction when no breakpoint matches.
   * 1 = "100vw", 0.5 = "50vw", 1/3 ≈ "33.3vw", etc.
   * @default 1
   */
  default?: number;
  /**
   * Breakpoints in ascending order by `at`.
   * Each generates a `(min-width: Npx) Mvw` clause.
   */
  breakpoints?: BreakpointDef[];
}

// ─── Presets ──────────────────────────────────────────────────

/**
 * Ready‑to‑use size presets covering the most common layout patterns.
 *
 * | Preset   | Mobile        | ≥768px   | ≥1024px  | ≥1280px  |
 * |----------|---------------|----------|----------|----------|
 * | `hero`   | 100vw         | —        | —        | —        |
 * | `half`   | 100vw         | 50vw     | —        | —        |
 * | `third`  | 100vw         | 50vw     | 33.3vw   | —        |
 * | `fourth` | 100vw         | 50vw     | 25vw     | —        |
 * | `masonry`| 100vw         | 50vw     | 50vw     | 33.3vw   |
 */
export const presets = {
  /** Full‑width on every viewport — ideal for hero banners */
  hero: { default: 1 } satisfies SizesOptions,

  /** 1 col on mobile, 2 cols at tablet+ */
  half: {
    default: 1,
    breakpoints: [{ at: 768, cols: 0.5 }],
  } satisfies SizesOptions,

  /** 1 col on mobile, 2 at tablet, 3 at desktop */
  third: {
    default: 1,
    breakpoints: [
      { at: 768, cols: 0.5 },
      { at: 1024, cols: 1 / 3 },
    ],
  } satisfies SizesOptions,

  /** 1 col on mobile, 2 at tablet, 4 at desktop */
  fourth: {
    default: 1,
    breakpoints: [
      { at: 768, cols: 0.5 },
      { at: 1024, cols: 0.25 },
    ],
  } satisfies SizesOptions,

  /** 1 col on mobile, 2 at tablet, 3 at >=1280px */
  masonry: {
    default: 1,
    breakpoints: [
      { at: 768, cols: 0.5 },
      { at: 1280, cols: 1 / 3 },
    ],
  } satisfies SizesOptions,
} as const;

/** Key of the `presets` map */
export type ResponsivePreset = keyof typeof presets;

// ─── Next.js Image Loader ─────────────────────────────────────

/**
 * Custom Next.js `<Image>` loader that generates Supabase CDN
 * transform URLs at the requested width. When used as the `loader`
 * prop, Next.js builds a responsive `srcSet` automatically by
 * calling this function at multiple device-pixel-ratio-aware widths.
 *
 * This eliminates the need for the default `_next/image` endpoint,
 * saving a serverless function call — the CDN handles resizing.
 *
 * @example
 * ```tsx
 * <Image
 *   src="https://xxx.supabase.co/storage/v1/object/public/..."
 *   loader={supabaseLoader}
 *   fill
 *   sizes="100vw"
 * />
 * // srcSet →
 * //   ...?width=640&quality=75&format=webp 640w,
 * //   ...?width=960&quality=75&format=webp 960w,
 * //   ...?width=1280&quality=75&format=webp 1280w
 * ```
 */
export function supabaseLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Strip any existing query params from the base URL
  const base = src.split("?")[0];
  return `${base}?width=${width}&quality=${quality ?? 75}&format=webp`;
}

/**
 * Generate a complete `srcSet` string manually, bypassing the
 * Next.js `<Image>` loader. Useful when you need the srcSet as a
 * plain string (e.g. for a custom `<img>` fallback or data export).
 *
 * @param baseUrl - The original image URL (query params are stripped)
 * @param widths  - Array of widths to include. Defaults to
 *                  `[320, 480, 640, 960, 1280, 1920]`.
 * @param quality - WebP quality (1–100). Defaults to `75`.
 *
 * @example
 * ```ts
 * generateSrcSet("https://xxx.supabase.co/...")
 * // → "...?width=320&quality=75&format=webp 320w, ...?width=480&quality=75&format=webp 480w, ..."
 * ```
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [320, 480, 640, 960, 1280, 1920],
  quality: number = 75
): string {
  const base = baseUrl.split("?")[0];
  return widths
    .map((w) => `${base}?width=${w}&quality=${quality}&format=webp ${w}w`)
    .join(", ");
}

// ─── Generator ────────────────────────────────────────────────

/** Round a number to at most 1 decimal place. */
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Format a column fraction as a `vw` string. */
function formatVw(cols: number): string {
  return `${round1(cols * 100)}vw`;
}

/**
 * Generate a `sizes` attribute string for Next.js `<Image>`.
 *
 * The output lists breakpoint conditions from widest to narrowest,
 * ending with a default that applies when none match.
 *
 * @example
 * ```ts
 * generateSizes(presets.hero)         // → "100vw"
 * generateSizes(presets.third)        // → "(min-width: 1024px) 33.3vw, (min-width: 768px) 50vw, 100vw"
 * generateSizes({ default: 1, breakpoints: [{ at: 640, cols: 0.5 }] })  // → "(min-width: 640px) 50vw, 100vw"
 * ```
 */
export function generateSizes(options: SizesOptions): string {
  const defaultFraction = options.default ?? 1;
  const bps = options.breakpoints;

  if (!bps || bps.length === 0) {
    return formatVw(defaultFraction);
  }

  // Sort ascending by `at` so the output is narrow → wide
  const sorted = [...bps].sort((a, b) => a.at - b.at);

  const clauses = sorted.map((bp) => {
    const vw = formatVw(bp.cols);
    return `(min-width: ${bp.at}px) ${vw}`;
  });

  clauses.push(formatVw(defaultFraction));
  return clauses.join(", ");
}

/**
 * Convenience shorthand — accepts either a preset name or a
 * custom `SizesOptions` object.
 */
export function resolveSizes(responsive: ResponsivePreset | SizesOptions): string {
  if (typeof responsive === "string") {
    const preset = presets[responsive as ResponsivePreset];
    if (preset) return generateSizes(preset);
    // Fallback: treat as a single breakpoint value (backwards compat)
    return generateSizes({ default: 1 });
  }
  return generateSizes(responsive);
}
