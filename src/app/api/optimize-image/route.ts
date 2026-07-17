// ─── Image Optimization API Route ──────────────────────────────
// Uses Sharp to resize and convert images (including base64 data
// URLs) to WebP on the fly, with aggressive cache headers.
//
// GET  /api/optimize-image?url=<encoded-url>&w=600&q=75&format=webp
//   → for HTTP(S) image URLs
// POST /api/optimize-image  { url, width, quality, format }
//   → for data URLs (avoids query-string length limits)

import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// ─── Constants ────────────────────────────────────────────────

const MAX_WIDTH = 4096;
const DEFAULT_QUALITY = 75;
const MAX_QUALITY = 100;
const CACHE_MAX_AGE = 31_536_000; // 1 year
const ALLOWED_FORMATS = ["webp", "jpeg", "png", "avif"] as const;
type OutputFormat = (typeof ALLOWED_FORMATS)[number];

// ─── Shared processing logic ──────────────────────────────────

interface ProcessOptions {
  buffer: Buffer;
  width: number;
  quality: number;
  format: OutputFormat;
}

async function processImage({ buffer, width, quality, format }: ProcessOptions) {
  let pipeline = sharp(buffer);

  // Resize if a target width is provided, without upscaling
  if (width > 0) {
    pipeline = pipeline.resize(width, undefined, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Convert to the requested format
  switch (format) {
    case "webp":
      pipeline = pipeline.webp({ quality });
      break;
    case "jpeg":
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    case "png":
      pipeline = pipeline.png({ compressionLevel: 9 });
      break;
    case "avif":
      pipeline = pipeline.avif({ quality });
      break;
  }

  return await pipeline.toBuffer();
}

// ─── GET handler ──────────────────────────────────────────────
// For HTTP(S) image URLs passed as query params.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const width = Math.min(Number(searchParams.get("w")) || 0, MAX_WIDTH);
  const quality = Math.min(Number(searchParams.get("q")) || DEFAULT_QUALITY, MAX_QUALITY);
  const formatRaw = searchParams.get("format") || "webp";
  if (!ALLOWED_FORMATS.includes(formatRaw as OutputFormat)) {
    return new NextResponse(
      `Invalid format '${formatRaw}'. Allowed: ${ALLOWED_FORMATS.join(", ")}`,
      { status: 400 }
    );
  }
  const format = formatRaw as OutputFormat;

  if (!url) {
    return new NextResponse("Missing 'url' query parameter", { status: 400 });
  }

  // Only process HTTP(S) URLs through GET — data URLs use POST
  if (url.startsWith("data:")) {
    return new NextResponse("Data URLs must use POST", { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: 502 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const optimized = await processImage({ buffer, width, quality, format });

    return new NextResponse(optimized, {
      headers: {
        "Content-Type": `image/${format === "jpeg" ? "jpeg" : format}`,
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
        "Content-Length": optimized.length.toString(),
        "X-Origin-Url": url,
      },
    });
  } catch (error) {
    console.error("[OPTIMIZE-IMAGE] GET error:", error);
    return new NextResponse("Image optimization failed", { status: 500 });
  }
}

// ─── POST handler ─────────────────────────────────────────────
// For data URLs (base64 images stored in localStorage) sent in the
// JSON body. Avoids URL length limits that would break GET.

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const url: string | undefined = body.url as string | undefined;
  const width = Math.min(Number(body.width) || 0, MAX_WIDTH);
  const quality = Math.min(Number(body.quality) || DEFAULT_QUALITY, MAX_QUALITY);
  const format = ((body.format as string) || "webp") as OutputFormat;

  if (!url) {
    return NextResponse.json({ error: "Missing 'url' in body" }, { status: 400 });
  }

  // Validate output format
  if (!ALLOWED_FORMATS.includes(format)) {
    return NextResponse.json(
      { error: `Invalid format '${format}'. Allowed: ${ALLOWED_FORMATS.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    let buffer: Buffer;

    if (url.startsWith("data:")) {
      // Decode base64 data URL
      const matches = url.match(/^data:image\/([^;]+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ error: "Invalid data URL format" }, { status: 400 });
      }
      buffer = Buffer.from(matches[2], "base64");
    } else if (url.startsWith("http://") || url.startsWith("https://")) {
      // Fetch remote URL (same as GET)
      const response = await fetch(url);
      if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
      }
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported URL scheme. Use http://, https://, or data:" },
        { status: 400 }
      );
    }

    const optimized = await processImage({ buffer, width, quality, format });

    return new NextResponse(optimized, {
      headers: {
        "Content-Type": `image/${format === "jpeg" ? "jpeg" : format}`,
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
        "Content-Length": optimized.length.toString(),
      },
    });
  } catch (error) {
    console.error("[OPTIMIZE-IMAGE] POST error:", error);
    return NextResponse.json({ error: "Image optimization failed" }, { status: 500 });
  }
}
