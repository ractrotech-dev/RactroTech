import DashboardHeader from '@/components/DashboardHeader';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

import { constructMetadata } from '@/lib/seo';
import DatabaseError from '@/components/admin/DatabaseError';
import { ensureAuthUserInDb } from '@/utils/auth-user-sync';
import { ADMIN_ROLES, type AdminRole } from '@/utils/admin-roles';
import { isEmailVerified } from '@/lib/auth/verification';

export const metadata: Metadata = constructMetadata({
  title: 'Dashboard',
  description: 'Welcome to your RactroTech Dashboard',
  noIndex: true,
});

function syncErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Could not sync your profile. Check Supabase table policies for users_table.';
}

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
    redirect('/signup');
  }

  if (!isEmailVerified(user)) {
    redirect(`/signup/verify-email?email=${encodeURIComponent(user.email)}`);
  }

  try {
    await ensureAuthUserInDb(user, supabase);
  } catch (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex min-h-[50vh] flex-1 items-center justify-center p-6">
          <DatabaseError message={syncErrorMessage(error)} />
        </div>
      </div>
    );
  }

  const { data: profile, error } = await supabase
    .from('users_table')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role = profile?.role as AdminRole | undefined;
  if (error || !role || !ADMIN_ROLES.includes(role)) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
