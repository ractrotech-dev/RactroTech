'use client';
import { Button } from '@/components/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { loginUser } from '@/app/auth/actions';

function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-black text-base font-semibold text-white transition-opacity hover:bg-black/90 focus:ring-2 focus:ring-black focus:ring-offset-1"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? 'Logging in...' : 'Log in'}
    </Button>
  );
}

export default function LoginForm() {
  const initialState = {
    message: '',
  };
  const [formState, formAction] = useFormState(loginUser, initialState);

  return (
    <form action={formAction} className="flex flex-col space-y-3">
      {formState?.message && (
        <div className="mb-2 flex items-center justify-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>{formState.message}</p>
        </div>
      )}

      <div className="flex flex-col rounded-lg bg-[#f0f0f0] px-4 py-2 focus-within:ring-2 focus-within:ring-black">
        <label
          htmlFor="email"
          className="text-[10px] font-bold uppercase tracking-wider text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="h-7 w-full border-none bg-transparent p-0 text-sm font-medium text-black outline-none focus:ring-0"
        />
      </div>

      <div className="flex flex-col rounded-lg bg-[#f0f0f0] px-4 py-2 focus-within:ring-2 focus-within:ring-black">
        <label
          htmlFor="password"
          className="text-[10px] font-bold uppercase tracking-wider text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          required
          className="h-7 w-full border-none bg-transparent p-0 text-sm font-medium text-black outline-none focus:ring-0"
        />
      </div>

      <LoginSubmitButton />
    </form>
  );
}
