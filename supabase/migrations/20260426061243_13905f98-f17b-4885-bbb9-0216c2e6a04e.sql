-- ============================================
-- 1) PROFILES: تشديد كامل
-- إنشاء view عام يستثني الهاتف، وقفل SELECT على الجدول الأساسي
-- ============================================

-- إزالة سياسات SELECT الحالية المتساهلة
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;

-- سياسة SELECT جديدة مشددة: المالك أو الأدمن فقط
CREATE POLICY "profiles_select_owner_or_admin"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

-- إنشاء view عام بحقول آمنة فقط (بدون phone)
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT
  user_id,
  full_name,
  full_name_en,
  avatar_url,
  bio,
  bio_en,
  account_type,
  created_at
FROM public.profiles;

-- منح الوصول للـ view للجميع (الـ view يرث RLS المالك بسبب security_invoker
-- لكن نحتاج سياسة تسمح بقراءة العامة منه. سنستخدم سياسة منفصلة على الجدول
-- للحقول العامة فقط عبر view محمي)
-- بدلاً من ذلك، نسمح بالقراءة العامة على الـ view عبر SECURITY DEFINER function

-- إزالة view security_invoker واستبدالها بـ SECURITY DEFINER لقراءة الحقول الآمنة فقط
DROP VIEW IF EXISTS public.profiles_public;

CREATE OR REPLACE VIEW public.profiles_public AS
SELECT
  user_id,
  full_name,
  full_name_en,
  avatar_url,
  bio,
  bio_en,
  account_type,
  created_at
FROM public.profiles;

-- منح صلاحيات قراءة public على الـ view
GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- ============================================
-- 2) إزالة policies التي تسمح للـ anon بقراءة teacher_profiles كاملة
-- (الإبقاء على authenticated فقط للقراءة العامة على teacher_profiles لأنها بيانات معلمين منشورة)
-- ============================================
DROP POLICY IF EXISTS "tp_select_public" ON public.teacher_profiles;

-- ============================================
-- 3) إنشاء view عام لـ teacher_profiles (للزوار)
-- ============================================
CREATE OR REPLACE VIEW public.teacher_profiles_public AS
SELECT
  tp.id,
  tp.user_id,
  tp.university,
  tp.university_en,
  tp.subjects,
  tp.subjects_en,
  tp.price,
  tp.verified,
  tp.created_at,
  p.full_name,
  p.full_name_en,
  p.avatar_url,
  p.bio,
  p.bio_en
FROM public.teacher_profiles tp
LEFT JOIN public.profiles p ON p.user_id = tp.user_id;

GRANT SELECT ON public.teacher_profiles_public TO anon, authenticated;