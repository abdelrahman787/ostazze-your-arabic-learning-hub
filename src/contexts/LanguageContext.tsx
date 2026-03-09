import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

type Lang = "ar" | "en";

const translations = {
  // Navbar
  nav_home: { ar: "الرئيسية", en: "Home" },
  nav_teachers: { ar: "المعلمين", en: "Teachers" },
  nav_categories: { ar: "التصنيفات", en: "Categories" },
  nav_subjects: { ar: "المواد", en: "Subjects" },
  nav_universities: { ar: "الجامعات", en: "Universities" },
  nav_login: { ar: "تسجيل الدخول", en: "Login" },
  nav_register: { ar: "إنشاء حساب", en: "Register" },
  nav_dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  nav_logout: { ar: "تسجيل الخروج", en: "Logout" },

  // Hero
  hero_badge: { ar: "منصة تعليمية متميزة", en: "Premium Learning Platform" },
  hero_title_1: { ar: "تعلّم مع", en: "Learn with the" },
  hero_title_2: { ar: "أفضل المعلمين", en: "Best Teachers" },
  hero_subtitle: { ar: "منصة تعليمية تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت", en: "An educational platform connecting you with the best private tutors for live online sessions" },
  hero_cta: { ar: "ابدأ الآن", en: "Get Started" },
  hero_browse: { ar: "تصفح المعلمين", en: "Browse Teachers" },
  hero_stat_teachers: { ar: "معلم", en: "Teachers" },
  hero_stat_students: { ar: "طالب", en: "Students" },
  hero_stat_rating: { ar: "تقييم", en: "Rating" },
  hero_certified: { ar: "معلمون معتمدون", en: "Certified Teachers" },
  hero_certified_sub: { ar: "من أفضل الجامعات", en: "Top Universities" },
  hero_live: { ar: "جلسات مباشرة", en: "Live Sessions" },
  hero_live_sub: { ar: "عبر Zoom", en: "Via Zoom" },

  // Why Choose Us
  why_title: { ar: "لماذا تختارنا؟", en: "Why Choose Us?" },
  why_subtitle: { ar: "تجربة تعليمية فريدة مع أفضل المعلمين وأدوات تفاعلية", en: "Experience unique learning with the best teachers and interactive tools" },
  why_teachers: { ar: "معلمون متميزون", en: "Quality Teachers" },
  why_teachers_desc: { ar: "معلمون معتمدون من أفضل الجامعات", en: "Certified teachers from top universities" },
  why_schedule: { ar: "مواعيد مرنة", en: "Flexible Schedule" },
  why_schedule_desc: { ar: "احجز جلستك في الوقت المناسب لك", en: "Book your session at your convenience" },
  why_remote: { ar: "تعلم عن بعد", en: "Learn Remotely" },
  why_remote_desc: { ar: "جلسات مباشرة عبر Zoom من أي مكان", en: "Live sessions via Zoom from anywhere" },

  // Teachers Section
  teachers_title: { ar: "المعلمون", en: "Teachers" },
  teachers_subtitle: { ar: "تعرف على نخبة من أفضل المعلمين", en: "Meet our top teachers" },
  teachers_view_all: { ar: "عرض الكل", en: "View All" },
  teachers_choose: { ar: "اختر معلمك المفضل وابدأ التعلم", en: "Choose your favorite teacher and start learning" },
  teacher_view_profile: { ar: "عرض الملف الشخصي", en: "View Profile" },
  teacher_per_session: { ar: "لكل جلسة", en: "per session" },
  teacher_verified: { ar: "موثق", en: "Verified" },
  teacher_not_found: { ar: "المعلم غير موجود", en: "Teacher not found" },
  teacher_back: { ar: "العودة للمعلمين", en: "Back to Teachers" },
  teacher_book: { ar: "احجز جلسة", en: "Book Session" },
  teacher_reviews: { ar: "تقييمات الطلاب", en: "Student Reviews" },
  teacher_availability: { ar: "أوقات الإتاحة", en: "Availability" },
  teacher_experience: { ar: "سنة خبرة", en: "Years Experience" },
  teacher_sessions: { ar: "جلسة", en: "Sessions" },
  teacher_review_count: { ar: "تقييم", en: "Reviews" },

  // Stats
  stats_teachers: { ar: "معلم معتمد", en: "Certified Teachers" },
  stats_students: { ar: "طالب نشط", en: "Active Students" },
  stats_sessions: { ar: "جلسة مكتملة", en: "Completed Sessions" },
  stats_rating: { ar: "متوسط التقييم", en: "Average Rating" },

  // Testimonials
  testimonials_title: { ar: "ماذا يقول طلابنا", en: "What Our Students Say" },
  testimonials_subtitle: { ar: "آراء الطلاب حول تجربتهم في المنصة", en: "Student feedback about their platform experience" },

  // CTA
  cta_title: { ar: "ابدأ رحلتك التعليمية اليوم", en: "Start Your Learning Journey Today" },
  cta_subtitle: { ar: "انضم إلى آلاف الطلاب الذين يتعلمون مع أفضل المعلمين في Ostazze", en: "Join thousands of students learning with the best teachers at Ostazze" },
  cta_register: { ar: "أنشئ حسابك مجاناً", en: "Create Free Account" },

  // Universities
  universities_title: { ar: "الجامعات", en: "Universities" },
  universities_subtitle: { ar: "اختر جامعتك للعثور على معلمين متخصصين", en: "Choose your university to find specialized teachers" },
  universities_view_subjects: { ar: "عرض المواد", en: "View Subjects" },

  // Subjects
  subjects_title: { ar: "المواد الدراسية", en: "Subjects" },
  subjects_subtitle: { ar: "اختر المادة التي تريد دراستها", en: "Choose the subject you want to study" },
  subjects_view_teachers: { ar: "عرض المعلمين", en: "View Teachers" },
  subjects_teacher_count: { ar: "معلم", en: "teachers" },

  // Categories
  categories_title: { ar: "التصنيفات الدراسية", en: "Categories" },
  categories_subtitle: { ar: "تصفح المواد حسب التخصص", en: "Browse subjects by specialization" },

  // Search & Filter
  search_placeholder: { ar: "بحث عن معلم...", en: "Search for a teacher..." },
  filter_btn: { ar: "تصفية", en: "Filter" },
  filter_sort: { ar: "الترتيب", en: "Sort" },
  filter_rating: { ar: "الأعلى تقييماً", en: "Highest Rated" },
  filter_price_low: { ar: "الأقل سعراً", en: "Lowest Price" },
  filter_price_high: { ar: "الأعلى سعراً", en: "Highest Price" },
  filter_reviews: { ar: "الأكثر تقييماً", en: "Most Reviewed" },
  showing_results: { ar: "عرض", en: "Showing" },
  of_results: { ar: "من", en: "of" },
  teacher_word: { ar: "معلم", en: "teacher" },

  // Login
  login_title: { ar: "تسجيل الدخول", en: "Login" },
  login_subtitle: { ar: "سجل دخولك للوصول إلى حسابك", en: "Sign in to access your account" },
  login_google: { ar: "تسجيل الدخول بجوجل", en: "Sign in with Google" },
  login_or: { ar: "أو", en: "or" },
  login_email: { ar: "البريد الإلكتروني", en: "Email" },
  login_password: { ar: "كلمة المرور", en: "Password" },
  login_forgot: { ar: "نسيت كلمة المرور؟", en: "Forgot password?" },
  login_submit: { ar: "دخول", en: "Sign In" },
  login_no_account: { ar: "ليس لديك حساب؟", en: "Don't have an account?" },
  login_register_now: { ar: "سجل الآن", en: "Register now" },
  login_error: { ar: "بيانات الدخول غير صحيحة", en: "Invalid credentials" },
  login_email_note: { ar: "ملاحظة: بعد التسجيل، ستحتاج لتأكيد بريدك الإلكتروني", en: "Note: After registration, you'll need to verify your email" },

  // Register
  register_title: { ar: "إنشاء حساب جديد", en: "Create New Account" },
  register_subtitle: { ar: "أنشئ حسابك وابدأ رحلة التعلم", en: "Create your account and start learning" },
  register_google: { ar: "التسجيل بجوجل", en: "Sign up with Google" },
  register_name: { ar: "الاسم الكامل", en: "Full Name" },
  register_password_hint: { ar: "8 أحرف على الأقل", en: "At least 8 characters" },
  register_confirm: { ar: "تأكيد كلمة المرور", en: "Confirm Password" },
  register_account_type: { ar: "نوع الحساب", en: "Account Type" },
  register_student: { ar: "طالب", en: "Student" },
  register_teacher: { ar: "معلم", en: "Teacher" },
  register_submit: { ar: "إنشاء حساب", en: "Create Account" },
  register_has_account: { ar: "لديك حساب بالفعل؟", en: "Already have an account?" },
  register_login: { ar: "سجل دخولك", en: "Sign in" },
  register_success_title: { ar: "تم إنشاء الحساب!", en: "Account Created!" },
  register_success_msg: { ar: "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. يرجى التحقق منه لتفعيل حسابك.", en: "A verification email has been sent to your inbox. Please verify to activate your account." },
  register_go_login: { ar: "الذهاب إلى تسجيل الدخول", en: "Go to Login" },

  // Forgot Password
  forgot_title: { ar: "نسيت كلمة المرور؟", en: "Forgot Password?" },
  forgot_subtitle: { ar: "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين", en: "Enter your email and we'll send you a reset link" },
  forgot_submit: { ar: "إرسال رابط إعادة التعيين", en: "Send Reset Link" },
  forgot_sent: { ar: "تم إرسال رابط إعادة تعيين كلمة المرور إلى", en: "A password reset link has been sent to" },
  forgot_back: { ar: "العودة لتسجيل الدخول", en: "Back to Login" },

  // Dashboard
  dash_overview: { ar: "نظرة عامة", en: "Overview" },
  dash_sessions: { ar: "جلساتي", en: "My Sessions" },
  dash_payments: { ar: "المدفوعات", en: "Payments" },
  dash_favorites: { ar: "المعلمون المفضلون", en: "Favorite Teachers" },
  dash_profile: { ar: "ملفي الشخصي", en: "My Profile" },
  dash_messages: { ar: "الرسائل", en: "Messages" },
  dash_notifications: { ar: "الإشعارات", en: "Notifications" },
  dash_settings: { ar: "الإعدادات", en: "Settings" },
  dash_search_teacher: { ar: "ابحث عن معلم", en: "Find a Teacher" },
  dash_total_sessions: { ar: "إجمالي الجلسات", en: "Total Sessions" },
  dash_upcoming: { ar: "الجلسات القادمة", en: "Upcoming Sessions" },
  dash_total_payments: { ar: "إجمالي المدفوعات", en: "Total Payments" },
  dash_given_rating: { ar: "التقييم المُعطى", en: "Given Rating" },
  dash_welcome: { ar: "مرحباً بك في Ostazze!", en: "Welcome to Ostazze!" },
  dash_welcome_sub: { ar: "ابدأ رحلتك التعليمية واحجز أول جلسة مع أفضل المعلمين", en: "Start your learning journey and book your first session with the best teachers" },
  dash_quick_actions: { ar: "إجراءات سريعة", en: "Quick Actions" },
  dash_recent_sessions: { ar: "آخر الجلسات", en: "Recent Sessions" },
  dash_edit_profile: { ar: "تعديل الملف الشخصي", en: "Edit Profile" },
  dash_change_password: { ar: "تغيير كلمة المرور", en: "Change Password" },
  dash_save: { ar: "حفظ التغييرات", en: "Save Changes" },
  dash_update_password: { ar: "تحديث كلمة المرور", en: "Update Password" },
  dash_full_name: { ar: "الاسم الكامل", en: "Full Name" },
  dash_phone: { ar: "رقم الهاتف", en: "Phone Number" },
  dash_bio: { ar: "نبذة", en: "Bio" },
  dash_current_password: { ar: "كلمة المرور الحالية", en: "Current Password" },
  dash_new_password: { ar: "كلمة المرور الجديدة", en: "New Password" },

  // Session Status
  status_all: { ar: "الكل", en: "All" },
  status_pending: { ar: "قيد الانتظار", en: "Pending" },
  status_confirmed: { ar: "مؤكدة", en: "Confirmed" },
  status_completed: { ar: "مكتملة", en: "Completed" },
  status_cancelled: { ar: "ملغية", en: "Cancelled" },
  action_rate: { ar: "تقييم", en: "Rate" },
  action_join: { ar: "انضم", en: "Join" },
  action_cancel: { ar: "إلغاء", en: "Cancel" },
  action_confirm: { ar: "تأكيد", en: "Confirm" },
  action_complete: { ar: "إكمال", en: "Complete" },

  // Table Headers
  th_teacher: { ar: "المعلم", en: "Teacher" },
  th_student: { ar: "الطالب", en: "Student" },
  th_subject: { ar: "المادة", en: "Subject" },
  th_date: { ar: "التاريخ", en: "Date" },
  th_price: { ar: "السعر", en: "Price" },
  th_status: { ar: "الحالة", en: "Status" },
  th_action: { ar: "الإجراء", en: "Action" },
  th_university: { ar: "الجامعة", en: "University" },
  th_subjects: { ar: "المواد", en: "Subjects" },
  th_actions: { ar: "الإجراءات", en: "Actions" },

  // Admin
  admin_title: { ar: "لوحة الإدارة", en: "Admin Dashboard" },
  admin_subtitle: { ar: "إدارة المعلمين والمشرفين والمحتوى", en: "Manage teachers, admins, and content" },
  admin_teachers: { ar: "المعلمون", en: "Teachers" },
  admin_admins: { ar: "المشرفون", en: "Admins" },
  admin_videos: { ar: "الفيديوهات", en: "Videos" },
  admin_content: { ar: "المحتوى", en: "Content" },
  admin_students: { ar: "الطلاب", en: "Students" },
  admin_revenue: { ar: "الإيرادات", en: "Revenue" },
  admin_add_teacher: { ar: "إضافة معلم", en: "Add Teacher" },
  admin_no_teachers: { ar: "لا يوجد معلمون", en: "No teachers found" },
  admin_verify: { ar: "توثيق", en: "Verify" },
  admin_delete: { ar: "حذف", en: "Delete" },
  admin_under_review: { ar: "قيد المراجعة", en: "Under Review" },
  admin_developing: { ar: "قسم قيد التطوير", en: "Section under development" },

  // Teacher Dashboard
  tdash_title: { ar: "لوحة تحكم المعلم", en: "Teacher Dashboard" },
  tdash_student_sessions: { ar: "جلسات الطلاب", en: "Student Sessions" },
  tdash_edit_profile: { ar: "تعديل الملف الشخصي", en: "Edit Profile" },
  tdash_availability: { ar: "مواعيد الإتاحة", en: "Availability" },
  tdash_earnings: { ar: "الأرباح", en: "Earnings" },
  tdash_today_sessions: { ar: "جلسات اليوم", en: "Today's Sessions" },
  tdash_total_earnings: { ar: "إجمالي الأرباح", en: "Total Earnings" },
  tdash_avg_rating: { ar: "متوسط التقييم", en: "Average Rating" },
  tdash_welcome: { ar: "مرحباً أيها المعلم!", en: "Welcome, Teacher!" },
  tdash_welcome_sub: { ar: "لديك 3 جلسات اليوم. تأكد من مراجعة جدولك.", en: "You have 3 sessions today. Make sure to review your schedule." },
  tdash_academic_title: { ar: "لقبك الأكاديمي", en: "Academic Title" },
  tdash_bio: { ar: "نبذة تعريفية", en: "Bio" },
  tdash_session_price: { ar: "سعر الجلسة (ر.س)", en: "Session Price (SAR)" },
  tdash_years_exp: { ar: "سنوات الخبرة", en: "Years of Experience" },
  tdash_zoom_link: { ar: "رابط Zoom", en: "Zoom Link" },
  tdash_save_schedule: { ar: "حفظ المواعيد", en: "Save Schedule" },
  tdash_to: { ar: "إلى", en: "to" },
  tdash_total_earnings_val: { ar: "إجمالي الأرباح: 6,750 ر.س", en: "Total Earnings: 6,750 SAR" },
  tdash_earnings_coming: { ar: "تفاصيل الأرباح ستتوفر قريباً", en: "Earnings details coming soon" },

  // Days
  day_sun: { ar: "الأحد", en: "Sunday" },
  day_mon: { ar: "الاثنين", en: "Monday" },
  day_tue: { ar: "الثلاثاء", en: "Tuesday" },
  day_wed: { ar: "الأربعاء", en: "Wednesday" },
  day_thu: { ar: "الخميس", en: "Thursday" },
  day_fri: { ar: "الجمعة", en: "Friday" },
  day_sat: { ar: "السبت", en: "Saturday" },

  // Booking
  booking_title: { ar: "حجز جلسة", en: "Book a Session" },
  booking_select_subject: { ar: "اختر المادة", en: "Select Subject" },
  booking_datetime: { ar: "تاريخ ووقت الجلسة", en: "Session Date & Time" },
  booking_notes: { ar: "ملاحظات للمعلم (اختياري)", en: "Notes for teacher (optional)" },
  booking_price: { ar: "سعر الجلسة", en: "Session Price" },
  booking_confirm: { ar: "تأكيد الحجز", en: "Confirm Booking" },
  booking_from5: { ar: "من 5", en: "out of 5" },

  // Footer
  footer_desc: { ar: "منصة تعليمية متميزة تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت.", en: "A premium educational platform connecting you with the best private tutors for live online sessions." },
  footer_quick_links: { ar: "روابط سريعة", en: "Quick Links" },
  footer_about: { ar: "من نحن", en: "About Us" },
  footer_contact: { ar: "تواصل معنا", en: "Contact Us" },
  footer_terms: { ar: "الشروط والأحكام", en: "Terms & Conditions" },
  footer_privacy: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  footer_contact_us: { ar: "تواصل معنا", en: "Contact Us" },
  footer_rights: { ar: "© 2026 Ostazze. جميع الحقوق محفوظة", en: "© 2026 Ostazze. All rights reserved" },

  // Common
  coming_soon: { ar: "قريباً", en: "Coming Soon" },
  coming_soon_desc: { ar: "هذا القسم قيد التطوير", en: "This section is under development" },
  user_word: { ar: "مستخدم", en: "User" },
  sar: { ar: "ر.س", en: "SAR" },
  mock_user_name: { ar: "مستخدم تجريبي", en: "Test User" },

  // Sections
  section_main: { ar: "الرئيسية", en: "Main" },
  section_as_student: { ar: "كطالب", en: "As Student" },
  section_account: { ar: "الحساب", en: "Account" },
  section_as_teacher: { ar: "كمعلم", en: "As Teacher" },

  // Footer location
  footer_location: { ar: "الرياض، المملكة العربية السعودية", en: "Riyadh, Saudi Arabia" },

  // 404
  not_found_title: { ar: "الصفحة غير موجودة", en: "Page not found" },
  not_found_desc: { ar: "عذراً! الصفحة التي تبحث عنها غير موجودة", en: "Oops! The page you're looking for doesn't exist" },
  not_found_back: { ar: "العودة للرئيسية", en: "Return to Home" },

  // Categories counts
  cat_subjects_count: { ar: "مادة", en: "subjects" },
  cat_subjects_count_plural: { ar: "مواد", en: "subjects" },

  // Teacher profile breadcrumb / misc
  teacher_about: { ar: "نبذة عن المعلم", en: "About the Teacher" },

  // Navbar home
  nav_home_link: { ar: "الرئيسية", en: "Home" },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  d: (obj: { ar: string; en: string } | string | undefined) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => translations[key]?.ar || key,
  d: (obj) => (typeof obj === "string" ? obj : obj?.ar || ""),
  dir: "rtl",
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("ostazze_lang");
    return (saved as Lang) || "ar";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem("ostazze_lang", lang);
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang, dir]);

  const toggleLang = useCallback(() => setLang((l) => (l === "ar" ? "en" : "ar")), []);

  const t = useCallback(
    (key: TranslationKey): string => translations[key]?.[lang] || key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};
