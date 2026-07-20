import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import {
  Users,
  Zap,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Search,
  Video,
  Presentation,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const WHATSAPP_NUMBER = "201130382206";

const JoinAsTutor = () => {
  const { lang } = useLanguage();
  const ar = lang === "ar";

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    ar ? "مرحباً، أرغب بالانضمام كمعلم في OSTAZZE" : "Hello, I'd like to join OSTAZZE as a tutor"
  )}`;

  const benefits = [
    {
      icon: Users,
      title: ar ? "الوصول لشريحة واسعة من الطلاب" : "Reach a Wide Student Base",
      desc: ar
        ? "تواصل مع آلاف الطلاب من جامعات الخليج ومصر."
        : "Connect with thousands of students across the Gulf and Egypt.",
    },
    {
      icon: Zap,
      title: ar ? "سلاسة وسهولة الحجز" : "Seamless Booking",
      desc: ar
        ? "منصة متكاملة لإدارة جدولك وحصصك بلا تعقيد."
        : "One platform to manage your schedule and sessions effortlessly.",
    },
    {
      icon: ShieldCheck,
      title: ar ? "ضمان حقوق المعلم" : "Tutor Rights Protected",
      desc: ar
        ? "دفعات مضمونة وشروط واضحة تحفظ حقك."
        : "Guaranteed payments and clear terms that protect you.",
    },
    {
      icon: TrendingUp,
      title: ar ? "فرص تعليمية طويلة المدى" : "Long-Term Opportunities",
      desc: ar
        ? "ابنِ سمعتك واستقطب طلابًا يتابعون معك عبر الفصول."
        : "Build a reputation and retain students semester after semester.",
    },
    {
      icon: DollarSign,
      title: ar ? "دخل جانبي مُربح" : "Rewarding Side Income",
      desc: ar
        ? "أسعار عادلة تعكس خبرتك وجودة تدريسك."
        : "Fair rates that reflect your expertise and teaching quality.",
    },
    {
      icon: GraduationCap,
      title: ar ? "دعم وتطوير مستمر" : "Ongoing Support & Growth",
      desc: ar
        ? "ورش وأدوات تساعدك على التطور كمعلم محترف."
        : "Workshops and tools to level up as a professional educator.",
    },
  ];

  const requirements = [
    {
      icon: CheckCircle2,
      text: ar ? "خبرة سابقة في التدريس الخصوصي" : "Prior tutoring experience",
    },
    {
      icon: BookOpen,
      text: ar ? "معرفة عميقة وشغف بالمواد التي تُدرّسها" : "Deep knowledge and passion for the subjects you teach",
    },
    {
      icon: GraduationCap,
      text: ar ? "شهادة جامعية أو ما يعادلها في تخصصك" : "University degree or equivalent in your field",
    },
  ];

  const hiringSteps = [
    {
      icon: Search,
      text: ar ? "مراجعة نموذج التقديم من فريق OSTAZZE" : "Application review by the OSTAZZE team",
    },
    {
      icon: Video,
      text: ar ? "مقابلة قصيرة مع فريق المعلمين" : "Short interview with the tutor team",
    },
    {
      icon: Presentation,
      text: ar
        ? "حضور جلسة تعريفية والموافقة على شروط المنصة"
        : "Attend an onboarding session and accept the platform terms",
    },
  ];

  const faqs = [
    {
      q: ar ? "لماذا أنضم لـ OSTAZZE؟" : "Why join OSTAZZE?",
      a: ar
        ? "منصة مرنة تمنحك دخلاً إضافيًا مع أدوات إدارة متكاملة وشبكة واسعة من الطلاب في السعودية والإمارات وقطر والكويت ومصر."
        : "A flexible platform giving you extra income, integrated management tools, and access to students across Saudi Arabia, UAE, Qatar, Kuwait, and Egypt.",
    },
    {
      q: ar ? "ما متطلبات التقديم؟" : "What are the requirements?",
      a: ar
        ? "أن يكون عمرك 18 سنة أو أكثر، خبرة في المادة التي ترغب بتدريسها، وجهاز حاسوب مع اتصال إنترنت مستقر."
        : "You must be 18+, have expertise in the subject you'll teach, and own a computer with a stable internet connection.",
    },
    {
      q: ar ? "ما الخطوة التالية بعد التقديم؟" : "What happens after I apply?",
      a: ar
        ? "يراجع فريقنا طلبك ثم يدعوك لمقابلة قصيرة عند الحاجة. بعد القبول ستُطلب منك بعض المعلومات الإضافية لإكمال ملفك."
        : "Our team reviews your application and invites you to a short interview if needed. After approval you'll complete a few extra details to finalize your profile.",
    },
    {
      q: ar ? "من يحدد سعر الحصص؟" : "Who sets the session price?",
      a: ar
        ? "OSTAZZE يعتمد أسعارًا موحدة لكل دولة (SA/QA/KW/EG) لضمان العدالة للمعلم والطالب."
        : "OSTAZZE uses standardized per-country pricing (SA/QA/KW/EG) to keep things fair for tutors and students.",
    },
    {
      q: ar ? "هل يمكنني تقديم الحصص عن بُعد؟" : "Can I teach remotely?",
      a: ar
        ? "بالطبع، جميع الحصص تُقدَّم عن بُعد عبر Zoom المدمج في المنصة."
        : "Absolutely — all sessions are delivered remotely via Zoom integrated into the platform.",
    },
    {
      q: ar ? "كيف يتم الدفع لي؟" : "How do I get paid?",
      a: ar
        ? "تُصرف المستحقات دوريًا عبر التحويل البنكي أو محافظ الدفع المدعومة في دولتك."
        : "Payouts are issued regularly via bank transfer or the supported payment wallets in your country.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHelmet
        title={ar ? "انضم كمعلم في OSTAZZE" : "Join as a Tutor | OSTAZZE"}
        description={
          ar
            ? "انضم لمجتمع معلمي OSTAZZE وابدأ رحلتك التعليمية مع آلاف الطلاب في الوطن العربي."
            : "Join the OSTAZZE tutor community and start teaching thousands of students across the Arab world."
        }
      />

      <PageHeader
        title={ar ? "انضم كمعلم في OSTAZZE" : "Join OSTAZZE as a Tutor"}
        subtitle={
          ar
            ? "كن جزءًا من أكبر مجتمع للمعلمين الجامعيين في الوطن العربي — دخل مرن، طلاب حقيقيون، ودعم متواصل."
            : "Join the largest community of university tutors in the Arab world — flexible income, real students, and continuous support."
        }
      />

      {/* Hero CTA */}
      <section className="container mx-auto px-4 -mt-6 mb-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl p-8 md:p-12 shadow-xl text-center">
          <h2 className="text-2xl md:text-4xl font-black mb-4">
            {ar ? "قدّم طلبك الآن عبر واتساب" : "Apply Now via WhatsApp"}
          </h2>
          <p className="text-base md:text-lg mb-6 opacity-95">
            {ar
              ? "أرسل لنا رسالة قصيرة وسنعاود التواصل معك خلال 24 ساعة."
              : "Send us a quick message and we'll reach out within 24 hours."}
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-primary font-black px-8 py-4 rounded-full text-lg hover:scale-105 transition-transform shadow-lg"
          >
            <MessageCircle size={24} />
            {ar ? "تواصل معنا الآن" : "Contact Us Now"}
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 mb-20">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-3">
          {ar ? "مزايا كونك معلمًا في OSTAZZE" : "Benefits of Teaching on OSTAZZE"}
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          {ar
            ? "كل ما تحتاجه لتبني مسيرة تدريس ناجحة في مكان واحد."
            : "Everything you need to grow a successful tutoring career, in one place."}
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-muted/30 py-20 mb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
            {ar ? "كيف تصبح معلمًا في OSTAZZE؟" : "How to Become an OSTAZZE Tutor"}
          </h2>

          <div className="max-w-4xl mx-auto space-y-10">
            {/* Step 1 */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-lg">
                  01
                </div>
                <h3 className="text-xl md:text-2xl font-black">
                  {ar ? "تواصل معنا عبر واتساب" : "Contact Us on WhatsApp"}
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                {ar
                  ? "أرسل رسالة تعريفية بك وبتخصصك وسنرد عليك بأسرع وقت."
                  : "Send a short intro about yourself and your specialty — we'll reply as soon as possible."}
              </p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full hover:opacity-90 transition"
              >
                <MessageCircle size={20} />
                {ar ? "ابدأ المحادثة" : "Start the Chat"}
              </a>
            </div>

            {/* Step 2 */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-lg">
                  02
                </div>
                <h3 className="text-xl md:text-2xl font-black">
                  {ar ? "عبِّئ نموذج التقديم" : "Fill Out the Application"}
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                {ar ? "معايير التأهيل التي تحتاجها للانضمام إلينا:" : "The qualification criteria we look for:"}
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {requirements.map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="bg-muted/40 rounded-xl p-4 flex flex-col items-center text-center gap-2"
                  >
                    <Icon size={28} className="text-primary" />
                    <span className="text-sm font-semibold">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-lg">
                  03
                </div>
                <h3 className="text-xl md:text-2xl font-black">
                  {ar ? "أنهِ إجراءات التوظيف" : "Complete the Hiring Process"}
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                {ar
                  ? "بعد الخطوتين السابقتين، تبدأ عملية التوظيف وتتكون من:"
                  : "After the previous two steps, the hiring process consists of:"}
              </p>
              <div className="space-y-3">
                {hiringSteps.map(({ icon: Icon, text }, i) => (
                  <div
                    key={text}
                    className="flex items-center gap-4 bg-muted/40 rounded-xl p-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon size={20} />
                    </div>
                    <span className="text-sm md:text-base font-semibold">
                      {i + 1}. {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 mb-20">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-10">
          {ar ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
        </h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 mb-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl p-8 md:p-12 shadow-xl text-center">
          <h2 className="text-2xl md:text-4xl font-black mb-4">
            {ar ? "جاهز للانطلاق؟" : "Ready to Get Started?"}
          </h2>
          <p className="text-base md:text-lg mb-6 opacity-95">
            {ar
              ? "انضم إلى مجتمع معلمي OSTAZZE اليوم وابدأ رحلتك."
              : "Join the OSTAZZE tutor community today and start your journey."}
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-primary font-black px-8 py-4 rounded-full text-lg hover:scale-105 transition-transform shadow-lg"
          >
            <MessageCircle size={24} />
            {ar ? "قدّم طلبك عبر واتساب" : "Apply via WhatsApp"}
          </a>
        </div>
      </section>
    </div>
  );
};

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-start font-bold hover:bg-muted/40 transition"
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown
          size={20}
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</div>
      )}
    </div>
  );
};

export default JoinAsTutor;
