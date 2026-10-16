import { count, sql } from 'drizzle-orm';
import { DollarSign, FolderKanban, Inbox, TrendingUp, UserCircle } from 'lucide-react';

import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { AdminCard, CardHeader, DataTable, KpiCard, Notice, table } from '@/components/admin/ui';
import { formatCount, formatCurrency, formatPercent } from '@/lib/admin/format';
import type { ChartPoint } from '@/lib/admin/dashboard-snapshot';
import { db } from '@/utils/db/db';
import {
  clientsTable,
  inquiryStatusEnum,
  projectEnquiriesTable,
  projectStatusEnum,
  projectsTable,
} from '@/utils/db/schema';
import DashboardCharts from '../DashboardCharts';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Analytics | Admin | RactroTech', description: 'Business intelligence' };

type StatusCount = { status: string; count: number };

/** Runs one query; a failure is recorded and comes back as `null`, which the page shows as "—". */
async function safe<T>(label: string, errors: string[], fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (e) {
    errors.push(`${label}: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}

/** Every status in the enum, in workflow order, with a real 0 for statuses that have no rows. */
function withAllStatuses(rows: { status: string; count: number }[], statuses: readonly string[]): StatusCount[] {
  const byStatus = new Map(rows.map((r) => [r.status, Number(r.count)]));
  return statuses.map((status) => ({ status, count: byStatus.get(status) ?? 0 }));
}

/** The last 7 UTC days, oldest first — the same window and labels as the dashboard chart. */
function last7UtcDays(): Date[] {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (6 - i))));
}

export default async function AdminAnalyticsPage() {
  const errors: string[] = [];

  const [inquiryRows, projectRows, budgets, clients, inquiryDays] = await Promise.all([
    safe('inquiries by status', errors, () =>
      db
        .select({ status: projectEnquiriesTable.status, count: count() })
        .from(projectEnquiriesTable)
        .groupBy(projectEnquiriesTable.status)
    ),
    safe('projects by status', errors, () =>
      db.select({ status: projectsTable.status, count: count() }).from(projectsTable).groupBy(projectsTable.status)
    ),
    // `budget` is `real`: sum as float8 so cents survive and large totals can't overflow an int.
    safe('project budgets', errors, async () => {
      const [row] = await db
        .select({
          total: sql<number | null>`sum(${projectsTable.budget})::float8`,
          budgeted: count(projectsTable.budget),
        })
        .from(projectsTable);
      return { total: row?.total === null || row?.total === undefined ? 0 : Number(row.total), budgeted: Number(row?.budgeted ?? 0) };
    }),
    safe('clients', errors, async () => {
      const [row] = await db
        .select({
          total: count(),
          active: sql<number>`count(*) filter (where ${clientsTable.status} = 'active')::int`,
        })
        .from(clientsTable);
      return { total: Number(row?.total ?? 0), active: Number(row?.active ?? 0) };
    }),
    safe('inquiry series', errors, () =>
      db
        .select({
          day: sql<string>`to_char((${projectEnquiriesTable.created_at} at time zone 'UTC')::date, 'YYYY-MM-DD')`,
          value: count(),
        })
        .from(projectEnquiriesTable)
        .where(sql`${projectEnquiriesTable.created_at} >= now() - interval '9 days'`)
        .groupBy(sql`1`)
    ),
  ]);

  const inquiries = inquiryRows ? withAllStatuses(inquiryRows, inquiryStatusEnum.enumValues) : null;
  const projects = projectRows ? withAllStatuses(projectRows, projectStatusEnum.enumValues) : null;

  const inquiryTotal = inquiries ? inquiries.reduce((sum, s) => sum + s.count, 0) : null;
  const newInquiries = inquiries?.find((s) => s.status === 'new')?.count ?? null;
  const converted = inquiries?.find((s) => s.status === 'converted')?.count ?? null;
  const conversionRate = inquiryTotal && converted !== null ? (converted / inquiryTotal) * 100 : null;

  let inquirySeries: ChartPoint[] | undefined;
  if (inquiryDays) {
    const byDay = new Map(inquiryDays.map((r) => [r.day, Number(r.value)]));
    inquirySeries = last7UtcDays().map((d) => ({
      name: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
      value: byDay.get(d.toISOString().slice(0, 10)) ?? 0,
    }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Inquiries, conversion, clients and project budgets, from the CRM. Site traffic isn’t connected yet."
        backHref="/admin"
      />

      {errors.length > 0 ? (
        <Notice tone="amber" title="Some numbers couldn’t be loaded">
          Those show as “—” until the query succeeds. First error: {errors[0]}
        </Notice>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key numbers">
        <KpiCard
          label="Inquiries"
          value={formatCount(inquiryTotal)}
          hint={newInquiries === null ? 'New count unavailable' : `${formatCount(newInquiries)} new`}
          href="/admin/inquiries"
          icon={<Inbox />}
        />
        <KpiCard
          label="Inquiry conversion"
          value={formatPercent(conversionRate)}
          hint={
            inquiryTotal === null
              ? 'Unavailable'
              : inquiryTotal === 0
                ? 'No inquiries yet'
                : `${formatCount(converted)} of ${formatCount(inquiryTotal)} converted`
          }
          icon={<TrendingUp />}
        />
        <KpiCard
          label="Clients"
          value={formatCount(clients?.total)}
          hint={clients ? `${formatCount(clients.active)} active` : 'Unavailable'}
          href="/admin/clients"
          icon={<UserCircle />}
        />
        <KpiCard
          label="Project budgets"
          value={formatCurrency(budgets?.total)}
          hint={
            budgets === null
              ? 'Unavailable'
              : budgets.budgeted === 0
                ? 'No project has a budget yet'
                : `Sum across ${formatCount(budgets.budgeted)} ${budgets.budgeted === 1 ? 'project' : 'projects'} with a budget, any status`
          }
          href="/admin/projects"
          icon={<DollarSign />}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <StatusTable
          title="Inquiries by status"
          description="Every inquiry, by where it is now"
          rows={inquiries}
          total={inquiryTotal}
          emptyTitle="No inquiries yet"
          icon={<Inbox />}
        />
        <StatusTable
          title="Projects by status"
          description="Every project, by where it is now"
          rows={projects}
          total={projects ? projects.reduce((sum, s) => sum + s.count, 0) : null}
          emptyTitle="No projects yet"
          icon={<FolderKanban />}
        />
      </section>

      <DashboardCharts inquirySeries={inquirySeries} />
    </div>
  );
}

function StatusTable({
  title,
  description,
  rows,
  total,
  emptyTitle,
  icon,
}: {
  title: string;
  description: string;
  rows: StatusCount[] | null;
  total: number | null;
  emptyTitle: string;
  icon: React.ReactElement;
}) {
  return (
    <AdminCard>
      <CardHeader
        title={title}
        description={description}
        action={<span className="text-[13px] font-medium tabular-nums text-mkt-muted">{formatCount(total)} total</span>}
      />
      {rows === null || total === null ? (
        <EmptyState icon={icon} title="Couldn’t load these counts" description="They appear here once the query succeeds." />
      ) : total === 0 ? (
        <EmptyState icon={icon} title={emptyTitle} />
      ) : (
        <DataTable>
          <thead>
            <tr className={table.headRow}>
              <th className={table.th}>Status</th>
              <th className={table.thNum}>Count</th>
              <th className={table.thNum}>Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const share = (row.count / total) * 100;
              return (
                <tr key={row.status} className={table.row}>
                  <td className={table.td}>
                    <StatusBadge status={row.status} />
                  </td>
                  <td className={`${table.tdNum} font-medium`}>{formatCount(row.count)}</td>
                  <td className={table.tdNum}>
                    <span className="inline-flex items-center justify-end gap-3">
                      <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-mkt-ink/[0.08] sm:block" aria-hidden>
                        <span className="block h-full rounded-full bg-mkt-violet" style={{ width: `${share}%` }} />
                      </span>
                      <span className="w-10 text-mkt-muted">{formatPercent(share)}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      )}
    </AdminCard>
  );
}
