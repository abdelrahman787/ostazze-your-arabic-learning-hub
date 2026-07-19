import { useLocation } from "react-router-dom";
import { ReactElement } from "react";

interface Props {
  children: ReactElement;
}

/**
 * Lightweight CSS-only page-transition wrapper (no framer-motion in the
 * critical bundle). Fades content in on every pathname change and respects
 * prefers-reduced-motion via CSS.
 */
const PageTransition = ({ children }: Props) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="min-h-screen animate-page-in">
      {children}
    </div>
  );
};

export default PageTransition;
