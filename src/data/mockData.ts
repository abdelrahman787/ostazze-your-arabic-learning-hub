export interface Teacher {
  id: string;
  name: string;
  title: string;
  subjects: string[];
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  verified: boolean;
  featured: boolean;
  avatar?: string;
  university?: string;
  yearsExperience?: number;
  bio?: string;
  zoomLink?: string;
  totalSessions?: number;
  availability?: { day: string; start: string; end: string }[];
}

export interface Category {
  id: string;
  icon: string;
  name: string;
  count: string;
}

export interface Subject {
  id: string;
  name: string;
  teacherCount: number;
  category: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
  university?: string;
}

export const mockTeachers: Teacher[] = [
  { id: "1", name: "د. أحمد الراشد", title: "دكتوراه في الرياضيات من MIT. أكثر من 10 سنوات خبرة في التدريس الجامعي", subjects: ["التفاضل والتكامل", "الإحصاء"], price: 150, currency: "ر.س", rating: 4.9, reviews: 156, verified: true, featured: true, university: "جامعة الملك سعود", yearsExperience: 10, totalSessions: 234, bio: "أستاذ رياضيات متميز حاصل على الدكتوراه من معهد ماساتشوستس للتكنولوجيا. أتميز بأسلوب تدريسي مبسّط يركز على الفهم العميق للمفاهيم الرياضية.", zoomLink: "https://zoom.us/j/123", availability: [{ day: "الأحد", start: "9:00", end: "17:00" }, { day: "الثلاثاء", start: "9:00", end: "17:00" }, { day: "الخميس", start: "14:00", end: "20:00" }] },
  { id: "2", name: "د. فاطمة الخالد", title: "أستاذ مشارك في علوم الحاسب. متخصصة في هياكل البيانات والخوارزميات", subjects: ["أساسيات البرمجة", "هياكل البيانات"], price: 180, currency: "ر.س", rating: 4.8, reviews: 142, verified: true, featured: true, university: "جامعة الملك عبدالعزيز", yearsExperience: 8, totalSessions: 198, bio: "أستاذة علوم حاسب شغوفة بتعليم البرمجة بطريقة عملية وتفاعلية.", availability: [{ day: "الاثنين", start: "10:00", end: "18:00" }, { day: "الأربعاء", start: "10:00", end: "18:00" }] },
  { id: "3", name: "د. محمد السعود", title: "طبيب متخصص في علم التشريح ووظائف الأعضاء", subjects: ["الكيمياء العضوية", "علم التشريح"], price: 200, currency: "ر.س", rating: 4.7, reviews: 98, verified: false, featured: false, university: "جامعة القاهرة", yearsExperience: 6, totalSessions: 145, bio: "طبيب وباحث متخصص في علم التشريح مع شغف بتعليم طلاب الطب.", availability: [{ day: "الأحد", start: "14:00", end: "20:00" }, { day: "الثلاثاء", start: "14:00", end: "20:00" }] },
  { id: "4", name: "د. سارة القاسم", title: "أستاذة إدارة أعمال مع خبرة استشارية عملية في الشركات الكبرى", subjects: ["المحاسبة المالية", "التسويق"], price: 160, currency: "ر.س", rating: 4.9, reviews: 187, verified: true, featured: true, university: "الجامعة الأمريكية في بيروت", yearsExperience: 12, totalSessions: 312, bio: "خبيرة في إدارة الأعمال مع سنوات من الخبرة الاستشارية في كبرى الشركات.", availability: [{ day: "الأحد", start: "8:00", end: "14:00" }, { day: "الثلاثاء", start: "8:00", end: "14:00" }, { day: "الخميس", start: "8:00", end: "14:00" }] },
  { id: "5", name: "د. خالد المنصور", title: "باحث ومعلم في الفيزياء. نشر أكثر من 30 ورقة بحثية دولية", subjects: ["الفيزياء", "التفاضل والتكامل"], price: 170, currency: "ر.س", rating: 4.8, reviews: 134, verified: true, featured: false, university: "جامعة الملك فهد للبترول", yearsExperience: 9, totalSessions: 267, bio: "باحث في الفيزياء النظرية مع شغف كبير بتبسيط المفاهيم المعقدة.", availability: [{ day: "الاثنين", start: "9:00", end: "15:00" }, { day: "الأربعاء", start: "9:00", end: "15:00" }] },
  { id: "6", name: "د. نورة الحربي", title: "متخصصة في الإحصاء مع التركيز على التطبيقات العملية والبحثية", subjects: ["الإحصاء", "أساسيات البرمجة"], price: 140, currency: "ر.س", rating: 4.7, reviews: 89, verified: false, featured: false, university: "جامعة الإمارات", yearsExperience: 5, totalSessions: 112, bio: "متخصصة في الإحصاء التطبيقي مع التركيز على استخدام البيانات في اتخاذ القرار.", availability: [{ day: "الأحد", start: "16:00", end: "21:00" }, { day: "الثلاثاء", start: "16:00", end: "21:00" }] },
];

export const mockCategories: Category[] = [
  { id: "1", icon: "⚙️", name: "الهندسة", count: "15 مادة" },
  { id: "2", icon: "🏥", name: "الطب والصحة", count: "12 مادة" },
  { id: "3", icon: "💻", name: "علوم الحاسب", count: "18 مادة" },
  { id: "4", icon: "📐", name: "الرياضيات", count: "9 مواد" },
  { id: "5", icon: "📊", name: "إدارة الأعمال", count: "11 مادة" },
  { id: "6", icon: "🌍", name: "اللغات", count: "8 مواد" },
  { id: "7", icon: "🔬", name: "العلوم الأساسية", count: "10 مواد" },
  { id: "8", icon: "⚖️", name: "القانون", count: "7 مواد" },
];

export const mockSubjects: Subject[] = [
  { id: "1", name: "التفاضل والتكامل", teacherCount: 24, category: "الرياضيات" },
  { id: "2", name: "الفيزياء", teacherCount: 18, category: "العلوم الأساسية" },
  { id: "3", name: "التسويق", teacherCount: 16, category: "إدارة الأعمال" },
  { id: "4", name: "علم التشريح", teacherCount: 12, category: "الطب" },
  { id: "5", name: "الأدب الإنجليزي", teacherCount: 14, category: "اللغات" },
  { id: "6", name: "الإحصاء", teacherCount: 19, category: "الرياضيات" },
  { id: "7", name: "أساسيات البرمجة", teacherCount: 22, category: "علوم الحاسب" },
  { id: "8", name: "هياكل البيانات", teacherCount: 15, category: "علوم الحاسب" },
  { id: "9", name: "الكيمياء العضوية", teacherCount: 11, category: "الطب" },
  { id: "10", name: "المحاسبة المالية", teacherCount: 17, category: "إدارة الأعمال" },
  { id: "11", name: "الدوائر الكهربائية", teacherCount: 13, category: "الهندسة" },
  { id: "12", name: "الكيمياء العامة", teacherCount: 20, category: "العلوم الأساسية" },
];

export const mockUniversities: University[] = [
  { id: "1", name: "جامعة الملك سعود", country: "المملكة العربية السعودية" },
  { id: "2", name: "جامعة الملك عبدالعزيز", country: "المملكة العربية السعودية" },
  { id: "3", name: "جامعة الملك فهد للبترول", country: "المملكة العربية السعودية" },
  { id: "4", name: "جامعة القاهرة", country: "مصر" },
  { id: "5", name: "الجامعة الأمريكية في بيروت", country: "لبنان" },
  { id: "6", name: "جامعة الإمارات", country: "الإمارات العربية المتحدة" },
  { id: "7", name: "جامعة الكويت", country: "الكويت" },
  { id: "8", name: "KFUPM", country: "المملكة العربية السعودية" },
];

export const mockReviews: Review[] = [
  { id: "1", studentName: "عبدالله السالم", rating: 5, comment: "معلم ممتاز جداً، يشرح بطريقة مبسطة وسهلة الفهم. استفدت كثيراً من جلساته.", date: "قبل 3 أيام", university: "جامعة الملك سعود" },
  { id: "2", studentName: "مريم الحسن", rating: 5, comment: "أفضل معلم رياضيات! ساعدني في رفع درجاتي بشكل ملحوظ خلال فترة قصيرة.", date: "قبل أسبوع", university: "جامعة الملك عبدالعزيز" },
  { id: "3", studentName: "فهد العتيبي", rating: 4, comment: "شرح واضح ومنظم. أنصح به بشدة لطلاب الرياضيات.", date: "قبل أسبوعين", university: "جامعة القاهرة" },
  { id: "4", studentName: "لينا محمد", rating: 5, comment: "تجربة تعليمية رائعة! المعلم صبور ومتفهم ويراعي مستوى الطالب.", date: "قبل 3 أسابيع", university: "الجامعة الأمريكية في بيروت" },
  { id: "5", studentName: "أحمد الغامدي", rating: 5, comment: "جلسات احترافية جداً، استخدام ممتاز للوسائل التعليمية.", date: "قبل شهر", university: "جامعة الملك فهد" },
];

export const mockTestimonials = [
  { name: "عبدالله المالكي", university: "جامعة الملك سعود", quote: "بفضل Ostazze، تمكنت من رفع معدلي في مادة التفاضل والتكامل من C إلى A+. المعلمون محترفون والمنصة سهلة الاستخدام." },
  { name: "نورا الشمري", university: "جامعة الملك عبدالعزيز", quote: "أفضل منصة تعليمية استخدمتها! حجز الجلسات سهل والمعلمون متميزون. أنصح بها لكل طالب جامعي." },
  { name: "فيصل الدوسري", university: "جامعة القاهرة", quote: "ساعدتني المنصة في التغلب على صعوبات مادة الفيزياء. المعلم كان صبوراً ومحترفاً في شرحه." },
];

export const mockSessions = [
  { id: "1", teacherName: "د. أحمد الراشد", subject: "التفاضل والتكامل", date: "2026-03-10", time: "10:00", price: 150, status: "confirmed" as const, zoomLink: "https://zoom.us/j/123" },
  { id: "2", teacherName: "د. فاطمة الخالد", subject: "هياكل البيانات", date: "2026-03-12", time: "14:00", price: 180, status: "pending" as const },
  { id: "3", teacherName: "د. سارة القاسم", subject: "المحاسبة المالية", date: "2026-02-28", time: "09:00", price: 160, status: "completed" as const },
  { id: "4", teacherName: "د. خالد المنصور", subject: "الفيزياء", date: "2026-02-20", time: "16:00", price: 170, status: "cancelled" as const },
];
