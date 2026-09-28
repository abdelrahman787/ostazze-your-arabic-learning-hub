import { Link } from "@/lib/router-compat";
import { Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Prompts newly accepted teachers to finish password / profile / bank setup.
 * Rendered inside the dashboard content area (below the navbar and sticky
 * header) only after the parent has resolved the onboarding status.
 */
const TeacherOnboardingBanner = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <section
      aria-label={isAr ? "إكمال إعداد الحساب" : "Finish account setup"}
      className="mb-6 rounded-2xl border border-primary/40 bg-card text-card-foreground p-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 sm:flex sm:gap-4"
    >
      <span className="icon-box bg-primary/10 text-primary shrink-0" aria-hidden="true">
        <Rocket size={18} />
      </span>
      <p className="min-w-0 sm:flex-1 text-sm font-bold break-words">
        {isAr
          ? "أكمل تفعيل حسابك: كلمة المرور، الملف الشخصي، والحساب البنكي لاستلام أرباحك."
          : "Finish your setup: password, profile, and bank details to receive your earnings."}
      </p>
      <Link
        to="/teacher/onboarding"
        className="btn-primary col-span-2 text-center text-sm px-4 py-2.5 min-h-11 inline-flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      >
        {isAr ? "إكمال الخطوات" : "Complete setup"}
      </Link>
    </section>
  );
};

export default TeacherOnboardingBanner;
