-- 1. Remove overly broad authenticated SELECT on lecture-videos and lecture-pdfs
DROP POLICY IF EXISTS "Authenticated can view lecture videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can view lecture pdfs" ON storage.objects;

-- 2. Tighten chat-audio INSERT: require uploader is participant in a lecture (path = <user_id>/<file>)
DROP POLICY IF EXISTS "Authenticated users can upload chat audio" ON storage.objects;

CREATE POLICY "chat_audio_participants_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-audio'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (
    SELECT 1 FROM public.lectures l
    WHERE l.student_id = auth.uid() OR l.teacher_id = auth.uid()
  )
);

-- 3. Restrict course-covers bucket listing: drop broad public SELECT
-- The course_covers_referenced_select policy already allows reading referenced cover files.
DROP POLICY IF EXISTS "Public read course covers" ON storage.objects;

-- 4. Notifications INSERT: tighten to prevent injection into other users' feeds
-- All current notification creation happens via SECURITY DEFINER triggers, which bypass RLS.
DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;
-- No permissive INSERT policy for authenticated role — triggers handle inserts via SECURITY DEFINER.

-- 5. Realtime channel authorization: enable RLS on realtime.messages and scope subscriptions.
-- Allow authenticated users to subscribe only to channels named after their own user_id (e.g. "user:<uid>")
-- or to use the system 'realtime' broadcast features they own.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Drop any existing permissive policies first (idempotent)
DROP POLICY IF EXISTS "authenticated_can_receive_own_user_topic" ON realtime.messages;
DROP POLICY IF EXISTS "authenticated_can_send_own_user_topic" ON realtime.messages;

-- Users may only receive realtime messages on a topic that contains their own user_id.
-- Application convention: topics should be named e.g. "user:<auth.uid>" or "lecture:<lecture_id>:<participant>"
-- For now we restrict to topics that explicitly include the user's UID.
CREATE POLICY "authenticated_can_receive_own_user_topic"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() LIKE '%' || auth.uid()::text || '%'
);

CREATE POLICY "authenticated_can_send_own_user_topic"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  realtime.topic() LIKE '%' || auth.uid()::text || '%'
);