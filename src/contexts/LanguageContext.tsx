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
  teacher_book: { ar: "اطلب جلسة", en: "Request Session" },
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
  register_title: { ar: "إنشاء حساب طالب", en: "Create Student Account" },
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
  register_timezone: { ar: "المنطقة الزمنية", en: "Timezone" },

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

  // Booking / Session Request
  booking_title: { ar: "طلب جلسة", en: "Request a Session" },
  booking_select_subject: { ar: "اختر المادة", en: "Select Subject" },
  booking_datetime: { ar: "تاريخ ووقت الجلسة", en: "Session Date & Time" },
  booking_notes: { ar: "ملاحظات (اختياري)", en: "Notes (optional)" },
  booking_price: { ar: "سعر الجلسة", en: "Session Price" },
  booking_confirm: { ar: "تأكيد الحجز", en: "Confirm Booking" },
  booking_from5: { ar: "من 5", en: "out of 5" },

  book_with: { ar: "طلب جلسة مع", en: "Request session with" },
  from_available: { ar: "من المواعيد المتاحة", en: "From available slots" },
  custom_appointment: { ar: "موعد مخصص", en: "Custom appointment" },
  choose_day: { ar: "اختر اليوم المناسب", en: "Choose suitable day" },
  choose_time: { ar: "اختر الوقت", en: "Choose time" },
  no_available_slots: { ar: "لا توجد مواعيد متاحة حالياً", en: "No available slots currently" },
  request_custom: { ar: "اطلب موعد مخصص ←", en: "Request custom slot →" },
  custom_note: { ar: "اختر التاريخ والوقت المناسب لك وسيتم إرسال الطلب للإدارة", en: "Choose your preferred date and time, and the request will be sent to administration" },
  the_subject: { ar: "المادة", en: "Subject" },
  the_date: { ar: "التاريخ", en: "Date" },
  the_time: { ar: "الوقت", en: "Time" },
  custom_reason: { ar: "ملاحظات إضافية (اختياري)", en: "Additional notes (optional)" },
  notes_optional: { ar: "ملاحظات (اختياري)", en: "Notes (optional)" },
  session_price: { ar: "سعر الجلسة", en: "Session Price" },
  confirm_booking_btn: { ar: "إرسال الطلب →", en: "Send Request →" },
  send_request_btn: { ar: "إرسال طلب الموعد →", en: "Send Appointment Request →" },
  sending: { ar: "جاري الإرسال...", en: "Sending..." },
  login_required: { ar: "يجب تسجيل الدخول أولاً", en: "You must login first" },
  select_date_time: { ar: "اختر التاريخ والوقت", en: "Select date and time" },
  booking_success: { ar: "تم إرسال طلب الجلسة بنجاح! ✅", en: "Session request sent successfully! ✅" },
  custom_booking_success: { ar: "تم إرسال طلب الموعد المخصص! ⏳", en: "Custom appointment request sent! ⏳" },
  slot_taken: { ar: "هذا الموعد محجوز بالفعل! اختر وقتاً آخر ⚠️", en: "This slot is already booked! Choose another time ⚠️" },
  custom_tag: { ar: "[موعد مخصص]", en: "[Custom appointment]" },

  // Booking manager
  no_bookings: { ar: "لا توجد طلبات", en: "No requests" },
  accept_btn: { ar: "قبول", en: "Accept" },
  reject_btn: { ar: "رفض", en: "Reject" },
  cancel_booking: { ar: "إلغاء الطلب", en: "Cancel Request" },
  enter_lecture: { ar: "دخول المحاضرة →", en: "Enter Lecture →" },
  reject_reason: { ar: "سبب الرفض (اختياري)...", en: "Rejection reason (optional)..." },
  confirm_reject: { ar: "تأكيد الرفض", en: "Confirm Rejection" },
  processing: { ar: "جاري...", en: "Processing..." },
  booking_accepted: { ar: "تم قبول الطلب وإنشاء المحاضرة ✅", en: "Request accepted and lecture created ✅" },
  booking_rejected: { ar: "تم رفض الطلب", en: "Request rejected" },
  booking_updated: { ar: "تم تحديث الطلب", en: "Request updated" },
  rejection_reason_label: { ar: "سبب الرفض:", en: "Rejection reason:" },

  // Booking status
  bstatus_pending: { ar: "قيد الانتظار", en: "Pending" },
  bstatus_confirmed: { ar: "مؤكد", en: "Confirmed" },
  bstatus_rejected: { ar: "مرفوض", en: "Rejected" },
  bstatus_cancelled: { ar: "ملغي", en: "Cancelled" },
  bstatus_completed: { ar: "مكتمل", en: "Completed" },
  bstatus_assigned: { ar: "تم التعيين", en: "Assigned" },

  // Teacher profile page
  no_reviews_yet: { ar: "لا توجد تقييمات حتى الآن", en: "No reviews yet" },
  no_teachers_registered: { ar: "لا يوجد معلمون مسجلون حالياً", en: "No registered teachers currently" },

  // Teacher dashboard profile
  academic_title: { ar: "اللقب الأكاديمي", en: "Academic Title" },
  academic_title_placeholder: { ar: "مثال: أستاذ مساعد", en: "e.g. Assistant Professor" },
  bio_label: { ar: "نبذة تعريفية", en: "Bio" },
  bio_placeholder: { ar: "اكتب نبذة عنك وخبراتك...", en: "Write about yourself and your experience..." },
  session_price_label: { ar: "سعر الجلسة", en: "Session Price" },
  years_experience: { ar: "سنوات الخبرة", en: "Years of Experience" },
  earnings_system_dev: { ar: "نظام الأرباح قيد التطوير وسيكون متاحاً قريباً", en: "Earnings system is under development and will be available soon" },
  session_label: { ar: "جلسة:", en: "Session:" },
  subject_word: { ar: "مادة", en: "Subject" },

  // Availability manager
  manage_availability: { ar: "إدارة أوقات التوفر", en: "Manage Availability" },
  add_time: { ar: "إضافة وقت", en: "Add Time" },
  no_times_set: { ar: "لا توجد أوقات محددة", en: "No times set" },
  to_word: { ar: "إلى", en: "to" },
  time_deleted: { ar: "تم حذف الوقت", en: "Time deleted" },
  schedule_saved: { ar: "تم حفظ الجدول بنجاح ✅", en: "Schedule saved successfully ✅" },
  save_error: { ar: "خطأ في الحفظ:", en: "Save error:" },
  saving: { ar: "جاري الحفظ...", en: "Saving..." },
  save_schedule: { ar: "حفظ الجدول", en: "Save Schedule" },

  // Footer
  footer_desc: { ar: "منصة تعليمية متميزة تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت.", en: "A premium educational platform connecting you with the best private tutors for live online sessions." },
  footer_quick_links: { ar: "روابط سريعة", en: "Quick Links" },
  footer_about: { ar: "من نحن", en: "About Us" },
  footer_contact: { ar: "تواصل معنا", en: "Contact Us" },
  footer_terms: { ar: "الشروط والأحكام", en: "Terms & Conditions" },
  footer_privacy: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  footer_contact_us: { ar: "تواصل معنا", en: "Contact Us" },
  footer_rights: { ar: "© 2026 Ostazze. جميع الحقوق محفوظة", en: "© 2026 Ostazze. All rights reserved" },
  footer_location: { ar: "الرياض، المملكة العربية السعودية", en: "Riyadh, Saudi Arabia" },

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

  // 404
  not_found_title: { ar: "الصفحة غير موجودة", en: "Page not found" },
  not_found_desc: { ar: "عذراً! الصفحة التي تبحث عنها غير موجودة", en: "Oops! The page you're looking for doesn't exist" },
  not_found_back: { ar: "العودة للرئيسية", en: "Return to Home" },

  // Categories counts
  cat_subjects_count: { ar: "مادة", en: "subjects" },
  cat_subjects_count_plural: { ar: "مواد", en: "subjects" },

  // Teacher profile breadcrumb
  teacher_about: { ar: "نبذة عن المعلم", en: "About the Teacher" },
  nav_home_link: { ar: "الرئيسية", en: "Home" },

  // Dashboard sidebar & labels
  sidebar_student_dashboard: { ar: "لوحة تحكم الطالب", en: "Student Dashboard" },
  sidebar_teacher_dashboard: { ar: "لوحة تحكم المعلم", en: "Teacher Dashboard" },
  sidebar_teaching: { ar: "التدريس", en: "Teaching" },
  sidebar_my_lectures: { ar: "محاضراتي", en: "My Lectures" },
  sidebar_my_lessons: { ar: "دروسي", en: "My Lessons" },
  sidebar_bookings: { ar: "الطلبات", en: "Requests" },
  sidebar_my_bookings: { ar: "طلباتي", en: "My Requests" },
  sidebar_available_times: { ar: "الأوقات المتاحة", en: "Available Times" },
  sidebar_my_earnings: { ar: "أرباحي", en: "My Earnings" },
  sidebar_profile: { ar: "الملف الشخصي", en: "Profile" },
  sidebar_find_teacher: { ar: "ابحث عن معلم", en: "Find a Teacher" },

  // Stats & overview
  stat_total_lectures: { ar: "إجمالي المحاضرات", en: "Total Lectures" },
  stat_num_teachers: { ar: "عدد المعلمين", en: "Number of Teachers" },
  stat_num_students: { ar: "عدد الطلاب", en: "Number of Students" },
  stat_conversations: { ar: "المحادثات", en: "Conversations" },
  stat_total_earnings: { ar: "إجمالي الأرباح", en: "Total Earnings" },
  stat_rating: { ar: "التقييم", en: "Rating" },

  // Welcome messages
  welcome_student: { ar: "مرحباً", en: "Welcome" },
  welcome_student_sub: { ar: "هنا يمكنك متابعة محاضراتك والتواصل مع معلميك.", en: "Here you can follow your lectures and communicate with your teachers." },
  welcome_teacher: { ar: "مرحباً أستاذ", en: "Welcome, Professor" },
  welcome_teacher_sub: { ar: "هنا يمكنك إدارة محاضراتك والتواصل مع طلابك.", en: "Here you can manage your lectures and communicate with your students." },

  // Quick actions & recent
  quick_actions: { ar: "إجراءات سريعة", en: "Quick Actions" },
  recent_lectures: { ar: "أحدث المحاضرات", en: "Recent Lectures" },
  view_all: { ar: "عرض الكل", en: "View All" },
  no_lectures_yet: { ar: "لا توجد محاضرات بعد", en: "No lectures yet" },
  no_lectures_recorded: { ar: "لا توجد محاضرات مسجلة بعد", en: "No recorded lectures yet" },
  lectures_added_by_admin: { ar: "سيتم إضافة المحاضرات من قبل الإدارة", en: "Lectures will be added by administration" },
  admin_adds_lectures: { ar: "سيقوم الأدمن بإضافة المحاضرات وربطها بك", en: "Admin will add lectures and link them to you" },
  the_teacher: { ar: "المعلم", en: "Teacher" },
  the_student: { ar: "الطالب", en: "Student" },

  // Lecture status
  video_available: { ar: "فيديو متاح", en: "Video available" },
  no_video: { ar: "بدون فيديو", en: "No video" },
  pdf_available: { ar: "PDF متاح", en: "PDF available" },
  no_file: { ar: "بدون ملف", en: "No file" },
  chat_word: { ar: "محادثة", en: "Chat" },

  // Sales Hub
  sales_hub: { ar: "مركز المبيعات", en: "Sales Hub" },
  sales_requests: { ar: "طلبات الجلسات", en: "Session Requests" },
  sales_stats: { ar: "الإحصائيات", en: "Statistics" },
  sales_payments: { ar: "المدفوعات", en: "Payments" },
  sales_assign_teacher: { ar: "تعيين معلم", en: "Assign Teacher" },
  sales_total_requests: { ar: "إجمالي الطلبات", en: "Total Requests" },
  sales_pending_requests: { ar: "طلبات معلقة", en: "Pending Requests" },
  sales_assigned_requests: { ar: "طلبات معيّنة", en: "Assigned Requests" },
  sales_completed_requests: { ar: "طلبات مكتملة", en: "Completed Requests" },
  sales_no_requests: { ar: "لا توجد طلبات جلسات بعد", en: "No session requests yet" },
  sales_assign: { ar: "تعيين", en: "Assign" },
  sales_assigned: { ar: "تم التعيين", en: "Assigned" },
  sales_select_teacher: { ar: "اختر المعلم", en: "Select Teacher" },
  sales_zoom_url: { ar: "رابط Zoom", en: "Zoom Link" },
  sales_confirm_assign: { ar: "تأكيد التعيين", en: "Confirm Assignment" },

  // My Lessons
  my_lessons: { ar: "دروسي", en: "My Lessons" },
  no_lessons: { ar: "لا توجد دروس مجدولة", en: "No scheduled lessons" },
  lesson_zoom: { ar: "دخول Zoom", en: "Join Zoom" },
  lesson_no_zoom: { ar: "لم يُضف رابط Zoom بعد", en: "No Zoom link added yet" },
  lesson_date: { ar: "التاريخ", en: "Date" },
  lesson_time: { ar: "الوقت", en: "Time" },

  // WhatsApp
  whatsapp_msg: { ar: "مرحباً، أريد الاستفسار عن خدمات أسطازي", en: "Hello, I'd like to inquire about Ostazze services" },

  // How It Works
  how_title: { ar: "كيف يعمل؟", en: "How It Works?" },
  how_subtitle: { ar: "ثلاث خطوات بسيطة لبدء رحلة التعلم", en: "Three simple steps to start your learning journey" },
  how_step1_title: { ar: "ابحث عن معلم", en: "Find a Teacher" },
  how_step1_desc: { ar: "تصفح قائمة المعلمين المعتمدين واختر المناسب لك حسب المادة والتقييم", en: "Browse our certified teachers and choose the right one by subject and rating" },
  how_step2_title: { ar: "احجز جلستك", en: "Book Your Session" },
  how_step2_desc: { ar: "اختر الموعد المناسب واحجز جلسة خصوصية مع المعلم مباشرة", en: "Pick a convenient time and book a private session directly with the teacher" },
  how_step3_title: { ar: "ابدأ التعلم", en: "Start Learning" },
  how_step3_desc: { ar: "انضم إلى الجلسة المباشرة عبر Zoom وابدأ التعلم مع أفضل المعلمين", en: "Join the live session via Zoom and start learning with the best teachers" },

  // Popular Subjects
  popular_title: { ar: "المواد الأكثر طلباً", en: "Most Popular Subjects" },
  popular_subtitle: { ar: "اكتشف المواد التي يدرسها آلاف الطلاب على منصتنا", en: "Discover subjects studied by thousands of students on our platform" },
  subj_math: { ar: "رياضيات", en: "Mathematics" },
  subj_physics: { ar: "فيزياء", en: "Physics" },
  subj_chemistry: { ar: "كيمياء", en: "Chemistry" },
  subj_english: { ar: "إنجليزي", en: "English" },
  subj_accounting: { ar: "محاسبة", en: "Accounting" },
  subj_statistics: { ar: "إحصاء", en: "Statistics" },
  subj_programming: { ar: "برمجة", en: "Programming" },
  subj_biology: { ar: "أحياء", en: "Biology" },

  // Hero search
  hero_search_placeholder: { ar: "ابحث عن مادة أو معلم...", en: "Search for a subject or teacher..." },

  // Footer newsletter
  footer_newsletter_title: { ar: "اشترك في النشرة البريدية", en: "Subscribe to Newsletter" },
  footer_newsletter_placeholder: { ar: "بريدك الإلكتروني", en: "Your email" },
  footer_newsletter_btn: { ar: "اشترك", en: "Subscribe" },

  // LectureView
  lecture_not_found: { ar: "المحاضرة غير موجودة", en: "Lecture not found" },
  lecture_access_denied: { ar: "ليس لديك صلاحية لعرض هذه المحاضرة", en: "You do not have permission to view this lecture" },
  go_back: { ar: "العودة", en: "Go Back" },
  audio_message: { ar: "رسالة صوتية", en: "Voice message" },
  hide_file: { ar: "إخفاء الملف", en: "Hide File" },
  show_file: { ar: "عرض الملف", en: "Show File" },
  hide_chat: { ar: "إخفاء المحادثة", en: "Hide Chat" },
  open_chat: { ar: "المحادثة", en: "Chat" },
  material_file: { ar: "ملف المادة", en: "Material File" },
  no_messages_yet: { ar: "لا توجد رسائل بعد. ابدأ المحادثة!", en: "No messages yet. Start the conversation!" },
  type_message: { ar: "اكتب رسالة...", en: "Type a message..." },
  join_zoom: { ar: "انضم عبر Zoom", en: "Join via Zoom" },
  zoom_link: { ar: "رابط Zoom متاح", en: "Zoom Link Available" },

  // Email verification
  email_not_verified_title: { ar: "بريدك الإلكتروني لم يتم تأكيده", en: "Your email is not verified" },
  email_not_verified_body: { ar: "يرجى التحقق من بريدك الإلكتروني والنقر على رابط التأكيد لتفعيل جميع الميزات.", en: "Please check your inbox and click the verification link to unlock all features." },
  resend_email: { ar: "إعادة إرسال رابط التأكيد", en: "Resend Verification Email" },
  email_resent: { ar: "تم إرسال رابط التأكيد مجدداً ✅", en: "Verification link resent ✅" },

  // Profile save
  profile_saved: { ar: "تم حفظ الملف الشخصي بنجاح ✅", en: "Profile saved successfully ✅" },
  password_changed: { ar: "تم تغيير كلمة المرور بنجاح ✅", en: "Password changed successfully ✅" },
  password_mismatch: { ar: "كلمة المرور الجديدة غير متطابقة", en: "New passwords do not match" },
  password_too_short: { ar: "كلمة المرور يجب أن تكون 8 أحرف على الأقل", en: "Password must be at least 8 characters" },
  current_password_wrong: { ar: "كلمة المرور الحالية غير صحيحة", en: "Current password is incorrect" },

  // Reviews
  rate_teacher: { ar: "تقييم المعلم", en: "Rate Teacher" },
  your_review: { ar: "تقييمك", en: "Your Review" },
  submit_review: { ar: "إرسال التقييم", en: "Submit Review" },
  review_comment_placeholder: { ar: "شارك تجربتك مع هذا المعلم...", en: "Share your experience with this teacher..." },
  review_submitted: { ar: "تم إرسال التقييم بنجاح ✅", en: "Review submitted successfully ✅" },
  review_login_required: { ar: "يجب تسجيل الدخول لتقديم تقييم", en: "You must be logged in to submit a review" },
  review_booking_required: { ar: "يجب إكمال جلسة مع هذا المعلم أولاً", en: "You must complete a session with this teacher first" },
  avg_rating: { ar: "متوسط التقييم", en: "Average Rating" },
  reviews_count_label: { ar: "تقييمات", en: "reviews" },
  already_reviewed: { ar: "لقد قدّمت تقييماً بالفعل", en: "You have already submitted a review" },

  // Admin search
  admin_search_placeholder: { ar: "بحث...", en: "Search..." },
  admin_fill_required_fields: { ar: "يرجى ملء جميع الحقول المطلوبة", en: "Please fill all required fields" },
  admin_enter_email: { ar: "يرجى إدخال البريد الإلكتروني", en: "Please enter an email address" },
  admin_role_added: { ar: "تمت إضافة الصلاحية بنجاح", en: "Role added successfully" },
  teacher_account_created: { ar: "تم إنشاء حساب المعلم بنجاح", en: "Teacher account created successfully" },
  lecture_added: { ar: "تمت إضافة المحاضرة بنجاح", en: "Lecture added successfully" },
  lecture_updated: { ar: "تم تحديث المحاضرة بنجاح", en: "Lecture updated successfully" },
  loading: { ar: "جاري التحميل...", en: "Loading..." },
  no_results: { ar: "لا توجد نتائج", en: "No results found" },

  // Pagination
  page_prev: { ar: "السابق", en: "Previous" },
  page_next: { ar: "التالي", en: "Next" },
  page_of: { ar: "من", en: "of" },
  page_label: { ar: "صفحة", en: "Page" },

  // MediaRecorder
  mic_not_supported: { ar: "التسجيل الصوتي غير مدعوم في هذا المتصفح", en: "Voice recording is not supported in this browser" },

  // About page
  about_title: { ar: "من نحن", en: "About Us" },
  about_subtitle: { ar: "تعرف على منصة أسطازي ورسالتنا التعليمية", en: "Learn about Ostazze and our educational mission" },
  about_mission_title: { ar: "رسالتنا", en: "Our Mission" },
  about_mission_desc: { ar: "نسعى لتوفير تعليم خصوصي عالي الجودة ومتاح للجميع، من خلال ربط الطلاب بأفضل المعلمين المعتمدين في مختلف التخصصات الأكاديمية عبر جلسات مباشرة عبر الإنترنت.", en: "We strive to provide high-quality, accessible private education by connecting students with the best certified teachers across various academic disciplines through live online sessions." },
  about_vision_title: { ar: "رؤيتنا", en: "Our Vision" },
  about_vision_desc: { ar: "أن نكون المنصة التعليمية الأولى في الشرق الأوسط التي تمكّن كل طالب من الوصول إلى تعليم متميز بغض النظر عن موقعه الجغرافي.", en: "To be the leading educational platform in the Middle East that empowers every student to access excellent education regardless of their location." },
  about_story_title: { ar: "قصتنا", en: "Our Story" },
  about_story_desc: { ar: "بدأت أسطازي كفكرة بسيطة: ماذا لو استطاع كل طالب جامعي الوصول إلى أفضل المعلمين في تخصصه؟ من هنا انطلقنا لبناء منصة تجمع بين التكنولوجيا الحديثة والخبرة الأكاديمية، لنقدم تجربة تعليمية فريدة تتجاوز حدود الجغرافيا والزمان.", en: "Ostazze started with a simple idea: what if every university student could access the best teachers in their field? From there, we set out to build a platform that combines modern technology with academic expertise, delivering a unique educational experience beyond the boundaries of geography and time." },
  about_values_title: { ar: "قيمنا", en: "Our Values" },
  about_value1_title: { ar: "الجودة", en: "Quality" },
  about_value1_desc: { ar: "نختار معلمينا بعناية لضمان أعلى مستوى من التعليم", en: "We carefully select our teachers to ensure the highest level of education" },
  about_value2_title: { ar: "الشغف", en: "Passion" },
  about_value2_desc: { ar: "نؤمن أن التعليم الحقيقي يبدأ من الشغف بالمعرفة", en: "We believe that true education starts from a passion for knowledge" },
  about_value3_title: { ar: "الوصول", en: "Accessibility" },
  about_value3_desc: { ar: "نجعل التعليم المتميز متاحاً للجميع من أي مكان", en: "We make excellent education accessible to everyone from anywhere" },
  about_value4_title: { ar: "الابتكار", en: "Innovation" },
  about_value4_desc: { ar: "نستخدم أحدث التقنيات لتقديم تجربة تعليمية متطورة", en: "We use the latest technologies to deliver an advanced learning experience" },
  about_stat_teachers: { ar: "معلم معتمد", en: "Certified Teachers" },
  about_stat_students: { ar: "طالب نشط", en: "Active Students" },
  about_stat_sessions: { ar: "جلسة مكتملة", en: "Completed Sessions" },
  about_stat_rating: { ar: "متوسط التقييم", en: "Average Rating" },

  // Contact page
  contact_title: { ar: "تواصل معنا", en: "Contact Us" },
  contact_subtitle: { ar: "نحن هنا لمساعدتك. تواصل معنا بأي طريقة تناسبك", en: "We're here to help. Reach out to us in any way that suits you" },
  contact_form_title: { ar: "أرسل لنا رسالة", en: "Send us a message" },
  contact_name: { ar: "الاسم", en: "Name" },
  contact_email: { ar: "البريد الإلكتروني", en: "Email" },
  contact_message: { ar: "الرسالة", en: "Message" },
  contact_send: { ar: "إرسال", en: "Send" },
  contact_success: { ar: "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً ✅", en: "Your message has been sent successfully! We'll contact you soon ✅" },
  contact_email_label: { ar: "البريد الإلكتروني", en: "Email" },
  contact_phone_label: { ar: "الهاتف", en: "Phone" },
  contact_location_label: { ar: "الموقع", en: "Location" },
  contact_whatsapp_label: { ar: "واتساب", en: "WhatsApp" },
  contact_whatsapp_value: { ar: "تواصل عبر واتساب", en: "Chat on WhatsApp" },

  // Terms page
  terms_title: { ar: "الشروط والأحكام", en: "Terms & Conditions" },
  terms_subtitle: { ar: "يرجى قراءة الشروط والأحكام بعناية قبل استخدام المنصة", en: "Please read the terms and conditions carefully before using the platform" },
  terms_last_updated: { ar: "آخر تحديث: أبريل 2026", en: "Last updated: April 2026" },
  terms_section1_title: { ar: "قبول الشروط", en: "Acceptance of Terms" },
  terms_section1_content: { ar: "باستخدامك لمنصة أسطازي، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.", en: "By using the Ostazze platform, you agree to be bound by these terms and conditions. If you do not agree to any of these terms, please do not use the platform." },
  terms_section2_title: { ar: "الحسابات والتسجيل", en: "Accounts & Registration" },
  terms_section2_content: { ar: "يجب عليك تقديم معلومات دقيقة وكاملة عند إنشاء حسابك. أنت مسؤول عن الحفاظ على سرية معلومات حسابك وعن جميع الأنشطة التي تتم تحت حسابك.", en: "You must provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account." },
  terms_section3_title: { ar: "الجلسات والحجوزات", en: "Sessions & Bookings" },
  terms_section3_content: { ar: "يتم حجز الجلسات من خلال المنصة حسب المواعيد المتاحة. يمكن إلغاء الجلسة قبل 24 ساعة من موعدها دون رسوم. الإلغاء بعد هذه المدة قد يترتب عليه رسوم.", en: "Sessions are booked through the platform based on available times. Sessions can be cancelled up to 24 hours before the scheduled time without fees. Cancellation after this period may incur charges." },
  terms_section4_title: { ar: "المدفوعات والاسترجاع", en: "Payments & Refunds" },
  terms_section4_content: { ar: "يتم الدفع مقدماً عند حجز الجلسة. في حال عدم حضور المعلم أو حدوث مشكلة تقنية من جانب المنصة، يحق لك استرجاع كامل المبلغ. طلبات الاسترجاع تتم خلال 7 أيام عمل.", en: "Payment is made upfront when booking a session. If the teacher does not attend or there is a technical issue from the platform's side, you are entitled to a full refund. Refund requests are processed within 7 business days." },
  terms_section5_title: { ar: "حقوق الملكية الفكرية", en: "Intellectual Property" },
  terms_section5_content: { ar: "جميع المحتويات المتاحة على المنصة، بما في ذلك النصوص والرسومات والشعارات، هي ملكية لأسطازي ومحمية بموجب قوانين حقوق الملكية الفكرية.", en: "All content available on the platform, including text, graphics, and logos, is the property of Ostazze and is protected by intellectual property laws." },
  terms_section6_title: { ar: "تعديل الشروط", en: "Modification of Terms" },
  terms_section6_content: { ar: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة.", en: "We reserve the right to modify these terms at any time. You will be notified of any material changes via email or through a notice on the platform." },

  // Privacy page
  privacy_title: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  privacy_subtitle: { ar: "كيف نجمع ونستخدم ونحمي معلوماتك الشخصية", en: "How we collect, use, and protect your personal information" },
  privacy_badge: { ar: "بياناتك محمية", en: "Your Data is Protected" },
  privacy_last_updated: { ar: "آخر تحديث: أبريل 2026", en: "Last updated: April 2026" },
  privacy_section1_title: { ar: "المعلومات التي نجمعها", en: "Information We Collect" },
  privacy_section1_content: { ar: "نجمع المعلومات التي تقدمها مباشرة عند التسجيل مثل الاسم والبريد الإلكتروني ورقم الهاتف والمنطقة الزمنية. كما نجمع معلومات الاستخدام تلقائياً مثل عنوان IP ونوع المتصفح وصفحات الموقع التي تزورها.", en: "We collect information you provide directly during registration such as name, email, phone number, and timezone. We also automatically collect usage information such as IP address, browser type, and pages you visit." },
  privacy_section2_title: { ar: "كيف نستخدم معلوماتك", en: "How We Use Your Information" },
  privacy_section2_content: { ar: "نستخدم معلوماتك لتقديم خدماتنا وتحسينها، والتواصل معك بشأن حسابك وجلساتك، وإرسال إشعارات مهمة، وتخصيص تجربتك على المنصة.", en: "We use your information to provide and improve our services, communicate with you about your account and sessions, send important notifications, and personalize your experience on the platform." },
  privacy_section3_title: { ar: "مشاركة المعلومات", en: "Information Sharing" },
  privacy_section3_content: { ar: "لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك مع مقدمي الخدمات الذين يساعدوننا في تشغيل المنصة، وذلك بموجب اتفاقيات سرية صارمة.", en: "We do not sell or rent your personal information to third parties. We may share your information with service providers who help us operate the platform, subject to strict confidentiality agreements." },
  privacy_section4_title: { ar: "ملفات تعريف الارتباط (Cookies)", en: "Cookies" },
  privacy_section4_content: { ar: "نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتذكر تفضيلاتك. يمكنك التحكم في إعدادات الكوكيز من خلال متصفحك.", en: "We use cookies to improve user experience and remember your preferences. You can control cookie settings through your browser." },
  privacy_section5_title: { ar: "حقوقك", en: "Your Rights" },
  privacy_section5_content: { ar: "لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها. يمكنك أيضاً طلب نسخة من بياناتك أو الاعتراض على معالجتها. للممارسة أي من هذه الحقوق، تواصل معنا عبر info@ostazze.com.", en: "You have the right to access, correct, or delete your personal information. You can also request a copy of your data or object to its processing. To exercise any of these rights, contact us at info@ostazze.com." },

  // Teachers empty state
  teachers_empty_title: { ar: "لا يوجد معلمون حالياً", en: "No Teachers Available" },
  teachers_empty_desc: { ar: "نعمل على إضافة أفضل المعلمين المعتمدين. تابعنا للحصول على آخر التحديثات!", en: "We're working on adding the best certified teachers. Follow us for the latest updates!" },
  teachers_loading_timeout: { ar: "يبدو أن التحميل يستغرق وقتاً. حاول تحديث الصفحة.", en: "Loading seems to be taking a while. Try refreshing the page." },

  // 404 improvements
  not_found_search_placeholder: { ar: "ابحث عن ما تريد...", en: "Search for what you need..." },
  not_found_quick_links: { ar: "أو جرب هذه الروابط:", en: "Or try these links:" },
  not_found_suggestion: { ar: "ممكن تكون بتدور على:", en: "You might be looking for:" },

  // Login improvements
  login_welcome_back: { ar: "مرحباً بعودتك! 👋", en: "Welcome back! 👋" },

  // Register improvements
  register_terms_agree: { ar: "أوافق على", en: "I agree to the" },
  register_and: { ar: "و", en: "and" },
  register_password_weak: { ar: "ضعيفة", en: "Weak" },
  register_password_medium: { ar: "متوسطة", en: "Medium" },
  register_password_strong: { ar: "قوية", en: "Strong" },

  // Breadcrumbs
  breadcrumb_home: { ar: "الرئيسية", en: "Home" },
  breadcrumb_countries: { ar: "الدول", en: "Countries" },
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

  const d = useCallback(
    (obj: { ar: string; en: string } | string | undefined): string => {
      if (!obj) return "";
      if (typeof obj === "string") return obj;
      return obj[lang] || obj.ar || "";
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, d, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};
