ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS legacy_demo boolean NOT NULL DEFAULT false;
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS legacy_demo boolean NOT NULL DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS legacy_demo boolean NOT NULL DEFAULT false;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS legacy_demo boolean NOT NULL DEFAULT false;
COMMENT ON COLUMN public.profiles.legacy_demo IS 'Legacy seed/demo account quarantined pending identity verification. Never public.';

CREATE OR REPLACE FUNCTION public.guard_teacher_profile_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    IF TG_OP = 'INSERT' THEN
      NEW.verified := false;
    ELSIF NEW.verified IS DISTINCT FROM OLD.verified THEN
      NEW.verified := OLD.verified;
    END IF;
  END IF;
  IF NEW.verified IS TRUE AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = NEW.user_id AND p.legacy_demo) THEN
    NEW.verified := false;
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.guard_teacher_profile_verification() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_guard_teacher_profile_verification ON public.teacher_profiles;
CREATE TRIGGER trg_guard_teacher_profile_verification BEFORE INSERT OR UPDATE ON public.teacher_profiles
FOR EACH ROW EXECUTE FUNCTION public.guard_teacher_profile_verification();

CREATE OR REPLACE FUNCTION public.guard_profile_legacy_flag()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    IF TG_OP = 'INSERT' THEN NEW.legacy_demo := false;
    ELSE NEW.legacy_demo := OLD.legacy_demo; END IF;
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.guard_profile_legacy_flag() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_guard_profile_legacy_flag ON public.profiles;
CREATE TRIGGER trg_guard_profile_legacy_flag BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.guard_profile_legacy_flag();

CREATE OR REPLACE FUNCTION public.get_public_profile(_user_id uuid)
 RETURNS TABLE(user_id uuid, full_name text, full_name_en text, avatar_url text, bio text, bio_en text, account_type text)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT p.user_id, p.full_name, p.full_name_en, p.avatar_url, p.bio, p.bio_en, p.account_type
  FROM public.profiles p
  WHERE p.user_id = _user_id AND NOT p.legacy_demo
    AND (p.account_type = 'teacher' OR auth.uid() IS NOT NULL);
$function$;

CREATE OR REPLACE FUNCTION public.get_public_profiles(_user_ids uuid[])
 RETURNS TABLE(user_id uuid, full_name text, full_name_en text, avatar_url text, bio text, bio_en text, account_type text)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT p.user_id, p.full_name, p.full_name_en, p.avatar_url, p.bio, p.bio_en, p.account_type
  FROM public.profiles p
  WHERE p.user_id = ANY(_user_ids) AND NOT p.legacy_demo
    AND (p.account_type = 'teacher' OR auth.uid() IS NOT NULL);
$function$;

CREATE OR REPLACE FUNCTION public.get_public_teacher_reviews(_teacher_id uuid)
 RETURNS TABLE(rating integer, comment text, created_at timestamp with time zone)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT r.rating, r.comment, r.created_at FROM public.teacher_reviews r
  JOIN public.teacher_profiles tp ON tp.user_id = r.teacher_id AND tp.verified = true
  WHERE r.teacher_id = _teacher_id AND r.status = 'approved'
  ORDER BY r.created_at DESC LIMIT 50;
$function$;