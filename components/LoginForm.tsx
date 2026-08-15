'use client';
import { Loader2 } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';

import { Label } from '@/components/ui/label';
import { loginUser } from '@/app/auth/actions';
import { authFieldClass, authLabelClass } from '@/components/marketing/auth-shell';

function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending} disabled={pending} className="mkt-btn-primary mt-2 w-full !py-3.5">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in…
        </>
      ) : (
        'Log in'
      )}
    </button>
  );
}

export default function LoginForm() {
  const initialState = {
    message: '',
  };
  const [formState, formAction] = useFormState(loginUser, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="email" className={authLabelClass}>
          Email
        </Label>
        <input
          id="email"
          type="email"
          placeholder="you@company.com"
          name="email"
          required
          autoComplete="email"
          className={authFieldClass}
        />
      </div>

      <div>
        <Label htmlFor="password" className={authLabelClass}>
          Password
        </Label>
        <input
          id="password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className={authFieldClass}
        />
      </div>

      <LoginSubmitButton />

      {formState?.message ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-center text-[14px] font-medium text-red-700">
          {formState.message}
        </p>
      ) : null}
    </form>
  );
}
