CREATE UNIQUE INDEX idx_bookings_no_conflict 
ON public.bookings (teacher_id, scheduled_date, scheduled_time) 
WHERE status NOT IN ('cancelled', 'rejected');