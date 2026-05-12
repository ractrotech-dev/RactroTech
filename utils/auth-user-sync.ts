/**
 * Keeps `users_table` in sync with Supabase Auth.
 * OAuth flows hit `/auth/callback`; password login does not, so we upsert here.
 * SERVER ONLY.
 */
import type { User } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/db/db';
import { usersTable } from '@/utils/db/schema';

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
  const meta = user.user_metadata as { full_name?: string } | undefined;
  return meta?.full_name ?? user.email?.split('@')[0] ?? 'User';
}

export async function ensureAuthUserInDb(user: User): Promise<void> {
  const email = user.email;
  if (!email) return;

  await withDbRetry(async () => {
    const bootstrap = parseBootstrapEmails();
    const emailLower = email.toLowerCase();
    const shouldBootstrap = bootstrap.has(emailLower);

    const [byId] = await db
      .select({ id: usersTable.id, role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.id, user.id))
      .limit(1);

    if (byId) {
      const promoteToSuperAdmin = shouldBootstrap && byId.role === 'user';

      await db
        .update(usersTable)
        .set({
          email: emailLower,
          name: displayName(user),
          last_login: new Date(),
          ...(promoteToSuperAdmin ? { role: 'super_admin' } : {}),
        })
        .where(eq(usersTable.id, user.id));
      return;
    }

    await db.insert(usersTable).values({
      id: user.id,
      email: emailLower,
      name: displayName(user),
      plan: 'none',
      stripe_id: 'none',
      role: shouldBootstrap ? 'super_admin' : 'user',
      last_login: new Date(),
    });
  });
}
