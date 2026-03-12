import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { X, Loader2, Calendar, Clock, BookOpen, CalendarCheck, CalendarPlus } from "lucide-react";
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

type BookingMode = "available" | "custom";

/** Get the next date for a given day_of_week (0=Sun) */
function getNextDateForDay(dayOfWeek: number): string {
  const today = new Date();
  const todayDay = today.getDay();
  let diff = dayOfWeek - todayDay;
  if (diff <= 0) diff += 7; // next week
  const next = new Date(today);
  next.setDate(today.getDate() + diff);
  return next.toISOString().split("T")[0];
}

const BookSessionModal = ({ open, onClose, teacherId, teacherName, subjects, price, currency }: Props) => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<AvailSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<BookingMode>("available");
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [form, setForm] = useState({ subject: subjects[0] || "", date: "", time: "", notes: "" });

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setMode("available");
    setSelectedSlotIndex(null);
    setForm({ subject: subjects[0] || "", date: "", time: "", notes: "" });
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

  const handleSelectDaySlot = (index: number) => {
    const slot = availability[index];
    const nextDate = getNextDateForDay(slot.day_of_week);
    setSelectedSlotIndex(index);
    setForm((f) => ({ ...f, date: nextDate, time: "" }));
  };

  const getTimeSlotsForSlot = (slot: AvailSlot): string[] => {
    const start = parseInt(slot.start_time.split(":")[0]);
    const end = parseInt(slot.end_time.split(":")[0]);
    const times: string[] = [];
    for (let h = start; h < end; h++) {
      times.push(`${String(h).padStart(2, "0")}:00`);
    }
    return times;
  };

  const handleSubmit = async () => {
    if (!user) { toast.error("يجب تسجيل الدخول أولاً"); return; }
    if (!form.date || !form.time) { toast.error("اختر التاريخ والوقت"); return; }

    setSubmitting(true);
    try {
      const notesWithMode = mode === "custom"
        ? `[موعد مخصص] ${form.notes || ""}`.trim()
        : form.notes || null;

      const { error } = await supabase.from("bookings").insert({
        student_id: user.id,
        teacher_id: teacherId,
        subject: form.subject || null,
        scheduled_date: form.date,
        scheduled_time: form.time,
        notes: notesWithMode,
      });

      if (error) {
        // Check for conflict (unique index violation)
        if (error.code === "23505" || error.message?.includes("idx_bookings_no_conflict")) {
          toast.error("هذا الموعد محجوز بالفعل! اختر وقتاً آخر ⚠️");
        } else {
          throw error;
        }
        setSubmitting(false);
        return;
      }

      toast.success(
        mode === "available"
          ? "تم إرسال طلب الحجز بنجاح! ✅"
          : "تم إرسال طلب الموعد المخصص للمعلم! ⏳"
      );
      onClose();
      setForm({ subject: subjects[0] || "", date: "", time: "", notes: "" });
    } catch (e: any) {
      toast.error("خطأ: " + e.message);
    }
    setSubmitting(false);
  };

  const selectedSlot = selectedSlotIndex !== null ? availability[selectedSlotIndex] : null;

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
                {/* Mode selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setMode("available"); setSelectedSlotIndex(null); setForm(f => ({ ...f, date: "", time: "" })); }}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold transition-all border-2 ${
                      mode === "available"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <CalendarCheck size={16} />
                    من المواعيد المتاحة
                  </button>
                  <button
                    onClick={() => { setMode("custom"); setSelectedSlotIndex(null); setForm(f => ({ ...f, date: "", time: "" })); }}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold transition-all border-2 ${
                      mode === "custom"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <CalendarPlus size={16} />
                    موعد مخصص
                  </button>
                </div>

                {/* Available mode: pick a day slot */}
                {mode === "available" && availability.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-1">
                      <Calendar size={14} /> اختر اليوم المناسب
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availability.map((a, i) => {
                        const nextDate = getNextDateForDay(a.day_of_week);
                        const isSelected = selectedSlotIndex === i;
                        return (
                          <button
                            key={i}
                            onClick={() => handleSelectDaySlot(i)}
                            className={`p-3 rounded-xl text-sm font-bold transition-all border-2 text-right ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-secondary text-foreground hover:border-primary/30"
                            }`}
                          >
                            <div className="font-extrabold">{DAYS[a.day_of_week]}</div>
                            <div className="text-xs text-muted-foreground mt-1">{nextDate}</div>
                            <div className="text-xs text-primary mt-0.5">
                              {a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {mode === "available" && availability.length === 0 && (
                  <div className="bg-muted rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">لا توجد مواعيد متاحة حالياً</p>
                    <button onClick={() => setMode("custom")} className="text-primary text-sm font-bold mt-2 hover:underline">
                      اطلب موعد مخصص ←
                    </button>
                  </div>
                )}

                {/* Available mode: pick time from selected slot */}
                {mode === "available" && selectedSlot && (
                  <div>
                    <label className="block text-sm font-bold mb-2 flex items-center gap-1">
                      <Clock size={14} /> اختر الوقت
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getTimeSlotsForSlot(selectedSlot).map((t) => (
                        <button
                          key={t}
                          onClick={() => setForm((f) => ({ ...f, time: t }))}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                            form.time === t
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-primary/10 text-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom mode */}
                {mode === "custom" && (
                  <div className="bg-accent/50 border border-accent rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">
                      💡 اختر التاريخ والوقت المناسب لك وسيتم إرسال الطلب للمعلم للموافقة عليه
                    </p>
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

                {/* Custom mode: date & time inputs */}
                {mode === "custom" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 flex items-center gap-1"><Calendar size={14} /> التاريخ</label>
                      <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, time: "" }))} className="input-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 flex items-center gap-1"><Clock size={14} /> الوقت</label>
                      <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="input-base" />
                    </div>
                  </>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    {mode === "custom" ? "سبب اختيار هذا الموعد (اختياري)" : "ملاحظات (اختياري)"}
                  </label>
                  <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={2} className="input-base resize-none"
                    placeholder={mode === "custom" ? "مثال: أفضل هذا الموعد لأن..." : "مثال: أحتاج مراجعة الفصل الثالث..."} />
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
                  {submitting
                    ? "جاري الإرسال..."
                    : mode === "available"
                      ? "تأكيد الحجز →"
                      : "إرسال طلب الموعد →"
                  }
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
