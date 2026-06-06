/**
 * Keeps `users_table` in sync with Supabase Auth via the Supabase client (no DATABASE_URL).
 * OAuth flows hit `/auth/callback`; password login does not, so we upsert here.
 * SERVER ONLY.
 */
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

function parseBootstrapEmails(): Set<string> {
  const raw = process.env.ADMIN_BOOTSTRAP_EMAILS ?? '';
  return new Set(
    raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean),
  );
}

function displayName(user: User): string {
  const meta = user.user_metadata as { full_name?: string } | undefined;
  return meta?.full_name ?? user.email?.split('@')[0] ?? 'User';
}

export async function ensureAuthUserInDb(
  user: User,
  supabase?: SupabaseClient,
): Promise<void> {
  const email = user.email?.toLowerCase();
  if (!email) return;

  const client = supabase ?? createClient();
  const bootstrap = parseBootstrapEmails();
  const shouldBootstrap = bootstrap.has(email);
  const name = displayName(user);
  const now = new Date().toISOString();

  const { data: existing, error: selectError } = await client
    .from('users_table')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle();

  if (selectError) {
    throw new Error(selectError.message);
  }

  if (existing) {
    const updates: {
      email: string;
      name: string;
      last_login: string;
      role?: string;
    } = {
      email,
      name,
      last_login: now,
    };

    if (shouldBootstrap && existing.role === 'user') {
      updates.role = 'super_admin';
    }

    const { error: updateError } = await client
      .from('users_table')
      .update(updates)
      .eq('id', user.id);

    if (updateError) {
      throw new Error(updateError.message);
    }
    return;
  }

  const { error: insertError } = await client.from('users_table').insert({
    id: user.id,
    email,
    name,
    plan: 'none',
    stripe_id: 'none',
    role: shouldBootstrap ? 'super_admin' : 'user',
    last_login: now,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }
}
