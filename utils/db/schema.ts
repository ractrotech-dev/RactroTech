import { sql } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  boolean,
  real,
  bigint,
  bigserial,
  jsonb,
  numeric,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

// ─── Role Enums ────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'admin',
  'manager',
  'developer',
  'client',
  'user',
]);

export const inquiryStatusEnum = pgEnum('inquiry_status', [
  'new',
  'in_progress',
  'responded',
  'converted',
  'closed',
]);

export const inquiryPriorityEnum = pgEnum('inquiry_priority', [
  'low',
  'medium',
  'high',
  'urgent',
]);

export const projectStatusEnum = pgEnum('project_status', [
  'planning',
  'in_progress',
  'review',
  'deployed',
  'completed',
  'on_hold',
  'cancelled',
]);

export const taskStatusEnum = pgEnum('task_status', [
  'todo',
  'in_progress',
  'review',
  'done',
]);

export const taskPriorityEnum = pgEnum('task_priority', [
  'low',
  'medium',
  'high',
  'critical',
]);

export const clientStatusEnum = pgEnum('client_status', [
  'lead',
  'onboarding',
  'active',
  'inactive',
  'churned',
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'inquiry',
  'project',
  'client',
  'team',
  'system',
  'alert',
  'lead',
]);

export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'published',
  'archived',
]);

// ─── Users Table ───────────────────────────────────────────────────────────────
export const usersTable = pgTable('users_table', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  plan: text('plan').notNull(),
  stripe_id: text('stripe_id').notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  avatar_url: text('avatar_url'),
  phone: text('phone'),
  created_at: timestamp('created_at').defaultNow(),
  last_login: timestamp('last_login'),
});

// ─── User Profiles (Supabase Auth sync) ─────────────────────────────────────────
export const profilesTable = pgTable('profiles', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  full_name: text('full_name'),
  username: text('username').unique(),
  avatar_url: text('avatar_url'),
  provider: text('provider').notNull().default('email'),
  bio: text('bio'),
  website: text('website'),
  github: text('github'),
  twitter: text('twitter'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Project Enquiries Table ───────────────────────────────────────────────────
export const projectEnquiriesTable = pgTable('project_enquiries', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  project_type: text('project_type').notNull(),
  description: text('description').notNull(),
  status: inquiryStatusEnum('status').notNull().default('new'),
  priority: inquiryPriorityEnum('priority').notNull().default('medium'),
  assigned_to: text('assigned_to').references(() => usersTable.id),
  budget: text('budget'),
  source: text('source').default('website'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// ─── Inquiry Notes Table ───────────────────────────────────────────────────────
export const inquiryNotesTable = pgTable('inquiry_notes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  inquiry_id: text('inquiry_id').notNull().references(() => projectEnquiriesTable.id),
  author_id: text('author_id').notNull().references(() => usersTable.id),
  content: text('content').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

// ─── Clients Table ─────────────────────────────────────────────────────────────
export const clientsTable = pgTable('clients', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  category: text('category'),
  state: text('state'),
  region: text('region'),
  country: text('country'),
  avatar_url: text('avatar_url'),
  status: clientStatusEnum('status').notNull().default('lead'),
  notes: text('notes'),
  user_id: text('user_id').references(() => usersTable.id),
  inquiry_id: text('inquiry_id').references(() => projectEnquiriesTable.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// ─── Projects Table ────────────────────────────────────────────────────────────
export const projectsTable = pgTable('projects', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  client_id: text('client_id').references(() => clientsTable.id),
  status: projectStatusEnum('status').notNull().default('planning'),
  progress: integer('progress').notNull().default(0),
  start_date: timestamp('start_date'),
  due_date: timestamp('due_date'),
  completed_date: timestamp('completed_date'),
  budget: real('budget'),
  tech_stack: text('tech_stack'),
  live_url: text('live_url'),
  repo_url: text('repo_url'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// ─── Project Tasks Table ───────────────────────────────────────────────────────
export const projectTasksTable = pgTable('project_tasks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  project_id: text('project_id').notNull().references(() => projectsTable.id),
  title: text('title').notNull(),
  description: text('description'),
  status: taskStatusEnum('status').notNull().default('todo'),
  priority: taskPriorityEnum('priority').notNull().default('medium'),
  assigned_to: text('assigned_to').references(() => usersTable.id),
  due_date: timestamp('due_date'),
  completed_at: timestamp('completed_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

// ─── Project Milestones Table ──────────────────────────────────────────────────
export const projectMilestonesTable = pgTable('project_milestones', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  project_id: text('project_id').notNull().references(() => projectsTable.id),
  title: text('title').notNull(),
  description: text('description'),
  due_date: timestamp('due_date'),
  completed: boolean('completed').notNull().default(false),
  completed_at: timestamp('completed_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

// ─── Activity Logs (Audit Trail) ───────────────────────────────────────────────
export const activityLogsTable = pgTable('activity_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text('user_id').references(() => usersTable.id),
  action: text('action').notNull(),
  entity_type: text('entity_type').notNull(), // 'inquiry', 'project', 'user', etc.
  entity_id: text('entity_id'),
  metadata: text('metadata'), // JSON string for extra details
  ip_address: text('ip_address'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

// ─── Notifications Table ───────────────────────────────────────────────────────
export const notificationsTable = pgTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text('user_id').references(() => usersTable.id),
  type: notificationTypeEnum('type').notNull().default('system'),
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  action_url: text('action_url'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

// ─── Type Exports ──────────────────────────────────────────────────────────────
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;
export type InsertProjectEnquiry = typeof projectEnquiriesTable.$inferInsert;
export type SelectProjectEnquiry = typeof projectEnquiriesTable.$inferSelect;
export type InsertClient = typeof clientsTable.$inferInsert;
export type SelectClient = typeof clientsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;
export type SelectProject = typeof projectsTable.$inferSelect;
export type InsertProjectTask = typeof projectTasksTable.$inferInsert;
export type SelectProjectTask = typeof projectTasksTable.$inferSelect;
export type InsertProjectMilestone = typeof projectMilestonesTable.$inferInsert;
export type SelectProjectMilestone = typeof projectMilestonesTable.$inferSelect;
export type InsertActivityLog = typeof activityLogsTable.$inferInsert;
export type SelectActivityLog = typeof activityLogsTable.$inferSelect;
export type InsertNotification = typeof notificationsTable.$inferInsert;
export type SelectNotification = typeof notificationsTable.$inferSelect;
export type InsertInquiryNote = typeof inquiryNotesTable.$inferInsert;
export type SelectInquiryNote = typeof inquiryNotesTable.$inferSelect;

// ─── Site Settings ────────────────────────────────────────────────────────────
export const siteSettingsTable = pgTable('site_settings', {
  id: text('id').primaryKey().default('global'),
  site_name: text('site_name').notNull().default('RactroTech'),
  site_description: text('site_description'),
  maintenance_mode: boolean('maintenance_mode').notNull().default(false),
  contact_email: text('contact_email'),
  social_links: text('social_links'), // JSON string
  footer_text: text('footer_text'),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type InsertSiteSettings = typeof siteSettingsTable.$inferInsert;
export type SelectSiteSettings = typeof siteSettingsTable.$inferSelect;

// ─── Client reviews / testimonials ────────────────────────────────────────────
export const reviewsTable = pgTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  full_name: text('full_name').notNull(),
  company_name: text('company_name').notNull(),
  project_type: text('project_type').notNull(),
  rating: integer('rating').notNull(),
  review_text: text('review_text').notNull(),
  image_url: text('image_url'),
  permission_granted: boolean('permission_granted').notNull().default(false),
  approved: boolean('approved').notNull().default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type InsertReview = typeof reviewsTable.$inferInsert;
export type SelectReview = typeof reviewsTable.$inferSelect;

// ─── CMS Tables (Blog / Portfolio) ───────────────────────────────────────────
export const postsTable = pgTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  cover_image: text('cover_image'),
  author_id: text('author_id').references(() => usersTable.id),
  status: postStatusEnum('status').notNull().default('draft'),
  tags: text('tags'), // Comma-separated tags
  category: text('category'),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// ─── Media Library ────────────────────────────────────────────────────────────
export const mediaAssetsTable = pgTable('media_assets', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  url: text('url').notNull(),
  size: integer('size'), // in bytes
  type: text('type'), // mime type
  project_id: text('project_id').references(() => projectsTable.id),
  uploaded_by: text('uploaded_by').references(() => usersTable.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

// ─── More Type Exports ────────────────────────────────────────────────────────
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
export type InsertMediaAsset = typeof mediaAssetsTable.$inferInsert;
export type SelectMediaAsset = typeof mediaAssetsTable.$inferSelect;

// ─── Lead Finder (Admin → Lead finder) ─────────────────────────────────────────
// Google Maps lead scraping (Apify) and cold-email campaigns, moved from the standalone
// lead-finder app. Ids stay bigint so migrated rows keep their ids and the unsubscribe
// tokens already sent out stay valid. SQL: utils/db/migrations/0021_lead_finder.sql.
// Server-only: RLS is on with no policies, so only DATABASE_URL (table owner) reads these.

export const leadScrapeJobsTable = pgTable('lead_scrape_jobs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  country: text('country').notNull(), // ISO code, e.g. 'us'
  city: text('city'),
  category: text('category').notNull(), // label from lib/outreach/taxonomy.ts
  query: text('query').notNull(), // search term sent to Google Maps
  max_results: integer('max_results').notNull(),
  apify_run_id: text('apify_run_id'),
  dataset_id: text('dataset_id'),
  status: text('status').notNull().default('PENDING'), // Apify run status: READY | RUNNING | SUCCEEDED | FAILED | ABORTED | TIMED-OUT
  lead_count: integer('lead_count').notNull().default(0),
  error: text('error'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  finished_at: timestamp('finished_at', { withTimezone: true }),
});

export type LeadSocials = Partial<Record<'facebook' | 'instagram' | 'linkedin' | 'twitter', string>>;

export const leadsTable = pgTable('leads', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  place_id: text('place_id').unique(),
  name: text('name').notNull(), // as listed on Google Maps
  site_name: text('site_name'), // name taken from the business website, used in emails
  category_group: text('category_group'),
  category: text('category'),
  google_category: text('google_category'),
  country: text('country'),
  city: text('city'),
  address: text('address'),
  phone: text('phone'),
  website: text('website'),
  email: text('email'), // primary email (first found)
  emails: text('emails').array().notNull().default(sql`'{}'::text[]`),
  socials: jsonb('socials').$type<LeadSocials>().notNull().default({}),
  rating: numeric('rating'),
  reviews_count: integer('reviews_count'),
  maps_url: text('maps_url'),
  status: text('status').notNull().default('new'), // new | contacted | replied | bounced | unsubscribed
  notes: text('notes'),
  job_id: bigint('job_id', { mode: 'number' }).references(() => leadScrapeJobsTable.id, { onDelete: 'set null' }),
  client_id: text('client_id').references(() => clientsTable.id, { onDelete: 'set null' }), // set by "Convert to client"
  crawled_at: timestamp('crawled_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const outreachTemplatesTable = pgTable('outreach_templates', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Connected Gmail / Workspace senders. The refresh token is AES-GCM encrypted with ENCRYPTION_KEY. */
export const outreachMailAccountsTable = pgTable('outreach_mail_accounts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  email: text('email').notNull().unique(),
  from_name: text('from_name'),
  refresh_token_enc: text('refresh_token_enc').notNull(),
  daily_limit: integer('daily_limit').notNull().default(400), // Gmail ~500/day, Workspace ~2000/day
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const outreachCampaignsTable = pgTable('outreach_campaigns', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  template_id: bigint('template_id', { mode: 'number' })
    .notNull()
    .references(() => outreachTemplatesTable.id),
  account_id: bigint('account_id', { mode: 'number' }).references(() => outreachMailAccountsTable.id, {
    onDelete: 'set null',
  }), // null = SMTP from env
  status: text('status').notNull().default('draft'), // draft | active | paused | done
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const outreachRecipientsTable = pgTable(
  'outreach_recipients',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    campaign_id: bigint('campaign_id', { mode: 'number' })
      .notNull()
      .references(() => outreachCampaignsTable.id, { onDelete: 'cascade' }),
    lead_id: bigint('lead_id', { mode: 'number' })
      .notNull()
      .references(() => leadsTable.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    token: uuid('token').notNull().defaultRandom(), // unsubscribe token
    status: text('status').notNull().default('pending'), // pending | sending | sent | failed | skipped
    error: text('error'),
    sent_at: timestamp('sent_at', { withTimezone: true }),
    account_id: bigint('account_id', { mode: 'number' }).references(() => outreachMailAccountsTable.id, {
      onDelete: 'set null',
    }),
    message_id: text('message_id'),
    thread_id: text('thread_id'),
    replied_at: timestamp('replied_at', { withTimezone: true }),
    reply_notified_at: timestamp('reply_notified_at', { withTimezone: true }),
  },
  (t) => ({ campaignLead: unique().on(t.campaign_id, t.lead_id) })
);

/** Never email these again (unsubscribed or bounced). Stored lower-case. */
export const outreachSuppressionsTable = pgTable('outreach_suppressions', {
  email: text('email').primaryKey(),
  reason: text('reason'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Team addresses emailed when a lead replies. */
export const outreachNotifyEmailsTable = pgTable('outreach_notify_emails', {
  email: text('email').primaryKey(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type SelectLead = typeof leadsTable.$inferSelect;
export type SelectLeadScrapeJob = typeof leadScrapeJobsTable.$inferSelect;
export type SelectOutreachTemplate = typeof outreachTemplatesTable.$inferSelect;
export type SelectOutreachMailAccount = typeof outreachMailAccountsTable.$inferSelect;
export type SelectOutreachCampaign = typeof outreachCampaignsTable.$inferSelect;
export type SelectOutreachRecipient = typeof outreachRecipientsTable.$inferSelect;
