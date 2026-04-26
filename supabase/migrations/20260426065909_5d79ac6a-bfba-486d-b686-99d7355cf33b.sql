-- Replace the strict topic-based policies with ones that allow authenticated subscriptions.
-- Postgres-changes payloads are still filtered by the RLS on the source tables,
-- which already restrict per-user access on chat_messages, notifications,
-- session_requests, and course_enrollments.
DROP POLICY IF EXISTS "authenticated_can_receive_own_user_topic" ON realtime.messages;
DROP POLICY IF EXISTS "authenticated_can_send_own_user_topic" ON realtime.messages;

CREATE POLICY "authenticated_can_receive_realtime"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "authenticated_can_send_realtime"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (true);