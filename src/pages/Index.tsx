import { Link } from "react-router-dom";
import TeacherCard from "@/components/TeacherCard";
import type { TeacherData } from "@/components/TeacherCard";
import { mockTestimonials } from "@/data/mockData";
import {
  Star, ArrowLeft, Sparkles, GraduationCap, CalendarCheck, Video,
  CheckCircle2, Play, Users, TrendingUp
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import CountUpNumber from "@/components/CountUpNumber";

const heroImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// Floating shapes for hero
const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-primary/5"
        style={{
          width: 40 + i * 30,
          height: 40 + i * 30,
          top: `${10 + i * 14}%`,
          left: `${5 + i * 15}%`,
        }}
        animate={{
          y: [0, -15, 0],
          x: [0, 8, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4 + i * 0.7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.5,
        }}
      />
    ))}
  </div>
);

const HomePage = () => {
  const { t, d } = useLanguage();
  const [featuredTeachers, setFeaturedTeachers] = useState<TeacherData[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: statsRef, offset: ["start end", "end start"] });

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
  const statsScale = useTransform(scrollYProgress, [0, 0.5], [0.96, 1]);

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient min-h-[85vh] flex items-center overflow-hidden relative">
        <FloatingShapes />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={item} className="badge-brand inline-flex items-center gap-2 mb-6">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <Sparkles size={14} />
                </motion.div>
                <span>{t("hero_badge")}</span>
              </motion.div>

              <motion.h1 variants={item} className="text-4xl md:text-[3.2rem] font-black leading-[1.15] mb-4">
                {t("hero_title_1")}{" "}
                <span className="text-primary">{t("hero_title_2")}</span>
              </motion.h1>

              <motion.p variants={item} className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
                {t("hero_subtitle")}
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/teachers" className="btn-primary text-base !px-8 flex items-center gap-2">
                    {t("hero_cta")}
                    <motion.div whileHover={{ x: -4 }}><ArrowLeft size={16} /></motion.div>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/teachers" className="border-2 border-border text-foreground px-8 py-3 rounded-xl font-bold hover:border-primary/50 transition-all">
                    {t("hero_browse")}
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div variants={item} className="flex gap-10">
                {[
                  { num: "+500", label: t("hero_stat_teachers") },
                  { num: "+10K", label: t("hero_stat_students") },
                  { num: "4.9", label: t("hero_stat_rating") },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl md:text-3xl font-black text-foreground">{s.num}</div>
                    <div className="text-muted-foreground text-sm">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <div className="relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <img src={heroImage} alt="Students" className="rounded-3xl w-full object-cover h-[440px] opacity-90" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute top-6 -left-4 bg-card rounded-2xl border p-3.5 flex items-center gap-3 shadow-lg"
              >
                <motion.div whileHover={{ scale: 1.15, rotate: 10 }} className="icon-box bg-primary/10">
                  <GraduationCap size={20} className="text-primary" />
                </motion.div>
                <div>
                  <div className="font-bold text-sm">{t("hero_certified")}</div>
                  <div className="text-muted-foreground text-xs">{t("hero_certified_sub")}</div>
                </div>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2.5 h-2.5 bg-success rounded-full mr-2" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute bottom-6 right-4 bg-card rounded-2xl border p-3.5 flex items-center gap-3 shadow-lg"
              >
                <div>
                  <div className="font-bold text-sm">{t("hero_live")}</div>
                  <div className="text-muted-foreground text-xs">{t("hero_live_sub")}</div>
                </div>
                <motion.div whileHover={{ scale: 1.15, rotate: -10 }} className="icon-box bg-success/10">
                  <Video size={20} className="text-success" />
                </motion.div>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="w-2.5 h-2.5 bg-success rounded-full" />
              </motion.div>
            </div>
          </div>
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
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className={`card-base p-7 text-center transition-all duration-300 ${i === 0 ? "card-active" : ""}`}>
                <motion.div whileHover={{ scale: 1.15, rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}
                  className="icon-box-lg bg-primary/10 text-primary mx-auto mb-4">
                  <step.icon size={24} />
                </motion.div>
                <h3 className={`font-bold text-lg mb-2 ${i === 0 ? "text-primary" : ""}`}>{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
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

      {/* Stats - Glassmorphism */}
      <motion.section ref={statsRef} className="py-16 mx-4 lg:mx-8 rounded-3xl relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(21,90%,48%)] via-[hsl(24,94%,50%)] to-[hsl(30,95%,55%)] rounded-3xl" />
        {/* Floating bg circles */}
        <motion.div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-white/10"
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 5, repeat: Infinity }} />
        <motion.div className="absolute bottom-[-30px] left-[10%] w-[150px] h-[150px] rounded-full bg-white/5"
          animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} />

        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center text-white">
            {[
              { num: "+500", label: t("stats_teachers"), icon: Users },
              { num: "+10,000", label: t("stats_students"), icon: TrendingUp },
              { num: "+25,000", label: t("stats_sessions"), icon: CalendarCheck },
              { num: "4.9/5", label: t("stats_rating"), icon: Star },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-5 backdrop-blur-[10px] bg-white/10 border border-white/20">
                <motion.div whileHover={{ scale: 1.2, rotate: 15 }} className="inline-block mb-2 opacity-90">
                  <s.icon size={22} />
                </motion.div>
                <div className="text-3xl md:text-4xl font-black">
                  <CountUpNumber target={s.num} />
                </div>
                <div className="opacity-85 mt-1 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

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
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }} className="card-base p-6 transition-all duration-300">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <motion.div key={n} whileHover={{ scale: 1.3, rotate: 15 }}>
                      <Star size={14} className="fill-warning text-warning" />
                    </motion.div>
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
      <section className="bg-[hsl(215,28%,14%)] py-16">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white mb-3">{t("cta_title")}</h2>
            <p className="text-[hsl(210,15%,65%)] mb-8 max-w-lg mx-auto">{t("cta_subtitle")}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="btn-primary text-base !px-8">{t("cta_register")}</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/teachers" className="border-2 border-white/20 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/5 transition-all">
                  {t("hero_browse")}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
