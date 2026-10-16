import { asc, sql } from 'drizzle-orm';
import { Mail } from 'lucide-react';

import {
  addNotifyEmail,
  disconnectAccount,
  removeNotifyEmail,
  sendTestEmail,
  updateAccountLimit,
} from '@/app/admin/outreach/actions';
import DatabaseError from '@/components/admin/DatabaseError';
import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';
import { ConfirmButton } from '@/components/admin/outreach/ConfirmButton';
import { FormAction, SubmitButton } from '@/components/admin/outreach/FormAction';
import { AdminCard, CardBody, CardHeader, DataTable, Notice, buttonClass, field, table } from '@/components/admin/ui';
import { formatCount } from '@/lib/admin/format';
import { smtpConfigured } from '@/lib/outreach/config';
import { googleConfigured, redirectUri } from '@/lib/outreach/gmail';
import { cn } from '@/lib/utils';
import { db } from '@/utils/db/db';
import { outreachMailAccountsTable, outreachNotifyEmailsTable } from '@/utils/db/schema';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mail accounts | Admin | RactroTech', description: 'Gmail senders and reply alerts' };

const code = 'rounded bg-mkt-ink/[0.06] px-1.5 py-0.5 text-[12px]';

export default async function MailAccountsPage({ searchParams }: { searchParams: { connected?: string; error?: string } }) {
  try {
    const a = outreachMailAccountsTable;
    const [accounts, notify] = await Promise.all([
      db
        .select({
          id: a.id,
          email: a.email,
          fromName: a.from_name,
          dailyLimit: a.daily_limit,
          sent24h: sql<number>`(select count(*) from outreach_recipients r
            where r.account_id = ${a.id} and r.status = 'sent' and r.sent_at > now() - interval '24 hours')`.mapWith(Number),
        })
        .from(a)
        .orderBy(asc(a.id)),
      db.select({ email: outreachNotifyEmailsTable.email }).from(outreachNotifyEmailsTable).orderBy(asc(outreachNotifyEmailsTable.email)),
    ]);
    const ready = googleConfigured() && Boolean(process.env.ENCRYPTION_KEY);
    const smtp = smtpConfigured();

    return (
      <div className="max-w-4xl space-y-6">
        <PageHeader
          title="Mail accounts"
          subtitle="Gmail or Google Workspace addresses that campaigns send from. Emails appear in each account’s Sent folder, and replies are detected from it."
          backHref="/admin/outreach"
          backLabel="Find leads"
          actions={
            ready ? (
              <a href="/api/outreach/google/connect" className={buttonClass('primary')}>
                Connect Gmail
              </a>
            ) : null
          }
        />

        {searchParams.connected ? <Notice tone="green">Connected {searchParams.connected}.</Notice> : null}
        {searchParams.error ? <Notice tone="red">{searchParams.error}</Notice> : null}

        {!ready ? (
          <Notice tone="amber" title="Gmail isn’t set up yet. One-time setup (about 5 minutes):">
            <ol className="mt-1 list-decimal space-y-1 pl-5">
              <li>
                In Google Cloud Console, enable the <b>Gmail API</b> for your project.
              </li>
              <li>
                <b>OAuth consent screen</b>: <b>Internal</b> if every sender is in your Workspace, otherwise <b>External</b> with each sender under
                Test users.
              </li>
              <li>
                <b>Credentials → OAuth client ID → Web application</b>, with this redirect URI:{' '}
                <code className={cn(code, 'mt-1 block w-fit')}>{redirectUri()}</code>
              </li>
              <li>
                Set <code className={code}>GOOGLE_CLIENT_ID</code>, <code className={code}>GOOGLE_CLIENT_SECRET</code> and{' '}
                <code className={code}>ENCRYPTION_KEY</code> (the same key the old lead-finder app used), then redeploy.
              </li>
            </ol>
          </Notice>
        ) : null}

        <AdminCard>
          <CardHeader
            title="Senders"
            description="Google’s caps: about 500 a day for personal Gmail, 2,000 for Workspace. For cold outreach start at 30–50 a day per new account. Disconnecting pauses that account’s active campaigns."
          />
          {accounts.length === 0 ? (
            <EmptyState
              icon={<Mail />}
              title="No Gmail accounts connected"
              description={smtp ? 'Campaigns can still send through SMTP from the environment.' : 'Connect one to start sending.'}
            />
          ) : (
            <DataTable>
              <thead>
                <tr className={table.headRow}>
                  <th className={table.th}>Account</th>
                  <th className={table.thNum}>Sent (24h)</th>
                  <th className={table.th}>Daily limit</th>
                  <th className={table.th}>
                    <span className="sr-only">Disconnect</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.id} className={table.row}>
                    <td className={table.td}>
                      <div className="font-medium">{acc.email}</div>
                      {acc.fromName ? <div className="text-[12px] text-mkt-muted">Sends as “{acc.fromName}”</div> : null}
                    </td>
                    <td className={table.tdNum}>{formatCount(acc.sent24h)}</td>
                    <td className={table.td}>
                      <form action={updateAccountLimit.bind(null, acc.id)} className="flex items-center gap-2">
                        <input
                          name="dailyLimit"
                          type="number"
                          min={1}
                          max={2000}
                          defaultValue={acc.dailyLimit}
                          aria-label={`Daily limit for ${acc.email}`}
                          className={cn(field.input, 'h-8 w-24')}
                        />
                        <SubmitButton className={buttonClass('secondary', 'sm')}>Save</SubmitButton>
                      </form>
                    </td>
                    <td className={cn(table.td, 'text-right')}>
                      <form action={disconnectAccount.bind(null, acc.id)}>
                        <ConfirmButton
                          confirm={`Disconnect ${acc.email}? Its active campaigns will be paused.`}
                          className="text-[12px] font-medium text-mkt-muted hover:text-red-600"
                        >
                          Disconnect
                        </ConfirmButton>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </AdminCard>

        <AdminCard>
          <CardHeader
            title="Reply alerts"
            description="When a lead replies, these addresses get an email from the sending Gmail account. Every admin also sees it in Notifications."
          />
          <CardBody className="space-y-4">
            <FormAction action={addNotifyEmail} className="flex flex-wrap items-start gap-2">
              <input name="email" type="email" placeholder="teammate@company.com" aria-label="Email address" className={cn(field.input, 'w-72')} required />
              <SubmitButton className={buttonClass('secondary')}>Add</SubmitButton>
            </FormAction>
            {notify.length === 0 ? (
              <p className="text-[14px] text-mkt-muted">No one gets reply emails yet.</p>
            ) : (
              <ul className="divide-y divide-mkt-line rounded-xl border border-mkt-line">
                {notify.map((n) => (
                  <li key={n.email} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[14px]">
                    <span>{n.email}</span>
                    <form action={removeNotifyEmail.bind(null, n.email)}>
                      <SubmitButton className="text-[12px] font-medium text-mkt-muted hover:text-red-600">Remove</SubmitButton>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </AdminCard>

        {accounts.length > 0 || smtp ? (
          <AdminCard>
            <CardHeader title="Send a test email" />
            <CardBody>
              <FormAction action={sendTestEmail} className="flex flex-wrap items-start gap-2">
                <select name="accountId" aria-label="Send from" className={cn(field.input, 'w-auto')}>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.email}
                    </option>
                  ))}
                  {smtp ? <option value="">SMTP ({process.env.MAIL_FROM})</option> : null}
                </select>
                <input name="to" type="email" placeholder="you@example.com" aria-label="Send to" className={cn(field.input, 'w-64')} required />
                <SubmitButton className={buttonClass('secondary')} pendingLabel="Sending…">
                  Send test
                </SubmitButton>
              </FormAction>
            </CardBody>
          </AdminCard>
        ) : null}
      </div>
    );
  } catch (error) {
    return <DatabaseError message={error instanceof Error ? error.message : String(error)} />;
  }
}
