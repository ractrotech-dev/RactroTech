'use client';

import { useTransition } from 'react';
import { AlertCircle, Bell, FolderKanban, Inbox, MessageSquareReply, Settings, Users, type LucideIcon } from 'lucide-react';

import { markNotificationRead } from '@/app/admin/actions';
import { formatDateTime, formatRelative } from '@/lib/admin/format';
import { cn } from '@/lib/utils';

/**
 * Icons are looked up here, inside the client component. The page (a Server Component)
 * passes plain data only: a lucide icon is a forwardRef object and cannot cross the
 * server/client boundary as a prop.
 */
const ICON: Record<string, LucideIcon> = {
  inquiry: Inbox,
  project: FolderKanban,
  client: Users,
  team: Users,
  system: Settings,
  alert: AlertCircle,
  lead: MessageSquareReply,
};

export interface NotificationItemData {
  id: string;
  type: string;
  title: string;
  message: string | null;
  read: boolean;
  /** ISO string from the server (a Date is accepted too). */
  created_at: string | Date | null;
  action_url: string | null;
}

interface NotificationItemProps {
  notification: NotificationItemData;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const [isPending, startTransition] = useTransition();
  const unread = !notification.read;

  const handleMarkRead = () => {
    if (notification.read || isPending) return;
    startTransition(async () => {
      await markNotificationRead(notification.id);
    });
  };

  const Icon = ICON[notification.type] ?? Bell;
  const createdAt = notification.created_at ? new Date(notification.created_at) : null;
  const iso = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toISOString() : undefined;

  return (
    <div
      onClick={handleMarkRead}
      className={cn(
        'flex items-start gap-3 px-5 py-4 transition-colors',
        unread ? 'cursor-pointer bg-mkt-lavender/40 hover:bg-mkt-lavender/60' : 'hover:bg-mkt-ink/[0.025]',
        isPending && 'opacity-60'
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          unread ? 'bg-mkt-surface text-mkt-violet' : 'bg-mkt-ink/[0.05] text-mkt-muted'
        )}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className={cn('min-w-0 text-[14px] leading-6', unread ? 'font-semibold text-mkt-ink' : 'font-medium text-mkt-ink/80')}>
            {notification.title}
          </p>
          <div className="flex shrink-0 items-center gap-2 pt-0.5">
            {/* Relative time and the viewer's timezone differ between server and browser render. */}
            <time
              dateTime={iso}
              title={formatDateTime(createdAt)}
              suppressHydrationWarning
              className="whitespace-nowrap text-[12px] tabular-nums text-mkt-muted"
            >
              {formatRelative(createdAt)}
            </time>
            {unread ? (
              <span className="h-2 w-2 rounded-full bg-mkt-violet">
                <span className="sr-only">Unread</span>
              </span>
            ) : null}
          </div>
        </div>

        {notification.message ? <p className="mt-0.5 text-[14px] leading-6 text-mkt-muted">{notification.message}</p> : null}

        {notification.action_url || unread ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
            {notification.action_url ? (
              <a
                href={notification.action_url}
                onClick={(e) => e.stopPropagation()}
                className="font-medium text-mkt-violet underline-offset-4 hover:underline"
              >
                View details
              </a>
            ) : null}
            {unread ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkRead();
                }}
                disabled={isPending}
                className="font-medium text-mkt-muted transition-colors hover:text-mkt-ink disabled:opacity-50"
              >
                {isPending ? 'Marking…' : 'Mark as read'}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
