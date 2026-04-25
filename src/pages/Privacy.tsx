import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Privacy = () => {
  const { t } = useLanguage();

  const sections = [
    { title: t("privacy_section1_title"), content: t("privacy_section1_content") },
    { title: t("privacy_section2_title"), content: t("privacy_section2_content") },
    { title: t("privacy_section3_title"), content: t("privacy_section3_content") },
    { title: t("privacy_section4_title"), content: t("privacy_section4_content") },
    { title: t("privacy_section5_title"), content: t("privacy_section5_content") },
    { title: t("privacy_section6_title"), content: t("privacy_section6_content") },
    { title: t("privacy_section7_title"), content: t("privacy_section7_content") },
    { title: t("privacy_section8_title"), content: t("privacy_section8_content") },
    { title: t("privacy_section9_title"), content: t("privacy_section9_content") },
  ];

  return (
    <div>
      <PageHelmet title={t("privacy_title")} description={t("privacy_subtitle")} />
      <PageHeader title={t("privacy_title")} subtitle={t("privacy_subtitle")} variant="university">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
          <Shield size={16} />
          {t("privacy_badge")}
        </div>
      </PageHeader>

      <div className="container py-12 max-w-3xl mx-auto">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground mb-8">
          {t("privacy_last_updated")}
        </motion.p>
        <div className="space-y-8">
          {sections.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card-base p-6">
              <h2 className="text-lg font-extrabold mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs font-black">{i + 1}</span>
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

export default Privacy;
