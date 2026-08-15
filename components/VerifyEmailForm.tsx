'use client';

import { Button } from '@/components/ui/button';
import { useFormState } from 'react-dom';
import { resendVerificationEmail } from '@/app/auth/actions';

export default function VerifyEmailForm({ email }: { email: string }) {
  const [formState, formAction] = useFormState(resendVerificationEmail, { message: '' });

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="email" value={email} />
      <Button
        type="submit"
        className="mkt-btn-primary w-full !py-3.5"
        disabled={!email}
      >
        Resend verification email
      </Button>
      {formState.message && (
        <p className="text-center text-xs font-bold text-black/70">{formState.message}</p>
      )}
    </form>
  );
}
