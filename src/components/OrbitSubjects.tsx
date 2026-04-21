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
  { key: "subj_programming", icon: Code },
];

// Distribute 5 subjects across 2 orbits with custom angle offsets for balanced look
// Inner orbit: 2 icons placed left & right; Outer orbit: 3 icons in a balanced triangle
const ORBITS = [
  { radius: 200, duration: 40, count: 2, reverse: false, offset: 0 },    // inner: 0°, 180° (left & right)
  { radius: 360, duration: 40, count: 3, reverse: false, offset: 90 },   // outer: 90°, 210°, 330° (triangle)
];

const OrbitSubjects = () => {
  const { t } = useLanguage();
  const [scale, setScale] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

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

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);

    return () => {
      window.removeEventListener("resize", updateScale);
      mq.removeEventListener?.("change", onChange);
    };
  }, []);

  // Build subject placements per orbit
  let subjectIdx = 0;
  const orbitItems = ORBITS.map((orbit) => {
    const items = [];
    for (let i = 0; i < orbit.count; i++) {
      const subj = SUBJECTS[subjectIdx++];
      const angle = (360 / orbit.count) * i + (orbit.offset ?? 0);
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
            width: 900 * scale,
            height: 720 * scale,
            maxWidth: "100%",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
          >
            {/* Orbit rings (tilted ellipses) */}
            {ORBITS.map((orbit, idx) => (
              <div
                key={`ring-${idx}`}
                className="absolute rounded-full border border-dashed"
                style={{
                  width: orbit.radius * 2,
                  height: orbit.radius * 2,
                  borderColor: `hsl(265 60% 75% / ${0.28 - idx * 0.05})`,
                }}
              />
            ))}

            {/* Glowing dots traveling along each orbit */}
            {ORBITS.map((orbit, idx) => {
              // 2 dots per orbit, opposite sides; each orbit slightly different speed for variety
              const dotCount = 2;
              const duration = 14 + idx * 6;
              return Array.from({ length: dotCount }).map((_, dIdx) => (
                <motion.div
                  key={`dot-orbit-${idx}-${dIdx}`}
                  className="absolute"
                  style={{
                    width: orbit.radius * 2,
                    height: orbit.radius * 2,
                    top: "50%",
                    left: "50%",
                    marginLeft: -orbit.radius,
                    marginTop: -orbit.radius,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    ease: "linear",
                    delay: dIdx * (duration / dotCount),
                  }}
                >
                  <div
                    className="absolute rounded-full"
                    style={{
                      top: "50%",
                      left: "100%",
                      width: 8,
                      height: 8,
                      marginTop: -4,
                      marginLeft: -4,
                      background:
                        "radial-gradient(circle, hsl(22 100% 70%) 0%, hsl(22 95% 55%) 50%, transparent 100%)",
                      boxShadow:
                        "0 0 12px hsl(22 95% 60% / 0.9), 0 0 24px hsl(22 95% 55% / 0.6)",
                    }}
                  />
                </motion.div>
              ));
            })}

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
                    alt="OSTAZE 3D Logo"
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
                      {/* Counter-rotate Z so cards stay upright while orbiting */}
                      <motion.div
                        className="w-full h-full flex items-center justify-center"
                        animate={{ rotate: -360 }}
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


        {/* CTA below — extra spacing so it doesn't overlap the orbit rings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20 md:mt-28"
        >
          <Link
            to="/subjects"
            className="inline-flex items-center gap-2 px-12 py-4 rounded-full font-bold text-white text-base md:text-lg transition-all hover:scale-105"
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
