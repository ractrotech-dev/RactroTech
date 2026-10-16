'use client';

import { useFormState } from 'react-dom';

import { sendNowAction, type ActionState } from '@/app/admin/outreach/actions';
import { buttonClass } from '@/components/admin/ui';

import { ActionResult, SubmitButton } from './FormAction';

/** Sends the next batch of queued emails now instead of waiting for the scheduler. */
export function SendNowButton() {
  const [state, action] = useFormState<ActionState, FormData>(() => sendNowAction(), {});
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <ActionResult state={state} className="mt-0" />
      <SubmitButton className={buttonClass('primary')} pendingLabel="Sending…">
        Send next batch now
      </SubmitButton>
    </form>
  );
}
