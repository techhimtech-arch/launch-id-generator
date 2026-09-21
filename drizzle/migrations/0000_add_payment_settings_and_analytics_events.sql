CREATE TABLE public.payment_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  upi_id text NOT NULL DEFAULT 'ramanthakur13135@okicici' CHECK (length(trim(upi_id)) BETWEEN 5 AND 100),
  payee_name text NOT NULL DEFAULT 'Raman Thakur' CHECK (length(trim(payee_name)) BETWEEN 2 AND 100),
  amount integer NOT NULL DEFAULT 899 CHECK (amount BETWEEN 1 AND 1000000),
  currency text NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  payment_note text NOT NULL DEFAULT 'ID Card Studio Pro' CHECK (length(trim(payment_note)) BETWEEN 2 AND 140),
  payments_enabled boolean NOT NULL DEFAULT true,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payment_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.payment_settings TO authenticated;
GRANT ALL ON public.payment_settings TO service_role;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read payment settings"
ON public.payment_settings FOR SELECT
TO anon, authenticated
USING (true);
CREATE POLICY "Admins can insert payment settings"
ON public.payment_settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update payment settings"
ON public.payment_settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER payment_settings_updated_at
BEFORE UPDATE ON public.payment_settings
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL CHECK (event_name IN ('try_free_click','app_started','google_sign_in','free_export','lead_opened','lead_submitted','payment_opened','payment_submitted')),
  session_id text NOT NULL CHECK (length(session_id) BETWEEN 8 AND 100),
  user_id uuid,
  source text CHECK (source IS NULL OR length(source) <= 100),
  path text CHECK (path IS NULL OR length(path) <= 300),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record allowed analytics events"
ON public.analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Admins can view analytics events"
ON public.analytics_events FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX analytics_events_created_at_idx ON public.analytics_events (created_at DESC);
CREATE INDEX analytics_events_name_created_idx ON public.analytics_events (event_name, created_at DESC);