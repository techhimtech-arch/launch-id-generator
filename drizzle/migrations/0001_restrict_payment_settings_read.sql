DROP POLICY IF EXISTS "Anyone can read payment settings" ON public.payment_settings;
REVOKE SELECT ON public.payment_settings FROM anon;
CREATE POLICY "Signed-in users can read payment settings" ON public.payment_settings FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);