/**
 * Single source of truth for OSTAZE's public business identity.
 * Used by Organization JSON-LD, footer, contact page, WhatsApp links and policy pages.
 * Only verified facts live here — no legalName, registration number or street address
 * until an official company is registered.
 */
export const SITE = {
  name: "OSTAZE",
  alternateNameAr: "أستاذي",
  url: "https://ostaze.com",
  // Real crawlable 192x192 PNG in /public (>= 112x112 required by Google).
  logo: "https://ostaze.com/favicon-192.png",
  email: "info@ostaze.com",
  phone: "+201130382206",
  phoneDisplay: "+20 11 3038 2206",
  whatsapp: "201130382206", // wa.me format, same line as phone
  city: { ar: "القاهرة", en: "Cairo" },
  country: { ar: "مصر", en: "Egypt", code: "EG" },
  // Verified third-party profiles only. Never include the site's own URL.
  social: [
    { network: "Facebook", url: "https://www.facebook.com/profile.php?id=61588891482013" },
  ] as const,
} as const;
