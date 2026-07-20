import { Link } from "react-router-dom";
import { mockTestimonials } from "@/data/testimonials";
import {
  Star, ArrowLeft, Sparkles, GraduationCap, CalendarCheck, Video,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import OurTeam from "@/components/OurTeam";

import howStep1Asset from "@/assets/how-step-1.webp.asset.json";
import howStep2Asset from "@/assets/how-step-2.webp.asset.json";
import howStep3Asset from "@/assets/how-step-3.webp.asset.json";
const howStep1Img = howStep1Asset.url;
const howStep2Img = howStep2Asset.url;
const howStep3Img = howStep3Asset.url;
import logosGridImg from "@/assets/university-logos-grid.webp.asset.json";
import logosGridImg960 from "@/assets/university-logos-grid-960.webp.asset.json";

/**
 * Below-the-fold home page sections. Split out of Index.tsx so that
 * framer-motion (~40 KB gz) stays out of the initial critical bundle.
 * Loaded via React.lazy after the hero paints.
 */
const IndexBelowFold = () => {
  const { t, d, lang } = useLanguage();
  const howStepsRef = useRef<HTMLDivElement>(null);
  const howStepsInView = useInView(howStepsRef, { once: true, amount: 0.2 });
  const [playHowSteps, setPlayHowSteps] = useState(false);

  useEffect(() => {
    if (howStepsInView) {
      const frame = requestAnimationFrame(() => setPlayHowSteps(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [howStepsInView]);

  useEffect(() => {
    if (playHowSteps) return;
    const check = () => {
      const el = howStepsRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.82 && rect.bottom > vh * 0.18) setPlayHowSteps(true);
    };
    const frame = requestAnimationFrame(check);
    const timeout = window.setTimeout(check, 700);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [playHowSteps]);

  const howSteps = [
    { key: "1", image: howStep1Img, titleKey: "how_step1_title", descKey: "how_step1_desc" },
    { key: "2", image: howStep2Img, titleKey: "how_step2_title", descKey: "how_step2_desc" },
    { key: "3", image: howStep3Img, titleKey: "how_step3_title", descKey: "how_step3_desc" },
  ] as const;

  return (
    <>
      {/* How It Works + WhatsApp CTA — combined section */}
      <section className="py-20 md:py-24 overflow-hidden bg-section-alt">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-extrabold mb-2">{t("how_title")}</h2>
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
              <Link to="/universities" key={step.key} className="block group">
                <motion.div
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } } }}
                  className="text-center relative"
                >
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

                  <motion.h3
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                    className="font-extrabold text-xl md:text-2xl mb-6 text-foreground whitespace-pre-line"
                  >
                    {t(step.titleKey)}
                  </motion.h3>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 40, scale: 0.9 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 140, damping: 18 } },
                    }}
                    whileHover={{ y: -6 }}
                    className="relative mx-auto w-full max-w-[260px] aspect-square flex items-center justify-center"
                  >
                    <div className="absolute inset-4 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-[hsl(28_60%_88%)] dark:bg-[hsl(28_25%_22%)] opacity-90 blur-[1px]" aria-hidden="true" />
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

                  <motion.p
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5 } } }}
                    className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto mt-4"
                  >
                    {t(step.descKey)}
                  </motion.p>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mt-12">
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 px-9 py-3.5 rounded-full text-sm md:text-base font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 100%)",
                boxShadow: "0 12px 30px -10px hsl(var(--primary) / 0.55), inset 0 1px 0 hsl(0 0% 100% / 0.25)",
              }}
            >
              <span>{lang === "ar" ? "ابدأ الآن" : "Get Started"}</span>
            </Link>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 text-center border mt-16"
            style={{
              background: "linear-gradient(140deg, hsl(var(--card)) 0%, hsl(var(--background)) 60%, hsl(var(--primary) / 0.06) 100%)",
              borderColor: "hsl(var(--primary) / 0.2)",
              boxShadow: "0 30px 80px -30px hsl(var(--primary) / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.06)",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.18] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
              }}
            />
            <div
              className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full blur-[90px] opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(38 92% 55% / 0.45) 0%, transparent 70%)" }}
            />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">{t("whatsapp_cta_title")}</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">{t("whatsapp_cta_subtitle")}</p>
              <a
                href={`https://wa.me/201130382206?text=${encodeURIComponent(t("whatsapp_msg"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  boxShadow: "0 10px 30px -10px rgba(37,211,102,0.55), inset 0 1px 0 rgba(255,255,255,0.25)",
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>{t("whatsapp_cta_button")}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2">{t("why_title")}</h2>
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

      {/* Trust banner */}
      <section className="relative py-20 md:py-24 overflow-hidden bg-section-alt">
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            background: "radial-gradient(60% 60% at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 70%), radial-gradient(50% 50% at 90% 100%, hsl(38 92% 55% / 0.07) 0%, transparent 70%)",
          }}
        />
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[2rem] overflow-hidden p-4 md:p-6 border transition-colors"
            style={{
              background: "linear-gradient(140deg, hsl(var(--card)) 0%, hsl(var(--background)) 60%, hsl(var(--primary) / 0.06) 100%)",
              borderColor: "hsl(var(--primary) / 0.2)",
              boxShadow: "0 30px 80px -30px hsl(var(--primary) / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.06)",
            }}
          >
            <div className="relative text-center pt-4 md:pt-6 pb-6 md:pb-8 px-3">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase mb-4"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(38 92% 55% / 0.10))",
                  color: "hsl(var(--primary))",
                  border: "1px solid hsl(var(--primary) / 0.22)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {lang === "ar" ? "ثقة الطلاب" : "Trusted by Students"}
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                {lang === "ar" ? "طلابنا ملتحقون بـ" : "Our Students Study At"}
                <span
                  className="block mt-1 bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, hsl(var(--primary)), hsl(38 92% 55%))" }}
                >
                  {lang === "ar" ? "أعرق الجامعات" : "Top-Tier Universities"}
                </span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                {lang === "ar"
                  ? "آلاف الطلاب من أبرز الجامعات في السعودية، الإمارات، الكويت وقطر يثقون بـ OSTAZE لرحلتهم الدراسية."
                  : "Thousands of students from leading universities across KSA, UAE, Kuwait & Qatar trust OSTAZE for their academic journey."}
              </p>
            </div>

            <div
              className="absolute inset-0 opacity-[0.18] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
              }}
            />
            <div
              className="absolute -top-16 -left-16 w-[240px] h-[240px] rounded-full blur-[80px] opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.55) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-16 -right-16 w-[260px] h-[260px] rounded-full blur-[90px] opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(38 92% 55% / 0.45) 0%, transparent 70%)" }}
            />

            <div className="relative mt-2 rounded-2xl overflow-hidden" style={{ background: "hsl(var(--primary))" }}>
              <img
                src={logosGridImg.url}
                alt={lang === "ar" ? "شعارات الجامعات" : "University logos"}
                loading="lazy"
                className="w-full h-auto block"
                style={{ filter: "hue-rotate(-8deg) saturate(1.05)" }}
              />
              <div className="absolute inset-y-0 left-0 w-[28%] sm:w-[22%] md:w-[17%] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-6 px-1 sm:px-2 md:px-3">
                <div className="flex flex-col items-center text-center">
                  <div className="text-white font-black leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]" style={{ fontSize: "clamp(1.4rem, 5.5vw, 2.6rem)" }}>+12k</div>
                  <div className="text-white font-bold leading-tight mt-1" style={{ fontSize: "clamp(0.75rem, 2.4vw, 0.9rem)" }}>{lang === "ar" ? "طلّاب" : "Students"}</div>
                  <div className="text-white font-bold leading-tight" style={{ fontSize: "clamp(0.75rem, 2.4vw, 0.9rem)" }}>{lang === "ar" ? "نشط" : "Active"}</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div
                    className="flex items-center justify-center rounded-full border-2 border-white/50"
                    style={{ width: "clamp(2.8rem, 11vw, 4.5rem)", height: "clamp(2.8rem, 11vw, 4.5rem)" }}
                  >
                    <span className="text-white font-black leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" style={{ fontSize: "clamp(0.95rem, 3.6vw, 1.6rem)" }}>98%</span>
                  </div>
                  <div className="text-white font-semibold leading-tight mt-1.5" style={{ fontSize: "clamp(0.65rem, 2vw, 0.75rem)" }}>{lang === "ar" ? "رضا" : "Satisfaction"}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-8">
            <Link
              to="/universities"
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(24 95% 55%) 100%)",
                boxShadow: "0 10px 30px -10px hsl(var(--primary) / 0.55), inset 0 1px 0 hsl(0 0% 100% / 0.25)",
              }}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{lang === "ar" ? "تصفح كل الجامعات" : "Browse all universities"}</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Testimonials */}
          <div className="mt-20 md:mt-24">
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
                    {(tst as any).avatar ? (
                      <img src={(tst as any).avatar} alt={d(tst.name)} loading="lazy" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{d(tst.name).charAt(0)}</div>
                    )}
                    <div>
                      <div className="font-bold text-sm">{d(tst.name)}</div>
                      <div className="text-muted-foreground text-xs">{d(tst.university)}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 md:py-24 px-4 lg:px-8 bg-section-alt">
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

      <OurTeam />
    </>
  );
};

export default IndexBelowFold;
