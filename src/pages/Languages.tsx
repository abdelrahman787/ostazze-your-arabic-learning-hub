import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, Users, Clock, Sparkles } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PageHelmet from "@/components/PageHelmet";
import FaqAccordion from "@/components/FaqAccordion";
import { waLink } from "@/lib/whatsapp";
import { breadcrumbJsonLd, collectionPageJsonLd, faqJsonLd } from "@/lib/seo";

interface LangItem {
  id: string;
  flag: string;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
  levels: string[];
}

const LANGUAGES: LangItem[] = [
  {
    id: "english",
    flag: "🇬🇧",
    ar: "الإنجليزية",
    en: "English",
    descAr: "محادثة، قواعد، كتابة أكاديمية، وتحضير IELTS و TOEFL.",
    descEn: "Conversation, grammar, academic writing, IELTS & TOEFL prep.",
    levels: ["A1", "A2", "B1", "B2", "C1"],
  },
  {
    id: "german",
    flag: "🇩🇪",
    ar: "الألمانية",
    en: "German",
    descAr: "من الصفر حتى B2، مع تحضير امتحانات Goethe و TestDaF.",
    descEn: "From zero to B2, with Goethe and TestDaF exam preparation.",
    levels: ["A1", "A2", "B1", "B2"],
  },
  {
    id: "spanish",
    flag: "🇪🇸",
    ar: "الإسبانية",
    en: "Spanish",
    descAr: "نطق سليم ومحادثة يومية مع أساسيات القواعد الإسبانية.",
    descEn: "Solid pronunciation, everyday conversation and core grammar.",
    levels: ["A1", "A2", "B1"],
  },
  {
    id: "french",
    flag: "🇫🇷",
    ar: "الفرنسية",
    en: "French",
    descAr: "قواعد ومحادثة وتحضير DELF لكل المستويات.",
    descEn: "Grammar, conversation and DELF preparation for all levels.",
    levels: ["A1", "A2", "B1", "B2"],
  },
  {
    id: "turkish",
    flag: "🇹🇷",
    ar: "التركية",
    en: "Turkish",
    descAr: "لغة الحياة اليومية والدراسة في تركيا مع معلمين متخصصين.",
    descEn: "Daily-life and study-in-Turkey Turkish with specialised tutors.",
    levels: ["A1", "A2", "B1"],
  },
];

const Languages = () => {
  const { lang } = useLanguage();
  const ar = lang === "ar";

  const faq = [
    {
      q: ar ? "كيف تتم حصص اللغات؟" : "How are language sessions delivered?",
      a: ar
        ? "حصص فردية مباشرة عبر Zoom مع معلم متخصص، ويتم تحديد الموعد حسب وقتك."
        : "One-to-one live sessions over Zoom with a specialised tutor, scheduled around your availability.",
    },
    {
      q: ar ? "هل أحتاج مستوى سابق للبدء؟" : "Do I need prior knowledge to start?",
      a: ar
        ? "لا، نبدأ معك من مستوى A1 ونحدد مستواك في حصة تقييم قصيرة."
        : "No. We start from A1 and assess your level in a short placement session.",
    },
    {
      q: ar ? "هل توجد شهادة أو تحضير امتحانات؟" : "Is exam preparation available?",
      a: ar
        ? "نعم، نوفّر تحضير IELTS و TOEFL و Goethe و DELF حسب اللغة."
        : "Yes — IELTS, TOEFL, Goethe and DELF preparation depending on the language.",
    },
  ];

  return (
    <div>
      <PageHelmet
        title={ar ? "دورات اللغات - أستاذي OSTAZE" : "Language Courses - OSTAZE"}
        description={
          ar
            ? "تعلّم الإنجليزية والألمانية والإسبانية والفرنسية والتركية مع معلمين متخصصين في حصص مباشرة أونلاين على منصة أستاذي."
            : "Learn English, German, Spanish, French and Turkish with specialised tutors in live online sessions on OSTAZE."
        }
        keywords={
          ar
            ? "تعلم اللغات اونلاين, كورس انجليزي, كورس الماني, كورس اسباني, كورس فرنسي, كورس تركي, استاذي"
            : "online language courses, English tutor, German tutor, Spanish tutor, French tutor, Turkish tutor"
        }
        jsonLd={[
          breadcrumbJsonLd([
            { name: ar ? "الرئيسية" : "Home", url: "https://ostaze.com/" },
            { name: ar ? "اللغات" : "Languages", url: "https://ostaze.com/languages" },
          ]),
          collectionPageJsonLd(
            ar ? "دورات اللغات" : "Language Courses",
            ar ? "دورات لغات مباشرة أونلاين" : "Live online language courses",
            "https://ostaze.com/languages",
            LANGUAGES.map((l) => (ar ? l.ar : l.en)),
          ),
          faqJsonLd(faq),
        ]}
      />

      <PageHeader
        title={ar ? "اللغات" : "Languages"}
        subtitle={
          ar
            ? "حصص لغات مباشرة أونلاين مع معلمين متخصصين — من المبتدئ حتى المتقدم"
            : "Live one-to-one language sessions with specialised tutors — beginner to advanced"
        }
        variant="categories"
      />

      <div className="container py-10">
        <div className="flex items-center justify-center gap-2.5 flex-wrap text-xs mb-10">
          {[
            { icon: Sparkles, label: ar ? "٥ لغات" : "5 languages" },
            { icon: Users, label: ar ? "معلمون متخصصون" : "Specialised tutors" },
            { icon: Clock, label: ar ? "مواعيد مرنة" : "Flexible timing" },
          ].map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-muted-foreground">
              <s.icon size={13} className="text-primary" />
              <b className="text-foreground font-extrabold">{s.label}</b>
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LANGUAGES.map((l, i) => {
            const name = ar ? l.ar : l.en;
            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
                className="card-base p-6 flex flex-col gap-4 hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shrink-0" aria-hidden="true">
                    {l.flag}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-extrabold text-lg leading-snug">{name}</h2>
                    <p className="text-xs text-muted-foreground">{ar ? l.en : l.ar}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {ar ? l.descAr : l.descEn}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {l.levels.map((lv) => (
                    <span key={lv} className="px-2.5 py-1 rounded-full bg-muted/60 text-[11px] font-bold text-muted-foreground">
                      {lv}
                    </span>
                  ))}
                </div>

                <a
                  href={waLink(
                    ar
                      ? `مرحباً، أريد الاستفسار عن دورة ${l.ar} على منصة استاذي`
                      : `Hello, I'd like to ask about the ${l.en} course on Ostaze`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  <MessageCircle size={16} />
                  {ar ? "احجز عبر واتساب" : "Book via WhatsApp"}
                </a>
              </motion.div>
            );
          })}
        </div>

        <section className="mt-14 max-w-3xl mx-auto space-y-6">
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link to="/teachers" className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">
              {ar ? "المعلمون" : "Tutors"}
            </Link>
            <Link to="/subjects" className="px-3 py-1 rounded-full bg-foreground/5 hover:bg-primary/10 hover:text-primary font-bold transition-colors">
              {ar ? "كل المواد" : "All subjects"}
            </Link>
            <Link to="/universities" className="px-3 py-1 rounded-full bg-foreground/5 hover:bg-primary/10 hover:text-primary font-bold transition-colors">
              {ar ? "الجامعات" : "Universities"}
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-extrabold mb-3 text-center">{ar ? "الأسئلة الشائعة" : "FAQ"}</h3>
            <FaqAccordion items={faq} defaultOpen={0} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Languages;
