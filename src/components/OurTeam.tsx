import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import naga from "@/assets/team-naga.webp.asset.json";
import safi from "@/assets/team-safi.webp.asset.json";
import loay from "@/assets/team-loay.webp.asset.json";
import khaled from "@/assets/team-khaled.webp.asset.json";

const team = [
  { img: naga.url, name: { ar: "محمد ناجا", en: "Mohamed Naga" }, role: { ar: "الرئيس التنفيذي", en: "Chief Executive Officer" } },
  { img: safi.url, name: { ar: "أحمد صافي", en: "Ahmed Safi" }, role: { ar: "المدير المالي", en: "Chief Financial Manager" } },
  { img: loay.url, name: { ar: "لؤي محمد", en: "Loay Mohamed" }, role: { ar: "مدير العمليات", en: "Chief Operational Officer" } },
  { img: khaled.url, name: { ar: "خالد جلال", en: "Khaled Galal" }, role: { ar: "المدير التقني", en: "Chief Technical Officer" } },
];

const OurTeam = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <section className="py-20 md:py-24">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}>
            {isAr ? "تعرف علينا" : "Meet Us"}
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {isAr ? "فريقنا" : "Our Team"}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {isAr
              ? "العقول التي تقف خلف OSTAZE — شغف، خبرة، والتزام بنجاحك."
              : "The minds behind OSTAZE — passion, expertise, and a commitment to your success."}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {team.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: "0 4px 20px -8px hsl(var(--foreground) / 0.1)" }}
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={m.img}
                  alt={isAr ? m.name.ar : m.name.en}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div
                className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 0%, hsl(0 0% 0% / 0.55) 45%, hsl(0 0% 0% / 0.85) 100%)",
                }}
              >
                <h3 className="text-base md:text-lg font-bold leading-tight">
                  {isAr ? m.name.ar : m.name.en}
                </h3>
                <p className="text-xs md:text-sm text-white/80 mt-0.5">
                  {isAr ? m.role.ar : m.role.en}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
