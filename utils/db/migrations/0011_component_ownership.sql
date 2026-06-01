-- Track component ownership for IDOR-safe updates/deletes
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "created_by" text;

CREATE INDEX IF NOT EXISTS "components_created_by_idx" ON "components" ("created_by");
