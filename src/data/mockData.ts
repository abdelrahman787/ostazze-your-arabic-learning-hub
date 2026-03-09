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
  { id: "1", name: { ar: "د. أحمد الراشد", en: "Dr. Ahmed Al-Rashed" }, title: { ar: "دكتوراه في الرياضيات من MIT. أكثر من 10 سنوات خبرة في التدريس الجامعي", en: "PhD in Mathematics from MIT. Over 10 years of university teaching experience" }, subjects: [{ ar: "التفاضل والتكامل", en: "Calculus" }, { ar: "الإحصاء", en: "Statistics" }], price: 150, currency: { ar: "ر.س", en: "SAR" }, rating: 4.9, reviews: 156, verified: true, featured: true, university: { ar: "جامعة الملك سعود", en: "King Saud University" }, yearsExperience: 10, totalSessions: 234, bio: { ar: "أستاذ رياضيات متميز حاصل على الدكتوراه من معهد ماساتشوستس للتكنولوجيا. أتميز بأسلوب تدريسي مبسّط يركز على الفهم العميق للمفاهيم الرياضية.", en: "Distinguished mathematics professor with a PhD from MIT. Known for a simplified teaching style focused on deep understanding of mathematical concepts." }, zoomLink: "https://zoom.us/j/123", availability: [{ day: { ar: "الأحد", en: "Sunday" }, start: "9:00", end: "17:00" }, { day: { ar: "الثلاثاء", en: "Tuesday" }, start: "9:00", end: "17:00" }, { day: { ar: "الخميس", en: "Thursday" }, start: "14:00", end: "20:00" }] },
  { id: "2", name: { ar: "د. فاطمة الخالد", en: "Dr. Fatima Al-Khaled" }, title: { ar: "أستاذ مشارك في علوم الحاسب. متخصصة في هياكل البيانات والخوارزميات", en: "Associate Professor in Computer Science. Specialized in data structures and algorithms" }, subjects: [{ ar: "أساسيات البرمجة", en: "Programming Basics" }, { ar: "هياكل البيانات", en: "Data Structures" }], price: 180, currency: { ar: "ر.س", en: "SAR" }, rating: 4.8, reviews: 142, verified: true, featured: true, university: { ar: "جامعة الملك عبدالعزيز", en: "King Abdulaziz University" }, yearsExperience: 8, totalSessions: 198, bio: { ar: "أستاذة علوم حاسب شغوفة بتعليم البرمجة بطريقة عملية وتفاعلية.", en: "Passionate computer science professor who teaches programming in a practical and interactive way." }, availability: [{ day: { ar: "الاثنين", en: "Monday" }, start: "10:00", end: "18:00" }, { day: { ar: "الأربعاء", en: "Wednesday" }, start: "10:00", end: "18:00" }] },
  { id: "3", name: { ar: "د. محمد السعود", en: "Dr. Mohammed Al-Saud" }, title: { ar: "طبيب متخصص في علم التشريح ووظائف الأعضاء", en: "Physician specialized in anatomy and physiology" }, subjects: [{ ar: "الكيمياء العضوية", en: "Organic Chemistry" }, { ar: "علم التشريح", en: "Anatomy" }], price: 200, currency: { ar: "ر.س", en: "SAR" }, rating: 4.7, reviews: 98, verified: false, featured: false, university: { ar: "جامعة القاهرة", en: "Cairo University" }, yearsExperience: 6, totalSessions: 145, bio: { ar: "طبيب وباحث متخصص في علم التشريح مع شغف بتعليم طلاب الطب.", en: "Physician and researcher specialized in anatomy with a passion for teaching medical students." }, availability: [{ day: { ar: "الأحد", en: "Sunday" }, start: "14:00", end: "20:00" }, { day: { ar: "الثلاثاء", en: "Tuesday" }, start: "14:00", end: "20:00" }] },
  { id: "4", name: { ar: "د. سارة القاسم", en: "Dr. Sara Al-Qasem" }, title: { ar: "أستاذة إدارة أعمال مع خبرة استشارية عملية في الشركات الكبرى", en: "Business Administration professor with practical consulting experience at major companies" }, subjects: [{ ar: "المحاسبة المالية", en: "Financial Accounting" }, { ar: "التسويق", en: "Marketing" }], price: 160, currency: { ar: "ر.س", en: "SAR" }, rating: 4.9, reviews: 187, verified: true, featured: true, university: { ar: "الجامعة الأمريكية في بيروت", en: "American University of Beirut" }, yearsExperience: 12, totalSessions: 312, bio: { ar: "خبيرة في إدارة الأعمال مع سنوات من الخبرة الاستشارية في كبرى الشركات.", en: "Business administration expert with years of consulting experience at major companies." }, availability: [{ day: { ar: "الأحد", en: "Sunday" }, start: "8:00", end: "14:00" }, { day: { ar: "الثلاثاء", en: "Tuesday" }, start: "8:00", end: "14:00" }, { day: { ar: "الخميس", en: "Thursday" }, start: "8:00", end: "14:00" }] },
  { id: "5", name: { ar: "د. خالد المنصور", en: "Dr. Khaled Al-Mansour" }, title: { ar: "باحث ومعلم في الفيزياء. نشر أكثر من 30 ورقة بحثية دولية", en: "Physics researcher and teacher. Published over 30 international research papers" }, subjects: [{ ar: "الفيزياء", en: "Physics" }, { ar: "التفاضل والتكامل", en: "Calculus" }], price: 170, currency: { ar: "ر.س", en: "SAR" }, rating: 4.8, reviews: 134, verified: true, featured: false, university: { ar: "جامعة الملك فهد للبترول", en: "KFUPM" }, yearsExperience: 9, totalSessions: 267, bio: { ar: "باحث في الفيزياء النظرية مع شغف كبير بتبسيط المفاهيم المعقدة.", en: "Theoretical physics researcher with a great passion for simplifying complex concepts." }, availability: [{ day: { ar: "الاثنين", en: "Monday" }, start: "9:00", end: "15:00" }, { day: { ar: "الأربعاء", en: "Wednesday" }, start: "9:00", end: "15:00" }] },
  { id: "6", name: { ar: "د. نورة الحربي", en: "Dr. Noura Al-Harbi" }, title: { ar: "متخصصة في الإحصاء مع التركيز على التطبيقات العملية والبحثية", en: "Statistics specialist focusing on practical and research applications" }, subjects: [{ ar: "الإحصاء", en: "Statistics" }, { ar: "أساسيات البرمجة", en: "Programming Basics" }], price: 140, currency: { ar: "ر.س", en: "SAR" }, rating: 4.7, reviews: 89, verified: false, featured: false, university: { ar: "جامعة الإمارات", en: "UAE University" }, yearsExperience: 5, totalSessions: 112, bio: { ar: "متخصصة في الإحصاء التطبيقي مع التركيز على استخدام البيانات في اتخاذ القرار.", en: "Specialist in applied statistics focusing on data-driven decision making." }, availability: [{ day: { ar: "الأحد", en: "Sunday" }, start: "16:00", end: "21:00" }, { day: { ar: "الثلاثاء", en: "Tuesday" }, start: "16:00", end: "21:00" }] },
];

export const mockCategories: Category[] = [
  { id: "1", icon: "⚙️", name: { ar: "الهندسة", en: "Engineering" }, count: { ar: "15 مادة", en: "15 subjects" } },
  { id: "2", icon: "🏥", name: { ar: "الطب والصحة", en: "Medicine & Health" }, count: { ar: "12 مادة", en: "12 subjects" } },
  { id: "3", icon: "💻", name: { ar: "علوم الحاسب", en: "Computer Science" }, count: { ar: "18 مادة", en: "18 subjects" } },
  { id: "4", icon: "📐", name: { ar: "الرياضيات", en: "Mathematics" }, count: { ar: "9 مواد", en: "9 subjects" } },
  { id: "5", icon: "📊", name: { ar: "إدارة الأعمال", en: "Business Administration" }, count: { ar: "11 مادة", en: "11 subjects" } },
  { id: "6", icon: "🌍", name: { ar: "اللغات", en: "Languages" }, count: { ar: "8 مواد", en: "8 subjects" } },
  { id: "7", icon: "🔬", name: { ar: "العلوم الأساسية", en: "Basic Sciences" }, count: { ar: "10 مواد", en: "10 subjects" } },
  { id: "8", icon: "⚖️", name: { ar: "القانون", en: "Law" }, count: { ar: "7 مواد", en: "7 subjects" } },
];

export const mockSubjects: Subject[] = [
  { id: "1", name: { ar: "التفاضل والتكامل", en: "Calculus" }, teacherCount: 24, category: "الرياضيات" },
  { id: "2", name: { ar: "الفيزياء", en: "Physics" }, teacherCount: 18, category: "العلوم الأساسية" },
  { id: "3", name: { ar: "التسويق", en: "Marketing" }, teacherCount: 16, category: "إدارة الأعمال" },
  { id: "4", name: { ar: "علم التشريح", en: "Anatomy" }, teacherCount: 12, category: "الطب" },
  { id: "5", name: { ar: "الأدب الإنجليزي", en: "English Literature" }, teacherCount: 14, category: "اللغات" },
  { id: "6", name: { ar: "الإحصاء", en: "Statistics" }, teacherCount: 19, category: "الرياضيات" },
  { id: "7", name: { ar: "أساسيات البرمجة", en: "Programming Basics" }, teacherCount: 22, category: "علوم الحاسب" },
  { id: "8", name: { ar: "هياكل البيانات", en: "Data Structures" }, teacherCount: 15, category: "علوم الحاسب" },
  { id: "9", name: { ar: "الكيمياء العضوية", en: "Organic Chemistry" }, teacherCount: 11, category: "الطب" },
  { id: "10", name: { ar: "المحاسبة المالية", en: "Financial Accounting" }, teacherCount: 17, category: "إدارة الأعمال" },
  { id: "11", name: { ar: "الدوائر الكهربائية", en: "Electrical Circuits" }, teacherCount: 13, category: "الهندسة" },
  { id: "12", name: { ar: "الكيمياء العامة", en: "General Chemistry" }, teacherCount: 20, category: "العلوم الأساسية" },
];

export const mockUniversities: University[] = [
  { id: "1", name: { ar: "جامعة الملك سعود", en: "King Saud University" }, country: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" } },
  { id: "2", name: { ar: "جامعة الملك عبدالعزيز", en: "King Abdulaziz University" }, country: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" } },
  { id: "3", name: { ar: "جامعة الملك فهد للبترول", en: "KFUPM" }, country: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" } },
  { id: "4", name: { ar: "جامعة القاهرة", en: "Cairo University" }, country: { ar: "مصر", en: "Egypt" } },
  { id: "5", name: { ar: "الجامعة الأمريكية في بيروت", en: "American University of Beirut" }, country: { ar: "لبنان", en: "Lebanon" } },
  { id: "6", name: { ar: "جامعة الإمارات", en: "UAE University" }, country: { ar: "الإمارات العربية المتحدة", en: "UAE" } },
  { id: "7", name: { ar: "جامعة الكويت", en: "Kuwait University" }, country: { ar: "الكويت", en: "Kuwait" } },
  { id: "8", name: { ar: "KFUPM", en: "KFUPM" }, country: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" } },
];

export const mockReviews: Review[] = [
  { id: "1", studentName: { ar: "عبدالله السالم", en: "Abdullah Al-Salem" }, rating: 5, comment: { ar: "معلم ممتاز جداً، يشرح بطريقة مبسطة وسهلة الفهم. استفدت كثيراً من جلساته.", en: "Excellent teacher, explains in a simple and easy-to-understand way. I benefited greatly from his sessions." }, date: { ar: "قبل 3 أيام", en: "3 days ago" }, university: { ar: "جامعة الملك سعود", en: "King Saud University" } },
  { id: "2", studentName: { ar: "مريم الحسن", en: "Maryam Al-Hassan" }, rating: 5, comment: { ar: "أفضل معلم رياضيات! ساعدني في رفع درجاتي بشكل ملحوظ خلال فترة قصيرة.", en: "Best math teacher! Helped me significantly improve my grades in a short period." }, date: { ar: "قبل أسبوع", en: "1 week ago" }, university: { ar: "جامعة الملك عبدالعزيز", en: "King Abdulaziz University" } },
  { id: "3", studentName: { ar: "فهد العتيبي", en: "Fahd Al-Otaibi" }, rating: 4, comment: { ar: "شرح واضح ومنظم. أنصح به بشدة لطلاب الرياضيات.", en: "Clear and organized explanation. I highly recommend him for math students." }, date: { ar: "قبل أسبوعين", en: "2 weeks ago" }, university: { ar: "جامعة القاهرة", en: "Cairo University" } },
  { id: "4", studentName: { ar: "لينا محمد", en: "Lina Mohammed" }, rating: 5, comment: { ar: "تجربة تعليمية رائعة! المعلم صبور ومتفهم ويراعي مستوى الطالب.", en: "Wonderful learning experience! The teacher is patient, understanding, and considerate of the student's level." }, date: { ar: "قبل 3 أسابيع", en: "3 weeks ago" }, university: { ar: "الجامعة الأمريكية في بيروت", en: "American University of Beirut" } },
  { id: "5", studentName: { ar: "أحمد الغامدي", en: "Ahmed Al-Ghamdi" }, rating: 5, comment: { ar: "جلسات احترافية جداً، استخدام ممتاز للوسائل التعليمية.", en: "Very professional sessions, excellent use of teaching tools." }, date: { ar: "قبل شهر", en: "1 month ago" }, university: { ar: "جامعة الملك فهد", en: "KFUPM" } },
];

export const mockTestimonials = [
  { name: { ar: "عبدالله المالكي", en: "Abdullah Al-Malki" }, university: { ar: "جامعة الملك سعود", en: "King Saud University" }, quote: { ar: "بفضل Ostazze، تمكنت من رفع معدلي في مادة التفاضل والتكامل من C إلى A+. المعلمون محترفون والمنصة سهلة الاستخدام.", en: "Thanks to Ostazze, I was able to raise my Calculus grade from C to A+. The teachers are professional and the platform is easy to use." } },
  { name: { ar: "نورا الشمري", en: "Noura Al-Shammari" }, university: { ar: "جامعة الملك عبدالعزيز", en: "King Abdulaziz University" }, quote: { ar: "أفضل منصة تعليمية استخدمتها! حجز الجلسات سهل والمعلمون متميزون. أنصح بها لكل طالب جامعي.", en: "Best learning platform I've used! Booking sessions is easy and the teachers are outstanding. I recommend it to every university student." } },
  { name: { ar: "فيصل الدوسري", en: "Faisal Al-Dosari" }, university: { ar: "جامعة القاهرة", en: "Cairo University" }, quote: { ar: "ساعدتني المنصة في التغلب على صعوبات مادة الفيزياء. المعلم كان صبوراً ومحترفاً في شرحه.", en: "The platform helped me overcome difficulties in Physics. The teacher was patient and professional in his explanations." } },
];

export const mockSessions = [
  { id: "1", teacherName: { ar: "د. أحمد الراشد", en: "Dr. Ahmed Al-Rashed" }, subject: { ar: "التفاضل والتكامل", en: "Calculus" }, date: "2026-03-10", time: "10:00", price: 150, status: "confirmed" as const, zoomLink: "https://zoom.us/j/123" },
  { id: "2", teacherName: { ar: "د. فاطمة الخالد", en: "Dr. Fatima Al-Khaled" }, subject: { ar: "هياكل البيانات", en: "Data Structures" }, date: "2026-03-12", time: "14:00", price: 180, status: "pending" as const },
  { id: "3", teacherName: { ar: "د. سارة القاسم", en: "Dr. Sara Al-Qasem" }, subject: { ar: "المحاسبة المالية", en: "Financial Accounting" }, date: "2026-02-28", time: "09:00", price: 160, status: "completed" as const },
  { id: "4", teacherName: { ar: "د. خالد المنصور", en: "Dr. Khaled Al-Mansour" }, subject: { ar: "الفيزياء", en: "Physics" }, date: "2026-02-20", time: "16:00", price: 170, status: "cancelled" as const },
];
