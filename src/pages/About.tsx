import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import { Target, Eye, Heart, Users, GraduationCap, Globe, Award, Sparkles } from "lucide-react";

const About = () => {
  const { t, lang } = useLanguage();

  const values = [
    { icon: Award, title: t("about_value1_title"), desc: t("about_value1_desc"), color: "text-primary" },
    { icon: Heart, title: t("about_value2_title"), desc: t("about_value2_desc"), color: "text-rose-500" },
    { icon: Globe, title: t("about_value3_title"), desc: t("about_value3_desc"), color: "text-emerald-500" },
    { icon: Sparkles, title: t("about_value4_title"), desc: t("about_value4_desc"), color: "text-amber-500" },
  ];

  const stats = [
    { value: "500+", label: t("about_stat_teachers") },
    { value: "10,000+", label: t("about_stat_students") },
    { value: "50,000+", label: t("about_stat_sessions") },
    { value: "4.8", label: t("about_stat_rating") },
  ];

  return (
    <div>
      <PageHelmet title={t("about_title")} description={t("about_subtitle")} />
      <PageHeader title={t("about_title")} subtitle={t("about_subtitle")} variant="university" />

      <div className="container py-12">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base p-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
              <Target size={28} />
            </div>
            <h2 className="text-xl font-extrabold mb-3">{t("about_mission_title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("about_mission_desc")}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-base p-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5">
              <Eye size={28} />
            </div>
            <h2 className="text-xl font-extrabold mb-3">{t("about_vision_title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("about_vision_desc")}</p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((s, i) => (
            <div key={i} className="card-base p-6 text-center">
              <p className="text-3xl font-black gradient-text mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Our Story */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card-base p-8 mb-16">
          <h2 className="text-xl font-extrabold mb-4">{t("about_story_title")}</h2>
          <p className="text-muted-foreground leading-loose">{t("about_story_desc")}</p>
        </motion.div>

        {/* Values */}
        <h2 className="text-2xl font-extrabold text-center mb-8">{t("about_values_title")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="card-base p-6 text-center feature-card">
              <div className={`w-12 h-12 rounded-xl bg-secondary/50 ${v.color} flex items-center justify-center mx-auto mb-4`}>
                <v.icon size={22} />
              </div>
              <h3 className="font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
