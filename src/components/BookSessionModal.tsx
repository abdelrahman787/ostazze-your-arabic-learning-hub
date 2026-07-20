import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Loader2, Calendar, BookOpen, CheckCircle2, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  teacherId: string;
  teacherName: string;
  subjects: string[];
}


type DaySlot = { day: number; slot: "morning" | "afternoon" | "evening" };

const SLOTS: { key: DaySlot["slot"]; hour: number }[] = [
  { key: "morning", hour: 9 },
  { key: "afternoon", hour: 14 },
  { key: "evening", hour: 19 },
];

const BookSessionModal = ({ open, onClose, teacherId, teacherName, subjects }: Props) => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: subjects[0] || "", notes: "" });
  const [selectedSlots, setSelectedSlots] = useState<DaySlot[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm({ subject: subjects[0] || "", notes: "" });
      setSelectedSlots([]);
      setShowSuccess(false);
      return;
    }
  }, [open, subjects]);

  const dayNames = [
    t("day_sun"),
    t("day_mon"),
    t("day_tue"),
    t("day_wed"),
    t("day_thu"),
    t("day_fri"),
    t("day_sat"),
  ];

  const slotLabels = {
    morning: { label: t("preferred_morning"), time: t("preferred_morning_time") },
    afternoon: { label: t("preferred_afternoon"), time: t("preferred_afternoon_time") },
    evening: { label: t("preferred_evening"), time: t("preferred_evening_time") },
  };

  const toggleSlot = (day: number, slot: DaySlot["slot"]) => {
    setSelectedSlots((prev) => {
      const exists = prev.some((s) => s.day === day && s.slot === slot);
      if (exists) {
        return prev.filter((s) => !(s.day === day && s.slot === slot));
      }
      return [...prev, { day, slot }];
    });
  };

  const isSelected = (day: number, slot: DaySlot["slot"]) =>
    selectedSlots.some((s) => s.day === day && s.slot === slot);

  const getNextDateForSlot = (day: number, hour: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    let daysUntil = day - currentDay;
    if (daysUntil < 0) daysUntil += 7;
    if (daysUntil === 0 && today.getHours() >= hour) daysUntil = 7;
    const date = new Date(today);
    date.setDate(today.getDate() + daysUntil);
    date.setHours(hour, 0, 0, 0);
    return date;
  };

  const computePrimarySlot = () => {
    if (selectedSlots.length === 0) return null;
    const candidates = selectedSlots.map(({ day, slot }) => {
      const hour = SLOTS.find((s) => s.key === slot)?.hour || 9;
      return {
        day,
        slot,
        date: getNextDateForSlot(day, hour),
      };
    });
    candidates.sort((a, b) => a.date.getTime() - b.date.getTime());
    return candidates[0];
  };

  const formatSlot = (day: number, slot: DaySlot["slot"]) => {
    const time = slotLabels[slot].time;
    return `${dayNames[day]} — ${time}`;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error(t("login_required"));
      return;
    }
    if (selectedSlots.length === 0) {
      toast.error(t("no_preferred_time_selected"));
      return;
    }

    const primary = computePrimarySlot();
    if (!primary) return;

    const preferredDate = primary.date.toISOString().split("T")[0];
    const preferredTime = primary.date.toTimeString().slice(0, 5);

    const noteParts: string[] = [];
    if (form.notes.trim()) noteParts.push(form.notes.trim());
    if (selectedSlots.length > 1) {
      noteParts.push(
        `${t("preferred_slots_label")}: ${selectedSlots.map((s) => formatSlot(s.day, s.slot)).join(", ")}`
      );
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("session_requests").insert({
        student_id: user.id,
        teacher_id: teacherId,
        subject: form.subject || null,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        notes: noteParts.join(" — ") || null,
        status: "pending",
      });

      if (error) throw error;

      setShowSuccess(true);
    } catch (e: any) {
      toast.error((lang === "ar" ? "خطأ: " : "Error: ") + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto my-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-foreground">
                {t("book_with")} {teacherName}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                aria-label={t("close_btn")}
              >
                <X size={16} />
              </button>
            </div>

            {showSuccess ? (
              <div className="py-6 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mx-auto w-20 h-20 rounded-full bg-success/15 flex items-center justify-center"
                >
                  <CheckCircle2 size={44} className="text-success" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-black text-foreground mb-2">
                    {t("request_success_title")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed px-2">
                    {t("request_success_message")}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-secondary/60 rounded-xl py-2.5 px-3">
                  <Mail size={14} className="text-primary" />
                  {lang === "ar" ? "راجع بريدك الإلكتروني خلال الساعات القادمة" : "Check your email in the next few hours"}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/my-bookings");
                    }}
                    className="btn-primary flex-1 text-sm"
                  >
                    {t("my_bookings")}
                  </button>
                  <button onClick={onClose} className="btn-outline flex-1 text-sm">
                    {t("close_btn")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {subjects.length > 0 && (
                  <div>
                    <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5 text-foreground">
                      <BookOpen size={14} className="text-primary" /> {t("the_subject")}
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className="input-base"
                    >
                      {subjects.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <div className="flex items-start gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-foreground">{t("preferred_time_title")}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        {t("preferred_time_subtitle")}
                      </p>
                    </div>
                  </div>

                  <div className="border border-border rounded-2xl overflow-hidden bg-card">
                    {/* Header row */}
                    <div className="grid grid-cols-4 bg-primary/5 text-center">
                      <div className="p-3 text-xs font-bold text-muted-foreground border-b border-border border-e border-border/50">
                        {lang === "ar" ? "اليوم" : "Day"}
                      </div>
                      {SLOTS.map((s) => (
                        <div
                          key={s.key}
                          className="p-3 text-xs font-bold text-foreground border-b border-border last:border-e-0 border-e border-border/50"
                        >
                          <div>{slotLabels[s.key].label}</div>
                          <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                            {slotLabels[s.key].time}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Day rows */}
                    {dayNames.map((dayName, dayIndex) => (
                      <div key={dayIndex} className="grid grid-cols-4">
                        <div className="p-3 flex items-center justify-center bg-secondary/30 text-sm font-bold text-foreground border-e border-border/50">
                          {dayName}
                        </div>
                        {SLOTS.map((s) => {
                          const selected = isSelected(dayIndex, s.key);
                          return (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => toggleSlot(dayIndex, s.key)}
                              className={`p-3 flex items-center justify-center transition-colors border-e border-border/50 last:border-e-0 hover:bg-secondary/50 ${
                                selected ? "bg-primary/10" : ""
                              }`}
                              aria-pressed={selected}
                            >
                              <div
                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                                  selected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background"
                                }`}
                              >
                                {selected && <CheckCircle2 size={14} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5 text-foreground">
                    {t("notes_optional")}
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={2}
                    className="input-base resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSubmit}
                  disabled={submitting || selectedSlots.length === 0}
                  className="w-full text-base font-extrabold bg-primary text-primary-foreground px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:bg-primary-dark hover:shadow-[0_8px_24px_hsl(14_91%_49%/0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
                  {submitting ? t("sending") : t("confirm_booking_btn")}
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default BookSessionModal;
