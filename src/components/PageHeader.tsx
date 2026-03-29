import { ReactNode } from "react";
import { motion } from "framer-motion";

/** Categories: books, folders, grid */
const CategoriesIllustration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Large open book - right side */}
    <svg className="absolute -end-4 top-1/2 -translate-y-1/2 w-52 h-52 text-primary/[0.12]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M100 40 L100 170" />
      <path d="M100 40 C80 35, 40 30, 20 50 L20 160 C40 145, 80 148, 100 170" />
      <path d="M100 40 C120 35, 160 30, 180 50 L180 160 C160 145, 120 148, 100 170" />
      <path d="M40 70 L80 65" />
      <path d="M40 90 L80 85" />
      <path d="M40 110 L75 107" />
      <path d="M120 65 L160 70" />
      <path d="M120 85 L160 90" />
      <path d="M120 107 L155 110" />
    </svg>

    {/* Folder stack - left side */}
    <svg className="absolute start-6 bottom-4 w-36 h-36 text-primary/[0.10]" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="10" y="45" width="80" height="55" rx="4" />
      <path d="M10 45 L10 38 C10 35, 12 33, 15 33 L38 33 L45 40 L85 40 C88 40, 90 42, 90 45" />
      <rect x="20" y="35" width="80" height="55" rx="4" opacity="0.5" />
      <path d="M20 35 L20 28 C20 25, 22 23, 25 23 L48 23 L55 30 L95 30 C98 30, 100 32, 100 35" opacity="0.5" />
    </svg>

    {/* Grid dots */}
    <svg className="absolute start-1/4 top-3 w-28 h-28 text-primary/[0.08]" viewBox="0 0 100 100" fill="currentColor">
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={i} cx={(i % 4) * 28 + 14} cy={Math.floor(i / 4) * 28 + 14} r="3" />
      ))}
    </svg>

    {/* Small bookmark */}
    <svg className="absolute end-1/4 bottom-6 w-10 h-16 text-primary/[0.10]" viewBox="0 0 30 50" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 3 L25 3 L25 47 L15 37 L5 47 Z" />
    </svg>
  </div>
);

/** Subjects: flask, atom, pencil */
const SubjectsIllustration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Pencil - right side */}
    <svg className="absolute -end-2 top-1/2 -translate-y-1/2 w-44 h-44 text-primary/[0.12]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M140 30 L170 60 L70 160 L30 170 L40 130 Z" />
      <path d="M130 40 L160 70" />
      <path d="M40 130 L70 160" />
      <circle cx="35" cy="165" r="5" fill="currentColor" opacity="0.3" />
    </svg>

    {/* Graduation cap - left */}
    <svg className="absolute start-4 bottom-2 w-40 h-40 text-primary/[0.10]" viewBox="0 0 150 150" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="75,30 140,60 75,90 10,60" />
      <path d="M30 68 L30 105 C30 105, 75 125, 120 105 L120 68" />
      <line x1="140" y1="60" x2="140" y2="110" />
      <circle cx="140" cy="114" r="4" fill="currentColor" opacity="0.3" />
    </svg>

    {/* Lightbulb */}
    <svg className="absolute start-1/3 top-2 w-16 h-20 text-primary/[0.09]" viewBox="0 0 60 80" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M30 10 C15 10, 8 22, 8 32 C8 42, 18 48, 20 55 L40 55 C42 48, 52 42, 52 32 C52 22, 45 10, 30 10 Z" />
      <line x1="22" y1="60" x2="38" y2="60" />
      <line x1="24" y1="65" x2="36" y2="65" />
      <path d="M28 70 L32 70" />
      <line x1="30" y1="2" x2="30" y2="7" />
      <line x1="50" y1="15" x2="55" y2="10" />
      <line x1="10" y1="15" x2="5" y2="10" />
    </svg>

    {/* ABC letters */}
    <svg className="absolute end-1/4 bottom-5 w-24 h-12 text-primary/[0.08]" viewBox="0 0 100 40" fill="currentColor" style={{ fontFamily: "serif" }}>
      <text x="5" y="30" fontSize="28" fontWeight="bold">A</text>
      <text x="35" y="30" fontSize="28" fontWeight="bold" opacity="0.7">B</text>
      <text x="65" y="30" fontSize="28" fontWeight="bold" opacity="0.5">C</text>
    </svg>
  </div>
);

/** Teachers: person, chalkboard, star */
const TeachersIllustration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Chalkboard - right */}
    <svg className="absolute -end-4 top-1/2 -translate-y-1/2 w-48 h-48 text-primary/[0.12]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="30" y="30" width="140" height="100" rx="6" />
      <line x1="70" y1="140" x2="70" y2="170" />
      <line x1="130" y1="140" x2="130" y2="170" />
      <line x1="50" y1="170" x2="150" y2="170" />
      {/* Writing on board */}
      <path d="M50 60 Q70 45, 90 60" strokeWidth="1.5" />
      <path d="M50 80 L110 80" strokeWidth="1.5" />
      <path d="M50 95 L90 95" strokeWidth="1.5" />
      <path d="M120 55 L145 55 L132 75 Z" strokeWidth="1.5" />
    </svg>

    {/* Person silhouette - left */}
    <svg className="absolute start-6 bottom-2 w-32 h-40 text-primary/[0.10]" viewBox="0 0 100 130" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="50" cy="25" r="18" />
      <path d="M20 130 C20 85, 25 65, 50 60 C75 65, 80 85, 80 130" />
      <line x1="20" y1="90" x2="0" y2="75" strokeWidth="1.5" />
      <line x1="80" y1="90" x2="100" y2="75" strokeWidth="1.5" />
    </svg>

    {/* Star */}
    <svg className="absolute start-1/3 top-3 w-14 h-14 text-primary/[0.10]" viewBox="0 0 50 50" fill="currentColor" opacity="0.4">
      <polygon points="25,2 31,18 48,18 34,29 39,46 25,36 11,46 16,29 2,18 19,18" />
    </svg>

    {/* Chat bubble */}
    <svg className="absolute end-1/4 bottom-4 w-16 h-14 text-primary/[0.09]" viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 5 L55 5 C55 5, 55 5, 55 5 L55 32 L40 32 L30 45 L28 32 L5 32 Z" rx="6" />
      <line x1="15" y1="15" x2="45" y2="15" strokeWidth="1.5" />
      <line x1="15" y1="23" x2="35" y2="23" strokeWidth="1.5" />
    </svg>
  </div>
);

/** Universities: building, globe, cap */
const UniversitiesIllustration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* University building - right */}
    <svg className="absolute -end-4 top-1/2 -translate-y-1/2 w-52 h-52 text-primary/[0.12]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Roof */}
      <polygon points="100,25 170,65 30,65" />
      {/* Pillars */}
      <line x1="55" y1="70" x2="55" y2="150" />
      <line x1="80" y1="70" x2="80" y2="150" />
      <line x1="120" y1="70" x2="120" y2="150" />
      <line x1="145" y1="70" x2="145" y2="150" />
      {/* Base */}
      <line x1="30" y1="150" x2="170" y2="150" strokeWidth="3" />
      <line x1="35" y1="65" x2="165" y2="65" strokeWidth="2.5" />
      {/* Door */}
      <path d="M90 150 L90 115 C90 108, 110 108, 110 115 L110 150" />
      {/* Flag */}
      <line x1="100" y1="25" x2="100" y2="10" />
      <path d="M100 10 L115 15 L100 20" fill="currentColor" opacity="0.3" />
    </svg>

    {/* Globe - left */}
    <svg className="absolute start-6 bottom-4 w-36 h-36 text-primary/[0.10]" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="60" cy="60" r="45" />
      <ellipse cx="60" cy="60" rx="20" ry="45" />
      <path d="M18 45 Q60 35, 102 45" />
      <path d="M18 75 Q60 85, 102 75" />
      <line x1="60" y1="15" x2="60" y2="105" strokeWidth="1" />
      {/* Stand */}
      <path d="M35 108 L60 115 L85 108" strokeWidth="1.5" />
      <line x1="60" y1="105" x2="60" y2="115" />
    </svg>

    {/* Scroll/diploma */}
    <svg className="absolute start-1/3 top-3 w-16 h-18 text-primary/[0.09]" viewBox="0 0 60 70" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 10 C5 10, 5 20, 10 20 L50 20 C55 20, 55 10, 50 10 Z" />
      <path d="M10 20 L10 55 C10 60, 15 60, 15 55 L15 20" />
      <path d="M50 10 L50 45 C50 50, 45 50, 45 45 L45 20" />
      <line x1="20" y1="30" x2="42" y2="30" strokeWidth="1" />
      <line x1="22" y1="37" x2="40" y2="37" strokeWidth="1" />
    </svg>
  </div>
);

const illustrationMap = {
  categories: CategoriesIllustration,
  subjects: SubjectsIllustration,
  teachers: TeachersIllustration,
  university: UniversitiesIllustration,
  default: CategoriesIllustration,
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  variant?: keyof typeof illustrationMap;
}

const PageHeader = ({ title, subtitle, children, variant = "default" }: PageHeaderProps) => {
  const Illustration = illustrationMap[variant] || illustrationMap.default;

  return (
    <section className="py-16 bg-section-alt relative overflow-hidden">
      <Illustration />
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
