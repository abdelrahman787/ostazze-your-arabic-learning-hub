import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  BookOpen,
  Search,
  UserCheck,
  CalendarCheck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  Pause,
  MousePointer2,
  Sparkles,
} from "lucide-react";

const STORAGE_KEY = "ostazze_welcome_guide_seen";
const AUTO_ADVANCE_MS = 4500;

const WelcomeGuideModal = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === "ar";
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) return;
    const timer = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const steps = [
    {
      icon: BookOpen,
      title: isAr ? "تصفّح المواد الدراسية" : "Browse Subjects",
      desc: isAr
        ? "ابدأ من صفحة المواد علشان تشوف كل التخصصات المتاحة على المنصة."
        : "Start from the subjects page to explore all available specialties.",
      color: "from-orange-500 to-red-500",
      bg: "bg-orange-500",
    },
    {
      icon: Search,
      title: isAr ? "اختر المادة المناسبة" : "Pick Your Subject",
      desc: isAr
        ? "حدد المادة اللي محتاج فيها مساعدة من بين عشرات الخيارات."
        : "Choose the subject you need help with from dozens of options.",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500",
    },
    {
      icon: UserCheck,
      title: isAr ? "اختر المعلم المفضّل" : "Choose Your Teacher",
      desc: isAr
        ? "تصفّح المعلمين، شوف تقييماتهم، واختار اللي يناسبك."
        : "Browse teachers, check ratings, and pick your favorite.",
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-500",
    },
    {
      icon: CalendarCheck,
      title: isAr ? "احجز جلستك" : "Book Your Session",
      desc: isAr
        ? "حدد التاريخ والوقت المناسب ليك بكل سهولة."
        : "Pick a date and time that works for you.",
      color: "from-green-500 to-emerald-500",
      bg: "bg-emerald-500",
    },
    {
      icon: CreditCard,
      title: isAr ? "ادفع وابدأ التعلّم" : "Pay & Start Learning",
      desc: isAr
        ? "أكمل الدفع بأمان وانضم لجلستك المباشرة فوراً."
        : "Complete the secure payment and join your live session.",
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-500",
    },
  ];

  const total = steps.length;
  const isLast = step === total - 1;

  // Auto-advance progress
  useEffect(() => {
    if (!open || !isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now();
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / AUTO_ADVANCE_MS, 1);
      setProgress(p);
      if (p >= 1) {
        if (isLast) {
          setIsPlaying(false);
        } else {
          setStep((s) => s + 1);
          setProgress(0);
          startRef.current = null;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, isPlaying, step, isLast]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  const handleStart = () => {
    handleClose();
    navigate("/subjects");
  };

  const goNext = () => {
    setProgress(0);
    startRef.current = null;
    if (isLast) {
      handleStart();
    } else {
      setStep((s) => Math.min(s + 1, total - 1));
    }
  };

  const goPrev = () => {
    setProgress(0);
    startRef.current = null;
    setStep((s) => Math.max(s - 1, 0));
  };

  const goTo = (i: number) => {
    setProgress(0);
    startRef.current = null;
    setStep(i);
  };

  if (!open) return null;

  const current = steps[step];
  const Icon = current.icon;
  const NextArrow = isAr ? ArrowLeft : ArrowRight;
  const PrevArrow = isAr ? ArrowRight : ArrowLeft;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        dir={isAr ? "rtl" : "ltr"}
        onClick={handleClose}
      >
        <motion.div
          key="card"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 22, stiffness: 220 }}
          className="relative w-full max-w-3xl bg-card rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            aria-label={isAr ? "إغلاق" : "Close"}
            className="absolute top-4 end-4 z-30 w-9 h-9 rounded-full bg-background/80 hover:bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <X size={18} />
          </button>

          {/* Stage — visual scene */}
          <div className="relative h-[280px] sm:h-[320px] overflow-hidden bg-gradient-to-br from-background via-card to-muted">
            {/* Animated grid backdrop */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Floating sparkles */}
            <motion.div
              className="absolute top-6 start-8 text-primary/40"
              animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={20} />
            </motion.div>
            <motion.div
              className="absolute bottom-10 end-12 text-primary/30"
              animate={{ y: [0, 10, 0], rotate: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={16} />
            </motion.div>

            {/* Step icons row — like a timeline */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-8 sm:px-14">
              {steps.map((s, i) => {
                const StepIcon = s.icon;
                const isActive = i === step;
                const isPassed = i < step;
                return (
                  <motion.button
                    key={i}
                    onClick={() => goTo(i)}
                    initial={false}
                    animate={{
                      scale: isActive ? 1.25 : 1,
                      opacity: isActive ? 1 : isPassed ? 0.85 : 0.35,
                    }}
                    transition={{ type: "spring", damping: 18, stiffness: 260 }}
                    className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${s.color}`}
                    aria-label={s.title}
                  >
                    <StepIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                    {isActive && (
                      <motion.span
                        layoutId="ring"
                        className="absolute inset-0 rounded-2xl ring-4 ring-primary/40"
                        transition={{ type: "spring", damping: 20, stiffness: 220 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Connecting line behind icons */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-14 sm:px-20 pointer-events-none">
              <div className="relative h-[3px] bg-border/60 rounded-full">
                <motion.div
                  className="absolute inset-y-0 start-0 bg-gradient-to-r from-primary to-orange-500 rounded-full"
                  initial={false}
                  animate={{ width: `${(step / (total - 1)) * 100}%` }}
                  transition={{ type: "spring", damping: 22, stiffness: 180 }}
                />
              </div>
            </div>

            {/* Animated arrow pointer that walks between steps */}
            <motion.div
              className="absolute top-[calc(50%+44px)] sm:top-[calc(50%+50px)] text-primary"
              initial={false}
              animate={{
                left: `calc(${(step / (total - 1)) * 100}% * (1 - 96px/100%) + 48px)`,
                y: [0, -6, 0],
              }}
              transition={{
                left: { type: "spring", damping: 20, stiffness: 180 },
                y: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ translateX: "-50%" }}
            >
              <MousePointer2 size={26} className="rotate-180 drop-shadow-lg" fill="currentColor" />
            </motion.div>

            {/* Step number badge */}
            <div className="absolute top-5 start-5">
              <div className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
                {isAr ? `الخطوة ${step + 1} من ${total}` : `Step ${step + 1} of ${total}`}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1 text-start">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mb-1.5">
                      {current.title}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {current.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden mb-5">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-orange-500"
                initial={false}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-muted/70 border border-border flex items-center justify-center text-foreground transition-all"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ms-0.5" />}
                </button>
                <button
                  onClick={goPrev}
                  disabled={step === 0}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-muted/70 border border-border flex items-center justify-center text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label={isAr ? "السابق" : "Previous"}
                >
                  <PrevArrow size={16} />
                </button>
              </div>

              <button
                onClick={goNext}
                className="flex items-center gap-2 px-5 sm:px-7 h-11 rounded-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
              >
                {isLast
                  ? isAr
                    ? "ابدأ التصفح الآن"
                    : "Start Browsing"
                  : isAr
                  ? "التالي"
                  : "Next"}
                <NextArrow size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeGuideModal;
