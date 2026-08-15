import Link from 'next/link';
import { MailCheck } from 'lucide-react';

import { AuthShell } from '@/components/marketing/auth-shell';

export default function ForgotPasswordSuccess() {
  return (
    <AuthShell
      eyebrow="Password reset"
      title="Check your email"
      description="If an account matches that address, a password reset link is on its way."
      footer={
        <>
          Back to{' '}
          <Link
            href="/login"
            className="font-medium text-mkt-violet underline-offset-4 hover:underline"
          >
            login
          </Link>
        </>
      }
    >
      <div className="py-4 text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-mkt-mint text-mkt-success">
          <MailCheck className="h-7 w-7" strokeWidth={2} aria-hidden />
        </span>
        <p className="text-[15px] leading-relaxed text-mkt-muted">
          The link expires shortly for security. If it does not arrive within a few minutes, check
          your spam folder or request another.
        </p>
      </div>
    </AuthShell>
  );
}
