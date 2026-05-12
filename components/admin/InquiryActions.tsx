'use client';

import { useState, useTransition } from 'react';
import { updateInquiryStatus, updateInquiryPriority } from '@/app/admin/actions';

interface InquiryActionsProps {
  inquiryId: string;
  currentStatus: string;
  currentPriority: string;
}

const statuses = ['new', 'in_progress', 'responded', 'converted', 'closed'] as const;
const priorities = ['low', 'medium', 'high', 'urgent'] as const;

const statusColors: Record<string, string> = {
  new: 'border-blue-300 bg-blue-50 text-blue-700',
  in_progress: 'border-yellow-400 bg-yellow-50 text-yellow-700',
  responded: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  converted: 'border-purple-300 bg-purple-50 text-purple-700',
  closed: 'border-black/20 bg-gray-100 text-black/40',
};

const priorityColors: Record<string, string> = {
  low: 'border-gray-300 bg-gray-50 text-gray-600',
  medium: 'border-yellow-400 bg-yellow-50 text-yellow-700',
  high: 'border-orange-400 bg-orange-50 text-orange-700',
  urgent: 'border-red-500 bg-red-100 text-red-700',
};

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
    <div className="space-y-4">
      {/* Status control */}
      <div>
        <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Status</p>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={isPending || s === currentStatus}
              className={`border-2 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-all ${
                s === currentStatus
                  ? statusColors[s]
                  : 'border-black/10 bg-white text-black/30 hover:border-black hover:bg-black hover:text-white'
              } disabled:opacity-50`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Priority control */}
      <div>
        <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Priority</p>
        <div className="flex flex-wrap gap-1.5">
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => handlePriorityChange(p)}
              disabled={isPending || p === currentPriority}
              className={`border-2 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-all ${
                p === currentPriority
                  ? priorityColors[p]
                  : 'border-black/10 bg-white text-black/30 hover:border-black hover:bg-black hover:text-white'
              } disabled:opacity-50`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {isPending && (
        <p className="text-[9px] font-bold uppercase tracking-wider text-yellow-600 animate-pulse">
          Updating...
        </p>
      )}
    </div>
  );
}
