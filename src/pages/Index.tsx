import { Link, useNavigate } from "react-router-dom";
import { mockTestimonials } from "@/data/mockData";
import {
  Star, ArrowLeft, Sparkles, GraduationCap, CalendarCheck, Video,
  Search, Calculator, Atom, FlaskConical, Languages,
  BookOpen, BarChart3, Code, Microscope, ArrowRight, Zap, PenTool, Globe, MessageCircle
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";
import { Helmet } from "react-helmet-async";
import hero3DCap from "@/assets/hero-3d-cap.webp";
import OrbitSubjects from "@/components/OrbitSubjects";
import OurTeam from "@/components/OurTeam";

import howStep1Img from "@/assets/how-step-1.png";
import howStep2Img from "@/assets/how-step-2.png";
import howStep3Img from "@/assets/how-step-3.png";


const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const HomePage = () => {
  const { t, d, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const howStepsRef = useRef<HTMLDivElement>(null);
  const howStepsInView = useInView(howStepsRef, { once: true, amount: 0.2 });
  const [playHowSteps, setPlayHowSteps] = useState(false);

  useEffect(() => {
    console.log("[HowSteps] 🔎 useInView changed →", howStepsInView, {
      refAttached: !!howStepsRef.current,
      refRect: howStepsRef.current?.getBoundingClientRect?.(),
    });
    if (howStepsInView) {
      console.log("[HowSteps] ✅ Triggering animation via useInView");
      const frame = requestAnimationFrame(() => setPlayHowSteps(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [howStepsInView]);

  useEffect(() => {
    console.log("[HowSteps] 🟡 Mount/state effect — playHowSteps =", playHowSteps);
    if (playHowSteps) {
      console.log("[HowSteps] ⏭️ Already playing, skipping fallback observers");
      return;
    }

    if (!howStepsRef.current) {
      console.warn("[HowSteps] ⚠️ Ref NOT attached yet on effect mount");
    }

    const checkHowStepsVisibility = (source: string) => {
      const element = howStepsRef.current;
      if (!element) {
        console.warn(`[HowSteps] ❌ Ref missing during check (source=${source})`);
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top < viewportHeight * 0.82 && rect.bottom > viewportHeight * 0.18;

      console.log(`[HowSteps] 👁️ Visibility check (${source})`, {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        viewportHeight,
        isVisible,
        documentReady: document.readyState,
      });

      if (isVisible) {
        console.log(`[HowSteps] ✅ Visible — triggering animation (source=${source})`);
        setPlayHowSteps(true);
      }
    };

    const onRaf = () => checkHowStepsVisibility("rAF");
    const onTimeout = () => checkHowStepsVisibility("timeout-700ms");
    const onLoad = () => checkHowStepsVisibility("window-load");
    const onScroll = () => checkHowStepsVisibility("scroll");
    const onResize = () => checkHowStepsVisibility("resize");

    let frame: number | null = null;
    let timeout: number | null = null;
    try {
      frame = requestAnimationFrame(onRaf);
      timeout = window.setTimeout(onTimeout, 700);
      window.addEventListener("load", onLoad, { once: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
    } catch (err) {
      console.error("[HowSteps] 💥 Failed to register visibility listeners", err);
    }

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      if (timeout !== null) window.clearTimeout(timeout);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [playHowSteps]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/teachers?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularSubjects = [
    { key: "subj_math", icon: Calculator, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    { key: "subj_physics", icon: Atom, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
    { key: "subj_chemistry", icon: FlaskConical, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { key: "subj_english", icon: Languages, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
    { key: "subj_accounting", icon: BookOpen, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
    { key: "subj_statistics", icon: BarChart3, color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
    { key: "subj_programming", icon: Code, color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
    { key: "subj_biology", icon: Microscope, color: "bg-green-500/10 text-green-600 dark:text-green-400" },
    { key: "subj_dynamics", icon: Zap, color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
    { key: "subj_drawing", icon: PenTool, color: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
  ] as const;

  const howSteps = [
    { key: "1", image: howStep1Img, titleKey: "how_step1_title", descKey: "how_step1_desc" },
    { key: "2", image: howStep2Img, titleKey: "how_step2_title", descKey: "how_step2_desc" },
    { key: "3", image: howStep3Img, titleKey: "how_step3_title", descKey: "how_step3_desc" },
  ] as const;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Ostaze",
    url: "https://ostaze.com",
    description: lang === "ar"
      ? "منصة كورسات تعليمية رقمية: كورسات مسجلة وحية بوصول مدى الحياة في مختلف التخصصات الأكاديمية والمهنية"
      : "A digital online learning platform offering recorded and live courses with lifetime access across academic and professional subjects",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressCountry: "SA",
    },
    sameAs: ["https://ostaze.com"],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "19",
      highPrice: "299",
    },
  };

  return (
    <div className="relative">
      {/* Ambient animated background — orange & violet glow drifts (GPU-friendly) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      >
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] glow-drift-a"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full blur-[160px] glow-drift-b"
          style={{
            background:
              "radial-gradient(circle, hsl(270 70% 55% / 0.45) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px] glow-drift-a"
          style={{
            animationDelay: "-7s",
            background:
              "radial-gradient(circle, hsl(14 91% 60% / 0.35) 0%, transparent 70%)",
          }}
        />
      </div>

      <PageHelmet
        title={lang === "ar"
          ? "OSTAZE | منصة أستازي - دروس خصوصية ولايف أونلاين مع أفضل المعلمين"
          : "OSTAZE | Ostaze - Online Private & Live Tutoring Platform"}
        description={lang === "ar"
          ? "OSTAZE (أستازي) منصة دروس خصوصية ولايف أونلاين تربط الطلاب بأفضل المعلمين الجامعيين في الكويت وقطر — حصص مباشرة بالزووم، كورسات مسجلة، وأسعار مدروسة."
          : "OSTAZE (Ostaze) connects students with top university tutors in Kuwait & Qatar via Zoom live lessons and recorded courses at fair prices."}
        canonical="https://ostaze.com/"
        keywords={lang === "ar"
          ? "منصة استاذي، موقع استاذي، أستازي، استازي، OSTAZE، Ostaze، منصة دروس لايف، دروس خصوصية اونلاين، حصص لايف زووم، كورسات مسجلة، حجز معلم خصوصي، جامعة الكويت، جامعة قطر"
          : "ostaze, ostaze platform, online tutoring platform, private online tutors, live online lessons, zoom tutoring, university tutors Kuwait, university tutors Qatar"}
        jsonLd={jsonLd}
      />

      {/* Hero — Card-Y inspired centered, dark, glowing */}
      <section className="hero-gradient min-h-[100vh] flex items-center justify-center overflow-hidden relative pt-page-lg pb-16">
        <div className="container relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center max-w-3xl mx-auto"
          >
            {/* Pill badge */}
            <motion.div variants={item} className="badge-pill mb-7">
              <span className="badge-pill-tag">{lang === "ar" ? "جديد" : "New"}</span>
              <span className="text-foreground/85">{t("hero_badge")}</span>
            </motion.div>

            {/* Massive two-line title */}
            <motion.h1 dir={lang === "ar" ? "rtl" : "ltr"} variants={item} className="text-[3rem] sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-2 text-center">
              <span className="block text-foreground">{lang === "ar" ? "تعلم مع أفضل الدكاترة الجامعيين" : "Learn with the best university professors"}</span>
            </motion.h1>

            {/* 3D hero element with glow */}
            <motion.div variants={item} className="relative my-8 sm:my-10">
              <div
                className="absolute inset-0 rounded-full hero-glow glow-pulse"
                style={{ background: "radial-gradient(circle, hsl(14 91% 50% / 0.55), transparent 65%)" }}
                aria-hidden="true"
              />
              <img
                src={hero3DCap}
                alt={lang === "ar" ? "قبعة التخرج ثلاثية الأبعاد" : "3D graduation cap"}
                className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 object-contain hero-3d-glow float-y mx-auto"
                width={320}
                height={320}
              />
            </motion.div>

            {/* Subtitle */}
            <motion.p dir={lang === "ar" ? "rtl" : "ltr"} variants={item} className="text-foreground/75 text-base md:text-lg leading-relaxed max-w-xl mb-8 text-center">
              {lang === "ar" ? "منصة تعليمية تربطك بأفضل الأساتذة الجامعيين في تخصصك عن طريق جلسات online" : "An educational platform that connects you with the best university professors in your field through online sessions"}
            </motion.p>

            {/* CTA + Search */}
            <motion.form variants={item} onSubmit={handleSearch} className="w-full max-w-xl flex gap-2 mb-5">
              <div className="flex-1 relative">
                <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("hero_search_placeholder")}
                  className="w-full ps-11 pe-4 py-3.5 rounded-full border border-foreground/15 bg-card/85 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all min-h-[52px]"
                />
              </div>
              <button type="submit" className="btn-cta-light min-h-[52px] !px-7">
                {t("hero_cta")}
                <ArrowRight size={16} />
              </button>
            </motion.form>


          </motion.div>
        </div>
      </section>

      {/* How It Works — creative pop-up sequence */}
      <section className="py-16 overflow-hidden bg-section-alt">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">{t("how_title")}</h2>
            <p className="text-muted-foreground">{t("how_subtitle")}</p>
          </motion.div>

          <motion.div
            ref={howStepsRef}
            initial="hidden"
            animate={playHowSteps ? "show" : "hidden"}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2, delayChildren: 0.05 } } }}
            className="grid md:grid-cols-3 gap-10 md:gap-6 relative max-w-5xl mx-auto"
          >
            {howSteps.map((step, i) => (
              <motion.div
                key={step.key}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
                }}
                className="text-center relative group"
              >
                {/* Big orange number */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: -20, scale: 0.5 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 14 } },
                  }}
                  className="text-6xl md:text-7xl font-black text-primary leading-none mb-3 relative z-10"
                  style={{ textShadow: "0 6px 20px hsl(var(--primary) / 0.25)" }}
                >
                  {step.key}
                </motion.div>

                {/* Title */}
                <motion.h3
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                  className="font-extrabold text-xl md:text-2xl mb-6 text-foreground whitespace-pre-line"
                >
                  {t(step.titleKey)}
                </motion.h3>

                {/* Illustration with beige blob background */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 40, scale: 0.9 },
                    show: {
                      opacity: 1, y: 0, scale: 1,
                      transition: { type: "spring", stiffness: 140, damping: 18 },
                    },
                  }}
                  whileHover={{ y: -6 }}
                  className="relative mx-auto w-full max-w-[260px] aspect-square flex items-center justify-center"
                >
                  {/* Soft beige blob behind illustration — adapts to theme */}
                  <div
                    className="absolute inset-4 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-[hsl(28_60%_88%)] dark:bg-[hsl(28_25%_22%)] opacity-90 blur-[1px]"
                    aria-hidden="true"
                  />
                  <motion.img
                    src={step.image}
                    alt=""
                    loading="lazy"
                    width={520}
                    height={520}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_10px_25px_hsl(var(--primary)/0.15)]"
                  />
                </motion.div>

                {/* Description */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { duration: 0.5 } },
                  }}
                  className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto mt-4"
                >
                  {t(step.descKey)}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick WhatsApp Session Request */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 text-center border"
            style={{
              background:
                "linear-gradient(140deg, hsl(var(--card)) 0%, hsl(var(--background)) 60%, hsl(var(--primary) / 0.06) 100%)",
              borderColor: "hsl(var(--primary) / 0.2)",
              boxShadow:
                "0 30px 80px -30px hsl(var(--primary) / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.06)",
            }}
          >
            {/* Dot grid texture */}
            <div
              className="absolute inset-0 opacity-[0.18] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                maskImage:
                  "radial-gradient(ellipse at center, black 35%, transparent 80%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, black 35%, transparent 80%)",
              }}
            />
            {/* Warm glows — matching site palette */}
            <div
              className="absolute -top-20 -left-20 w-[280px] h-[280px] rounded-full blur-[90px] opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.55) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-20 -right-20 w-[280px] h-[280px] rounded-full blur-[90px] opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(38 92% 55% / 0.45) 0%, transparent 70%)" }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">{t("whatsapp_cta_title")}</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t("whatsapp_cta_subtitle")}</p>
              <a
                href={`https://wa.me/201130382206?text=${encodeURIComponent(t("whatsapp_msg"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(24 95% 55%) 100%)",
                  boxShadow:
                    "0 10px 30px -10px hsl(var(--primary) / 0.55), inset 0 1px 0 hsl(0 0% 100% / 0.25)",
                }}
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t("whatsapp_cta_button")}</span>
                <ArrowLeft className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-16 bg-section-alt">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">{t("why_title")}</h2>
            <p className="text-muted-foreground">{t("why_subtitle")}</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } } }}
          >
            {[
              { icon: GraduationCap, title: t("why_teachers"), desc: t("why_teachers_desc"), active: true },
              { icon: CalendarCheck, title: t("why_schedule"), desc: t("why_schedule_desc"), active: false },
              { icon: Video, title: t("why_remote"), desc: t("why_remote_desc"), active: false },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.92 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                }}
                className={`feature-card ${i === 0 ? "card-active" : ""}`}
              >
                <div className="icon-box-lg bg-primary/10 text-primary mx-auto mb-4">
                  <step.icon size={24} />
                </div>
                <h3 className={`font-bold text-lg mb-2 ${i === 0 ? "text-primary" : ""}`}>{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Subjects - Orbit Universe */}
      <OrbitSubjects />

      {/* Students Enrolled At — refined trust banner */}
      <section className="relative py-16 overflow-hidden">
        {/* Ambient backdrop tied to site theme */}
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 70%), radial-gradient(50% 50% at 90% 100%, hsl(38 92% 55% / 0.07) 0%, transparent 70%)",
          }}
        />

        <div className="container max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10 md:mb-12"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase mb-4"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(38 92% 55% / 0.10))",
                color: "hsl(var(--primary))",
                border: "1px solid hsl(var(--primary) / 0.22)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {lang === "ar" ? "ثقة الطلاب" : "Trusted by Students"}
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
              {lang === "ar" ? "طلابنا ملتحقون بـ" : "Our Students Study At"}
              <span
                className="block mt-1 bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, hsl(var(--primary)), hsl(38 92% 55%))",
                }}
              >
                {lang === "ar" ? "أعرق الجامعات" : "Top-Tier Universities"}
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              {lang === "ar"
                ? "آلاف الطلاب من أبرز الجامعات في الكويت وقطر يثقون بـ OSTAZE لرحلتهم الدراسية."
                : "Thousands of students from leading universities across Kuwait & Qatar trust OSTAZE for their academic journey."}
            </p>
          </motion.div>

          {/* Logos showcase card — night mood */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[2rem] overflow-hidden p-4 md:p-6 border transition-colors"
            style={{
              background:
                "linear-gradient(140deg, hsl(var(--card)) 0%, hsl(var(--background)) 60%, hsl(var(--primary) / 0.06) 100%)",
              borderColor: "hsl(var(--primary) / 0.2)",
              boxShadow:
                "0 30px 80px -30px hsl(var(--primary) / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.06)",
            }}
          >
            {/* Dot grid texture */}
            <div
              className="absolute inset-0 opacity-[0.18] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                maskImage:
                  "radial-gradient(ellipse at center, black 35%, transparent 80%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, black 35%, transparent 80%)",
              }}
            />
            {/* Warm glows */}
            <div
              className="absolute -top-16 -left-16 w-[240px] h-[240px] rounded-full blur-[80px] opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.55) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-16 -right-16 w-[260px] h-[260px] rounded-full blur-[90px] opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(38 92% 55% / 0.45) 0%, transparent 70%)" }}
            />

            {/* Trust stats inline */}
            <div
              className="relative grid grid-cols-3 gap-2 md:gap-4 mt-6 pt-4"
              style={{ borderTop: "1px solid hsl(var(--primary) / 0.2)" }}
            >
              {[
                { v: "73+", l: lang === "ar" ? "جامعة" : "Universities" },
                { v: "12k+", l: lang === "ar" ? "طالب نشط" : "Active Students" },
                { v: "98%", l: lang === "ar" ? "رضا الطلاب" : "Satisfaction" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div
                    className="text-2xl md:text-3xl font-black bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(38 92% 60%) 100%)",
                    }}
                  >
                    {s.v}
                  </div>
                  <div className="text-[11px] md:text-xs font-medium mt-1 tracking-wide text-muted-foreground">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Browse all universities CTA */}
          <div className="flex justify-center mt-8">
            <Link
              to="/universities"
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(24 95% 55%) 100%)",
                boxShadow:
                  "0 10px 30px -10px hsl(var(--primary) / 0.55), inset 0 1px 0 hsl(0 0% 100% / 0.25)",
              }}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{lang === "ar" ? "تصفح كل الجامعات" : "Browse all universities"}</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <OurTeam />



      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2">{t("testimonials_title")}</h2>
            <p className="text-muted-foreground">{t("testimonials_subtitle")}</p>
          </motion.div>
          <motion.div
            className="grid md:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } } }}
          >
            {mockTestimonials.map((tst, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="card-base p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={14} className="fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{d(tst.quote)}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{d(tst.name).charAt(0)}</div>
                  <div>
                    <div className="font-bold text-sm">{d(tst.name)}</div>
                    <div className="text-muted-foreground text-xs">{d(tst.university)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA — Card-Y dark glow gradient style */}
      <section className="py-16 px-4 lg:px-8">
        <div className="stats-card-darkglow relative overflow-hidden rounded-[2rem] py-14 px-6 md:px-12">
          <div className="container text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-[0_2px_8px_hsl(0_0%_0%_/_0.25)]">{t("cta_title")}</h2>
              <p className="text-white/85 mb-8 max-w-lg mx-auto text-sm md:text-base">{t("cta_subtitle")}</p>
              <div className="flex justify-center gap-3 flex-wrap">
                <Link to="/register" className="btn-cta-light text-base">{t("cta_register")}</Link>
                <Link to="/teachers" className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-bold border-2 border-white/30 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                  {t("hero_browse")}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEO-only contextual paragraph — readable to crawlers, hidden visually.
          Naturally references brand variants and high-intent search phrases
          students commonly type to find the platform. */}
      <section aria-hidden="true" className="sr-only">
        <h2>منصة OSTAZE (أستازي / استاذي / أستاذي) — دروس خصوصية ولايف أونلاين</h2>
        <p>
          منصة <strong>أستازي</strong> (وتُكتب أيضاً: استاذي، أستاذي، استازي،
          OSTAZE، Ostaze) هي منصة دروس خصوصية ولايف أونلاين تجمع طلاب
          الجامعات في الكويت وقطر بأفضل المعلمين الجامعيين عبر حصص مباشرة
          بالزووم، إضافة إلى كورسات مسجلة وكورسات لايف. ابحث عن
          <em>منصة استاذي</em>، <em>موقع استاذي</em>، <em>منصة دروس لايف</em>،
          <em>موقع تعليم خصوصي</em>، أو <em>منصة دروس أونلاين</em> — كلها
          تقودك إلى OSTAZE.
        </p>
        <p>
          نوفّر <strong>معلمين خصوصي أونلاين</strong> في الرياضيات، الفيزياء،
          الكيمياء، البرمجة، اللغة الإنجليزية، المحاسبة، الإدارة، والقانون.
          يمكنك <strong>حجز معلم خصوصي</strong> بسرعة، اختيار التوقيت المناسب،
          والانضمام لحصة <strong>زووم لايف</strong> فوراً. ندعم طلاب
          <strong>جامعة الكويت</strong>، <strong>جامعة قطر</strong>، الجامعة
          الأمريكية، الخليج للعلوم والتكنولوجيا، وكافة الجامعات الإقليمية.
        </p>
        <p>
          OSTAZE / Ostaze — the leading online private &amp; live
          tutoring platform for university students in Kuwait and Qatar.
          Search terms: ostaze platform, online tutoring, zoom tutoring,
          private lessons, live online lessons.
        </p>
      </section>

    </div>
  );
};

export default HomePage;
