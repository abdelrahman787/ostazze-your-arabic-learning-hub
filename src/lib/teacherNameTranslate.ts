/**
 * Bilingual name fallback helpers.
 * When a teacher has only one name form stored, we phonetically
 * transliterate to the active language so the UI never shows a
 * Latin name on an Arabic page (or vice-versa).
 */

// Arabic letter → Latin phoneme
const AR_TO_EN: Record<string, string> = {
  "ا": "a", "أ": "a", "إ": "i", "آ": "aa", "ب": "b", "ت": "t", "ث": "th",
  "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z",
  "س": "s", "ش": "sh", "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a",
  "غ": "gh", "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n",
  "ه": "h", "و": "w", "ي": "y", "ى": "a", "ة": "h", "ء": "", "ؤ": "o", "ئ": "e",
};

export const arToEn = (name: string): string =>
  name
    .split("")
    .map((ch) => (AR_TO_EN[ch] !== undefined ? AR_TO_EN[ch] : ch))
    .join("")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// Multi-char Latin sequences first so they win over single letters.
const EN_SEQUENCES: [RegExp, string][] = [
  [/kh/g, "خ"], [/gh/g, "غ"], [/sh/g, "ش"], [/th/g, "ث"], [/ch/g, "تش"],
  [/oo/g, "و"], [/ee/g, "ي"], [/aa/g, "ا"], [/ou/g, "و"], [/ck/g, "ك"],
];

const EN_TO_AR: Record<string, string> = {
  a: "ا", b: "ب", c: "ك", d: "د", e: "ي", f: "ف", g: "ج", h: "ه", i: "ي",
  j: "ج", k: "ك", l: "ل", m: "م", n: "ن", o: "و", p: "ب", q: "ق", r: "ر",
  s: "س", t: "ت", u: "و", v: "ف", w: "و", x: "كس", y: "ي", z: "ز",
};

export const enToAr = (name: string): string => {
  let out = name.toLowerCase();
  for (const [re, rep] of EN_SEQUENCES) out = out.replace(re, rep);
  out = out
    .split("")
    .map((ch) => (EN_TO_AR[ch] !== undefined ? EN_TO_AR[ch] : ch))
    .join("");
  return out
    .split(/\s+/)
    .filter(Boolean)
    .join(" ")
    .trim();
};

const hasArabic = (s: string) => /[\u0600-\u06FF]/.test(s);
const hasLatin = (s: string) => /[A-Za-z]/.test(s);

/**
 * Resolve a teacher's display name for the active language.
 * - Uses the stored localized field when present.
 * - Falls back to phonetic transliteration of the other field.
 */
export const resolveDisplayName = (
  lang: "ar" | "en",
  arName: string | null | undefined,
  enName: string | null | undefined,
  fallback: string
): string => {
  if (lang === "en") {
    if (enName) return enName;
    if (arName && hasArabic(arName)) return arToEn(arName);
    return arName || fallback;
  }
  // Arabic
  if (arName) return arName;
  if (enName && hasLatin(enName)) return enToAr(enName);
  return enName || fallback;
};
