import { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Decorative SVG header background with academic-themed geometric shapes.
 * Renders subtle circles, hexagons, dots and lines that fill white space.
 */
const PageHeaderIllustration = ({ variant = "default" }: { variant?: "default" | "books" | "science" | "university" }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Decorative circles */}
      <svg className="absolute -top-10 -end-10 w-64 h-64 text-primary/[0.04]" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      {/* Dots grid */}
      <svg className="absolute bottom-2 start-8 w-32 h-32 text-primary/[0.06]" viewBox="0 0 100 100" fill="currentColor">
        {Array.from({ length: 25 }).map((_, i) => (
          <circle key={i} cx={(i % 5) * 22 + 11} cy={Math.floor(i / 5) * 22 + 11} r="1.5" />
        ))}
      </svg>

      {/* Hexagon */}
      <svg className="absolute top-4 start-1/4 w-20 h-20 text-primary/[0.04]" viewBox="0 0 100 100" fill="none">
        <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Small diamond */}
      <svg className="absolute bottom-6 end-1/4 w-12 h-12 text-primary/[0.05]" viewBox="0 0 50 50" fill="none">
        <rect x="10" y="10" width="30" height="30" rx="2" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 25 25)" />
      </svg>

      {/* Wavy line */}
      <svg className="absolute top-1/2 -translate-y-1/2 end-16 w-24 h-16 text-primary/[0.05]" viewBox="0 0 100 40" fill="none">
        <path d="M0 20 Q25 0 50 20 Q75 40 100 20" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Triangle */}
      <svg className="absolute top-6 end-1/3 w-10 h-10 text-primary/[0.04]" viewBox="0 0 50 50" fill="none">
        <polygon points="25,5 45,45 5,45" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Plus signs */}
      <svg className="absolute bottom-8 start-1/3 w-8 h-8 text-primary/[0.06]" viewBox="0 0 30 30" fill="none">
        <line x1="15" y1="5" x2="15" y2="25" stroke="currentColor" strokeWidth="1.5" />
        <line x1="5" y1="15" x2="25" y2="15" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Circle outlines scattered */}
      <svg className="absolute top-10 start-12 w-6 h-6 text-primary/[0.06]" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-4 end-12 w-4 h-4 text-primary/[0.07]" viewBox="0 0 20 20" fill="currentColor">
        <circle cx="10" cy="10" r="4" />
      </svg>
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  variant?: "default" | "books" | "science" | "university";
}

const PageHeader = ({ title, subtitle, children, variant = "default" }: PageHeaderProps) => {
  return (
    <section className="py-16 bg-section-alt relative overflow-hidden">
      <PageHeaderIllustration variant={variant} />
      <div className="container text-center relative z-10">
        {children}
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold mb-3">
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground">
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
