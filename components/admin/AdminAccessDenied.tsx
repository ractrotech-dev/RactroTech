import Link from 'next/link';
import { ShieldOff } from 'lucide-react';

import { buttonClass } from '@/components/admin/ui';

export default function AdminAccessDenied({ email }: { email: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mkt-ink/[0.02] p-6 text-mkt-ink">
      <div className="w-full max-w-md rounded-2xl border border-mkt-line bg-mkt-surface p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mkt-lavender text-mkt-violet">
          <ShieldOff className="h-5 w-5" aria-hidden />
        </span>
        <h1 className="mt-5 font-display text-[22px] font-semibold tracking-[-0.01em]">No admin access</h1>
        <p className="mt-2 text-[14px] leading-6 text-mkt-muted">
          You’re signed in as <span className="font-medium text-mkt-ink">{email}</span>, but this account isn’t an admin.
          Ask a Ractrotech administrator for access, or sign in with an approved account.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/auth/admin-sign-out" className={buttonClass('primary')}>
            Sign in with another account
          </Link>
          <Link href="/" className={buttonClass('secondary')}>
            Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
