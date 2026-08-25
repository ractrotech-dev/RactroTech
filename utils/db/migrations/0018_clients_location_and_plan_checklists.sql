ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS country text DEFAULT 'United Kingdom';

ALTER TABLE public.client_onboard_plans ADD COLUMN IF NOT EXISTS checklists jsonb NOT NULL DEFAULT '[]'::jsonb;
