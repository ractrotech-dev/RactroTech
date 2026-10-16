/**
 * Copies every row from the old lead-finder database into RactroTech's Lead finder tables
 * (utils/db/migrations/0021_lead_finder.sql must be applied first). Ids, unsubscribe tokens
 * and encrypted Gmail tokens are copied unchanged. The source database is only read.
 *
 *   LEAD_FINDER_DATABASE_URL=postgres://… npm run outreach:copy -- --dry-run   counts only, writes nothing
 *   LEAD_FINDER_DATABASE_URL=postgres://… npm run outreach:copy                trial copy (see below)
 *   LEAD_FINDER_DATABASE_URL=postgres://… npm run outreach:copy -- --final     cutover copy
 *
 * Trial copy: upserts every row, then pauses active campaigns so RactroTech can't send
 * emails the old app is still sending. Run it as often as you like.
 * Final copy: run after lead-finder's scheduler is stopped. Empties the Lead finder tables,
 * copies everything with its real status, and keeps any "Convert to client" links made
 * during the trial. Either way it's one transaction: on error nothing changes.
 *
 * The target is DIRECT_URL (or DATABASE_URL) from .env.local / .env.
 *
 * Cutover, in this order:
 *   1. RactroTech deployed with the Lead finder env vars (.env.example), migration 0021 applied,
 *      and the Gmail redirect URI added in Google Cloud. A trial copy has been checked in the admin.
 *   2. Trial copy once more, right before (so every token already sent out exists in RactroTech).
 *   3. Deploy lead-finder with MOVED_TO_URL set: its cron stops sending, its pages redirect to the
 *      admin, and its unsubscribe links forward here.
 *   4. npm run outreach:copy -- --final
 *   5. Point the scheduler at /api/outreach/cron (same CRON_SECRET header) instead of /api/cron/send.
 */

import { createDecipheriv, createHash } from 'node:crypto';
import { config } from 'dotenv';
import postgres from 'postgres';

import { getPostgresSsl } from '../../utils/db/postgres-ssl';

config({ path: ['.env.local', '.env'] });

type Table = { source: string; target: string; key: 'id' | 'email' };

// Parents before children, so foreign keys hold at every step.
const TABLES: Table[] = [
  { source: 'scrape_jobs', target: 'lead_scrape_jobs', key: 'id' },
  { source: 'leads', target: 'leads', key: 'id' },
  { source: 'templates', target: 'outreach_templates', key: 'id' },
  { source: 'mail_accounts', target: 'outreach_mail_accounts', key: 'id' },
  { source: 'campaigns', target: 'outreach_campaigns', key: 'id' },
  { source: 'campaign_recipients', target: 'outreach_recipients', key: 'id' },
  { source: 'suppressions', target: 'outreach_suppressions', key: 'email' },
  { source: 'notify_emails', target: 'outreach_notify_emails', key: 'email' },
];

const BATCH = 1000;
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const final = args.has('--final');

const hostOf = (url: string) => {
  const u = new URL(url.replace(/^postgresql:/, 'postgres:'));
  return `${u.hostname}:${u.port || 5432}${u.pathname}|${decodeURIComponent(u.username)}`;
};

async function columns(sql: postgres.Sql, table: string) {
  const rows = await sql<{ column_name: string }[]>`
    select column_name from information_schema.columns
    where table_schema = 'public' and table_name = ${table} order by ordinal_position`;
  return rows.map((r) => r.column_name);
}

/** Same scheme as lib/outreach/crypto.ts (which can't be imported outside Next). */
function canDecrypt(enc: string, key: string) {
  try {
    const [iv, tag, data] = enc.split('.').map((s) => Buffer.from(s, 'base64'));
    const d = createDecipheriv('aes-256-gcm', createHash('sha256').update(key).digest(), iv);
    d.setAuthTag(tag);
    Buffer.concat([d.update(data), d.final()]);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const sourceUrl = process.env.LEAD_FINDER_DATABASE_URL;
  const targetUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!sourceUrl) throw new Error('Set LEAD_FINDER_DATABASE_URL to the old lead-finder DATABASE_URL.');
  if (!targetUrl) throw new Error('Missing DIRECT_URL / DATABASE_URL for RactroTech in .env.local.');
  if (hostOf(sourceUrl) === hostOf(targetUrl)) throw new Error('Source and target are the same database. Stopping.');

  // 'prefer': TLS without certificate checks (Supabase's chain), plain only if the server has no TLS.
  const source = postgres(sourceUrl, { max: 1, prepare: false, ssl: 'prefer' });
  // Read date/timestamp columns as text: a JS Date would drop the microseconds.
  const parsers = (source.options as unknown as { parsers: Record<number, (x: string) => unknown> }).parsers;
  for (const oid of [1082, 1114, 1184]) parsers[oid] = (x) => x;
  const target = postgres(targetUrl, { max: 1, prepare: false, ssl: getPostgresSsl() });

  try {
    const plan: (Table & { cols: string[]; sourceCount: number; targetCount: number })[] = [];
    for (const t of TABLES) {
      const [srcCols, dstCols] = await Promise.all([columns(source, t.source), columns(target, t.target)]);
      if (!dstCols.length) throw new Error(`Table ${t.target} is missing. Run: npm run db:apply -- 0021_lead_finder`);
      if (!srcCols.length) throw new Error(`Source table ${t.source} not found. Is LEAD_FINDER_DATABASE_URL the lead-finder database?`);
      const dropped = srcCols.filter((c) => !dstCols.includes(c));
      if (dropped.length) throw new Error(`${t.source} has columns RactroTech doesn't: ${dropped.join(', ')}`);
      const [[{ n: sourceCount }], [{ n: targetCount }]] = await Promise.all([
        source<{ n: number }[]>`select count(*)::int as n from ${source(t.source)}`,
        target<{ n: number }[]>`select count(*)::int as n from ${target(t.target)}`,
      ]);
      plan.push({ ...t, cols: srcCols, sourceCount, targetCount });
    }

    console.log(`Mode: ${dryRun ? 'dry run (no writes)' : final ? 'FINAL (replace)' : 'trial (upsert, campaigns paused)'}\n`);
    console.table(plan.map((p) => ({ from: p.source, to: p.target, 'rows in lead-finder': p.sourceCount, 'rows in RactroTech now': p.targetCount })));

    const [account] = await source<{ email: string; refresh_token_enc: string }[]>`select email, refresh_token_enc from mail_accounts limit 1`;
    if (account) {
      const key = process.env.ENCRYPTION_KEY;
      if (!key) console.warn(`\n⚠ ENCRYPTION_KEY isn't set for RactroTech. Gmail senders (${account.email}, …) won't send until it matches lead-finder's.`);
      else if (!canDecrypt(account.refresh_token_enc, key))
        console.warn(`\n⚠ ENCRYPTION_KEY differs from lead-finder's: ${account.email} can't be decrypted. Use the old key, or reconnect each Gmail account after the copy.`);
      else console.log('\n✓ ENCRYPTION_KEY matches: connected Gmail senders will keep working.');
    }

    if (dryRun) return;

    await target.begin(async (tx) => {
      if (final) {
        await tx`create temp table keep_client_links on commit drop as select id, client_id from leads where client_id is not null`;
        // Unsubscribes that reached RactroTech before this copy (forwarded by the old app) must survive it.
        await tx`create temp table keep_suppressions on commit drop as select * from outreach_suppressions`;
        await tx.unsafe(`truncate ${TABLES.map((t) => `public.${t.target}`).join(', ')} restart identity`);
      }

      for (const t of plan) {
        const cols = t.cols.map((c) => `"${c}"`).join(', ');
        const updates = t.cols
          .filter((c) => c !== t.key)
          .map((c) => `"${c}" = excluded."${c}"`)
          .join(', ');
        const upsert = `
          insert into public.${t.target} (${cols})
          select ${cols} from jsonb_populate_recordset(null::public.${t.target}, $1::text::jsonb)
          on conflict ("${t.key}") do ${updates ? `update set ${updates}` : 'nothing'}`;

        let last: string | number | null = null;
        let copied = 0;
        for (;;) {
          const rows: Record<string, unknown>[] = await source.unsafe(
            `select * from public.${t.source} ${last === null ? '' : `where "${t.key}" > $1`} order by "${t.key}" limit ${BATCH}`,
            last === null ? [] : [last]
          );
          if (!rows.length) break;
          await tx.unsafe(upsert, [JSON.stringify(rows)]);
          copied += rows.length;
          last = rows[rows.length - 1][t.key] as string | number;
          if (rows.length < BATCH) break;
        }
        console.log(`  ${t.source} → ${t.target}: ${copied} rows`);

        if (t.key === 'id') {
          await tx.unsafe(
            `select setval(pg_get_serial_sequence('public.${t.target}', 'id'), greatest(coalesce(max(id), 0), 1), max(id) is not null) from public.${t.target}`
          );
        }
      }

      if (final) {
        await tx`update leads l set client_id = k.client_id from keep_client_links k where k.id = l.id`;
        const kept = await tx`
          insert into outreach_suppressions select * from keep_suppressions on conflict (email) do nothing returning email`;
        if (kept.length) {
          const emails = kept.map((k) => k.email as string);
          await tx`
            update leads set status = 'unsubscribed', updated_at = now()
            where lower(email) in ${tx(emails)} and status <> 'unsubscribed'`;
          await tx`
            update outreach_recipients set status = 'skipped', error = 'unsubscribed'
            where status = 'pending' and lower(email) in ${tx(emails)}`;
          console.log(`\n  Kept ${kept.length} unsubscribe(s) recorded in RactroTech that lead-finder doesn't have.`);
        }
      } else {
        const paused = await tx`update outreach_campaigns set status = 'paused' where status = 'active' returning id`;
        if (paused.length) console.log(`\n  Paused ${paused.length} active campaign(s) in RactroTech so nothing is sent twice. --final copies their real status.`);
      }
    });
    console.log('\nDone.');
  } finally {
    await Promise.all([source.end(), target.end()]);
  }
}

main().catch((err) => {
  console.error('\nCopy failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
