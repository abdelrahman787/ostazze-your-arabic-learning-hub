import { useLocation } from "react-router-dom";
import { ReactElement, useEffect, useRef, useState } from "react";

interface Props {
  children: ReactElement;
}

/**
 * Lightweight CSS-only page-transition wrapper (no framer-motion in the
 * critical bundle). Fades content in on every pathname change and respects
 * prefers-reduced-motion via CSS.
 *
 * Uses a state-driven "tick" instead of `key={pathname}` so the underlying
 * <Suspense> boundary does NOT remount on every navigation. This preserves
 * already-loaded route chunks and avoids skeleton flashes on back/forward
 * or when revisiting a cached page.
 */
const PageTransition = ({ children }: Props) => {
  const location = useLocation();
  const [tick, setTick] = useState(0);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setTick((t) => t + 1);
  }, [location.pathname]);

  return (
    <div
      // key re-triggers the CSS animation without unmounting descendants
      key={tick}
      className="min-h-screen animate-page-in"
    >
      {children}
    </div>
  );
};

export default PageTransition;
