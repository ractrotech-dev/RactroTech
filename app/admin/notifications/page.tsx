import { count, desc, eq } from 'drizzle-orm';
import { Bell } from 'lucide-react';

import EmptyState from '@/components/admin/EmptyState';
import MarkAllReadButton from '@/components/admin/MarkAllReadButton';
import NotificationItem from '@/components/admin/NotificationItem';
import PageHeader from '@/components/admin/PageHeader';
import { AdminCard, CardHeader, Notice } from '@/components/admin/ui';
import { formatCount } from '@/lib/admin/format';
import { db } from '@/utils/db/db';
import { notificationsTable, type SelectNotification } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Notifications | Admin | RactroTech', description: 'View notifications' };

const PAGE_SIZE = 50;

async function loadLatest(): Promise<SelectNotification[] | null> {
  try {
    return await db.select().from(notificationsTable).orderBy(desc(notificationsTable.created_at)).limit(PAGE_SIZE);
  } catch {
    return null;
  }
}

/** Counted over the whole table, not the page of 50. `null` when the query fails. */
async function countNotifications(unreadOnly: boolean): Promise<number | null> {
  try {
    const [row] = await db
      .select({ value: count() })
      .from(notificationsTable)
      .where(unreadOnly ? eq(notificationsTable.read, false) : undefined);
    return Number(row?.value ?? 0);
  } catch {
    return null;
  }
}

export default async function AdminNotificationsPage() {
  const [notifications, unreadCount, totalCount] = await Promise.all([
    loadLatest(),
    countNotifications(true),
    countNotifications(false),
  ]);

  const shown = notifications?.length ?? 0;
  const showMarkAll = unreadCount !== null ? unreadCount > 0 : (notifications ?? []).some((n) => !n.read);

  let listDescription = 'Newest first';
  if (notifications !== null) {
    if (totalCount === null) listDescription = `Latest ${formatCount(shown)}, newest first`;
    else if (totalCount > shown) listDescription = `Latest ${formatCount(shown)} of ${formatCount(totalCount)}, newest first`;
    else listDescription = `${formatCount(totalCount)} in total, newest first`;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle={`${formatCount(unreadCount)} unread`} backHref="/admin" />

      {notifications === null ? (
        <Notice tone="amber" title="Notifications couldn’t be loaded">
          The database didn’t respond. Reload the page to try again.
        </Notice>
      ) : null}

      <AdminCard>
        <CardHeader title="Inbox" description={listDescription} action={showMarkAll ? <MarkAllReadButton /> : null} />

        {notifications === null ? (
          <EmptyState icon={<Bell />} title="Nothing to show" description="Notifications appear here once they can be loaded." />
        ) : notifications.length === 0 ? (
          <EmptyState icon={<Bell />} title="You’re all caught up" description="Notifications appear here when something happens." />
        ) : (
          <ul className="divide-y divide-mkt-line">
            {notifications.map((n) => (
              <li key={n.id}>
                <NotificationItem
                  notification={{
                    id: n.id,
                    type: n.type,
                    title: n.title,
                    message: n.message,
                    read: n.read,
                    created_at: n.created_at ? new Date(n.created_at).toISOString() : null,
                    action_url: n.action_url,
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
