import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import naga from "@/assets/team-naga.webp.asset.json";
import safi from "@/assets/team-safi.webp.asset.json";
import loay from "@/assets/team-loay.webp.asset.json";
import khaled from "@/assets/team-khaled.webp.asset.json";

const team = [
  { img: naga.url, name: { ar: "محمد نجا", en: "Mohamed Naga" }, role: { ar: "الرئيس التنفيذي", en: "Chief Executive Officer" } },
  { img: safi.url, name: { ar: "أحمد صافي", en: "Ahmed Safi" }, role: { ar: "المدير المالي", en: "Chief Financial Manager" } },
  { img: loay.url, name: { ar: "لؤي محمد", en: "Loay Mohamed" }, role: { ar: "مدير العمليات", en: "Chief Operational Officer" } },
  { img: khaled.url, name: { ar: "خالد جلال", en: "Khaled Galal" }, role: { ar: "المدير التقني", en: "Chief Technical Officer" } },
];

const OurTeam = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <section className="py-20 md:py-28">
      <div className="container max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <span className="text-primary font-bold tracking-[0.25em] uppercase text-xs mb-4 block">
            {isAr ? "تعرف علينا" : "Meet us"}
          </span>
          <h2 className="text-4xl md:text-5xl font-black leading-[1.15] mb-4">
            {isAr ? "فريقنا التعليمي" : "Our team"}
          </h2>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            {isAr
              ? "خبراء متخصصون في مجالاتهم لضمان جودة التعليم."
              : "Specialists in their fields ensuring the quality of education."}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {team.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
              className="group"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-card/40 border border-border hover:border-primary/50 transition-all duration-500 relative mb-5">
                <img
                  src={m.img}
                  alt={isAr ? m.name.ar : m.name.en}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              </div>
              <h4 className="text-lg md:text-xl font-extrabold text-foreground leading-tight">
                {isAr ? m.name.ar : m.name.en}
              </h4>
              <p
                className="text-primary text-xs md:text-sm font-semibold uppercase tracking-wider mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {isAr ? m.role.ar : m.role.en}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
