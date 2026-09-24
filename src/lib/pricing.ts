// OSTAZE pricing & currency conversion
// One hour = 125 SAR. Shown in the visitor's local currency; always charged in EGP.

export const BASE_PRICE_SAR = 125;

// Approximate FX: 1 SAR → local currency. Keep SAR_TO_EGP in sync with create-checkout.
export const CURRENCIES = {
  EG: { currency: "EGP", symbol: "ج.م", rate: 12.95, decimals: 0, ar: "مصر", en: "Egypt", flag: "🇪🇬" },
  SA: { currency: "SAR", symbol: "ر.س", rate: 1, decimals: 0, ar: "السعودية", en: "Saudi Arabia", flag: "🇸🇦" },
  AE: { currency: "AED", symbol: "د.إ", rate: 0.979, decimals: 0, ar: "الإمارات", en: "UAE", flag: "🇦🇪" },
  QA: { currency: "QAR", symbol: "ر.ق", rate: 0.971, decimals: 0, ar: "قطر", en: "Qatar", flag: "🇶🇦" },
  KW: { currency: "KWD", symbol: "د.ك", rate: 0.0819, decimals: 2, ar: "الكويت", en: "Kuwait", flag: "🇰🇼" },
  BH: { currency: "BHD", symbol: "د.ب", rate: 0.1003, decimals: 2, ar: "البحرين", en: "Bahrain", flag: "🇧🇭" },
  OM: { currency: "OMR", symbol: "ر.ع", rate: 0.1026, decimals: 2, ar: "عُمان", en: "Oman", flag: "🇴🇲" },
  JO: { currency: "JOD", symbol: "د.أ", rate: 0.189, decimals: 2, ar: "الأردن", en: "Jordan", flag: "🇯🇴" },
  US: { currency: "USD", symbol: "$", rate: 0.2667, decimals: 0, ar: "أمريكا", en: "United States", flag: "🇺🇸" },
  GB: { currency: "GBP", symbol: "£", rate: 0.21, decimals: 0, ar: "بريطانيا", en: "United Kingdom", flag: "🇬🇧" },
} as const;

export type Country = keyof typeof CURRENCIES;
export const SAR_TO_EGP = CURRENCIES.EG.rate;

export const COUNTRY_LABELS = CURRENCIES;

export function normalizeCountry(c: string | null | undefined): Country {
  const up = (c || "").toUpperCase();
  if (up in CURRENCIES) return up as Country;
  // Eurozone and other countries fall back to USD
  return c ? "US" : "EG";
}

export function getDisplayPrice(country: string | null | undefined, hours = 1) {
  const c = CURRENCIES[normalizeCountry(country)];
  const f = 10 ** c.decimals;
  const amount = Math.round(BASE_PRICE_SAR * hours * c.rate * f) / f;
  return { amount, currency: c.currency, symbol: c.symbol };
}

// Kept for older callers
export const SESSION_PRICE = new Proxy({} as Record<Country, ReturnType<typeof getDisplayPrice>>, {
  get: (_t, k: string) => getDisplayPrice(k),
});

export function getCheckoutAmountEGP(_country?: string | null): number {
  return Math.round(BASE_PRICE_SAR * SAR_TO_EGP * 100) / 100;
}

export function formatPrice(country: string | null | undefined, lang: "ar" | "en" = "ar", hours = 1) {
  const p = getDisplayPrice(country, hours);
  const n = p.amount.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
  return lang === "ar" ? `${n} ${p.symbol}` : `${n} ${p.currency}`;
}
