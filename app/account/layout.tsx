import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { constructMetadata } from '@/lib/seo';
import { isEmailVerified } from '@/lib/auth/verification';
import { createClient } from '@/utils/supabase/server';
import { ensureAuthUserInDb } from '@/utils/auth-user-sync';

export const metadata: Metadata = constructMetadata({
  title: 'Account',
  description: 'Manage your RactroTech account, profile, and preferences.',
  noIndex: true,
});

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email && !isEmailVerified(user)) {
    redirect(`/signup/verify-email?email=${encodeURIComponent(user.email)}`);
  }

  if (user) {
    await ensureAuthUserInDb(user);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <SiteHeader tone="surface" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
