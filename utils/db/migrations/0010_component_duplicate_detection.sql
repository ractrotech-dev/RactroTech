-- Duplicate detection and cleanup metadata for component library

ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "duplicate_score" integer DEFAULT 0;
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "is_duplicate" boolean DEFAULT false;
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "keep_component" boolean DEFAULT true;
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "replacement_needed" boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS "components_is_duplicate_idx" ON "components" ("is_duplicate");
CREATE INDEX IF NOT EXISTS "components_keep_component_idx" ON "components" ("keep_component");
CREATE INDEX IF NOT EXISTS "components_replacement_needed_idx" ON "components" ("replacement_needed");
CREATE INDEX IF NOT EXISTS "components_duplicate_score_idx" ON "components" ("duplicate_score");
