
-- 1. Booking teacher update: lock fields + restrict status transitions
DROP POLICY IF EXISTS bookings_update_teacher ON public.bookings;
CREATE POLICY bookings_update_teacher ON public.bookings
FOR UPDATE
USING (auth.uid() = teacher_id)
WITH CHECK (
  auth.uid() = teacher_id
  AND teacher_id = (SELECT b.teacher_id FROM public.bookings b WHERE b.id = bookings.id)
  AND student_id = (SELECT b.student_id FROM public.bookings b WHERE b.id = bookings.id)
  AND subject IS NOT DISTINCT FROM (SELECT b.subject FROM public.bookings b WHERE b.id = bookings.id)
  AND scheduled_date = (SELECT b.scheduled_date FROM public.bookings b WHERE b.id = bookings.id)
  AND scheduled_time = (SELECT b.scheduled_time FROM public.bookings b WHERE b.id = bookings.id)
  AND notes IS NOT DISTINCT FROM (SELECT b.notes FROM public.bookings b WHERE b.id = bookings.id)
  AND lecture_id IS NOT DISTINCT FROM (SELECT b.lecture_id FROM public.bookings b WHERE b.id = bookings.id)
  AND status IN ('confirmed'::booking_status, 'rejected'::booking_status, 'completed'::booking_status, 'cancelled'::booking_status)
  AND (
    -- allowed transitions
    (
      (SELECT b.status FROM public.bookings b WHERE b.id = bookings.id) = 'pending'::booking_status
      AND status IN ('confirmed'::booking_status, 'rejected'::booking_status)
    )
    OR (
      (SELECT b.status FROM public.bookings b WHERE b.id = bookings.id) = 'confirmed'::booking_status
      AND status IN ('completed'::booking_status, 'cancelled'::booking_status)
    )
    OR status = (SELECT b.status FROM public.bookings b WHERE b.id = bookings.id)
  )
);

-- 2. Lectures teacher insert: require a real teacher/student relationship
CREATE OR REPLACE FUNCTION public.teacher_has_student_relationship(_teacher_id uuid, _student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE teacher_id = _teacher_id
      AND student_id = _student_id
      AND status IN ('confirmed'::booking_status, 'completed'::booking_status)
  ) OR EXISTS (
    SELECT 1 FROM public.session_requests
    WHERE teacher_id = _teacher_id
      AND student_id = _student_id
      AND status IN ('assigned', 'completed', 'confirmed')
  );
$$;

DROP POLICY IF EXISTS lectures_insert_teacher ON public.lectures;
CREATE POLICY lectures_insert_teacher ON public.lectures
FOR INSERT
WITH CHECK (
  auth.uid() = teacher_id
  AND (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR public.teacher_has_student_relationship(auth.uid(), student_id)
  )
);

-- 3. Course live sessions: allow enrolled students to select their sessions
CREATE POLICY live_sessions_enrolled_select ON public.course_live_sessions
FOR SELECT
USING (
  public.is_enrolled_in_course(auth.uid(), course_id)
);
