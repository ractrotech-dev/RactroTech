import type { AdminRole } from '@/utils/admin-roles';

export { type AdminRole } from '@/utils/admin-roles';
export { hasRole, getRoleLabel, getRoleBadgeClasses, ADMIN_ROLES } from '@/utils/admin-roles';

import { createClient } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";
import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { ADMIN_ROLES } from '@/utils/admin-roles';
import { ensureAuthUserInDb } from '@/utils/auth-user-sync';

function parseDevAccessEmails(): Set<string> {
  if (process.env.NODE_ENV !== 'development') return new Set();
  const raw = process.env.ADMIN_DEV_ACCESS_EMAILS ?? '';
  return new Set(raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean));
}

/**
 * Returns the current user if they are logged in AND their role in the DB is an admin-level role.
 * Use in admin layout to protect routes. Returns null if not authenticated or not admin.
 * SERVER ONLY — do not import in client components.
 */
export async function getAdminUser(): Promise<(User & { dbRole: AdminRole }) | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  await ensureAuthUserInDb(user);

  const [row] = await db
    .select({ role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, user.id));

  if (!row) return null;
  const role = row.role as AdminRole;

  if (ADMIN_ROLES.includes(role)) {
    return Object.assign(user, { dbRole: role });
  }

  const devAllow = parseDevAccessEmails();
  if (devAllow.has(user.email.toLowerCase())) {
    return Object.assign(user, { dbRole: 'super_admin' as AdminRole });
  }

  return null;
}
