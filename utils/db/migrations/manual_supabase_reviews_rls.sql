-- Apply this in the Supabase SQL editor (or any Postgres that has `anon` / `authenticated` roles).
-- Standard local Postgres often does not include those roles — keep this separate from Drizzle migrate.
-- After `npm run db:migrate`, run this once on Supabase for defense-in-depth when using the Data API.

ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_approved_only" ON "reviews";
CREATE POLICY "reviews_select_approved_only" ON "reviews"
	FOR SELECT TO anon, authenticated
	USING ("approved" = true);

-- Inserts/updates/deletes from the app use DATABASE_URL (table owner) and bypass RLS.
-- Optional: create Storage bucket `review-uploads` (public read) for /review image uploads + set SUPABASE_SERVICE_ROLE_KEY.
