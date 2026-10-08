import { ArrowRight, GraduationCap, Users } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useLanguage } from "@/contexts/LanguageContext";
import uniKsu from "@/assets/unis/king-saud.webp.asset.json";
import uniKfupm from "@/assets/unis/kfupm.png.asset.json";
import uniKhalifa from "@/assets/unis/khalifa.png.asset.json";
import uniZayed from "@/assets/unis/zayed.png.asset.json";
import uniQatar from "@/assets/unis/qatar-university.png.asset.json";
import uniHbku from "@/assets/unis/hbku.png.asset.json";

const universities = [
  { src: uniKsu.url, name: "King Saud University" },
  { src: uniKfupm.url, name: "KFUPM" },
  { src: uniKhalifa.url, name: "Khalifa University" },
  { src: uniZayed.url, name: "Zayed University" },
  { src: uniQatar.url, name: "Qatar University" },
  { src: uniHbku.url, name: "Hamad Bin Khalifa University" },
];

const UniversityTrustSection = () => {
  const { lang, t } = useLanguage();
  const ar = lang === "ar";

  return (
    <section
      id="home-university-trust"
      aria-labelledby="university-trust-title"
      className="bg-background py-16 md:py-24"
      dir={ar ? "rtl" : "ltr"}
    >
      <div className="container max-w-6xl">
        <div className="grid overflow-hidden rounded-[2.5rem] border border-border bg-card lg:grid-cols-12">
          <div className="bg-secondary text-secondary-foreground p-7 sm:p-10 lg:p-12 lg:col-span-5 flex flex-col justify-center">
            <span className="self-start rounded-full border border-secondary-foreground/20 px-4 py-1.5 text-xs font-semibold mb-9">
              {ar ? "تميّز أكاديمي" : "Education Excellence"}
            </span>
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div
                  className="text-5xl sm:text-6xl font-black text-primary leading-none shrink-0"
                  dir="ltr"
                >
                  3399
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    {ar ? "طالب مسجل" : "Registered students"}
                  </h3>
                  <p className="text-secondary-foreground/70 text-sm leading-relaxed">
                    {ar
                      ? "طلاب من جميع أنحاء العالم يبنون مستقبلهم معنا"
                      : "Students from all over the world building their future with us"}
                  </p>
                </div>
              </div>
              <div className="border-t border-secondary-foreground/15" />
              <div className="flex items-start gap-5">
                <div
                  className="text-5xl sm:text-6xl font-black text-primary leading-none shrink-0"
                  dir="ltr"
                >
                  98%
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    {ar ? "نسبة الرضا" : "Satisfaction rate"}
                  </h3>
                  <p className="text-secondary-foreground/70 text-sm leading-relaxed">
                    {ar
                      ? "أعلى معدل نجاح ورضا للطلاب"
                      : "Highest satisfaction rate in student success"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10 flex items-center gap-3 text-secondary-foreground/70 text-sm leading-relaxed">
              <Users size={30} className="shrink-0" aria-hidden="true" />
              <p>
                {ar
                  ? "انضم إلى آلاف الطلاب الذين يتعلمون مع أفضل المعلمين في أستاذي"
                  : "Join thousands of students learning with top tutors at OSTAZE"}
              </p>
            </div>
          </div>
          <div className="p-7 sm:p-10 lg:p-12 lg:col-span-7 flex flex-col justify-center">
            <h2
              id="university-trust-title"
              className="text-3xl md:text-4xl font-black leading-tight mb-4"
            >
              {ar ? "طلابنا ملتحقون " : "Our students study at "}
              <span className="text-primary">
                {ar ? "بأعرق الجامعات" : "top-tier universities"}
              </span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
              {ar
                ? "طلابنا مقبولون في أعرق المؤسسات الأكاديمية في السعودية، الإمارات، الكويت وقطر."
                : "Our students are accepted at the most prestigious academic institutions across KSA, UAE, Kuwait and Qatar."}
            </p>
            <div className="grid grid-cols-3 gap-3 md:gap-5">
              {universities.map((university) => (
                <div
                  key={university.name}
                  className="h-20 md:h-24 rounded-lg border border-border bg-background flex items-center justify-center p-3"
                >
                  <img
                    src={university.src}
                    alt={university.name}
                    loading="lazy"
                    decoding="async"
                    width={160}
                    height={80}
                    className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-[filter] duration-300 motion-reduce:transition-none"
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {ar
                  ? "مستقبلك الأكاديمي يبدأ من هنا"
                  : "Your academic future starts here"}
              </p>
              <Link
                to="/universities"
                className="btn-primary inline-flex items-center gap-2 text-sm"
              >
                <GraduationCap size={18} aria-hidden="true" />
                {t("home_logos_cta")}
                <ArrowRight
                  size={18}
                  className="rtl:rotate-180"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversityTrustSection;
