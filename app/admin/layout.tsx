import { createClient } from "@/utils/supabase/server";
import { getAdminUser } from "@/utils/admin";
import { constructMetadata } from "@/lib/seo";
import AdminShell from "@/components/admin/AdminShell";
import DatabaseError from "@/components/admin/DatabaseError";
import AdminAccessDenied from "@/components/admin/AdminAccessDenied";
import { isEmailVerified } from "@/lib/auth/verification";
import { redirect } from "next/navigation";
import { count, eq } from "drizzle-orm";
import { db } from "@/utils/db/db";
import { notificationsTable } from "@/utils/db/schema";

/** The header bell's number. Null — no badge — when it cannot be read, never a guess. */
async function unreadNotificationCount(): Promise<number | null> {
  try {
    const [row] = await db.select({ value: count() }).from(notificationsTable).where(eq(notificationsTable.read, false));
    return Number(row?.value ?? 0);
  } catch {
    return null;
  }
}

export const metadata = constructMetadata({
  title: "Admin Dashboard",
  description: "RactroTech Admin Dashboard",
  noIndex: true,
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Middleware redirects unauthenticated users to `/admin/login`.
    // Returning children here avoids redirect loops and lets the admin login page render.
    return children;
  }

  if (!isEmailVerified(user)) {
    redirect(`/signup/verify-email?email=${encodeURIComponent(user.email ?? '')}`);
  }

  let adminUser;
  try {
    adminUser = await getAdminUser();
  } catch (error: any) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mkt-surface">
        <DatabaseError message={error.message} />
      </div>
    );
  }

  if (!adminUser) {
    return <AdminAccessDenied email={user.email ?? "unknown"} />;
  }

  const unreadCount = await unreadNotificationCount();

  return (
    <AdminShell
      adminEmail={adminUser.email ?? 'admin'}
      adminRole={adminUser.dbRole}
      unreadCount={unreadCount}
    >
      {children}
    </AdminShell>
  );
}
