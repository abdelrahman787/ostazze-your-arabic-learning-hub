# خطة التعديلات الجديدة (مستثنى منها كل ما أُنجز سابقًا)

ما تم سابقًا ولن يُعاد: routing الـ courses، PageHelmet مع OG/Twitter/canonical، JSON-LD لـ Organization/WebSite، GlobalSeo، NoIndex لصفحات auth/dashboard، CSP/Permissions/Referrer كـ meta، CookieConsent، Privacy/Terms الموسعة، honeypot + rate-limit في Register/Login، focus-visible، تباين الفوتر.

---

## 1) SEO – تخصيص أعمق لكل صفحة

- إضافة `PageHelmet` بمحتوى مخصص لكل route لا يحتوي عليه حاليًا، وتمرير `keywords` و`ogImage` مناسبة:
  - Universities, Categories, ForgotPassword, NotFound, TeacherProfile (ديناميكي بالاسم), CourseDetail (موجود – نتأكد ديناميكيته), Dashboard/SmartDashboard (noindex فقط).
- توحيد توليد canonical من `window.location.origin + pathname` (موجود في Helmet) وتمرير canonical صريح للصفحات الديناميكية (TeacherProfile, CourseDetail, Subjects بفلتر).
- توسيع `src/lib/seo.ts`:
  - `buildPersonJsonLd` للمعلم (Person + jobTitle + alumniOf).
  - `buildCourseJsonLd` (موجود – نضيف provider, inLanguage, offers).
  - `buildBreadcrumbJsonLd` يُستدعى داخل: Universities, Subjects, Categories, TeacherProfile, CourseDetail.
  - `buildFAQPageJsonLd` لاستخدامه في Contact/FAQ.

## 2) صفحة FAQ + ربطها بمسار التحويل

- إنشاء `src/pages/FAQ.tsx` تغطي: الحجز، الدفع، الاسترداد، الإلغاء، الجلسات المباشرة، المتطلبات التقنية، حسابات المعلم/الطالب.
- تسجيل route `/faq` في `App.tsx` وإضافته للفوتر و sitemap.
- حقن `FAQPage` JSON-LD داخلها.
- إضافة قسم FAQ مختصر (Accordion ٤–٦ أسئلة) داخل `Contact.tsx` + داخل صفحة `Categories` و`Subjects` كـ intro/FAQ block (يحسّن thin content).

## 3) Trust & Legal entity (Contact + Footer + Checkout)

- في `Contact.tsx`: إضافة بلوك "بيانات الجهة" يشمل: الاسم القانوني، رقم السجل (TODO نص قابل للتعديل من ترجمة)، ساعات العمل (Sun–Thu 9–6 KSA)، SLA للرد (≤ 24 ساعة عمل)، روابط Privacy/Terms/Refund.
- إضافة شريط مختصر "بقبولك إتمام الدفع توافق على الشروط وسياسة الاسترداد" مع روابط داخل `CheckoutReturn.tsx` وأي زر شراء في `CourseDetail.tsx` و`TeacherProfile.tsx` (نص فوق زر الدفع).

## 4) Social proof & اكتمال الصفحة الرئيسية

- في `Index.tsx`:
  - قسم "معلمون موثقون" — جلب أول 6 معلمين `verified=true` من Supabase وعرض بطاقاتهم (موجود partial – نضيف شارة "موثق" + رابط للملف).
  - شريط شعارات الجامعات (شبكة Logos مرنة من بيانات `allUniversities` بشكل تجريدي بصري بدون صور حقوقية: تجريد بأحرف + ألوان).
  - بلوك "أرقام المنصة" (عدد المعلمين/الجلسات/المواد) من جداول DB كحساب client-side.
  - بادج "تم التحقق من Ostaze" قرب الـ Hero CTA.
  - معالجة المساحات الفارغة: ضبط min-heights للأقسام التي تنتظر بيانات وإضافة skeletons موحدة.

## 5) Universities – إثراء المحتوى

- في `Universities.tsx` إضافة:
  - مقدمة نصية SEO (٢–٣ فقرات لكل دولة).
  - عدّاد الكليات/المواد لكل جامعة.
  - روابط داخلية: من الجامعة → صفحة `Subjects?university=...`، ومن الكلية → فلتر مواد.
  - FAQ block أسفل الصفحة (٣ أسئلة).
  - JSON-LD: `BreadcrumbList` + `CollectionPage`.

## 6) Subjects / Categories – تعميق المحتوى والربط الداخلي

- intro paragraph لكل صفحة (من ترجمات).
- Internal linking row: Category ↔ University ↔ Subject ↔ Teachers.
- FAQ مصغّر (٣ أسئلة) + JSON-LD `FAQPage`.

## 7) Auth hardening مرئي للمستخدم

- في `Register.tsx`: عرض متطلبات كلمة المرور (٨+، حرف كبير، رقم، رمز) كقائمة حية (موجود تحقق – نضيف checklist بصرية).
- في `Login.tsx`: نص تحت الفورم يوضح "حماية تلقائية ضد المحاولات المتكررة" + رابط استعادة + توضيح أن الجلسة تستخدم cookies آمنة (SameSite).
- ترجمات جديدة لكل ما سبق.

## 8) Refund visibility

- في `CourseDetail.tsx` و`TeacherProfile.tsx` (قبل زر الدفع): بلوك صغير "ضمان استرداد 14 يوم – بشروط" مع رابط `/refund`.
- في `CheckoutReturn.tsx`: ملخص شروط الاسترداد + بريد الدعم.

## 9) Backend / Hosting TODOs (تُوثّق ولا تُنفّذ في الكود)

- ضبط HTTP headers على الـ edge: `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, CSP حقيقي (الـ meta في index.html تكميلي فقط).
- تفعيل Leaked Password Protection في Supabase Auth.
- مراجعة CSRF: Supabase JS يعتمد على JWT في Header وليس Cookies افتراضيًا (لا حاجة لـ CSRF token تقليدي)، نوثّق ذلك في تعليق داخل `Login.tsx`.

---

## التفاصيل التقنية

ملفات جديدة:
- `src/pages/FAQ.tsx`
- `src/components/FaqAccordion.tsx` (مكوّن قابل لإعادة الاستخدام يدعم JSON-LD)
- `src/components/TrustBlock.tsx` (بيانات الجهة + ساعات + SLA)
- `src/components/RefundNote.tsx` (بلوك صغير قبل زر الشراء)
- `src/components/StatsBar.tsx` (أرقام المنصة)
- `src/components/UniversityLogosStrip.tsx`

ملفات معدّلة:
- `src/App.tsx` (route `/faq`)
- `src/lib/seo.ts` (Person, FAQPage, Breadcrumb helpers)
- `src/components/PageHelmet.tsx` (دعم `keywords` و`jsonLd[]`)
- `src/pages/Index.tsx` (verified tutors, logos strip, stats, trust badge, fix empty spaces)
- `src/pages/Universities.tsx` (intro + counts + internal links + FAQ + JSON-LD)
- `src/pages/Subjects.tsx`, `src/pages/Categories.tsx` (intro + FAQ + JSON-LD)
- `src/pages/Contact.tsx` (TrustBlock + FAQ مختصر + JSON-LD)
- `src/pages/CourseDetail.tsx`, `src/pages/TeacherProfile.tsx` (RefundNote قبل الدفع + JSON-LD ديناميكي)
- `src/pages/CheckoutReturn.tsx` (ملخص شروط)
- `src/pages/Login.tsx`, `src/pages/Register.tsx` (Checklist كلمة المرور + تنويه الحماية)
- `src/pages/ForgotPassword.tsx`, `src/pages/NotFound.tsx`, `src/pages/TeacherProfile.tsx` (PageHelmet مخصص)
- `src/components/Footer.tsx` (لينك FAQ)
- `src/contexts/LanguageContext.tsx` (ترجمات جديدة AR/EN لكل ما سبق)
- `public/sitemap.xml` (إضافة `/faq`)

ASCII لمخطط Trust في الصفحة الرئيسية:
```text
[Hero + Verified badge]
[Verified Tutors grid (6)]
[University logos strip]
[Stats bar: tutors / sessions / subjects]
[How it works (الموجود)]
[Testimonials (الموجود)]
[FAQ مختصر + CTA]
```

## افتراضات

- الاسم القانوني الفعلي ورقم السجل سيُمرَّران لاحقًا — هنترك placeholders قابلة للتعديل من الترجمات.
- لا حاجة لتغييرات DB؛ كل البيانات تُجلب من جداول قائمة (`teacher_profiles`, `subjects`, `lessons`).
- لن يُلمس CSP/Cookie/Privacy/Terms القائمة سابقًا.
- شعارات الجامعات ستُعرض كـ logos تجريدية (نص + لون) لتفادي قضايا حقوق الصور.

موافقتك تشغّل التنفيذ مباشرة.
