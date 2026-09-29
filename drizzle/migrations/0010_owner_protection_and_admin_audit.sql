CREATE TABLE public.owner_accounts (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.owner_accounts TO service_role;
ALTER TABLE public.owner_accounts ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.admin_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid,
  target_user_id uuid,
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_audit_events TO service_role;
GRANT SELECT ON public.admin_audit_events TO authenticated;
ALTER TABLE public.admin_audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins (AAL2) read audit events" ON public.admin_audit_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.is_owner(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.owner_accounts WHERE user_id = _user_id) $$;
REVOKE EXECUTE ON FUNCTION public.is_owner(uuid) FROM PUBLIC, anon;

-- The owner's admin role can never be removed or altered through the app
-- (including service-role functions); only a direct database migration can.
CREATE OR REPLACE FUNCTION public.guard_owner_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF public.is_owner(OLD.user_id) AND current_user NOT IN ('postgres', 'supabase_admin') THEN
    RAISE EXCEPTION 'The owner account role cannot be changed';
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END $$;
CREATE TRIGGER guard_owner_role BEFORE UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.guard_owner_role();

CREATE OR REPLACE FUNCTION public.guard_owner_accounts()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF current_user NOT IN ('postgres', 'supabase_admin') THEN
    RAISE EXCEPTION 'Owner accounts can only be changed by a database migration';
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END $$;
CREATE TRIGGER guard_owner_accounts BEFORE INSERT OR UPDATE OR DELETE ON public.owner_accounts
  FOR EACH ROW EXECUTE FUNCTION public.guard_owner_accounts();

INSERT INTO public.owner_accounts (user_id) VALUES ('1891393b-0145-4f93-9cb5-35a81a89952f');