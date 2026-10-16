import 'server-only';

import { eq, notInArray, sql } from 'drizzle-orm';

import { db } from '@/utils/db/db';
import { leadScrapeJobsTable, leadsTable } from '@/utils/db/schema';

import { FINISHED_JOB_STATUSES } from './constants';
import { findCategory } from './taxonomy';

// Google Maps Scraper: https://apify.com/compass/crawler-google-places
const ACTOR = 'compass~crawler-google-places';
const API = 'https://api.apify.com/v2';

function token() {
  const t = process.env.APIFY_TOKEN;
  if (!t) throw new Error('APIFY_TOKEN is not set');
  return t;
}

async function apify<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Apify ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

type Run = { id: string; status: string; defaultDatasetId: string };

export async function startScrape(opts: {
  country: string;
  city?: string;
  category: string;
  maxResults: number;
  withWebsiteOnly: boolean;
}) {
  const cat = findCategory(opts.category);
  if (!cat) throw new Error(`Unknown category: ${opts.category}`);

  const input = {
    searchStringsArray: [cat.query],
    countryCode: opts.country,
    ...(opts.city ? { city: opts.city } : {}),
    maxCrawledPlacesPerSearch: opts.maxResults,
    language: 'en',
    skipClosedPlaces: true,
    scrapeContacts: true, // pulls emails + socials from each business website
    ...(opts.withWebsiteOnly ? { website: 'withWebsite' } : {}),
  };

  const { data: run } = await apify<{ data: Run }>(`/acts/${ACTOR}/runs`, {
    method: 'POST',
    body: JSON.stringify(input),
  });

  const [job] = await db
    .insert(leadScrapeJobsTable)
    .values({
      country: opts.country,
      city: opts.city || null,
      category: cat.label,
      query: cat.query,
      max_results: opts.maxResults,
      apify_run_id: run.id,
      dataset_id: run.defaultDatasetId,
      status: run.status,
    })
    .returning({ id: leadScrapeJobsTable.id });
  return job.id;
}

type Place = {
  placeId?: string;
  title?: string;
  categoryName?: string;
  address?: string;
  city?: string;
  countryCode?: string;
  phone?: string;
  website?: string;
  emails?: string[];
  facebooks?: string[];
  instagrams?: string[];
  linkedIns?: string[];
  twitters?: string[];
  totalScore?: number;
  reviewsCount?: number;
  url?: string;
};

/** Refreshes one job's status from Apify and imports its results once it finishes. */
export async function syncJob(jobId: number) {
  const [job] = await db.select().from(leadScrapeJobsTable).where(eq(leadScrapeJobsTable.id, jobId));
  if (!job || FINISHED_JOB_STATUSES.includes(job.status)) return;

  const { data: run } = await apify<{ data: Run }>(`/actor-runs/${job.apify_run_id}`);
  if (!FINISHED_JOB_STATUSES.includes(run.status)) {
    await db.update(leadScrapeJobsTable).set({ status: run.status }).where(eq(leadScrapeJobsTable.id, jobId));
    return;
  }
  if (run.status === 'FAILED') {
    await db
      .update(leadScrapeJobsTable)
      .set({ status: run.status, finished_at: new Date() })
      .where(eq(leadScrapeJobsTable.id, jobId));
    return;
  }
  // SUCCEEDED, or ABORTED / TIMED-OUT: import whatever was collected (partial results are still paid for).

  const places = await apify<Place[]>(`/datasets/${job.dataset_id}/items?clean=true&format=json`);
  const group = findCategory(job.category)?.group ?? null;
  let imported = 0;
  for (const p of places) {
    if (!p.title) continue;
    const emails = [...new Set((p.emails ?? []).map((e) => e.trim().toLowerCase()))];
    const socials = {
      facebook: p.facebooks?.[0],
      instagram: p.instagrams?.[0],
      linkedin: p.linkedIns?.[0],
      twitter: p.twitters?.[0],
    };
    await db
      .insert(leadsTable)
      .values({
        place_id: p.placeId ?? `${p.title}|${p.address}`,
        name: p.title,
        category_group: group,
        category: job.category,
        google_category: p.categoryName ?? null,
        country: (p.countryCode ?? job.country).toLowerCase(),
        city: p.city ?? null,
        address: p.address ?? null,
        phone: p.phone ?? null,
        website: p.website ?? null,
        email: emails[0] ?? null,
        emails,
        socials: sql`${JSON.stringify(socials)}::jsonb`,
        rating: p.totalScore == null ? null : String(p.totalScore),
        reviews_count: p.reviewsCount ?? null,
        maps_url: p.url ?? null,
        job_id: job.id,
      })
      .onConflictDoUpdate({
        target: leadsTable.place_id,
        set: {
          phone: sql`coalesce(excluded.phone, ${leadsTable.phone})`,
          website: sql`coalesce(excluded.website, ${leadsTable.website})`,
          email: sql`coalesce(${leadsTable.email}, excluded.email)`,
          emails: sql`(select array(select distinct unnest(${leadsTable.emails} || excluded.emails)))`,
          socials: sql`${leadsTable.socials} || excluded.socials`,
          rating: sql`excluded.rating`,
          reviews_count: sql`excluded.reviews_count`,
          updated_at: sql`now()`,
        },
      });
    imported++;
  }
  await db
    .update(leadScrapeJobsTable)
    .set({ status: run.status, lead_count: imported, finished_at: new Date() })
    .where(eq(leadScrapeJobsTable.id, jobId));
}

/** Syncs every unfinished job; a failure is stored on that job and the rest carry on. */
export async function syncRunningJobs() {
  const jobs = await db
    .select({ id: leadScrapeJobsTable.id })
    .from(leadScrapeJobsTable)
    .where(notInArray(leadScrapeJobsTable.status, FINISHED_JOB_STATUSES));
  for (const j of jobs) {
    try {
      await syncJob(j.id);
    } catch (e) {
      await db.update(leadScrapeJobsTable).set({ error: String(e) }).where(eq(leadScrapeJobsTable.id, j.id));
    }
  }
  return jobs.length;
}
