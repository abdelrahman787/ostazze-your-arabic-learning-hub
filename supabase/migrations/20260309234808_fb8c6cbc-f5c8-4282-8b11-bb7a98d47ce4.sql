-- Fix lectures restrictive policies - they should be permissive
DROP POLICY IF EXISTS "Users can view their lectures" ON public.lectures;
DROP POLICY IF EXISTS "Admins can insert lectures" ON public.lectures;
DROP POLICY IF EXISTS "Admins can update lectures" ON public.lectures;
DROP POLICY IF EXISTS "Admins can delete lectures" ON public.lectures;

CREATE POLICY "Users can view their lectures" ON public.lectures
FOR SELECT TO authenticated
USING (auth.uid() = student_id OR auth.uid() = teacher_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert lectures" ON public.lectures
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lectures" ON public.lectures
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lectures" ON public.lectures
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix chat_messages restrictive policies
DROP POLICY IF EXISTS "Lecture participants can view messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Lecture participants can send messages" ON public.chat_messages;

CREATE POLICY "Lecture participants can view messages" ON public.chat_messages
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM lectures
  WHERE lectures.id = chat_messages.lecture_id
  AND (lectures.student_id = auth.uid() OR lectures.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
));

CREATE POLICY "Lecture participants can send messages" ON public.chat_messages
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM lectures
    WHERE lectures.id = chat_messages.lecture_id
    AND (lectures.student_id = auth.uid() OR lectures.teacher_id = auth.uid())
  )
);

-- Fix profiles restrictive policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
FOR SELECT TO public USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT TO public WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO public USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete profiles" ON public.profiles
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix teacher_profiles restrictive policies
DROP POLICY IF EXISTS "Teacher profiles viewable by everyone" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Admins can update any teacher profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Admins can delete teacher profiles" ON public.teacher_profiles;

CREATE POLICY "Teacher profiles viewable by everyone" ON public.teacher_profiles
FOR SELECT TO public USING (true);

CREATE POLICY "Teachers can insert own profile" ON public.teacher_profiles
FOR INSERT TO public WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can update own profile" ON public.teacher_profiles
FOR UPDATE TO public USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any teacher profile" ON public.teacher_profiles
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete teacher profiles" ON public.teacher_profiles
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));