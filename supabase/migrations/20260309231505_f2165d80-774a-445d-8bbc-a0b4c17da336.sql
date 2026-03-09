
-- Teacher profiles table
CREATE TABLE public.teacher_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  university text,
  price numeric DEFAULT 0,
  verified boolean DEFAULT false,
  subjects text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can view
CREATE POLICY "Teacher profiles viewable by everyone"
  ON public.teacher_profiles FOR SELECT TO public USING (true);

-- Teachers can insert their own
CREATE POLICY "Teachers can insert own profile"
  ON public.teacher_profiles FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id);

-- Teachers can update their own
CREATE POLICY "Teachers can update own profile"
  ON public.teacher_profiles FOR UPDATE TO public
  USING (auth.uid() = user_id);

-- Admins can update any teacher profile
CREATE POLICY "Admins can update any teacher profile"
  ON public.teacher_profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete teacher profiles
CREATE POLICY "Admins can delete teacher profiles"
  ON public.teacher_profiles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_teacher_profiles_updated_at
  BEFORE UPDATE ON public.teacher_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
