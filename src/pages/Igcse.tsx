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

      <div className="container mx-auto px-4 mt-10 grid lg:grid-cols-[18rem_1fr] gap-8">
        <aside className="card-base p-5 space-y-6 h-fit lg:sticky lg:top-24">

          <label className="block space-y-2">
            <span className="text-sm font-bold">{ar ? "القسم" : "Department"}</span>
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="input-base">
              <option value="">{ar ? "كل الأقسام" : "All Departments"}</option>
              {IG_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <div className="space-y-2">
            <span className="text-sm font-bold block">{ar ? "المعلم" : "Teacher"}</span>
            <div className="relative">
              <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
              <input
                value={teacherQuery}
                onChange={(e) => setTeacherQuery(e.target.value)}
                className="input-base ps-8"
                placeholder={ar ? "ابحث عن معلم" : "Search teachers"}
                aria-label={ar ? "ابحث عن معلم" : "Search teachers"}
              />
            </div>
            <ul className="max-h-72 overflow-y-auto space-y-1" role="listbox" aria-label={ar ? "المعلمون" : "Teachers"}>
              <li>
                <button
                  type="button"
                  onClick={() => setTeacher("")}
                  aria-pressed={!teacher}
                  className={`w-full text-start px-3 py-2 rounded-lg text-sm font-bold ${!teacher ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                >
                  {ar ? "كل المعلمين" : "All Teachers"}
                </button>
              </li>
              {teachers.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setTeacher(t.id)}
                    aria-pressed={teacher === t.id}
                    className={`w-full flex items-center gap-2 text-start px-3 py-2 rounded-lg ${teacher === t.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                  >
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User size={14} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold truncate">{ar ? t.name_ar : t.name}</span>
                      <span className="block text-xs text-muted-foreground truncate">
                        {t.subjects.map(subjectLabel).join("، ")}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {teachers.length === 0 && (
                <li className="text-xs text-muted-foreground px-3 py-2">
                  {ar ? "لا يوجد معلم مطابق." : "No teachers match your search."}
                </li>
              )}
            </ul>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-bold">{ar ? "المادة" : "Subject"}</span>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input-base">
              <option value="">{ar ? "كل المواد" : "All Subjects"}</option>
              {IG_SUBJECTS.map((s) => (
                <option key={s.en} value={s.en}>{ar ? s.ar : s.en}</option>
              ))}
            </select>
          </label>
        </aside>

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
