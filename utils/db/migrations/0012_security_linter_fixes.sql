-- Supabase Database Linter: search_path, SECURITY DEFINER RPC exposure, permissive RLS
-- Apply via `npm run db:migrate` or Supabase SQL Editor (see manual_supabase_security_linter_fixes.sql)

-- ─── 1. Immutable search_path on trigger / utility functions ─────────────────
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.rls_auto_enable() SET search_path = public;

-- ─── 2. Trigger-only functions must not be callable via PostgREST /rpc ───────
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;

-- ─── 3. Category INSERT: require validated name (not WITH CHECK (true)) ──────
DROP POLICY IF EXISTS "category_insert_authenticated" ON public.category;
CREATE POLICY "category_insert_authenticated"
  ON public.category FOR INSERT
  TO authenticated
  WITH CHECK (
    name IS NOT NULL
    AND char_length(trim(name)) >= 1
    AND char_length(trim(name)) <= 120
  );
