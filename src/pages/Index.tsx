import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";
import HeroOrbit from "@/components/HeroOrbit";
import { Suspense, lazy } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";

// Keep Framer Motion and the long home-page sections out of the critical
// route. The observer mounts them shortly before the user can see them, so
// Safari does not have to parse/paint the entire page while the hero loads.
const IndexBelowFold = lazy(() => import("@/components/home/IndexBelowFold"));

const HomePage = () => {
  const { t, lang } = useLanguage();
  const [belowFoldRef, belowFoldReady] = useInViewOnce<HTMLDivElement>("1200px 0px");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Ostaze",
    url: "https://ostaze.com",
    description: lang === "ar"
      ? "منصة كورسات تعليمية رقمية: كورسات مسجلة وحية بوصول مدى الحياة في مختلف التخصصات الأكاديمية والمهنية"
      : "A digital online learning platform offering recorded and live courses with lifetime access across academic and professional subjects",
    address: { "@type": "PostalAddress", addressLocality: "Riyadh", addressCountry: "SA" },
    sameAs: ["https://ostaze.com"],
    offers: { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: "19", highPrice: "299" },
  };

  return (
    <div className="relative">
      {/* Ambient animated background — hidden on reduced-motion & mobile to
          cut decorative paint cost on low-end devices. */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none overflow-hidden motion-reduce:hidden">
        {/* Gradient-based glows (no runtime blur() — Safari/WebKit repaints those every frame) */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full glow-drift-a"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, hsl(var(--primary) / 0.5) 0%, hsl(var(--primary) / 0.22) 40%, transparent 72%)" }}
        />
        <div
          className="hidden md:block absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full glow-drift-b"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, hsl(270 70% 55% / 0.45) 0%, hsl(270 70% 55% / 0.2) 40%, transparent 72%)" }}
        />
      </div>

      <PageHelmet
        title={lang === "ar"
          ? "OSTAZE | منصة أستاذي - دروس خصوصية ولايف أونلاين مع أفضل المعلمين"
          : "OSTAZE | Ostaze - Online Private & Live Tutoring Platform"}
        description={lang === "ar"
          ? "OSTAZE (أستاذي) منصة دروس خصوصية ولايف أونلاين تربط الطلاب بأفضل المعلمين الجامعيين في السعودية، الإمارات، الكويت وقطر — حصص مباشرة بالزووم، كورسات مسجلة، وأسعار مدروسة."
          : "OSTAZE (Ostaze) connects students with top university tutors in KSA, UAE, Kuwait & Qatar via Zoom live lessons and recorded courses at fair prices."}
        canonical="https://ostaze.com/"
        keywords={lang === "ar"
          ? "منصة استاذي، موقع استاذي، أستاذي، استاذي، OSTAZE، Ostaze، منصة دروس لايف، دروس خصوصية اونلاين، حصص لايف زووم، كورسات مسجلة، حجز معلم خصوصي، جامعة الكويت، جامعة قطر"
          : "ostaze, ostaze platform, online tutoring platform, private online tutors, live online lessons, zoom tutoring, university tutors Kuwait, university tutors Qatar"}
        jsonLd={jsonLd}
      />

      {/* Hero — CSS-only animations to keep framer-motion off the critical path */}
      <section className="hero-gradient min-h-[100dvh] lg:min-h-[100vh] flex items-center overflow-hidden relative pt-page-lg pb-20 sm:pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 -start-20 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(50% 50% at 50% 50%, hsl(14 91% 50% / 0.12) 0%, hsl(14 91% 50% / 0.06) 45%, transparent 72%)" }} />
          <div className="absolute -top-40 -end-20 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(50% 50% at 50% 50%, hsl(14 91% 30% / 0.08) 0%, hsl(14 91% 30% / 0.04) 45%, transparent 72%)" }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="flex flex-col items-start text-start">
              <div className="badge-pill mb-7 -mt-2 hero-fade-in" style={{ animationDelay: "0ms" }}>
                <span className="badge-pill-tag">{lang === "ar" ? "جديد" : "New"}</span>
                <span className="text-foreground/85">{t("hero_badge")}</span>
              </div>

              <h1
                dir={lang === "ar" ? "rtl" : "ltr"}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 hero-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                <span className="text-foreground whitespace-pre-line">
                  {lang === "ar" ? "تعلم مع أفضل " : "Learn With\nThe Best \n"}
                </span>
                <span
                  className="text-transparent bg-clip-text text-4xl md:text-5xl lg:text-6xl"
                  style={{ backgroundImage: "linear-gradient(to left, hsl(14 91% 50%), hsl(20 95% 64%))" }}
                >
                  {lang === "ar" ? "الدكاترة الجامعيين" : "University Professors"}
                </span>
              </h1>

              <p
                dir={lang === "ar" ? "rtl" : "ltr"}
                className="text-foreground/70 text-base md:text-lg leading-relaxed max-w-xl mb-8 hero-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                {lang === "ar"
                  ? "منصة تعليمية تربطك بأفضل الأساتذة الجامعيين في تخصصك عن طريق جلسات اونلاين"
                  : "An educational platform that connects you with the best university professors in your field through online sessions"}
              </p>

              <div className="w-full max-w-xl mb-6 hero-fade-in" style={{ animationDelay: "300ms" }}>
                <Link
                  to="/universities"
                  className="btn-cta-light min-h-[52px] !px-7 inline-flex items-center justify-center"
                >
                  {t("hero_cta")}
                </Link>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative flex justify-center lg:justify-end hero-scale-in" style={{ animationDelay: "200ms" }}>
              <div className="relative w-full max-w-[480px] aspect-[1/1.05] sm:aspect-square flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(50% 50% at 50% 50%, hsl(14 91% 50% / 0.35) 0%, hsl(14 91% 50% / 0.16) 40%, transparent 70%)" }}
                  aria-hidden="true"
                />
                <HeroOrbit />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div ref={belowFoldRef} className="home-below-fold">
        {belowFoldReady ? (
          <Suspense fallback={<div className="min-h-[1800px]" aria-hidden="true" />}>
            <IndexBelowFold />
          </Suspense>
        ) : (
          <div className="min-h-[1800px]" aria-hidden="true" />
        )}
      </div>

      {/* SEO-only contextual paragraph */}
      <section aria-hidden="true" className="sr-only">
        <h2>منصة OSTAZE (أستاذي / استاذي / أستاذي) — دروس خصوصية ولايف أونلاين</h2>
        <p>
          منصة <strong>أستاذي</strong> (وتُكتب أيضاً: استاذي، أستاذي، استاذي، OSTAZE، Ostaze) هي منصة دروس خصوصية ولايف أونلاين تجمع طلاب الجامعات في الكويت وقطر بأفضل المعلمين الجامعيين عبر حصص مباشرة بالزووم، إضافة إلى كورسات مسجلة وكورسات لايف. ابحث عن <em>منصة استاذي</em>، <em>موقع استاذي</em>، <em>منصة دروس لايف</em>، <em>موقع تعليم خصوصي</em>، أو <em>منصة دروس أونلاين</em> — كلها تقودك إلى OSTAZE.
        </p>
        <p>
          نوفّر <strong>معلمين خصوصي أونلاين</strong> في الرياضيات، الفيزياء، الكيمياء، البرمجة، اللغة الإنجليزية، المحاسبة، الإدارة، والقانون. يمكنك <strong>حجز معلم خصوصي</strong> بسرعة، اختيار التوقيت المناسب، والانضمام لحصة <strong>زووم لايف</strong> فوراً. ندعم طلاب <strong>جامعة الكويت</strong>، <strong>جامعة قطر</strong>، الجامعة الأمريكية، الخليج للعلوم والتكنولوجيا، وكافة الجامعات الإقليمية.
        </p>
        <p>
          OSTAZE / Ostaze — the leading online private &amp; live tutoring platform for university students in Kuwait and Qatar. Search terms: ostaze platform, online tutoring, zoom tutoring, private lessons, live online lessons.
        </p>
      </section>
    </div>
  );
};

export default HomePage;
