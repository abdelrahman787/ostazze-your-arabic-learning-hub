import { useEffect, useRef, useState } from "react";
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

// Two orbit configurations: full (desktop, motion OK) and lite
// (mobile or prefers-reduced-motion) — fewer travelers → fewer nodes
// composited per frame on weak devices.
const ORBITS_FULL = [
  { radius: 110, duration: 38, count: 3, offset: 0 },
  { radius: 190, duration: 48, count: 5, offset: 45 },
];
const ORBITS_LITE = [
  { radius: 110, duration: 38, count: 2, offset: 0 },
  { radius: 190, duration: 48, count: 3, offset: 45 },
];

const tx = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `translate(-50%, -50%) translate3d(${Math.cos(a) * r}px, ${Math.sin(a) * r}px, 0)`;
};

const HeroOrbit = () => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [lite, setLite] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const sync = () => setLite(mqMotion.matches || mqMobile.matches);
    sync();
    mqMotion.addEventListener?.("change", sync);
    mqMobile.addEventListener?.("change", sync);
    return () => {
      mqMotion.removeEventListener?.("change", sync);
      mqMobile.removeEventListener?.("change", sync);
    };
  }, []);

  const ORBITS = lite ? ORBITS_LITE : ORBITS_FULL;

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    // Under reduced-motion we don't stop entirely — a slow, uniform rotation
    // is well within the reduced-motion spec (no parallax, no flashing) and
    // keeps the hero from looking broken.
    const speedScale = reduce ? 3 : 1;

    // Cache node metadata once instead of querying + parsing datasets every
    // frame. This removes ~40 DOM reads/frame on mobile.
    const rawNodes = ref.current?.querySelectorAll<HTMLElement>("[data-orbit-traveler]");
    if (!rawNodes || rawNodes.length === 0) return;
    const nodes = Array.from(rawNodes).map((node) => ({
      node,
      r: Number(node.dataset.orbitRadius || 0),
      base: Number(node.dataset.orbitBaseAngle || 0),
      dur: Number(node.dataset.orbitDuration || 60) * speedScale,
    }));

    // Pause when the hero is off-screen (user scrolled past it) — no point
    // burning CPU/GPU animating what nobody sees.
    let visible = true;
    const io = ref.current
      ? new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
          },
          { threshold: 0.01 }
        )
      : null;
    if (io && ref.current) io.observe(ref.current);

    // The orbit is decorative; 30fps is visually sufficient and avoids
    // saturating WebKit's main/compositor threads on iPad, iPhone and Safari.
    const minDelta = 1000 / 30;
    let last = 0;
    let frame = 0;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      if (typeof document !== "undefined" && document.hidden) return;
      if (minDelta && now - last < minDelta) return;
      last = now;
      const t = now / 1000;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const angle = n.base + ((t % n.dur) / n.dur) * 360;
        const a = Math.round(angle * 10) / 10;
        n.node.style.transform = tx(n.r, a);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      io?.disconnect();
    };
  }, [lite]);

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
          width={320}
          height={320}
          decoding="async"
          {...({ fetchpriority: "high" } as any)}
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
                  willChange: "transform",
                  backfaceVisibility: "hidden",
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
