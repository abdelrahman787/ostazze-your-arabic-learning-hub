import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";

const Terms = () => {
  const { t, lang } = useLanguage();

  const sections = [
    { title: t("terms_section1_title"), content: t("terms_section1_content") },
    { title: t("terms_section2_title"), content: t("terms_section2_content") },
    { title: t("terms_section3_title"), content: t("terms_section3_content") },
    { title: t("terms_section4_title"), content: t("terms_section4_content") },
    { title: t("terms_section5_title"), content: t("terms_section5_content") },
    { title: t("terms_section6_title"), content: t("terms_section6_content") },
    { title: t("terms_section7_title"), content: t("terms_section7_content") },
    { title: t("terms_section8_title"), content: t("terms_section8_content") },
    { title: t("terms_section9_title"), content: t("terms_section9_content") },
  ];

  return (
    <div>
      <PageHelmet title={t("terms_title")} description={t("terms_subtitle")} />
      <PageHeader title={t("terms_title")} subtitle={t("terms_subtitle")} variant="subjects" />

      <div className="container py-12 max-w-3xl mx-auto">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground mb-8">
          {t("terms_last_updated")}
        </motion.p>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card-base p-6">
              <h2 className="text-lg font-extrabold mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black">{i + 1}</span>
                {s.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{s.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terms;
