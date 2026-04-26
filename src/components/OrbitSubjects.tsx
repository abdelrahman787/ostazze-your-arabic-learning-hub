import { Link } from "react-router-dom";
import {
  Calculator, Atom, FlaskConical, Languages,
  Code
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef, useState } from "react";
import gradCap from "@/assets/hero-3d-cap.webp";

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
  { radius: 200, duration: 52, count: 2, reverse: false, offset: 0 },
  { radius: 360, duration: 64, count: 3, reverse: false, offset: 90 },
];

const OrbitSubjects = () => {
  const { t } = useLanguage();
  const [scale, setScale] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

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

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const tick = (now: number) => {
      const nodes = sectionRef.current?.querySelectorAll<HTMLElement>("[data-orbit-traveler]") ?? [];
      nodes.forEach((node) => {
        const radius = Number(node.dataset.orbitRadius || 0);
        const baseAngle = Number(node.dataset.orbitBaseAngle || 0);
        const duration = Number(node.dataset.orbitDuration || 60);
        const direction = Number(node.dataset.orbitDirection || 1);
        const angle = (baseAngle + (((now / 1000) % duration) / duration) * 360 * direction) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        node.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
      });

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
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
    <section ref={sectionRef} className="relative overflow-hidden py-20 bg-[hsl(265_45%_8%)]">
      {/* Deep radial glow background - purple + orange accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(22 90% 55% / 0.18), transparent 60%), radial-gradient(ellipse 80% 60% at 50% 50%, hsl(265 60% 18% / 0.7), transparent 70%), radial-gradient(ellipse 100% 80% at 50% 100%, hsl(280 70% 25% / 0.4), transparent 70%)",
        }}
      />

      {/* Starfield (static, lighter for performance) */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {Array.from({ length: 24 }).map((_, i) => {
          const top = (i * 37) % 100;
          const left = (i * 53) % 100;
          const size = (i % 3) + 1;
          return (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: 0.25 + (i % 5) * 0.1,
              }}
            />
          );
        })}
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-white">
            {t("popular_title")}
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">{t("popular_subtitle")}</p>
        </div>

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
              const duration = 14 + idx * 6;
              return (
                <div
                  key={`dot-orbit-${idx}`}
                  className="absolute rounded-full orbit-traveler"
                  data-orbit-traveler="true"
                  data-orbit-radius={orbit.radius}
                  data-orbit-base-angle="0"
                  data-orbit-duration={duration}
                  data-orbit-direction="1"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: 8,
                    height: 8,
                    background:
                      "radial-gradient(circle, hsl(22 100% 70%) 0%, hsl(22 95% 55%) 50%, transparent 100%)",
                    boxShadow: "0 0 10px hsl(22 95% 60% / 0.8)",
                  }}
                />
              );
            })}

            {/* Central 3D Logo */}
            <div className="absolute z-20 animate-scale-in">
              <div className="relative">
                {/* Glow halo (lighter blur for perf) */}
                <div
                  className="absolute inset-0 rounded-full orbit-center-glow"
                  style={{
                    background:
                      "radial-gradient(circle, hsl(22 95% 60% / 0.5), transparent 70%)",
                    transform: "scale(1.8)",
                  }}
                />
                <div
                  className="relative w-40 h-40 md:w-52 md:h-52 flex items-center justify-center float-y"
                  style={{ willChange: "transform" }}
                >
                  <img
                    src={gradCap}
                    alt="OSTAZE 3D Logo"
                    className="w-full h-full object-contain drop-shadow-[0_20px_40px_hsl(22_95%_50%/0.6)]"
                  />
                </div>
              </div>
            </div>

            {/* Orbiting subjects — direct per-item rAF positions for stability */}
            {orbitItems.map((orbit, oIdx) => (
              <div key={`orbit-${oIdx}`} className="absolute inset-0">
                {orbit.items.map((subj) => {
                  const Icon = subj.icon;
                  return (
                    <div
                      key={subj.key}
                      className="absolute orbit-traveler"
                      data-orbit-traveler="true"
                      data-orbit-radius={orbit.radius}
                      data-orbit-base-angle={subj.angle}
                      data-orbit-duration={orbit.duration}
                      data-orbit-direction={orbit.reverse ? -1 : 1}
                      style={{
                        top: "50%",
                        left: "50%",
                        width: 88,
                        height: 88,
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Link
                          to="/subjects"
                          className="group flex flex-col items-center gap-2"
                          aria-label={t(subj.key)}
                        >
                          <div
                            className="w-[88px] h-[88px] rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                            style={{
                              background:
                                "linear-gradient(135deg, hsl(265 40% 25% / 0.85), hsl(280 40% 15% / 0.85))",
                              border: "1px solid hsl(22 80% 60% / 0.35)",
                              boxShadow:
                                "0 8px 20px hsl(0 0% 0% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.15)",
                            }}
                          >
                            <Icon
                              className="text-orange-300 group-hover:text-orange-200 transition-colors"
                              size={32}
                            />
                          </div>
                          <span className="text-xs md:text-sm font-semibold text-white/90 group-hover:text-white whitespace-nowrap drop-shadow-md">
                            {t(subj.key)}
                          </span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>


        {/* CTA below — extra spacing so it doesn't overlap the orbit rings */}
        <div className="text-center mt-20 md:mt-28 animate-fade-in">
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
        </div>
      </div>
    </section>
  );
};

export default OrbitSubjects;
