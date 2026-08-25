CREATE OR REPLACE FUNCTION public.get_admin_students()
RETURNS TABLE (
  user_id uuid,
  full_name text,
  full_name_en text,
  email text,
  email_verified boolean,
  last_sign_in_at timestamptz,
  phone text,
  country text,
  timezone text,
  onboarding_completed boolean,
  welcome_whatsapp_sent_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.user_id,
    p.full_name,
    p.full_name_en,
    u.email,
    (u.email_confirmed_at IS NOT NULL) AS email_verified,
    u.last_sign_in_at,
    p.phone,
    p.country,
    p.timezone,
    p.onboarding_completed,
    p.welcome_whatsapp_sent_at,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.user_id
  WHERE p.account_type = 'student'
    AND public.has_role(auth.uid(), 'admin')
  ORDER BY p.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_students() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_students() TO service_role;