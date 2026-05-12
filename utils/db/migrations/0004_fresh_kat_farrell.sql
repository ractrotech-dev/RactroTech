CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" text PRIMARY KEY DEFAULT 'global' NOT NULL,
	"site_name" text DEFAULT 'RactroTech' NOT NULL,
	"site_description" text,
	"maintenance_mode" boolean DEFAULT false NOT NULL,
	"contact_email" text,
	"social_links" text,
	"footer_text" text,
	"updated_at" timestamp DEFAULT now()
);
