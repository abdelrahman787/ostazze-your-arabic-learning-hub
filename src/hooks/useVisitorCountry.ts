import { useEffect, useState } from "react";
import { normalizeCountry, type Country } from "@/lib/pricing";

const KEY = "ostaze_geo_country";

function guessFromTimezone(): string | null {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const map: Record<string, string> = {
    "Africa/Cairo": "EG", "Asia/Riyadh": "SA", "Asia/Dubai": "AE", "Asia/Qatar": "QA",
    "Asia/Kuwait": "KW", "Asia/Bahrain": "BH", "Asia/Muscat": "OM", "Asia/Amman": "JO",
    "Europe/London": "GB",
  };
  return map[tz] ?? null;
}

/** Detects the visitor's country from their IP (cached), falling back to timezone. */
export function useVisitorCountry(): { country: Country; loading: boolean } {
  const cached = typeof window !== "undefined" ? sessionStorage.getItem(KEY) : null;
  const [raw, setRaw] = useState<string | null>(cached ?? guessFromTimezone());
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    fetch("https://api.country.is/", { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d: { country?: string }) => {
        if (d?.country) {
          sessionStorage.setItem(KEY, d.country);
          setRaw(d.country);
        }
      })
      .catch(() => {})
      .finally(() => { clearTimeout(t); setLoading(false); });
    return () => ctrl.abort();
  }, [cached]);

  return { country: normalizeCountry(raw), loading };
}
