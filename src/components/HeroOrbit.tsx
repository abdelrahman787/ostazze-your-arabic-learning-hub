import { useEffect, useRef } from "react";
import { Calculator, Atom, FlaskConical, Languages, Code, Zap, PenTool, HeartPulse } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import gradCap from "@/assets/hero-3d-cap.webp";

const SUBJECTS = [
  { key: "subj_math", icon: Calculator },
  { key: "subj_physics", icon: Atom },
  { key: "subj_chemistry", icon: FlaskConical },
  { key: "subj_english", icon: Languages },
  { key: "subj_programming", icon: Code },
  { key: "subj_dynamics", icon: Zap },
  { key: "subj_drawing", icon: PenTool },
  { key: "subj_anatomy", icon: HeartPulse },
];

const ORBITS = [
  { radius: 110, duration: 52, count: 3, offset: 0 },
  { radius: 190, duration: 64, count: 5, offset: 45 },
];

const tx = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `translate(-50%, -50%) translate3d(${Math.cos(a) * r}px, ${Math.sin(a) * r}px, 0)`;
};

const HeroOrbit = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const tick = (now: number) => {
      const nodes = ref.current?.querySelectorAll<HTMLElement>("[data-orbit-traveler]") ?? [];
      nodes.forEach((node) => {
        const r = Number(node.dataset.orbitRadius || 0);
        const base = Number(node.dataset.orbitBaseAngle || 0);
        const dur = Number(node.dataset.orbitDuration || 60);
        const angle = base + (((now / 1000) % dur) / dur) * 360;
        node.style.transform = tx(r, angle);
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  let idx = 0;
  const items = ORBITS.map((o) => {
    const arr = [];
    for (let i = 0; i < o.count; i++) {
      const subj = SUBJECTS[idx++];
      arr.push({ ...subj, angle: (360 / o.count) * i + o.offset });
    }
    return { ...o, items: arr };
  });

  return (
    <div ref={ref} className="relative w-full h-full flex items-center justify-center scale-[0.72] md:scale-100">
      {/* Orbit rings */}
      {ORBITS.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-dashed"
          style={{
            width: o.radius * 2,
            height: o.radius * 2,
            borderColor: `hsl(14 91% 50% / ${0.3 - i * 0.08})`,
          }}
        />
      ))}

      {/* Center cap */}
      <div className="absolute z-20 w-28 h-28 md:w-36 md:h-36 flex items-center justify-center float-y">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(14 91% 50% / 0.45), transparent 70%)", transform: "scale(1.8)" }}
        />
        <img
          src={gradCap}
          alt="OSTAZE"
          className="relative w-full h-full object-contain drop-shadow-[0_12px_24px_hsl(14_91%_45%/0.55)]"
        />
      </div>

      {/* Orbiting icons */}
      {items.map((orbit, oi) => (
        <div key={oi} className="absolute inset-0">
          {orbit.items.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className="absolute"
                data-orbit-traveler="true"
                data-orbit-radius={orbit.radius}
                data-orbit-base-angle={s.angle}
                data-orbit-duration={orbit.duration}
                style={{
                  top: "50%",
                  left: "50%",
                  width: 56,
                  height: 56,
                  zIndex: 30,
                  transform: tx(orbit.radius, s.angle),
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-[56px] h-[56px] rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--card) / 0.95), hsl(var(--card) / 0.75))",
                      border: "1px solid hsl(14 91% 50% / 0.35)",
                      boxShadow: "0 6px 14px hsl(0 0% 0% / 0.12), inset 0 1px 0 hsl(0 0% 100% / 0.4)",
                    }}
                  >
                    <Icon className="text-primary" size={22} />
                  </div>
                  <span className="text-[10px] md:text-[11px] font-semibold text-foreground/80 whitespace-nowrap">
                    {t(s.key)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default HeroOrbit;
