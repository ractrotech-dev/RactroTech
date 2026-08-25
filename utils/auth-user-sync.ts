/**
 * Keeps `users_table` and `profiles` in sync with Supabase Auth.
 * OAuth flows hit `/auth/callback`; password login syncs in loginUser action.
 * SERVER ONLY.
 *
 * Resolved from two divergent rewrites when the CRM branch met the marketing branch.
 * The Drizzle path below won because it is a strict superset: it keeps the
 * ADMIN_BOOTSTRAP_EMAILS promotion and the insert-time role the Supabase-client version
 * had, and adds the `profiles` mirror, OAuth avatars and `withDbRetry` on top.
 *
 * The version this replaced took an optional `SupabaseClient` so it could run without
 * DATABASE_URL. That constraint does not survive the merge, and the knowledge is worth
 * keeping: this module now needs DATABASE_URL at request time. It is safe at build time —
 * utils/db/db.ts deliberately falls back to a dummy URL so `next build` can import this
 * module — but an unset DATABASE_URL in a deployment turns every login into a failed
 * sync, not a silent no-op. Same requirement as the rest of the Drizzle server code.
 */
import type { User } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/db/db';
import { profilesTable, usersTable } from '@/utils/db/schema';
import {
  defaultUsernameFromEmail,
  extractAuthProfile,
  extractFullName,
  extractOAuthAvatar,
} from '@/lib/auth/extract-auth-profile';

async function withDbRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let last: unknown;
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (i < attempts - 1) await delay(200 * (i + 1));
    }
  }
  throw last;
}

function parseBootstrapEmails(): Set<string> {
  const raw = process.env.ADMIN_BOOTSTRAP_EMAILS ?? '';
  return new Set(
    raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean),
  );
}

function displayName(user: User): string {
  return extractFullName(user) ?? user.email?.split('@')[0] ?? 'User';
}

async function ensureProfileInDb(user: User): Promise<void> {
  const extracted = extractAuthProfile(user);
  if (!extracted) return;

  const { email, fullName, avatarUrl, provider } = extracted;
  const isOAuth = provider !== 'email';
  const now = new Date();

  const [existing] = await db
    .select({
      id: profilesTable.id,
      avatar_url: profilesTable.avatar_url,
      full_name: profilesTable.full_name,
      username: profilesTable.username,
    })
    .from(profilesTable)
    .where(eq(profilesTable.id, user.id))
    .limit(1);

  if (existing) {
    const nextAvatar =
      isOAuth && avatarUrl ? avatarUrl : existing.avatar_url ?? avatarUrl;

    await db
      .update(profilesTable)
      .set({
        email,
        full_name: fullName ?? existing.full_name,
        avatar_url: nextAvatar,
        provider,
        updated_at: now,
      })
      .where(eq(profilesTable.id, user.id));
    return;
  }

  await db.insert(profilesTable).values({
    id: user.id,
    email,
    full_name: fullName,
    username: defaultUsernameFromEmail(email),
    avatar_url: avatarUrl,
    provider,
    created_at: now,
    updated_at: now,
  });
}

export async function ensureAuthUserInDb(user: User): Promise<void> {
  const email = user.email;
  if (!email) return;

  await withDbRetry(async () => {
    const bootstrap = parseBootstrapEmails();
    const emailLower = email.toLowerCase();
    const shouldBootstrap = bootstrap.has(emailLower);
    const name = displayName(user);
    const oauthAvatar = extractOAuthAvatar(user);

    const [byId] = await db
      .select({ id: usersTable.id, role: usersTable.role, avatar_url: usersTable.avatar_url })
      .from(usersTable)
      .where(eq(usersTable.id, user.id))
      .limit(1);

    if (byId) {
      const promoteToSuperAdmin = shouldBootstrap && byId.role === 'user';
      const nextAvatar = oauthAvatar ?? byId.avatar_url;

      await db
        .update(usersTable)
        .set({
          email: emailLower,
          name,
          avatar_url: nextAvatar,
          last_login: new Date(),
          ...(promoteToSuperAdmin ? { role: 'super_admin' } : {}),
        })
        .where(eq(usersTable.id, user.id));
    } else {
      await db.insert(usersTable).values({
        id: user.id,
        email: emailLower,
        name,
        plan: 'none',
        stripe_id: 'none',
        role: shouldBootstrap ? 'super_admin' : 'user',
        avatar_url: oauthAvatar,
        last_login: new Date(),
      });
    }

    await ensureProfileInDb(user);
  });
}
