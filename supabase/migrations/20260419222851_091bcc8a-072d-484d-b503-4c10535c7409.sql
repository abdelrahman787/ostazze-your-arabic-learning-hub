-- Fix search_path on new functions
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- is_enrolled_in_course already has search_path set, but re-affirm
CREATE OR REPLACE FUNCTION public.is_enrolled_in_course(_user_id uuid, _course_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.course_enrollments
    WHERE student_id = _user_id
      AND course_id = _course_id
      AND status = 'active'
  );
$$;