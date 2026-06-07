// OSTAZE pricing & currency conversion
// Fixed per-country session price. At checkout we always charge in EGP.

export type Country = "EG" | "QA" | "KW";

export const COUNTRY_LABELS: Record<Country, { ar: string; en: string; flag: string }> = {
  EG: { ar: "مصر", en: "Egypt", flag: "🇪🇬" },
  QA: { ar: "قطر", en: "Qatar", flag: "🇶🇦" },
  KW: { ar: "الكويت", en: "Kuwait", flag: "🇰🇼" },
};

// Display price per session in the user's local currency
export const SESSION_PRICE: Record<Country, { amount: number; currency: string; symbol: string }> = {
  EG: { amount: 200, currency: "EGP", symbol: "ج.م" },
  QA: { amount: 150, currency: "QAR", symbol: "ر.ق" },
  KW: { amount: 120, currency: "KWD", symbol: "د.ك" },
};

// FX → EGP (used only at checkout)
export const FX_TO_EGP: Record<Country, number> = {
  EG: 1,
  QA: 14.64,
  KW: 14.54,
};

export function getDisplayPrice(country: Country | null | undefined) {
  const c = (country || "EG") as Country;
  return SESSION_PRICE[c];
}

export function getCheckoutAmountEGP(country: Country | null | undefined): number {
  const c = (country || "EG") as Country;
  const { amount } = SESSION_PRICE[c];
  return Math.round(amount * FX_TO_EGP[c] * 100) / 100; // EGP
}

export function formatPrice(country: Country | null | undefined, lang: "ar" | "en" = "ar") {
  const p = getDisplayPrice(country);
  return lang === "ar" ? `${p.amount} ${p.symbol}` : `${p.amount} ${p.currency}`;
}
