import { Country, COUNTRY_LABELS, SESSION_PRICE } from "@/lib/pricing";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  value: Country | "";
  onChange: (c: Country) => void;
  required?: boolean;
}

export default function CountrySelector({ value, onChange, required }: Props) {
  const { lang } = useLanguage();
  const codes: Country[] = ["EG"];

  return (
    <div className="grid grid-cols-1 gap-2">
      {codes.map((c) => {
        const meta = COUNTRY_LABELS[c];
        const price = SESSION_PRICE[c];
        const active = value === c;
        return (
          <button
            type="button"
            key={c}
            onClick={() => onChange(c)}
            className={`rounded-xl border-2 p-3 text-center transition-all ${
              active
                ? "border-primary bg-primary/10 shadow-md"
                : "border-input bg-background hover:border-primary/50"
            }`}
            aria-pressed={active}
          >
            <div className="text-2xl mb-1" aria-hidden>{meta.flag}</div>
            <div className="text-sm font-bold">{meta[lang]}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {price.amount} {lang === "ar" ? price.symbol : price.currency}
            </div>
          </button>
        );
      })}
    </div>
  );
}
