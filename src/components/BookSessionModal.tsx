import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { X, Loader2, Calendar, Clock, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface AvailSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  teacherId: string;
  teacherName: string;
  subjects: string[];
  price: number;
  currency: string;
}

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const BookSessionModal = ({ open, onClose, teacherId, teacherName, subjects, price, currency }: Props) => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<AvailSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: subjects[0] || "", date: "", time: "", notes: "" });

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase
      .from("teacher_availability")
      .select("day_of_week, start_time, end_time")
      .eq("teacher_id", teacherId)
      .eq("is_active", true)
      .order("day_of_week")
      .then(({ data }) => {
        setAvailability((data as AvailSlot[]) || []);
        setLoading(false);
      });
  }, [open, teacherId]);

  const handleSubmit = async () => {
    if (!user) { toast.error("يجب تسجيل الدخول أولاً"); return; }
    if (!form.date || !form.time) { toast.error("اختر التاريخ والوقت"); return; }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        student_id: user.id,
        teacher_id: teacherId,
        subject: form.subject || null,
        scheduled_date: form.date,
        scheduled_time: form.time,
        notes: form.notes || null,
      });
      if (error) throw error;
      toast.success("تم إرسال طلب الحجز بنجاح! ✅");
      onClose();
      setForm({ subject: subjects[0] || "", date: "", time: "", notes: "" });
    } catch (e: any) {
      toast.error("خطأ: " + e.message);
    }
    setSubmitting(false);
  };

  // Get the day of week for selected date
  const selectedDayOfWeek = form.date ? new Date(form.date).getDay() : null;
  const daySlots = selectedDayOfWeek !== null ? availability.filter((a) => a.day_of_week === selectedDayOfWeek) : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card rounded-2xl p-6 w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold">حجز جلسة مع {teacherName}</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors">
                <X size={16} />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : (
              <div className="space-y-4">
                {/* Available times info */}
                {availability.length > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1"><Clock size={12} /> أوقات التوفر:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {availability.map((a, i) => (
                        <span key={i} className="text-xs bg-secondary rounded-full px-2 py-0.5">
                          {DAYS[a.day_of_week]} {a.start_time.slice(0, 5)}-{a.end_time.slice(0, 5)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject */}
                {subjects.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold mb-1.5 flex items-center gap-1"><BookOpen size={14} /> المادة</label>
                    <select value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="input-base">
                      {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="block text-sm font-bold mb-1.5 flex items-center gap-1"><Calendar size={14} /> التاريخ</label>
                  <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, time: "" }))} className="input-base" />
                  {form.date && daySlots.length === 0 && availability.length > 0 && (
                    <p className="text-destructive text-xs mt-1">⚠️ المعلم غير متاح في هذا اليوم</p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-bold mb-1.5 flex items-center gap-1"><Clock size={14} /> الوقت</label>
                  {daySlots.length > 0 ? (
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">اختر من الأوقات المتاحة:</p>
                      <div className="flex flex-wrap gap-2">
                        {daySlots.map((slot, i) => {
                          // Generate time slots every hour
                          const start = parseInt(slot.start_time.split(":")[0]);
                          const end = parseInt(slot.end_time.split(":")[0]);
                          const times = [];
                          for (let h = start; h < end; h++) {
                            const t = `${String(h).padStart(2, "0")}:00`;
                            times.push(t);
                          }
                          return times.map((t) => (
                            <button key={`${i}-${t}`} onClick={() => setForm((f) => ({ ...f, time: t }))}
                              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${form.time === t ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-primary/10"}`}>
                              {t}
                            </button>
                          ));
                        })}
                      </div>
                    </div>
                  ) : (
                    <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="input-base" />
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold mb-1.5">ملاحظات (اختياري)</label>
                  <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={2} className="input-base resize-none" placeholder="مثال: أحتاج مراجعة الفصل الثالث..." />
                </div>

                {/* Price */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-bold text-foreground">سعر الجلسة</span>
                  <span className="font-extrabold text-primary">{price} {currency}</span>
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleSubmit}
                  disabled={submitting || !form.date || !form.time}
                  className="btn-primary w-full text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
                  {submitting ? "جاري الإرسال..." : "تأكيد الحجز →"}
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookSessionModal;
