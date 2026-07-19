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
  { name: { ar: "عبدالله المالكي", en: "Abdullah Al-Malki" }, university: { ar: "جامعة الكويت", en: "Kuwait University" }, quote: { ar: "بفضل Ostaze، تمكنت من رفع معدلي في مادة التفاضل والتكامل من C إلى A+.", en: "Thanks to Ostaze, I was able to raise my Calculus grade from C to A+." }, avatar: "/__l5e/assets-v1/65a4dec8-a28e-4e6b-94d9-fd81a043941f/abdullah-al-malki.png" },
  { name: { ar: "نورا الشمري", en: "Noura Al-Shammari" }, university: { ar: "جامعة قطر", en: "Qatar University" }, quote: { ar: "أفضل منصة تعليمية استخدمتها! حجز الجلسات سهل والمعلمون متميزون.", en: "Best learning platform I've used! Booking sessions is easy and the teachers are outstanding." }, avatar: "/__l5e/assets-v1/191d2b13-b086-4aa6-97aa-33908812c022/noura-al-shammari.png" },
  { name: { ar: "فيصل الدوسري", en: "Faisal Al-Dosari" }, university: pickKsaUni(), quote: { ar: "ساعدتني المنصة في التغلب على صعوبات مادة الفيزياء.", en: "The platform helped me overcome difficulties in Physics." }, avatar: "/__l5e/assets-v1/c8c0f117-52b9-44d0-b310-6ca6698f1595/faisal-al-dosari.png" },
];
