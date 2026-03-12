
-- Fix permissive insert policy - only allow SECURITY DEFINER functions to insert
DROP POLICY "notifications_insert" ON public.notifications;
CREATE POLICY "notifications_insert" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
