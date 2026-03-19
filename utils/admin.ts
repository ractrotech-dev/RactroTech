import { createClient } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";
import { db } from "@/utils/db/db";
import { usersTable } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

/**
 * Returns the current user if they are logged in AND their role in the DB is "admin".
 * Use in admin layout to protect routes. Returns null if not authenticated or not admin.
 */
export async function getAdminUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const [row] = await db
    .select({ role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.email, user.email));

  if (!row || row.role !== "admin") return null;
  return user;
}
