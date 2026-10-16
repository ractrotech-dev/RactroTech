-- Learn DSA (/dsa): course settings, progress, the streak calendar, and practice-board
-- submissions. Run in the Supabase SQL Editor. Safe to run more than once.
--
-- Ported from the standalone "DSA from Day 1" app, which had its own Supabase project.
-- Two deliberate differences from that schema:
--
--   1. Every object is prefixed `dsa_`. This database already has a `profiles` table and a
--      `handle_new_user()` function with different meanings, and the course must not touch
--      either.
--   2. There is no trigger on auth.users. Course settings are created lazily by the app the
--      first time a signed-in person opens /dsa/profile or answers the welcome questions,
--      so signing up for Ractrotech never depends on this migration having been applied.
--
-- Lesson content stays in the repo (lib/dsa): the diagrams are produced by running real
-- algorithms, which is code, not rows. What lives here is the learner and their work.
-- Every table is private to its owner through row level security.

-- ------------------------------------------------------------ dsa_profiles --
-- One row per learner: the five welcome answers and the language the course is shown in.

CREATE TABLE IF NOT EXISTS public.dsa_profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  lang         text NOT NULL DEFAULT 'cpp',
  education    text,
  motivation   text,
  skill_level  text,
  goal_per_day int  NOT NULL DEFAULT 1,
  -- Null until the welcome questions are answered; /dsa/profile sends people there once.
  onboarded_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Only ever one of the six the course offers (lib/dsa/lang.ts), so a typo cannot leave
-- somebody stuck on a language that does not exist.
ALTER TABLE public.dsa_profiles DROP CONSTRAINT IF EXISTS dsa_profiles_lang_check;
ALTER TABLE public.dsa_profiles ADD CONSTRAINT dsa_profiles_lang_check
  CHECK (lang IN ('cpp', 'c', 'python', 'java', 'javascript', 'rust'));

-- ------------------------------------------------------------ dsa_progress --
-- One row per (user, topic, section). Present means "this lesson's board was passed".

CREATE TABLE IF NOT EXISTS public.dsa_progress (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  topic_id   text NOT NULL,
  section_id text NOT NULL,
  solved_at  timestamptz NOT NULL DEFAULT now(),
  attempts   int NOT NULL DEFAULT 1,
  UNIQUE (user_id, topic_id, section_id)
);

CREATE INDEX IF NOT EXISTS dsa_progress_user_topic_idx ON public.dsa_progress (user_id, topic_id);

-- ------------------------------------------------------------ dsa_activity --
-- One row per user per calendar day, pre-aggregated so the calendar is one cheap query.

CREATE TABLE IF NOT EXISTS public.dsa_activity (
  id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  day     date NOT NULL,
  solved  int  NOT NULL DEFAULT 0,   -- practice boards passed that day
  visits  int  NOT NULL DEFAULT 0,   -- lessons opened that day
  UNIQUE (user_id, day)
);

-- --------------------------------------------------------- dsa_submissions --
-- What the learner typed into a practice board.

CREATE TABLE IF NOT EXISTS public.dsa_submissions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  topic_id   text NOT NULL,
  section_id text NOT NULL,
  code       text NOT NULL,
  passed     boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dsa_submissions_user_idx ON public.dsa_submissions (user_id, created_at DESC);

-- --------------------------------------------------------------- dsa_notes --
-- Free-text notes a learner keeps against a chapter.

CREATE TABLE IF NOT EXISTS public.dsa_notes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  topic_id   text NOT NULL,
  body       text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, topic_id)
);

-- --------------------------------------------------------------------- rls --
-- Nobody reads anybody else's rows. There are no public profile pages.

ALTER TABLE public.dsa_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_progress    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_activity    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_notes       ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dsa_profiles_select_own" ON public.dsa_profiles;
CREATE POLICY "dsa_profiles_select_own"
  ON public.dsa_profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "dsa_profiles_insert_own" ON public.dsa_profiles;
CREATE POLICY "dsa_profiles_insert_own"
  ON public.dsa_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "dsa_profiles_update_own" ON public.dsa_profiles;
CREATE POLICY "dsa_profiles_update_own"
  ON public.dsa_profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['dsa_progress', 'dsa_activity', 'dsa_submissions', 'dsa_notes'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_select_own', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id)',
      t || '_select_own', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_insert_own', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id)',
      t || '_insert_own', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_update_own', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id)',
      t || '_update_own', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_delete_own', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id)',
      t || '_delete_own', t);
  END LOOP;
END $$;

-- ---------------------------------------------------------------- recorders --
-- Passing a board touches three tables; one function keeps it atomic and one round trip.
-- SECURITY INVOKER, so row level security still applies to every write.

CREATE OR REPLACE FUNCTION public.dsa_record_solve(
  p_topic_id   text,
  p_section_id text,
  p_code       text,
  p_passed     boolean,
  p_day        date
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  uid uuid := (SELECT auth.uid());
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not signed in';
  END IF;

  INSERT INTO public.dsa_submissions (user_id, topic_id, section_id, code, passed)
  VALUES (uid, p_topic_id, p_section_id, p_code, p_passed);

  IF p_passed THEN
    INSERT INTO public.dsa_progress (user_id, topic_id, section_id)
    VALUES (uid, p_topic_id, p_section_id)
    ON CONFLICT (user_id, topic_id, section_id)
      DO UPDATE SET attempts = public.dsa_progress.attempts + 1;

    INSERT INTO public.dsa_activity (user_id, day, solved, visits)
    VALUES (uid, p_day, 1, 0)
    ON CONFLICT (user_id, day)
      DO UPDATE SET solved = public.dsa_activity.solved + 1;
  END IF;
END;
$$;

-- Opening a lesson counts too, so the calendar reflects reading as well as solving —
-- but only solving fills a square strongly.
CREATE OR REPLACE FUNCTION public.dsa_record_visit(p_day date)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  uid uuid := (SELECT auth.uid());
BEGIN
  IF uid IS NULL THEN RETURN; END IF;

  INSERT INTO public.dsa_activity (user_id, day, solved, visits)
  VALUES (uid, p_day, 0, 1)
  ON CONFLICT (user_id, day)
    DO UPDATE SET visits = public.dsa_activity.visits + 1;
END;
$$;

-- Signed-in learners only; same exposure rules as 0012_security_linter_fixes.sql.
REVOKE EXECUTE ON FUNCTION public.dsa_record_solve(text, text, text, boolean, date) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.dsa_record_visit(date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.dsa_record_solve(text, text, text, boolean, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.dsa_record_visit(date) TO authenticated;
