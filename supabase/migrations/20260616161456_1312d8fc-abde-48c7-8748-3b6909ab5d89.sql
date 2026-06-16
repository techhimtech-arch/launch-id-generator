DROP POLICY IF EXISTS "Anyone can submit a contact query" ON public.contact_submissions;

CREATE POLICY "Anyone can submit a valid contact query"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(name) BETWEEN 1 AND 100
  AND length(email) BETWEEN 3 AND 200
  AND email LIKE '%_@_%.__%'
  AND length(message) BETWEEN 5 AND 4000
  AND (phone IS NULL OR length(phone) BETWEEN 5 AND 20)
  AND status = 'new'
);