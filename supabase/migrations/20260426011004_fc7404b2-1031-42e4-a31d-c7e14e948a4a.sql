-- Allow public (anonymous) read of teacher_profiles for homepage display
CREATE POLICY "tp_select_public"
ON public.teacher_profiles
FOR SELECT
TO anon
USING (true);

-- Allow public (anonymous) read of profiles (basic public info shown on teacher cards)
CREATE POLICY "profiles_select_public"
ON public.profiles
FOR SELECT
TO anon
USING (true);