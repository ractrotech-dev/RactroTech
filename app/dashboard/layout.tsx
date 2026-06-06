import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

import { constructMetadata } from '@/lib/seo';
import DatabaseError from '@/components/admin/DatabaseError';
import { ensureAuthUserInDb } from '@/utils/auth-user-sync';

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

  try {
    await ensureAuthUserInDb(user, supabase);
  } catch (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <DatabaseError message={syncErrorMessage(error)} />
      </div>
    );
  }

  return <>{children}</>;
}
