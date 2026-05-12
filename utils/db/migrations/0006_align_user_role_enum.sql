-- Repair drift: `0002_moaning_sauron.sql` skips `CREATE TYPE user_role` if the type already existed
-- (e.g. from an older `drizzle-kit push`) with fewer labels. The app then fails with:
--   invalid input value for enum user_role: "super_admin"
-- These statements only add missing labels (PostgreSQL 9.1+; IF NOT EXISTS on ADD VALUE: PG 15+).

ALTER TYPE "public"."user_role" ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE "public"."user_role" ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE "public"."user_role" ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE "public"."user_role" ADD VALUE IF NOT EXISTS 'developer';
ALTER TYPE "public"."user_role" ADD VALUE IF NOT EXISTS 'client';
ALTER TYPE "public"."user_role" ADD VALUE IF NOT EXISTS 'user';
