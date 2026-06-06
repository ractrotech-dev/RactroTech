CREATE TABLE IF NOT EXISTS public.client_onboard_plans (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_onboard_plans_user_id_idx
  ON public.client_onboard_plans (user_id);
