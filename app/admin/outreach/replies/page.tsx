import { desc, eq, isNotNull, sql } from 'drizzle-orm';
import { MessageSquareReply } from 'lucide-react';

import DatabaseError from '@/components/admin/DatabaseError';
import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import { ConvertToClientButton } from '@/components/admin/outreach/ConvertToClientButton';
import { AdminCard, ButtonLink, DataTable, TextLink, table } from '@/components/admin/ui';
import { formatDateTime } from '@/lib/admin/format';
import { countryName } from '@/lib/outreach/taxonomy';
import { db } from '@/utils/db/db';
import { leadsTable, outreachCampaignsTable, outreachRecipientsTable } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Replies | Admin | RactroTech', description: 'Leads who replied to outreach' };

export default async function RepliesPage() {
  try {
    const replies = await db
      .select({
        recipientId: outreachRecipientsTable.id,
        leadId: leadsTable.id,
        name: sql<string>`coalesce(${leadsTable.site_name}, ${leadsTable.name})`,
        email: outreachRecipientsTable.email,
        city: leadsTable.city,
        country: leadsTable.country,
        website: leadsTable.website,
        clientId: leadsTable.client_id,
        campaignId: outreachCampaignsTable.id,
        campaign: outreachCampaignsTable.name,
        repliedAt: outreachRecipientsTable.replied_at,
      })
      .from(outreachRecipientsTable)
      .innerJoin(leadsTable, eq(leadsTable.id, outreachRecipientsTable.lead_id))
      .innerJoin(outreachCampaignsTable, eq(outreachCampaignsTable.id, outreachRecipientsTable.campaign_id))
      .where(isNotNull(outreachRecipientsTable.replied_at))
      .orderBy(desc(outreachRecipientsTable.replied_at));

    return (
      <div className="space-y-6">
        <PageHeader
          title={`Replies (${replies.length})`}
          subtitle="Leads who wrote back. New replies raise a bell notification and email the reply-alert addresses."
          backHref="/admin/outreach"
          backLabel="Find leads"
        />

        <AdminCard>
          {replies.length === 0 ? (
            <EmptyState
              icon={<MessageSquareReply />}
              title="No replies yet"
              description="Replies are checked every scheduler run, or with Check replies on a campaign. Gmail senders need the read permission."
              action={<ButtonLink href="/admin/outreach/mail-accounts">Mail accounts</ButtonLink>}
            />
          ) : (
            <DataTable>
              <thead>
                <tr className={table.headRow}>
                  <th className={table.th}>Business</th>
                  <th className={table.th}>Email</th>
                  <th className={table.th}>Location</th>
                  <th className={table.th}>Campaign</th>
                  <th className={table.th}>Replied</th>
                  <th className={table.th}>
                    <span className="sr-only">Client</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {replies.map((r) => (
                  <tr key={r.recipientId} className={table.row}>
                    <td className={table.td}>
                      <div className="font-medium">{r.name}</div>
                      {r.website ? (
                        <a className="text-[12px] text-mkt-muted hover:underline" href={r.website} target="_blank" rel="noreferrer">
                          {r.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      ) : null}
                    </td>
                    <td className={table.td}>
                      <a className="text-mkt-violet hover:underline" href={`mailto:${r.email}`}>
                        {r.email}
                      </a>
                    </td>
                    <td className={`${table.td} text-[13px] ${table.muted}`}>
                      {[r.city, countryName(r.country)].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className={table.td}>
                      <TextLink href={`/admin/outreach/campaigns/${r.campaignId}`}>{r.campaign}</TextLink>
                    </td>
                    <td className={`${table.td} whitespace-nowrap ${table.muted}`}>{formatDateTime(r.repliedAt)}</td>
                    <td className={table.td}>
                      {r.clientId ? <TextLink href={`/admin/clients/${r.clientId}`}>View client</TextLink> : <ConvertToClientButton leadId={r.leadId} />}
                    </td>
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
