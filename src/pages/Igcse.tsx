import { useMemo, useState } from "react";
import { BookOpen, Search, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVisitorCountry } from "@/hooks/useVisitorCountry";
import { CURRENCIES, SAR_TO_EGP } from "@/lib/pricing";
import { waLink } from "@/lib/whatsapp";
import {
  IG_COURSES,
  IG_DEPARTMENTS,
  IG_SUBJECTS,
  IG_TEACHERS,
} from "@/data/igcse";

const teacherById = new Map(IG_TEACHERS.map((t) => [t.id, t]));

export default function Igcse() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const { country } = useVisitorCountry();
  const [dept, setDept] = useState("");
  const [teacher, setTeacher] = useState("");
  const [teacherQuery, setTeacherQuery] = useState("");
  const [subject, setSubject] = useState("");

  const subjectLabel = (en: string) =>
    ar ? (IG_SUBJECTS.find((s) => s.en === en)?.ar ?? en) : en;

  const fmt = (egp: number) => {
    const c = CURRENCIES[country];
    const f = 10 ** c.decimals;
    const n = Math.round((egp / SAR_TO_EGP) * c.rate * f) / f;
    const s = n.toLocaleString(ar ? "ar-EG" : "en-US");
    return ar ? `${s} ${c.symbol}` : `${s} ${c.currency}`;
  };

  const teachers = useMemo(() => {
    const q = teacherQuery.trim().toLowerCase();
    return IG_TEACHERS.filter(
      (t) =>
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.name_ar.includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q)),
    );
  }, [teacherQuery]);

  const courses = IG_COURSES.filter(
    (c) =>
      (!teacher || c.teacherId === teacher) && (!subject || c.subject === subject),
  );

  return (
    <div className="min-h-screen pb-16">
      <PageHelmet
        title={ar ? "كورسات IGCSE — استاذي" : "IGCSE Courses — OSTAZE"}
        description={
          ar
            ? "كورسات IGCSE أونلاين في الفيزياء والكيمياء والأحياء والرياضيات والإنجليزية وغيرها، بسعر ثابت لكل كورس."
            : "Online IGCSE courses in Physics, Chemistry, Biology, Math, English and more, each at a fixed price."
        }
      />
      <PageHeader
        title={ar ? "استكشف كورسات IGCSE" : "Explore IGCSE Courses"}
        variant="teachers"
      />

      <div className="container mx-auto px-4 mt-10 ">

        <section aria-live="polite">
          <p className="text-sm text-muted-foreground mb-4">
            {ar ? `${courses.length} كورس` : `${courses.length} courses`}
          </p>
          {courses.length === 0 ? (
            <p className="card-base p-8 text-center text-muted-foreground">
              {ar ? "لا توجد كورسات مطابقة." : "No courses match these filters."}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {courses.map((c) => {
                const t = teacherById.get(c.teacherId)!;
                const tName = ar ? t.name_ar : t.name;
                return (
                  <article key={c.id} className="card-base overflow-hidden flex flex-col">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                      <BookOpen size={40} className="text-primary" />
                      <span className="absolute top-3 start-3 text-xs font-bold bg-background/90 text-foreground rounded-full px-2.5 py-1">
                        {ar ? "كورس أونلاين" : "Online Course"}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-primary">{subjectLabel(c.subject)}</span>
                        <span className="text-muted-foreground">{c.board}</span>
                      </div>
                      <h3 className="font-extrabold leading-snug"><Link to="/igcse/$courseId" params={{ courseId: c.id }} className="hover:underline focus-visible:underline">{c.title}</Link></h3>
                      <div className="flex items-center justify-between mt-auto pt-2 text-sm">
                        <span className="text-muted-foreground truncate">{tName}</span>
                        <span className="font-black text-primary whitespace-nowrap">{fmt(c.priceEGP)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                      <Link to="/igcse/$courseId" params={{ courseId: c.id }} className="btn-outline text-center">
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
