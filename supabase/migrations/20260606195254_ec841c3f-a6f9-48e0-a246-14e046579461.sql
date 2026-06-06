
-- 1) teacher_profiles: restrict anon to verified teachers only
DROP POLICY IF EXISTS "tp_select_public_safe" ON public.teacher_profiles;
CREATE POLICY "tp_select_public_verified" ON public.teacher_profiles
  FOR SELECT TO anon
  USING (verified = true);

-- 2) course_live_sessions: enrolled students can view sessions
CREATE POLICY "live_sessions_enrolled_select" ON public.course_live_sessions
  FOR SELECT TO authenticated
  USING (public.is_enrolled_in_course(auth.uid(), course_id));

-- 3) chat-audio storage: tighten INSERT policy to require lecture-scoped folder
DROP POLICY IF EXISTS "chat_audio_participants_insert" ON storage.objects;
CREATE POLICY "chat_audio_participants_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'chat-audio'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM public.lectures l
      WHERE l.id::text = (storage.foldername(name))[2]
        AND (l.student_id = auth.uid() OR l.teacher_id = auth.uid())
    )
  );

-- 4) Revoke EXECUTE on internal SECURITY DEFINER helpers from anon/authenticated.
--    Keep callable RPCs accessible: get_public_profile, get_public_profiles,
--    get_course_live_sessions_public, get_course_live_sessions_enrolled.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_enrolled_in_course(uuid, uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_course_cover_path(text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.user_can_access_chat_audio(text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.user_can_access_lecture_file(text, text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.user_can_access_realtime_topic(text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_new_lecture() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_new_message() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_new_booking() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_admins_session_request() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_admins_new_payment() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
