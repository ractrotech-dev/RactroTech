import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import { AuthShell } from '@/components/marketing/auth-shell';
import { constructMetadata, sitePath } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Forgot Password',
  description: 'Reset your Ractrotech account password.',
  canonicalUrl: sitePath('/forgot-password'),
  noIndex: true,
});

export default function ForgotPassword({ searchParams }: { searchParams: { error?: string } }) {
  const errorMessage =
    searchParams.error === 'expired_link'
      ? 'Your reset link has expired. Please request a new one.'
      : searchParams.error === 'missing_code'
        ? 'Invalid reset link. Please request a new password reset.'
        : null;

  return (
    <AuthShell
      eyebrow="Password reset"
      title="Forgot your password?"
      description="Enter the email on your account and we will send you a reset link."
      footer={
        <>
          Remembered it?{' '}
          <Link
            href="/login"
            className="font-medium text-mkt-violet underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </>
      }
    >
      {errorMessage ? (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-[14px] font-medium text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <ForgotPasswordForm />
    </AuthShell>
  );
}
