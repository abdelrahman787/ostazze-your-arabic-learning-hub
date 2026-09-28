-- Delete/replace need row visibility. Admins see all covers; tutors see only their own avatar folder. No public listing.
CREATE POLICY course_covers_admin_select ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'course-covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY teacher_avatar_own_select ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'course-covers' AND (storage.foldername(name))[1] = 'teacher-avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text);