
-- 1) Remove direct table SELECT for enrolled students so zoom_url is only served via the gated RPC
DROP POLICY IF EXISTS "live_sessions_enrolled_select" ON public.course_live_sessions;

-- 2) Restrict teacher review inserts to students with a completed booking with the teacher
DROP POLICY IF EXISTS "teacher_reviews_insert_own" ON public.teacher_reviews;

CREATE POLICY "teacher_reviews_insert_own"
ON public.teacher_reviews
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = student_id
  AND EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.student_id = auth.uid()
      AND b.teacher_id = teacher_reviews.teacher_id
      AND b.status = 'completed'
  )
);
