import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['admin', 'user']);

export const usersTable = pgTable('users_table', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    plan: text('plan').notNull(),
    stripe_id: text('stripe_id').notNull(),
    role: userRoleEnum('role').notNull().default('user'),
});

export const projectEnquiriesTable = pgTable('project_enquiries', {
    id: text('id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    projectType: text('project_type').notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertProjectEnquiry = typeof projectEnquiriesTable.$inferInsert;
export type SelectProjectEnquiry = typeof projectEnquiriesTable.$inferSelect;
