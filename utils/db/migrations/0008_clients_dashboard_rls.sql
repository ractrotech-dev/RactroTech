-- Run in Supabase SQL Editor if client onboard insert/select fails with permission errors.

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clients_select_own" ON public.clients;
CREATE POLICY "clients_select_own"
  ON public.clients FOR SELECT
  USING ((auth.uid())::text = (user_id)::text);

DROP POLICY IF EXISTS "clients_insert_own" ON public.clients;
CREATE POLICY "clients_insert_own"
  ON public.clients FOR INSERT
  WITH CHECK ((auth.uid())::text = (user_id)::text);

DROP POLICY IF EXISTS "clients_update_own" ON public.clients;
CREATE POLICY "clients_update_own"
  ON public.clients FOR UPDATE
  USING ((auth.uid())::text = (user_id)::text);

DROP POLICY IF EXISTS "clients_delete_own" ON public.clients;
CREATE POLICY "clients_delete_own"
  ON public.clients FOR DELETE
  USING ((auth.uid())::text = (user_id)::text);
