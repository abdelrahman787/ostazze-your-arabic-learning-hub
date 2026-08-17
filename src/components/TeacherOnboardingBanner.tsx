import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

/** Prompts newly accepted teachers to finish password / profile / bank setup. */
const TeacherOnboardingBanner = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) setPending(data ? data.onboarding_completed === false : false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!pending) return null;

  return (
    <div className="container pt-4">
      <div className="card-base p-4 flex flex-wrap items-center gap-4 border-primary/40">
        <span className="icon-box bg-primary/10 text-primary">
          <Rocket size={18} />
        </span>
        <p className="flex-1 min-w-[220px] text-sm font-bold">
          {isAr
            ? "أكمل تفعيل حسابك: كلمة المرور، الملف الشخصي، والحساب البنكي لاستلام أرباحك."
            : "Finish your setup: password, profile, and bank details to receive your earnings."}
        </p>
        <Link to="/teacher/onboarding" className="btn-primary text-sm px-4 py-2.5">
          {isAr ? "إكمال الخطوات" : "Complete setup"}
        </Link>
      </div>
    </div>
  );
};

export default TeacherOnboardingBanner;
