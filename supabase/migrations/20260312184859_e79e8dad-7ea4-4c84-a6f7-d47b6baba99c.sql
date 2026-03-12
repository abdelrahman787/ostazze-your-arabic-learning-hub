
-- Teacher availability slots
CREATE TABLE public.teacher_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ta_select" ON public.teacher_availability FOR SELECT TO authenticated USING (true);
CREATE POLICY "ta_insert" ON public.teacher_availability FOR INSERT TO authenticated WITH CHECK (auth.uid() = teacher_id);
CREATE POLICY "ta_update" ON public.teacher_availability FOR UPDATE TO authenticated USING (auth.uid() = teacher_id);
CREATE POLICY "ta_delete" ON public.teacher_availability FOR DELETE TO authenticated USING (auth.uid() = teacher_id);

-- Bookings table
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'rejected', 'cancelled', 'completed');

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  subject text,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  notes text,
  reject_reason text,
  lecture_id uuid REFERENCES public.lectures(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_select" ON public.bookings FOR SELECT TO authenticated 
  USING (auth.uid() = student_id OR auth.uid() = teacher_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "bookings_insert" ON public.bookings FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = student_id);
CREATE POLICY "bookings_update_teacher" ON public.bookings FOR UPDATE TO authenticated 
  USING (auth.uid() = teacher_id OR auth.uid() = student_id);

-- Trigger for updated_at
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Notification trigger for new booking
CREATE OR REPLACE FUNCTION public.notify_new_booking()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE
  student_name text;
  teacher_name text;
BEGIN
  SELECT full_name INTO student_name FROM public.profiles WHERE user_id = NEW.student_id LIMIT 1;
  SELECT full_name INTO teacher_name FROM public.profiles WHERE user_id = NEW.teacher_id LIMIT 1;
  
  IF TG_OP = 'INSERT' THEN
    -- Notify teacher about new booking
    INSERT INTO public.notifications (user_id, type, title, body)
    VALUES (NEW.teacher_id, 'new_booking', 'طلب حجز جديد', 
      COALESCE(student_name, 'طالب') || ' يريد حجز جلسة في ' || COALESCE(NEW.subject, 'مادة') || ' بتاريخ ' || NEW.scheduled_date::text);
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    IF NEW.status = 'confirmed' THEN
      INSERT INTO public.notifications (user_id, type, title, body)
      VALUES (NEW.student_id, 'booking_confirmed', 'تم قبول حجزك ✅', 
        COALESCE(teacher_name, 'المعلم') || ' وافق على جلستك بتاريخ ' || NEW.scheduled_date::text);
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (user_id, type, title, body)
      VALUES (NEW.student_id, 'booking_rejected', 'تم رفض حجزك ❌', 
        COALESCE(teacher_name, 'المعلم') || ' اعتذر عن الجلسة بتاريخ ' || NEW.scheduled_date::text || COALESCE('. السبب: ' || NEW.reject_reason, ''));
    ELSIF NEW.status = 'cancelled' THEN
      INSERT INTO public.notifications (user_id, type, title, body)
      VALUES (NEW.teacher_id, 'booking_cancelled', 'تم إلغاء حجز ⚠️', 
        COALESCE(student_name, 'الطالب') || ' ألغى الجلسة بتاريخ ' || NEW.scheduled_date::text);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_change AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_booking();
