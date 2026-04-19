import { ReactNode } from "react";
import { motion } from "framer-motion";

/** Categories: open book, folder tabs, grid pattern */
const CategoriesIllustration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Large open book - right */}
    <svg className="absolute -end-6 top-1/2 -translate-y-1/2 w-44 h-44" viewBox="0 0 200 200" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="cat-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="cat-g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path d="M100 45 C80 40, 40 35, 25 52 L25 155 C45 142, 80 144, 100 162 C120 144, 155 142, 175 155 L175 52 C160 35, 120 40, 100 45 Z" fill="url(#cat-g2)" stroke="url(#cat-g1)" strokeWidth="1.5" />
      <path d="M100 45 L100 162" stroke="hsl(var(--primary))" strokeOpacity="0.12" strokeWidth="1" />
      <path d="M45 75 L85 70" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1.2" />
      <path d="M45 92 L80 88" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1.2" />
      <path d="M45 109 L72 106" stroke="hsl(var(--primary))" strokeOpacity="0.06" strokeWidth="1.2" />
      <path d="M115 70 L155 75" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1.2" />
      <path d="M118 88 L152 92" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1.2" />
      <path d="M120 106 L148 109" stroke="hsl(var(--primary))" strokeOpacity="0.06" strokeWidth="1.2" />
    </svg>

    {/* Folder tabs - left */}
    <svg className="absolute start-4 bottom-1 w-32 h-28" viewBox="0 0 120 100" fill="none">
      <defs>
        <linearGradient id="cat-f1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.14" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect x="8" y="40" width="75" height="48" rx="5" fill="url(#cat-f1)" stroke="hsl(var(--primary))" strokeOpacity="0.12" strokeWidth="1.2" />
      <path d="M8 40 L8 34 C8 31, 10 29, 13 29 L35 29 L42 36 L78 36 C81 36, 83 38, 83 40" stroke="hsl(var(--primary))" strokeOpacity="0.12" strokeWidth="1.2" fill="none" />
      <rect x="20" y="30" width="75" height="48" rx="5" fill="url(#cat-f1)" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1" opacity="0.6" />
      <rect x="32" y="20" width="75" height="48" rx="5" fill="url(#cat-f1)" stroke="hsl(var(--primary))" strokeOpacity="0.05" strokeWidth="1" opacity="0.35" />
    </svg>

    {/* Dots pattern - top center-left */}
    <svg className="absolute start-1/4 top-1 w-20 h-20" viewBox="0 0 80 80">
      <defs>
        <radialGradient id="cat-dot">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={(i % 3) * 30 + 15} cy={Math.floor(i / 3) * 30 + 15} r="3.5" fill="url(#cat-dot)" />
      ))}
    </svg>

    {/* Bookmark */}
    <svg className="absolute end-1/4 bottom-3 w-8 h-14" viewBox="0 0 30 50" fill="none">
      <defs>
        <linearGradient id="cat-bk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.16" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d="M5 3 L25 3 L25 45 L15 35 L5 45 Z" fill="url(#cat-bk)" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1.2" />
    </svg>
  </div>
);

/** Subjects: pencil writing, lightbulb, graduation cap */
const SubjectsIllustration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Pencil writing - right */}
    <svg className="absolute -end-4 top-1/2 -translate-y-1/2 w-40 h-40" viewBox="0 0 180 180" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="sub-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="sub-g2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      {/* Pencil body */}
      <path d="M125 25 L155 55 L60 150 L25 158 L33 123 Z" fill="url(#sub-g2)" stroke="hsl(var(--primary))" strokeOpacity="0.15" strokeWidth="1.5" />
      <path d="M118 32 L148 62" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1" />
      <path d="M33 123 L60 150" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1" />
      {/* Writing trail */}
      <path d="M40 148 Q60 140, 80 148 Q100 156, 120 148" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1.5" fill="none" />
    </svg>

    {/* Graduation cap - left */}
    <svg className="absolute start-3 bottom-0 w-36 h-32" viewBox="0 0 140 120" fill="none">
      <defs>
        <linearGradient id="sub-cap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.16" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <polygon points="70,20 135,48 70,76 5,48" fill="url(#sub-cap)" stroke="hsl(var(--primary))" strokeOpacity="0.12" strokeWidth="1.5" />
      <path d="M25 55 L25 88 C25 88, 70 108, 115 88 L115 55" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1.2" fill="none" />
      <line x1="135" y1="48" x2="135" y2="92" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1.2" />
      <circle cx="135" cy="95" r="3.5" fill="hsl(var(--primary))" fillOpacity="0.1" />
    </svg>

    {/* Lightbulb - top */}
    <svg className="absolute start-1/3 top-0 w-14 h-18" viewBox="0 0 55 70" fill="none">
      <defs>
        <radialGradient id="sub-bulb" cx="50%" cy="40%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.14" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
        </radialGradient>
      </defs>
      <path d="M27 8 C14 8, 7 19, 7 28 C7 37, 16 42, 18 48 L36 48 C38 42, 47 37, 47 28 C47 19, 40 8, 27 8 Z" fill="url(#sub-bulb)" stroke="hsl(var(--primary))" strokeOpacity="0.12" strokeWidth="1.2" />
      <line x1="20" y1="52" x2="34" y2="52" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1" />
      <line x1="22" y1="56" x2="32" y2="56" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1" />
      {/* Rays */}
      <line x1="27" y1="1" x2="27" y2="5" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1" />
      <line x1="46" y1="12" x2="50" y2="8" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1" />
      <line x1="8" y1="12" x2="4" y2="8" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1" />
    </svg>
  </div>
);

/** Teachers: chalkboard, person, speech bubble */
const TeachersIllustration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Chalkboard - right */}
    <svg className="absolute -end-6 top-1/2 -translate-y-1/2 w-44 h-40" viewBox="0 0 200 180" fill="none" strokeLinecap="round">
      <defs>
        <linearGradient id="tch-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.16" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect x="25" y="20" width="150" height="100" rx="8" fill="url(#tch-g1)" stroke="hsl(var(--primary))" strokeOpacity="0.14" strokeWidth="1.5" />
      {/* Board content */}
      <path d="M50 50 Q75 35, 100 50 Q125 65, 150 50" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1.2" fill="none" />
      <line x1="50" y1="70" x2="120" y2="70" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1" />
      <line x1="50" y1="82" x2="100" y2="82" stroke="hsl(var(--primary))" strokeOpacity="0.06" strokeWidth="1" />
      {/* Triangle */}
      <path d="M130 65 L150 65 L140 80 Z" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1" fill="hsl(var(--primary))" fillOpacity="0.04" />
      {/* Legs */}
      <line x1="70" y1="120" x2="70" y2="155" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1.5" />
      <line x1="130" y1="120" x2="130" y2="155" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1.5" />
      <line x1="50" y1="155" x2="150" y2="155" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="2" />
    </svg>

    {/* Person - left */}
    <svg className="absolute start-5 bottom-0 w-28 h-32" viewBox="0 0 90 110" fill="none">
      <defs>
        <linearGradient id="tch-p" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.14" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <circle cx="45" cy="22" r="16" fill="url(#tch-p)" stroke="hsl(var(--primary))" strokeOpacity="0.12" strokeWidth="1.3" />
      <path d="M15 105 C15 75, 22 58, 45 52 C68 58, 75 75, 75 105" fill="url(#tch-p)" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1.3" />
    </svg>

    {/* Star */}
    <svg className="absolute start-1/3 top-1 w-10 h-10" viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="tch-star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polygon points="20,2 25,14 38,14 27,22 31,35 20,28 9,35 13,22 2,14 15,14" fill="url(#tch-star)" />
    </svg>

    {/* Chat bubble */}
    <svg className="absolute end-1/4 bottom-2 w-14 h-12" viewBox="0 0 55 45" fill="none">
      <defs>
        <linearGradient id="tch-chat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path d="M5 5 Q5 2, 8 2 L47 2 Q50 2, 50 5 L50 28 Q50 31, 47 31 L22 31 L12 42 L14 31 L8 31 Q5 31, 5 28 Z" fill="url(#tch-chat)" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1.2" />
      <line x1="14" y1="12" x2="40" y2="12" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1" />
      <line x1="14" y1="20" x2="32" y2="20" stroke="hsl(var(--primary))" strokeOpacity="0.06" strokeWidth="1" />
    </svg>
  </div>
);

/** Universities: building with pillars, globe, diploma */
const UniversitiesIllustration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* University building - right */}
    <svg className="absolute -end-6 top-1/2 -translate-y-1/2 w-48 h-44" viewBox="0 0 200 190" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="uni-g1" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {/* Roof triangle */}
      <polygon points="100,18 175,58 25,58" fill="url(#uni-g1)" stroke="hsl(var(--primary))" strokeOpacity="0.14" strokeWidth="1.5" />
      {/* Entablature */}
      <rect x="28" y="58" width="144" height="8" fill="hsl(var(--primary))" fillOpacity="0.06" />
      {/* Pillars */}
      {[50, 80, 120, 150].map(x => (
        <rect key={x} x={x - 4} y="66" width="8" height="80" rx="2" fill="hsl(var(--primary))" fillOpacity="0.08" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="0.8" />
      ))}
      {/* Base */}
      <rect x="22" y="146" width="156" height="6" rx="2" fill="hsl(var(--primary))" fillOpacity="0.08" />
      {/* Steps */}
      <rect x="30" y="152" width="140" height="4" rx="1" fill="hsl(var(--primary))" fillOpacity="0.05" />
      <rect x="38" y="156" width="124" height="4" rx="1" fill="hsl(var(--primary))" fillOpacity="0.03" />
      {/* Door */}
      <path d="M88 146 L88 115 C88 107, 112 107, 112 115 L112 146" fill="hsl(var(--primary))" fillOpacity="0.06" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1" />
      {/* Flag */}
      <line x1="100" y1="18" x2="100" y2="6" stroke="hsl(var(--primary))" strokeOpacity="0.12" strokeWidth="1.2" />
      <path d="M100 6 L116 11 L100 16" fill="hsl(var(--primary))" fillOpacity="0.1" />
    </svg>

    {/* Globe - left */}
    <svg className="absolute start-4 bottom-1 w-32 h-30" viewBox="0 0 110 105" fill="none">
      <defs>
        <radialGradient id="uni-globe" cx="40%" cy="40%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.14" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
        </radialGradient>
      </defs>
      <circle cx="55" cy="48" r="38" fill="url(#uni-globe)" stroke="hsl(var(--primary))" strokeOpacity="0.12" strokeWidth="1.3" />
      <ellipse cx="55" cy="48" rx="16" ry="38" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1" fill="none" />
      <path d="M20 36 Q55 28, 90 36" stroke="hsl(var(--primary))" strokeOpacity="0.07" strokeWidth="1" fill="none" />
      <path d="M20 60 Q55 68, 90 60" stroke="hsl(var(--primary))" strokeOpacity="0.07" strokeWidth="1" fill="none" />
      <line x1="55" y1="10" x2="55" y2="86" stroke="hsl(var(--primary))" strokeOpacity="0.06" strokeWidth="0.8" />
      {/* Stand */}
      <line x1="55" y1="86" x2="55" y2="95" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1.2" />
      <path d="M38 95 L55 100 L72 95" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="1.2" fill="none" />
    </svg>

    {/* Diploma scroll - top */}
    <svg className="absolute start-1/3 top-0 w-14 h-14" viewBox="0 0 50 50" fill="none">
      <defs>
        <linearGradient id="uni-scroll" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.14" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="34" height="34" rx="3" fill="url(#uni-scroll)" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1" />
      <line x1="14" y1="18" x2="36" y2="18" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="0.8" />
      <line x1="14" y1="24" x2="32" y2="24" stroke="hsl(var(--primary))" strokeOpacity="0.06" strokeWidth="0.8" />
      <line x1="14" y1="30" x2="28" y2="30" stroke="hsl(var(--primary))" strokeOpacity="0.05" strokeWidth="0.8" />
      <circle cx="32" cy="34" r="5" fill="hsl(var(--primary))" fillOpacity="0.06" stroke="hsl(var(--primary))" strokeOpacity="0.08" strokeWidth="0.8" />
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
    <section className="relative overflow-hidden pt-32 pb-12 bg-section-alt">
      {/* Card-Y style radial glow background */}
      <div
        className="absolute inset-0 -z-0 dark:opacity-100 opacity-0 transition-opacity"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, hsl(14 91% 50% / 0.20) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      <Illustration />
      <div className="container text-center relative z-10">
        {children}
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-muted-foreground text-base max-w-xl mx-auto">
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
