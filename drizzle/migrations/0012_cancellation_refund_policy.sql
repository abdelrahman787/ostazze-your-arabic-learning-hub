-- ===== Columns =====
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS cancelled_by uuid,
  ADD COLUMN IF NOT EXISTS cancelled_by_role text,
  ADD COLUMN IF NOT EXISTS cancel_reason text,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

ALTER TABLE public.session_requests
  ADD COLUMN IF NOT EXISTS payment_state text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS refund_status text,
  ADD COLUMN IF NOT EXISTS cancelled_by uuid,
  ADD COLUMN IF NOT EXISTS cancelled_by_role text,
  ADD COLUMN IF NOT EXISTS cancel_reason text,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

-- Backfill: webhook-paid rows are paid; later admin-flow rows have unknown payment (treated as paid for enforcement)
UPDATE public.session_requests SET payment_state = 'paid' WHERE status = 'paid_awaiting_assignment';
UPDATE public.session_requests SET payment_state = 'unknown' WHERE status IN ('assigned','confirmed','completed');

ALTER TABLE public.session_requests
  ADD CONSTRAINT session_requests_payment_state_chk CHECK (payment_state IN ('unpaid','paid','unknown')),
  ADD CONSTRAINT session_requests_refund_status_chk CHECK (refund_status IS NULL OR refund_status IN
    ('cancellation_requested','refund_not_required','refund_pending','refund_approved','refunded','refund_rejected','credit_issued'));

-- ===== New tables =====
CREATE TABLE public.cancellation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL CHECK (target_type IN ('booking','session_request')),
  target_id uuid NOT NULL,
  requester_id uuid NOT NULL,
  requester_role text NOT NULL CHECK (requester_role IN ('student','tutor')),
  kind text NOT NULL CHECK (kind IN ('cancel','reschedule')),
  reason text NOT NULL,
  hours_before_start numeric,
  refund_eligibility text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved','declined')),
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cancellation_requests TO authenticated;
GRANT ALL ON public.cancellation_requests TO service_role;
ALTER TABLE public.cancellation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY cr_select ON public.cancellation_requests FOR SELECT TO authenticated
  USING (requester_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.refund_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL CHECK (target_type IN ('session_request','course_enrollment')),
  target_id uuid NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text NOT NULL,
  provider_reference text NOT NULL CHECK (length(trim(provider_reference)) >= 3),
  refunded_at timestamptz NOT NULL,
  admin_id uuid NOT NULL,
  internal_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.refund_records TO authenticated;
GRANT ALL ON public.refund_records TO service_role;
ALTER TABLE public.refund_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY rr_select_admin ON public.refund_records FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- ===== Helpers =====
CREATE OR REPLACE FUNCTION public.session_start_at(_date date, _time time, _student uuid)
RETURNS timestamptz LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN _date IS NULL THEN NULL ELSE
    ((_date + coalesce(_time, '00:00'::time)) AT TIME ZONE coalesce(
      (SELECT p.timezone FROM public.profiles p WHERE p.user_id = _student
         AND p.timezone IN (SELECT name FROM pg_timezone_names) LIMIT 1),
      'Africa/Cairo')) END
$$;

CREATE OR REPLACE FUNCTION public.log_audit(_action text, _target uuid, _details jsonb)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.admin_audit_events (actor_user_id, target_user_id, action, details)
  VALUES (auth.uid(), _target, _action, coalesce(_details,'{}'::jsonb));
$$;
REVOKE ALL ON FUNCTION public.log_audit(text, uuid, jsonb) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.notify_admins(_type text, _title text, _body text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.notifications (user_id, type, title, body)
  SELECT user_id, _type, _title, _body FROM public.user_roles WHERE role = 'admin';
$$;
REVOKE ALL ON FUNCTION public.notify_admins(text, text, text) FROM PUBLIC, anon, authenticated;

-- ===== Guards: refunded requires a real provider reference; cancellations need actor + reason =====
CREATE OR REPLACE FUNCTION public.guard_session_request_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'paid_awaiting_assignment' AND OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.payment_state := 'paid';
  END IF;
  IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
    IF NEW.cancel_reason IS NULL OR NEW.cancelled_by_role IS NULL THEN
      RAISE EXCEPTION 'Cancellation requires an actor and a reason' USING ERRCODE = 'P0001';
    END IF;
    NEW.cancelled_at := coalesce(NEW.cancelled_at, now());
  END IF;
  IF NEW.refund_status = 'refunded' AND OLD.refund_status IS DISTINCT FROM 'refunded' THEN
    IF NOT EXISTS (SELECT 1 FROM public.refund_records r WHERE r.target_type='session_request' AND r.target_id = NEW.id) THEN
      RAISE EXCEPTION 'Cannot mark refunded without a recorded provider refund reference' USING ERRCODE = 'P0001';
    END IF;
  END IF;
  IF NEW.payment_state IS DISTINCT FROM OLD.payment_state AND NEW.status <> 'paid_awaiting_assignment'
     AND auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(),'admin') THEN
    RAISE EXCEPTION 'Payment state is protected' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_guard_session_request_update BEFORE UPDATE ON public.session_requests
  FOR EACH ROW EXECUTE FUNCTION public.guard_session_request_update();

CREATE OR REPLACE FUNCTION public.guard_session_request_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(),'admin') THEN
    NEW.payment_state := 'unpaid';
    NEW.refund_status := NULL;
    NEW.cancelled_by := NULL; NEW.cancelled_by_role := NULL; NEW.cancel_reason := NULL; NEW.cancelled_at := NULL;
    IF NEW.status NOT IN ('pending','pending_payment') THEN NEW.status := 'pending'; END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_guard_session_request_insert BEFORE INSERT ON public.session_requests
  FOR EACH ROW EXECUTE FUNCTION public.guard_session_request_insert();

CREATE OR REPLACE FUNCTION public.guard_booking_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
    IF NEW.cancelled_by_role IS NULL THEN
      RAISE EXCEPTION 'Cancellation requires an actor' USING ERRCODE = 'P0001';
    END IF;
    NEW.cancelled_at := coalesce(NEW.cancelled_at, now());
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_guard_booking_update BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.guard_booking_update();

CREATE OR REPLACE FUNCTION public.guard_enrollment_refund()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'refunded' AND OLD.status IS DISTINCT FROM 'refunded' THEN
    IF NOT EXISTS (SELECT 1 FROM public.refund_records r WHERE r.target_type='course_enrollment' AND r.target_id = NEW.id) THEN
      RAISE EXCEPTION 'Cannot mark refunded without a recorded provider refund reference' USING ERRCODE = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_guard_enrollment_refund BEFORE UPDATE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.guard_enrollment_refund();

-- ===== Policies: remove direct student cancellation / free tutor edits =====
DROP POLICY IF EXISTS bookings_update_student ON public.bookings;
DROP POLICY IF EXISTS sr_update_student ON public.session_requests;
DROP POLICY IF EXISTS sr_update_teacher ON public.session_requests;

-- Tutors: pending -> confirmed/rejected only; confirmed -> completed; no cancellation, no date/detail edits
DROP POLICY IF EXISTS bookings_update_teacher ON public.bookings;
CREATE POLICY bookings_update_teacher ON public.bookings FOR UPDATE TO authenticated
USING (auth.uid() = teacher_id AND status IN ('pending','confirmed'))
WITH CHECK (
  auth.uid() = teacher_id
  AND teacher_id = (SELECT b.teacher_id FROM public.bookings b WHERE b.id = bookings.id)
  AND student_id = (SELECT b.student_id FROM public.bookings b WHERE b.id = bookings.id)
  AND NOT (subject IS DISTINCT FROM (SELECT b.subject FROM public.bookings b WHERE b.id = bookings.id))
  AND scheduled_date = (SELECT b.scheduled_date FROM public.bookings b WHERE b.id = bookings.id)
  AND scheduled_time = (SELECT b.scheduled_time FROM public.bookings b WHERE b.id = bookings.id)
  AND NOT (notes IS DISTINCT FROM (SELECT b.notes FROM public.bookings b WHERE b.id = bookings.id))
  AND cancelled_by IS NULL AND cancelled_by_role IS NULL
  AND (
    ((SELECT b.status FROM public.bookings b WHERE b.id = bookings.id) = 'pending' AND status IN ('confirmed','rejected','pending'))
    OR ((SELECT b.status FROM public.bookings b WHERE b.id = bookings.id) = 'confirmed' AND status IN ('completed','confirmed'))
  )
);

-- Admin direct booking updates (all cancellation goes through RPCs which set actor/reason)
CREATE POLICY bookings_update_admin ON public.bookings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- No new paid course sales until a course refund policy is approved
DROP POLICY IF EXISTS "Students create own enrollment" ON public.course_enrollments;
CREATE POLICY "Students create own enrollment" ON public.course_enrollments FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid() AND status = 'pending'::enrollment_status
  AND EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.is_published AND c.price = 0));

-- ===== RPCs =====
CREATE OR REPLACE FUNCTION public.student_cancel_booking(_booking_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE b public.bookings; start_at timestamptz;
BEGIN
  SELECT * INTO b FROM public.bookings WHERE id = _booking_id FOR UPDATE;
  IF NOT FOUND OR b.student_id <> auth.uid() THEN RAISE EXCEPTION 'Booking not found' USING ERRCODE='P0002'; END IF;
  start_at := public.session_start_at(b.scheduled_date, b.scheduled_time, b.student_id);
  IF b.status = 'pending' THEN
    IF start_at <= now() THEN RAISE EXCEPTION 'This booking has already started or passed' USING ERRCODE='P0001'; END IF;
  ELSIF b.status = 'confirmed' THEN
    IF start_at - now() < interval '24 hours' THEN
      RAISE EXCEPTION 'Confirmed bookings can only be cancelled at least 24 hours before the start' USING ERRCODE='P0001';
    END IF;
  ELSE
    RAISE EXCEPTION 'This booking can no longer be cancelled' USING ERRCODE='P0001';
  END IF;
  UPDATE public.bookings SET status='cancelled', cancelled_by=auth.uid(), cancelled_by_role='student',
    cancel_reason='student_cancelled', cancelled_at=now() WHERE id=_booking_id;
  PERFORM public.log_audit('booking_cancelled_by_student', b.student_id,
    jsonb_build_object('booking_id',b.id,'previous_status',b.status,'new_status','cancelled','payment_state','unpaid'));
  RETURN 'cancelled';
END $$;

CREATE OR REPLACE FUNCTION public.admin_cancel_booking(_booking_id uuid, _reason text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE b public.bookings;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Admin with two-step verification required' USING ERRCODE='42501'; END IF;
  IF _reason IS NULL OR length(trim(_reason)) < 3 THEN RAISE EXCEPTION 'A reason is required' USING ERRCODE='P0001'; END IF;
  SELECT * INTO b FROM public.bookings WHERE id=_booking_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Booking not found' USING ERRCODE='P0002'; END IF;
  IF b.status NOT IN ('pending','confirmed') THEN RAISE EXCEPTION 'This booking can no longer be cancelled' USING ERRCODE='P0001'; END IF;
  UPDATE public.bookings SET status='cancelled', cancelled_by=auth.uid(), cancelled_by_role='admin',
    cancel_reason=trim(_reason), cancelled_at=now() WHERE id=_booking_id;
  PERFORM public.log_audit('booking_cancelled_by_admin', b.student_id,
    jsonb_build_object('booking_id',b.id,'previous_status',b.status,'new_status','cancelled','payment_state','unpaid','reason',trim(_reason)));
  RETURN 'cancelled';
END $$;

CREATE OR REPLACE FUNCTION public.student_cancel_session_request(_request_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.session_requests;
BEGIN
  SELECT * INTO s FROM public.session_requests WHERE id=_request_id FOR UPDATE;
  IF NOT FOUND OR s.student_id <> auth.uid() THEN RAISE EXCEPTION 'Session request not found' USING ERRCODE='P0002'; END IF;
  IF s.status NOT IN ('pending','pending_payment') OR s.payment_state <> 'unpaid' THEN
    RAISE EXCEPTION 'Paid or scheduled sessions cannot be cancelled directly. Please request cancellation.' USING ERRCODE='P0001';
  END IF;
  UPDATE public.session_requests SET status='cancelled', cancelled_by=auth.uid(), cancelled_by_role='student',
    cancel_reason='student_cancelled', cancelled_at=now() WHERE id=_request_id;
  PERFORM public.log_audit('session_cancelled_by_student', s.student_id,
    jsonb_build_object('session_request_id',s.id,'previous_status',s.status,'new_status','cancelled','payment_state',s.payment_state));
  RETURN 'cancelled';
END $$;

CREATE OR REPLACE FUNCTION public.request_session_change(_request_id uuid, _kind text, _reason text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.session_requests; actor text; start_at timestamptz; hrs numeric; elig text; nm text; new_id uuid;
BEGIN
  IF _kind NOT IN ('cancel','reschedule') THEN RAISE EXCEPTION 'Invalid request type' USING ERRCODE='P0001'; END IF;
  IF _reason IS NULL OR length(trim(_reason)) < 3 THEN RAISE EXCEPTION 'A reason is required' USING ERRCODE='P0001'; END IF;
  SELECT * INTO s FROM public.session_requests WHERE id=_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Session request not found' USING ERRCODE='P0002'; END IF;
  IF s.student_id = auth.uid() THEN actor := 'student';
  ELSIF s.teacher_id = auth.uid() THEN actor := 'tutor';
  ELSE RAISE EXCEPTION 'Session request not found' USING ERRCODE='P0002'; END IF;
  IF s.status IN ('cancelled','completed','rejected') THEN RAISE EXCEPTION 'This session can no longer be changed' USING ERRCODE='P0001'; END IF;
  IF actor='student' AND s.status IN ('pending','pending_payment') AND s.payment_state='unpaid' THEN
    RAISE EXCEPTION 'Unpaid requests can be cancelled directly' USING ERRCODE='P0001';
  END IF;
  start_at := public.session_start_at(s.preferred_date, s.preferred_time, s.student_id);
  IF start_at IS NOT NULL AND start_at <= now() THEN RAISE EXCEPTION 'Past sessions cannot be changed' USING ERRCODE='P0001'; END IF;
  IF EXISTS (SELECT 1 FROM public.cancellation_requests c WHERE c.target_type='session_request' AND c.target_id=s.id AND c.status='open') THEN
    RAISE EXCEPTION 'A request is already open for this session' USING ERRCODE='P0001';
  END IF;
  hrs := CASE WHEN start_at IS NULL THEN NULL ELSE round(extract(epoch FROM (start_at - now()))/3600, 2) END;
  elig := CASE WHEN actor='tutor' THEN 'platform_or_tutor_fault'
               WHEN hrs IS NULL OR hrs >= 24 THEN 'full_refund_after_review'
               ELSE 'no_automatic_refund' END;
  INSERT INTO public.cancellation_requests (target_type,target_id,requester_id,requester_role,kind,reason,hours_before_start,refund_eligibility)
  VALUES ('session_request', s.id, auth.uid(), actor, _kind, trim(_reason), hrs, elig) RETURNING id INTO new_id;
  IF _kind='cancel' AND s.payment_state <> 'unpaid' AND s.refund_status IS NULL THEN
    UPDATE public.session_requests SET refund_status='cancellation_requested' WHERE id=s.id;
  END IF;
  SELECT full_name INTO nm FROM public.profiles WHERE user_id=auth.uid() LIMIT 1;
  PERFORM public.notify_admins('admin_cancellation_request',
    CASE WHEN _kind='cancel' THEN '⚠️ طلب إلغاء جلسة' ELSE '🔁 طلب إعادة جدولة' END,
    CASE WHEN actor='tutor' THEN 'المعلم ' ELSE 'الطالب ' END || coalesce(nm,'') ||
    CASE WHEN _kind='cancel' THEN ' طلب إلغاء الجلسة' ELSE ' طلب إعادة جدولة الجلسة' END || coalesce(' في ' || s.subject,''));
  PERFORM public.log_audit('session_change_requested', s.student_id,
    jsonb_build_object('session_request_id',s.id,'actor',actor,'kind',_kind,'status',s.status,'payment_state',s.payment_state,'hours_before_start',hrs,'refund_eligibility',elig));
  RETURN jsonb_build_object('id',new_id,'refund_eligibility',elig,'hours_before_start',hrs);
END $$;

CREATE OR REPLACE FUNCTION public.admin_cancel_session_request(_request_id uuid, _actor text, _reason text, _refund_decision text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.session_requests; rd text;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Admin with two-step verification required' USING ERRCODE='42501'; END IF;
  IF _actor NOT IN ('student','tutor','admin','platform') THEN RAISE EXCEPTION 'Invalid cancellation actor' USING ERRCODE='P0001'; END IF;
  IF _reason IS NULL OR length(trim(_reason)) < 3 THEN RAISE EXCEPTION 'A reason is required' USING ERRCODE='P0001'; END IF;
  SELECT * INTO s FROM public.session_requests WHERE id=_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Session request not found' USING ERRCODE='P0002'; END IF;
  IF s.status IN ('cancelled','completed') THEN RAISE EXCEPTION 'This session can no longer be cancelled' USING ERRCODE='P0001'; END IF;
  IF s.payment_state = 'unpaid' THEN rd := NULL;
  ELSE
    IF _refund_decision NOT IN ('refund_not_required','refund_pending','refund_approved','refund_rejected') THEN
      RAISE EXCEPTION 'A refund decision is required for paid sessions' USING ERRCODE='P0001';
    END IF;
    rd := _refund_decision;
  END IF;
  UPDATE public.session_requests SET status='cancelled', cancelled_by=auth.uid(), cancelled_by_role=_actor,
    cancel_reason=trim(_reason), cancelled_at=now(), refund_status=rd WHERE id=_request_id;
  UPDATE public.cancellation_requests SET status='resolved', resolved_by=auth.uid(), resolved_at=now()
    WHERE target_type='session_request' AND target_id=s.id AND status='open';
  IF rd IS NOT NULL THEN
    INSERT INTO public.notifications (user_id,type,title,body) VALUES (s.student_id,'refund_decision','قرار الاسترداد',
      CASE rd WHEN 'refund_approved' THEN 'تمت الموافقة على استرداد مبلغ الجلسة، وسيُعاد إلى وسيلة الدفع الأصلية متى أمكن.'
              WHEN 'refund_pending' THEN 'طلب الاسترداد قيد المراجعة.'
              WHEN 'refund_rejected' THEN 'لم تتم الموافقة على الاسترداد وفق سياسة الإلغاء. تواصل معنا لأي استفسار.'
              ELSE 'لا يتطلب هذا الإلغاء استرداد مبلغ.' END);
  END IF;
  PERFORM public.log_audit('session_cancelled_by_admin', s.student_id,
    jsonb_build_object('session_request_id',s.id,'actor',_actor,'reason',trim(_reason),'previous_status',s.status,
      'new_status','cancelled','payment_state',s.payment_state,'refund_decision',rd));
  RETURN 'cancelled';
END $$;

CREATE OR REPLACE FUNCTION public.admin_set_refund_decision(_request_id uuid, _decision text, _reason text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.session_requests;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Admin with two-step verification required' USING ERRCODE='42501'; END IF;
  IF _decision NOT IN ('refund_not_required','refund_pending','refund_approved','refund_rejected','credit_issued') THEN
    RAISE EXCEPTION 'Invalid refund decision' USING ERRCODE='P0001'; END IF;
  IF _reason IS NULL OR length(trim(_reason)) < 3 THEN RAISE EXCEPTION 'A reason is required' USING ERRCODE='P0001'; END IF;
  SELECT * INTO s FROM public.session_requests WHERE id=_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Session request not found' USING ERRCODE='P0002'; END IF;
  IF s.payment_state = 'unpaid' THEN RAISE EXCEPTION 'Unpaid sessions have no refund' USING ERRCODE='P0001'; END IF;
  IF s.refund_status = 'refunded' THEN RAISE EXCEPTION 'Already refunded' USING ERRCODE='P0001'; END IF;
  UPDATE public.session_requests SET refund_status=_decision WHERE id=_request_id;
  INSERT INTO public.notifications (user_id,type,title,body) VALUES (s.student_id,'refund_decision','قرار الاسترداد',
    CASE _decision WHEN 'refund_approved' THEN 'تمت الموافقة على الاسترداد، وسيُعاد المبلغ إلى وسيلة الدفع الأصلية متى أمكن.'
      WHEN 'refund_pending' THEN 'طلب الاسترداد قيد المراجعة.'
      WHEN 'refund_rejected' THEN 'لم تتم الموافقة على الاسترداد وفق سياسة الإلغاء. تواصل معنا لأي استفسار.'
      WHEN 'credit_issued' THEN 'تمت إضافة رصيد إلى حسابك بناءً على اختيارك.'
      ELSE 'لا يتطلب هذا الطلب استرداد مبلغ.' END);
  PERFORM public.log_audit('refund_decision', s.student_id,
    jsonb_build_object('session_request_id',s.id,'previous_refund_status',s.refund_status,'new_refund_status',_decision,'reason',trim(_reason),'payment_state',s.payment_state));
  RETURN _decision;
END $$;

CREATE OR REPLACE FUNCTION public.admin_record_refund(_target_type text, _target_id uuid, _amount numeric, _currency text,
  _provider_reference text, _refunded_at timestamptz, _internal_note text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.session_requests; e public.course_enrollments; rid uuid; stu uuid;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Admin with two-step verification required' USING ERRCODE='42501'; END IF;
  IF _amount IS NULL OR _amount <= 0 OR _currency IS NULL OR length(trim(_currency)) <> 3 THEN RAISE EXCEPTION 'Amount and 3-letter currency required' USING ERRCODE='P0001'; END IF;
  IF _provider_reference IS NULL OR length(trim(_provider_reference)) < 3 THEN RAISE EXCEPTION 'Provider refund reference required' USING ERRCODE='P0001'; END IF;
  IF _refunded_at IS NULL OR _refunded_at > now() + interval '5 minutes' THEN RAISE EXCEPTION 'Valid refund time required' USING ERRCODE='P0001'; END IF;
  IF _target_type = 'session_request' THEN
    SELECT * INTO s FROM public.session_requests WHERE id=_target_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Session request not found' USING ERRCODE='P0002'; END IF;
    IF s.refund_status IS DISTINCT FROM 'refund_approved' THEN RAISE EXCEPTION 'Refund must be approved first' USING ERRCODE='P0001'; END IF;
    stu := s.student_id;
  ELSIF _target_type = 'course_enrollment' THEN
    SELECT * INTO e FROM public.course_enrollments WHERE id=_target_id FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Enrollment not found' USING ERRCODE='P0002'; END IF;
    IF e.status = 'refunded' THEN RAISE EXCEPTION 'Already refunded' USING ERRCODE='P0001'; END IF;
    stu := e.student_id;
  ELSE RAISE EXCEPTION 'Invalid target' USING ERRCODE='P0001'; END IF;
  INSERT INTO public.refund_records (target_type,target_id,amount,currency,provider_reference,refunded_at,admin_id,internal_note)
  VALUES (_target_type,_target_id,_amount,upper(trim(_currency)),trim(_provider_reference),_refunded_at,auth.uid(),nullif(trim(_internal_note),''))
  RETURNING id INTO rid;
  IF _target_type='session_request' THEN UPDATE public.session_requests SET refund_status='refunded' WHERE id=_target_id;
  ELSE UPDATE public.course_enrollments SET status='refunded' WHERE id=_target_id; END IF;
  INSERT INTO public.notifications (user_id,type,title,body) VALUES (stu,'refund_completed','تم الاسترداد',
    'تم تنفيذ الاسترداد عبر مزوّد الدفع. قد تختلف مدة ظهوره في حسابك حسب البنك.');
  PERFORM public.log_audit('refund_recorded', stu,
    jsonb_build_object('target_type',_target_type,'target_id',_target_id,'refund_record_id',rid,'amount',_amount,'currency',upper(trim(_currency))));
  RETURN rid;
END $$;

CREATE OR REPLACE FUNCTION public.tutor_decline_assignment(_request_id uuid, _reason text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.session_requests; nm text; ns text;
BEGIN
  IF _reason IS NULL OR length(trim(_reason)) < 3 THEN RAISE EXCEPTION 'A reason is required' USING ERRCODE='P0001'; END IF;
  SELECT * INTO s FROM public.session_requests WHERE id=_request_id FOR UPDATE;
  IF NOT FOUND OR s.teacher_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'Session request not found' USING ERRCODE='P0002'; END IF;
  IF s.status <> 'assigned' THEN RAISE EXCEPTION 'Only new assignments can be declined; request cancellation instead' USING ERRCODE='P0001'; END IF;
  ns := CASE WHEN s.payment_state='unpaid' THEN 'pending' ELSE 'paid_awaiting_assignment' END;
  UPDATE public.session_requests SET teacher_id=NULL, zoom_url=NULL, status=ns WHERE id=_request_id;
  SELECT full_name INTO nm FROM public.profiles WHERE user_id=auth.uid() LIMIT 1;
  PERFORM public.notify_admins('admin_assignment_declined','↩️ المعلم اعتذر عن جلسة',
    'المعلم ' || coalesce(nm,'') || ' اعتذر عن الجلسة' || coalesce(' في ' || s.subject,'') || ' — تحتاج إعادة تعيين.');
  PERFORM public.log_audit('assignment_declined_by_tutor', s.student_id,
    jsonb_build_object('session_request_id',s.id,'tutor_id',auth.uid(),'previous_status',s.status,'new_status',ns,'reason',trim(_reason)));
  RETURN ns;
END $$;

REVOKE ALL ON FUNCTION public.student_cancel_booking(uuid), public.admin_cancel_booking(uuid,text),
  public.student_cancel_session_request(uuid), public.request_session_change(uuid,text,text),
  public.admin_cancel_session_request(uuid,text,text,text), public.admin_set_refund_decision(uuid,text,text),
  public.admin_record_refund(text,uuid,numeric,text,text,timestamptz,text), public.tutor_decline_assignment(uuid,text),
  public.session_start_at(date,time,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.student_cancel_booking(uuid), public.admin_cancel_booking(uuid,text),
  public.student_cancel_session_request(uuid), public.request_session_change(uuid,text,text),
  public.admin_cancel_session_request(uuid,text,text,text), public.admin_set_refund_decision(uuid,text,text),
  public.admin_record_refund(text,uuid,numeric,text,text,timestamptz,text), public.tutor_decline_assignment(uuid,text)
  TO authenticated;

-- ===== Notifications naming the real actor =====
CREATE OR REPLACE FUNCTION public.notify_new_booking()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE student_name text; teacher_name text; who text;
BEGIN
  SELECT full_name INTO student_name FROM public.profiles WHERE user_id = NEW.student_id LIMIT 1;
  SELECT full_name INTO teacher_name FROM public.profiles WHERE user_id = NEW.teacher_id LIMIT 1;
  IF TG_OP = 'INSERT' THEN
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
      who := CASE NEW.cancelled_by_role WHEN 'student' THEN 'الطالب ' || COALESCE(student_name,'')
                                        WHEN 'tutor' THEN 'المعلم ' || COALESCE(teacher_name,'')
                                        ELSE 'إدارة المنصة' END;
      IF NEW.cancelled_by_role IS DISTINCT FROM 'tutor' THEN
        INSERT INTO public.notifications (user_id, type, title, body)
        VALUES (NEW.teacher_id, 'booking_cancelled', 'تم إلغاء حجز ⚠️', who || ' ألغى الجلسة بتاريخ ' || NEW.scheduled_date::text);
      END IF;
      IF NEW.cancelled_by_role IS DISTINCT FROM 'student' THEN
        INSERT INTO public.notifications (user_id, type, title, body)
        VALUES (NEW.student_id, 'booking_cancelled', 'تم إلغاء حجزك ⚠️', who || ' ألغى الجلسة بتاريخ ' || NEW.scheduled_date::text);
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.notify_admins_session_request()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE student_name text; who text;
BEGIN
  SELECT full_name INTO student_name FROM public.profiles WHERE user_id = NEW.student_id LIMIT 1;
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_admins('admin_new_request', '🆕 طلب جلسة جديد',
      COALESCE(student_name, 'طالب') || ' طلب جلسة' || COALESCE(' في ' || NEW.subject, '') || COALESCE(' بتاريخ ' || NEW.preferred_date::text, ''));
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'cancelled' THEN
    who := CASE NEW.cancelled_by_role WHEN 'student' THEN 'الطالب ' || COALESCE(student_name,'')
                                      WHEN 'tutor' THEN 'المعلم' WHEN 'platform' THEN 'المنصة' ELSE 'الإدارة' END;
    PERFORM public.notify_admins('admin_cancellation', '⚠️ تم إلغاء جلسة', who || ' — إلغاء الجلسة' || COALESCE(' في ' || NEW.subject, ''));
    IF NEW.cancelled_by_role IS DISTINCT FROM 'student' THEN
      INSERT INTO public.notifications (user_id, type, title, body)
      VALUES (NEW.student_id, 'session_cancelled', 'تم إلغاء جلستك', 'تم إلغاء الجلسة' || COALESCE(' في ' || NEW.subject, '') || ' بواسطة ' || who || '.');
    END IF;
    IF NEW.teacher_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, type, title, body)
      VALUES (NEW.teacher_id, 'session_cancelled', 'تم إلغاء جلسة', 'تم إلغاء الجلسة' || COALESCE(' في ' || NEW.subject, '') || ' بواسطة ' || who || '.');
    END IF;
  END IF;
  RETURN NEW;
END $$;
