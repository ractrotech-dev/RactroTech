CREATE TABLE IF NOT EXISTS "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"company_name" text NOT NULL,
	"project_type" text NOT NULL,
	"rating" integer NOT NULL,
	"review_text" text NOT NULL,
	"image_url" text,
	"permission_granted" boolean DEFAULT false NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_rating_check" CHECK ("rating" >= 1 AND "rating" <= 5)
);
