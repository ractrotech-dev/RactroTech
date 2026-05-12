import { createClient } from "@/utils/supabase/server";
import { getAdminUser } from "@/utils/admin";
import { constructMetadata } from "@/lib/seo";
import AdminShell from "@/components/admin/AdminShell";
import DatabaseError from "@/components/admin/DatabaseError";
import AdminAccessDenied from "@/components/admin/AdminAccessDenied";

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

  let adminUser;
  try {
    adminUser = await getAdminUser();
  } catch (error: any) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <DatabaseError message={error.message} />
      </div>
    );
  }

  if (!adminUser) {
    return <AdminAccessDenied email={user.email ?? "unknown"} />;
  }

  return (
    <AdminShell
      adminEmail={adminUser.email ?? 'admin'}
      adminRole={adminUser.dbRole}
    >
      {children}
    </AdminShell>
  );
}
