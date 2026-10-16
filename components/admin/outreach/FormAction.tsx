'use client';

import type { ReactNode } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import type { ActionState } from '@/app/admin/outreach/actions';
import { field } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

/** A form around a `(state, formData)` server action that shows the action's result line. */
export function FormAction({
  action,
  children,
  className,
}: {
  action: (s: ActionState, fd: FormData) => Promise<ActionState>;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction] = useFormState(action, {});
  return (
    <form action={formAction} className={className}>
      <PendingFieldset>{children}</PendingFieldset>
      <ActionResult state={state} className="col-span-full" />
    </form>
  );
}

/** Disables every control while the form's action runs. */
export function PendingFieldset({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <fieldset disabled={pending} className="contents">
      {children}
    </fieldset>
  );
}

export function ActionResult({ state, className }: { state: ActionState; className?: string }) {
  if (state.error) return <p className={cn(field.error, 'text-[13px]', className)}>{state.error}</p>;
  if (state.ok) return <p className={cn('mt-1.5 text-[13px] text-emerald-700 dark:text-emerald-300', className)}>{state.ok}</p>;
  return null;
}

/** Submit button that shows `pendingLabel` while its form's action runs. */
export function SubmitButton({
  children,
  pendingLabel,
  className,
  disabled,
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={disabled || pending}>
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
