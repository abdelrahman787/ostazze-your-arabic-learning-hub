import { useParams, Link } from "react-router-dom";
import { mockTeachers, mockReviews } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Clock, User, ArrowUpLeft, X, BookOpen } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookSessionModal from "@/components/BookSessionModal";

const TeacherProfile = () => {
  const { id } = useParams();
  const { t, d } = useLanguage();
  const teacher = mockTeachers.find((tc) => tc.id === id);
  const [showBooking, setShowBooking] = useState(false);

  if (!teacher) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">{t("teacher_not_found")}</h1>
        <Link to="/teachers" className="btn-primary mt-4 inline-block">{t("teacher_back")}</Link>
      </div>
    );
  }

  const initials = d(teacher.name).split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div>
      <section className="hero-gradient py-8">
        <div className="container">
          <p className="text-muted-foreground text-sm"><Link to="/teachers" className="hover:text-primary">{t("nav_teachers")}</Link> / {d(teacher.name)}</p>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-base p-6">
              <div className="flex gap-5 mb-6">
                <motion.div whileHover={{ scale: 1.08, rotate: 5 }} className="w-20 h-20 rounded-2xl stats-gradient text-primary-foreground flex items-center justify-center text-2xl font-black shrink-0">
                  {initials}
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-xl font-black">{d(teacher.name)}</h1>
                    {teacher.verified && <span className="text-xs bg-success/10 text-success px-2.5 py-1 rounded-full font-semibold">{t("teacher_verified")}</span>}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{d(teacher.title)}</p>
                  {teacher.university && (
                    <div className="inline-flex items-center gap-1.5 mt-2 text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-1 rounded-full">
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}><BookOpen size={12} /></motion.div>
                      {d(teacher.university)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-8 mb-6 flex-wrap">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-warning"><motion.div whileHover={{ rotate: 72, scale: 1.3 }}><Star size={20} className="fill-warning" /></motion.div><span className="text-xl font-black">{teacher.rating}</span></div>
                  <div className="text-muted-foreground text-xs">{teacher.reviews} {t("teacher_review_count")}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-primary">{teacher.totalSessions || 0}</div>
                  <div className="text-muted-foreground text-xs">{t("teacher_sessions")}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black">{teacher.yearsExperience || 0}</div>
                  <div className="text-muted-foreground text-xs">{t("teacher_experience")}</div>
                </div>
              </div>

              {teacher.bio && <p className="text-muted-foreground leading-relaxed mb-6">{d(teacher.bio)}</p>}

              <div className="flex flex-wrap gap-2 mb-6">
                {teacher.subjects.map((s, i) => <span key={i} className="badge-brand">{d(s)}</span>)}
              </div>

              <div className="flex gap-4 items-center flex-wrap">
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-primary">{teacher.price} {d(teacher.currency)}</div>
                  <div className="text-muted-foreground text-xs">{t("teacher_per_session")}</div>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowBooking(true)} className="btn-primary flex-1 text-center text-lg">
                  {t("teacher_book")} →
                </motion.button>
              </div>
            </div>

            {teacher.availability && (
              <div className="card-base p-6">
                <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}><Clock size={20} className="text-primary" /></motion.div>
                  {t("teacher_availability")}
                </h3>
                <div className="space-y-3">
                  {teacher.availability.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                      <span className="font-bold text-sm">{d(a.day)}</span>
                      <span className="text-muted-foreground text-sm">{a.start} - {a.end}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card-base p-6">
              <h3 className="font-extrabold text-lg mb-4">{t("teacher_reviews")} ({teacher.reviews})</h3>
              <div className="text-center mb-6 p-4 bg-secondary rounded-xl">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-3xl font-black">{teacher.rating}</span>
                  <motion.div whileHover={{ rotate: 72, scale: 1.3 }}><Star size={24} className="fill-warning text-warning" /></motion.div>
                </div>
                <div className="text-muted-foreground text-sm">{t("booking_from5")}</div>
              </div>
              <div className="space-y-4">
                {mockReviews.map((r) => (
                  <div key={r.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{d(r.studentName).charAt(0)}</div>
                        <span className="font-bold text-sm">{d(r.studentName)}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{d(r.date)}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={12} className="fill-warning text-warning" />)}</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{d(r.comment)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setShowBooking(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card rounded-2xl p-8 w-full max-w-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold">{t("booking_title")}</h2>
                <button onClick={() => setShowBooking(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5">{t("booking_select_subject")}</label>
                  <select className="input-base">{teacher.subjects.map((s, i) => <option key={i}>{d(s)}</option>)}</select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">{t("booking_datetime")}</label>
                  <input type="datetime-local" className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">{t("booking_notes")}</label>
                  <textarea rows={3} className="input-base resize-none" />
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-bold text-foreground">{t("booking_price")}</span>
                  <span className="font-extrabold text-primary">{teacher.price} {d(teacher.currency)}</span>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="btn-primary w-full text-lg">{t("booking_confirm")}</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherProfile;
