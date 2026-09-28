-- Admin privileges in RLS require a two-step verified session (aal2)
-- whenever the check is about the signed-in caller. Service-role / internal
-- checks for other users are unchanged.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
  AND (
    _role <> 'admin'
    OR auth.uid() IS NULL
    OR _user_id <> auth.uid()
    OR coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
  )
$$;