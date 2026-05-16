import DashboardHeader from '@/components/DashboardHeader';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

import { constructMetadata } from '@/lib/seo';
import { ensureAuthUserInDb } from '@/utils/auth-user-sync';
import { ADMIN_ROLES, type AdminRole } from '@/utils/admin-roles';

export const metadata: Metadata = constructMetadata({
  title: 'Dashboard',
  description: 'Welcome to your RactroTech Dashboard',
  noIndex: true,
});

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return redirect('/signup');
  }

  await ensureAuthUserInDb(user);

  const { data: profile, error } = await supabase
    .from('users_table')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role = profile?.role as AdminRole | undefined;
  if (error || !role || !ADMIN_ROLES.includes(role)) {
    return redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
