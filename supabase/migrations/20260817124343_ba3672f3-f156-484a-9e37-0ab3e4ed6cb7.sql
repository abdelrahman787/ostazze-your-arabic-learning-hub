ALTER TABLE public.tutor_applications
  ADD COLUMN IF NOT EXISTS photo_file_path TEXT,
  ADD COLUMN IF NOT EXISTS use_photo_as_avatar BOOLEAN;