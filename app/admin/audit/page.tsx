import { count, inArray } from 'drizzle-orm';
import { Activity, Filter, Search } from 'lucide-react';

import { getActivityLogs } from '@/app/admin/actions';
import DatabaseError from '@/components/admin/DatabaseError';
import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import { AdminCard, Badge, CardHeader, DataTable, buttonClass, field, table } from '@/components/admin/ui';
import { formatCount, formatDateTime, formatLabel } from '@/lib/admin/format';
import { cn } from '@/lib/utils';
import { db } from '@/utils/db/db';
import { activityLogsTable, usersTable, type SelectActivityLog } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Audit Logs | Admin | RactroTech', description: 'System audit trail' };

const LIMIT = 200;

/** Every entry in the trail, not just the page shown. `null` when the query fails. */
async function countAllLogs(): Promise<number | null> {
  try {
    const [row] = await db.select({ value: count() }).from(activityLogsTable);
    return Number(row?.value ?? 0);
  } catch {
    return null;
  }
}

export default async function AdminAuditPage() {
  let logs: SelectActivityLog[];
  try {
    logs = await getActivityLogs(LIMIT);
  } catch (e: unknown) {
    return <DatabaseError message={e instanceof Error ? e.message : 'Could not load audit logs'} />;
  }

  // Names only for the people in these logs (this used to load every user).
  const userIds = Array.from(new Set(logs.map((l) => l.user_id).filter((id): id is string => Boolean(id))));
  const [users, totalCount] = await Promise.all([
    userIds.length > 0
      ? db
          .select({ id: usersTable.id, name: usersTable.name })
          .from(usersTable)
          .where(inArray(usersTable.id, userIds))
          .catch(() => [] as { id: string; name: string }[])
      : Promise.resolve([] as { id: string; name: string }[]),
    countAllLogs(),
  ]);
  const userMap = new Map(users.map((u) => [u.id, u.name]));

  let description = 'Newest first';
  if (totalCount === null) description = `Latest ${formatCount(logs.length)} entries, newest first`;
  else if (totalCount > logs.length) description = `Latest ${formatCount(logs.length)} of ${formatCount(totalCount)} entries, newest first`;
  else description = `${formatCount(totalCount)} ${totalCount === 1 ? 'entry' : 'entries'}, newest first`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit log"
        subtitle={`Who changed what, and when. ${formatCount(totalCount)} ${totalCount === 1 ? 'entry' : 'entries'} recorded.`}
        backHref="/admin"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mkt-muted" aria-hidden />
          <input type="text" placeholder="Search logs…" aria-label="Search logs" className={cn(field.input, 'pl-9')} />
        </div>
        <button type="button" className={buttonClass('secondary')}>
          <Filter aria-hidden /> All entities
        </button>
      </div>

      <AdminCard>
        <CardHeader title="Activity history" description={description} />

        {logs.length === 0 ? (
          <EmptyState icon={<Activity />} title="No activity yet" description="Admin actions are recorded here as they happen." />
        ) : (
          <DataTable>
            <thead>
              <tr className={table.headRow}>
                <th className={table.th}>Time</th>
                <th className={table.th}>Admin</th>
                <th className={table.th}>Action</th>
                <th className={table.th}>Entity</th>
                <th className={table.th}>IP address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const name = log.user_id ? userMap.get(log.user_id) : undefined;
                return (
                  <tr key={log.id} className={table.row}>
                    <td className={`${table.td} whitespace-nowrap tabular-nums ${table.muted}`}>
                      <time dateTime={new Date(log.created_at).toISOString()}>{formatDateTime(log.created_at)}</time>
                    </td>
                    <td className={table.td}>
                      <span className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mkt-lavender text-[12px] font-semibold text-mkt-violet"
                          aria-hidden
                        >
                          {(name ?? (log.user_id ? '?' : 'S')).charAt(0).toUpperCase()}
                        </span>
                        <span className={cn('whitespace-nowrap', !name && table.muted)}>
                          {name ?? (log.user_id ? 'Unknown user' : 'System')}
                        </span>
                      </span>
                    </td>
                    <td className={`${table.td} font-medium`}>{log.action}</td>
                    <td className={table.td}>
                      <Badge>{formatLabel(log.entity_type)}</Badge>
                    </td>
                    <td className={`${table.td} whitespace-nowrap font-mono text-[12px] ${table.muted}`}>
                      {log.ip_address || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        )}
      </AdminCard>
    </div>
  );
}
