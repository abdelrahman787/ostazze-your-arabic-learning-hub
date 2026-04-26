
-- Drop overly broad SELECT policies that allow listing
DROP POLICY IF EXISTS "Public can view chat audio" ON storage.objects;
DROP POLICY IF EXISTS "Public can read chat audio" ON storage.objects;
DROP POLICY IF EXISTS "chat_audio_public_read" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view chat audio" ON storage.objects;
DROP POLICY IF EXISTS "Public can view course covers" ON storage.objects;
DROP POLICY IF EXISTS "course_covers_public_read" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view course covers" ON storage.objects;

-- chat-audio: only lecture participants can read individual files (no listing)
CREATE OR REPLACE FUNCTION public.user_can_access_chat_audio(_name text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.chat_messages m
    JOIN public.lectures l ON l.id = m.lecture_id
    WHERE m.audio_url LIKE '%' || _name
      AND (l.student_id = auth.uid() OR l.teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  );
$$;

CREATE POLICY "chat_audio_participants_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-audio'
  AND public.user_can_access_chat_audio(name)
);

-- course-covers stays public-readable for direct file fetch but blocks listing.
-- We do this by requiring the request to specify a file name (i.e. octet_length(name) > 0 and no trailing slash) — Supabase still serves direct GETs through public URLs since bucket is public; this policy gates list/select via the API.
-- Simplest safe approach: only allow SELECT for individual paths matching a course cover reference.
CREATE OR REPLACE FUNCTION public.is_course_cover_path(_name text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.cover_image_url LIKE '%' || _name
  );
$$;

CREATE POLICY "course_covers_referenced_select"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'course-covers'
  AND public.is_course_cover_path(name)
);
