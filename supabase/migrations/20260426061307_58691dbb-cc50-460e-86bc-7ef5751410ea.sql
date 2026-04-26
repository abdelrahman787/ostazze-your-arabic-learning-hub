-- إعادة إنشاء views بـ security_invoker لتفادي تحذير SECURITY DEFINER
DROP VIEW IF EXISTS public.profiles_public CASCADE;
DROP VIEW IF EXISTS public.teacher_profiles_public CASCADE;

-- استخدام security definer FUNCTIONS بدل views للوصول العام للحقول الآمنة
CREATE OR REPLACE FUNCTION public.get_public_profiles(_user_ids uuid[])
RETURNS TABLE (
  user_id uuid,
  full_name text,
  full_name_en text,
  avatar_url text,
  bio text,
  bio_en text,
  account_type text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.user_id,
    p.full_name,
    p.full_name_en,
    p.avatar_url,
    p.bio,
    p.bio_en,
    p.account_type
  FROM public.profiles p
  WHERE p.user_id = ANY(_user_ids);
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profiles(uuid[]) TO anon, authenticated;

-- دالة للحصول على ملف معلم بمعرّف واحد (للحقول العامة)
CREATE OR REPLACE FUNCTION public.get_public_profile(_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  full_name_en text,
  avatar_url text,
  bio text,
  bio_en text,
  account_type text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.user_id,
    p.full_name,
    p.full_name_en,
    p.avatar_url,
    p.bio,
    p.bio_en,
    p.account_type
  FROM public.profiles p
  WHERE p.user_id = _user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO anon, authenticated;

-- إعادة سياسة public select على teacher_profiles لكي يستطيع الزوار رؤية المعلمين
-- (هذا الجدول لا يحتوي بيانات شخصية حساسة - فقط الجامعة والمواد والسعر)
CREATE POLICY "tp_select_public_safe"
ON public.teacher_profiles
FOR SELECT
TO anon
USING (true);