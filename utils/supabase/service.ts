import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role client for trusted server-only operations (e.g. Storage uploads).
 * Never import this module from client components.
 */
export function createServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url?.trim() || !key?.trim()) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
