import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calculator, Atom, FlaskConical, Languages,
  BookOpen, BarChart3, Code, Microscope
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import gradCap from "@/assets/hero-3d-cap.png";

type Subject = {
  key: string;
  icon: typeof Calculator;
};

const SUBJECTS: Subject[] = [
  { key: "subj_math", icon: Calculator },
  { key: "subj_physics", icon: Atom },
  { key: "subj_chemistry", icon: FlaskConical },
  { key: "subj_english", icon: Languages },
  { key: "subj_accounting", icon: BookOpen },
  { key: "subj_statistics", icon: BarChart3 },
  { key: "subj_programming", icon: Code },
  { key: "subj_biology", icon: Microscope },
];

// Distribute 8 subjects across 3 orbits: 2 inner, 3 middle, 3 outer
const ORBITS = [
  { radius: 150, duration: 28, count: 2, reverse: false },
  { radius: 245, duration: 42, count: 3, reverse: true },
  { radius: 340, duration: 58, count: 3, reverse: false },
];

const OrbitSubjects = () => {
  const { t } = useLanguage();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      if (w < 480) setScale(0.5);
      else if (w < 768) setScale(0.7);
      else if (w < 1024) setScale(0.85);
      else setScale(1);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Build subject placements per orbit
  let subjectIdx = 0;
  const orbitItems = ORBITS.map((orbit) => {
    const items = [];
    for (let i = 0; i < orbit.count; i++) {
      const subj = SUBJECTS[subjectIdx++];
      const angle = (360 / orbit.count) * i;
      items.push({ ...subj, angle });
    }
    return { ...orbit, items };
  });

  return (
    <section className="relative overflow-hidden py-20 bg-[hsl(265_45%_8%)]">
      {/* Deep radial glow background - purple + orange accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(22 90% 55% / 0.18), transparent 60%), radial-gradient(ellipse 80% 60% at 50% 50%, hsl(265 60% 18% / 0.7), transparent 70%), radial-gradient(ellipse 100% 80% at 50% 100%, hsl(280 70% 25% / 0.4), transparent 70%)",
        }}
      />

      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        {Array.from({ length: 60 }).map((_, i) => {
          const top = (i * 37) % 100;
          const left = (i * 53) % 100;
          const size = (i % 3) + 1;
          const delay = (i % 8) * 0.4;
          return (
            <span
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: 0.2 + (i % 5) * 0.12,
                animationDelay: `${delay}s`,
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          );
        })}
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-white">
            {t("popular_title")}
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">{t("popular_subtitle")}</p>
        </motion.div>

        {/* Orbit Stage */}
        <div
          className="relative mx-auto"
          style={{
            width: 720 * scale,
            height: 720 * scale,
            maxWidth: "100%",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
          >
            {/* Orbit rings */}
            {ORBITS.map((orbit, idx) => (
              <div
                key={`ring-${idx}`}
                className="absolute rounded-full border border-dashed"
                style={{
                  width: orbit.radius * 2,
                  height: orbit.radius * 2,
                  borderColor: `hsl(22 80% 60% / ${0.18 - idx * 0.04})`,
                }}
              />
            ))}

            {/* Central 3D Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 80, damping: 14 }}
              className="absolute z-20"
            >
              <div className="relative">
                {/* Glow halo */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, hsl(22 95% 60% / 0.6), transparent 70%)",
                    transform: "scale(2)",
                  }}
                />
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 2, 0, -2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-40 h-40 md:w-52 md:h-52 flex items-center justify-center"
                >
                  <img
                    src={gradCap}
                    alt="OSTAZZE 3D Logo"
                    className="w-full h-full object-contain drop-shadow-[0_20px_40px_hsl(22_95%_50%/0.6)]"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Orbiting subjects */}
            {orbitItems.map((orbit, oIdx) => (
              <motion.div
                key={`orbit-${oIdx}`}
                className="absolute"
                style={{
                  width: orbit.radius * 2,
                  height: orbit.radius * 2,
                  top: "50%",
                  left: "50%",
                  marginLeft: -orbit.radius,
                  marginTop: -orbit.radius,
                }}
                animate={{ rotate: orbit.reverse ? -360 : 360 }}
                transition={{
                  duration: orbit.duration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {orbit.items.map((subj, i) => {
                  const Icon = subj.icon;
                  const rad = (subj.angle * Math.PI) / 180;
                  const x = Math.cos(rad) * orbit.radius;
                  const y = Math.sin(rad) * orbit.radius;
                  return (
                    <div
                      key={subj.key}
                      className="absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                        width: 88,
                        height: 88,
                        marginLeft: -44,
                        marginTop: -44,
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      {/* Counter-rotate so cards stay upright */}
                      <motion.div
                        className="w-full h-full flex items-center justify-center"
                        animate={{ rotate: orbit.reverse ? 360 : -360 }}
                        transition={{
                          duration: orbit.duration,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.3 + oIdx * 0.15 + i * 0.1,
                            duration: 0.5,
                            ease: "easeOut",
                          }}
                        >
                          <Link
                            to="/subjects"
                            className="group flex flex-col items-center gap-2"
                            aria-label={t(subj.key)}
                          >
                            <motion.div
                              whileHover={{ scale: 1.15 }}
                              className="w-[88px] h-[88px] rounded-full flex items-center justify-center backdrop-blur-md transition-all"
                              style={{
                                background:
                                  "linear-gradient(135deg, hsl(265 40% 25% / 0.7), hsl(280 40% 15% / 0.7))",
                                border: "1px solid hsl(22 80% 60% / 0.35)",
                                boxShadow:
                                  "0 8px 24px hsl(0 0% 0% / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.18), 0 0 28px hsl(22 90% 55% / 0.3)",
                              }}
                            >
                              <Icon
                                className="text-orange-300 group-hover:text-orange-200 transition-colors"
                                size={32}
                              />
                            </motion.div>
                            <span className="text-xs md:text-sm font-semibold text-white/90 group-hover:text-white whitespace-nowrap drop-shadow-md">
                              {t(subj.key)}
                            </span>
                          </Link>
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>


        {/* CTA below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            to="/subjects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, hsl(22 95% 55%), hsl(18 90% 45%))",
              boxShadow: "0 10px 30px hsl(22 95% 45% / 0.4)",
            }}
          >
            {t("view_all")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default OrbitSubjects;
