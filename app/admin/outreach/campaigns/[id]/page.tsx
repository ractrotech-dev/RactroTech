import { asc, eq } from 'drizzle-orm';
import { Users } from 'lucide-react';
import { notFound } from 'next/navigation';

import {
  checkRepliesAction,
  crawlCampaignAction,
  deleteCampaign,
  retryFailed,
  setCampaignStatus,
} from '@/app/admin/outreach/actions';
import DatabaseError from '@/components/admin/DatabaseError';
import EmptyState from '@/components/admin/EmptyState';
import MiniStat from '@/components/admin/MiniStat';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { ConfirmButton } from '@/components/admin/outreach/ConfirmButton';
import { SubmitButton } from '@/components/admin/outreach/FormAction';
import { SendNowButton } from '@/components/admin/outreach/SendNowButton';
import { AdminCard, CardBody, CardHeader, DataTable, Notice, buttonClass, table } from '@/components/admin/ui';
import { formatDateTime } from '@/lib/admin/format';
import { renderTemplate } from '@/lib/outreach/mailer';
import { cn } from '@/lib/utils';
import { db } from '@/utils/db/db';
import {
  leadsTable,
  outreachCampaignsTable,
  outreachMailAccountsTable,
  outreachRecipientsTable,
  outreachTemplatesTable,
} from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Campaign | Admin | RactroTech', description: 'One cold-email campaign' };

type SearchParams = { replies?: string; checked?: string; error?: string; crawled?: string; renamed?: string };

export default async function CampaignPage({ params, searchParams }: { params: { id: string }; searchParams: SearchParams }) {
  if (!/^\d+$/.test(params.id)) notFound();
  const id = Number(params.id);

  let campaign;
  let recipients;
  try {
    [[campaign], recipients] = await Promise.all([
      db
        .select({
          id: outreachCampaignsTable.id,
          name: outreachCampaignsTable.name,
          status: outreachCampaignsTable.status,
          subject: outreachTemplatesTable.subject,
          body: outreachTemplatesTable.body,
          template: outreachTemplatesTable.name,
          sender: outreachMailAccountsTable.email,
        })
        .from(outreachCampaignsTable)
        .innerJoin(outreachTemplatesTable, eq(outreachTemplatesTable.id, outreachCampaignsTable.template_id))
        .leftJoin(outreachMailAccountsTable, eq(outreachMailAccountsTable.id, outreachCampaignsTable.account_id))
        .where(eq(outreachCampaignsTable.id, id)),
      db
        .select({
          id: outreachRecipientsTable.id,
          email: outreachRecipientsTable.email,
          status: outreachRecipientsTable.status,
          error: outreachRecipientsTable.error,
          sent_at: outreachRecipientsTable.sent_at,
          replied_at: outreachRecipientsTable.replied_at,
          name: leadsTable.name,
          site_name: leadsTable.site_name,
          crawled_at: leadsTable.crawled_at,
          category: leadsTable.category,
          city: leadsTable.city,
          country: leadsTable.country,
          website: leadsTable.website,
        })
        .from(outreachRecipientsTable)
        .innerJoin(leadsTable, eq(leadsTable.id, outreachRecipientsTable.lead_id))
        .where(eq(outreachRecipientsTable.campaign_id, id))
        .orderBy(asc(outreachRecipientsTable.id)),
    ]);
  } catch (error) {
    return <DatabaseError message={error instanceof Error ? error.message : String(error)} />;
  }
  if (!campaign) notFound();

  const c = campaign;
  const count = (s: string) => recipients.filter((r) => r.status === s).length;
  const replied = recipients.filter((r) => r.replied_at).length;
  const notCrawled = recipients.filter((r) => !r.crawled_at).length;
  const sample = recipients[0];
  const here = `/admin/outreach/campaigns/${c.id}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title={c.name}
        subtitle={`From ${c.sender ?? 'SMTP'} · Template “${c.template}”`}
        backHref="/admin/outreach/campaigns"
        backLabel="Campaigns"
        actions={
          <>
            {c.status !== 'done' && c.status !== 'active' ? (
              <form action={setCampaignStatus.bind(null, c.id, 'active')}>
                <ConfirmButton
                  confirm={`Start sending “${c.name}” to ${count('pending')} queued recipients?`}
                  className={buttonClass('primary')}
                >
                  Start sending
                </ConfirmButton>
              </form>
            ) : null}
            {c.status === 'active' ? (
              <form action={setCampaignStatus.bind(null, c.id, 'paused')}>
                <SubmitButton className={buttonClass('secondary')}>Pause</SubmitButton>
              </form>
            ) : null}
            {notCrawled > 0 ? (
              <form action={crawlCampaignAction.bind(null, c.id)}>
                <SubmitButton className={buttonClass('secondary')} pendingLabel="Crawling…">
                  Crawl next 20 websites
                </SubmitButton>
              </form>
            ) : null}
            <form action={checkRepliesAction.bind(null, here)}>
              <SubmitButton className={buttonClass('secondary')} pendingLabel="Checking…">
                Check replies
              </SubmitButton>
            </form>
            {count('failed') > 0 ? (
              <form action={retryFailed.bind(null, c.id)}>
                <SubmitButton className={buttonClass('secondary')}>Retry failed</SubmitButton>
              </form>
            ) : null}
            <form action={deleteCampaign.bind(null, c.id)}>
              <ConfirmButton confirm={`Delete “${c.name}” and its send history? Leads are kept.`} className={buttonClass('danger')}>
                Delete
              </ConfirmButton>
            </form>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={c.status} />
        {c.status === 'active' ? <SendNowButton /> : null}
      </div>

      {searchParams.error ? <Notice tone="red">{searchParams.error}</Notice> : null}
      {searchParams.replies ? (
        <Notice tone="green">
          Checked {searchParams.checked} threads. {searchParams.replies} new replies; those leads are marked replied.
        </Notice>
      ) : null}
      {searchParams.crawled ? (
        <Notice tone="green">
          Crawled {searchParams.crawled} websites. {searchParams.renamed} emails will use a different business name.
        </Notice>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Campaign totals">
        <MiniStat value={recipients.length} label="Recipients" />
        <MiniStat value={count('sent')} label="Sent" />
        <MiniStat value={replied} label="Replied" />
        <MiniStat value={count('pending') + count('sending')} label="Queued" />
        <MiniStat value={count('failed')} label="Failed" />
        <MiniStat value={count('skipped')} label="Skipped" />
      </section>

      {sample ? (
        <AdminCard>
          <CardHeader title="Preview" description={`As the first recipient, ${sample.email}, will see it.${notCrawled ? ` ${notCrawled} websites not crawled yet; names may still change.` : ''}`} />
          <CardBody>
            <p className="font-medium">{renderTemplate(c.subject, sample)}</p>
            <pre className="mt-2 whitespace-pre-wrap font-sans text-[14px] leading-6 text-mkt-ink/80">{renderTemplate(c.body, sample)}</pre>
          </CardBody>
        </AdminCard>
      ) : null}

      <AdminCard>
        <CardHeader title="Recipients" />
        {recipients.length === 0 ? (
          <EmptyState icon={<Users />} title="No recipients" description="No leads with an email matched this campaign’s filters." />
        ) : (
          <DataTable>
            <thead>
              <tr className={table.headRow}>
                <th className={table.th}>Business</th>
                <th className={table.th}>Email</th>
                <th className={table.th}>Status</th>
                <th className={table.th}>Sent</th>
                <th className={table.th}>Reply</th>
              </tr>
            </thead>
            <tbody>
              {recipients.map((r) => (
                <tr key={r.id} className={table.row}>
                  <td className={table.td}>
                    {r.site_name || r.name}
                    {r.site_name && r.site_name !== r.name ? <div className="text-[12px] text-mkt-muted">Maps: {r.name}</div> : null}
                  </td>
                  <td className={table.td}>{r.email}</td>
                  <td className={table.td}>
                    <StatusBadge status={r.status} />
                    {r.error ? (
                      <p className="mt-1 max-w-md truncate text-[12px] text-red-600 dark:text-red-400" title={r.error}>
                        {r.error}
                      </p>
                    ) : null}
                  </td>
                  <td className={cn(table.td, 'whitespace-nowrap', table.muted)}>{formatDateTime(r.sent_at)}</td>
                  <td className={cn(table.td, 'whitespace-nowrap', table.muted)}>
                    {r.replied_at ? formatDateTime(r.replied_at) : r.error === 'bounced' ? 'Bounced' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </AdminCard>
    </div>
  );
}
