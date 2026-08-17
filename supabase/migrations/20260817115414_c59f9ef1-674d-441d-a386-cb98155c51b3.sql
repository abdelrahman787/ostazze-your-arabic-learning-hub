CREATE TABLE public.tutor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  nationality text,
  country text,
  city text,
  specialization text,
  university text,
  degree text,
  experience text,
  teach_lang text,
  courses text,
  recorded_before text,
  quiet_place text,
  tools text[] NOT NULL DEFAULT '{}',
  device text,
  microphone text,
  cv_link text,
  demo_link text,
  lang text NOT NULL DEFAULT 'ar',
  status text NOT NULL DEFAULT 'new',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.tutor_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tutor_applications TO authenticated;
GRANT ALL ON public.tutor_applications TO service_role;

ALTER TABLE public.tutor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a tutor application"
ON public.tutor_applications FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view tutor applications"
ON public.tutor_applications FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins can update tutor applications"
ON public.tutor_applications FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins can delete tutor applications"
ON public.tutor_applications FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER tutor_applications_touch_updated_at
BEFORE UPDATE ON public.tutor_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.notify_admins_new_tutor_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, body)
  SELECT ur.user_id,
         'tutor_application',
         'طلب انضمام معلم جديد',
         COALESCE(NEW.full_name, '') || ' — ' || COALESCE(NEW.specialization, '')
  FROM public.user_roles ur
  WHERE ur.role IN ('admin', 'moderator');
  RETURN NEW;
END;
$$;

CREATE TRIGGER tutor_applications_notify_admins
AFTER INSERT ON public.tutor_applications
FOR EACH ROW EXECUTE FUNCTION public.notify_admins_new_tutor_application();