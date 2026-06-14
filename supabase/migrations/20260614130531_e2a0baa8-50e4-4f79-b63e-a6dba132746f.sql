-- Grant Data API privileges on all public tables (RLS still enforces row-level access)
DO $$
DECLARE t record;
BEGIN
  FOR t IN SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
           WHERE n.nspname='public' AND c.relkind='r'
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t.relname);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t.relname);
  END LOOP;
END $$;

-- Public-readable tables also need anon SELECT (policies already gate them)
GRANT SELECT ON public.courses TO anon;
GRANT SELECT ON public.teacher_profiles TO anon;
GRANT SELECT ON public.teacher_reviews TO anon;

-- Grant USAGE on the app_role enum so authenticated can reference it in calls
GRANT USAGE ON TYPE public.app_role TO authenticated, anon, service_role;

-- Grant EXECUTE on SECURITY DEFINER helper functions used in RLS / RPC
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.get_public_profiles(uuid[]) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.is_enrolled_in_course(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_course_live_sessions_public(uuid) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.get_course_live_sessions_enrolled(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.user_can_access_lecture_file(text, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.user_can_access_chat_audio(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_course_cover_path(text) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.user_can_access_realtime_topic(text) TO authenticated, service_role;