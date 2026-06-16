'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NotificationBellProps = {
  href?: string;
  count?: number;
  className?: string;
};

export function NotificationBell({ href = '/account', count = 0, className }: NotificationBellProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'relative h-9 w-9 shrink-0 rounded-full border-2 border-black bg-white hover:bg-yellow-50',
        className,
      )}
      asChild
    >
      <Link href={href} aria-label="Notifications">
        <Bell className="h-4 w-4" strokeWidth={2.5} />
        {count > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-black text-yellow-400">
            {count > 9 ? '9+' : count}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
