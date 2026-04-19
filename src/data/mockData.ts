import { allUniversities } from "@/data/universitiesData";

export interface Teacher {
  id: string;
  name: { ar: string; en: string };
  title: { ar: string; en: string };
  subjects: { ar: string; en: string }[];
  price: number;
  currency: { ar: string; en: string };
  rating: number;
  reviews: number;
  verified: boolean;
  featured: boolean;
  avatar?: string;
  university?: { ar: string; en: string };
  yearsExperience?: number;
  bio?: { ar: string; en: string };
  zoomLink?: string;
  totalSessions?: number;
  availability?: { day: { ar: string; en: string }; start: string; end: string }[];
}

export interface Category {
  id: string;
  icon: string;
  name: { ar: string; en: string };
  count: { ar: string; en: string };
}

export interface Subject {
  id: string;
  name: { ar: string; en: string };
  teacherCount: number;
  category: string;
}

export interface University {
  id: string;
  name: { ar: string; en: string };
  country: { ar: string; en: string };
}

export interface Review {
  id: string;
  studentName: { ar: string; en: string };
  rating: number;
  comment: { ar: string; en: string };
  date: { ar: string; en: string };
  university?: { ar: string; en: string };
}

export const mockTeachers: Teacher[] = [
  { id: "1", name: { ar: "د. أحمد الراشد", en: "Dr. Ahmed Al-Rashed" }, title: { ar: "دكتوراه في الرياضيات من MIT. أكثر من 10 سنوات خبرة في التدريس الجامعي", en: "PhD in Mathematics from MIT. Over 10 years of university teaching experience" }, subjects: [{ ar: "التفاضل والتكامل", en: "Calculus" }, { ar: "الإحصاء", en: "Statistics" }], price: 150, currency: { ar: "ر.س", en: "SAR" }, rating: 4.9, reviews: 156, verified: true, featured: true, university: { ar: "جامعة الكويت", en: "Kuwait University" }, yearsExperience: 10, totalSessions: 234, bio: { ar: "أستاذ رياضيات متميز حاصل على الدكتوراه من معهد ماساتشوستس للتكنولوجيا.", en: "Distinguished mathematics professor with a PhD from MIT." }, zoomLink: "https://zoom.us/j/123", availability: [{ day: { ar: "الأحد", en: "Sunday" }, start: "9:00", end: "17:00" }, { day: { ar: "الثلاثاء", en: "Tuesday" }, start: "9:00", end: "17:00" }] },
  { id: "2", name: { ar: "د. فاطمة الخالد", en: "Dr. Fatima Al-Khaled" }, title: { ar: "أستاذ مشارك في علوم الحاسب. متخصصة في هياكل البيانات والخوارزميات", en: "Associate Professor in Computer Science. Specialized in data structures and algorithms" }, subjects: [{ ar: "أساسيات البرمجة", en: "Programming Basics" }, { ar: "هياكل البيانات", en: "Data Structures" }], price: 180, currency: { ar: "ر.س", en: "SAR" }, rating: 4.8, reviews: 142, verified: true, featured: true, university: { ar: "جامعة الخليج للعلوم والتكنولوجيا", en: "Gulf University for Science and Technology" }, yearsExperience: 8, totalSessions: 198, bio: { ar: "أستاذة علوم حاسب شغوفة بتعليم البرمجة بطريقة عملية وتفاعلية.", en: "Passionate computer science professor who teaches programming in a practical and interactive way." }, availability: [{ day: { ar: "الاثنين", en: "Monday" }, start: "10:00", end: "18:00" }] },
  { id: "3", name: { ar: "د. محمد السعود", en: "Dr. Mohammed Al-Saud" }, title: { ar: "طبيب متخصص في علم التشريح ووظائف الأعضاء", en: "Physician specialized in anatomy and physiology" }, subjects: [{ ar: "الكيمياء العضوية", en: "Organic Chemistry" }, { ar: "علم التشريح", en: "Anatomy" }], price: 200, currency: { ar: "ر.س", en: "SAR" }, rating: 4.7, reviews: 98, verified: false, featured: false, university: { ar: "جامعة قطر", en: "Qatar University" }, yearsExperience: 6, totalSessions: 145, bio: { ar: "طبيب وباحث متخصص في علم التشريح.", en: "Physician and researcher specialized in anatomy." }, availability: [{ day: { ar: "الأحد", en: "Sunday" }, start: "14:00", end: "20:00" }] },
  { id: "4", name: { ar: "د. سارة القاسم", en: "Dr. Sara Al-Qasem" }, title: { ar: "أستاذة إدارة أعمال مع خبرة استشارية عملية في الشركات الكبرى", en: "Business Administration professor with practical consulting experience at major companies" }, subjects: [{ ar: "المحاسبة المالية", en: "Financial Accounting" }, { ar: "التسويق", en: "Marketing" }], price: 160, currency: { ar: "ر.س", en: "SAR" }, rating: 4.9, reviews: 187, verified: true, featured: true, university: { ar: "جامعة الكويت", en: "Kuwait University" }, yearsExperience: 12, totalSessions: 312, bio: { ar: "خبيرة في إدارة الأعمال مع سنوات من الخبرة الاستشارية.", en: "Business administration expert with years of consulting experience." }, availability: [{ day: { ar: "الأحد", en: "Sunday" }, start: "8:00", end: "14:00" }] },
  { id: "5", name: { ar: "د. خالد المنصور", en: "Dr. Khaled Al-Mansour" }, title: { ar: "باحث ومعلم في الفيزياء. نشر أكثر من 30 ورقة بحثية دولية", en: "Physics researcher and teacher. Published over 30 international research papers" }, subjects: [{ ar: "الفيزياء", en: "Physics" }, { ar: "التفاضل والتكامل", en: "Calculus" }], price: 170, currency: { ar: "ر.س", en: "SAR" }, rating: 4.8, reviews: 134, verified: true, featured: false, university: { ar: "جامعة قطر", en: "Qatar University" }, yearsExperience: 9, totalSessions: 267, bio: { ar: "باحث في الفيزياء النظرية مع شغف كبير بتبسيط المفاهيم المعقدة.", en: "Theoretical physics researcher with a great passion for simplifying complex concepts." }, availability: [{ day: { ar: "الاثنين", en: "Monday" }, start: "9:00", end: "15:00" }] },
  { id: "6", name: { ar: "د. نورة الحربي", en: "Dr. Noura Al-Harbi" }, title: { ar: "متخصصة في الإحصاء مع التركيز على التطبيقات العملية والبحثية", en: "Statistics specialist focusing on practical and research applications" }, subjects: [{ ar: "الإحصاء", en: "Statistics" }, { ar: "أساسيات البرمجة", en: "Programming Basics" }], price: 140, currency: { ar: "ر.س", en: "SAR" }, rating: 4.7, reviews: 89, verified: false, featured: false, university: { ar: "الجامعة الأمريكية في الكويت", en: "American University of Kuwait" }, yearsExperience: 5, totalSessions: 112, bio: { ar: "متخصصة في الإحصاء التطبيقي.", en: "Specialist in applied statistics." }, availability: [{ day: { ar: "الأحد", en: "Sunday" }, start: "16:00", end: "21:00" }] },
];

// ===== DERIVE CATEGORIES FROM UNIVERSITY DATA =====
const collegeToCategory: Record<string, { ar: string; en: string; icon: string }> = {
  "engineering": { ar: "الهندسة والبترول", en: "Engineering & Petroleum", icon: "⚙️" },
  "science": { ar: "العلوم", en: "Sciences", icon: "🔬" },
  "arts": { ar: "الآداب والعلوم الإنسانية", en: "Arts & Humanities", icon: "📚" },
  "medicine": { ar: "الطب", en: "Medicine", icon: "🏥" },
  "business": { ar: "إدارة الأعمال", en: "Business Administration", icon: "📊" },
  "law": { ar: "الحقوق والقانون", en: "Law", icon: "⚖️" },
  "education": { ar: "التربية", en: "Education", icon: "🎓" },
  "pharmacy": { ar: "الصيدلة", en: "Pharmacy", icon: "💊" },
  "nursing": { ar: "التمريض", en: "Nursing", icon: "🩺" },
  "sharia": { ar: "الشريعة والدراسات الإسلامية", en: "Sharia & Islamic Studies", icon: "📖" },
  "allied": { ar: "العلوم الطبية المساندة", en: "Allied Health Sciences", icon: "🧬" },
  "computing": { ar: "الحوسبة وتقنية المعلومات", en: "Computing & IT", icon: "💻" },
  "design": { ar: "الفنون والتصميم", en: "Fine Arts & Design", icon: "🎨" },
  "health": { ar: "العلوم الصحية", en: "Health Sciences", icon: "❤️" },
  "technology": { ar: "التكنولوجيا", en: "Technology", icon: "🔧" },
};

function classifyCollege(nameEn: string): string {
  const lower = nameEn.toLowerCase();
  if (lower.includes("engineering") || lower.includes("petroleum")) return "engineering";
  if (lower.includes("computer") || lower.includes("computing") || lower.includes("information technology")) return "computing";
  if (lower.includes("medicine") || lower.includes("medical")) return "medicine";
  if (lower.includes("business") || lower.includes("management") || lower.includes("economics")) return "business";
  if (lower.includes("law")) return "law";
  if (lower.includes("education")) return "education";
  if (lower.includes("pharmacy")) return "pharmacy";
  if (lower.includes("nursing")) return "nursing";
  if (lower.includes("sharia") || lower.includes("islamic")) return "sharia";
  if (lower.includes("allied") || lower.includes("health science")) return "allied";
  if (lower.includes("science") && !lower.includes("art")) return "science";
  if (lower.includes("art") || lower.includes("humanities") || lower.includes("social")) return "arts";
  if (lower.includes("fine art") || lower.includes("design")) return "design";
  if (lower.includes("technology") || lower.includes("udst")) return "technology";
  if (lower.includes("health")) return "health";
  return "arts";
}

// Build categories dynamically
const buildCategories = (): Category[] => {
  const catMap = new Map<string, { ar: string; en: string; icon: string; deptCount: number }>();
  allUniversities.forEach(u => {
    u.colleges.forEach(c => {
      const key = classifyCollege(c.name_en);
      const info = collegeToCategory[key] || { ar: key, en: key, icon: "📘" };
      if (!catMap.has(key)) {
        catMap.set(key, { ...info, deptCount: 0 });
      }
      catMap.get(key)!.deptCount += c.departments.length;
    });
  });
  return Array.from(catMap.entries()).map(([key, val], i) => ({
    id: String(i + 1),
    icon: val.icon,
    name: { ar: val.ar, en: val.en },
    count: { ar: `${val.deptCount} قسم`, en: `${val.deptCount} departments` },
  }));
};

// Build subjects dynamically from all departments
const buildSubjects = (): Subject[] => {
  const subjects: Subject[] = [];
  const seen = new Set<string>();
  let id = 1;
  allUniversities.forEach(u => {
    u.colleges.forEach(c => {
      const catKey = classifyCollege(c.name_en);
      const catInfo = collegeToCategory[catKey];
      c.departments.forEach(d => {
        if (!seen.has(d.name_en)) {
          seen.add(d.name_en);
          subjects.push({
            id: String(id++),
            name: { ar: d.name_ar, en: d.name_en },
            teacherCount: Math.floor(Math.random() * 20) + 5,
            category: catInfo?.ar || catKey,
          });
        }
      });
    });
  });
  return subjects;
};

export const mockCategories: Category[] = buildCategories();
export const mockSubjects: Subject[] = buildSubjects();

export const mockUniversities: University[] = allUniversities.map(u => ({
  id: u.id,
  name: { ar: u.name_ar, en: u.name_en },
  country: { ar: u.country_ar, en: u.country_en },
}));

export const mockReviews: Review[] = [
  { id: "1", studentName: { ar: "عبدالله السالم", en: "Abdullah Al-Salem" }, rating: 5, comment: { ar: "معلم ممتاز جداً، يشرح بطريقة مبسطة وسهلة الفهم.", en: "Excellent teacher, explains in a simple and easy-to-understand way." }, date: { ar: "قبل 3 أيام", en: "3 days ago" }, university: { ar: "جامعة الكويت", en: "Kuwait University" } },
  { id: "2", studentName: { ar: "مريم الحسن", en: "Maryam Al-Hassan" }, rating: 5, comment: { ar: "أفضل معلم رياضيات! ساعدني في رفع درجاتي بشكل ملحوظ.", en: "Best math teacher! Helped me significantly improve my grades." }, date: { ar: "قبل أسبوع", en: "1 week ago" }, university: { ar: "جامعة قطر", en: "Qatar University" } },
  { id: "3", studentName: { ar: "فهد العتيبي", en: "Fahd Al-Otaibi" }, rating: 4, comment: { ar: "شرح واضح ومنظم. أنصح به بشدة.", en: "Clear and organized explanation. I highly recommend." }, date: { ar: "قبل أسبوعين", en: "2 weeks ago" }, university: { ar: "جامعة الخليج للعلوم والتكنولوجيا", en: "GUST" } },
  { id: "4", studentName: { ar: "لينا محمد", en: "Lina Mohammed" }, rating: 5, comment: { ar: "تجربة تعليمية رائعة! المعلم صبور ومتفهم.", en: "Wonderful learning experience! The teacher is patient and understanding." }, date: { ar: "قبل 3 أسابيع", en: "3 weeks ago" }, university: { ar: "الجامعة الأمريكية في الكويت", en: "American University of Kuwait" } },
  { id: "5", studentName: { ar: "أحمد الغامدي", en: "Ahmed Al-Ghamdi" }, rating: 5, comment: { ar: "جلسات احترافية جداً، استخدام ممتاز للوسائل التعليمية.", en: "Very professional sessions, excellent use of teaching tools." }, date: { ar: "قبل شهر", en: "1 month ago" }, university: { ar: "جامعة قطر", en: "Qatar University" } },
];

export const mockTestimonials = [
  { name: { ar: "عبدالله المالكي", en: "Abdullah Al-Malki" }, university: { ar: "جامعة الكويت", en: "Kuwait University" }, quote: { ar: "بفضل Ostaze، تمكنت من رفع معدلي في مادة التفاضل والتكامل من C إلى A+.", en: "Thanks to Ostaze, I was able to raise my Calculus grade from C to A+." } },
  { name: { ar: "نورا الشمري", en: "Noura Al-Shammari" }, university: { ar: "جامعة قطر", en: "Qatar University" }, quote: { ar: "أفضل منصة تعليمية استخدمتها! حجز الجلسات سهل والمعلمون متميزون.", en: "Best learning platform I've used! Booking sessions is easy and the teachers are outstanding." } },
  { name: { ar: "فيصل الدوسري", en: "Faisal Al-Dosari" }, university: { ar: "جامعة الخليج للعلوم والتكنولوجيا", en: "GUST" }, quote: { ar: "ساعدتني المنصة في التغلب على صعوبات مادة الفيزياء.", en: "The platform helped me overcome difficulties in Physics." } },
];

export const mockSessions = [
  { id: "1", teacherName: { ar: "د. أحمد الراشد", en: "Dr. Ahmed Al-Rashed" }, subject: { ar: "التفاضل والتكامل", en: "Calculus" }, date: "2026-03-10", time: "10:00", price: 150, status: "confirmed" as const, zoomLink: "https://zoom.us/j/123" },
  { id: "2", teacherName: { ar: "د. فاطمة الخالد", en: "Dr. Fatima Al-Khaled" }, subject: { ar: "هياكل البيانات", en: "Data Structures" }, date: "2026-03-12", time: "14:00", price: 180, status: "pending" as const },
  { id: "3", teacherName: { ar: "د. سارة القاسم", en: "Dr. Sara Al-Qasem" }, subject: { ar: "المحاسبة المالية", en: "Financial Accounting" }, date: "2026-02-28", time: "09:00", price: 160, status: "completed" as const },
  { id: "4", teacherName: { ar: "د. خالد المنصور", en: "Dr. Khaled Al-Mansour" }, subject: { ar: "الفيزياء", en: "Physics" }, date: "2026-02-20", time: "16:00", price: 170, status: "cancelled" as const },
];
