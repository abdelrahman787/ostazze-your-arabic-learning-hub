import { Link } from "react-router-dom";
import TeacherCard from "@/components/TeacherCard";
import { mockTeachers, mockCategories, mockTestimonials } from "@/data/mockData";
import {
  Star, Search, CalendarCheck, Target, ArrowLeft,
  Users, BookOpen, Award, Sparkles, Play, CheckCircle2,
  Cog, Stethoscope, Monitor, Calculator, BarChart3, Globe2, FlaskConical, Scale,
  GraduationCap, TrendingUp, Zap
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const heroImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const categoryIcons: Record<string, React.ElementType> = {
  "الهندسة": Cog,
  "الطب والصحة": Stethoscope,
  "علوم الحاسب": Monitor,
  "الرياضيات": Calculator,
  "إدارة الأعمال": BarChart3,
  "اللغات": Globe2,
  "العلوم الأساسية": FlaskConical,
  "القانون": Scale,
};

const stepIcons = [Search, CalendarCheck, Target];

const HomePage = () => {
  const featuredTeachers = mockTeachers.slice(0, 6);
  const statsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: statsRef, offset: ["start end", "end start"] });
  const statsScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient min-h-[88vh] flex items-center overflow-hidden relative">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={item} className="inline-flex items-center gap-2 badge-brand mb-6">
                <GraduationCap size={16} />
                <span>منصة تعليمية متميزة</span>
              </motion.div>

              <motion.h1 variants={item} className="text-4xl md:text-[3.2rem] font-black leading-[1.2] mb-6">
                تعلّم مع{" "}
                <span className="text-primary relative">
                  أفضل المعلمين
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6c50-8 150-8 196 0" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p variants={item} className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
                منصة تعليمية تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap gap-3 mb-12">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/teachers" className="btn-primary text-base !px-7 flex items-center gap-2">
                    ابدأ الآن
                    <ArrowLeft size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/teachers" className="btn-outline text-base !px-7 flex items-center gap-2">
                    <Play size={14} />
                    تصفح المعلمين
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div variants={item} className="flex gap-10">
                {[
                  { num: "+200", label: "معلم معتمد", icon: Users },
                  { num: "+5K", label: "طالب نشط", icon: TrendingUp },
                  { num: "4.9", label: "تقييم عام", icon: Star },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className="icon-box bg-primary/10 text-primary">
                      <s.icon size={20} />
                    </div>
                    <div>
                      <div className="text-xl font-black text-foreground">{s.num}</div>
                      <div className="text-muted-foreground text-xs">{s.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <div className="relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl -z-10 translate-x-4 translate-y-4" />
                <img
                  src={heroImage}
                  alt="طلاب يدرسون"
                  className="rounded-3xl shadow-card-hover w-full object-cover h-[440px]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
                className="absolute top-4 left-4 glass p-3.5 rounded-2xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-success/15 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-success" />
                </div>
                <div>
                  <div className="font-bold text-sm">معلمون معتمدون</div>
                  <div className="text-muted-foreground text-xs">من أفضل الجامعات</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.4, type: "spring" }}
                className="absolute bottom-4 right-4 glass p-3.5 rounded-2xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Play size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm">جلسات مباشرة</div>
                  <div className="text-muted-foreground text-xs">عبر Zoom</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="badge-brand inline-flex items-center gap-1.5 mb-4">
              <Zap size={14} />
              خطوات بسيطة
            </span>
            <h2 className="text-3xl font-extrabold mb-3">
              كيف يعمل <span className="text-primary">Ostazze</span>؟
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              ابدأ رحلتك التعليمية في 3 خطوات بسيطة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "ابحث عن معلم", desc: "تصفح مئات المعلمين المتخصصين وفلتر حسب المادة أو السعر أو التقييم" },
              { num: "02", title: "احجز جلسة", desc: "اختر الوقت المناسب من جدول المعلم واحجز جلستك الخاصة بسهولة" },
              { num: "03", title: "تعلم وتقدم", desc: "التقِ بمعلمك عبر Zoom وابدأ جلستك التعليمية المباشرة الاحترافية" },
            ].map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.12 }}
                  whileHover={{ y: -6 }}
                  className="card-base p-8 text-center group"
                >
                  <div className="icon-box bg-primary/10 text-primary mx-auto mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon size={22} />
                  </div>
                  <div className="text-xs font-bold text-primary/50 mb-2">{step.num}</div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-section-alt py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="badge-brand inline-flex items-center gap-1.5 mb-4">
              <BookOpen size={14} />
              التخصصات
            </span>
            <h2 className="text-3xl font-extrabold mb-3">التصنيفات الدراسية</h2>
            <p className="text-muted-foreground">تصفح المواد حسب التخصص</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {mockCategories.map((cat) => {
              const Icon = categoryIcons[cat.name] || BookOpen;
              return (
                <motion.div key={cat.id} variants={item}>
                  <Link
                    to="/categories"
                    className="card-base card-hover p-6 text-center cursor-pointer hover:border-primary block group"
                  >
                    <div className="icon-box bg-primary/10 text-primary mx-auto mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{cat.name}</h3>
                    <p className="text-muted-foreground text-xs">{cat.count}</p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="badge-brand inline-flex items-center gap-1.5 mb-4">
              <Award size={14} />
              الأفضل
            </span>
            <h2 className="text-3xl font-extrabold mb-3">المعلمون المميزون</h2>
            <p className="text-muted-foreground">تعرف على نخبة من أفضل المعلمين</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTeachers.map((t, i) => (
              <TeacherCard key={t.id} teacher={t} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link to="/teachers" className="btn-outline flex items-center gap-2 mx-auto w-fit">
                عرض جميع المعلمين
                <ArrowLeft size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <motion.section
        ref={statsRef}
        style={{ scale: statsScale }}
        className="stats-gradient py-20 rounded-3xl mx-4 lg:mx-8 mb-4"
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-primary-foreground">
            {[
              { num: "+200", label: "معلم معتمد", icon: Users },
              { num: "+5,000", label: "طالب نشط", icon: TrendingUp },
              { num: "+12,000", label: "جلسة مكتملة", icon: CalendarCheck },
              { num: "4.9/5", label: "متوسط التقييم", icon: Star },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <s.icon size={24} className="mb-3 opacity-80" />
                <div className="text-3xl md:text-4xl font-black">{s.num}</div>
                <div className="opacity-80 mt-1 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="badge-brand inline-flex items-center gap-1.5 mb-4">
              <Sparkles size={14} />
              آراء الطلاب
            </span>
            <h2 className="text-3xl font-extrabold">ماذا يقول طلابنا</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockTestimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="card-base p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={14} className="fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-muted-foreground text-xs">{t.university}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-gradient py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="container text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="icon-box bg-primary/15 text-primary mx-auto mb-6">
              <Sparkles size={22} />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-4">
              ابدأ رحلتك التعليمية اليوم
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              انضم إلى آلاف الطلاب الذين يتعلمون مع أفضل المعلمين في Ostazze
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/register" className="btn-primary text-base !px-8">أنشئ حسابك مجاناً</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/teachers" className="border-2 border-foreground/20 text-foreground px-8 py-3 rounded-xl font-bold hover:bg-foreground/5 transition-all">
                  تصفح المعلمين
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
