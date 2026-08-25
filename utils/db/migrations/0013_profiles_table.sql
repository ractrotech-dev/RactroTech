-- User profiles synced from Supabase Auth (email + OAuth)
CREATE TABLE IF NOT EXISTS "profiles" (
  "id" text PRIMARY KEY,
  "email" text NOT NULL,
  "full_name" text,
  "username" text,
  "avatar_url" text,
  "provider" text NOT NULL DEFAULT 'email',
  "bio" text,
  "website" text,
  "github" text,
  "twitter" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "profiles_email_unique" ON "profiles" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_username_unique" ON "profiles" ("username") WHERE "username" IS NOT NULL;
