-- Supabase Database Linter: search_path, SECURITY DEFINER RPC exposure, permissive RLS
-- Apply via `npm run db:migrate` or Supabase SQL Editor (see manual_supabase_security_linter_fixes.sql)
-- Function fixes are conditional: only runs when the function exists in this database.

-- ─── 1. Immutable search_path on trigger / utility functions ─────────────────
DO $$
BEGIN
  IF to_regprocedure('public.handle_updated_at()') IS NOT NULL THEN
    ALTER FUNCTION public.handle_updated_at() SET search_path = public;
  END IF;

  IF to_regprocedure('public.handle_new_user()') IS NOT NULL THEN
    ALTER FUNCTION public.handle_new_user() SET search_path = public;
  END IF;

  IF to_regprocedure('public.rls_auto_enable()') IS NOT NULL THEN
    ALTER FUNCTION public.rls_auto_enable() SET search_path = public;
  END IF;
END $$;

-- ─── 2. Trigger-only functions must not be callable via PostgREST /rpc ───────
DO $$
BEGIN
  IF to_regprocedure('public.handle_new_user()') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
    REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
    REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
  END IF;

  IF to_regprocedure('public.rls_auto_enable()') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
  END IF;
END $$;

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
