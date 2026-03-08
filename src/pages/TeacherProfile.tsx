import { useParams, Link } from "react-router-dom";
import { mockTeachers, mockReviews } from "@/data/mockData";
import { Star, Calendar, Clock, Award } from "lucide-react";
import { useState } from "react";

const TeacherProfile = () => {
  const { id } = useParams();
  const teacher = mockTeachers.find((t) => t.id === id);
  const [showBooking, setShowBooking] = useState(false);

  if (!teacher) {
    return <div className="container py-20 text-center"><h1 className="text-2xl font-bold">المعلم غير موجود</h1><Link to="/teachers" className="btn-primary mt-4 inline-block">العودة للمعلمين</Link></div>;
  }

  const initials = teacher.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div>
      <section className="hero-gradient py-8">
        <div className="container">
          <p className="text-muted-foreground text-sm"><Link to="/teachers" className="hover:text-primary">المعلمين</Link> / {teacher.name}</p>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-base p-6">
              <div className="flex gap-5 mb-6">
                <div className="w-20 h-20 rounded-full stats-gradient text-primary-foreground flex items-center justify-center text-2xl font-black shrink-0">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-xl font-black">{teacher.name}</h1>
                    {teacher.verified && <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold">✓ موثق</span>}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{teacher.title}</p>
                  {teacher.university && <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-1 rounded-full">🎓 {teacher.university}</span>}
                </div>
              </div>

              <div className="flex gap-8 mb-6 flex-wrap">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-warning"><Star size={20} className="fill-warning" /><span className="text-xl font-black">{teacher.rating}</span></div>
                  <div className="text-muted-foreground text-xs">{teacher.reviews} تقييم</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-primary">{teacher.totalSessions || 0}</div>
                  <div className="text-muted-foreground text-xs">جلسة</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black">{teacher.yearsExperience || 0}</div>
                  <div className="text-muted-foreground text-xs">سنة خبرة</div>
                </div>
              </div>

              {teacher.bio && <p className="text-muted-foreground leading-relaxed mb-6">{teacher.bio}</p>}

              <div className="flex flex-wrap gap-2 mb-6">
                {teacher.subjects.map((s) => <span key={s} className="badge-brand">{s}</span>)}
              </div>

              <div className="flex gap-4 items-center flex-wrap">
                <div className="bg-secondary rounded-[10px] p-4 text-center">
                  <div className="text-xl font-black text-primary">{teacher.price} {teacher.currency}</div>
                  <div className="text-muted-foreground text-xs">لكل جلسة</div>
                </div>
                <button onClick={() => setShowBooking(true)} className="btn-primary flex-1 text-center text-lg">احجز جلسة →</button>
              </div>
            </div>

            {/* Availability */}
            {teacher.availability && (
              <div className="card-base p-6">
                <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2"><Clock size={20} className="text-primary" /> أوقات الإتاحة</h3>
                <div className="space-y-3">
                  {teacher.availability.map((a) => (
                    <div key={a.day} className="flex items-center justify-between p-3 bg-secondary rounded-[10px]">
                      <span className="font-bold text-sm">{a.day}</span>
                      <span className="text-muted-foreground text-sm">{a.start} - {a.end}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            <div className="card-base p-6">
              <h3 className="font-extrabold text-lg mb-4">تقييمات الطلاب ({teacher.reviews})</h3>
              <div className="text-center mb-6 p-4 bg-secondary rounded-[10px]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-3xl font-black">{teacher.rating}</span>
                  <Star size={24} className="fill-warning text-warning" />
                </div>
                <div className="text-muted-foreground text-sm">من 5</div>
              </div>
              <div className="space-y-4">
                {mockReviews.map((r) => (
                  <div key={r.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{r.studentName.charAt(0)}</div>
                        <span className="font-bold text-sm">{r.studentName}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{r.date}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} className="fill-warning text-warning" />)}</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setShowBooking(false)}>
          <div className="bg-card rounded-[20px] p-8 w-full max-w-lg shadow-card-hover animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold">حجز جلسة</h2>
              <button onClick={() => setShowBooking(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1.5">اختر المادة</label>
                <select className="input-base">{teacher.subjects.map((s) => <option key={s}>{s}</option>)}</select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">تاريخ ووقت الجلسة</label>
                <input type="datetime-local" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">ملاحظات للمعلم (اختياري)</label>
                <textarea rows={3} className="input-base resize-none" placeholder="أي ملاحظات تود مشاركتها..." />
              </div>
              <div className="bg-primary-light rounded-[10px] p-4 flex items-center justify-between">
                <span className="font-bold text-primary-dark">سعر الجلسة</span>
                <span className="font-extrabold text-primary">{teacher.price} {teacher.currency}</span>
              </div>
              <button className="btn-primary w-full text-lg">تأكيد الحجز</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
