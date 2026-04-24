import { Link, useNavigate } from "react-router-dom";
import TeacherCard from "@/components/TeacherCard";
import type { TeacherData } from "@/components/TeacherCard";
import { mockTestimonials } from "@/data/mockData";
import {
  Star, ArrowLeft, Sparkles, GraduationCap, CalendarCheck, Video,
  Users, TrendingUp, Search, Calculator, Atom, FlaskConical, Languages,
  BookOpen, BarChart3, Code, Microscope, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import CountUpNumber from "@/components/CountUpNumber";
import PageHelmet from "@/components/PageHelmet";
import { Helmet } from "react-helmet-async";
import hero3DCap from "@/assets/hero-3d-cap.webp";
import OrbitSubjects from "@/components/OrbitSubjects";

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
  const [featuredTeachers, setFeaturedTeachers] = useState<TeacherData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data: tps } = await supabase
        .from("teacher_profiles")
        .select("user_id, subjects, subjects_en, university, university_en, price, verified")
        .limit(3);
      if (!tps || tps.length === 0) return;
      const userIds = tps.map((tp) => tp.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, full_name_en, bio, bio_en, avatar_url")
        .in("user_id", userIds);
      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));
      setFeaturedTeachers(tps.map((tp) => {
        const profile = profileMap.get(tp.user_id);
        return {
          user_id: tp.user_id,
          full_name: profile?.full_name || t("the_teacher"),
          full_name_en: profile?.full_name_en || null,
          bio: profile?.bio || null,
          bio_en: profile?.bio_en || null,
          avatar_url: profile?.avatar_url || null,
          subjects: tp.subjects || [],
          subjects_en: (tp as any).subjects_en || [],
          university: tp.university || null,
          university_en: (tp as any).university_en || null,
          price: tp.price || 0,
          verified: tp.verified || false,
        };
      }));
    };
    fetchTeachers();
  }, []);

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
  ] as const;

  const howSteps = [
    { key: "1", icon: Search, titleKey: "how_step1_title", descKey: "how_step1_desc" },
    { key: "2", icon: CalendarCheck, titleKey: "how_step2_title", descKey: "how_step2_desc" },
    { key: "3", icon: Video, titleKey: "how_step3_title", descKey: "how_step3_desc" },
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
    <div>
      <Helmet>
        <title>{lang === "ar" ? "OSTAZE - منصة كورسات تعليمية أونلاين | تعلم بسرعتك" : "Ostaze - Online Course Platform | Learn at Your Pace"}</title>
        <meta name="description" content={lang === "ar" ? "منصة OSTAZE للكورسات التعليمية الرقمية: كورسات مسجلة وحية في البرمجة والرياضيات والعلوم واللغات. وصول مدى الحياة، شهادات إتمام، وأسعار مدروسة." : "Ostaze online course platform: recorded and live courses in programming, math, sciences, and languages. Lifetime access, completion certificates, and fair pricing."} />
        <meta name="keywords" content={lang === "ar" ? "كورسات أونلاين، كورسات مسجلة، تعليم رقمي، منصة تعليمية، دورات تدريبية" : "online courses, recorded courses, digital learning, course platform, e-learning"} />
        <meta property="og:title" content="Ostaze - Online Course Platform" />
        <meta property="og:description" content="Recorded and live courses with lifetime access" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ostaze.com" />
        <link rel="canonical" href="https://ostaze.com" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero — Card-Y inspired centered, dark, glowing */}
      <section className="hero-gradient min-h-[100vh] flex items-center justify-center overflow-hidden relative pt-32 pb-16">
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
            <motion.h1 variants={item} className="text-[3rem] sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-2">
              <span className="block text-foreground">{t("hero_title_1")}</span>
              <span className="block text-gradient-soft">{t("hero_title_2")}</span>
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
            <motion.p variants={item} className="text-foreground/75 text-base md:text-lg leading-relaxed max-w-xl mb-8">
              {t("hero_subtitle")}
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

            {/* Quick subject chips */}
            <motion.div variants={item} className="flex flex-wrap justify-center gap-2 mb-10">
              {(["subj_math", "subj_physics", "subj_chemistry", "subj_english"] as const).map((key) => (
                <Link
                  key={key}
                  to="/subjects"
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-foreground/15 text-foreground/70 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  {t(key)}
                </Link>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div variants={item} className="flex justify-center gap-10 md:gap-16">
              {[
                { num: "+500", label: t("hero_stat_teachers") },
                { num: "+10K", label: t("hero_stat_students") },
                { num: "4.9", label: t("hero_stat_rating") },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-foreground">{s.num}</div>
                  <div className="text-muted-foreground text-xs md:text-sm">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-section-alt">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2">{t("why_title")}</h2>
            <p className="text-muted-foreground">{t("why_subtitle")}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: GraduationCap, title: t("why_teachers"), desc: t("why_teachers_desc"), active: true },
              { icon: CalendarCheck, title: t("why_schedule"), desc: t("why_schedule_desc"), active: false },
              { icon: Video, title: t("why_remote"), desc: t("why_remote_desc"), active: false },
            ].map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`feature-card ${i === 0 ? "card-active" : ""}`}>
                <div className="icon-box-lg bg-primary/10 text-primary mx-auto mb-4">
                  <step.icon size={24} />
                </div>
                <h3 className={`font-bold text-lg mb-2 ${i === 0 ? "text-primary" : ""}`}>{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — creative pop-up sequence */}
      <section className="py-20 overflow-hidden">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-extrabold mb-2">{t("how_title")}</h2>
            <p className="text-muted-foreground">{t("how_subtitle")}</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.45, delayChildren: 0.2 } } }}
            className="grid md:grid-cols-3 gap-10 md:gap-6 relative max-w-5xl mx-auto"
          >
            {/* Animated dashed connector */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
              className="hidden md:block absolute top-12 inset-x-[16%] h-0.5 origin-left"
              style={{
                background: "repeating-linear-gradient(90deg, hsl(14 91% 49% / 0.5) 0 8px, transparent 8px 16px)",
              }}
            />
            {howSteps.map((step, i) => (
              <motion.div
                key={step.key}
                variants={{
                  hidden: { opacity: 0, y: 60, scale: 0.6, rotate: -8 },
                  show: {
                    opacity: 1, y: 0, scale: 1, rotate: 0,
                    transition: { type: "spring", stiffness: 180, damping: 14, mass: 0.8 },
                  },
                }}
                className="text-center relative group"
              >
                {/* Glow halo on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
                  style={{ background: "radial-gradient(circle, hsl(14 91% 50% / 0.4), transparent 70%)" }}
                />
                <motion.div
                  whileHover={{ y: -6, rotate: [0, -4, 4, 0] }}
                  transition={{ rotate: { duration: 0.5 } }}
                  className="step-circle-glow w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10"
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                  >
                    <step.icon size={32} className="text-primary" />
                  </motion.div>
                  {/* Number badge with bounce-in */}
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.6 + i * 0.45 }}
                    className="absolute -top-1 -end-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-black shadow-[0_4px_12px_hsl(14_91%_49%/0.5)]"
                  >
                    {step.key}
                  </motion.span>
                  {/* Pulsing ring */}
                  <span
                    className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping pointer-events-none"
                    style={{ animationDelay: `${i * 0.5}s`, animationDuration: "2.5s" }}
                  />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.45, duration: 0.4 }}
                  className="font-bold text-lg mb-2"
                >
                  {t(step.titleKey)}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 + i * 0.45, duration: 0.5 }}
                  className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto"
                >
                  {t(step.descKey)}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Subjects - Orbit Universe */}
      <OrbitSubjects />

      {/* Featured Teachers */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-2">{t("teachers_title")}</h2>
              <p className="text-muted-foreground">{t("teachers_subtitle")}</p>
            </motion.div>
            <Link to="/teachers" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1">
              {t("teachers_view_all")} <ArrowLeft size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTeachers.map((tc, i) => <TeacherCard key={tc.user_id} teacher={tc} index={i} />)}
          </div>
        </div>
      </section>

      {/* Stats — Card-Y dark glow style */}
      <section ref={statsRef} className="py-16 px-4 lg:px-8">
        <div className="stats-card-darkglow relative overflow-hidden rounded-[2rem] p-8 md:p-12">
          <div className="container relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 text-center">
              {[
                { num: "+500", label: t("stats_teachers"), icon: Users },
                { num: "+10,000", label: t("stats_students"), icon: TrendingUp },
                { num: "+25,000", label: t("stats_sessions"), icon: CalendarCheck },
                { num: "4.9/5", label: t("stats_rating"), icon: Star },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="stats-tile-glass p-5 md:p-6"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-3 text-white/90 border border-white/15 backdrop-blur-sm">
                    <s.icon size={20} strokeWidth={2.2} />
                  </div>
                  <div className="text-3xl md:text-5xl font-black text-white leading-none drop-shadow-[0_2px_8px_hsl(228_50%_0%_/_0.4)]">
                    <CountUpNumber target={s.num} />
                  </div>
                  <div className="text-white/75 mt-2 text-xs md:text-sm font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2">{t("testimonials_title")}</h2>
            <p className="text-muted-foreground">{t("testimonials_subtitle")}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {mockTestimonials.map((tst, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-base p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
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
          </div>
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
    </div>
  );
};

export default HomePage;
