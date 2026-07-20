// Deterministic realistic avatar assignment for teachers without a profile picture.
import khaleejiMale1 from "@/assets/avatars/khaleeji-male-1.jpg";
import khaleejiMale2 from "@/assets/avatars/khaleeji-male-2.jpg";
import khaleejiMale3 from "@/assets/avatars/khaleeji-male-3.jpg";
import khaleejiMale4 from "@/assets/avatars/khaleeji-male-4.jpg";
import khaleejiMale5 from "@/assets/avatars/khaleeji-male-5.jpg";
import khaleejiFemale1 from "@/assets/avatars/khaleeji-female-1.jpg";
import khaleejiFemale2 from "@/assets/avatars/khaleeji-female-2.jpg";
import khaleejiFemale3 from "@/assets/avatars/khaleeji-female-3.jpg";
import khaleejiFemale4 from "@/assets/avatars/khaleeji-female-4.jpg";
import khaleejiFemale5 from "@/assets/avatars/khaleeji-female-5.jpg";
import arabMale1 from "@/assets/avatars/arab-male-1.jpg";
import arabMale2 from "@/assets/avatars/arab-male-2.jpg";
import arabMale3 from "@/assets/avatars/arab-male-3.jpg";
import arabMale4 from "@/assets/avatars/arab-male-4.jpg";
import arabMale5 from "@/assets/avatars/arab-male-5.jpg";
import arabFemale1 from "@/assets/avatars/arab-female-1.jpg";
import arabFemale2 from "@/assets/avatars/arab-female-2.jpg";
import arabFemale3 from "@/assets/avatars/arab-female-3.jpg";
import arabFemale4 from "@/assets/avatars/arab-female-4.jpg";
import arabFemale5 from "@/assets/avatars/arab-female-5.jpg";

const POOLS = {
  khaleejiMale: [khaleejiMale1, khaleejiMale2, khaleejiMale3, khaleejiMale4, khaleejiMale5],
  khaleejiFemale: [khaleejiFemale1, khaleejiFemale2, khaleejiFemale3, khaleejiFemale4, khaleejiFemale5],
  arabMale: [arabMale1, arabMale2, arabMale3, arabMale4, arabMale5],
  arabFemale: [arabFemale1, arabFemale2, arabFemale3, arabFemale4, arabFemale5],
};

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

const KHALEEJI_TOKENS = [
  "الشمري", "الغامدي", "القحطاني", "العتيبي", "المطيري", "السبيعي", "الدوسري",
  "الخالدي", "الحربي", "العنزي", "الرشيدي", "الزهراني", "المالكي", "الفهد",
  "السعود", "الكواري", "المنصوري", "النعيمي", "الهاجري", "المري", "الكعبي",
  "بن ", "آل ", "بنت ",
  "سعود", "فيصل", "تركي", "سلطان", "منصور", "ناصر", "بندر", "مشعل", "طلال",
  "نايف", "بدر",
  "al-", "al ", "bin ", "bint ",
];

// Stronger hash (FNV-1a-ish) to spread across the pool more evenly than *31.
const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h >>> 0;
};

const isFemale = (name: string): boolean => {
  const lower = name.toLowerCase();
  if (FEMALE_TOKENS.some((t) => lower.includes(t))) return true;
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
  // Combine id + name so two teachers sharing a bucket but with different names diverge.
  return pool[hash(`${teacherId}|${fullName}`) % pool.length];
};
