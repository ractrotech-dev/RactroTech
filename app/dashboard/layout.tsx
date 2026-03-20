import DashboardHeader from '@/components/DashboardHeader';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RactroTech',
  description: 'Welcome to RactroTech',
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signup');
  }

  // Read role from Supabase `users_table` (user_role column)
  const { data: profile, error } = await supabase
    .from('users_table')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !profile || profile.role !== 'admin') {
    return redirect('/');
  }

  return (
    <html lang="en">
      {/* <DashboardHeader /> */}
      {children}
    </html>
  );
}
