import Link from 'next/link';
import { redirect } from 'next/navigation';

import ResetPasswordForm from '@/components/ResetPasswordForm';
import { AuthShell } from '@/components/marketing/auth-shell';
import { createClient } from '@/utils/supabase/server';

export default async function ResetPassword() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/forgot-password?error=expired_link');
  }

  return (
    <AuthShell
      eyebrow="Password reset"
      title="Choose a new password"
      description="Pick something you have not used before on this account."
      footer={
        <Link
          href="/login"
          className="font-medium text-mkt-violet underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
