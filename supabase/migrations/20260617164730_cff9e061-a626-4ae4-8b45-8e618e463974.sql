
CREATE TABLE public.payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_email text,
  amount integer NOT NULL DEFAULT 899,
  currency text NOT NULL DEFAULT 'INR',
  upi_ref text NOT NULL,
  payer_name text,
  payer_phone text,
  note text,
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.payment_requests TO authenticated;
GRANT ALL ON public.payment_requests TO service_role;

ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own payment requests"
  ON public.payment_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND length(upi_ref) BETWEEN 6 AND 50 AND status = 'pending');

CREATE POLICY "Users view own payment requests"
  ON public.payment_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all payment requests"
  ON public.payment_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER tg_payment_requests_updated
  BEFORE UPDATE ON public.payment_requests
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Allow admins to INSERT subscriptions manually after approving UPI payments
CREATE POLICY "Admins insert subscriptions"
  ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
