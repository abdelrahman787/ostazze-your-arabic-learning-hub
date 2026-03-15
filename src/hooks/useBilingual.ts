import { useLanguage } from "@/contexts/LanguageContext";
import { useCallback } from "react";

/**
 * Returns the appropriate bilingual field value based on current language.
 * Falls back: en field → ar field → fallback
 */
export const useBilingual = () => {
  const { lang } = useLanguage();

  const b = useCallback(
    (arValue: string | null | undefined, enValue: string | null | undefined, fallback = "") => {
      if (lang === "en") return enValue || arValue || fallback;
      return arValue || enValue || fallback;
    },
    [lang]
  );

  const bArr = useCallback(
    (arArr: string[] | null | undefined, enArr: string[] | null | undefined) => {
      if (lang === "en" && enArr && enArr.length > 0) return enArr;
      return arArr || [];
    },
    [lang]
  );

  return { b, bArr };
};
