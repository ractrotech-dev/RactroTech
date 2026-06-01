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
        className="w-full border-2 border-black bg-black py-5 text-sm font-black tracking-widest text-yellow-400"
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
