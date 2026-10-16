-- Lead finder + cold-email outreach (Admin → Lead finder), moved from the standalone lead-finder app.
-- Apply with: npm run db:apply -- 0021_lead_finder   (or paste into the Supabase SQL Editor).
-- Safe to run more than once.
--
-- Ids stay bigint (as in lead-finder) so scripts/outreach/copy-from-lead-finder.ts can copy rows with
-- their ids, and the unsubscribe tokens in emails already sent keep working.

create table if not exists public.lead_scrape_jobs (
  id            bigserial primary key,
  country       text not null,
  city          text,
  category      text not null,
  query         text not null,
  max_results   int  not null,
  apify_run_id  text,
  dataset_id    text,
  status        text not null default 'PENDING',
  lead_count    int  not null default 0,
  error         text,
  created_at    timestamptz not null default now(),
  finished_at   timestamptz
);

create table if not exists public.leads (
  id              bigserial primary key,
  place_id        text unique,
  name            text not null,
  site_name       text,
  category_group  text,
  category        text,
  google_category text,
  country         text,
  city            text,
  address         text,
  phone           text,
  website         text,
  email           text,
  emails          text[] not null default '{}',
  socials         jsonb  not null default '{}',
  rating          numeric,
  reviews_count   int,
  maps_url        text,
  status          text not null default 'new',
  notes           text,
  job_id          bigint references public.lead_scrape_jobs(id) on delete set null,
  client_id       text references public.clients(id) on delete set null,
  crawled_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists leads_country_idx  on public.leads (country);
create index if not exists leads_category_idx on public.leads (category);
create index if not exists leads_status_idx   on public.leads (status);
create index if not exists leads_email_idx    on public.leads (lower(email));

create table if not exists public.outreach_templates (
  id         bigserial primary key,
  name       text not null,
  subject    text not null,
  body       text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.outreach_mail_accounts (
  id                bigserial primary key,
  email             text not null unique,
  from_name         text,
  refresh_token_enc text not null,
  daily_limit       int  not null default 400,
  created_at        timestamptz not null default now()
);

create table if not exists public.outreach_campaigns (
  id          bigserial primary key,
  name        text not null,
  template_id bigint not null references public.outreach_templates(id),
  account_id  bigint references public.outreach_mail_accounts(id) on delete set null,
  status      text not null default 'draft',
  created_at  timestamptz not null default now()
);

create table if not exists public.outreach_recipients (
  id                bigserial primary key,
  campaign_id       bigint not null references public.outreach_campaigns(id) on delete cascade,
  lead_id           bigint not null references public.leads(id) on delete cascade,
  email             text not null,
  token             uuid not null default gen_random_uuid(),
  status            text not null default 'pending',
  error             text,
  sent_at           timestamptz,
  account_id        bigint references public.outreach_mail_accounts(id) on delete set null,
  message_id        text,
  thread_id         text,
  replied_at        timestamptz,
  reply_notified_at timestamptz,
  unique (campaign_id, lead_id)
);
create index if not exists outreach_recipients_status_idx on public.outreach_recipients (status);
create index if not exists outreach_recipients_lead_idx   on public.outreach_recipients (lead_id);
create unique index if not exists outreach_recipients_token_idx on public.outreach_recipients (token);

create table if not exists public.outreach_suppressions (
  email      text primary key,
  reason     text,
  created_at timestamptz not null default now()
);

create table if not exists public.outreach_notify_emails (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- Cold leads and encrypted Gmail tokens must never be readable through the Supabase API.
-- RLS on with no policies blocks the anon/authenticated roles; the app connects with
-- DATABASE_URL (table owner), which bypasses RLS.
alter table public.lead_scrape_jobs       enable row level security;
alter table public.leads                  enable row level security;
alter table public.outreach_templates     enable row level security;
alter table public.outreach_mail_accounts enable row level security;
alter table public.outreach_campaigns     enable row level security;
alter table public.outreach_recipients    enable row level security;
alter table public.outreach_suppressions  enable row level security;
alter table public.outreach_notify_emails enable row level security;

-- "A lead replied" alerts in the admin bell.
alter type public.notification_type add value if not exists 'lead';
