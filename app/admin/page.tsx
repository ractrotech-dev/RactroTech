import { BarChart3, Bell, FileText, FolderKanban, Inbox, UserCircle, Users } from 'lucide-react';

import { AdminCard, Badge, CardHeader, DataTable, KpiCard, Notice, TextLink, buttonClass, table } from '@/components/admin/ui';
import DatabaseError from '@/components/admin/DatabaseError';
import { EmptyState } from '@/components/admin/EmptyState';
import MiniChart from '@/components/admin/MiniChart';
import RecentActivity from '@/components/admin/RecentActivity';
import { getAdminDashboardSnapshot } from '@/lib/admin/dashboard-snapshot';
import { formatCount, formatLabel } from '@/lib/admin/format';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const ADMIN_ROLES = new Set(['admin', 'super_admin']);

export default async function AdminDashboardPage() {
  const snapshot = await getAdminDashboardSnapshot();

  if (!snapshot.dbReachable && snapshot.dbErrorMessage) {
    return <DatabaseError message={snapshot.dbErrorMessage} />;
  }

  const { counts, recentUsers, activityItems, inquirySeries, partialErrors } = snapshot;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[28px]">Dashboard</h1>
          <p className="mt-1 text-[14px] text-mkt-muted">What needs attention across inquiries, clients and projects.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/inquiries" className={buttonClass('primary')}>
            <Inbox aria-hidden /> Review inquiries
          </Link>
          <Link href="/admin/content" className={buttonClass('secondary')}>
            <FileText aria-hidden /> Posts
          </Link>
        </div>
      </div>

      {partialErrors.length > 0 ? (
        <Notice tone="amber" title="Some numbers couldn’t be loaded">
          Those show as “—” until the query succeeds. First error: {partialErrors[0]}
        </Notice>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-label="Key numbers">
        <KpiCard
          label="Inquiries"
          value={formatCount(counts.inquiries)}
          hint={counts.newInquiries === null ? 'New count unavailable' : `${formatCount(counts.newInquiries)} new`}
          href="/admin/inquiries"
          icon={<Inbox />}
        />
        <KpiCard
          label="Projects"
          value={formatCount(counts.projects)}
          hint={counts.activeProjects === null ? 'Active count unavailable' : `${formatCount(counts.activeProjects)} active`}
          href="/admin/projects"
          icon={<FolderKanban />}
        />
        <KpiCard label="Clients" value={formatCount(counts.clients)} hint="In the CRM" href="/admin/clients" icon={<UserCircle />} />
        <KpiCard label="Users" value={formatCount(counts.users)} hint="Signed-up accounts" href="/admin/users" icon={<Users />} />
        <KpiCard
          label="Unread alerts"
          value={formatCount(counts.unreadNotifications)}
          hint="Notifications"
          href="/admin/notifications"
          icon={<Bell />}
        />
      </section>

      {inquirySeries ? (
        <MiniChart
          data={inquirySeries}
          title="Inquiries"
          subtitle="New inquiries per day, last 7 days (UTC)"
          totalLabel="This week"
        />
      ) : (
        <AdminCard>
          <EmptyState
            icon={BarChart3}
            title="Couldn’t load the inquiry chart"
            description="The daily counts query failed, so there is nothing reliable to draw. The notice above has the error."
          />
        </AdminCard>
      )}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <RecentActivity items={activityItems} />

        <AdminCard>
          <CardHeader title="Latest accounts" description="By last sign-in" action={<TextLink href="/admin/users">All users</TextLink>} />
          {recentUsers.length === 0 ? (
            <p className="px-5 py-10 text-center text-[14px] text-mkt-muted">No accounts yet.</p>
          ) : (
            <DataTable>
              <thead>
                <tr className={table.headRow}>
                  <th className={table.th}>Name</th>
                  <th className={table.th}>Email</th>
                  <th className={table.th}>Plan</th>
                  <th className={table.th}>Role</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id} className={table.row}>
                    <td className={`${table.td} font-medium`}>{u.name}</td>
                    <td className={`${table.td} ${table.muted}`}>{u.email}</td>
                    <td className={table.td}>
                      <Badge>{u.plan === 'none' ? 'No plan' : formatLabel(u.plan)}</Badge>
                    </td>
                    <td className={table.td}>
                      <Badge tone={ADMIN_ROLES.has(u.role) ? 'violet' : 'neutral'}>{formatLabel(u.role)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </AdminCard>
      </section>
    </div>
  );
}
