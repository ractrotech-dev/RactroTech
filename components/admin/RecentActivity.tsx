import { AlertCircle, FileText, FolderPlus, Inbox, UserCircle, UserPlus } from 'lucide-react';

import { formatRelative } from '@/lib/admin/format';

interface ActivityItem {
  id: string;
  type: 'inquiry' | 'user' | 'project' | 'alert' | 'client' | 'system';
  title: string;
  description: string;
  /** ISO timestamp, or a ready-made label for older call sites. */
  time: string;
}

const ICON = {
  inquiry: Inbox,
  user: UserPlus,
  project: FolderPlus,
  alert: AlertCircle,
  client: UserCircle,
  system: FileText,
};

function when(time: string) {
  const parsed = Date.parse(time);
  return Number.isNaN(parsed) ? time : formatRelative(parsed);
}

/** Newest first. The icon says what kind of event it was; the colour stays out of it. */
export default function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <section className="rounded-2xl border border-mkt-line bg-mkt-surface text-mkt-ink">
      <div className="border-b border-mkt-line px-5 py-4">
        <h2 className="text-[15px] font-semibold leading-6">Recent activity</h2>
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-10 text-center text-[14px] text-mkt-muted">Nothing has happened yet.</p>
      ) : (
        <ul className="divide-y divide-mkt-line">
          {items.map((item) => {
            const Icon = ICON[item.type] ?? FileText;
            return (
              <li key={`${item.type}-${item.id}`} className="flex items-start gap-3 px-5 py-3.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mkt-ink/[0.05] text-mkt-muted">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">{item.title}</p>
                  <p className="truncate text-[13px] text-mkt-muted">{item.description}</p>
                </div>
                <time
                  className="shrink-0 whitespace-nowrap pt-0.5 text-[12px] tabular-nums text-mkt-muted"
                  dateTime={Number.isNaN(Date.parse(item.time)) ? undefined : item.time}
                >
                  {when(item.time)}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
