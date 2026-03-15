
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name_en text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio_en text;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS subjects_en text[] DEFAULT '{}'::text[];
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS university_en text;
