import {
  ArrowUpRight,
  Atom,
  Calculator,
  Dna,
  FlaskConical,
  BookOpen,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import studyImage from "@/assets/igcse-study.jpg";

const subjects = [
  {
    ar: "الرياضيات",
    en: "Mathematics",
    icon: Calculator,
    id: "math-ol-edexcel-2027",
    board: "Edexcel",
  },
  {
    ar: "الفيزياء",
    en: "Physics",
    icon: Atom,
    id: "physics-ol-cambridge",
    board: "Cambridge",
  },
  {
    ar: "الكيمياء",
    en: "Chemistry",
    icon: FlaskConical,
    id: "chemistry-ol-0971",
    board: "Cambridge",
  },
  {
    ar: "الأحياء",
    en: "Biology",
    icon: Dna,
    id: "cambridge-biology-ol",
    board: "Cambridge",
  },
];

export default function IgcseSection() {
  const { lang } = useLanguage();
  const ar = lang === "ar";

  return (
    <section
      id="home-igcse"
      aria-labelledby="home-igcse-title"
      className="bg-secondary py-16 md:py-24 overflow-hidden"
      dir={ar ? "rtl" : "ltr"}
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 text-primary text-sm font-bold mb-5">
              <BookOpen size={18} aria-hidden="true" />
              <span>{ar ? "خطوتك القادمة تبدأ هنا" : "YOUR NEXT CHAPTER"}</span>
            </div>
            <h2
              id="home-igcse-title"
              className="!font-sans !tracking-normal !font-black text-5xl md:text-6xl leading-tight text-foreground mb-4"
              dir="ltr"
            >
              IGCSE<span className="text-primary">.</span>
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-foreground mb-5 leading-snug">
              {ar
                ? "افهم أعمق. واستعد بثقة."
                : "Understand more. Walk in confident."}
            </p>
            <p className="text-muted-foreground text-base leading-relaxed max-w-lg mb-6">
              {ar
                ? "من أول مفهوم إلى استعدادك للامتحان، ابدأ بالمادة التي تحتاجها واستكشف المسار المناسب لمنهجك ومستواك."
                : "From your first concept to exam preparation, start with the subject you need and explore a course that fits your syllabus and level."}
            </p>
            <p
              className="text-sm text-primary font-semibold mb-8"
              dir="ltr"
            >
              Cambridge · Edexcel · Oxford AQA
            </p>
            <Button
              asChild
              size="lg"
              className="h-auto min-h-12 whitespace-normal px-6 py-3 font-bold rounded-md"
            >
              <Link to="/igcse">
                {ar ? "استكشف مواد IGCSE" : "Explore IGCSE courses"}
                <ArrowUpRight
                  className="shrink-0 rtl:-scale-x-100"
                  aria-hidden="true"
                />
              </Link>
            </Button>
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
              loading="lazy"
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
        <div className="mt-10 md:mt-14 border-t border-primary/20 pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
            <h3 className="!font-sans !tracking-normal !font-bold text-base text-foreground">
              {ar ? "ابدأ بمادتك" : "Find your starting point"}
            </h3>
            <Link
              to="/igcse"
              className="text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {ar ? "جميع المواد" : "All subjects"}
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {subjects.map(({ ar: arabic, en, icon: Icon, id, board }) => (
              <Link
                key={id}
                to={`/igcse/${id}`}
                className="group flex items-center gap-3 min-h-24 p-3 md:p-4 bg-card text-card-foreground rounded-lg border border-border hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon
                  className="text-primary shrink-0 w-5 h-5 md:w-6 md:h-6"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <span className="block text-sm md:text-base font-bold break-words">
                    {ar ? arabic : en}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    {board}
                  </span>
                </div>
                <ArrowUpRight
                  className="hidden sm:block text-primary w-4 h-4 shrink-0 rtl:-scale-x-100 motion-safe:group-hover:-translate-y-0.5 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
