import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import CountrySelector from "@/components/CountrySelector";
import type { Country } from "@/lib/pricing";
import { Loader2, Globe } from "lucide-react";
import { toast } from "sonner";

/**
 * Forces logged-in users (especially OAuth signups) to choose their country
 * once before they can use the app. Stored in profiles.country.
 */
export default function CountryGate({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [country, setCountry] = useState<Country | null | undefined>(undefined); // undefined = loading
  const [picking, setPicking] = useState<Country | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!isLoggedIn || !user) {
      setCountry(null);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("country")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      const existing = (data?.country as Country) ?? null;
      if (existing) {
        setCountry(existing);
      } else {
        // Temporary: auto-assign Egypt so the country picker never shows.
        await supabase.from("profiles").update({ country: "EG" }).eq("user_id", user.id);
        if (!cancelled) setCountry("EG");
      }
    })();
    return () => { cancelled = true; };
  }, [isLoggedIn, user?.id]);

  const { lang } = useLanguage();

  const save = async () => {
    if (!picking || !user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ country: picking })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setCountry(picking);
  };

  // Not logged in OR country already set OR still loading → just render children
  if (!isLoggedIn || country === undefined || country) return <>{children}</>;

  // Logged in but no country: blocking modal
  return (
    <>
      {children}
      <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
          <div className="text-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <Globe size={26} />
            </div>
            <h2 className="text-xl font-extrabold">
              {lang === "ar" ? "اختر دولتك" : "Choose your country"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {lang === "ar"
                ? "نحتاج معرفة دولتك لعرض الأسعار بالعملة المناسبة."
                : "We need your country to show prices in the right currency."}
            </p>
          </div>
          <CountrySelector value={picking} onChange={setPicking} />
          <button
            onClick={save}
            disabled={!picking || saving}
            className="btn-primary w-full mt-5 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {lang === "ar" ? "متابعة" : "Continue"}
          </button>
        </div>
      </div>
    </>
  );
}
