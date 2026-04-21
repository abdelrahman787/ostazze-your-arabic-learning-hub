import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  ChevronDown,
  CreditCard,
  MousePointer2,
  Pause,
  Play,
  Search,
  UserCheck,
  X,
} from "lucide-react";

const STORAGE_KEY = "ostazze_welcome_guide_seen";
const STEP_DURATION = 4200;
const PROGRESS_INTERVAL = 80;

const WelcomeGuideModal = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === "ar";

  const steps = useMemo(
    () => [
      {
        icon: BookOpen,
        title: isAr ? "ادخل صفحة المواد" : "Open Subjects",
        desc: isAr
          ? "ابدأ من المواد الدراسية علشان تشوف كل التخصصات المتاحة."
          : "Start from the subjects page to explore all available specialties.",
        color: "from-primary to-orange-500",
        x: 10,
        y: 58,
      },
      {
        icon: Search,
        title: isAr ? "اختار المادة" : "Choose Subject",
        desc: isAr
          ? "حدد المادة اللي محتاج فيها شرح أو متابعة."
          : "Pick the subject you need help with.",
        color: "from-sky-500 to-cyan-500",
        x: 30,
        y: 30,
      },
      {
        icon: UserCheck,
        title: isAr ? "اختار المعلم" : "Choose Teacher",
        desc: isAr
          ? "شوف المعلمين المتاحين واختار الأنسب ليك."
          : "Browse teachers and pick the best match for you.",
        color: "from-violet-500 to-fuchsia-500",
        x: 52,
        y: 62,
      },
      {
        icon: CalendarCheck,
        title: isAr ? "احجز الموعد" : "Book Session",
        desc: isAr
          ? "حدد اليوم والساعة المناسبة بخطوة سهلة."
          : "Choose the date and time that works for you.",
        color: "from-emerald-500 to-green-500",
        x: 74,
        y: 34,
      },
      {
        icon: CreditCard,
        title: isAr ? "ادفع وابدأ" : "Pay & Start",
        desc: isAr
          ? "أكمل الدفع بأمان وابدأ رحلتك التعليمية فورًا."
          : "Complete the secure payment and start learning instantly.",
        color: "from-amber-500 to-orange-600",
        x: 90,
        y: 58,
      },
    ],
    [isAr],
  );

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  const NextIcon = isAr ? ArrowLeft : ArrowRight;
  const PrevIcon = isAr ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) return;

    const timer = window.setTimeout(() => setOpen(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open || minimized || !isPlaying) return;

    const increment = PROGRESS_INTERVAL / STEP_DURATION;
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 1) {
          setStep((current) => {
            if (current >= steps.length - 1) {
              setIsPlaying(false);
              return current;
            }
            return current + 1;
          });
          return 0;
        }
        return next;
      });
    }, PROGRESS_INTERVAL);

    return () => window.clearInterval(timer);
  }, [open, minimized, isPlaying, steps.length]);

  const closeGuide = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  const goNext = () => {
    setProgress(0);
    if (isLastStep) {
      closeGuide();
      navigate("/subjects");
      return;
    }
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goPrev = () => {
    setProgress(0);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const jumpToStep = (index: number) => {
    setProgress(0);
    setStep(index);
  };

  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex justify-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={minimized ? "guide-minimized" : "guide-expanded"}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="pointer-events-auto w-full max-w-2xl"
          dir={isAr ? "rtl" : "ltr"}
        >
          <div className="overflow-hidden rounded-[28px] border border-primary/20 bg-card/95 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-5">
              <div className="min-w-0 text-start">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">
                  {isAr ? "دليل تفاعلي" : "Interactive Guide"}
                </div>
                <div className="text-sm font-semibold text-foreground sm:text-base">
                  {isAr ? "شوف المنصة شغالة إزاي" : "See how the platform works"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying((prev) => !prev)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-foreground transition-colors hover:bg-muted/70"
                  aria-label={isPlaying ? (isAr ? "إيقاف" : "Pause") : (isAr ? "تشغيل" : "Play")}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ms-0.5" />}
                </button>
                <button
                  onClick={() => setMinimized((prev) => !prev)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-foreground transition-colors hover:bg-muted/70"
                  aria-label={minimized ? (isAr ? "تكبير" : "Expand") : (isAr ? "تصغير" : "Minimize")}
                >
                  <ChevronDown size={16} className={minimized ? "rotate-180" : ""} />
                </button>
                <button
                  onClick={closeGuide}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                  aria-label={isAr ? "إغلاق" : "Close"}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!minimized && (
              <div className="grid gap-5 p-4 sm:grid-cols-[1.1fr_0.9fr] sm:p-5">
                <div className="rounded-[24px] border border-border bg-[radial-gradient(circle_at_center,hsl(14_90%_50%_/_0.16),transparent_45%),linear-gradient(135deg,hsl(262_52%_10%),hsl(272_42%_14%))] p-4">
                  <div className="mb-3 text-start text-xs font-semibold text-white/70">
                    {isAr ? "عرض توضيحي متحرك" : "Animated walkthrough"}
                  </div>

                  <div className="relative h-[220px] overflow-hidden rounded-[20px] border border-white/10 bg-black/10">
                    <div className="absolute left-[10%] right-[10%] top-1/2 h-px -translate-y-1/2 border-t border-dashed border-white/20" />

                    {steps.map((item, index) => {
                      const StepIcon = item.icon;
                      const active = index === step;
                      const done = index < step;

                      return (
                        <button
                          key={item.title}
                          onClick={() => jumpToStep(index)}
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        >
                          <motion.div
                            animate={{
                              scale: active ? 1.08 : 1,
                              opacity: active ? 1 : done ? 0.9 : 0.72,
                            }}
                            transition={{ duration: 0.25 }}
                            className={`relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br ${item.color} shadow-[0_0_30px_hsl(14_90%_50%_/_0.18)]`}
                          >
                            <StepIcon className="h-6 w-6 text-white" strokeWidth={2.4} />
                            {active && (
                              <motion.span
                                className="absolute inset-[-8px] rounded-full border border-primary/50"
                                animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              />
                            )}
                          </motion.div>
                          <div className="mt-2 whitespace-nowrap text-center text-[11px] font-semibold text-white/85 sm:text-xs">
                            {item.title}
                          </div>
                        </button>
                      );
                    })}

                    <motion.div
                      className="absolute z-20"
                      animate={{ left: `${currentStep.x}%`, top: `${currentStep.y}%` }}
                      transition={{ type: "spring", stiffness: 130, damping: 18 }}
                      style={{ transform: "translate(-14%, -20%)" }}
                    >
                      <motion.div
                        animate={{ y: [0, -4, 0], scale: [1, 0.96, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                      >
                        <MousePointer2 size={26} className="text-white drop-shadow-[0_0_18px_hsl(14_90%_50%_/_0.45)]" fill="currentColor" />
                        <motion.span
                          className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/50"
                          animate={{ scale: [0.7, 1.6], opacity: [0.8, 0] }}
                          transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4 text-start">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {isAr ? `الخطوة ${step + 1} من ${steps.length}` : `Step ${step + 1} of ${steps.length}`}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep.title}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22 }}
                      >
                        <h3 className="mb-2 text-xl font-extrabold text-foreground">
                          {currentStep.title}
                        </h3>
                        <p className="text-sm leading-7 text-muted-foreground sm:text-[15px]">
                          {currentStep.desc}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div>
                    <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-orange-500"
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ duration: PROGRESS_INTERVAL / 1000, ease: "linear" }}
                      />
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                      {steps.map((item, index) => (
                        <button
                          key={item.title}
                          onClick={() => jumpToStep(index)}
                          className={`h-2.5 rounded-full transition-all ${index === step ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/40"}`}
                          aria-label={item.title}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={goPrev}
                          disabled={step === 0}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-foreground transition-colors hover:bg-muted/70 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={isAr ? "السابق" : "Previous"}
                        >
                          <PrevIcon size={16} />
                        </button>
                        <button
                          onClick={goNext}
                          className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-primary to-orange-500 px-5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                        >
                          {isLastStep
                            ? isAr
                              ? "ابدأ التصفح"
                              : "Start Browsing"
                            : isAr
                              ? "التالي"
                              : "Next"}
                          <NextIcon size={16} />
                        </button>
                      </div>

                      <button
                        onClick={closeGuide}
                        className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {isAr ? "تخطي" : "Skip"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WelcomeGuideModal;
