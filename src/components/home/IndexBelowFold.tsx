import { Link } from "react-router-dom";
import { mockTestimonials } from "@/data/testimonials";
import { Star, ArrowLeft, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import OurTeam from "@/components/OurTeam";

import uniKsu from "@/assets/unis/king-saud.webp.asset.json";
import uniKfupm from "@/assets/unis/kfupm.png.asset.json";
import uniQatar from "@/assets/unis/qatar-university.png.asset.json";
import uniKhalifa from "@/assets/unis/khalifa.png.asset.json";
import uniZayed from "@/assets/unis/zayed.png.asset.json";
import uniHbku from "@/assets/unis/hbku.png.asset.json";

/**
 * Unified editorial theme — all sections share the same card language:
 *  - surface: bg-card/40 border border-border rounded-3xl
 *  - accent: primary orange used only as small marks / numerals / accents
 *  - typography: oversized black headings with muted zinc secondary line
 */
const IndexBelowFold = () => {
  const { t, d, lang } = useLanguage();
  const isAr = lang === "ar";

  const howSteps = [
    { key: isAr ? "١" : "1", titleKey: "how_step1_title", descKey: "how_step1_desc" },
    { key: isAr ? "٢" : "2", titleKey: "how_step2_title", descKey: "how_step2_desc" },
    { key: isAr ? "٣" : "3", titleKey: "how_step3_title", descKey: "how_step3_desc" },
  ] as const;

  const cardBase =
    "bg-card/40 border border-border rounded-3xl transition-all duration-500 hover:border-primary/50";

  return (
    <div className="bg-background text-foreground">
      {/* 1 — How It Works */}
      <section className="py-20 md:py-28">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="text-primary font-bold tracking-[0.25em] uppercase text-xs block mb-4">
              {isAr ? "آلية العمل" : "How it works"}
            </span>
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">
              {t("how_title")}
              <br />
              <span className="text-muted-foreground/70">{t("how_subtitle")}</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            {howSteps.map((step) => (
              <motion.div
                key={step.key}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <Link to="/universities" className={`${cardBase} block p-8 md:p-10 group h-full`}>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-8 text-primary-foreground font-black text-lg"
                    style={{
                      background: "hsl(var(--primary))",
                      boxShadow: "0 0 24px hsl(var(--primary) / 0.35)",
                    }}
                  >
                    {step.key}
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold mb-4">{t(step.titleKey)}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t(step.descKey)}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2 — Why Choose Us */}
      <section className="py-20 md:py-28 bg-section-alt">
        <div className="container max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-bold tracking-[0.25em] uppercase text-xs mb-4 block">
                {isAr ? "المميزات" : "Features"}
              </span>
              <h2 className="text-4xl md:text-5xl font-black leading-[1.15] mb-8">
                {t("why_title")}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md">
                {t("why_subtitle")}
              </p>
              <div className="space-y-6">
                {[
                  { title: t("why_teachers"), desc: t("why_teachers_desc") },
                  { title: t("why_schedule"), desc: t("why_schedule_desc") },
                  { title: t("why_remote"), desc: t("why_remote_desc") },
                ].map((f) => (
                  <div key={f.title} className="flex gap-4">
                    <div className="mt-1.5 shrink-0 w-6 h-6 rounded-full border border-primary flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg md:text-xl mb-1">{f.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats grid — same card language */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { v: "+12k", l: isAr ? "طالب نشط" : "Active students" },
                { v: "98%", l: isAr ? "نسبة الرضا" : "Satisfaction rate", offset: true },
                { v: "+150", l: isAr ? "معلم متميز" : "Top teachers" },
                { v: "24/7", l: isAr ? "دعم مستمر" : "Support", offset: true },
              ].map((s) => (
                <div
                  key={s.v}
                  className={`${cardBase} p-6 md:p-8 text-center ${s.offset ? "mt-8" : ""}`}
                >
                  <div className="text-4xl md:text-5xl font-black text-primary mb-2">{s.v}</div>
                  <div className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">
                    {s.l}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3 — WhatsApp CTA */}
      <section className="py-14 md:py-16">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start"
            style={{
              background: "linear-gradient(105deg, hsl(var(--primary)) 0%, hsl(14 82% 42%) 100%)",
              boxShadow: "0 30px 70px -25px hsl(var(--primary) / 0.55)",
            }}
          >
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-4xl font-black text-white mb-2">
                {t("whatsapp_cta_title")}
              </h3>
              <p className="text-white/85 max-w-md">{t("whatsapp_cta_subtitle")}</p>
            </div>
            <a
              href={`https://wa.me/201130382206?text=${encodeURIComponent(t("whatsapp_msg"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 bg-white text-primary px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:scale-105 transition-transform flex items-center gap-3 shadow-xl whitespace-nowrap"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412 0 6.556-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.52c1.54.914 3.51 1.487 5.611 1.488 5.648 0 10.246-4.595 10.246-10.243 0-5.648-4.596-10.246-10.246-10.246-2.731 0-5.297 1.063-7.228 2.995-1.93 1.93-2.993 4.494-2.993 7.226.001 2.136.621 3.991 1.745 5.713l-.999 3.65 3.738-.981z" />
              </svg>
              <span>{t("whatsapp_cta_button")}</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* 4 — Trust: students at top universities */}
      <section className="py-20 md:py-24 bg-section-alt">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <span className="text-primary font-bold tracking-[0.25em] uppercase text-xs block mb-4">
              {isAr ? "ثقة أكاديمية" : "Academic trust"}
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.15] max-w-3xl">
              {isAr ? "طلابنا ملتحقون " : "Our students study at "}
              <span className="text-primary">
                {isAr ? "بأعرق الجامعات" : "top-tier universities"}
              </span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
              {isAr
                ? "طلابنا مقبولون في أعرق المؤسسات الأكاديمية في السعودية، الإمارات، الكويت وقطر."
                : "Our students are accepted at the most prestigious academic institutions across KSA, UAE, Kuwait and Qatar."}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { src: uniKsu.url, alt: "King Saud University" },
              { src: uniKfupm.url, alt: "KFUPM" },
              { src: uniKhalifa.url, alt: "Khalifa University" },
              { src: uniZayed.url, alt: "Zayed University" },
              { src: uniQatar.url, alt: "Qatar University" },
              { src: uniHbku.url, alt: "HBKU" },
            ].map((u) => (
              <div
                key={u.alt}
                className={`${cardBase} h-20 md:h-24 flex items-center justify-center p-4 grayscale opacity-70 hover:opacity-100 hover:grayscale-0`}
              >
                <img
                  src={u.src}
                  alt={u.alt}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/universities"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm md:text-base font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(24 95% 55%) 100%)",
                boxShadow: "0 12px 30px -10px hsl(var(--primary) / 0.55)",
              }}
            >
              <GraduationCap className="w-4 h-4" />
              <span>{isAr ? "تصفح كل الجامعات" : "Browse all universities"}</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5 — Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary font-bold tracking-[0.25em] uppercase text-xs block mb-4">
              {isAr ? "شهادات" : "Testimonials"}
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">{t("testimonials_title")}</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          >
            {mockTestimonials.map((tst, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
                className={`${cardBase} p-8 ${i === 1 ? "border-t-primary border-t-[3px]" : ""}`}
              >
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/85 italic mb-8 leading-relaxed text-base md:text-lg">
                  "{d(tst.quote)}"
                </p>
                <div className="flex items-center gap-4 border-t border-border pt-5">
                  {(tst as any).avatar ? (
                    <img
                      src={(tst as any).avatar}
                      alt={d(tst.name)}
                      loading="lazy"
                      decoding="async"
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/40"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold ring-2 ring-primary/40">
                      {d(tst.name).charAt(0)}
                    </div>
                  )}
                  <div>
                    <h5 className="font-bold text-sm">{d(tst.name)}</h5>
                    <span className="text-muted-foreground text-xs">{d(tst.university)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6 — Final CTA */}
      <section className="py-20 md:py-28 bg-section-alt">
        <div className="container max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6">
              {t("cta_title")}
              <br />
              <span className="text-primary">{t("cta_subtitle")}</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link
                to="/register"
                className="px-10 py-4 md:py-5 rounded-full font-black text-base md:text-lg text-primary-foreground transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(24 95% 55%) 100%)",
                  boxShadow: "0 12px 30px -10px hsl(var(--primary) / 0.55)",
                }}
              >
                {t("cta_register")}
              </Link>
              <Link
                to="/teachers"
                className={`${cardBase} px-10 py-4 md:py-5 rounded-full font-black text-base md:text-lg text-foreground inline-flex items-center justify-center`}
              >
                {t("hero_browse")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7 — Team */}
      <OurTeam />
    </div>
  );
};

export default IndexBelowFold;
