import { useLanguage } from "@/contexts/LanguageContext";

export interface DialCode {
  code: string; // digits only, no +
  iso: string;
  flag: string;
  ar: string;
  en: string;
}

export const DIAL_CODES: DialCode[] = [
  { code: "966", iso: "SA", flag: "🇸🇦", ar: "السعودية", en: "Saudi Arabia" },
  { code: "20", iso: "EG", flag: "🇪🇬", ar: "مصر", en: "Egypt" },
  { code: "965", iso: "KW", flag: "🇰🇼", ar: "الكويت", en: "Kuwait" },
  { code: "974", iso: "QA", flag: "🇶🇦", ar: "قطر", en: "Qatar" },
  { code: "971", iso: "AE", flag: "🇦🇪", ar: "الإمارات", en: "UAE" },
  { code: "973", iso: "BH", flag: "🇧🇭", ar: "البحرين", en: "Bahrain" },
  { code: "968", iso: "OM", flag: "🇴🇲", ar: "عُمان", en: "Oman" },
  { code: "962", iso: "JO", flag: "🇯🇴", ar: "الأردن", en: "Jordan" },
  { code: "961", iso: "LB", flag: "🇱🇧", ar: "لبنان", en: "Lebanon" },
  { code: "964", iso: "IQ", flag: "🇮🇶", ar: "العراق", en: "Iraq" },
  { code: "963", iso: "SY", flag: "🇸🇾", ar: "سوريا", en: "Syria" },
  { code: "967", iso: "YE", flag: "🇾🇪", ar: "اليمن", en: "Yemen" },
  { code: "970", iso: "PS", flag: "🇵🇸", ar: "فلسطين", en: "Palestine" },
  { code: "249", iso: "SD", flag: "🇸🇩", ar: "السودان", en: "Sudan" },
  { code: "218", iso: "LY", flag: "🇱🇾", ar: "ليبيا", en: "Libya" },
  { code: "216", iso: "TN", flag: "🇹🇳", ar: "تونس", en: "Tunisia" },
  { code: "213", iso: "DZ", flag: "🇩🇿", ar: "الجزائر", en: "Algeria" },
  { code: "212", iso: "MA", flag: "🇲🇦", ar: "المغرب", en: "Morocco" },
  { code: "90", iso: "TR", flag: "🇹🇷", ar: "تركيا", en: "Turkey" },
  { code: "44", iso: "GB", flag: "🇬🇧", ar: "بريطانيا", en: "United Kingdom" },
  { code: "1", iso: "US", flag: "🇺🇸", ar: "أمريكا / كندا", en: "USA / Canada" },
  { code: "49", iso: "DE", flag: "🇩🇪", ar: "ألمانيا", en: "Germany" },
  { code: "33", iso: "FR", flag: "🇫🇷", ar: "فرنسا", en: "France" },
];

/** Country dial-code dropdown for WhatsApp / phone inputs. */
const DialCodeSelect = ({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}) => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const selected = DIAL_CODES.find((c) => c.code === value) || DIAL_CODES[0];

  return (
    <select
      dir="ltr"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={isAr ? "مفتاح الدولة" : "Country code"}
      className={`input-base w-[105px] shrink-0 !px-2 text-sm font-semibold ${className}`}
    >
      {DIAL_CODES.map((c) => (
        <option key={c.iso} value={c.code}>
          {c.flag} +{c.code} — {isAr ? c.ar : c.en}
        </option>
      ))}
    </select>
  );
};

export default DialCodeSelect;
