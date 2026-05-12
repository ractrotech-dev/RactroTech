-- Idempotent: DB may already have `role` (e.g. drizzle push / manual) while this migration was never recorded.
ALTER TABLE "users_table" ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'user' NOT NULL;