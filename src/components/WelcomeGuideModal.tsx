import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Search, UserCheck, CalendarCheck, CreditCard, ArrowRight } from "lucide-react";

const STORAGE_KEY = "ostazze_welcome_guide_seen";

const WelcomeGuideModal = () => {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === "ar";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = (openState: boolean) => {
    setOpen(openState);
    if (!openState) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
  };

  const handleStart = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
    navigate("/subjects");
  };

  const steps = [
    {
      icon: BookOpen,
      title: isAr ? "تصفّح المواد" : "Browse Subjects",
      desc: isAr ? "ادخل على صفحة المواد الدراسية" : "Open the subjects page",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Search,
      title: isAr ? "اختر المادة" : "Choose a Subject",
      desc: isAr ? "حدد المادة اللي محتاج مساعدة فيها" : "Pick the subject you need help with",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: UserCheck,
      title: isAr ? "اختر المعلم" : "Choose a Teacher",
      desc: isAr ? "تصفّح المعلمين المتاحين واختر الأنسب" : "Browse available teachers and pick one",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: CalendarCheck,
      title: isAr ? "احجز جلستك" : "Book Your Session",
      desc: isAr ? "حدد التاريخ والوقت المناسب ليك" : "Select the date and time that suits you",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: CreditCard,
      title: isAr ? "ادفع وابدأ" : "Pay & Start",
      desc: isAr ? "أكمل الدفع بأمان وابدأ جلستك" : "Complete the secure payment and start",
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden border-2 border-primary/20 animate-scale-in"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary via-orange-500 to-amber-500 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🎓</span>
              <DialogTitle className="text-2xl md:text-3xl font-extrabold text-white text-start">
                {isAr ? "أهلاً بيك في OSTAZZE!" : "Welcome to OSTAZZE!"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/90 text-base text-start">
              {isAr
                ? "خمس خطوات بسيطة عشان تبدأ رحلتك التعليمية معانا"
                : "Five simple steps to start your learning journey with us"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Steps */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "backwards" }}
                >
                  {/* Number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                    {idx + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 text-start">
                    <h3 className="font-bold text-foreground text-base">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleStart}
              className="flex-1 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-white font-bold h-12 text-base shadow-lg hover:shadow-xl transition-all"
            >
              {isAr ? "ابدأ التصفح الآن" : "Start Browsing Now"}
              <ArrowRight className={`w-5 h-5 ${isAr ? "rotate-180 mr-2" : "ml-2"}`} />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              className="sm:flex-initial h-12 font-semibold"
            >
              {isAr ? "تخطي" : "Skip"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeGuideModal;
