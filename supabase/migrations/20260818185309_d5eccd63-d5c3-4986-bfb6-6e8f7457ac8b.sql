-- 1. Bank accounts: explicit admin delete path
CREATE POLICY "Admins delete bank accounts"
ON public.teacher_bank_accounts
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

GRANT DELETE ON public.teacher_bank_accounts TO authenticated;

-- 2. Teacher reviews: no anonymous access to review content / student linkage
DROP POLICY IF EXISTS "teacher_reviews_read_all" ON public.teacher_reviews;

CREATE POLICY "teacher_reviews_read_authenticated"
ON public.teacher_reviews
FOR SELECT
TO authenticated
USING (true);

REVOKE SELECT ON public.teacher_reviews FROM anon;

-- 3. Tutor applications: validate anonymous submissions
CREATE OR REPLACE FUNCTION public.validate_tutor_application()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF length(coalesce(NEW.full_name, '')) < 2 OR length(NEW.full_name) > 120 THEN
    RAISE EXCEPTION 'Invalid full name';
  END IF;
  IF NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(NEW.email) > 254 THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;
  IF length(coalesce(NEW.phone, '')) < 6 OR length(NEW.phone) > 32 THEN
    RAISE EXCEPTION 'Invalid phone';
  END IF;
  IF length(coalesce(NEW.experience, '')) > 5000
     OR length(coalesce(NEW.courses, '')) > 5000
     OR length(coalesce(NEW.admin_notes, '')) > 0 THEN
    RAISE EXCEPTION 'Invalid application content';
  END IF;
  IF NEW.cv_link IS NOT NULL AND NEW.cv_link !~ '^https://' THEN
    RAISE EXCEPTION 'Invalid CV link';
  END IF;
  IF NEW.demo_link IS NOT NULL AND NEW.demo_link <> '' AND NEW.demo_link !~ '^https://' THEN
    RAISE EXCEPTION 'Invalid demo link';
  END IF;
  -- Applicants may never set their own review state
  NEW.status := 'new';
  NEW.admin_notes := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_tutor_application_trg ON public.tutor_applications;
CREATE TRIGGER validate_tutor_application_trg
BEFORE INSERT ON public.tutor_applications
FOR EACH ROW EXECUTE FUNCTION public.validate_tutor_application();

DROP POLICY IF EXISTS "Anyone can submit a tutor application" ON public.tutor_applications;
CREATE POLICY "Anyone can submit a tutor application"
ON public.tutor_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND admin_notes IS NULL
  AND length(full_name) BETWEEN 2 AND 120
  AND length(email) <= 254
  AND length(phone) BETWEEN 6 AND 32
);