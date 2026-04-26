-- Trigger to notify all admins on new session request and on cancellation
CREATE OR REPLACE FUNCTION public.notify_admins_session_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user RECORD;
  student_name TEXT;
  notif_title TEXT;
  notif_body TEXT;
BEGIN
  SELECT full_name INTO student_name FROM public.profiles WHERE user_id = NEW.student_id LIMIT 1;

  IF TG_OP = 'INSERT' THEN
    notif_title := '🆕 طلب جلسة جديد';
    notif_body := COALESCE(student_name, 'طالب') || ' طلب جلسة' ||
                  COALESCE(' في ' || NEW.subject, '') ||
                  COALESCE(' بتاريخ ' || NEW.preferred_date::text, '');
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'cancelled' THEN
    notif_title := '⚠️ تم إلغاء جلسة';
    notif_body := COALESCE(student_name, 'طالب') || ' ألغى الجلسة' ||
                  COALESCE(' في ' || NEW.subject, '');
  ELSE
    RETURN NEW;
  END IF;

  -- Notify all admins
  FOR admin_user IN
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body)
    VALUES (admin_user.user_id,
            CASE WHEN TG_OP = 'INSERT' THEN 'admin_new_request' ELSE 'admin_cancellation' END,
            notif_title, notif_body);
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_session_insert ON public.session_requests;
CREATE TRIGGER trg_notify_admins_session_insert
  AFTER INSERT ON public.session_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_session_request();

DROP TRIGGER IF EXISTS trg_notify_admins_session_cancel ON public.session_requests;
CREATE TRIGGER trg_notify_admins_session_cancel
  AFTER UPDATE ON public.session_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_session_request();

-- Trigger for new payment (course_enrollments)
CREATE OR REPLACE FUNCTION public.notify_admins_new_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user RECORD;
  student_name TEXT;
BEGIN
  -- Only notify on status change to active (= paid)
  IF TG_OP = 'UPDATE' AND OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  IF NEW.status != 'active' THEN
    RETURN NEW;
  END IF;

  SELECT full_name INTO student_name FROM public.profiles WHERE user_id = NEW.student_id LIMIT 1;

  FOR admin_user IN SELECT user_id FROM public.user_roles WHERE role = 'admin'
  LOOP
    INSERT INTO public.notifications (user_id, type, title, body)
    VALUES (admin_user.user_id, 'admin_new_payment',
      '💰 دفعة جديدة',
      COALESCE(student_name, 'طالب') || ' دفع ' || COALESCE(NEW.amount_paid::text, '0') || ' للاشتراك في كورس');
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_payment_insert ON public.course_enrollments;
CREATE TRIGGER trg_notify_admins_payment_insert
  AFTER INSERT ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_new_payment();

DROP TRIGGER IF EXISTS trg_notify_admins_payment_update ON public.course_enrollments;
CREATE TRIGGER trg_notify_admins_payment_update
  AFTER UPDATE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.notify_admins_new_payment();

-- Enable realtime for notifications and session_requests
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.session_requests REPLICA IDENTITY FULL;
ALTER TABLE public.course_enrollments REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.session_requests;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.course_enrollments;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;