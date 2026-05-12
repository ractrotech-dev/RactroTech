import { db } from "@/utils/db/db";
import { notificationsTable } from "@/utils/db/schema";
import { desc } from "drizzle-orm";
import { Bell, Inbox, FolderKanban, Users, AlertCircle, Settings } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import EmptyState from "@/components/admin/EmptyState";
import NotificationItem from "@/components/admin/NotificationItem";
import MarkAllReadButton from "@/components/admin/MarkAllReadButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifications | Admin | RactroTech", description: "View notifications" };

const iconMap: Record<string, any> = {
  inquiry: Inbox, project: FolderKanban, client: Users,
  team: Users, system: Settings, alert: AlertCircle,
};
const colorMap: Record<string, string> = {
  inquiry: 'bg-blue-400', project: 'bg-yellow-400', client: 'bg-emerald-400',
  team: 'bg-purple-400', system: 'bg-gray-400', alert: 'bg-red-400',
};

export default async function AdminNotificationsPage() {
  let notifications: any[] = [];
  try {
    notifications = await db.select().from(notificationsTable).orderBy(desc(notificationsTable.created_at)).limit(50);
  } catch { /* table may not exist */ }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" subtitle={`${unreadCount} unread notifications`} backHref="/admin" />

      <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-4 border-black px-5 py-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em]">Notification Center</h2>
          {unreadCount > 0 && <MarkAllReadButton />}
        </div>

        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up! Notifications will appear here when something happens." />
        ) : (
          <div className="divide-y-2 divide-black/5">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                iconMap={iconMap}
                colorMap={colorMap}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
