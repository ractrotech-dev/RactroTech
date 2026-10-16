'use client';

import { useTransition } from 'react';

import { updateLeadStatus } from '@/app/admin/outreach/actions';
import { LEAD_STATUSES } from '@/lib/outreach/constants';
import { formatLabel } from '@/lib/admin/format';
import { cn } from '@/lib/utils';

export function LeadStatusSelect({ id, status }: { id: number; status: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      aria-label="Lead status"
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => updateLeadStatus(id, next));
      }}
      className={cn(
        'h-8 rounded-lg border border-mkt-line bg-mkt-surface px-2 text-[13px] text-mkt-ink focus:border-mkt-violet focus:outline-none',
        pending && 'opacity-60'
      )}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {formatLabel(s)}
        </option>
      ))}
    </select>
  );
}
