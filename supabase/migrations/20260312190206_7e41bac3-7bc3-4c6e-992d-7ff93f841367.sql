-- Allow teachers to insert lectures (for booking confirmation)
CREATE POLICY "lectures_insert_teacher" ON public.lectures FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = teacher_id);