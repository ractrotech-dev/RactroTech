-- Run this entire script in Supabase → SQL Editor (one shot).
-- Step 1: ownership column (same as 0011_component_ownership.sql / npm run db:migrate)
-- Step 2: RLS policies for components + category

-- ─── Step 1: add created_by (required before policies below) ─────────────────
ALTER TABLE components ADD COLUMN IF NOT EXISTS created_by text;

CREATE INDEX IF NOT EXISTS components_created_by_idx ON components (created_by);

-- ─── Step 2: RLS (defense-in-depth for anon key + user JWT) ───────────────────
ALTER TABLE components ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "components_public_read" ON components;
CREATE POLICY "components_public_read"
  ON components FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "components_insert_own" ON components;
CREATE POLICY "components_insert_own"
  ON components FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid()::text);

DROP POLICY IF EXISTS "components_update_own" ON components;
CREATE POLICY "components_update_own"
  ON components FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid()::text)
  WITH CHECK (created_by = auth.uid()::text);

DROP POLICY IF EXISTS "components_delete_own" ON components;
CREATE POLICY "components_delete_own"
  ON components FOR DELETE
  TO authenticated
  USING (created_by = auth.uid()::text);

-- Category: read for all; writes only for authenticated users
ALTER TABLE category ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "category_public_read" ON category;
CREATE POLICY "category_public_read"
  ON category FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "category_insert_authenticated" ON category;
CREATE POLICY "category_insert_authenticated"
  ON category FOR INSERT
  TO authenticated
  WITH CHECK (
    name IS NOT NULL
    AND char_length(trim(name)) >= 1
    AND char_length(trim(name)) <= 120
  );
