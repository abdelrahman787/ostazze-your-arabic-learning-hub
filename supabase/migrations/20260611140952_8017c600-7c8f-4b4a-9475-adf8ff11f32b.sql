
DROP POLICY IF EXISTS bookings_update_teacher ON public.bookings;

CREATE POLICY bookings_update_teacher
ON public.bookings
FOR UPDATE
TO authenticated
USING (auth.uid() = teacher_id)
WITH CHECK (
  auth.uid() = teacher_id
  AND teacher_id = (SELECT b.teacher_id FROM public.bookings b WHERE b.id = bookings.id)
  AND student_id = (SELECT b.student_id FROM public.bookings b WHERE b.id = bookings.id)
);

CREATE POLICY bookings_update_student
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  auth.uid() = student_id
  AND status IN ('pending','confirmed')
)
WITH CHECK (
  auth.uid() = student_id
  AND teacher_id = (SELECT b.teacher_id FROM public.bookings b WHERE b.id = bookings.id)
  AND student_id = (SELECT b.student_id FROM public.bookings b WHERE b.id = bookings.id)
  AND scheduled_date = (SELECT b.scheduled_date FROM public.bookings b WHERE b.id = bookings.id)
  AND scheduled_time = (SELECT b.scheduled_time FROM public.bookings b WHERE b.id = bookings.id)
  AND status IN ((SELECT b.status FROM public.bookings b WHERE b.id = bookings.id), 'cancelled')
);

DROP POLICY IF EXISTS sr_update_student ON public.session_requests;

CREATE POLICY sr_update_student
ON public.session_requests
FOR UPDATE
TO authenticated
USING (
  auth.uid() = student_id
  AND status IN ('pending','pending_payment','paid_awaiting_assignment')
)
WITH CHECK (
  auth.uid() = student_id
  AND student_id = (SELECT s.student_id FROM public.session_requests s WHERE s.id = session_requests.id)
  AND teacher_id IS NOT DISTINCT FROM (SELECT s.teacher_id FROM public.session_requests s WHERE s.id = session_requests.id)
  AND status IN ((SELECT s.status FROM public.session_requests s WHERE s.id = session_requests.id), 'cancelled')
);

DROP POLICY IF EXISTS tp_select ON public.teacher_profiles;

CREATE POLICY tp_select
ON public.teacher_profiles
FOR SELECT
TO authenticated
USING (verified = true OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

REVOKE EXECUTE ON FUNCTION public.get_course_live_sessions_enrolled(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_course_live_sessions_enrolled(uuid) TO authenticated;
