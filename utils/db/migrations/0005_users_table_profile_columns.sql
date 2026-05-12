-- Repair drift: some databases never received optional profile columns from 0002 (partial migrate / Supabase-only tables).
ALTER TABLE "users_table" ADD COLUMN IF NOT EXISTS "avatar_url" text;
ALTER TABLE "users_table" ADD COLUMN IF NOT EXISTS "phone" text;
ALTER TABLE "users_table" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now();
ALTER TABLE "users_table" ADD COLUMN IF NOT EXISTS "last_login" timestamp;
