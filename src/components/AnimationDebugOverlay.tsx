import { useEffect, useRef, useState } from "react";

/**
 * Developer-only overlay that surfaces live animation / runtime stats so we can
 * confirm whether the orbit animation actually stalls (and why).
 *
 * Toggle with the floating "🐞 Anim" button (bottom-right) on the homepage,
 * or add `?debugAnim=1` to the URL to auto-open.
 *
 * Tracked signals:
 *  - FPS (rAF rolling average) + min FPS in the last 2s
 *  - Long frames (> 50ms) counter
 *  - document.visibilityState (tab background = browser may pause rAF/CSS)
 *  - prefers-reduced-motion (kills all our infinite animations)
 *  - Live orbit nodes count (proves the rAF-driven orbit layer exists)
 *  - Live computed `transform` of the first orbit node (proves it's advancing)
 *  - DOM node count under the orbit section
 *  - Number of running framer-motion elements (heuristic: data-projection-id)
 */
const AnimationDebugOverlay = () => {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({
    fps: 0,
    minFps: 0,
    longFrames: 0,
    visibility: "visible" as DocumentVisibilityState,
    reducedMotion: false,
    orbitAnims: 0,
    orbitTransform: "—",
    orbitNodes: 0,
    motionEls: 0,
    sinceMount: 0,
  });

  // Auto-open via ?debugAnim=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("debugAnim") === "1") setOpen(true);
  }, []);

  // Persist toggle across reloads
  useEffect(() => {
    const saved = localStorage.getItem("anim-debug-open");
    if (saved === "1") setOpen(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("anim-debug-open", open ? "1" : "0");
  }, [open]);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const framesRef = useRef<number[]>([]); // last N frame durations in ms
  const longFramesRef = useRef(0);
  const mountedAtRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!open) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const tick = (ts: number) => {
      if (lastTsRef.current) {
        const delta = ts - lastTsRef.current;
        framesRef.current.push(delta);
        if (framesRef.current.length > 120) framesRef.current.shift();
        if (delta > 50) longFramesRef.current += 1;
      }
      lastTsRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const interval = window.setInterval(() => {
      const frames = framesRef.current;
      const avg = frames.length
        ? frames.reduce((a, b) => a + b, 0) / frames.length
        : 0;
      const maxDelta = frames.length ? Math.max(...frames) : 0;
      const fps = avg ? Math.round(1000 / avg) : 0;
      const minFps = maxDelta ? Math.round(1000 / maxDelta) : 0;

      // Probe the orbit DOM
      const orbitRoot = document.querySelector<HTMLElement>(
        ".orbit-raf, .orbit-spin, .orbit-spin-reverse"
      );
      let orbitAnims = 0;
      let orbitTransform = "—";
      let orbitNodes = 0;
      if (orbitRoot) {
        try {
          // @ts-ignore - getAnimations is widely supported
          orbitAnims = (orbitRoot.getAnimations?.() ?? []).length;
        } catch {
          orbitAnims = -1;
        }
        const cs = getComputedStyle(orbitRoot);
        orbitTransform = cs.transform === "none" ? "none" : cs.transform.slice(0, 48);
        const section = orbitRoot.closest("section");
        orbitNodes = section ? section.querySelectorAll("*").length : 0;
      }

      const motionEls = document.querySelectorAll("[data-projection-id]").length;

      setStats({
        fps,
        minFps,
        longFrames: longFramesRef.current,
        visibility: document.visibilityState,
        reducedMotion: mq.matches,
        orbitAnims,
        orbitTransform,
        orbitNodes,
        motionEls,
        sinceMount: Math.round((performance.now() - mountedAtRef.current) / 1000),
      });
    }, 500);

    const onVis = () => {
      setStats((s) => ({ ...s, visibility: document.visibilityState }));
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] rounded-full bg-black/80 text-white text-xs px-3 py-2 shadow-lg backdrop-blur border border-white/20 hover:bg-black"
        aria-label="Open animation debug overlay"
      >
        🐞 Anim
      </button>
    );
  }

  const fpsColor =
    stats.fps >= 50 ? "text-emerald-300" : stats.fps >= 30 ? "text-amber-300" : "text-red-300";
  const visColor =
    stats.visibility === "visible" ? "text-emerald-300" : "text-red-300";

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[320px] max-w-[92vw] rounded-xl bg-black/85 text-white text-xs font-mono shadow-2xl backdrop-blur border border-white/15">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="font-semibold tracking-wide">🐞 Animation Debug</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              longFramesRef.current = 0;
              framesRef.current = [];
              mountedAtRef.current = performance.now();
            }}
            className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20"
          >
            reset
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20"
            aria-label="Close debug overlay"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="px-3 py-2 space-y-1.5">
        <Row label="FPS (avg / min)">
          <span className={fpsColor}>
            {stats.fps} / {stats.minFps}
          </span>
        </Row>
        <Row label="Long frames (&gt;50ms)">
          <span className={stats.longFrames ? "text-amber-300" : "text-emerald-300"}>
            {stats.longFrames}
          </span>
        </Row>
        <Row label="Tab visibility">
          <span className={visColor}>{stats.visibility}</span>
        </Row>
        <Row label="Reduced motion">
          <span className={stats.reducedMotion ? "text-red-300" : "text-emerald-300"}>
            {stats.reducedMotion ? "ON (anims disabled)" : "off"}
          </span>
        </Row>
        <div className="my-1 h-px bg-white/10" />
        <Row label="Orbit CSS anims">
          <span className={stats.orbitAnims > 0 ? "text-emerald-300" : "text-red-300"}>
            {stats.orbitAnims}
          </span>
        </Row>
        <Row label="Orbit transform">
          <span className="text-white/70 truncate max-w-[180px]" title={stats.orbitTransform}>
            {stats.orbitTransform}
          </span>
        </Row>
        <Row label="Orbit DOM nodes">
          <span className="text-white/80">{stats.orbitNodes}</span>
        </Row>
        <Row label="Framer-motion els">
          <span className="text-white/80">{stats.motionEls}</span>
        </Row>
        <Row label="Uptime">
          <span className="text-white/60">{stats.sinceMount}s</span>
        </Row>
        <p className="text-[10px] text-white/50 leading-snug pt-1">
          Tip: if "Orbit transform" stops changing while FPS &amp; visibility are healthy, the
          stall is in the CSS layer (e.g. animation paused or element off-screen).
        </p>
      </div>
    </div>
  );
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-white/60">{label}</span>
    {children}
  </div>
);

export default AnimationDebugOverlay;
