import {
  ArrowUpRight,
  Atom,
  BookOpen,
  Calculator,
  Dna,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVisitorCountry } from "@/hooks/useVisitorCountry";
import { CURRENCIES, SAR_TO_EGP } from "@/lib/pricing";
import { waLink } from "@/lib/whatsapp";
import { IG_COURSES, IG_SUBJECTS, IG_TEACHERS } from "@/data/igcse";
import studyImage from "@/assets/igcse-study.jpg";

const teacherById = new Map(IG_TEACHERS.map((t) => [t.id, t]));

const subjectIcon = (en: string): LucideIcon => {
  const s = en.toLowerCase();
  if (s.includes("math")) return Calculator;
  if (s.includes("phys")) return Atom;
  if (s.includes("chem")) return FlaskConical;
  if (s.includes("bio")) return Dna;
  return BookOpen;
};

export default function Igcse() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const { country } = useVisitorCountry();
  const subjectLabel = (en: string) =>
    ar ? (IG_SUBJECTS.find((s) => s.en === en)?.ar ?? en) : en;

  const fmt = (egp: number) => {
    const c = CURRENCIES[country];
    const f = 10 ** c.decimals;
    const n = Math.round((egp / SAR_TO_EGP) * c.rate * f) / f;
    const s = n.toLocaleString(ar ? "ar-EG" : "en-US");
    return ar ? `${s} ${c.symbol}` : `${s} ${c.currency}`;
  };

  const courses = IG_COURSES;
  const boards = Array.from(new Set(courses.map((c) => c.board)));

  return (
    <div className="min-h-screen bg-background pb-16" dir={ar ? "rtl" : "ltr"}>
      <section
        aria-labelledby="igcse-title"
        className="pt-page pb-12 md:pb-16 overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 text-primary text-sm font-bold mb-5">
                <BookOpen size={18} aria-hidden="true" />
                <span>{ar ? "خطوتك القادمة تبدأ هنا" : "YOUR NEXT CHAPTER"}</span>
              </div>
              <h1
                id="igcse-title"
                className="!font-sans !tracking-normal !font-black text-5xl md:text-6xl leading-tight text-foreground mb-4"
              >
                <span dir="ltr">
                  IGCSE<span className="text-primary">.</span>
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-5 leading-snug">
                {ar
                  ? "استكشف كورسات IGCSE واستعد بثقة."
                  : "Explore IGCSE courses. Walk in confident."}
              </p>
              <p className="text-muted-foreground text-base leading-relaxed max-w-lg mb-6">
                {ar
                  ? "اختر المادة والمنهج المناسبين لك، وتعلّم مع مدرسين متخصصين من أول مفهوم حتى يوم الامتحان."
                  : "Pick the subject and exam board that fit you, and learn with specialist tutors from your first concept to exam day."}
              </p>
              <p className="text-sm text-primary font-semibold" dir="ltr">
                {boards.join(" · ")}
              </p>
            </div>
            <div className="relative">
              <img
                src={studyImage}
                alt={
                  ar
                    ? "دفتر رياضيات وآلة حاسبة وكتب ومنشور ضوئي"
                    : "Maths notebook, calculator, study books and a glass prism"
                }
                width={1280}
                height={960}
                decoding="async"
                className="w-full aspect-[4/3] object-cover rounded-lg"
              />
              <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-2 bg-card text-card-foreground border border-border rounded-md px-4 py-3">
                <span className="font-bold text-sm">
                  {ar
                    ? "طموح كبير. خطوة بخطوة."
                    : "Big ambitions. One step at a time."}
                </span>
                <span className="text-primary text-xs font-bold" dir="ltr">
                  O Level → AS / A Level
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <section
          aria-live="polite"
          className="border-t border-primary/20 pt-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
            <h2 className="!font-sans !tracking-normal !font-bold text-base text-foreground">
              {ar ? "ابدأ بمادتك" : "Find your starting point"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {ar ? `${courses.length} كورس` : `${courses.length} courses`}
            </p>
          </div>
          {courses.length === 0 ? (
            <p className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
              {ar ? "لا توجد كورسات حالياً." : "No courses available yet."}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map((c) => {
                const t = teacherById.get(c.teacherId);
                if (!t) return null;
                const tName = ar ? t.name_ar : t.name;
                const Icon = subjectIcon(c.subject);
                return (
                  <article
                    key={c.id}
                    className="group flex flex-col gap-3 p-5 bg-card text-card-foreground rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className="text-primary shrink-0 w-6 h-6"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-primary">
                          {subjectLabel(c.subject)}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {c.board}
                        </span>
                      </div>
                      <ArrowUpRight
                        className="text-primary w-4 h-4 shrink-0 rtl:-scale-x-100 motion-safe:group-hover:-translate-y-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="!font-sans !tracking-normal font-extrabold leading-snug text-foreground">
                      <Link
                        to="/igcse/$courseId"
                        params={{ courseId: c.id }}
                        className="hover:underline focus-visible:underline focus-visible:outline-none"
                      >
                        {c.title}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-border text-sm">
                      <span className="text-muted-foreground truncate">
                        {tName}
                      </span>
                      <span className="font-black text-primary whitespace-nowrap">
                        {fmt(c.priceEGP)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/igcse/$courseId"
                        params={{ courseId: c.id }}
                        className="btn-outline text-center"
                      >
                        {ar ? "التفاصيل" : "Details"}
                      </Link>
                      <a
                        href={waLink(
                          ar
                            ? `أرغب في التسجيل في كورس ${c.title} مع ${tName}`
                            : `I'd like to enroll in ${c.title} with ${tName}`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-center"
                      >
                        {ar ? "سجّل الآن" : "Enroll Now"}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          {country !== "EG" && (
            <p className="text-xs text-muted-foreground mt-6">
              {ar
                ? "الأسعار معروضة بعملتك تقريبياً، والدفع يتم بالجنيه المصري."
                : "Prices are shown approximately in your currency; payment is in Egyptian pounds."}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
