import { integer, pgEnum, pgTable, text, timestamp, boolean, real } from 'drizzle-orm/pg-core';

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
