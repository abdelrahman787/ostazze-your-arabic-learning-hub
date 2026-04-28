import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  X, Loader2, Sparkles, Calendar, Clock, BookOpen, MessageSquare,
  GraduationCap, BadgeCheck, CreditCard, CheckCircle2, Mail,
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

/**
 * Unified booking modal: lets the student pick a tutor from a dropdown
 * (or "Pick one for me") then proceeds to payment in the same flow.
 */
const BookingFlowModal = ({ open, onClose, subject, courseLabel, teachers }: Props) => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(AUTO_VALUE);
  const [form, setForm] = useState({ date: "", time: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sessionRequestId, setSessionRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedTeacherId(AUTO_VALUE);
      setForm({ date: "", time: "", notes: "" });
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

  const handleSubmit = async () => {
    if (!user) {
      toast.error(lang === "ar" ? "يجب تسجيل الدخول أولاً" : "Please sign in first");
      navigate("/login");
      return;
    }
    if (!form.date || !form.time) {
      toast.error(lang === "ar" ? "اختر التاريخ والوقت المفضل" : "Pick a preferred date & time");
      return;
    }

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
      if (form.notes.trim()) noteParts.push(form.notes.trim());

      const teacherId = selectedTeacherId === AUTO_VALUE ? null : selectedTeacherId;

      const { data, error } = await supabase
        .from("session_requests")
        .insert({
          student_id: user.id,
          teacher_id: teacherId,
          subject: subject || null,
          preferred_date: form.date,
          preferred_time: form.time,
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

  const todayISO = new Date().toISOString().split("T")[0];
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
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto my-auto relative"
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

            {showCheckout && sessionRequestId ? (
              <StripeEmbeddedCheckout
                amountInCents={amountInCents}
                teacherName={headerTeacherName}
                subject={subject}
                customerEmail={user?.email || undefined}
                userId={user?.id}
                returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`}
              />
            ) : (
              <div className="space-y-4">
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

                {/* Date */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Calendar size={12} />
                    {lang === "ar" ? "التاريخ المفضل" : "Preferred date"}
                  </label>
                  <input
                    type="date"
                    min={todayISO}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="input-base w-full"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Clock size={12} />
                    {lang === "ar" ? "الوقت المفضل" : "Preferred time"}
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="input-base w-full"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <MessageSquare size={12} />
                    {lang === "ar" ? "ملاحظات (اختياري)" : "Notes (optional)"}
                  </label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder={
                      lang === "ar"
                        ? "اذكر مستواك أو الموضوع المحدد..."
                        : "Mention your level or specific topic..."
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
                  disabled={submitting || !form.date || !form.time}
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
