'use client';

import { useTransition } from 'react';
import { CheckCheck } from 'lucide-react';

import { markAllNotificationsRead } from '@/app/admin/actions';
import { buttonClass } from '@/components/admin/ui';

export default function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition();

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllNotificationsRead();
    });
  };

  return (
    <button type="button" onClick={handleMarkAllRead} disabled={isPending} className={buttonClass('secondary', 'sm')}>
      <CheckCheck aria-hidden />
      {isPending ? 'Marking…' : 'Mark all as read'}
    </button>
  );
}
