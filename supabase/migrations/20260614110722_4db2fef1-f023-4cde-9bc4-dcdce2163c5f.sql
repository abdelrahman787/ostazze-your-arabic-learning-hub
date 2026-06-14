
-- Allow teachers to update their own lecture rows
CREATE POLICY "lectures_update_teacher"
ON public.lectures
FOR UPDATE
TO authenticated
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);

-- Scope teacher_reviews update policy to authenticated only
DROP POLICY IF EXISTS teacher_reviews_update_own ON public.teacher_reviews;
CREATE POLICY teacher_reviews_update_own
ON public.teacher_reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);
