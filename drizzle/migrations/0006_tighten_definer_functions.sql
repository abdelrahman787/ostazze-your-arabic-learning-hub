-- Admin/diagnostic helpers: never callable by visitors.
REVOKE EXECUTE ON FUNCTION public.get_admin_students() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_automation_cron_status() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.get_automation_cron_status() TO service_role;
REVOKE EXECUTE ON FUNCTION public.teacher_has_student_relationship(uuid, uuid) FROM anon, public;

-- Trigger-only functions: triggers still fire; direct API calls are blocked.
REVOKE EXECUTE ON FUNCTION public.guard_teacher_review() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.lock_bank_balance() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.notify_admins_new_tutor_application() FROM anon, authenticated, public;

-- Visitors may only see tutor profiles; signed-in users keep today's behaviour.
CREATE OR REPLACE FUNCTION public.get_public_profile(_user_id uuid)
 RETURNS TABLE(user_id uuid, full_name text, full_name_en text, avatar_url text, bio text, bio_en text, account_type text)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT p.user_id, p.full_name, p.full_name_en, p.avatar_url, p.bio, p.bio_en, p.account_type
  FROM public.profiles p
  WHERE p.user_id = _user_id
    AND (p.account_type = 'teacher' OR auth.uid() IS NOT NULL);
$$;

CREATE OR REPLACE FUNCTION public.get_public_profiles(_user_ids uuid[])
 RETURNS TABLE(user_id uuid, full_name text, full_name_en text, avatar_url text, bio text, bio_en text, account_type text)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT p.user_id, p.full_name, p.full_name_en, p.avatar_url, p.bio, p.bio_en, p.account_type
  FROM public.profiles p
  WHERE p.user_id = ANY(_user_ids)
    AND (p.account_type = 'teacher' OR auth.uid() IS NOT NULL);
$$;