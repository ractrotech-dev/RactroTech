import { createClient } from "@/utils/supabase/server";
import { getAdminUser } from "@/utils/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Admin | RactroTech",
  description: "Admin dashboard",
};

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
    redirect("/login");
  }

  const adminUser = await getAdminUser();
  if (!adminUser) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-lg font-bold uppercase tracking-wide text-black"
            >
              Admin
            </Link>
            <nav className="flex gap-4 text-sm font-medium">
              <Link href="/admin" className="text-gray-600 hover:text-black">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-gray-600 hover:text-black">
                Users
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{adminUser.email}</span>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              Back to app
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
