-- Component library: category + components tables with metadata for browse/filter/dedup

CREATE TABLE IF NOT EXISTS "category" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL UNIQUE,
  "slug" text UNIQUE,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "components" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "description" text NOT NULL,
  "code" text NOT NULL,
  "category_id" uuid REFERENCES "category"("id") ON DELETE SET NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "slug" text;
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "tags" text[];
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "style_variant" text;
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "industry_variant" text;
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "difficulty" text DEFAULT 'beginner';
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "supports_dark_mode" boolean DEFAULT true;
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "responsive" boolean DEFAULT true;
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "preview_metadata" jsonb;
ALTER TABLE "components" ADD COLUMN IF NOT EXISTS "content_hash" text;

-- Full (non-partial) unique indexes — required for Supabase PostgREST upsert onConflict
DROP INDEX IF EXISTS "components_slug_unique";
CREATE UNIQUE INDEX IF NOT EXISTS "components_slug_unique" ON "components" ("slug");

DROP INDEX IF EXISTS "components_content_hash_unique";
CREATE UNIQUE INDEX IF NOT EXISTS "components_content_hash_unique" ON "components" ("content_hash");

CREATE INDEX IF NOT EXISTS "components_category_id_idx" ON "components" ("category_id");
CREATE INDEX IF NOT EXISTS "components_style_variant_idx" ON "components" ("style_variant");
CREATE INDEX IF NOT EXISTS "components_industry_variant_idx" ON "components" ("industry_variant");

ALTER TABLE "category" ADD COLUMN IF NOT EXISTS "slug" text;
DROP INDEX IF EXISTS "category_slug_unique";
CREATE UNIQUE INDEX IF NOT EXISTS "category_slug_unique" ON "category" ("slug");
