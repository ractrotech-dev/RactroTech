import { count, desc, eq } from 'drizzle-orm';
import { Download, Users } from 'lucide-react';
import Link from 'next/link';

import { deleteLead } from '@/app/admin/outreach/actions';
import DatabaseError from '@/components/admin/DatabaseError';
import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import { ConfirmButton } from '@/components/admin/outreach/ConfirmButton';
import { ConvertToClientButton } from '@/components/admin/outreach/ConvertToClientButton';
import { LeadStatusSelect } from '@/components/admin/outreach/LeadStatusSelect';
import { AdminCard, ButtonLink, DataTable, TextLink, buttonClass, field, table } from '@/components/admin/ui';
import { formatCount, formatLabel, formatRating } from '@/lib/admin/format';
import { LEAD_STATUSES } from '@/lib/outreach/constants';
import { filterQuery, leadCondition, pickFilters } from '@/lib/outreach/leads';
import { renderTemplate } from '@/lib/outreach/mailer';
import { CATEGORY_GROUPS, REGIONS, countryName } from '@/lib/outreach/taxonomy';
import { cn } from '@/lib/utils';
import { db } from '@/utils/db/db';
import { leadsTable, outreachCampaignsTable, outreachTemplatesTable } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Leads | Admin | RactroTech', description: 'Scraped business leads' };

const PAGE_SIZE = 50;
const bareUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

export default async function LeadsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const filters = pickFilters(searchParams);
  const page = Math.max(1, Number(searchParams.page) || 1);
  const where = leadCondition(filters);
  const qs = filterQuery(filters);
  const pageHref = (p: number) => `/admin/outreach/leads?${new URLSearchParams({ ...Object.fromEntries(qs), page: String(p) })}`;

  try {
    const [[{ total }], [template], leads] = await Promise.all([
      db.select({ total: count() }).from(leadsTable).where(where),
      // Preview each lead's email with the template of the newest campaign.
      db
        .select({ subject: outreachTemplatesTable.subject, body: outreachTemplatesTable.body })
        .from(outreachCampaignsTable)
        .innerJoin(outreachTemplatesTable, eq(outreachTemplatesTable.id, outreachCampaignsTable.template_id))
        .orderBy(desc(outreachCampaignsTable.id))
        .limit(1),
      db
        .select()
        .from(leadsTable)
        .where(where)
        .orderBy(desc(leadsTable.id))
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE),
    ]);
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const filtered = qs.toString() !== '';

    return (
      <div className="space-y-6">
        <PageHeader
          title="Leads"
          subtitle={`${formatCount(total)} ${filtered ? 'matching' : 'in total'}. Change a status inline; replied leads can become clients.`}
          backHref="/admin/outreach"
          backLabel="Find leads"
          actions={
            <>
              <a className={buttonClass('secondary')} href={`/api/outreach/leads/export?${qs}`}>
                <Download /> Export CSV
              </a>
              <ButtonLink href="/admin/outreach/campaigns" variant="primary">
                Email these
              </ButtonLink>
            </>
          }
        />

        <form method="get" className="grid gap-3 rounded-2xl border border-mkt-line bg-mkt-surface p-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <label htmlFor="q" className={field.label}>
              Search
            </label>
            <input id="q" name="q" defaultValue={filters.q} placeholder="Name, city or email" className={field.input} />
          </div>
          <div>
            <label htmlFor="country" className={field.label}>
              Country
            </label>
            <select id="country" name="country" defaultValue={filters.country ?? ''} className={field.input}>
              <option value="">All countries</option>
              {REGIONS.map((r) => (
                <optgroup key={r.name} label={r.name}>
                  {r.countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className={field.label}>
              Category
            </label>
            <select id="category" name="category" defaultValue={filters.category ?? ''} className={field.input}>
              <option value="">All categories</option>
              {CATEGORY_GROUPS.map((g) => (
                <optgroup key={g.name} label={g.name}>
                  {g.categories.map((c) => (
                    <option key={c.label}>{c.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className={field.label}>
              Status
            </label>
            <select id="status" name="status" defaultValue={filters.status ?? ''} className={field.input}>
              <option value="">Any status</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {formatLabel(s)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-3">
            <label className="flex h-10 items-center gap-2 whitespace-nowrap text-[13px] text-mkt-ink">
              <input type="checkbox" name="hasEmail" value="1" defaultChecked={filters.hasEmail === '1'} className="accent-mkt-violet" />
              Has email
            </label>
            <button type="submit" className={buttonClass('secondary', 'md', 'h-10')}>
              Filter
            </button>
          </div>
        </form>

        <AdminCard>
          {leads.length === 0 ? (
            <EmptyState
              icon={<Users />}
              title={filtered ? 'No leads match' : 'No leads yet'}
              description={filtered ? 'Try fewer filters.' : 'Run a search to import businesses from Google Maps.'}
              action={<ButtonLink href={filtered ? '/admin/outreach/leads' : '/admin/outreach'}>{filtered ? 'Clear filters' : 'Find leads'}</ButtonLink>}
            />
          ) : (
            <DataTable>
              <thead>
                <tr className={table.headRow}>
                  <th className={table.th}>Business</th>
                  <th className={table.th}>Location</th>
                  <th className={table.th}>Contact</th>
                  <th className={table.th}>Email preview</th>
                  <th className={table.thNum}>Rating</th>
                  <th className={table.th}>Status</th>
                  <th className={table.th}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className={cn(table.row, 'align-top')}>
                    <td className={cn(table.td, 'max-w-xs align-top')}>
                      <div className="font-medium">{l.site_name || l.name}</div>
                      {l.site_name && l.site_name !== l.name ? <div className="text-[12px] text-mkt-muted">Maps: {l.name}</div> : null}
                      <div className="text-[12px] text-mkt-muted">{l.google_category ?? l.category}</div>
                      <div className="mt-1 flex flex-wrap gap-x-2 text-[12px]">
                        {l.maps_url ? (
                          <a className="text-mkt-violet hover:underline" href={l.maps_url} target="_blank" rel="noreferrer">
                            Maps
                          </a>
                        ) : null}
                        {Object.entries(l.socials)
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <a key={k} className="capitalize text-mkt-violet hover:underline" href={v} target="_blank" rel="noreferrer">
                              {k}
                            </a>
                          ))}
                      </div>
                    </td>
                    <td className={cn(table.td, 'align-top text-[13px]')}>
                      <div>{[l.city, countryName(l.country)].filter(Boolean).join(', ')}</div>
                      <div className="text-mkt-muted">{l.address}</div>
                    </td>
                    <td className={cn(table.td, 'align-top text-[13px]')}>
                      {l.emails.length > 0 ? (
                        l.emails.map((e) => (
                          <div key={e}>
                            <a className="text-mkt-violet hover:underline" href={`mailto:${e}`}>
                              {e}
                            </a>
                          </div>
                        ))
                      ) : (
                        <div className="text-mkt-muted">No email</div>
                      )}
                      {l.phone ? <div>{l.phone}</div> : null}
                      {l.website ? (
                        <a className="block max-w-[14rem] truncate text-mkt-muted hover:underline" href={l.website} target="_blank" rel="noreferrer">
                          {bareUrl(l.website)}
                        </a>
                      ) : null}
                    </td>
                    <td className={cn(table.td, 'align-top')}>
                      {template ? (
                        <details className="w-72 text-[12px]">
                          <summary className="cursor-pointer truncate font-medium text-mkt-ink">{renderTemplate(template.subject, l)}</summary>
                          <pre className="mt-1 max-h-48 overflow-y-auto whitespace-pre-wrap font-sans text-mkt-muted">
                            {renderTemplate(template.body, l)}
                          </pre>
                        </details>
                      ) : (
                        <span className="text-[12px] text-mkt-muted">No campaign yet</span>
                      )}
                    </td>
                    <td className={cn(table.tdNum, 'align-top whitespace-nowrap text-[13px]')}>
                      {l.rating ? `★ ${formatRating(l.rating)} (${formatCount(l.reviews_count)})` : '—'}
                    </td>
                    <td className={cn(table.td, 'align-top')}>
                      <LeadStatusSelect id={l.id} status={l.status} />
                    </td>
                    <td className={cn(table.td, 'align-top')}>
                      <div className="flex flex-col items-start gap-2">
                        {l.client_id ? (
                          <TextLink href={`/admin/clients/${l.client_id}`}>View client</TextLink>
                        ) : l.status === 'replied' ? (
                          <ConvertToClientButton leadId={l.id} />
                        ) : null}
                        <form action={deleteLead.bind(null, l.id)}>
                          <ConfirmButton
                            confirm={`Delete ${l.site_name || l.name}? Their campaign history goes too.`}
                            className="text-[12px] font-medium text-mkt-muted hover:text-red-600"
                          >
                            Delete
                          </ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </AdminCard>

        {pages > 1 ? (
          <nav className="flex items-center justify-center gap-3 text-[13px]" aria-label="Pages">
            {page > 1 ? (
              <Link className={buttonClass('secondary', 'sm')} href={pageHref(page - 1)}>
                Previous
              </Link>
            ) : null}
            <span className="tabular-nums text-mkt-muted">
              Page {formatCount(page)} of {formatCount(pages)}
            </span>
            {page < pages ? (
              <Link className={buttonClass('secondary', 'sm')} href={pageHref(page + 1)}>
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    );
  } catch (error) {
    return <DatabaseError message={error instanceof Error ? error.message : String(error)} />;
  }
}
