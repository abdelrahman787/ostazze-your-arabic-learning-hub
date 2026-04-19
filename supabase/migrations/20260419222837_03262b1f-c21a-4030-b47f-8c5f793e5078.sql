-- Enum: course type
CREATE TYPE public.course_type AS ENUM ('recorded', 'live', 'hybrid');
CREATE TYPE public.enrollment_status AS ENUM ('pending', 'active', 'cancelled', 'refunded');

-- Table: courses
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_en text,
  description text NOT NULL,
  description_en text,
  short_description text,
  short_description_en text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  course_type public.course_type NOT NULL DEFAULT 'recorded',
  cover_image_url text,
  total_hours numeric(5,2) DEFAULT 0,
  category text,
  category_en text,
  instructor_id uuid,
  instructor_name text,
  instructor_name_en text,
  level text DEFAULT 'beginner',
  language text DEFAULT 'ar',
  is_published boolean NOT NULL DEFAULT false,
  enrollment_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: course_lessons
CREATE TABLE public.course_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  title_en text,
  description text,
  video_url text,
  duration_minutes integer DEFAULT 0,
  order_index integer NOT NULL DEFAULT 0,
  is_free_preview boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table: course_live_sessions
CREATE TABLE public.course_live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  title_en text,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  duration_minutes integer DEFAULT 60,
  zoom_url text,
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: course_enrollments
CREATE TABLE public.course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  status public.enrollment_status NOT NULL DEFAULT 'pending',
  amount_paid numeric(10,2),
  payment_provider text,
  payment_id text,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(course_id, student_id)
);

-- Indexes
CREATE INDEX idx_courses_published ON public.courses(is_published) WHERE is_published = true;
CREATE INDEX idx_course_lessons_course ON public.course_lessons(course_id, order_index);
CREATE INDEX idx_course_live_sessions_course ON public.course_live_sessions(course_id, scheduled_date);
CREATE INDEX idx_course_enrollments_student ON public.course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course ON public.course_enrollments(course_id);

-- updated_at triggers (reusing or creating helper)
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_course_lessons_updated BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Helper: check if user is enrolled and active in a course
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

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- ============ courses policies ============
-- Anyone (including anon) can browse published courses
CREATE POLICY "Public can view published courses"
ON public.courses FOR SELECT
USING (is_published = true);

-- Admins can view all courses (including drafts)
CREATE POLICY "Admins can view all courses"
ON public.courses FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert courses"
ON public.courses FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update courses"
ON public.courses FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete courses"
ON public.courses FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ course_lessons policies ============
-- Public can view free preview lessons of published courses
CREATE POLICY "Public can view free preview lessons"
ON public.course_lessons FOR SELECT
USING (
  is_free_preview = true
  AND EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.is_published = true)
);

-- Enrolled students can view all lessons of their courses
CREATE POLICY "Enrolled students can view lessons"
ON public.course_lessons FOR SELECT
TO authenticated
USING (public.is_enrolled_in_course(auth.uid(), course_id));

-- Admins manage all lessons
CREATE POLICY "Admins can view all lessons"
ON public.course_lessons FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert lessons"
ON public.course_lessons FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lessons"
ON public.course_lessons FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lessons"
ON public.course_lessons FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ course_live_sessions policies ============
-- Public can see schedule (date/time/title) of live sessions on published courses, but NOT zoom_url
-- Note: zoom_url filtering must be done in application layer (select specific columns) for non-enrolled
CREATE POLICY "Enrolled students can view live sessions"
ON public.course_live_sessions FOR SELECT
TO authenticated
USING (public.is_enrolled_in_course(auth.uid(), course_id));

CREATE POLICY "Public can view live session schedule"
ON public.course_live_sessions FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.is_published = true)
);

CREATE POLICY "Admins can manage live sessions insert"
ON public.course_live_sessions FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage live sessions update"
ON public.course_live_sessions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage live sessions delete"
ON public.course_live_sessions FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ course_enrollments policies ============
-- Students see their own enrollments
CREATE POLICY "Students view own enrollments"
ON public.course_enrollments FOR SELECT
TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "Admins view all enrollments"
ON public.course_enrollments FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Students can create their own pending enrollment (for checkout init)
CREATE POLICY "Students create own enrollment"
ON public.course_enrollments FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid() AND status = 'pending');

-- Only admins can update enrollment status (webhooks use service role)
CREATE POLICY "Admins update enrollments"
ON public.course_enrollments FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete enrollments"
ON public.course_enrollments FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ Storage bucket for course videos ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-videos', 'course-videos', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('course-covers', 'course-covers', true)
ON CONFLICT (id) DO NOTHING;

-- course-covers: public read, admin write
CREATE POLICY "Public read course covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-covers');

CREATE POLICY "Admins upload course covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update course covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'course-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete course covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-covers' AND public.has_role(auth.uid(), 'admin'));

-- course-videos: enrolled students or admins can read
CREATE POLICY "Admins read course videos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins upload course videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update course videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete course videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));