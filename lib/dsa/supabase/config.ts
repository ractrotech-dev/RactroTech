// Supabase is optional for the course. Without keys every lesson still works — it just
// runs signed-out, with no progress tracking. Same env vars as utils/supabase/*, but this
// degrades to null instead of throwing, because a lesson page must never fail to render
// over a missing backend.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  "";

export const SUPABASE_READY = Boolean(SUPABASE_URL && SUPABASE_KEY);
