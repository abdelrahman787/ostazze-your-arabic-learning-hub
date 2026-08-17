ALTER TABLE public.tutor_applications ADD COLUMN IF NOT EXISTS cv_file_path text;

DROP POLICY IF EXISTS "Anyone can upload a tutor CV" ON storage.objects;
CREATE POLICY "Anyone can upload a tutor CV"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'tutor-cvs');

DROP POLICY IF EXISTS "Admins can read tutor CVs" ON storage.objects;
CREATE POLICY "Admins can read tutor CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'tutor-cvs' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete tutor CVs" ON storage.objects;
CREATE POLICY "Admins can delete tutor CVs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tutor-cvs' AND public.has_role(auth.uid(), 'admin'));