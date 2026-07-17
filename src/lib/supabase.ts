import { createBrowserClient } from "@supabase/ssr";
import { createLocalAuthClient } from "./local-auth";

// ─── Configuration ─────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Heuristic: a real Supabase URL starts with "https://" and a real
 * anon key starts with "eyJ" (base64-encoded JWT header). Placeholder
 * values like "https://placeholder.supabase.co" do NOT pass this
 * check, so the app falls back to local auth as intended.
 */
const isSupabaseConfigured =
  supabaseUrl.startsWith("https://") &&
  supabaseAnonKey.startsWith("eyJ");

// ─── Client caching ────────────────────────────────────────────

let realClient: ReturnType<typeof createBrowserClient> | null = null;
let warned = false;

function warnOnce(msg: string) {
  if (!warned && typeof window !== "undefined") {
    console.info("🔧", msg);
    warned = true;
  }
}

// ─── Public API ────────────────────────────────────────────────

/**
 * Create a Supabase client.
 *
 * **With real credentials** (NEXT_PUBLIC_SUPABASE_URL starts with
 * `https://` AND NEXT_PUBLIC_SUPABASE_ANON_KEY starts with `eyJ`):
 * Returns a cached `@supabase/ssr` browser client.
 *
 * **Without real credentials** (placeholder / empty values):
 * Returns a localStorage-based auth client. Users, sessions, and
 * passwords are stored in the browser. This lets the app work fully
 * without a Supabase backend during development or for MVP demos.
 */
export function createClient() {
  if (isSupabaseConfigured) {
    if (!realClient) {
      realClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
    return realClient as any;
  }

  warnOnce(
    "Supabase not configured — using local storage auth. " +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
      "in .env.local to connect a real backend."
  );
  return createLocalAuthClient();
}

/**
 * Async version — same as createClient() but guaranteed async.
 */
export async function createClientAsync() {
  return createClient();
}
