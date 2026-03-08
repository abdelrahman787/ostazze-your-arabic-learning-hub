import { Link } from "react-router-dom";
import TeacherCard from "@/components/TeacherCard";
import { mockTeachers, mockCategories, mockTestimonials } from "@/data/mockData";
import { Star } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80";

const HomePage = () => {
  const featuredTeachers = mockTeachers.filter((t) => t.featured).length > 0
    ? mockTeachers.slice(0, 6)
    : mockTeachers;

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient min-h-[85vh] flex items-center">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="badge-brand inline-block mb-5">🎓 منصة تعليمية متميزة</span>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                تعلّم مع <span className="text-primary">أفضل المعلمين</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-9 max-w-lg">
                منصة تعليمية تربطك بأفضل المدرسين الخصوصيين لجلسات مباشرة عبر الإنترنت
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/teachers" className="btn-primary text-lg !px-8">ابدأ الآن ←</Link>
                <Link to="/teachers" className="btn-outline text-lg !px-8">تصفح المعلمين</Link>
              </div>
              <div className="flex gap-8">
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
              </div>
            </div>

            <div className="relative hidden lg:block">
              <img src={heroImage} alt="طلاب يدرسون" className="rounded-[20px] shadow-card-hover w-full object-cover h-[420px]" />
              <div className="absolute top-4 left-4 card-base p-3 flex items-center gap-3 animate-fade-in">
                <span className="w-2.5 h-2.5 rounded-full bg-success" />
                <div>
                  <div className="font-bold text-sm">معلمون معتمدون</div>
                  <div className="text-muted-foreground text-xs">من أفضل الجامعات 🎓</div>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 card-base p-3 flex items-center gap-3 animate-fade-in">
                <span className="text-success text-lg">📹</span>
                <div>
                  <div className="font-bold text-sm">جلسات مباشرة</div>
                  <div className="text-muted-foreground text-xs">عبر Zoom</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-section-alt py-20">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center mb-3">كيف يعمل <span className="text-primary">Ostazze</span>؟</h2>
          <p className="text-muted-foreground text-center mb-12">ابدأ رحلتك التعليمية في 3 خطوات بسيطة</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "🔍", num: "01", title: "ابحث عن معلم", desc: "تصفح مئات المعلمين المتخصصين وفلتر حسب المادة أو السعر أو التقييم" },
              { emoji: "📅", num: "02", title: "احجز جلسة", desc: "اختر الوقت المناسب من جدول المعلم واحجز جلستك الخاصة بسهولة" },
              { emoji: "🎯", num: "03", title: "تعلم وتقدم", desc: "التقِ بمعلمك عبر Zoom وابدأ جلستك التعليمية المباشرة الاحترافية" },
            ].map((step) => (
              <div key={step.num} className="card-base card-hover p-9 text-center">
                <div className="text-5xl mb-4">{step.emoji}</div>
                <div className="text-2xl font-black text-primary mb-2">{step.num}</div>
                <h3 className="font-extrabold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center mb-3">التصنيفات الدراسية</h2>
          <p className="text-muted-foreground text-center mb-12">تصفح المواد حسب التخصص</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {mockCategories.map((cat) => (
              <Link to="/categories" key={cat.id} className="card-base card-hover p-7 text-center cursor-pointer hover:border-primary">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold mb-1">{cat.name}</h3>
                <p className="text-muted-foreground text-sm">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="bg-section-alt py-20">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center mb-3">المعلمون المميزون</h2>
          <p className="text-muted-foreground text-center mb-12">تعرف على نخبة من أفضل المعلمين</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTeachers.map((t) => <TeacherCard key={t.id} teacher={t} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/teachers" className="btn-outline">عرض جميع المعلمين →</Link>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="stats-gradient py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-primary-foreground">
            {[
              { num: "+200", label: "معلم معتمد" },
              { num: "+5,000", label: "طالب نشط" },
              { num: "+12,000", label: "جلسة مكتملة" },
              { num: "4.9/5", label: "متوسط التقييم" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-black">{s.num}</div>
                <div className="opacity-90 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-section-alt py-20">
        <div className="container">
          <h2 className="text-3xl font-extrabold text-center mb-12">ماذا يقول طلابنا</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mockTestimonials.map((t, i) => (
              <div key={i} className="card-base p-6">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map((n) => <Star key={n} size={16} className="fill-warning text-warning" />)}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-gradient py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-black text-foreground mb-4">ابدأ رحلتك التعليمية اليوم</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">انضم إلى آلاف الطلاب الذين يتعلمون مع أفضل المعلمين في Ostazze</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary text-lg !px-8">أنشئ حسابك مجاناً</Link>
            <Link to="/teachers" className="border-2 border-foreground/30 text-foreground px-8 py-3 rounded-[10px] font-bold hover:bg-foreground/10 transition-colors">تصفح المعلمين</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
