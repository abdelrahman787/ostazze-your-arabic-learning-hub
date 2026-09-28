-- tutor-cvs: PDF only, own folder with server-style random names, admins full access
DROP POLICY IF EXISTS tutor_cvs_own_insert ON storage.objects;
DROP POLICY IF EXISTS tutor_cvs_own_update ON storage.objects;
DROP POLICY IF EXISTS tutor_cvs_own_select ON storage.objects;
DROP POLICY IF EXISTS tutor_cvs_own_delete ON storage.objects;

CREATE POLICY tutor_cvs_own_select ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'tutor-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY tutor_cvs_own_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'tutor-cvs'
  AND name ~ ('^' || auth.uid()::text || '/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$')
  AND coalesce(metadata->>'mimetype', 'application/pdf') = 'application/pdf');
CREATE POLICY tutor_cvs_own_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'tutor-cvs' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'tutor-cvs'
    AND name ~ ('^' || auth.uid()::text || '/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$')
    AND coalesce(metadata->>'mimetype', 'application/pdf') = 'application/pdf');
CREATE POLICY tutor_cvs_own_delete ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'tutor-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY tutor_cvs_admin_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'tutor-cvs' AND public.has_role(auth.uid(), 'admin') AND lower(name) ~ '\.pdf$');
CREATE POLICY tutor_cvs_admin_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'tutor-cvs' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'tutor-cvs' AND public.has_role(auth.uid(), 'admin') AND lower(name) ~ '\.pdf$');

-- tutor-photos: private, admin-only (applicants upload via server-issued one-time URLs)
CREATE POLICY tutor_photos_admin_select ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'tutor-photos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY tutor_photos_admin_delete ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'tutor-photos' AND public.has_role(auth.uid(), 'admin'));