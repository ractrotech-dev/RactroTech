'use client';

import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

import { updateClientStatus } from '@/app/admin/actions';
import { buttonClass, field } from '@/components/admin/ui';
import { formatLabel } from '@/lib/admin/format';
import { cn } from '@/lib/utils';

interface ClientActionsProps {
  clientId: string;
  currentStatus: string;
}

const statuses = ['lead', 'onboarding', 'active', 'inactive', 'churned'] as const;

/** The current status reads as selected (accent), the others as plain secondary buttons. */
const SELECTED = 'border-mkt-violet/40 bg-mkt-lavender text-mkt-violet disabled:opacity-100';

export default function ClientActions({ clientId, currentStatus }: ClientActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: typeof statuses[number]) => {
    startTransition(async () => {
      await updateClientStatus(clientId, status);
    });
  };

  return (
    <div className="space-y-4">
      <fieldset className="min-w-0">
        <legend className={field.label}>Change status</legend>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => {
            const selected = s === currentStatus;
            return (
              <button
                key={s}
                type="button"
                onClick={() => handleStatusChange(s)}
                disabled={isPending || selected}
                aria-pressed={selected}
                className={cn(buttonClass('secondary', 'sm'), selected && SELECTED)}
              >
                {formatLabel(s)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <p role="status" aria-live="polite" className="flex min-h-5 items-center gap-1.5 text-[13px] text-mkt-muted">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Saving…
          </>
        ) : null}
      </p>
    </div>
  );
}
