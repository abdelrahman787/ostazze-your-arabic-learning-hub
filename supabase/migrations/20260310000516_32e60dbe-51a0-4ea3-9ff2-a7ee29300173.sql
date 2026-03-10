
-- Drop ALL restrictive policies and recreate as PERMISSIVE

-- user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- teacher_profiles
DROP POLICY IF EXISTS "Teacher profiles viewable by everyone" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can insert own profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can update own profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Admins can update any teacher profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Admins can delete teacher profiles" ON public.teacher_profiles;

CREATE POLICY "tp_select" ON public.teacher_profiles FOR SELECT USING (true);
CREATE POLICY "tp_insert" ON public.teacher_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tp_update_own" ON public.teacher_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tp_update_admin" ON public.teacher_profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "tp_delete_admin" ON public.teacher_profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- lectures
DROP POLICY IF EXISTS "Users can view their lectures" ON public.lectures;
DROP POLICY IF EXISTS "Admins can insert lectures" ON public.lectures;
DROP POLICY IF EXISTS "Admins can update lectures" ON public.lectures;
DROP POLICY IF EXISTS "Admins can delete lectures" ON public.lectures;

CREATE POLICY "lectures_select" ON public.lectures FOR SELECT TO authenticated USING (auth.uid() = student_id OR auth.uid() = teacher_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "lectures_insert" ON public.lectures FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "lectures_update" ON public.lectures FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "lectures_delete" ON public.lectures FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- chat_messages
DROP POLICY IF EXISTS "Lecture participants can view messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Lecture participants can send messages" ON public.chat_messages;

CREATE POLICY "chat_select" ON public.chat_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM lectures WHERE lectures.id = chat_messages.lecture_id AND (lectures.student_id = auth.uid() OR lectures.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "chat_insert" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM lectures WHERE lectures.id = chat_messages.lecture_id AND (lectures.student_id = auth.uid() OR lectures.teacher_id = auth.uid())));
