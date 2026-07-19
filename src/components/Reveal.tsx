import { PropsWithChildren, useEffect, useRef, useState } from "react";

interface Props {
  /** Extra classes for the wrapper. */
  className?: string;
  /** Wrapper tag (defaults to div). */
  as?: keyof JSX.IntrinsicElements;
  /** IntersectionObserver rootMargin. */
  rootMargin?: string;
  /** Optional delay in ms before .is-visible flips on. */
  delay?: number;
}

/**
 * P2.5 — Lightweight, CSS-driven scroll-reveal wrapper.
 *
 * - Uses `.reveal` / `.is-visible` classes defined in src/index.css
 *   (opacity + translateY only, respects prefers-reduced-motion).
 * - Adds no library weight; only a per-instance IntersectionObserver.
 * - One-shot: disconnects after first intersection.
 */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  rootMargin = "0px 0px -10% 0px",
  delay = 0,
}: PropsWithChildren<Props>) {
  const ref = useRef<HTMLElement | null>(null);
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

  // @ts-expect-error dynamic tag with ref
  return (
    <Tag ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
