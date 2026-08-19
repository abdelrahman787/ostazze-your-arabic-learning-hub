// Standalone testimonials export — kept free of heavy imports so the homepage
// bundle does not pull in the full universitiesData catalog.

const KSA_UNI_POOL: { ar: string; en: string }[] = [
  { ar: "جامعة الملك سعود", en: "King Saud University" },
  { ar: "جامعة الملك عبدالعزيز", en: "King Abdulaziz University" },
  { ar: "جامعة الملك فهد للبترول والمعادن", en: "King Fahd University of Petroleum & Minerals" },
  { ar: "جامعة الملك خالد", en: "King Khalid University" },
  { ar: "جامعة الأميرة نورة بنت عبدالرحمن", en: "Princess Nourah bint Abdulrahman University" },
  { ar: "جامعة الإمام عبدالرحمن بن فيصل", en: "Imam Abdulrahman Bin Faisal University" },
  { ar: "جامعة أم القرى", en: "Umm Al-Qura University" },
  { ar: "جامعة الملك عبدالله للعلوم والتقنية (كاوست)", en: "King Abdullah University of Science and Technology (KAUST)" },
  { ar: "جامعة الفيصل", en: "Alfaisal University" },
];
const pickKsaUni = () => KSA_UNI_POOL[Math.floor(Math.random() * KSA_UNI_POOL.length)];

export const mockTestimonials = [
  { name: { ar: "عبدالله المالكي", en: "Abdullah Al-Malki" }, university: { ar: "جامعة الكويت", en: "Kuwait University" }, quote: { ar: "نجحت في اختبار التفاضل والتكامل بفضل الله اولا ثم الدكاتره على هذه المنصة. ", en: "I passed my Calculus exam thanks to God first and then the doctors on this platform." }, avatar: "/__l5e/assets-v1/16123577-8ccf-430d-a7c7-a1396bd60e27/abdullah-al-malki.webp" },
  { name: { ar: "نورا الشمري", en: "Noura Al-Shammari" }, university: { ar: "جامعة قطر", en: "Qatar University" }, quote: { ar: "قدرت الحق الامتحانات هذا العام و المعلمون متميزون جدا.", en: "I was able to catch up with exams this year and the teachers are very distinguished." }, avatar: "/__l5e/assets-v1/a7f9f9b2-7eb7-4181-8893-c19927bd706d/noura-al-shammari.webp" },
  { name: { ar: "فيصل الدوسري", en: "Faisal Al-Dosari" }, university: { ar: "جامعة الملك عبدالله", en: "King Abdullah University" }, quote: { ar: "ساعدتني المنصة في التغلب على صعوبات مادة الفيزياء.", en: "The platform helped me overcome difficulties in Physics." }, avatar: "/__l5e/assets-v1/6df9f683-739e-4eab-b968-395330c0329b/faisal-al-dosari.webp" },
];
