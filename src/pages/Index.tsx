import { Link } from "react-router-dom";
import TeacherCard from "@/components/TeacherCard";
import { mockTeachers, mockCategories, mockTestimonials } from "@/data/mockData";
import { Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const heroImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const HomePage = () => {
  const featuredTeachers = mockTeachers.slice(0, 6);
  const statsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: statsRef, offset: ["start end", "end start"] });
  const statsScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient min-h-[85vh] flex items-center overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.span variants={item} className="badge-brand inline-block mb-5">🎓 منصة تعليمية متميزة</motion.span>
              <motion.h1 variants={item} className="text-4xl md:text-5xl font-black leading-tight mb-5">
                تعلّم مع <span className="text-primary">أفضل المعلمين</span>
              </motion.h1>
              <motion.p variants={item} className="text-muted-foreground text-lg leading-relaxed mb-9 max-w-lg">
                منصة تعليمية تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت
              </motion.p>
              <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/teachers" className="btn-primary text-lg !px-8">ابدأ الآن ←</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/teachers" className="btn-outline text-lg !px-8">تصفح المعلمين</Link>
                </motion.div>
              </motion.div>
              <motion.div variants={item} className="flex gap-8">
                {[
                  { num: "+200", label: "معلم معتمد" },
                  { num: "+5K", label: "طالب نشط" },
                  { num: "4.9", label: "تقييم عام" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-black text-primary">{s.num}</div>
                    <div className="text-muted-foreground text-sm">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <div className="relative hidden lg:block">
              <motion.img
                initial={{ opacity: 0, scale: 0.9, x: 60 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                src={heroImage}
                alt="طلاب يدرسون"
                className="rounded-[20px] shadow-card-hover w-full object-cover h-[420px]"
              />
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                className="absolute top-4 left-4 card-base p-3 flex items-center gap-3"
              >
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2.5 h-2.5 rounded-full bg-success"
                />
                <div>
                  <div className="font-bold text-sm">معلمون معتمدون</div>
                  <div className="text-muted-foreground text-xs">من أفضل الجامعات 🎓</div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                className="absolute bottom-4 right-4 card-base p-3 flex items-center gap-3"
              >
                <span className="text-success text-lg">📹</span>
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
      <section className="bg-section-alt py-20">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-center mb-3"
          >
            كيف يعمل <span className="text-primary">Ostazze</span>؟
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground text-center mb-12"
          >
            ابدأ رحلتك التعليمية في 3 خطوات بسيطة
          </motion.p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "🔍", num: "01", title: "ابحث عن معلم", desc: "تصفح مئات المعلمين المتخصصين وفلتر حسب المادة أو السعر أو التقييم" },
              { emoji: "📅", num: "02", title: "احجز جلسة", desc: "اختر الوقت المناسب من جدول المعلم واحجز جلستك الخاصة بسهولة" },
              { emoji: "🎯", num: "03", title: "تعلم وتقدم", desc: "التقِ بمعلمك عبر Zoom وابدأ جلستك التعليمية المباشرة الاحترافية" },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -6, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
                className="card-base card-hover p-9 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-5xl mb-4"
                >
                  {step.emoji}
                </motion.div>
                <div className="text-2xl font-black text-primary mb-2">{step.num}</div>
                <h3 className="font-extrabold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-center mb-3"
          >
            التصنيفات الدراسية
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-center mb-12"
          >
            تصفح المواد حسب التخصص
          </motion.p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {mockCategories.map((cat) => (
              <motion.div key={cat.id} variants={item} whileHover={{ y: -6, scale: 1.03 }}>
                <Link to="/categories" className="card-base card-hover p-7 text-center cursor-pointer hover:border-primary block">
                  <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }} className="text-4xl mb-3">
                    {cat.icon}
                  </motion.div>
                  <h3 className="font-bold mb-1">{cat.name}</h3>
                  <p className="text-muted-foreground text-sm">{cat.count}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="bg-section-alt py-20">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-center mb-3"
          >
            المعلمون المميزون
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-center mb-12"
          >
            تعرف على نخبة من أفضل المعلمين
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTeachers.map((t, i) => <TeacherCard key={t.id} teacher={t} index={i} />)}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block">
              <Link to="/teachers" className="btn-outline">عرض جميع المعلمين →</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <motion.section
        ref={statsRef}
        style={{ scale: statsScale }}
        className="stats-gradient py-16"
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-primary-foreground">
            {[
              { num: "+200", label: "معلم معتمد" },
              { num: "+5,000", label: "طالب نشط" },
              { num: "+12,000", label: "جلسة مكتملة" },
              { num: "4.9/5", label: "متوسط التقييم" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              >
                <div className="text-3xl md:text-4xl font-black">{s.num}</div>
                <div className="opacity-90 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="bg-section-alt py-20">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-center mb-12"
          >
            ماذا يقول طلابنا
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mockTestimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotateY: -8 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="card-base p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map((n) => (
                    <motion.div
                      key={n}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + n * 0.06 + i * 0.1 }}
                    >
                      <Star size={16} className="fill-warning text-warning" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
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
      <section className="cta-gradient py-20">
        <div className="container text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-black text-foreground mb-4"
          >
            ابدأ رحلتك التعليمية اليوم
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground mb-8 max-w-lg mx-auto"
          >
            انضم إلى آلاف الطلاب الذين يتعلمون مع أفضل المعلمين في Ostazze
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="flex justify-center gap-4 flex-wrap"
          >
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="btn-primary text-lg !px-8">أنشئ حسابك مجاناً</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
              <Link to="/teachers" className="border-2 border-foreground/30 text-foreground px-8 py-3 rounded-[10px] font-bold hover:bg-foreground/10 transition-colors">تصفح المعلمين</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
