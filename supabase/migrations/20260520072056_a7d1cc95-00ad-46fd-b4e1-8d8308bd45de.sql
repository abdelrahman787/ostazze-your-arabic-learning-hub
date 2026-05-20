ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country text;
COMMENT ON COLUMN public.profiles.country IS 'ISO country code: EG, QA, KW';