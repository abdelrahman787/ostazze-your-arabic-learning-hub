
-- Lectures table
CREATE TABLE public.lectures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text,
  teacher_id uuid NOT NULL,
  student_id uuid NOT NULL,
  video_url text,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- Students and teachers can view their own lectures
CREATE POLICY "Users can view their lectures"
  ON public.lectures FOR SELECT TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = teacher_id OR public.has_role(auth.uid(), 'admin'));

-- Admins can insert lectures
CREATE POLICY "Admins can insert lectures"
  ON public.lectures FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update lectures
CREATE POLICY "Admins can update lectures"
  ON public.lectures FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete lectures
CREATE POLICY "Admins can delete lectures"
  ON public.lectures FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_lectures_updated_at
  BEFORE UPDATE ON public.lectures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Chat messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id uuid NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users in the lecture can view messages
CREATE POLICY "Lecture participants can view messages"
  ON public.chat_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lectures
      WHERE lectures.id = chat_messages.lecture_id
      AND (lectures.student_id = auth.uid() OR lectures.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- Users in the lecture can send messages
CREATE POLICY "Lecture participants can send messages"
  ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.lectures
      WHERE lectures.id = chat_messages.lecture_id
      AND (lectures.student_id = auth.uid() OR lectures.teacher_id = auth.uid())
    )
  );

-- Enable realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Storage buckets for videos and PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('lecture-videos', 'lecture-videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('lecture-pdfs', 'lecture-pdfs', true);

-- Storage policies - admins can upload
CREATE POLICY "Admins can upload videos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lecture-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload pdfs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lecture-pdfs' AND public.has_role(auth.uid(), 'admin'));

-- Anyone authenticated can view
CREATE POLICY "Authenticated can view lecture videos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'lecture-videos');

CREATE POLICY "Authenticated can view lecture pdfs"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'lecture-pdfs');

-- Public can view (since buckets are public)
CREATE POLICY "Public can view lecture videos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'lecture-videos');

CREATE POLICY "Public can view lecture pdfs"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'lecture-pdfs');
