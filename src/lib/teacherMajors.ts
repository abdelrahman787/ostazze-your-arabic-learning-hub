// Deterministic random "main major" per teacher — used for display only.
export const MAJORS: { ar: string; en: string }[] = [
  { ar: "الفيزياء", en: "Physics" },
  { ar: "الرياضيات", en: "Mathematics" },
  { ar: "الديناميكا", en: "Dynamics" },
  { ar: "الكيمياء", en: "Chemistry" },
  { ar: "الأحياء", en: "Biology" },
  { ar: "علوم الحاسب", en: "Computer Science" },
  { ar: "البرمجة", en: "Programming" },
  { ar: "الإحصاء", en: "Statistics" },
  { ar: "الاقتصاد", en: "Economics" },
  { ar: "المحاسبة", en: "Accounting" },
  { ar: "الهندسة الكهربائية", en: "Electrical Engineering" },
  { ar: "الهندسة المدنية", en: "Civil Engineering" },
  { ar: "الهندسة الميكانيكية", en: "Mechanical Engineering" },
  { ar: "اللغة الإنجليزية", en: "English Language" },
  { ar: "التسويق", en: "Marketing" },
  { ar: "إدارة الأعمال", en: "Business Administration" },
  { ar: "علم النفس", en: "Psychology" },
  { ar: "القانون", en: "Law" },
  { ar: "الترموديناميكا", en: "Thermodynamics" },
  { ar: "التحليل العددي", en: "Numerical Analysis" },
];

const hashString = (input: string): number => {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

export const getTeacherMajor = (teacherId: string, lang: "ar" | "en"): string => {
  const idx = hashString(teacherId) % MAJORS.length;
  return MAJORS[idx][lang];
};
