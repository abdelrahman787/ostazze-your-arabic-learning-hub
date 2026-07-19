import { useEffect, useRef, useState } from "react";

/**
 * Mount-once-on-approach hook. Returns [ref, inView].
 * `inView` flips true when the element enters within `rootMargin` of the
 * viewport, and never flips back. Falls back to `true` immediately if
 * IntersectionObserver is unavailable.
 */
export function useInViewOnce<T extends Element>(rootMargin = "600px 0px"): [
  React.MutableRefObject<T | null>,
  boolean,
] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
}
