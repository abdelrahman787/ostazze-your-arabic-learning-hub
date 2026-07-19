import { PropsWithChildren, useEffect, useRef, useState } from "react";

interface Props {
  className?: string;
  rootMargin?: string;
  delay?: number;
}

/**
 * P2.5 — Lightweight, CSS-driven scroll-reveal wrapper.
 * Uses `.reveal` / `.is-visible` from index.css (opacity + translateY only).
 * Respects prefers-reduced-motion. One-shot IntersectionObserver.
 */
export default function Reveal({
  children,
  className = "",
  rootMargin = "0px 0px -10% 0px",
  delay = 0,
}: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          if (delay > 0) window.setTimeout(() => setVisible(true), delay);
          else setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin, delay]);

  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}

