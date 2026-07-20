// Deterministic realistic avatar assignment for teachers without a profile picture.
// Picks from a small curated pool based on inferred gender + regional style from the name.
import khaleejiMale1 from "@/assets/avatars/khaleeji-male-1.jpg";
import khaleejiMale2 from "@/assets/avatars/khaleeji-male-2.jpg";
import khaleejiFemale1 from "@/assets/avatars/khaleeji-female-1.jpg";
import khaleejiFemale2 from "@/assets/avatars/khaleeji-female-2.jpg";
import arabMale1 from "@/assets/avatars/arab-male-1.jpg";
import arabMale2 from "@/assets/avatars/arab-male-2.jpg";
import arabFemale1 from "@/assets/avatars/arab-female-1.jpg";
import arabFemale2 from "@/assets/avatars/arab-female-2.jpg";

const POOLS = {
  khaleejiMale: [khaleejiMale1, khaleejiMale2],
  khaleejiFemale: [khaleejiFemale1, khaleejiFemale2],
  arabMale: [arabMale1, arabMale2],
  arabFemale: [arabFemale1, arabFemale2],
};

// Female name markers (Arabic + Latin common Arab female names).
const FEMALE_TOKENS = [
  "فاطمة", "عائشة", "خديجة", "مريم", "سارة", "ساره", "نورة", "نوره", "هيا", "شهد",
  "ريم", "لمى", "لمي", "دانة", "دانه", "رغد", "أميرة", "اميرة", "هند", "لطيفة",
  "منى", "منال", "سلمى", "سلمي", "لينا", "روان", "رنا", "غادة", "غاده", "شيماء",
  "أسماء", "اسماء", "بشرى", "نجلاء", "هدى", "هدي", "ياسمين", "ملك", "جنى", "جنه",
  "fatima", "aisha", "khadija", "maryam", "sara", "sarah", "noura", "nora", "haya",
  "reem", "lama", "dana", "raghad", "amira", "hind", "latifa", "mona", "manal",
  "salma", "lina", "rawan", "rana", "ghada", "shaimaa", "asma", "huda", "yasmin",
  "malak", "jana",
];

// Khaleeji (Gulf) markers — tribal/family prefixes and common Gulf given names.
const KHALEEJI_TOKENS = [
  "الشمري", "الغامدي", "القحطاني", "العتيبي", "المطيري", "السبيعي", "الدوسري",
  "الخالدي", "الحربي", "العنزي", "الرشيدي", "الزهراني", "المالكي", "الفهد",
  "السعود", "الكواري", "المنصوري", "النعيمي", "الهاجري", "المري", "الكعبي",
  "بن ", "آل ", "بنت ",
  "سعود", "فيصل", "تركي", "سلطان", "منصور", "ناصر", "بندر", "مشعل", "طلال",
  "نايف", "بدر",
  "al-", "al ", "bin ", "bint ",
];

const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const isFemale = (name: string): boolean => {
  const lower = name.toLowerCase();
  if (FEMALE_TOKENS.some((t) => lower.includes(t))) return true;
  // Arabic taa marbuta ending on any word is a strong female signal.
  if (/\bة\b|ة$|ة\s/.test(name)) return true;
  return false;
};

const isKhaleeji = (name: string): boolean => {
  const lower = name.toLowerCase();
  return KHALEEJI_TOKENS.some((t) => lower.includes(t.toLowerCase()));
};

export const getTeacherAvatar = (teacherId: string, fullName: string): string => {
  const female = isFemale(fullName);
  const khaleeji = isKhaleeji(fullName);
  const pool = khaleeji
    ? female ? POOLS.khaleejiFemale : POOLS.khaleejiMale
    : female ? POOLS.arabFemale : POOLS.arabMale;
  return pool[hash(teacherId) % pool.length];
};
