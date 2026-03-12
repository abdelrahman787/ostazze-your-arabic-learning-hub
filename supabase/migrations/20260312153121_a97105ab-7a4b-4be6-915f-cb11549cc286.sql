
-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL, -- 'new_lecture', 'new_message'
  title text NOT NULL,
  body text,
  lecture_id uuid REFERENCES public.lectures(id) ON DELETE CASCADE,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "notifications_select" ON public.notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "notifications_update" ON public.notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Allow insert from triggers (service role) and authenticated for trigger functions
CREATE POLICY "notifications_insert" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow delete own notifications
CREATE POLICY "notifications_delete" ON public.notifications
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Function: notify when a new lecture is created
CREATE OR REPLACE FUNCTION public.notify_new_lecture()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Notify the student
  INSERT INTO public.notifications (user_id, type, title, body, lecture_id)
  VALUES (
    NEW.student_id,
    'new_lecture',
    'محاضرة جديدة: ' || NEW.title,
    COALESCE('المادة: ' || NEW.subject, 'تم إضافة محاضرة جديدة لك'),
    NEW.id
  );
  -- Notify the teacher
  INSERT INTO public.notifications (user_id, type, title, body, lecture_id)
  VALUES (
    NEW.teacher_id,
    'new_lecture',
    'محاضرة جديدة: ' || NEW.title,
    COALESCE('المادة: ' || NEW.subject, 'تم إضافة محاضرة جديدة لك'),
    NEW.id
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_lecture
  AFTER INSERT ON public.lectures
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_lecture();

-- Function: notify when a new chat message is sent
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  lec RECORD;
  recipient_id uuid;
  sender_name text;
BEGIN
  SELECT student_id, teacher_id, title INTO lec
  FROM public.lectures WHERE id = NEW.lecture_id;

  -- Determine recipient (the other person)
  IF NEW.sender_id = lec.student_id THEN
    recipient_id := lec.teacher_id;
  ELSE
    recipient_id := lec.student_id;
  END IF;

  SELECT full_name INTO sender_name
  FROM public.profiles WHERE user_id = NEW.sender_id LIMIT 1;

  INSERT INTO public.notifications (user_id, type, title, body, lecture_id)
  VALUES (
    recipient_id,
    'new_message',
    'رسالة جديدة في: ' || lec.title,
    COALESCE(sender_name, 'مستخدم') || ': ' || LEFT(NEW.content, 100),
    NEW.lecture_id
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_message
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_message();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
