'use server';

import { and, eq, ne, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { logActivity, requireAdmin } from '@/lib/admin/guard';
import { startScrape, syncRunningJobs } from '@/lib/outreach/apify';
import { LEAD_STATUSES, MAX_SEARCHES_PER_SUBMIT } from '@/lib/outreach/constants';
import { crawlCampaign } from '@/lib/outreach/crawl';
import type { MailAccount } from '@/lib/outreach/gmail';
import { leadCondition, type LeadFilters } from '@/lib/outreach/leads';
import { deliver, sendBatch, syncReplies } from '@/lib/outreach/mailer';
import { COUNTRIES, countryName, findCategory } from '@/lib/outreach/taxonomy';
import { db } from '@/utils/db/db';
import {
  clientsTable,
  leadsTable,
  outreachCampaignsTable,
  outreachMailAccountsTable,
  outreachNotifyEmailsTable,
  outreachRecipientsTable,
  outreachTemplatesTable,
} from '@/utils/db/schema';

// Admin → Lead finder. Every action checks the admin session first (lib/admin/guard).

export type ActionState = { ok?: string; error?: string };

const BASE = '/admin/outreach';
const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

// ─── Find leads ────────────────────────────────────────────────────────────────

export async function startScrapeAction(_: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const country = str(fd, 'country');
  // Picked cities + comma-separated custom ones; none = search the whole country.
  const picked = [...fd.getAll('city').map(String), ...str(fd, 'customCity').split(',')]
    .map((c) => c.trim())
    .filter(Boolean);
  const cities = picked.length ? [...new Set(picked)] : [''];
  const categories = fd
    .getAll('category')
    .map(String)
    .filter((c) => findCategory(c));
  const maxResults = Math.min(Math.max(Number(fd.get('maxResults')) || 50, 1), 500);

  if (!COUNTRIES.some((c) => c.code === country)) return { error: 'Pick a country.' };
  if (!categories.length) return { error: 'Pick at least one category.' };
  const total = cities.length * categories.length;
  if (total > MAX_SEARCHES_PER_SUBMIT)
    return { error: `That's ${total} searches (cities × categories). Pick fewer — max ${MAX_SEARCHES_PER_SUBMIT} at once.` };

  let started = 0;
  try {
    for (const city of cities) {
      for (const category of categories) {
        await startScrape({ country, city, category, maxResults, withWebsiteOnly: fd.get('withWebsite') === 'on' });
        started++;
      }
    }
  } catch (e) {
    revalidatePath(BASE);
    return { error: `Started ${started} of ${total}, then: ${message(e)}` };
  } finally {
    if (started) await logActivity(admin.id, `Started ${started} lead search(es) in ${countryName(country)}`, 'lead_search');
  }
  revalidatePath(BASE);
  return { ok: `Started ${total} search${total > 1 ? 'es' : ''}. Results import automatically.` };
}

export async function syncJobsAction() {
  await requireAdmin();
  const n = await syncRunningJobs();
  if (n) revalidatePath(BASE);
  return n;
}

// ─── Leads ─────────────────────────────────────────────────────────────────────

export async function updateLeadStatus(id: number, status: string) {
  const admin = await requireAdmin();
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) return;
  await db.update(leadsTable).set({ status, updated_at: new Date() }).where(eq(leadsTable.id, id));
  if (status === 'unsubscribed' || status === 'bounced') {
    await db.execute(sql`
      insert into outreach_suppressions (email, reason)
      select lower(email), ${status} from leads where id = ${id} and email is not null
      on conflict do nothing`);
  }
  await logActivity(admin.id, `Set lead status to ${status}`, 'lead', String(id));
  revalidatePath(`${BASE}/leads`);
}

export async function deleteLead(id: number) {
  const admin = await requireAdmin();
  await db.delete(leadsTable).where(eq(leadsTable.id, id));
  await logActivity(admin.id, 'Deleted lead', 'lead', String(id));
  revalidatePath(`${BASE}/leads`);
}

/** Creates a RactroTech client from a lead (once) and returns the client id. */
export async function convertLeadToClient(id: number) {
  const admin = await requireAdmin();
  const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, id));
  if (!lead) throw new Error('Lead not found.');
  if (lead.client_id) return lead.client_id;
  if (!lead.email) throw new Error('This lead has no email address, and a client needs one.');

  const name = lead.site_name || lead.name;
  const notes = [
    `From Lead finder (lead #${lead.id}).`,
    lead.website && `Website: ${lead.website}`,
    lead.maps_url && `Google Maps: ${lead.maps_url}`,
    lead.address && `Address: ${lead.address}`,
  ]
    .filter(Boolean)
    .join('\n');
  const [client] = await db
    .insert(clientsTable)
    .values({
      name,
      company: name,
      email: lead.email,
      phone: lead.phone,
      category: lead.category,
      region: lead.city,
      country: lead.country ? countryName(lead.country) : null,
      status: 'lead',
      notes,
    })
    .returning({ id: clientsTable.id });
  await db.update(leadsTable).set({ client_id: client.id, updated_at: new Date() }).where(eq(leadsTable.id, id));

  await logActivity(admin.id, `Converted lead #${id} to client`, 'client', client.id);
  revalidatePath('/admin/clients');
  revalidatePath(`${BASE}/leads`);
  revalidatePath(`${BASE}/replies`);
  return client.id;
}

// ─── Templates ─────────────────────────────────────────────────────────────────

export async function createTemplate(_: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const name = str(fd, 'name');
  const subject = str(fd, 'subject');
  const body = str(fd, 'body');
  if (!name || !subject || !body) return { error: 'Name, subject and body are required.' };
  const [t] = await db
    .insert(outreachTemplatesTable)
    .values({ name, subject, body })
    .returning({ id: outreachTemplatesTable.id });
  await logActivity(admin.id, `Created email template "${name}"`, 'outreach_template', String(t.id));
  revalidatePath(`${BASE}/templates`);
  return { ok: 'Template saved.' };
}

export async function deleteTemplate(id: number) {
  const admin = await requireAdmin();
  const [used] = await db
    .select({ id: outreachCampaignsTable.id })
    .from(outreachCampaignsTable)
    .where(eq(outreachCampaignsTable.template_id, id))
    .limit(1);
  if (used) return;
  await db.delete(outreachTemplatesTable).where(eq(outreachTemplatesTable.id, id));
  await logActivity(admin.id, 'Deleted email template', 'outreach_template', String(id));
  revalidatePath(`${BASE}/templates`);
}

// ─── Campaigns ─────────────────────────────────────────────────────────────────

export async function createCampaign(_: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const name = str(fd, 'name');
  const templateId = Number(str(fd, 'templateId'));
  const accountId = Number(str(fd, 'accountId')) || null; // empty = SMTP from env
  if (!name || !templateId) return { error: 'Name and template are required.' };

  const filters: LeadFilters = {
    country: str(fd, 'country') || undefined,
    category: str(fd, 'category') || undefined,
    status: str(fd, 'status') || undefined,
    hasEmail: '1',
  };

  const [c] = await db
    .insert(outreachCampaignsTable)
    .values({ name, template_id: templateId, account_id: accountId })
    .returning({ id: outreachCampaignsTable.id });
  // One recipient per email address; skips suppressed emails and leads already queued in this campaign.
  await db.execute(sql`
    insert into outreach_recipients (campaign_id, lead_id, email)
    select distinct on (lower(${leadsTable.email})) ${c.id}::bigint, ${leadsTable.id}, ${leadsTable.email}
    from ${leadsTable}
    where ${leadCondition(filters)}
      and lower(${leadsTable.email}) not in (select email from outreach_suppressions)
    order by lower(${leadsTable.email}), ${leadsTable.id}
    on conflict do nothing`);

  await logActivity(admin.id, `Created campaign "${name}"`, 'outreach_campaign', String(c.id));
  revalidatePath(`${BASE}/campaigns`);
  redirect(`${BASE}/campaigns/${c.id}`);
}

export async function setCampaignStatus(id: number, status: 'active' | 'paused') {
  const admin = await requireAdmin();
  await db
    .update(outreachCampaignsTable)
    .set({ status })
    .where(and(eq(outreachCampaignsTable.id, id), ne(outreachCampaignsTable.status, 'done')));
  await logActivity(admin.id, status === 'active' ? 'Started campaign' : 'Paused campaign', 'outreach_campaign', String(id));
  revalidatePath(`${BASE}/campaigns/${id}`);
  revalidatePath(`${BASE}/campaigns`);
}

export async function deleteCampaign(id: number) {
  const admin = await requireAdmin();
  await db.delete(outreachCampaignsTable).where(eq(outreachCampaignsTable.id, id));
  await logActivity(admin.id, 'Deleted campaign', 'outreach_campaign', String(id));
  revalidatePath(`${BASE}/campaigns`);
  redirect(`${BASE}/campaigns`);
}

export async function retryFailed(id: number) {
  const admin = await requireAdmin();
  await db
    .update(outreachRecipientsTable)
    .set({ status: 'pending', error: null })
    .where(and(eq(outreachRecipientsTable.campaign_id, id), eq(outreachRecipientsTable.status, 'failed')));
  await db
    .update(outreachCampaignsTable)
    .set({ status: 'paused' })
    .where(and(eq(outreachCampaignsTable.id, id), eq(outreachCampaignsTable.status, 'done')));
  await logActivity(admin.id, 'Re-queued failed emails', 'outreach_campaign', String(id));
  revalidatePath(`${BASE}/campaigns/${id}`);
}

export async function crawlCampaignAction(id: number) {
  await requireAdmin();
  let dest: string;
  try {
    const r = await crawlCampaign(id);
    dest = `${BASE}/campaigns/${id}?crawled=${r.crawled}&renamed=${r.renamed}`;
  } catch (e) {
    dest = `${BASE}/campaigns/${id}?error=${encodeURIComponent(message(e))}`;
  }
  revalidatePath(`${BASE}/campaigns/${id}`);
  revalidatePath(`${BASE}/leads`);
  redirect(dest);
}

export async function checkRepliesAction(returnTo: string) {
  await requireAdmin();
  const back = returnTo.startsWith(`${BASE}/`) ? returnTo : `${BASE}/campaigns`;
  let dest: string;
  try {
    const r = await syncReplies();
    dest = `${back}?replies=${r.replied}&checked=${r.checked}`;
  } catch (e) {
    dest = `${back}?error=${encodeURIComponent(message(e))}`;
  }
  revalidatePath(`${BASE}/campaigns`, 'layout');
  revalidatePath(`${BASE}/leads`);
  revalidatePath(`${BASE}/replies`);
  revalidatePath('/admin', 'layout');
  redirect(dest);
}

export async function sendNowAction(): Promise<ActionState> {
  const admin = await requireAdmin();
  try {
    const r = await sendBatch();
    if (r.sent) await logActivity(admin.id, `Sent ${r.sent} campaign email(s) by hand`, 'outreach_campaign');
    revalidatePath(`${BASE}/campaigns`, 'layout');
    return { ok: `Sent ${r.sent}, failed ${r.failed}, skipped ${r.skipped}${r.reason ? ` (${r.reason})` : ''}.` };
  } catch (e) {
    return { error: message(e) };
  }
}

// ─── Mail accounts & reply alerts ──────────────────────────────────────────────

export async function updateAccountLimit(id: number, fd: FormData) {
  const admin = await requireAdmin();
  const limit = Math.min(Math.max(Number(fd.get('dailyLimit')) || 0, 1), 2000);
  await db.update(outreachMailAccountsTable).set({ daily_limit: limit }).where(eq(outreachMailAccountsTable.id, id));
  await logActivity(admin.id, `Set sender daily limit to ${limit}`, 'outreach_mail_account', String(id));
  revalidatePath(`${BASE}/mail-accounts`);
}

export async function disconnectAccount(id: number) {
  const admin = await requireAdmin();
  await db
    .update(outreachCampaignsTable)
    .set({ status: 'paused' })
    .where(and(eq(outreachCampaignsTable.account_id, id), eq(outreachCampaignsTable.status, 'active')));
  await db.delete(outreachMailAccountsTable).where(eq(outreachMailAccountsTable.id, id));
  await logActivity(admin.id, 'Disconnected Gmail sender', 'outreach_mail_account', String(id));
  revalidatePath(`${BASE}/mail-accounts`);
}

export async function addNotifyEmail(_: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const email = str(fd, 'email').toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: 'Enter a valid email address.' };
  await db.insert(outreachNotifyEmailsTable).values({ email }).onConflictDoNothing();
  await logActivity(admin.id, `Added reply alert address ${email}`, 'outreach_settings');
  revalidatePath(`${BASE}/mail-accounts`);
  return { ok: `${email} will be emailed when a lead replies.` };
}

export async function removeNotifyEmail(email: string) {
  const admin = await requireAdmin();
  await db.delete(outreachNotifyEmailsTable).where(eq(outreachNotifyEmailsTable.email, email));
  await logActivity(admin.id, `Removed reply alert address ${email}`, 'outreach_settings');
  revalidatePath(`${BASE}/mail-accounts`);
}

export async function sendTestEmail(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const accountId = Number(str(fd, 'accountId')) || null;
  const to = str(fd, 'to');
  if (!/^\S+@\S+\.\S+$/.test(to)) return { error: 'Enter a valid email address.' };
  let account: MailAccount | null = null;
  if (accountId) {
    [account] = await db.select().from(outreachMailAccountsTable).where(eq(outreachMailAccountsTable.id, accountId));
    if (!account) return { error: 'That sender is no longer connected.' };
  }
  try {
    await deliver(account, {
      to,
      subject: 'RactroTech lead finder test email',
      text: 'If you can read this, sending works.',
      html: '<p>If you can read this, sending works.</p>',
      headers: {},
    });
    return { ok: `Test email sent to ${to} from ${account?.email ?? 'SMTP'}.` };
  } catch (e) {
    return { error: message(e) };
  }
}
