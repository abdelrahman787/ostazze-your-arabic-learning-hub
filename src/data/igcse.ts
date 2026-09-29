// IGCSE course catalog (static). Prices are fixed per course, in EGP.
// Teacher names are placeholders until real tutors are assigned.
export interface IgTeacher {
  id: string;
  name: string;
  name_ar: string;
  subjects: string[];
}

export interface IgCourse {
  id: string;
  title: string;
  subject: string;
  teacherId: string;
  priceEGP: number;
  board: "Cambridge" | "Edexcel" | "Oxford AQA";
}

export const IG_DEPARTMENTS = ["IGCSE"] as const;

export const IG_SUBJECTS: { en: string; ar: string }[] = [
  { en: "Accounting", ar: "المحاسبة" },
  { en: "Arabic", ar: "اللغة العربية" },
  { en: "Biology", ar: "الأحياء" },
  { en: "Business", ar: "إدارة الأعمال" },
  { en: "Chemistry", ar: "الكيمياء" },
  { en: "Combined Science", ar: "العلوم المتكاملة" },
  { en: "CS", ar: "علوم الحاسب" },
  { en: "Economics", ar: "الاقتصاد" },
  { en: "English", ar: "اللغة الإنجليزية" },
  { en: "English Checkpoint", ar: "English Checkpoint" },
  { en: "Environmental", ar: "الإدارة البيئية" },
  { en: "ICT", ar: "تكنولوجيا المعلومات" },
  { en: "Math", ar: "الرياضيات" },
  { en: "Physics", ar: "الفيزياء" },
  { en: "Psychology", ar: "علم النفس" },
  { en: "Sociology", ar: "علم الاجتماع" },
  { en: "Speaking", ar: "المحادثة" },
];

export const IG_TEACHERS: IgTeacher[] = [
  {
    id: "t1",
    name: "Dr. Mariam Fawzy",
    name_ar: "د. مريم فوزي",
    subjects: ["Biology"],
  },
  {
    id: "t2",
    name: "Dr. Nour El-Sayed",
    name_ar: "د. نور السيد",
    subjects: ["Combined Science", "Physics"],
  },
  {
    id: "t3",
    name: "Dr. Rania Adel",
    name_ar: "د. رانيا عادل",
    subjects: ["Biology", "Combined Science"],
  },
  {
    id: "t4",
    name: "Dr. Hossam Kamel",
    name_ar: "د. حسام كامل",
    subjects: ["Chemistry"],
  },
  {
    id: "t5",
    name: "Dr. Tarek Mansour",
    name_ar: "د. طارق منصور",
    subjects: ["Psychology"],
  },
  {
    id: "t6",
    name: "Dr. Mina Fouad",
    name_ar: "د. مينا فؤاد",
    subjects: ["Biology"],
  },
  {
    id: "t7",
    name: "Dr. Karim Zaki",
    name_ar: "د. كريم زكي",
    subjects: ["Accounting"],
  },
  {
    id: "t8",
    name: "Dr. Salma Hegazy",
    name_ar: "د. سلمى حجازي",
    subjects: ["Business", "Economics", "Environmental", "Sociology"],
  },
  {
    id: "t9",
    name: "Eng. Omar Farouk",
    name_ar: "م. عمر فاروق",
    subjects: ["CS", "ICT"],
  },
  {
    id: "t10",
    name: "Mr. Andrew Samir",
    name_ar: "أ. أندرو سمير",
    subjects: ["Physics"],
  },
  {
    id: "t11",
    name: "Mr. Youssef Nabil",
    name_ar: "أ. يوسف نبيل",
    subjects: ["Math"],
  },
  {
    id: "t12",
    name: "Mr. Ahmed Ragab",
    name_ar: "أ. أحمد رجب",
    subjects: ["English", "Speaking"],
  },
  {
    id: "t13",
    name: "Mr. Hany Shawky",
    name_ar: "أ. هاني شوقي",
    subjects: ["Arabic"],
  },
  {
    id: "t14",
    name: "Ms. Dalia Mostafa",
    name_ar: "أ. داليا مصطفى",
    subjects: ["English Checkpoint"],
  },
];

export const IG_COURSES: IgCourse[] = [
  {
    id: "physics-as-cambridge",
    title: "Physics AS Cambridge",
    subject: "Physics",
    teacherId: "t10",
    priceEGP: 20000,
    board: "Cambridge",
  },
  {
    id: "physics-ol-edexcel",
    title: "Physics OL Edexcel",
    subject: "Physics",
    teacherId: "t10",
    priceEGP: 19000,
    board: "Edexcel",
  },
  {
    id: "physics-ol-cambridge",
    title: "Physics OL Cambridge",
    subject: "Physics",
    teacherId: "t10",
    priceEGP: 19000,
    board: "Cambridge",
  },
  {
    id: "physics-ol-0972-0625",
    title: "Physics O Level Cambridge (0972 / 0625)",
    subject: "Physics",
    teacherId: "t2",
    priceEGP: 18500,
    board: "Cambridge",
  },
  {
    id: "english-checkpoint",
    title: "English Checkpoint",
    subject: "English Checkpoint",
    teacherId: "t14",
    priceEGP: 17500,
    board: "Cambridge",
  },
  {
    id: "combined-bio-part",
    title: "Combined Science (Biology part)",
    subject: "Biology",
    teacherId: "t6",
    priceEGP: 6500,
    board: "Cambridge",
  },
  {
    id: "cambridge-biology-ol",
    title: "Cambridge Biology OL",
    subject: "Biology",
    teacherId: "t3",
    priceEGP: 18000,
    board: "Cambridge",
  },
  {
    id: "biology-core-cambridge",
    title: "Biology Core Cambridge",
    subject: "Biology",
    teacherId: "t6",
    priceEGP: 12500,
    board: "Cambridge",
  },
  {
    id: "chemistry-ol-0971",
    title: "OL Chemistry Cambridge 0971",
    subject: "Chemistry",
    teacherId: "t4",
    priceEGP: 17000,
    board: "Cambridge",
  },
  {
    id: "biology-core",
    title: "Biology Core",
    subject: "Biology",
    teacherId: "t1",
    priceEGP: 18000,
    board: "Cambridge",
  },
  {
    id: "biology-ol-cambridge-1",
    title: "Biology OL Cambridge",
    subject: "Biology",
    teacherId: "t1",
    priceEGP: 18000,
    board: "Cambridge",
  },
  {
    id: "biology-ol-cambridge-2",
    title: "Biology OL Cambridge — Intensive",
    subject: "Biology",
    teacherId: "t6",
    priceEGP: 16500,
    board: "Cambridge",
  },
  {
    id: "combined-science-full",
    title: "Combined Science (Biology, Chemistry & Physics)",
    subject: "Combined Science",
    teacherId: "t3",
    priceEGP: 13000,
    board: "Cambridge",
  },
  {
    id: "environmental-management",
    title: "Environmental Management",
    subject: "Environmental",
    teacherId: "t8",
    priceEGP: 19000,
    board: "Cambridge",
  },
  {
    id: "economics",
    title: "Economics",
    subject: "Economics",
    teacherId: "t8",
    priceEGP: 18000,
    board: "Cambridge",
  },
  {
    id: "business-studies",
    title: "Business Studies",
    subject: "Business",
    teacherId: "t8",
    priceEGP: 19000,
    board: "Cambridge",
  },
  {
    id: "math-ol-edexcel-2027",
    title: "Math OL Edexcel June 2027",
    subject: "Math",
    teacherId: "t11",
    priceEGP: 18000,
    board: "Edexcel",
  },
  {
    id: "ict",
    title: "ICT",
    subject: "ICT",
    teacherId: "t9",
    priceEGP: 17000,
    board: "Cambridge",
  },
  {
    id: "cs",
    title: "Computer Science",
    subject: "CS",
    teacherId: "t9",
    priceEGP: 17000,
    board: "Cambridge",
  },
  {
    id: "psychology-oxfordaqa",
    title: "Psychology Oxford AQA",
    subject: "Psychology",
    teacherId: "t5",
    priceEGP: 17000,
    board: "Oxford AQA",
  },
  {
    id: "english-oxford-aqa-2027",
    title: "English Oxford AQA 2027",
    subject: "English",
    teacherId: "t12",
    priceEGP: 19500,
    board: "Oxford AQA",
  },
  {
    id: "accounting",
    title: "Accounting",
    subject: "Accounting",
    teacherId: "t7",
    priceEGP: 17000,
    board: "Cambridge",
  },
  {
    id: "arabic",
    title: "Arabic First Language",
    subject: "Arabic",
    teacherId: "t13",
    priceEGP: 15000,
    board: "Cambridge",
  },
];

// First classes shown in each course's outline, by subject.
export const IG_TOPICS: Record<string, string[]> = {
  Accounting: ["Introduction to Accounting", "Double-Entry Bookkeeping"],
  Arabic: ["Reading Comprehension", "Writing Skills"],
  Biology: ["Characteristics of Living Organisms", "Cell Structure"],
  Business: ["Understanding Business Activity", "People in Business"],
  Chemistry: ["States of Matter", "Atoms, Elements and Compounds"],
  "Combined Science": ["Cells and Organisms", "States of Matter"],
  CS: ["Data Representation", "Algorithm Design"],
  Economics: ["The Basic Economic Problem", "Allocation of Resources"],
  English: ["Reading Skills", "Directed Writing"],
  "English Checkpoint": ["Reading", "Writing"],
  Environmental: ["Rocks and Minerals", "Energy and the Environment"],
  ICT: ["Types and Components of Computer Systems", "Input and Output Devices"],
  Math: ["Number", "Algebra Basics"],
  Physics: ["Motion", "Forces and Pressure"],
  Psychology: ["Research Methods", "Memory"],
  Sociology: ["Theory and Methods", "Culture and Identity"],
  Speaking: ["Pronunciation", "Everyday Conversation"],
};
export const IG_START_DATE = "2026-10-01";
