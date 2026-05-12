'use client';

import { useState, useTransition } from 'react';
import { updateClientStatus } from '@/app/admin/actions';

interface ClientActionsProps {
  clientId: string;
  currentStatus: string;
}

const statuses = ['lead', 'onboarding', 'active', 'inactive', 'churned'] as const;

const statusColors: Record<string, string> = {
  lead: 'border-blue-300 bg-blue-50 text-blue-700',
  onboarding: 'border-yellow-400 bg-yellow-50 text-yellow-700',
  active: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  inactive: 'border-black/20 bg-gray-100 text-black/40',
  churned: 'border-red-300 bg-red-50 text-red-700',
};

export default function ClientActions({ clientId, currentStatus }: ClientActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: typeof statuses[number]) => {
    startTransition(async () => {
      await updateClientStatus(clientId, status);
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Manage Status</p>
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
      {isPending && (
        <p className="text-[9px] font-bold uppercase tracking-wider text-yellow-600 animate-pulse">
          Updating...
        </p>
      )}
    </div>
  );
}
