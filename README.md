# Ostazze: Your Arabic Learning Hub

Build a full-stack Arabic online tutoring marketplace platform called "OSTAZZE" 
using React + TypeScript + Tailwind CSS + Supabase.

The platform connects students with private tutors for live online sessions via Zoom.
The entire UI must be in Arabic (RTL direction - dir="rtl").

════════════════════════════════════════
🎨 DESIGN SYSTEM & COLORS
════════════════════════════════════════

Primary Color:     #ea580c  (orange-600)
Primary Dark:      #c2410c  (orange-700)
Primary Light:     #fed7aa  (orange-200)
Background:        #fafafa
Card Background:   #ffffff
Text Primary:      #1e293b
Text Muted:        #64748b
Border:            #e2e8f0
Success:           #16a34a
Danger:            #dc2626
Warning:           #d97706

Dark Mode:
  Background:      #0f172a
  Card:            #1e293b
  Text:            #f1f5f9
  Border:          #334155

Font: "Tajawal" from Google Fonts (weights: 400, 500, 700, 800, 900)
Import: https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap

Border Radius: 12px (cards), 10px (inputs), 20px (badges), 50% (avatars)
Shadow: 0 2px 16px rgba(0,0,0,0.07)  (normal), 0 8px 32px rgba(0,0,0,0.12) (hover)
Transition: all 0.2s ease

════════════════════════════════════════
🗂️ PAGES TO BUILD
════════════════════════════════════════

1. Homepage  /
2. Teachers List  /teachers
3. Teacher Profile  /teachers/:id
4. Subjects  /subjects
5. Categories  /categories
6. Universities  /universities
7. Login  /login
8. Register  /register
9. Forgot Password  /forgot-password
10. Student Dashboard  /dashboard
11. Teacher Dashboard  /dashboard/teacher
12. Admin Panel  /admin

════════════════════════════════════════
🧱 COMPONENT: NAVBAR
════════════════════════════════════════

Sticky top navbar, RTL layout, white background with blur backdrop.
Height: 64px. Border-bottom: 1px solid #e2e8f0.

LEFT SIDE (in RTL = right side visually):
- Logo: "OSTAZZE" text, orange color #ea580c, font-weight 900, font-size 1.5rem
  with a small graduation cap emoji 🎓 before it

CENTER:
Navigation links (right to left in RTL):
  - الجامعات  → /universities
  - المواد    → /subjects
  - التصنيفات → /categories
  - المعلمين  → /teachers
Each link: padding 8px 14px, border-radius 8px
Hover: background #fed7aa, color #c2410c
Active: color #ea580c, font-weight 700

RIGHT SIDE (in RTL = left side visually):
- 🌙 Dark mode toggle button (icon button, 38x38px, rounded-10)
- 🌐 Language toggle button
- IF NOT LOGGED IN:
  - "تسجيل الدخول" button → outlined style, border #ea580c, color #ea580c
  - "إنشاء حساب" button → filled orange #ea580c, white text, border-radius 10px
- IF LOGGED IN:
  - User avatar circle (initials or photo)
  - "لوحة التحكم" button → filled orange
  - Logout icon button 🚪

Mobile: hamburger menu (3 lines), slides down nav links

════════════════════════════════════════
🏠 PAGE 1: HOMEPAGE
════════════════════════════════════════

── HERO SECTION ──
Background: linear-gradient(135deg, #fff7ed 0%, #fef3e2 50%, #ffffff 100%)
Height: 85vh minimum
Layout: CSS Grid, 2 columns (text left, image right - reversed in RTL)
Padding: 60px 0

LEFT COLUMN (hero text):
  Badge (top):
    Background: #fed7aa, color: #c2410c
    Text: "🎓 منصة تعليمية متميزة"
    Padding: 6px 16px, border-radius: 20px, font-weight: 700
    margin-bottom: 20px

  H1 Title:
    "تعلّم مع أفضل المعلمين"
    Font-size: 3rem, font-weight: 900, line-height: 1.3
    The word "أفضل المعلمين" in orange color #ea580c

  Subtitle paragraph:
    "منصة تعليمية تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت"
    Color: #64748b, font-size: 1.1rem, line-height: 1.8
    margin-bottom: 36px

  CTA Buttons (flex row, gap 12px):
    Button 1: "ابدأ الآن ←"  → filled orange, large, links to /teachers
    Button 2: "تصفح المعلمين" → outlined orange, large, links to /teachers

  Stats Row (flex, gap 32px, margin-top 40px):
    Stat 1: Number "+200" (orange, bold 900, 2rem) + Label "معلم معتمد" (muted, small)
    Stat 2: Number "+5K"  + Label "طالب نشط"
    Stat 3: Number "4.9"  + Label "تقييم عام"

RIGHT COLUMN (hero image):
  Image: a photo of students studying together, border-radius: 20px, box-shadow heavy
  Use a placeholder from https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80
  
  Floating Card 1 (top right, absolute positioned):
    White card, rounded-12, padding 12px 16px, shadow
    Contains: green dot (8px circle #16a34a) + "معلمون معتمدون" bold + 
    "من أفضل الجامعات" muted small + 🎓 emoji
  
  Floating Card 2 (bottom left, absolute positioned):
    White card, rounded-12, padding 12px 16px, shadow
    Contains: 📹 green + "جلسات مباشرة" bold + "عبر Zoom" muted small

── HOW IT WORKS SECTION ──
Background: #f8fafc
Padding: 80px 0
Title: "كيف يعمل Ostazze؟" (center, font-size 2rem, font-weight 800)
Subtitle: "ابدأ رحلتك التعليمية في 3 خطوات بسيطة" (center, muted)

3 Cards Grid (3 columns, gap 24px):
  Each card: white, rounded-16, padding 36px 24px, text-center, border 1px solid #e2e8f0, shadow hover effect

  Card 1:
    Emoji: 🔍 (3rem)
    Number: "01" (2rem, orange, font-weight 900)
    Title: "ابحث عن معلم" (font-weight 800)
    Desc: "تصفح مئات المعلمين المتخصصين وفلتر حسب المادة أو السعر أو التقييم"

  Card 2:
    Emoji: 📅 (3rem)
    Number: "02"
    Title: "احجز جلسة"
    Desc: "اختر الوقت المناسب من جدول المعلم واحجز جلستك الخاصة بسهولة"

  Card 3:
    Emoji: 🎯 (3rem)
    Number: "03"
    Title: "تعلم وتقدم"
    Desc: "التقِ بمعلمك عبر Zoom وابدأ جلستك التعليمية المباشرة الاحترافية"

── CATEGORIES SECTION ──
Title: "التصنيفات الدراسية"
Subtitle: "تصفح المواد حسب التخصص"
4-column grid (responsive: 2 on tablet, 1 on mobile)

Each Category Card:
  Border: 1px solid #e2e8f0, rounded-16, padding 28px 20px, text-center
  Cursor pointer, hover: border-color orange, shadow, translateY(-4px)
  Icon (emoji, 2.4rem) + Name (bold 1rem) + Count (muted small)

8 Categories with data:
  { icon: "⚙️", name: "الهندسة", count: "15 مادة" }
  { icon: "🏥", name: "الطب والصحة", count: "12 مادة" }
  { icon: "💻", name: "علوم الحاسب", count: "18 مادة" }
  { icon: "📐", name: "الرياضيات", count: "9 مواد" }
  { icon: "📊", name: "إدارة الأعمال", count: "11 مادة" }
  { icon: "🌍", name: "اللغات", count: "8 مواد" }
  { icon: "🔬", name: "العلوم الأساسية", count: "10 مواد" }
  { icon: "⚖️", name: "القانون", count: "7 مواد" }

── FEATURED TEACHERS SECTION ──
Title: "المعلمون المميزون"
3-column grid of Teacher Cards (see Teacher Card component below)
Show 6 teachers maximum
Below grid: "عرض جميع المعلمين →" outlined orange button centered

── STATS BANNER ──
Background: linear-gradient(135deg, #ea580c, #f97316)
Color: white, text-center
4-column grid:
  "+200" / "معلم معتمد"
  "+5,000" / "طالب نشط"  
  "+12,000" / "جلسة مكتملة"
  "4.9/5" / "متوسط التقييم"
Each number: 2.5rem font-weight 900, label: opacity 0.9

── TESTIMONIALS SECTION ──
Background: #f8fafc
3 testimonial cards, each with:
  - 5 orange stars ★★★★★
  - Quote text (muted, 0.92rem, line-height 1.8)
  - Student avatar (initials circle) + name + university

── CTA SECTION ──
Background: linear-gradient(135deg, #1e293b, #0f172a)
Color: white, text-center
H2: "ابدأ رحلتك التعليمية اليوم" (2.2rem, 900)
P: "انضم إلى آلاف الطلاب الذين يتعلمون مع أفضل المعلمين في Ostazze"
Buttons: "أنشئ حسابك مجاناً" (orange filled) + "تصفح المعلمين" (transparent border)

── FOOTER ──
Background: #1e293b
Color: #94a3b8
3-column grid:

Column 1 (wider):
  Logo: "🎓 OSTAZZE" in orange
  Description text
  Social buttons: Facebook [f] + LinkedIn [in] + X [𝕏]
  Each social: 36x36 rounded-8, rgba(255,255,255,0.1) bg, hover orange

Column 2 "روابط سريعة":
  - الجامعات
  - المواد
  - المعلمين
  - التصنيفات

Column 3 "من نحن":
  - من نحن
  - تواصل معنا
  - الشروط والأحكام
  - سياسة الخصوصية

Footer bottom: thin line + "© 2026 Ostazze. جميع الحقوق محفوظة"

════════════════════════════════════════
👨‍🏫 COMPONENT: TEACHER CARD
════════════════════════════════════════

White card, rounded-16, border 1px #e2e8f0
Hover: translateY(-4px), heavy shadow

CARD HEADER (padding 24px, flex gap 16px):
  Avatar Circle (64x64px, rounded-full):
    Background: linear-gradient(135deg, #ea580c, #f97316)
    White text, font-weight 800
    Shows first 2 initials of teacher name
    OR shows teacher photo if available
  
  Info:
    Name (font-weight 800, 1rem)
    Verified badge IF verified: "✓ موثق" in blue (#2563eb, small)
    Title/Specialty (muted, 0.85rem, line-height 1.5)

SUBJECTS TAGS (padding 0 24px, flex wrap, gap 8px, margin-bottom 16px):
  Each tag: background #fed7aa, color #c2410c, padding 4px 12px, 
  border-radius 20px, font-size 0.8rem, font-weight 600
  Show max 2-3 subjects

CARD FOOTER (padding 16px 24px, border-top 1px #e2e8f0, flex between, bg #fafafa):
  LEFT: Price
    Main: "150 ر.س" (1.1rem, font-weight 800, orange)
    Sub: "/ جلسة" (0.8rem, muted)
  
  RIGHT: Rating
    ★ star (orange #f59e0b)
    Score: "4.9" (font-weight 700)
    Count: "(156)" (muted, 0.87rem)

BUTTON (padding 0 24px 20px):
  "عرض الملف الشخصي ↗" → full width orange button

════════════════════════════════════════
📄 PAGE 2: TEACHERS LIST  /teachers
════════════════════════════════════════

Page header section:
  Background: linear-gradient(135deg, #fff7ed, #fef3e2)
  H1: "المعلمون" (2.2rem, 900)
  P: "اختر معلمك المفضل" (muted)

Search & Filter Bar (white card, rounded-16, padding 24px, shadow):
  Row 1: Search input (flex-1) + "⚙️ تصفية" button
  
  Search input:
    Has 🔍 icon on right side (RTL)
    Placeholder: "بحث عن معلم..."
    Border: 2px solid #e2e8f0, rounded-12, padding 10px 40px 10px 14px
    Focus: border-color orange
  
  Filter Row (shows on toggle, flex wrap gap 12px):
    Select 1: "كل المواد" (subjects dropdown)
    Select 2: "أدنى سعر" → options: 50, 100, 150, 200 ر.س
    Select 3: "أعلى سعر" → options: 100, 200, 300, 500 ر.س
    Select 4: "التقييم" → 4+، 4.5+، 5 نجوم
    Select 5: "الترتيب" → الأعلى تقييماً، الأقل سعراً، الأعلى سعراً، الأكثر تقييماً
    
    Each select: padding 8px 14px, border 2px #e2e8f0, rounded-10, bg white

Results text: "عرض X من Y معلم" (muted, 0.9rem)

Teachers Grid: 3 columns (responsive: 2 tablet, 1 mobile)
Using Teacher Card component above

Pagination:
  Row of page number buttons, centered, gap 6px
  Each: 38x38px, rounded-8, border 2px #e2e8f0
  Active/hover: orange bg, white text

Populate with these 6 mock teachers:
  1. { name: "د. أحمد الراشد", title: "دكتوراه في الرياضيات من MIT. أكثر من 10 سنوات خبرة", subjects: ["التفاضل والتكامل", "الإحصاء"], price: 150, currency: "ر.س", rating: 4.9, reviews: 156, verified: true }
  2. { name: "د. فاطمة الخالد", title: "أستاذ مشارك في علوم الحاسب. متخصصة في هياكل البيانات", subjects: ["أساسيات البرمجة", "هياكل البيانات"], price: 180, rating: 4.8, reviews: 142, verified: true }
  3. { name: "د. محمد السعود", title: "طبيب متخصص في علم التشريح ووظائف الأعضاء", subjects: ["الكيمياء العضوية", "علم التشريح"], price: 200, rating: 4.7, reviews: 98, verified: false }
  4. { name: "د. سارة القاسم", title: "أستاذة إدارة أعمال مع خبرة استشارية عملية", subjects: ["المحاسبة المالية", "التسويق"], price: 160, rating: 4.9, reviews: 187, verified: true }
  5. { name: "د. خالد المنصور", title: "باحث ومعلم في الفيزياء. نشر أكثر من 30 ورقة بحثية", subjects: ["الفيزياء", "التفاضل والتكامل"], price: 170, rating: 4.8, reviews: 134, verified: true }
  6. { name: "د. نورة الحربي", title: "متخصصة في الإحصاء مع التركيز على التطبيقات العملية", subjects: ["الإحصاء", "أساسيات البرمجة"], price: 140, rating: 4.7, reviews: 89, verified: false }

════════════════════════════════════════
👤 PAGE 3: TEACHER PROFILE  /teachers/:id
════════════════════════════════════════

2-column layout (left column wider):

LEFT COLUMN — Profile Card:
  Big Avatar (80x80px circle, initials, orange gradient)
  Name (1.4rem, 900) + Verified badge + Featured badge if applicable
  Title/specialty (muted, 0.9rem)
  University badge: "🎓 جامعة الملك سعود" (blue badge)
  
  Stats Row (flex, gap 24px, margin-bottom 20px):
    ★ Rating: "4.9" large (1.5rem, 900, #f59e0b) + "156 تقييم" small muted
    Sessions: "234" (1.5rem, 900, orange) + "جلسة" small muted
    Experience: "10" (1.5rem, 900) + "سنة خبرة" small muted
  
  Bio: paragraph text, muted, line-height 1.8
  
  Subjects Tags: same style as in teacher card
  
  Price Box + Book Button (flex row):
    Price box: bg #fafafa, rounded-10, padding 14px, text-center
      "150 ر.س" (1.3rem, 900, orange)
      "لكل جلسة" (0.8rem, muted)
    Book button: "احجز جلسة →" (flex-1, large orange filled button)
  
  Availability Section (below price):
    Title: "أوقات الإتاحة"
    Days list with time slots:
      الأحد: 9:00 - 17:00
      الثلاثاء: 9:00 - 17:00
      الخميس: 14:00 - 20:00

RIGHT COLUMN — Reviews Card:
  Title: "تقييمات الطلاب (156)"
  
  Rating Summary Bar (large):
    "4.9 ★" big + "من 5" muted
    Star distribution bars (5★ 80%, 4★ 15%, 3★ 5%)
  
  Individual Reviews List:
    Each review:
      Avatar (36x36 circle with initials) + Name (bold) + Date (muted right)
      Stars ★★★★★
      Comment text (muted, 0.9rem)
    
    Show 5 reviews from data

BOOKING MODAL (triggers on "احجز جلسة"):
  Overlay: rgba(0,0,0,0.5), centered
  Modal: white, rounded-20, padding 32px, max-width 520px, shadow
  
  Header: "حجز جلسة" (title) + ✕ close button
  
  Form:
    Subject select: "اختر المادة"
    DateTime input: label "تاريخ ووقت الجلسة"
    Textarea: "ملاحظات للمعلم (اختياري)" 3 rows
    
    Price Summary Box:
      bg #fed7aa, rounded-10, padding 14px
      "سعر الجلسة: 150 ر.س" (flex between, font-weight 700, orange)
    
    Submit: "تأكيد الحجز" (full width, large orange button)

════════════════════════════════════════
🔐 PAGE 4: LOGIN  /login
════════════════════════════════════════

Full page: background linear-gradient(135deg, #fff7ed, #fef3e2, #fff)
Centered auth card: max-width 480px, white, rounded-20, padding 40px, shadow

Icon at top: orange rounded square (60x60) with ✨ emoji centered

Title: "تسجيل الدخول" (1.6rem, 800, center)
Subtitle: "سجل دخولك للوصول إلى حسابك" (muted, center)

Google Button:
  Full width, white bg, border 2px #e2e8f0, rounded-10, padding 12px
  Google colored SVG icon + "تسجيل الدخول بجوجل" text
  Hover: border blue, bg #f0f4ff

Divider: line — "أو" — line (muted text)

Form Fields:
  Email field:
    Label: "البريد الإلكتروني"
    Input: right-aligned icon 📧, placeholder "email@example.com"
    Border 2px #e2e8f0, rounded-10, focus border orange
  
  Password field:
    Label row: "كلمة المرور" + "نسيت كلمة المرور؟" (orange link, right aligned)
    Input: right-aligned 🔒 icon + left 👁 toggle visibility
  
  Error box (shows on error):
    bg #fee2e2, border #dc2626, rounded-10, padding 10px
    "⚠️ بيانات الدخول غير صحيحة" red text

  Submit Button:
    "دخول" text + loading spinner when submitting
    Full width, large, orange filled, rounded-12

Register link: "ليس لديك حساب؟ سجل الآن" (orange link) centered below

Info box at bottom:
  bg #f0f9ff, border #bae6fd, rounded-10, padding 14px
  "📧 ملاحظة: بعد التسجيل، ستحتاج لتأكيد بريدك الإلكتروني"

════════════════════════════════════════
📝 PAGE 5: REGISTER  /register
════════════════════════════════════════

Same auth card layout as login.

Icon: 👤 orange rounded square

Title: "إنشاء حساب جديد"
Subtitle: "أنشئ حسابك وابدأ رحلة التعلم"

Google button (same style)
Divider
Form:
  Full Name: label "الاسم الكامل", icon 👤
  Email: label "البريد الإلكتروني", icon 📧
  Password: label "كلمة المرور", icon 🔒, hint: "8 أحرف على الأقل"
  Confirm Password: label "تأكيد كلمة المرور", icon 🔒

Account Type Toggle:
  Label: "نوع الحساب"
  2 buttons side by side (grid 2 cols, gap 10px):
  
  Student Button:
    Icon: 🎓 (1.4rem, center)
    Text: "طالب"
    Border 2px #e2e8f0, rounded-10, padding 14px
    Selected state: border orange, bg #fed7aa, color orange
  
  Teacher Button:
    Icon: 📖
    Text: "معلم"
    Same style, same selected state

Submit: "إنشاء حساب" full width large orange
Login link: "لديك حساب بالفعل؟ سجل دخولك" centered

Success Modal (appears after register):
  📧 emoji large (4rem)
  "تم إنشاء الحساب!" title
  "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني..." message
  "الذهاب إلى تسجيل الدخول" orange button

════════════════════════════════════════
📊 PAGE 6: STUDENT DASHBOARD  /dashboard
════════════════════════════════════════

Layout: sidebar (260px) + main content

SIDEBAR:
  Logo: "🎓 OSTAZZE" orange, font-weight 900
  
  Navigation sections with icons:
  
  Section "الرئيسية":
    📊 نظرة عامة
  
  Section "كطالب":
    🔍 ابحث عن معلم → /teachers
    📅 جلساتي (with red badge count)
    💳 المدفوعات
    ❤️ المعلمون المفضلون
  
  Section "الحساب":
    👤 ملفي الشخصي
    💬 الرسائل
    🔔 الإشعارات
    ⚙️ الإعدادات
    🚪 تسجيل الخروج (red color)
  
  Sidebar link styles:
    padding: 10px 12px, rounded-10, flex gap 12px, 0.92rem
    Default: muted color
    Hover: bg #fed7aa, orange color
    Active: bg #ea580c, white, bold

DASHBOARD HEADER:
  bg white, border-bottom, padding 16px 28px, flex between
  Left: ☰ hamburger + current page title
  Right: 🌙 theme toggle + user avatar + username

STATS CARDS (4-column grid, gap 20px):
  Card 1: "إجمالي الجلسات" / value / 📅 orange icon
  Card 2: "الجلسات القادمة" / value / 🗓️ green icon
  Card 3: "إجمالي المدفوعات" / "ر.س" / 💰 yellow icon
  Card 4: "التقييم المُعطى" / stars / ⭐ purple icon
  
  Each card: white, rounded-12, border, padding 20px
  Icon box: 48x48, rounded-12, colored bg

WELCOME BANNER:
  bg: linear-gradient(135deg, #ea580c, #f97316)
  rounded-16, padding 28px, color white
  "مرحباً بك في Ostazze! 👋" (1.4rem, 800)
  Subtitle text

2-COLUMN SECTION:
  Left card: "🚀 إجراءات سريعة"
    "🔍 ابحث عن معلم" orange button
    "📅 جلساتي" outlined button
  
  Right card: "📋 آخر الجلسات"
    List of recent sessions with teacher name, date, status badge

SESSIONS TABLE (on "جلساتي" tab):
  Filter tabs: الكل | قيد الانتظار | مؤكدة | مكتملة | ملغية
  (underline style tabs, active = orange underline)
  
  Table columns: المعلم | المادة | التاريخ | السعر | الحالة | الإجراء
  
  Status badges:
    "قيد الانتظار" → yellow badge
    "مؤكدة" → green badge
    "مكتملة" → blue badge
    "ملغية" → red badge
  
  Action buttons per row:
    Completed → "تقييم" orange small button
    Confirmed + has zoom → "انضم →" green small button
    Pending/Confirmed → "إلغاء" red small button

PROFILE TAB:
  2 cards:
    Card 1: Edit profile form (name, phone, bio) + save button
    Card 2: Change password form (current, new, confirm) + save button

════════════════════════════════════════
📊 PAGE 7: TEACHER DASHBOARD  /dashboard/teacher
════════════════════════════════════════

Same sidebar layout but with TEACHER navigation:

Section "كمعلم":
  📅 جلسات الطلاب
  ✏️ تعديل الملف الشخصي
  🗓️ مواعيد الإتاحة
  💰 الأرباح

STATS CARDS:
  Card 1: "إجمالي الجلسات"
  Card 2: "جلسات اليوم"
  Card 3: "إجمالي الأرباح" (ر.س)
  Card 4: "متوسط التقييم" (★)

INCOMING SESSIONS TABLE:
  Columns: الطالب | المادة | التاريخ | السعر | الحالة | الإجراء
  
  Actions:
    Pending → "تأكيد" green button + "إلغاء" red button
    Confirmed → "إكمال" blue button + "إلغاء" red button

TEACHER PROFILE EDIT FORM:
  Fields:
    - title_ar: "لقبك الأكاديمي"
    - bio_ar: "نبذة تعريفية" (textarea)
    - price_per_session: "سعر الجلسة (ر.س)"
    - zoom_link: "رابط Zoom"
    - university: select dropdown
    - years_experience: number input
    - subjects: multi-select checkboxes
  Save button: orange

AVAILABILITY MANAGER:
  Grid of days (7 days of week):
    Each day: checkbox to enable + start time + end time
    Days: الأحد، الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة، السبت

════════════════════════════════════════
👑 PAGE 8: ADMIN PANEL  /admin
════════════════════════════════════════

Sidebar with admin sections:
  📊 نظرة عامة
  👥 المستخدمون
  👨‍🏫 المعلمون
  📅 الجلسات
  💳 المدفوعات
  📂 التصنيفات
  📖 المواد
  🎓 الجامعات
  ⚙️ الإعدادات النظام

STATS (4 big cards):
  إجمالي المستخدمين, المعلمون, الجلسات الكلية, إجمالي الإيرادات

USERS TABLE:
  # | الاسم | البريد | النوع | الحالة | تاريخ التسجيل | الإجراء
  Actions: "إيقاف" red / "تفعيل" green toggle

TEACHERS TABLE with verification:
  # | الاسم | السعر | التقييم | التوثيق | الإجراء
  Unverified → "توثيق ✓" green button

════════════════════════════════════════
📖 PAGE 9: SUBJECTS  /subjects
════════════════════════════════════════

Page header with gradient bg
Grid 4 columns of subject cards:
  Icon: 📖 emoji
  Name: subject name in Arabic
  Teacher count: "X معلم" with 👥 icon
  Category badge: orange small badge

Data:
  التفاضل والتكامل (24 معلم - الرياضيات)
  الفيزياء (18 معلم - العلوم الأساسية)
  التسويق (16 معلم - إدارة الأعمال)
  علم التشريح (12 معلم - الطب)
  الأدب الإنجليزي (14 معلم - اللغات)
  الإحصاء (19 معلم - الرياضيات)
  أساسيات البرمجة (22 معلم - علوم الحاسب)
  هياكل البيانات (15 معلم - علوم الحاسب)
  الكيمياء العضوية (11 معلم - الطب)
  المحاسبة المالية (17 معلم - إدارة الأعمال)
  الدوائر الكهربائية (13 معلم - الهندسة)
  الكيمياء العامة (20 معلم - العلوم الأساسية)

════════════════════════════════════════
🎓 PAGE 10: UNIVERSITIES  /universities
════════════════════════════════════════

Same grid layout as categories, 4 columns
Each card: 🎓 icon + university name + country

Data:
  جامعة الملك سعود (Saudi Arabia)
  جامعة الملك عبدالعزيز (Saudi Arabia)
  جامعة الملك فهد للبترول (Saudi Arabia)
  جامعة القاهرة (Egypt)
  الجامعة الأمريكية في بيروت (Lebanon)
  جامعة الإمارات (UAE)
  جامعة الكويت (Kuwait)
  KFUPM (Saudi Arabia)

════════════════════════════════════════
🔔 GLOBAL UI COMPONENTS
════════════════════════════════════════

TOAST NOTIFICATIONS:
  Fixed bottom-left corner (RTL aware)
  Types: success (green right border), error (red), info (blue), warning (yellow)
  Animation: slide in from left
  Icons: ✅ ❌ ℹ️ ⚠️
  Auto-dismiss after 3.5 seconds

MODALS:
  Dark overlay background rgba(0,0,0,0.5)
  Scale-in animation
  Close on overlay click
  White card, rounded-20, shadow

LOADING SPINNER:
  Orange spinning circle border
  Centered overlay for page loads

CONFIRM DIALOG:
  Small modal with title + message + Cancel/Confirm buttons
  Confirm = red (danger action)

TABLE COMPONENT:
  Rounded border wrapper
  Header: light gray bg, UPPERCASE labels, 0.82rem
  Rows: hover state, last row no border
  Responsive horizontal scroll

PAGINATION:
  Centered, number buttons
  Active = orange filled
  Prev/Next arrows

════════════════════════════════════════
📱 RESPONSIVE BREAKPOINTS
════════════════════════════════════════

Desktop: 1200px max-width container
Tablet (≤1024px):
  - 4-col grid → 2-col
  - Sidebar becomes hidden drawer
  - Stats → 2x2 grid

Mobile (≤768px):
  - Hamburger menu
  - Hero: single column, hide image
  - Hero title: 2.2rem
  - 3-col → 2-col → 1-col grids
  - Auth card: less padding

Mobile Small (≤480px):
  - All grids → 1 column
  - Font sizes reduced
  - Hero title: 1.8rem

════════════════════════════════════════
🌙 DARK MODE
════════════════════════════════════════

Toggle with 🌙/☀️ button in navbar
Persist in localStorage

Dark overrides:
  Body bg: #0f172a
  Cards: #1e293b
  Border: #334155
  Text: #f1f5f9
  Muted: #94a3b8
  Inputs: #1e293b bg, #334155 border
  Navbar: rgba(15,23,42,0.97)
  Section alt bg: #1e293b
  Hero gradient: linear-gradient(135deg, #1e293b, #0f172a)
  Footer: already dark ✓
  Category cards hover border still orange
  Teacher card footer bg: rgba(0,0,0,0.1)

════════════════════════════════════════
⚡ STATE MANAGEMENT
════════════════════════════════════════

Use React Context or Zustand for:
- auth: { user, token, isLoggedIn, role }
- theme: { mode: 'light' | 'dark' }
- cart/favorites: { favoriteTeachers: [] }

Persist auth token in localStorage key "ostazze_token"
Persist user in localStorage key "ostazze_user"
Persist theme in localStorage key "ostazze_theme"

════════════════════════════════════════
🗄️ SUPABASE TABLES
════════════════════════════════════════

Create these Supabase tables:

users (extends auth.users):
  id uuid, full_name text, role text (student/teacher/admin),
  avatar text, phone text, bio text

teacher_profiles:
  id uuid, user_id uuid FK, title_ar text, bio_ar text,
  price_per_session decimal, rating decimal, total_reviews int,
  total_sessions int, is_verified bool, is_featured bool,
  university_id uuid FK, years_experience int, zoom_link text

categories:
  id uuid, name_ar text, name_en text, icon text, sort_order int

subjects:
  id uuid, category_id uuid FK, name_ar text, name_en text,
  teacher_count int

universities:
  id uuid, name_ar text, name_en text, country text

teacher_subjects:
  teacher_id uuid FK, subject_id uuid FK

sessions:
  id uuid, student_id uuid FK, teacher_id uuid FK,
  subject_id uuid FK, session_date timestamptz,
  price decimal, status text, zoom_link text, notes text

reviews:
  id uuid, session_id uuid FK, student_id uuid FK,
  teacher_id uuid FK, rating int (1-5), comment text

payments:
  id uuid, session_id uuid FK, student_id uuid FK,
  amount decimal, status text, transaction_id text

notifications:
  id uuid, user_id uuid FK, title_ar text, body_ar text,
  type text, is_read bool

favorites:
  student_id uuid FK, teacher_id uuid FK

════════════════════════════════════════
📋 SEED DATA
════════════════════════════════════════

Seed the Supabase database with:
- 8 categories (from list above)
- 12 subjects (from list above)  
- 8 universities (from list above)
- 6 teacher profiles (from list above)
- Each teacher linked to their subjects
- Teacher profiles with ratings and reviews count
- A few sample reviews for each teacher

════════════════════════════════════════
🚀 FINAL REQUIREMENTS
════════════════════════════════════════

1. The entire app must be Arabic RTL (dir="rtl" on html tag)
2. Use Tajawal font from Google Fonts throughout
3. All text content in Arabic
4. All routes defined in React Router v6
5. Use React Query or SWR for data fetching
6. Forms use React Hook Form with Zod validation
7. All components must be TypeScript typed
8. Responsive on all screen sizes
9. Dark mode fully functional
10. Smooth animations using CSS transitions
11. Loading states on all async operations
12. Error handling with toast notifications
13. The platform name "OSTAZE" always in orange
14. No external UI libraries (pure Tailwind + custom CSS)
15. Connect all pages/components to Supabase

Make it look EXACTLY like a professional Arabic tutoring marketplace.
The design should be clean, modern, and premium — orange as the brand color.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ostazze-learn-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dc7db421-26c3-4945-8236-93600ec382aa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
