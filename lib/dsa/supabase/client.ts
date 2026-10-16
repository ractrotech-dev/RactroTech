"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_READY, SUPABASE_URL } from "@/lib/dsa/supabase/config";
import type { Database } from "@/lib/dsa/supabase/types";

let cached: ReturnType<typeof createBrowserClient<Database>> | null = null;

/** Returns null when Supabase is not configured, so callers can degrade. */
export function browserClient() {
  if (!SUPABASE_READY) return null;
  cached ??= createBrowserClient<Database>(SUPABASE_URL, SUPABASE_KEY);
  return cached;
}
