import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  GraduationCap,
  Layers,
  MessageCircle,
  Monitor,
  PlayCircle,
  User,
  Users,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVisitorCountry } from "@/hooks/useVisitorCountry";
import { CURRENCIES, SAR_TO_EGP } from "@/lib/pricing";
import { waLink } from "@/lib/whatsapp";
import {
  IG_COURSES,
  IG_START_DATE,
  IG_SUBJECTS,
  IG_TEACHERS,
  IG_TOPICS,
} from "@/data/igcse";

export default function IgcseCourseDetail({ courseId }: { courseId: string }) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const { country } = useVisitorCountry();
  const [copied, setCopied] = useState(false);
  const c = IG_COURSES.find((x) => x.id === courseId)!;
  const t = IG_TEACHERS.find((x) => x.id === c.teacherId)!;
  const tName = ar ? t.name_ar : t.name;
  const subj = (en: string) =>
    ar ? (IG_SUBJECTS.find((s) => s.en === en)?.ar ?? en) : en;
  const topics = IG_TOPICS[c.subject] ?? ["Introduction", "Core Concepts"];
  const date = (d: string) =>
    new Date(d).toLocaleDateString(ar ? "ar-EG" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const cur = CURRENCIES[country];
  const f = 10 ** cur.decimals;
  const local = Math.round((c.priceEGP / SAR_TO_EGP) * cur.rate * f) / f;
  const priceLabel = `${local.toLocaleString(ar ? "ar-EG" : "en-US")} ${ar ? cur.symbol : cur.currency}`;

  const classes = [
    {
      title: ar ? "جلسة تعريفية" : "Orientation Session",
      lesson: ar ? "جلسة تعريفية" : "Orientation Session",
    },
    ...topics.map((tp, i) => ({
      title: `${ar ? "الحصة" : "Class"} ${i + 1} (${tp})`,
      lesson: `${ar ? "الحصة" : "Class"} ${i + 1} — ${tp}`,
    })),
  ];

  const enrollMsg = ar
    ? `مرحباً، أرغب في التسجيل في كورس "${c.title}" مع ${tName}.`
    : `Hello, I'd like to enroll in the course "${c.title}" with ${tName}.`;
  const contactMsg = ar
    ? `مرحباً، لدي استفسار عن كورس "${c.title}".`
    : `Hello, I am interested in the course "${c.title}".`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const Sep = ar ? ChevronLeft : ChevronRight;
  const facts = [
    {
      icon: Layers,
      k: ar ? "الحصص" : "Classes",
      v: ar ? `${classes.length} حصص` : `${classes.length} classes`,
    },
    { icon: GraduationCap, k: ar ? "المستوى" : "Level", v: "IGCSE" },
    {
      icon: Monitor,
      k: ar ? "نوع الكورس" : "Course Type",
      v: ar ? "أونلاين" : "Online",
    },
    { icon: Calendar, k: ar ? "يبدأ" : "Starts", v: date(IG_START_DATE) },
    {
      icon: Users,
      k: ar ? "الحد الأقصى" : "Max",
      v: ar ? "1,000 طالب" : "1,000 students",
    },
  ];

  return (
    <div className="min-h-screen pt-page pb-16">
      <div className="container mx-auto px-4">
        <nav
          aria-label={ar ? "مسار التنقل" : "Breadcrumb"}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap"
        >
          <Link to="/" className="hover:text-primary">
            {ar ? "الرئيسية" : "Home"}
          </Link>
          <Sep size={14} />
          <Link to="/igcse" className="hover:text-primary">
            {ar ? "الكورسات" : "Courses"}
          </Link>
          <Sep size={14} />
          <span className="text-foreground font-bold">{subj(c.subject)}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_22rem] gap-8 items-start">
          <div className="space-y-8 order-2 lg:order-1">
            <section className="card-base p-6">
              <h2 className="text-xl font-extrabold mb-3">
                {ar ? "عن هذا الكورس" : "About This Course"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {ar
                  ? `هذا كورس ${subj(c.subject)} (منهج ${c.board}).`
                  : `This is a ${c.subject} (${c.board} board) course.`}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                {ar
                  ? `يقدّم الكورس للطلاب المبادئ الأساسية في ${subj(c.subject)} مع شرح منظم وتدريب عملي على أسئلة الامتحانات.`
                  : `The course introduces students to the fundamental principles of ${c.subject}, with structured explanations and exam-style practice.`}
              </p>
            </section>

            <section id="course-content" className="card-base p-6">
              <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
                <h2 className="text-xl font-extrabold">
                  {ar ? "محتوى الكورس" : "Course Content"}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {ar
                    ? `${classes.length} حصص · ${classes.length} دروس · ${classes.length} معاينات مجانية`
                    : `${classes.length} classes · ${classes.length} lessons · ${classes.length} free previews`}
                </span>
              </div>
              <ol className="space-y-3">
                {classes.map((cl, i) => (
                  <li
                    key={cl.title}
                    className="rounded-xl border border-border"
                  >
                    <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-t-xl">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold">{cl.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {ar ? "درس واحد" : "1 lesson"} · {date(IG_START_DATE)}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-primary bg-primary/10 rounded-full px-2.5 py-1">
                        {ar ? "معاينة" : "Preview"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-4 text-sm">
                      <PlayCircle size={16} className="text-primary shrink-0" />
                      <span className="flex-1">
                        {i + 1}.1 {cl.lesson}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {ar ? "معاينة" : "Preview"}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="card-base p-6">
              <h2 className="text-xl font-extrabold mb-4">
                {ar ? "المعلم" : "Your Instructor"}
              </h2>
              <div className="flex items-start gap-4">
                <span className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User size={28} className="text-muted-foreground" />
                </span>
                <div>
                  <h3 className="font-extrabold">{tName}</h3>
                  <p className="text-sm text-primary font-bold">
                    {t.subjects.map(subj).join("، ")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {ar
                      ? `معلم متخصص في ${t.subjects.map(subj).join(" و")} لمناهج IGCSE، يقدّم دروساً منظمة وعملية بجودة عالية.`
                      : `Expert instructor in ${t.subjects.join(", ")}. Specializes in IGCSE programs, delivering high-quality, structured and practical lessons.`}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="card-base overflow-hidden order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="h-36 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <BookOpen size={48} className="text-primary" />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h1 className="text-2xl font-black leading-tight">{c.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {ar ? "بواسطة" : "By"}{" "}
                  <span className="font-bold text-foreground">{tName}</span>
                </p>
              </div>
              <a
                href="#course-content"
                className="text-sm font-bold text-primary hover:underline inline-block"
              >
                {ar ? "دروس مجانية" : "Free lessons"}
              </a>
              <ul className="space-y-2 text-sm">
                {facts.map(({ icon: Icon, k, v }) => (
                  <li key={k} className="flex items-center gap-2">
                    <Icon size={15} className="text-primary shrink-0" />
                    <span className="text-muted-foreground">{k}:</span>
                    <span className="font-bold">{v}</span>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={waLink(enrollMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-center"
                >
                  {ar ? "سجّل الآن" : "Enroll Now"}
                </a>
                <a
                  href={waLink(contactMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-center inline-flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={15} /> {ar ? "تواصل" : "Contact"}
                </a>
              </div>
              <p className="text-center text-sm">
                {ar ? "سجّل مقابل " : "Enroll for only "}
                <strong className="text-primary text-lg">{priceLabel}</strong>
              </p>
              {country !== "EG" && (
                <p className="text-center text-xs text-muted-foreground">
                  {ar ? "الدفع بالجنيه المصري: " : "Charged in EGP: "}
                  {c.priceEGP.toLocaleString(ar ? "ar-EG" : "en-US")}{" "}
                  {ar ? "ج.م" : "EGP"}
                </p>
              )}
              <button
                type="button"
                onClick={copyLink}
                className="w-full text-sm font-bold text-muted-foreground hover:text-primary inline-flex items-center justify-center gap-1.5"
                aria-live="polite"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied
                  ? ar
                    ? "تم نسخ الرابط"
                    : "Link copied"
                  : ar
                    ? "نسخ رابط الكورس"
                    : "Copy Course Link"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
