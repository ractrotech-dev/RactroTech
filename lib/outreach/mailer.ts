import 'server-only';

import { and, asc, count, desc, eq, gt, isNotNull, isNull, ne, sql } from 'drizzle-orm';
import nodemailer, { type Transporter } from 'nodemailer';

import { db } from '@/utils/db/db';
import {
  leadsTable,
  notificationsTable,
  outreachMailAccountsTable,
  outreachNotifyEmailsTable,
  outreachRecipientsTable,
  outreachSuppressionsTable,
} from '@/utils/db/schema';

import { batchSize, dailySendLimit, outreachBaseUrl } from './config';
import { rememberBusinessName } from './crawl';
import { classifyThread, sendViaGmail, type MailAccount } from './gmail';
import { countryName } from './taxonomy';

type LeadFields = {
  name: string;
  site_name?: string | null;
  category: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
};

export function renderTemplate(text: string, lead: LeadFields) {
  const values: Record<string, string> = {
    business_name: lead.site_name || lead.name,
    category: lead.category ?? '',
    city: lead.city ?? '',
    country: countryName(lead.country),
    website: lead.website ?? '',
  };
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, key) => values[key] ?? m);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

let transport: Transporter | undefined;
function getTransport() {
  if (!process.env.SMTP_HOST) throw new Error('SMTP_HOST is not set');
  const port = Number(process.env.SMTP_PORT ?? 465);
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transport;
}

const sentRecently = (t = outreachRecipientsTable) =>
  and(eq(t.status, 'sent'), gt(t.sent_at, sql`now() - interval '24 hours'`));

export async function sentInLast24h() {
  const [r] = await db.select({ n: count() }).from(outreachRecipientsTable).where(sentRecently());
  return Number(r?.n ?? 0);
}

type Message = { to: string; subject: string; text: string; html: string; headers: Record<string, string> };

type Claimed = LeadFields & {
  id: number;
  lead_id: number;
  crawled: boolean;
  email: string;
  token: string;
  account_id: number | null;
  subject: string;
  body: string;
};

/** Renders the template for one recipient and adds the unsubscribe footer + headers. */
function buildMessage(r: Claimed): Message {
  const appUrl = outreachBaseUrl();
  const postal = process.env.MAIL_POSTAL_ADDRESS ?? '';
  const unsubscribeUrl = `${appUrl}/unsubscribe?t=${r.token}`;
  const body = renderTemplate(r.body, r);
  return {
    to: r.email,
    subject: renderTemplate(r.subject, r),
    text: `${body}\n\n--\n${postal}\nDon't want these emails? Unsubscribe: ${unsubscribeUrl}`,
    html:
      `<div>${escapeHtml(body).replace(/\n/g, '<br>')}</div>` +
      `<p style="color:#888;font-size:12px;margin-top:24px">${escapeHtml(postal)}<br>` +
      `<a href="${unsubscribeUrl}">Unsubscribe</a></p>`,
    headers: {
      'List-Unsubscribe': `<${appUrl}/api/outreach/unsubscribe?t=${r.token}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
}

/** Sends via the connected Gmail account, or via SMTP from the environment when none is set. */
export async function deliver(account: MailAccount | null, msg: Message) {
  if (account) return sendViaGmail(account, msg);
  const info = await getTransport().sendMail({ from: process.env.MAIL_FROM, ...msg });
  return { id: info.messageId as string, threadId: null };
}

const num = (v: unknown) => (v == null ? null : Number(v));

/**
 * Sends the next batch of pending emails across all active campaigns, respecting
 * BATCH_SIZE, the global DAILY_SEND_LIMIT and each Gmail account's daily limit.
 * Safe to call concurrently.
 */
export async function sendBatch() {
  const remaining = dailySendLimit() - (await sentInLast24h());
  if (remaining <= 0) return { sent: 0, failed: 0, skipped: 0, reason: 'daily limit reached' };

  // Remaining quota per connected account over the last 24h.
  const r = outreachRecipientsTable;
  const a = outreachMailAccountsTable;
  const accounts = await db
    .select({
      id: a.id,
      email: a.email,
      from_name: a.from_name,
      refresh_token_enc: a.refresh_token_enc,
      daily_limit: a.daily_limit,
      remaining: sql<number>`${a.daily_limit} - (select count(*)::int from outreach_recipients r
        where r.account_id = ${a.id} and r.status = 'sent' and r.sent_at > now() - interval '24 hours')`.mapWith(Number),
    })
    .from(a);
  const byId = new Map(accounts.map((acc) => [acc.id, acc]));
  const exhausted = accounts.filter((acc) => acc.remaining <= 0).map((acc) => acc.id);
  const skipExhausted = exhausted.length
    ? sql`and (c.account_id is null or c.account_id not in (${sql.join(
        exhausted.map((id) => sql`${id}`),
        sql`, `
      )}))`
    : sql``;

  // Claim rows atomically so overlapping runs never double-send.
  const claimed = await db.execute<Record<string, unknown>>(sql`
    with claimed as (
      update outreach_recipients set status = 'sending'
      where id in (
        select r.id from outreach_recipients r
        join outreach_campaigns c on c.id = r.campaign_id
        where r.status = 'pending' and c.status = 'active' ${skipExhausted}
        order by r.id
        limit ${Math.min(batchSize(), remaining)}
        for update of r skip locked
      )
      returning *
    )
    select cl.id, cl.email, cl.token, c.account_id, t.subject, t.body,
           l.id as lead_id, l.name, l.site_name, (l.crawled_at is not null) as crawled,
           l.category, l.city, l.country, l.website
    from claimed cl
    join outreach_campaigns c on c.id = cl.campaign_id
    join outreach_templates t on t.id = c.template_id
    join leads l on l.id = cl.lead_id`);
  // Raw rows carry bigint as strings.
  const rows: Claimed[] = Array.from(claimed).map((row) => ({
    ...(row as unknown as Claimed),
    id: Number(row.id),
    lead_id: Number(row.lead_id),
    account_id: num(row.account_id),
  }));

  let sent = 0,
    failed = 0,
    skipped = 0;

  for (const row of rows) {
    const account = row.account_id ? (byId.get(row.account_id) ?? null) : null;
    if (account && account.remaining <= 0) {
      await db.update(r).set({ status: 'pending' }).where(eq(r.id, row.id));
      continue;
    }
    const [suppressed] = await db
      .select({ email: outreachSuppressionsTable.email })
      .from(outreachSuppressionsTable)
      .where(eq(outreachSuppressionsTable.email, row.email.toLowerCase()))
      .limit(1);
    if (suppressed) {
      await db.update(r).set({ status: 'skipped', error: 'suppressed' }).where(eq(r.id, row.id));
      skipped++;
      continue;
    }

    try {
      if (!row.crawled) {
        row.site_name = await rememberBusinessName({ id: row.lead_id, name: row.name, website: row.website });
      }
      const res = await deliver(account, buildMessage(row));
      if (account) account.remaining--;
      await db
        .update(r)
        .set({
          status: 'sent',
          sent_at: new Date(),
          error: null,
          account_id: account?.id ?? null,
          message_id: res.id,
          thread_id: res.threadId,
        })
        .where(eq(r.id, row.id));
      await db
        .update(leadsTable)
        .set({ status: 'contacted', updated_at: new Date() })
        .where(and(eq(leadsTable.id, row.lead_id), eq(leadsTable.status, 'new')));
      sent++;
    } catch (e) {
      await db.update(r).set({ status: 'failed', error: String(e) }).where(eq(r.id, row.id));
      failed++;
    }
    // Space sends out a little; bursts hurt deliverability.
    await new Promise((done) => setTimeout(done, 1500));
  }

  await db.execute(sql`
    update outreach_campaigns c set status = 'done'
    where status = 'active'
      and not exists (select 1 from outreach_recipients r where r.campaign_id = c.id and r.status in ('pending','sending'))`);

  const reason = rows.length ? undefined : exhausted.length ? 'nothing pending or sender daily limit reached' : 'nothing pending';
  return { sent, failed, skipped, reason };
}

const accountColumns = {
  id: outreachMailAccountsTable.id,
  email: outreachMailAccountsTable.email,
  from_name: outreachMailAccountsTable.from_name,
  refresh_token_enc: outreachMailAccountsTable.refresh_token_enc,
  daily_limit: outreachMailAccountsTable.daily_limit,
};

/** Checks sent threads for a reply or bounce, updates the lead status, and raises a bell alert per reply. */
export async function syncReplies() {
  const r = outreachRecipientsTable;
  const rows = await db
    .select({
      ...accountColumns,
      recipient_id: r.id,
      thread_id: r.thread_id,
      lead_id: r.lead_id,
      lead_email: r.email,
      lead_name: sql<string>`coalesce(${leadsTable.site_name}, ${leadsTable.name})`,
    })
    .from(r)
    .innerJoin(outreachMailAccountsTable, eq(outreachMailAccountsTable.id, r.account_id))
    .innerJoin(leadsTable, eq(leadsTable.id, r.lead_id))
    .where(
      and(eq(r.status, 'sent'), isNotNull(r.thread_id), isNull(r.replied_at), sql`coalesce(${r.error}, '') <> 'bounced'`)
    )
    .orderBy(desc(r.sent_at))
    .limit(40);

  let replied = 0,
    bounced = 0;
  for (const row of rows) {
    const kind = await classifyThread(row, row.thread_id!);
    if (kind === 'reply') {
      await db.update(r).set({ replied_at: new Date() }).where(eq(r.id, row.recipient_id));
      await db
        .update(leadsTable)
        .set({ status: 'replied', updated_at: new Date() })
        .where(and(eq(leadsTable.id, row.lead_id), ne(leadsTable.status, 'unsubscribed')));
      try {
        await db.insert(notificationsTable).values({
          type: 'lead',
          title: `Reply from ${row.lead_name}`,
          message: `${row.lead_name} (${row.lead_email}) replied to your outreach.`,
          action_url: '/admin/outreach/replies',
        });
      } catch {
        // The bell is a convenience; the reply is already recorded.
      }
      replied++;
    } else if (kind === 'bounce') {
      await db.update(r).set({ error: 'bounced' }).where(eq(r.id, row.recipient_id));
      await db
        .update(leadsTable)
        .set({ status: 'bounced', updated_at: new Date() })
        .where(and(eq(leadsTable.id, row.lead_id), ne(leadsTable.status, 'unsubscribed')));
      bounced++;
    }
  }
  const notified = await notifyPendingReplies();
  return { checked: rows.length, replied, bounced, notified };
}

/** Emails the team once for each new reply, using the connected Gmail account. */
async function notifyPendingReplies() {
  const targets = await db
    .select({ email: outreachNotifyEmailsTable.email })
    .from(outreachNotifyEmailsTable)
    .orderBy(asc(outreachNotifyEmailsTable.email));
  if (!targets.length) return 0;

  const r = outreachRecipientsTable;
  const rows = await db
    .select({
      ...accountColumns,
      recipient_id: r.id,
      lead_email: r.email,
      lead_name: sql<string>`coalesce(${leadsTable.site_name}, ${leadsTable.name})`,
    })
    .from(r)
    .innerJoin(leadsTable, eq(leadsTable.id, r.lead_id))
    .innerJoin(outreachMailAccountsTable, eq(outreachMailAccountsTable.id, r.account_id))
    .where(and(isNotNull(r.replied_at), isNull(r.reply_notified_at)))
    .orderBy(asc(r.replied_at))
    .limit(20);

  const repliesUrl = `${outreachBaseUrl()}/admin/outreach/replies`;
  let notified = 0;
  for (const row of rows) {
    let delivered = false;
    for (const target of targets) {
      try {
        await deliver(row, {
          to: target.email,
          subject: `Reply from ${row.lead_name}`,
          text: `${row.lead_name} (${row.lead_email}) replied to your outreach.\n\n${repliesUrl}`,
          html:
            `<p><b>${escapeHtml(row.lead_name)}</b> (${escapeHtml(row.lead_email)}) replied to your outreach.</p>` +
            `<p><a href="${repliesUrl}">Open replies</a></p>`,
          headers: {},
        });
        delivered = true;
      } catch {
        // Keep trying the other team addresses.
      }
    }
    if (delivered) {
      await db.update(r).set({ reply_notified_at: new Date() }).where(eq(r.id, row.recipient_id));
      notified++;
    }
  }
  return notified;
}

/** Adds the token's email to the suppression list and cancels its pending sends. */
export async function unsubscribeByToken(token: string) {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return null;
  const r = outreachRecipientsTable;
  const [row] = await db.select({ email: r.email, lead_id: r.lead_id }).from(r).where(eq(r.token, token));
  if (!row) return null;
  await db
    .insert(outreachSuppressionsTable)
    .values({ email: row.email.toLowerCase(), reason: 'unsubscribed' })
    .onConflictDoNothing();
  await db.update(leadsTable).set({ status: 'unsubscribed', updated_at: new Date() }).where(eq(leadsTable.id, row.lead_id));
  await db
    .update(r)
    .set({ status: 'skipped', error: 'unsubscribed' })
    .where(and(sql`lower(${r.email}) = lower(${row.email})`, eq(r.status, 'pending')));
  return row.email;
}
