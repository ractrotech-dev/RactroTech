-- Run in Supabase SQL Editor after 0010_client_onboard_plans.sql

ALTER TABLE public.client_onboard_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "onboard_plans_select_own" ON public.client_onboard_plans;
CREATE POLICY "onboard_plans_select_own"
  ON public.client_onboard_plans FOR SELECT
  USING ((auth.uid())::text = (user_id)::text);

DROP POLICY IF EXISTS "onboard_plans_insert_own" ON public.client_onboard_plans;
CREATE POLICY "onboard_plans_insert_own"
  ON public.client_onboard_plans FOR INSERT
  WITH CHECK ((auth.uid())::text = (user_id)::text);

DROP POLICY IF EXISTS "onboard_plans_update_own" ON public.client_onboard_plans;
CREATE POLICY "onboard_plans_update_own"
  ON public.client_onboard_plans FOR UPDATE
  USING ((auth.uid())::text = (user_id)::text);

DROP POLICY IF EXISTS "onboard_plans_delete_own" ON public.client_onboard_plans;
CREATE POLICY "onboard_plans_delete_own"
  ON public.client_onboard_plans FOR DELETE
  USING ((auth.uid())::text = (user_id)::text);
