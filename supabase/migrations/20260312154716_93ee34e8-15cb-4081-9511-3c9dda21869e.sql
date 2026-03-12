-- Fix profiles_select: restrict to authenticated users only
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (true);

-- Fix profiles_insert: restrict to authenticated
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Fix profiles_update: restrict to authenticated
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix teacher_profiles select: restrict to authenticated
DROP POLICY IF EXISTS "tp_select" ON public.teacher_profiles;
CREATE POLICY "tp_select" ON public.teacher_profiles FOR SELECT TO authenticated USING (true);

-- Fix teacher_profiles insert: restrict to authenticated
DROP POLICY IF EXISTS "tp_insert" ON public.teacher_profiles;
CREATE POLICY "tp_insert" ON public.teacher_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Fix teacher_profiles update own: restrict to authenticated
DROP POLICY IF EXISTS "tp_update_own" ON public.teacher_profiles;
CREATE POLICY "tp_update_own" ON public.teacher_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Remove permissive notifications_insert (should only be done by triggers/service role)
DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;
