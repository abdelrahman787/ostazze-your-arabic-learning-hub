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
import hero3DCap from "@/assets/hero-3d-cap.png";

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
    name: "Ostazze",
    url: "https://ostaze.com",
    description: lang === "ar"
      ? "منصة تعليمية تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت"
      : "An educational platform connecting you with the best private tutors for live online sessions",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressCountry: "SA",
    },
  };

  return (
    <div>
      <Helmet>
        <title>{lang === "ar" ? "أستازي - منصة تعليمية | احجز جلسات خصوصية مع أفضل المعلمين" : "Ostazze - Educational Platform | Book Private Sessions"}</title>
        <meta name="description" content={lang === "ar" ? "منصة أستازي التعليمية تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت في الرياضيات والفيزياء والكيمياء والإنجليزي" : "Ostazze connects you with top private tutors for live online sessions in math, physics, chemistry, and English"} />
        <meta name="keywords" content={lang === "ar" ? "معلم خصوصي، دروس خصوصية، منصة تعليمية، تعلم عن بعد" : "private tutor, online tutoring, educational platform, remote learning"} />
        <meta property="og:title" content="Ostazze - منصة تعليمية متميزة" />
        <meta property="og:description" content="احجز جلسات خصوصية مع أفضل المعلمين" />
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
                className="absolute inset-0 rounded-full blur-3xl glow-pulse"
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
                  className="w-full ps-11 pe-4 py-3.5 rounded-full border border-foreground/15 bg-card/40 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all min-h-[52px]"
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

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-2">{t("how_title")}</h2>
            <p className="text-muted-foreground">{t("how_subtitle")}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 inset-x-[15%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            {howSteps.map((step, i) => (
              <motion.div key={step.key} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.15 }}
                className="text-center relative">
                <div className="step-circle-glow w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10">
                  <step.icon size={32} className="text-primary" />
                  <span className="absolute -top-1 -end-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-black shadow-[0_4px_12px_hsl(14_91%_49%/0.5)]">
                    {step.key}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{t(step.titleKey)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{t(step.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="py-16 bg-section-alt">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2">{t("popular_title")}</h2>
            <p className="text-muted-foreground">{t("popular_subtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularSubjects.map((subj, i) => (
              <motion.div key={subj.key} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <Link to="/subjects" className="card-base p-5 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 block group">
                  <div className={`w-14 h-14 rounded-2xl ${subj.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <subj.icon size={24} />
                  </div>
                  <span className="font-bold text-sm">{t(subj.key)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 mb-3 text-white shadow-[inset_0_1px_0_hsl(0_0%_100%_/_0.3),0_4px_12px_hsl(0_0%_0%_/_0.15)] backdrop-blur-sm">
                    <s.icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-3xl md:text-5xl font-black text-white leading-none drop-shadow-[0_2px_8px_hsl(0_0%_0%_/_0.25)]">
                    <CountUpNumber target={s.num} />
                  </div>
                  <div className="text-white/85 mt-2 text-xs md:text-sm font-medium">{s.label}</div>
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

      {/* CTA */}
      <section className="cta-gradient py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white mb-3">{t("cta_title")}</h2>
            <p className="text-[hsl(210,15%,65%)] mb-8 max-w-lg mx-auto">{t("cta_subtitle")}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/register" className="btn-primary text-base !px-8">{t("cta_register")}</Link>
              <Link to="/teachers" className="border-2 border-white/20 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/5 transition-all min-h-[44px] flex items-center">
                {t("hero_browse")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
