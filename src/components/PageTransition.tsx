import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";
import { ReactElement } from "react";

interface Props {
  children: ReactElement;
}

/**
 * Wraps the app's routes with a smooth fade + slide transition
 * triggered on every pathname change.
 *
 * Respects users who prefer reduced motion via `prefers-reduced-motion`.
 */
const PageTransition = ({ children }: Props) => {
  const location = useLocation();

  const variants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{
          duration: prefersReducedMotion ? 0.15 : 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
