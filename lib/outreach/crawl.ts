import 'server-only';

import { and, asc, eq, isNull } from 'drizzle-orm';

import { db } from '@/utils/db/db';
import { leadsTable, outreachRecipientsTable } from '@/utils/db/schema';

import { chooseBusinessName, nameFromHtml } from './site-name';

async function fetchSiteName(website: string) {
  let url = website.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      redirect: 'follow',
      cache: 'no-store',
      headers: {
        Accept: 'text/html',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      },
    });
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || !type.includes('html')) return null;
    return nameFromHtml((await res.text()).slice(0, 150_000));
  } catch {
    return null;
  }
}

/** Crawls the business website and stores the name the email should use. */
export async function rememberBusinessName(lead: { id: number; name: string; website: string | null }) {
  const extracted = lead.website ? await fetchSiteName(lead.website) : null;
  const chosen = chooseBusinessName(lead.name, extracted);
  const now = new Date();
  await db
    .update(leadsTable)
    .set({ site_name: chosen, crawled_at: now, updated_at: now })
    .where(eq(leadsTable.id, lead.id));
  return chosen;
}

/** Crawls the next uncrawled businesses in a campaign. */
export async function crawlCampaign(campaignId: number, limit = 20) {
  const rows = await db
    .select({ id: leadsTable.id, name: leadsTable.name, website: leadsTable.website })
    .from(outreachRecipientsTable)
    .innerJoin(leadsTable, eq(leadsTable.id, outreachRecipientsTable.lead_id))
    .where(and(eq(outreachRecipientsTable.campaign_id, campaignId), isNull(leadsTable.crawled_at)))
    .orderBy(asc(leadsTable.id))
    .limit(limit);
  let renamed = 0;
  for (const row of rows) {
    const chosen = await rememberBusinessName(row);
    if (chosen.trim().toLowerCase() !== row.name.trim().toLowerCase()) renamed++;
  }
  return { crawled: rows.length, renamed };
}
