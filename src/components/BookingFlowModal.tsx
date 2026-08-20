import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  X, Loader2, Sparkles, Calendar, BookOpen, MessageSquare,
  GraduationCap, BadgeCheck, CheckCircle2, Mail, Sun, CloudSun, Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import type { TeacherData } from "@/components/TeacherCard";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Subject coming from the URL (parent subject e.g. "رياضيات") */
  subject: string;
  /** Optional original course label, kept in notes for context */
  courseLabel?: string;
  /** Teachers already filtered by subject from the parent page */
  teachers: TeacherData[];
}

const AUTO_VALUE = "__auto__";

type DaySlot = { day: number; slot: "morning" | "afternoon" | "evening" };

const SLOTS: { key: DaySlot["slot"]; hour: number; icon: React.ReactNode }[] = [
  { key: "morning", hour: 9, icon: <Sun size={14} /> },
  { key: "afternoon", hour: 14, icon: <CloudSun size={14} /> },
  { key: "evening", hour: 19, icon: <Moon size={14} /> },
];

/**
 * Unified booking modal: lets the student pick a tutor from a dropdown
 * (or "Pick one for me") then proceeds to payment in the same flow.
 */
const BookingFlowModal = ({ open, onClose, subject, courseLabel, teachers }: Props) => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(AUTO_VALUE);
  const [notes, setNotes] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<DaySlot[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sessionRequestId, setSessionRequestId] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("country")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setCountry((data?.country as string) ?? "EG"));
  }, [user]);

  useEffect(() => {
    if (!open) {
      setSelectedTeacherId(AUTO_VALUE);
      setNotes("");
      setSelectedSlots([]);
      setShowCheckout(false);
      setShowSuccess(false);
      setSessionRequestId(null);
    }
  }, [open]);

  const selectedTeacher = useMemo(
    () => teachers.find((t) => t.user_id === selectedTeacherId) || null,
    [teachers, selectedTeacherId]
  );

  // Resolve the price: chosen teacher's price, or the cheapest available as
  // an indicative price for the "Pick one for me" option.
  const cheapestPrice = useMemo(() => {
    const prices = teachers.map((t) => t.price || 0).filter((p) => p > 0);
    return prices.length ? Math.min(...prices) : 0;
  }, [teachers]);

  const effectivePrice =
    selectedTeacherId === AUTO_VALUE ? cheapestPrice : selectedTeacher?.price || 0;

  const teacherDisplayName = (tc: TeacherData) =>
    lang === "ar" ? tc.full_name : tc.full_name_en || tc.full_name;

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
      toast.error(lang === "ar" ? "يجب تسجيل الدخول أولاً" : "Please sign in first");
      navigate("/login");
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

    setSubmitting(true);
    try {
      const noteParts: string[] = [];
      if (courseLabel) {
        noteParts.push(
          lang === "ar"
            ? `المادة الأصلية: ${courseLabel}`
            : `Original course: ${courseLabel}`
        );
      }
      if (selectedTeacherId === AUTO_VALUE) {
        noteParts.push(
          lang === "ar"
            ? "الطالب اختار: اختر لي مدرس مناسب"
            : "Student chose: assign me a tutor"
        );
      }
      if (selectedSlots.length > 0) {
        noteParts.push(
          `${t("preferred_slots_label")}: ${selectedSlots.map((s) => formatSlot(s.day, s.slot)).join(", ")}`
        );
      }
      if (notes.trim()) noteParts.push(notes.trim());

      const teacherId = selectedTeacherId === AUTO_VALUE ? null : selectedTeacherId;

      const { data, error } = await supabase
        .from("session_requests")
        .insert({
          student_id: user.id,
          teacher_id: teacherId,
          subject: subject || null,
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          notes: noteParts.join(" — ") || null,
          status: effectivePrice > 0 ? "pending_payment" : "pending",
        })
        .select("id")
        .single();

      if (error) throw error;

      if (effectivePrice > 0) {
        setSessionRequestId(data.id);
        setShowCheckout(true);
      } else {
        // Free flow: show the same success screen the paid flow shows after payment
        setSessionRequestId(data.id);
        setShowSuccess(true);
      }
    } catch (e: any) {
      toast.error((lang === "ar" ? "خطأ: " : "Error: ") + e.message);
    }
    setSubmitting(false);
  };

  const amountInCents = effectivePrice ? Math.round(effectivePrice * 100) : 0;

  const headerTeacherName =
    selectedTeacher ? teacherDisplayName(selectedTeacher)
      : lang === "ar" ? "مدرس متخصص" : "A specialized tutor";

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto my-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shadow-lg shrink-0">
                  <Calendar size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-extrabold text-foreground leading-tight truncate">
                    {lang === "ar" ? "حجز حصة" : "Book a session"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {subject}
                    {courseLabel && courseLabel !== subject && (
                      <span> • {courseLabel}</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors shrink-0"
                aria-label="close"
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
                    {lang === "ar" ? "تم حجز المحاضرة بنجاح ✅" : "Lecture booked successfully ✅"}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed px-2">
                    {lang === "ar"
                      ? "تم حجز المحاضرة وستصلك رسالة بالتفاصيل ورابط المحاضرة فور تأكيد الإدارة وتعيين المدرس المناسب."
                      : "Your lecture is booked. You'll receive an email with the details and the meeting link as soon as the admin confirms and assigns a tutor."}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-secondary/60 rounded-xl py-2.5 px-3">
                  <Mail size={14} className="text-primary" />
                  {lang === "ar"
                    ? "راجع بريدك الإلكتروني خلال الساعات القادمة"
                    : "Check your email in the next few hours"}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { onClose(); navigate("/my-bookings"); }}
                    className="btn-primary flex-1 text-sm"
                  >
                    {lang === "ar" ? "حجوزاتي" : "My bookings"}
                  </button>
                  <button onClick={onClose} className="btn-outline flex-1 text-sm">
                    {lang === "ar" ? "إغلاق" : "Close"}
                  </button>
                </div>
              </div>
            ) : showCheckout && sessionRequestId ? (
              <StripeEmbeddedCheckout
                country={country}
                teacherName={headerTeacherName}
                subject={subject}
                customerEmail={user?.email || undefined}
                userId={user?.id}
                returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`}
              />
            ) : (
              <div className="space-y-5">
                {/* Teacher dropdown */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <GraduationCap size={12} />
                    {lang === "ar" ? "اختر المدرس" : "Choose tutor"}
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="input-base w-full"
                  >
                    <option value={AUTO_VALUE}>
                      ✨ {lang === "ar"
                        ? "اختر لي مدرس مناسب (نخصص لك الأنسب)"
                        : "Pick a tutor for me (we'll match the best)"}
                    </option>
                    {teachers.length > 0 && (
                      <optgroup
                        label={
                          lang === "ar"
                            ? `المدرسون المتخصصون (${teachers.length})`
                            : `Specialist tutors (${teachers.length})`
                        }
                      >
                        {teachers.map((tc) => (
                          <option key={tc.user_id} value={tc.user_id}>
                            {teacherDisplayName(tc)}
                            {tc.verified ? " ✓" : ""}
                            {tc.price ? ` — $${tc.price}` : ""}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  {selectedTeacher && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      {selectedTeacher.verified && (
                        <span className="inline-flex items-center gap-1 text-success font-bold">
                          <BadgeCheck size={12} /> {lang === "ar" ? "موثّق" : "Verified"}
                        </span>
                      )}
                      {selectedTeacher.university && (
                        <span className="truncate">• {selectedTeacher.university}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Subject (read-only chip) */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <BookOpen size={16} className="text-primary shrink-0" />
                  <div className="text-sm min-w-0">
                    <span className="text-muted-foreground">
                      {lang === "ar" ? "المادة:" : "Subject:"}{" "}
                    </span>
                    <span className="font-bold text-foreground">{subject}</span>
                  </div>
                </div>

                {/* Preferred time grid */}
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
                          <div className="inline-flex items-center justify-center gap-1">
                            {s.icon}
                            {slotLabels[s.key].label}
                          </div>
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
                                className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors ${
                                  selected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background"
                                }`}
                              >
                                {selected && <CheckCircle2 size={16} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <MessageSquare size={12} />
                    {lang === "ar" ? "ملاحظات (اختياري)" : "Notes (optional)"}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      lang === "ar"
                        ? "اذكر أي ملاحظة إضافية..."
                        : "Mention any additional notes..."
                    }
                    className="input-base w-full resize-none"
                  />
                </div>

                {/* Price summary */}
                {effectivePrice > 0 && (
                  <div className="flex items-center justify-between gap-2 bg-primary text-primary-foreground rounded-xl p-3 shadow-md">
                    <span className="inline-flex items-center gap-2 text-sm font-bold">
                      <CreditCard size={16} />
                      {lang === "ar" ? "سعر الحصة" : "Session price"}
                      {selectedTeacherId === AUTO_VALUE && (
                        <span className="text-xs opacity-80 font-medium">
                          {lang === "ar" ? "(يبدأ من)" : "(starts from)"}
                        </span>
                      )}
                    </span>
                    <span className="text-lg font-black">${effectivePrice}</span>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSubmit}
                  disabled={submitting || selectedSlots.length === 0}
                  className="w-full text-base font-extrabold bg-primary text-primary-foreground px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:bg-primary-dark hover:shadow-[0_8px_24px_hsl(14_91%_49%/0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {submitting
                    ? lang === "ar" ? "جاري الإرسال..." : "Sending..."
                    : effectivePrice > 0
                      ? lang === "ar" ? "تابع للدفع" : "Continue to payment"
                      : lang === "ar" ? "تأكيد الحجز" : "Confirm booking"}
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

export default BookingFlowModal;
