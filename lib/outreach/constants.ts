// Shared by Lead finder pages and their client components (no server imports here).

export const LEAD_STATUSES = ['new', 'contacted', 'replied', 'bounced', 'unsubscribed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Template placeholders, written as {{name}} in a subject or body. */
export const PLACEHOLDERS = ['business_name', 'category', 'city', 'country', 'website'] as const;

/** Apify run statuses after which a scrape job no longer changes. */
export const FINISHED_JOB_STATUSES = ['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'];

/** Searches (cities × categories) one Find leads submit may start. */
export const MAX_SEARCHES_PER_SUBMIT = 50;
