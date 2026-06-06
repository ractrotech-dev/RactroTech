-- Run in Supabase SQL Editor if profile sync fails with permission errors.
-- Lets signed-in users read/insert/update their own row in users_table (no DATABASE_URL needed in the app).

ALTER TABLE public.users_table ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_table_select_own" ON public.users_table;
CREATE POLICY "users_table_select_own"
  ON public.users_table FOR SELECT
  USING ((auth.uid())::text = (id)::text);

DROP POLICY IF EXISTS "users_table_insert_own" ON public.users_table;
CREATE POLICY "users_table_insert_own"
  ON public.users_table FOR INSERT
  WITH CHECK ((auth.uid())::text = (id)::text);

DROP POLICY IF EXISTS "users_table_update_own" ON public.users_table;
CREATE POLICY "users_table_update_own"
  ON public.users_table FOR UPDATE
  USING ((auth.uid())::text = (id)::text);
