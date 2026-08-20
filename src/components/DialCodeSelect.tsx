import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
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

/** Compact country dial-code picker: trigger shows flag+code only; dropdown shows country names. */
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = DIAL_CODES.find((c) => c.code === value) || DIAL_CODES[0];

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        dir="ltr"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={isAr ? "مفتاح الدولة" : "Country code"}
        className={`input-base h-[42px] w-[82px] sm:w-[92px] flex items-center justify-between gap-1 px-2 text-sm font-semibold ${className}`}
      >
        <span className="truncate">
          {selected.flag} +{selected.code}
        </span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          dir="ltr"
          className="absolute z-50 mt-1 max-h-72 w-[210px] sm:w-[230px] overflow-auto rounded-xl border border-border bg-background shadow-lg p-1"
        >
          {DIAL_CODES.map((c) => (
            <li
              key={c.iso}
              role="option"
              aria-selected={c.code === value}
              onClick={() => {
                onChange(c.code);
                setOpen(false);
              }}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary ${
                c.code === value ? "bg-primary/10 text-primary" : ""
              }`}
            >
              <span className="mr-2">{c.flag}</span>
              +{c.code} — {isAr ? c.ar : c.en}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DialCodeSelect;
