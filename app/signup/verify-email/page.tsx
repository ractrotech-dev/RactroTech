import Link from 'next/link';
import { MailCheck } from 'lucide-react';

import VerifyEmailForm from '@/components/VerifyEmailForm';
import { AuthShell } from '@/components/marketing/auth-shell';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Verify Email',
  description: 'Confirm your RactroTech account email address.',
  noIndex: true,
});

export default function VerifyEmailPage({ searchParams }: { searchParams: { email?: string } }) {
  const email = searchParams.email ?? '';

  return (
    <AuthShell
      eyebrow="One more step"
      title="Check your email"
      description={`We sent a verification link${email ? ` to ${email}` : ''}. Click it to activate your account before signing in.`}
      footer={
        <>
          Already verified?{' '}
          <Link
            href="/login"
            className="font-medium text-mkt-violet underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mkt-mint text-mkt-success">
          <MailCheck className="h-7 w-7" strokeWidth={2} aria-hidden />
        </span>
      </div>
      <VerifyEmailForm email={email} />
    </AuthShell>
  );
}
