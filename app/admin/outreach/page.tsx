import { count, desc, sql } from 'drizzle-orm';
import { Mail, MessageSquareReply, Search, Users } from 'lucide-react';
import Link from 'next/link';

import DatabaseError from '@/components/admin/DatabaseError';
import EmptyState from '@/components/admin/EmptyState';
import MiniStat from '@/components/admin/MiniStat';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { AutoSync } from '@/components/admin/outreach/AutoSync';
import { SearchForm } from '@/components/admin/outreach/SearchForm';
import { AdminCard, ButtonLink, CardBody, CardHeader, DataTable, Notice, table } from '@/components/admin/ui';
import { formatCount, formatDateTime } from '@/lib/admin/format';
import { FINISHED_JOB_STATUSES } from '@/lib/outreach/constants';
import { countryName } from '@/lib/outreach/taxonomy';
import { db } from '@/utils/db/db';
import { leadScrapeJobsTable, leadsTable } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Find leads | Admin | RactroTech', description: 'Scrape business leads from Google Maps' };

export default async function FindLeadsPage() {
  try {
    const [jobs, [stats]] = await Promise.all([
      db.select().from(leadScrapeJobsTable).orderBy(desc(leadScrapeJobsTable.id)).limit(50),
      db
        .select({
          total: count(),
          withEmail: count(leadsTable.email),
          replied: sql<number>`count(*) filter (where ${leadsTable.status} = 'replied')`.mapWith(Number),
        })
        .from(leadsTable),
    ]);
    const running = jobs.some((j) => !FINISHED_JOB_STATUSES.includes(j.status));

    return (
      <div className="space-y-6">
        <PageHeader
          title="Find leads"
          subtitle="Scrapes Google Maps via Apify, then pulls emails and socials from each business website."
          backHref="/admin"
          actions={<ButtonLink href="/admin/outreach/leads">View leads</ButtonLink>}
        />

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Lead totals">
          <MiniStat icon={<Users />} value={stats.total} label="Leads" />
          <MiniStat icon={<Mail />} value={stats.withEmail} label="With an email" />
          <MiniStat icon={<MessageSquareReply />} value={stats.replied} label="Replied" />
          <MiniStat icon={<Search />} value={jobs.filter((j) => !FINISHED_JOB_STATUSES.includes(j.status)).length} label="Searches running" />
        </section>

        {!process.env.APIFY_TOKEN ? (
          <Notice tone="amber" title="Apify isn’t connected">
            Set <code>APIFY_TOKEN</code> in the environment to start searches. Leads already imported still work.
          </Notice>
        ) : null}

        <AdminCard>
          <CardHeader title="New search" description="One search per city and category. Results import automatically." />
          <CardBody>
            <SearchForm />
          </CardBody>
        </AdminCard>

        <AdminCard>
          <CardHeader title="Recent searches" description="The last 50" action={<AutoSync active={running} />} />
          {jobs.length === 0 ? (
            <EmptyState icon={<Search />} title="No searches yet" description="Pick a country and categories above to find your first leads." />
          ) : (
            <DataTable>
              <thead>
                <tr className={table.headRow}>
                  <th className={table.th}>Category</th>
                  <th className={table.th}>Location</th>
                  <th className={table.thNum}>Max</th>
                  <th className={table.th}>Status</th>
                  <th className={table.thNum}>Leads</th>
                  <th className={table.th}>Started</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => {
                  const imported = FINISHED_JOB_STATUSES.includes(j.status) && j.status !== 'FAILED';
                  return (
                    <tr key={j.id} className={table.row}>
                      <td className={table.td}>{j.category}</td>
                      <td className={table.td}>{[j.city, countryName(j.country)].filter(Boolean).join(', ')}</td>
                      <td className={table.tdNum}>{formatCount(j.max_results)}</td>
                      <td className={table.td}>
                        <StatusBadge status={j.status} />
                        {j.error ? (
                          <p className="mt-1 max-w-xs truncate text-[12px] text-red-600 dark:text-red-400" title={j.error}>
                            {j.error}
                          </p>
                        ) : null}
                      </td>
                      <td className={table.tdNum}>
                        {imported ? (
                          <Link
                            className="font-medium text-mkt-violet hover:underline"
                            href={`/admin/outreach/leads?${new URLSearchParams({ category: j.category, country: j.country })}`}
                          >
                            {formatCount(j.lead_count)}
                          </Link>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className={`${table.td} whitespace-nowrap ${table.muted}`}>{formatDateTime(j.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          )}
        </AdminCard>
      </div>
    );
  } catch (error) {
    return <DatabaseError message={error instanceof Error ? error.message : String(error)} />;
  }
}
