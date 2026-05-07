import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

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
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    project_type: text('project_type').notNull(),
    description: text('description').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertProjectEnquiry = typeof projectEnquiriesTable.$inferInsert;
export type SelectProjectEnquiry = typeof projectEnquiriesTable.$inferSelect;
