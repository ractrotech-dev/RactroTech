import Link from 'next/link';
import { Check } from 'lucide-react';

import { AuthShell } from '@/components/marketing/auth-shell';

export default function ResetPasswordSuccess() {
  return (
    <AuthShell
      eyebrow="Password reset"
      title="Password updated"
      description="Your password has been changed. You can sign in with it now."
    >
      <div className="py-4 text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-mkt-mint text-mkt-success">
          <Check className="h-7 w-7" strokeWidth={2.5} aria-hidden />
        </span>
        <Link href="/login" className="mkt-btn-primary w-full">
          Go to login
        </Link>
      </div>
    </AuthShell>
  );
}
