
-- ============================================================
-- 1) Make lecture buckets PRIVATE and tighten RLS
-- ============================================================
UPDATE storage.buckets SET public = false WHERE id IN ('lecture-videos', 'lecture-pdfs');

-- Drop existing permissive SELECT policies for these buckets
DROP POLICY IF EXISTS "Public can view lecture videos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view lecture pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view lecture videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view lecture pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Public can read lecture videos" ON storage.objects;
DROP POLICY IF EXISTS "Public can read lecture pdfs" ON storage.objects;
DROP POLICY IF EXISTS "lecture_videos_public_read" ON storage.objects;
DROP POLICY IF EXISTS "lecture_pdfs_public_read" ON storage.objects;

-- Helper: check if current user is participant (student/teacher) in a lecture that references the storage path
CREATE OR REPLACE FUNCTION public.user_can_access_lecture_file(_bucket text, _name text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.lectures l
    WHERE (
      (_bucket = 'lecture-videos' AND (l.video_url = _name OR l.video_url LIKE '%/' || _name OR l.video_url LIKE '%' || _name))
      OR
      (_bucket = 'lecture-pdfs' AND (l.pdf_url = _name OR l.pdf_url LIKE '%/' || _name OR l.pdf_url LIKE '%' || _name))
    )
    AND (l.student_id = auth.uid() OR l.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  );
$$;

-- New restricted SELECT policies for lecture buckets
CREATE POLICY "lecture_videos_participants_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'lecture-videos'
  AND public.user_can_access_lecture_file('lecture-videos', name)
);

CREATE POLICY "lecture_pdfs_participants_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'lecture-pdfs'
  AND public.user_can_access_lecture_file('lecture-pdfs', name)
);

-- ============================================================
-- 2) course-videos: allow enrolled students to read
-- ============================================================
DROP POLICY IF EXISTS "course_videos_enrolled_select" ON storage.objects;

CREATE POLICY "course_videos_enrolled_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'course-videos'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.course_lessons cl
      WHERE cl.video_url LIKE '%' || name
        AND public.is_enrolled_in_course(auth.uid(), cl.course_id)
    )
  )
);

-- ============================================================
-- 3) Protect zoom_url in course_live_sessions
-- ============================================================
DROP POLICY IF EXISTS "Public can view live session schedule" ON public.course_live_sessions;
DROP POLICY IF EXISTS "Enrolled students can view live sessions" ON public.course_live_sessions;

-- Public/everyone: can see schedule but NOT zoom_url. We block direct table reads of full row by anon/non-enrolled,
-- and provide functions that return either schedule (no zoom_url) or full info (enrolled only).
CREATE POLICY "live_sessions_admin_select"
ON public.course_live_sessions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "live_sessions_enrolled_select"
ON public.course_live_sessions FOR SELECT
TO authenticated
USING (public.is_enrolled_in_course(auth.uid(), course_id));

-- Public-safe schedule (no zoom_url) via SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.get_course_live_sessions_public(_course_id uuid)
RETURNS TABLE (
  id uuid,
  title text,
  title_en text,
  scheduled_date date,
  scheduled_time time,
  duration_minutes integer,
  is_completed boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.title, s.title_en, s.scheduled_date, s.scheduled_time,
         s.duration_minutes, s.is_completed
  FROM public.course_live_sessions s
  JOIN public.courses c ON c.id = s.course_id
  WHERE s.course_id = _course_id
    AND c.is_published = true
  ORDER BY s.scheduled_date, s.scheduled_time;
$$;

-- Enrolled-only function that includes zoom_url
CREATE OR REPLACE FUNCTION public.get_course_live_sessions_enrolled(_course_id uuid)
RETURNS TABLE (
  id uuid,
  title text,
  title_en text,
  scheduled_date date,
  scheduled_time time,
  duration_minutes integer,
  is_completed boolean,
  zoom_url text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.title, s.title_en, s.scheduled_date, s.scheduled_time,
         s.duration_minutes, s.is_completed, s.zoom_url
  FROM public.course_live_sessions s
  WHERE s.course_id = _course_id
    AND (
      public.is_enrolled_in_course(auth.uid(), _course_id)
      OR public.has_role(auth.uid(), 'admin')
    )
  ORDER BY s.scheduled_date, s.scheduled_time;
$$;
