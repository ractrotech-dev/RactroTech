-- Run in Supabase → SQL Editor (one shot).
-- Fixes Database Linter warnings: function_search_path_mutable,
-- anon/authenticated_security_definer_function_executable, rls_policy_always_true.
--
-- Auth dashboard (not SQL): Authentication → Settings → enable
-- "Leaked password protection" (HaveIBeenPwned).

-- ─── 1. search_path ───────────────────────────────────────────────────────────
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.rls_auto_enable() SET search_path = public;

-- ─── 2. Revoke RPC execute (triggers still work; only blocks /rest/v1/rpc/*) ─
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;

-- ─── 3. Category INSERT policy ───────────────────────────────────────────────
DROP POLICY IF EXISTS "category_insert_authenticated" ON public.category;
CREATE POLICY "category_insert_authenticated"
  ON public.category FOR INSERT
  TO authenticated
  WITH CHECK (
    name IS NOT NULL
    AND char_length(trim(name)) >= 1
    AND char_length(trim(name)) <= 120
  );
