import { asc, desc, eq, sql } from 'drizzle-orm';
import { Send } from 'lucide-react';
import Link from 'next/link';

import { checkRepliesAction, createCampaign } from '@/app/admin/outreach/actions';
import DatabaseError from '@/components/admin/DatabaseError';
import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { FormAction, SubmitButton } from '@/components/admin/outreach/FormAction';
import { SendNowButton } from '@/components/admin/outreach/SendNowButton';
import { AdminCard, CardBody, CardHeader, DataTable, Notice, TextLink, buttonClass, field, table } from '@/components/admin/ui';
import { formatCount, formatDate, formatLabel } from '@/lib/admin/format';
import { dailySendLimit, smtpConfigured } from '@/lib/outreach/config';
import { LEAD_STATUSES } from '@/lib/outreach/constants';
import { sentInLast24h } from '@/lib/outreach/mailer';
import { CATEGORY_GROUPS, REGIONS } from '@/lib/outreach/taxonomy';
import { cn } from '@/lib/utils';
import { db } from '@/utils/db/db';
import {
  outreachCampaignsTable,
  outreachMailAccountsTable,
  outreachRecipientsTable,
  outreachTemplatesTable,
} from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Campaigns | Admin | RactroTech', description: 'Cold-email campaigns to scraped leads' };

const r = outreachRecipientsTable;
const tally = (where: ReturnType<typeof sql>) => sql<number>`count(${r.id}) filter (where ${where})`.mapWith(Number);

export default async function CampaignsPage({ searchParams }: { searchParams: { replies?: string; checked?: string; error?: string } }) {
  try {
    const [campaigns, templates, accounts, sent24h] = await Promise.all([
      db
        .select({
          id: outreachCampaignsTable.id,
          name: outreachCampaignsTable.name,
          status: outreachCampaignsTable.status,
          createdAt: outreachCampaignsTable.created_at,
          template: outreachTemplatesTable.name,
          sender: outreachMailAccountsTable.email,
          total: sql<number>`count(${r.id})`.mapWith(Number),
          sent: tally(sql`${r.status} = 'sent'`),
          pending: tally(sql`${r.status} in ('pending','sending')`),
          failed: tally(sql`${r.status} = 'failed'`),
          replied: tally(sql`${r.replied_at} is not null`),
        })
        .from(outreachCampaignsTable)
        .innerJoin(outreachTemplatesTable, eq(outreachTemplatesTable.id, outreachCampaignsTable.template_id))
        .leftJoin(outreachMailAccountsTable, eq(outreachMailAccountsTable.id, outreachCampaignsTable.account_id))
        .leftJoin(r, eq(r.campaign_id, outreachCampaignsTable.id))
        .groupBy(outreachCampaignsTable.id, outreachTemplatesTable.name, outreachMailAccountsTable.email)
        .orderBy(desc(outreachCampaignsTable.id)),
      db.select({ id: outreachTemplatesTable.id, name: outreachTemplatesTable.name }).from(outreachTemplatesTable).orderBy(desc(outreachTemplatesTable.id)),
      db.select({ id: outreachMailAccountsTable.id, email: outreachMailAccountsTable.email }).from(outreachMailAccountsTable).orderBy(asc(outreachMailAccountsTable.id)),
      sentInLast24h(),
    ]);
    const smtp = smtpConfigured();
    const canSend = smtp || accounts.length > 0;

    return (
      <div className="space-y-6">
        <PageHeader
          title="Campaigns"
          subtitle={`Sent in the last 24h: ${formatCount(sent24h)} of ${formatCount(dailySendLimit())}. Active campaigns drip-send each time the scheduler runs.`}
          backHref="/admin/outreach"
          backLabel="Find leads"
          actions={
            <>
              <form action={checkRepliesAction.bind(null, '/admin/outreach/campaigns')}>
                <SubmitButton className={buttonClass('secondary')} pendingLabel="Checking…">
                  Check replies
                </SubmitButton>
              </form>
              <SendNowButton />
            </>
          }
        />

        {searchParams.error ? <Notice tone="red">{searchParams.error}</Notice> : null}
        {searchParams.replies ? (
          <Notice tone="green">
            Checked {searchParams.checked} sent threads. {searchParams.replies} new replies; those leads are now “replied”.
          </Notice>
        ) : null}

        <AdminCard>
          <CardHeader title="New campaign" description="Created as a draft with every matching lead that has an email. Start it from its page." />
          <CardBody>
            {templates.length === 0 ? (
              <p className="text-[14px] text-mkt-muted">
                Create a <TextLink href="/admin/outreach/templates">template</TextLink> first.
              </p>
            ) : (
              <FormAction action={createCampaign} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                <div className="lg:col-span-2">
                  <label htmlFor="name" className={field.label}>
                    Name
                  </label>
                  <input id="name" name="name" className={field.input} placeholder="Dubai gyms – October" required />
                </div>
                <div className="lg:col-span-2">
                  <label htmlFor="templateId" className={field.label}>
                    Template
                  </label>
                  <select id="templateId" name="templateId" className={field.input} required>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label htmlFor="accountId" className={field.label}>
                    Send from
                  </label>
                  <select id="accountId" name="accountId" className={field.input} required={!smtp}>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.email}
                      </option>
                    ))}
                    {smtp ? <option value="">SMTP ({process.env.MAIL_FROM})</option> : null}
                    {!canSend ? <option value="">Connect a Gmail account first</option> : null}
                  </select>
                </div>
                <div>
                  <label htmlFor="country" className={field.label}>
                    Country
                  </label>
                  <select id="country" name="country" className={field.input}>
                    <option value="">All countries</option>
                    {REGIONS.flatMap((reg) => reg.countries).map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="category" className={field.label}>
                    Category
                  </label>
                  <select id="category" name="category" className={field.input}>
                    <option value="">All categories</option>
                    {CATEGORY_GROUPS.flatMap((g) => g.categories).map((c) => (
                      <option key={c.label}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label htmlFor="status" className={field.label}>
                    Lead status
                  </label>
                  <select id="status" name="status" defaultValue="new" className={field.input}>
                    <option value="">Any</option>
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {formatLabel(s)}
                      </option>
                    ))}
                  </select>
                  <p className={field.hint}>Unsubscribed and bounced emails are always left out.</p>
                </div>
                <div className="flex items-start lg:col-span-2 lg:pt-[26px]">
                  <SubmitButton className={buttonClass('primary', 'md', 'w-full')} pendingLabel="Creating…" disabled={!canSend}>
                    Create campaign as draft
                  </SubmitButton>
                </div>
              </FormAction>
            )}
          </CardBody>
        </AdminCard>

        <AdminCard>
          <CardHeader title="All campaigns" />
          {campaigns.length === 0 ? (
            <EmptyState icon={<Send />} title="No campaigns yet" description="Create one above from a template and a set of leads." />
          ) : (
            <DataTable>
              <thead>
                <tr className={table.headRow}>
                  <th className={table.th}>Campaign</th>
                  <th className={table.th}>Template</th>
                  <th className={table.th}>Sender</th>
                  <th className={table.th}>Status</th>
                  <th className={table.th}>Progress</th>
                  <th className={table.thNum}>Replied</th>
                  <th className={table.thNum}>Failed</th>
                  <th className={table.th}>Created</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className={table.row}>
                    <td className={table.td}>
                      <Link className="font-medium text-mkt-ink hover:text-mkt-violet hover:underline" href={`/admin/outreach/campaigns/${c.id}`}>
                        {c.name}
                      </Link>
                    </td>
                    <td className={table.td}>{c.template}</td>
                    <td className={`${table.td} ${table.muted}`}>{c.sender ?? 'SMTP'}</td>
                    <td className={table.td}>
                      <StatusBadge status={c.status} />
                    </td>
                    <td className={`${table.td} whitespace-nowrap tabular-nums`}>
                      {formatCount(c.sent)} / {formatCount(c.total)} sent
                      {c.pending ? <span className={table.muted}> · {formatCount(c.pending)} queued</span> : null}
                    </td>
                    <td className={table.tdNum}>{formatCount(c.replied)}</td>
                    <td className={cn(table.tdNum, c.failed && 'text-red-600 dark:text-red-400')}>{formatCount(c.failed)}</td>
                    <td className={`${table.td} whitespace-nowrap ${table.muted}`}>{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
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
