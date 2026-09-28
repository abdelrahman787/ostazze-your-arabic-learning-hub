-- 1. teacher_availability: no blanket read; public data only via RPC
DROP POLICY IF EXISTS ta_select ON public.teacher_availability;
CREATE POLICY ta_select_own ON public.teacher_availability FOR SELECT TO authenticated USING (auth.uid() = teacher_id);
CREATE POLICY ta_admin_all ON public.teacher_availability FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
ALTER POLICY ta_update ON public.teacher_availability WITH CHECK (auth.uid() = teacher_id);

CREATE OR REPLACE FUNCTION public.get_public_teacher_availability(_teacher_id uuid)
RETURNS TABLE(day_of_week smallint, start_time time, end_time time)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT a.day_of_week, a.start_time, a.end_time
  FROM public.teacher_availability a
  JOIN public.teacher_profiles tp ON tp.user_id = a.teacher_id
  WHERE a.teacher_id = _teacher_id AND a.is_active = true AND tp.verified = true
  ORDER BY a.day_of_week, a.start_time;
$$;
REVOKE EXECUTE ON FUNCTION public.get_public_teacher_availability(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_teacher_availability(uuid) TO anon, authenticated, service_role;

-- 2. teacher_reviews: moderation + public view of approved reviews only
ALTER TABLE public.teacher_reviews ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';
ALTER TABLE public.teacher_reviews ADD CONSTRAINT teacher_reviews_status_chk CHECK (status IN ('pending','approved','rejected'));

CREATE OR REPLACE FUNCTION public.guard_teacher_review()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') OR auth.uid() IS NULL THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' THEN
    NEW.student_id := OLD.student_id;
    NEW.teacher_id := OLD.teacher_id;
  END IF;
  NEW.status := 'pending';
  IF NEW.rating < 1 OR NEW.rating > 5 OR length(coalesce(NEW.comment,'')) > 2000 THEN
    RAISE EXCEPTION 'Invalid review';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_guard_teacher_review BEFORE INSERT OR UPDATE ON public.teacher_reviews
  FOR EACH ROW EXECUTE FUNCTION public.guard_teacher_review();

DROP POLICY IF EXISTS teacher_reviews_read_authenticated ON public.teacher_reviews;
CREATE POLICY teacher_reviews_select_own ON public.teacher_reviews FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY teacher_reviews_admin_all ON public.teacher_reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.get_public_teacher_reviews(_teacher_id uuid)
RETURNS TABLE(rating integer, comment text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT r.rating, r.comment, r.created_at FROM public.teacher_reviews r
  WHERE r.teacher_id = _teacher_id AND r.status = 'approved'
  ORDER BY r.created_at DESC LIMIT 50;
$$;
REVOKE EXECUTE ON FUNCTION public.get_public_teacher_reviews(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_teacher_reviews(uuid) TO anon, authenticated, service_role;

-- 3. tutor-cvs: no anonymous uploads (applicants upload via signed URL from an edge function)
DROP POLICY IF EXISTS "Anyone can upload a tutor CV" ON storage.objects;
CREATE POLICY tutor_cvs_own_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'tutor-cvs' AND (storage.foldername(name))[1] = auth.uid()::text
  AND lower(name) ~ '\.(pdf|doc|docx|jpg|jpeg|png|webp|mp4|mov|m4v|webm)$');
CREATE POLICY tutor_cvs_own_select ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'tutor-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY tutor_cvs_own_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'tutor-cvs' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'tutor-cvs' AND (storage.foldername(name))[1] = auth.uid()::text
    AND lower(name) ~ '\.(pdf|doc|docx|jpg|jpeg|png|webp|mp4|mov|m4v|webm)$');
CREATE POLICY tutor_cvs_own_delete ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'tutor-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 4. course-covers: public bucket serves by URL; no listing; writes only admin or own avatar folder
DROP POLICY IF EXISTS teacher_avatars_public_read ON storage.objects;
DROP POLICY IF EXISTS course_covers_referenced_select ON storage.objects;
DROP POLICY IF EXISTS teacher_avatars_upload ON storage.objects;
DROP POLICY IF EXISTS teacher_avatars_update ON storage.objects;
DROP POLICY IF EXISTS "Admins upload course covers" ON storage.objects;
DROP POLICY IF EXISTS "Admins update course covers" ON storage.objects;

CREATE POLICY course_covers_admin_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'course-covers' AND public.has_role(auth.uid(), 'admin')
  AND lower(name) ~ '\.(jpg|jpeg|png|webp|gif)$');
CREATE POLICY course_covers_admin_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'course-covers' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'course-covers' AND public.has_role(auth.uid(), 'admin')
    AND lower(name) ~ '\.(jpg|jpeg|png|webp|gif)$');
CREATE POLICY teacher_avatar_own_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'course-covers' AND (storage.foldername(name))[1] = 'teacher-avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
  AND lower(name) ~ '\.(jpg|jpeg|png|webp)$');
CREATE POLICY teacher_avatar_own_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'course-covers' AND (storage.foldername(name))[1] = 'teacher-avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text)
  WITH CHECK (bucket_id = 'course-covers' AND (storage.foldername(name))[1] = 'teacher-avatars'
    AND (storage.foldername(name))[2] = auth.uid()::text AND lower(name) ~ '\.(jpg|jpeg|png|webp)$');
CREATE POLICY teacher_avatar_own_delete ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'course-covers' AND (storage.foldername(name))[1] = 'teacher-avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text);