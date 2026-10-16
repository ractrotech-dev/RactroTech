'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { convertLeadToClient } from '@/app/admin/outreach/actions';
import { buttonClass, field } from '@/components/admin/ui';

/** Turns a lead into a RactroTech client, then opens the new client. */
export function ConvertToClientButton({ leadId }: { leadId: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        className={buttonClass('secondary', 'sm')}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            try {
              const clientId = await convertLeadToClient(leadId);
              router.push(`/admin/clients/${clientId}`);
            } catch (e) {
              setError(e instanceof Error ? e.message : String(e));
            }
          })
        }
      >
        {pending ? 'Converting…' : 'Convert to client'}
      </button>
      {error ? <p className={field.error}>{error}</p> : null}
    </div>
  );
}
