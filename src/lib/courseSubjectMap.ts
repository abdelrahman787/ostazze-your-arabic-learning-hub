// Maps a course code prefix (e.g. "MATH101" -> "MATH") to a parent subject
// that aligns with the subject names teachers list on their profiles.
// When a course has no direct mapping, we fall back to the department name.

type SubjectName = { ar: string; en: string };

// Prefix -> parent subject. Keys must be UPPERCASE and stripped of digits.
const PREFIX_MAP: Record<string, SubjectName> = {
  // Mathematics & Statistics
  MATH: { ar: "رياضيات", en: "Mathematics" },
  STAT: { ar: "الإحصاء", en: "Statistics" },
  GMAT: { ar: "رياضيات", en: "Mathematics" },

  // Physics
  PHYS: { ar: "فيزياء", en: "Physics" },

  // Chemistry
  CHEM: { ar: "كيمياء", en: "Chemistry" },
  PHCH: { ar: "كيمياء", en: "Chemistry" },
  BIOM: { ar: "كيمياء حيوية", en: "Biochemistry" },

  // Biology / Life Sciences
  BIOL: { ar: "أحياء", en: "Biology" },
  ENVS: { ar: "علوم البيئة", en: "Environmental Science" },
  ESCI: { ar: "علوم الأرض", en: "Earth Science" },
  MARE: { ar: "علوم البحار", en: "Marine Science" },

  // Computer Science / Programming
  CS: { ar: "علوم الحاسب", en: "Computer Science" },
  CMPE: { ar: "علوم الحاسب", en: "Computer Science" },
  SENG: { ar: "علوم الحاسب", en: "Computer Science" },
  GCS: { ar: "علوم الحاسب", en: "Computer Science" },
  AOIT: { ar: "علوم الحاسب", en: "Computer Science" },
  LUIT: { ar: "علوم الحاسب", en: "Computer Science" },
  QMIS: { ar: "علوم الحاسب", en: "Computer Science" },

  // Engineering
  ELEC: { ar: "كهرومغناطيسية", en: "Electrical Engineering" },
  ELEE: { ar: "كهرومغناطيسية", en: "Electrical Engineering" },
  MECH: { ar: "ميكانيكا", en: "Mechanics" },
  HMEC: { ar: "ميكانيكا", en: "Mechanics" },
  CIVL: { ar: "هندسة مدنية", en: "Civil Engineering" },
  CVLE: { ar: "هندسة مدنية", en: "Civil Engineering" },
  CHEN: { ar: "هندسة كيميائية", en: "Chemical Engineering" },
  HCHE: { ar: "هندسة كيميائية", en: "Chemical Engineering" },
  INDE: { ar: "هندسة صناعية", en: "Industrial Engineering" },
  PETE: { ar: "هندسة بترول", en: "Petroleum Engineering" },
  ARCH: { ar: "عمارة", en: "Architecture" },

  // Languages
  ENGL: { ar: "لغة إنجليزية", en: "English Language" },
  AENG: { ar: "لغة إنجليزية", en: "English Language" },
  ALHL: { ar: "لغة إنجليزية", en: "English Language" },
  ARAB: { ar: "أدب", en: "Arabic Literature" },

  // Business & Economics
  ACCT: { ar: "المحاسبة المالية", en: "Accounting" },
  ACCS: { ar: "المحاسبة المالية", en: "Accounting" },
  GACC: { ar: "المحاسبة المالية", en: "Accounting" },
  ECON: { ar: "اقتصاد", en: "Economics" },
  FIN: { ar: "تمويل", en: "Finance" },
  FINA: { ar: "تمويل", en: "Finance" },
  GFIN: { ar: "تمويل", en: "Finance" },
  MKTG: { ar: "التسويق", en: "Marketing" },
  GMKT: { ar: "التسويق", en: "Marketing" },
  MGMT: { ar: "إدارة أعمال", en: "Management" },
  BUSN: { ar: "إدارة أعمال", en: "Management" },
  LUBS: { ar: "إدارة أعمال", en: "Management" },

  // Social sciences & humanities
  PSYC: { ar: "علم النفس", en: "Psychology" },
  SOC: { ar: "علم الاجتماع", en: "Sociology" },
  PHIL: { ar: "فلسفة", en: "Philosophy" },
  HIST: { ar: "تاريخ", en: "History" },
  GEOG: { ar: "جغرافيا", en: "Geography" },
  COMM: { ar: "اتصال", en: "Communication" },
  MCOM: { ar: "إعلام", en: "Mass Communication" },
  INTA: { ar: "علاقات دولية", en: "International Relations" },

  // Law
  LAW: { ar: "قانون", en: "Law" },
  LAWP: { ar: "قانون", en: "Law" },
  LULAW: { ar: "قانون", en: "Law" },
  CCLA: { ar: "قانون", en: "Law" },

  // Education
  EDUC: { ar: "تربية", en: "Education" },
  EDPS: { ar: "تربية", en: "Education" },
  EDAC: { ar: "تربية", en: "Education" },
  LUED: { ar: "تربية", en: "Education" },

  // Medical / Health
  MED: { ar: "طب", en: "Medicine" },
  MEDS: { ar: "طب", en: "Medicine" },
  NURS: { ar: "تمريض", en: "Nursing" },
  PHRM: { ar: "صيدلة", en: "Pharmacy" },
  PHYT: { ar: "علاج طبيعي", en: "Physical Therapy" },
  MIDW: { ar: "قبالة", en: "Midwifery" },
  PBHL: { ar: "صحة عامة", en: "Public Health" },
  CLIN: { ar: "علوم سريرية", en: "Clinical Sciences" },
  RADS: { ar: "أشعة", en: "Radiology" },
  PAIN: { ar: "تخدير", en: "Anesthesia" },
  MLSC: { ar: "علوم مخبرية", en: "Medical Laboratory" },

  // Library / info
  LIS: { ar: "علم المكتبات", en: "Library Science" },
};

/**
 * Extract the alphabetic prefix from a course code like "MATH101" -> "MATH".
 */
export const getCoursePrefix = (code: string): string => {
  const match = code.toUpperCase().match(/^[A-Z]+/);
  return match ? match[0] : code.toUpperCase();
};

/**
 * Resolve a course to its parent searchable subject.
 * Falls back to the department name when no mapping exists.
 */
export const resolveCourseSubject = (
  courseCode: string,
  fallback: { ar: string; en: string },
  lang: "ar" | "en"
): string => {
  const prefix = getCoursePrefix(courseCode);
  const subject = PREFIX_MAP[prefix];
  if (subject) return subject[lang];
  return lang === "ar" ? fallback.ar : fallback.en;
};
