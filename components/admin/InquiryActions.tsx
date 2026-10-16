'use client';

import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

import { updateInquiryStatus, updateInquiryPriority } from '@/app/admin/actions';
import { buttonClass, field } from '@/components/admin/ui';
import { formatLabel } from '@/lib/admin/format';
import { cn } from '@/lib/utils';

interface InquiryActionsProps {
  inquiryId: string;
  currentStatus: string;
  currentPriority: string;
}

const statuses = ['new', 'in_progress', 'responded', 'converted', 'closed'] as const;
const priorities = ['low', 'medium', 'high', 'urgent'] as const;

/** The current choice reads as selected (accent), the others as plain secondary buttons. */
const SELECTED = 'border-mkt-violet/40 bg-mkt-lavender text-mkt-violet disabled:opacity-100';

function OptionGroup<T extends string>({
  legend,
  options,
  current,
  disabled,
  onSelect,
}: {
  legend: string;
  options: readonly T[];
  current: string;
  disabled: boolean;
  onSelect: (value: T) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className={field.label}>{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = option === current;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              disabled={disabled || selected}
              aria-pressed={selected}
              className={cn(buttonClass('secondary', 'sm'), selected && SELECTED)}
            >
              {formatLabel(option)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function InquiryActions({ inquiryId, currentStatus, currentPriority }: InquiryActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: typeof statuses[number]) => {
    startTransition(async () => {
      await updateInquiryStatus(inquiryId, status);
    });
  };

  const handlePriorityChange = (priority: typeof priorities[number]) => {
    startTransition(async () => {
      await updateInquiryPriority(inquiryId, priority);
    });
  };

  return (
    <div className="space-y-5">
      <OptionGroup legend="Status" options={statuses} current={currentStatus} disabled={isPending} onSelect={handleStatusChange} />
      <OptionGroup legend="Priority" options={priorities} current={currentPriority} disabled={isPending} onSelect={handlePriorityChange} />

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
