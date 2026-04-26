-- ============================================================
-- 1) Remove course_enrollments from realtime publication
-- ============================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'course_enrollments'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.course_enrollments';
  END IF;
END$$;

-- ============================================================
-- 2) Scope realtime.messages policies to authorized topics only
-- ============================================================

-- Helper: check if the current user is allowed to subscribe to a given topic
CREATE OR REPLACE FUNCTION public.user_can_access_realtime_topic(_topic text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  lecture_uuid uuid;
BEGIN
  IF uid IS NULL OR _topic IS NULL THEN
    RETURN false;
  END IF;

  -- Personal notification channel: notifications-<user_id>
  IF _topic = 'notifications-' || uid::text THEN
    RETURN true;
  END IF;

  -- Admin-only channels
  IF _topic IN ('admin-session-requests', 'admin-notifications', 'admin-payments')
     AND public.has_role(uid, 'admin') THEN
    RETURN true;
  END IF;

  -- Lecture chat channel: chat-<lecture_id>
  IF _topic LIKE 'chat-%' THEN
    BEGIN
      lecture_uuid := substring(_topic from 6)::uuid;
    EXCEPTION WHEN others THEN
      RETURN false;
    END;
    RETURN EXISTS (
      SELECT 1 FROM public.lectures l
      WHERE l.id = lecture_uuid
        AND (l.student_id = uid OR l.teacher_id = uid OR public.has_role(uid, 'admin'))
    );
  END IF;

  RETURN false;
END;
$$;

-- Drop overly permissive policies and replace with topic-scoped ones
DROP POLICY IF EXISTS "authenticated_can_receive_realtime" ON realtime.messages;
DROP POLICY IF EXISTS "authenticated_can_send_realtime" ON realtime.messages;

CREATE POLICY "scoped_realtime_receive"
ON realtime.messages
FOR SELECT
TO authenticated
USING (public.user_can_access_realtime_topic((SELECT realtime.topic())));

CREATE POLICY "scoped_realtime_send"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (public.user_can_access_realtime_topic((SELECT realtime.topic())));

-- ============================================================
-- 3) Restrict zoom_url exposure to a time window for live sessions
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_course_live_sessions_enrolled(_course_id uuid)
RETURNS TABLE(
  id uuid,
  title text,
  title_en text,
  scheduled_date date,
  scheduled_time time without time zone,
  duration_minutes integer,
  is_completed boolean,
  zoom_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id, s.title, s.title_en, s.scheduled_date, s.scheduled_time,
    s.duration_minutes, s.is_completed,
    CASE
      WHEN s.is_completed THEN NULL
      WHEN public.has_role(auth.uid(), 'admin') THEN s.zoom_url
      WHEN (s.scheduled_date + s.scheduled_time) BETWEEN (now() - interval '30 minutes')
        AND (now() + (COALESCE(s.duration_minutes, 60) || ' minutes')::interval)
        THEN s.zoom_url
      ELSE NULL
    END AS zoom_url
  FROM public.course_live_sessions s
  WHERE s.course_id = _course_id
    AND (
      public.is_enrolled_in_course(auth.uid(), _course_id)
      OR public.has_role(auth.uid(), 'admin')
    )
  ORDER BY s.scheduled_date, s.scheduled_time;
$$;

-- Also tighten direct table SELECT for enrolled users to NOT return raw zoom_url.
-- We replace the broad enrolled-select policy with one that allows row visibility,
-- but encourage clients to use the RPC. Direct table access still leaks zoom_url to enrolled users,
-- so we drop the enrolled select policy: clients must use the RPC for course content.
DROP POLICY IF EXISTS "live_sessions_enrolled_select" ON public.course_live_sessions;
