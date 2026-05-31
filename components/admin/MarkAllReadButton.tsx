'use client';

import { useTransition } from 'react';
import { markAllNotificationsRead } from '@/app/admin/actions';

export default function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition();

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllNotificationsRead();
    });
  };

  return (
    <button
      onClick={handleMarkAllRead}
      disabled={isPending}
      className="border border-black/20 px-3 py-1 text-[8px] font-black tracking-wider text-black/40 hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-50"
    >
      {isPending ? 'Processing...' : 'Mark All Read'}
    </button>
  );
}
