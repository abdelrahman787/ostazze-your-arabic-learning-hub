-- CV writes go only through the tutor-upload-url function (content-validated, service role).
DROP POLICY IF EXISTS tutor_cvs_own_insert ON storage.objects;
DROP POLICY IF EXISTS tutor_cvs_own_update ON storage.objects;
DROP POLICY IF EXISTS tutor_cvs_admin_insert ON storage.objects;
DROP POLICY IF EXISTS tutor_cvs_admin_update ON storage.objects;

-- Legacy demo videos: private, admin read/delete only, no writes from clients.
CREATE POLICY tutor_legacy_demos_admin_select ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'tutor-legacy-demos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY tutor_legacy_demos_admin_delete ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'tutor-legacy-demos' AND public.has_role(auth.uid(), 'admin'));