import { Link } from "react-router-dom";
import TeacherCard from "@/components/TeacherCard";
import { mockTeachers, mockTestimonials } from "@/data/mockData";
import {
  Star, ArrowLeft, Sparkles, GraduationCap, CalendarCheck, Video,
  CheckCircle2, Play, Users, ArrowUpLeft
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const heroImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const HomePage = () => {
  const featuredTeachers = mockTeachers.slice(0, 3);
  const statsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: statsRef, offset: ["start end", "end start"] });
  const statsScale = useTransform(scrollYProgress, [0, 0.5], [0.96, 1]);

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient min-h-[90vh] flex items-center overflow-hidden relative">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.div variants={item} className="badge-brand inline-flex items-center gap-2 mb-8">
                <Sparkles size={14} />
                <span>منصة تعليمية متميزة</span>
              </motion.div>

              <motion.h1 variants={item} className="text-4xl md:text-[3.4rem] font-black leading-[1.15] mb-6">
                تعلّم مع{" "}
                <span className="text-primary">أفضل المعلمين</span>
              </motion.h1>

              <motion.p variants={item} className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-md">
                منصة تعليمية تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap gap-3 mb-14">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/teachers" className="btn-primary text-base !px-8 flex items-center gap-2">
                    ابدأ الآن
                    <ArrowLeft size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/teachers" className="border-2 border-border text-foreground px-8 py-3 rounded-xl font-bold hover:border-primary/50 transition-all">
                    تصفح المعلمين
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div variants={item} className="flex gap-12">
                {[
                  { num: "+500", label: "معلم" },
                  { num: "+10K", label: "طالب" },
                  { num: "4.9", label: "تقييم" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl md:text-3xl font-black text-foreground">{s.num}</div>
                    <div className="text-muted-foreground text-sm">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <img
                  src={heroImage}
                  alt="طلاب يدرسون"
                  className="rounded-3xl w-full object-cover h-[480px] opacity-90"
                />
              </motion.div>

              {/* Floating Card - Top Right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute top-6 -left-4 bg-card rounded-2xl border p-3.5 flex items-center gap-3 shadow-lg"
              >
                <div className="icon-box bg-primary/10">
                  <GraduationCap size={20} className="text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm">معلمون معتمدون</div>
                  <div className="text-muted-foreground text-xs">من أفضل الجامعات</div>
                </div>
                <div className="w-2.5 h-2.5 bg-success rounded-full mr-2" />
              </motion.div>

              {/* Floating Card - Bottom Right */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute bottom-6 right-4 bg-card rounded-2xl border p-3.5 flex items-center gap-3 shadow-lg"
              >
                <div>
                  <div className="font-bold text-sm">جلسات مباشرة</div>
                  <div className="text-muted-foreground text-xs">عبر Zoom</div>
                </div>
                <div className="icon-box bg-success/10">
                  <Video size={20} className="text-success" />
                </div>
                <div className="w-2.5 h-2.5 bg-success rounded-full" />
              </motion.div>

              {/* Decorative dots */}
              <div className="absolute -right-4 top-1/4 flex flex-col gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary/20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-section-alt">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-extrabold mb-3">لماذا تختارنا؟</h2>
            <p className="text-muted-foreground">
              تجربة تعليمية فريدة مع أفضل المعلمين وأدوات تفاعلية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "معلمون متميزون",
                desc: "معلمون معتمدون من أفضل الجامعات",
                active: true,
              },
              {
                icon: CalendarCheck,
                title: "مواعيد مرنة",
                desc: "احجز جلستك في الوقت المناسب لك",
                active: false,
              },
              {
                icon: Video,
                title: "تعلم عن بعد",
                desc: "جلسات مباشرة عبر Zoom من أي مكان",
                active: false,
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`card-base p-8 text-center ${i === 0 ? "card-active" : ""}`}
              >
                <div className="icon-box-lg bg-primary/10 text-primary mx-auto mb-5">
                  <step.icon size={24} />
                </div>
                <h3 className={`font-bold text-lg mb-2 ${i === 0 ? "text-primary" : ""}`}>{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="py-24">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold mb-2">المعلمون</h2>
              <p className="text-muted-foreground">تعرف على نخبة من أفضل المعلمين</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link to="/teachers" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-1">
                عرض الكل
                <ArrowLeft size={14} />
              </Link>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTeachers.map((t, i) => (
              <TeacherCard key={t.id} teacher={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <motion.section
        ref={statsRef}
        style={{ scale: statsScale }}
        className="stats-gradient py-20 mx-4 lg:mx-8 rounded-3xl"
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-primary-foreground">
            {[
              { num: "+500", label: "معلم معتمد" },
              { num: "+10,000", label: "طالب نشط" },
              { num: "+25,000", label: "جلسة مكتملة" },
              { num: "4.9/5", label: "متوسط التقييم" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
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
            <h2 className="text-3xl font-extrabold mb-3">ماذا يقول طلابنا</h2>
            <p className="text-muted-foreground">آراء الطلاب حول تجربتهم في المنصة</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockTestimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card-base p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={14} className="fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
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
      <section className="cta-gradient py-24">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-foreground mb-4">
              ابدأ رحلتك التعليمية اليوم
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              انضم إلى آلاف الطلاب الذين يتعلمون مع أفضل المعلمين في Ostazze
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="btn-primary text-base !px-8">أنشئ حسابك مجاناً</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
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
