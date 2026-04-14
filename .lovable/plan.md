

# تطبيق نظام ألوان "الطاقة الدافئة" + تحسين الحركات

## ملخص
تحديث نظام الألوان ليعتمد على الباليت الجديد (Primary #E84E0F, Secondary #1B2A4A, Accent #10B981) مع تحسين الحركات والتفاعلات البصرية.

---

## التغييرات المطلوبة

### 1. تحديث متغيرات الألوان في `src/index.css`
- تحديث `--primary` ليطابق #E84E0F (hsl 14 91% 49%)
- إضافة `--accent-green` للون #10B981
- تحديث `--background` ليطابق #FFF8F0 (surface دافئ)
- تحديث `--secondary` للون #1B2A4A الكحلي
- إضافة `--gradient-hero` كمتغير CSS
- تحديث ألوان الوضع الداكن لتتناسب مع الباليت الجديد

### 2. تحسين Hero Section في `src/pages/Index.tsx`
- إضافة radial gradient خفيف في خلفية Hero (`::before` pseudo-element)
- تطبيق gradient text على أرقام الإحصائيات في قسم Stats
- إضافة تأثير hover glow للـ CTA button (shadow برتقالي)

### 3. تحسين الحركات في `src/index.css`
- إضافة keyframes جديدة: `fadeInUp` (40px), `scaleInBounce`
- إضافة `.cta-button` class مع hover lift + glow shadow
- إضافة `.feature-card` class مع hover lift + scale + border glow
- إضافة FAB pulse animation
- تغليف كل الحركات بـ `@media (prefers-reduced-motion: no-preference)`

### 4. تحسين البطاقات في `src/pages/Index.tsx`
- تطبيق hover:scale(1.02) + translateY(-8px) على بطاقات "لماذا تختارنا"
- إضافة border glow برتقالي عند hover
- تطبيق gradient text على أرقام Stats بدلاً من اللون الأبيض العادي

### 5. تحسين Footer في `src/components/Footer.tsx`
- تحديث خلفية الفوتر لاستخدام gradient داكن بدلاً من لون مسطح
- إضافة pattern/texture خفيف

### 6. تحسين Navbar في `src/components/Navbar.tsx`
- تأكيد backdrop blur موجود
- إضافة shadow خفيف عند التمرير

---

## الملفات المتأثرة
- `src/index.css` — متغيرات ألوان + keyframes + utility classes
- `src/pages/Index.tsx` — تطبيق الأنماط الجديدة على الأقسام
- `src/components/Footer.tsx` — gradient background
- `tailwind.config.ts` — لا تغيير (نستخدم CSS variables الموجودة)

## ملاحظات
- لن نغير بنية tailwind.config.ts لاستخدام CSS vars مباشرة كما في الاقتراح — النظام الحالي يعتمد HSL variables وهو أفضل. سنحدث القيم فقط.
- سنحافظ على Framer Motion للحركات الأساسية ونضيف CSS animations للتفاعلات الصغيرة.

