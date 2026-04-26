import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Loader2, Sparkles, Calendar, Clock, BookOpen, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Subject coming from the URL (parent subject e.g. "رياضيات") */
  subject: string;
  /** Optional original course label, kept in notes for context */
  courseLabel?: string;
}

/**
 * Lets a student request a session WITHOUT picking a teacher.
 * The Sales Hub team will assign the most suitable available teacher.
 */
const AssignTeacherModal = ({ open, onClose, subject, courseLabel }: Props) => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", notes: "" });

  useEffect(() => {
    if (!open) setForm({ date: "", time: "", notes: "" });
  }, [open]);

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
      if (form.notes.trim()) noteParts.push(form.notes.trim());

      const { error } = await supabase.from("session_requests").insert({
        student_id: user.id,
        teacher_id: null, // Sales Hub will assign
        subject: subject || null,
        preferred_date: form.date,
        preferred_time: form.time,
        notes: noteParts.join(" — ") || null,
        status: "pending",
      });

      if (error) throw error;

      toast.success(
        lang === "ar"
          ? "تم إرسال طلبك ✅ سنخصص لك أنسب مدرس قريباً"
          : "Request submitted ✅ We'll assign the best tutor for you soon"
      );
      onClose();
    } catch (e: any) {
      toast.error((lang === "ar" ? "خطأ: " : "Error: ") + e.message);
    }
    setSubmitting(false);
  };

  const todayISO = new Date().toISOString().split("T")[0];

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
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shadow-lg">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-foreground leading-tight">
                    {lang === "ar" ? "اختر لي مدرس مناسب" : "Pick a tutor for me"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "ar"
                      ? "فريقنا سيخصص أنسب مدرس متاح"
                      : "Our team will assign the best available tutor"}
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

            {/* Subject pill */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 mb-5">
              <BookOpen size={16} className="text-primary shrink-0" />
              <div className="text-sm">
                <span className="text-muted-foreground">
                  {lang === "ar" ? "المادة:" : "Subject:"}{" "}
                </span>
                <span className="font-bold text-foreground">{subject}</span>
                {courseLabel && courseLabel !== subject && (
                  <span className="text-muted-foreground text-xs block mt-0.5">
                    {lang === "ar" ? "من مادة: " : "From course: "}
                    {courseLabel}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
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

              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <MessageSquare size={12} />
                  {lang === "ar" ? "ملاحظات (اختياري)" : "Notes (optional)"}
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder={
                    lang === "ar"
                      ? "اذكر مستواك أو الموضوع المحدد الذي تحتاج مساعدة فيه..."
                      : "Mention your level or the specific topic you need help with..."
                  }
                  className="input-base w-full resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={onClose}
                className="btn-outline flex-1"
                disabled={submitting}
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Sparkles size={16} />
                    {lang === "ar" ? "أرسل الطلب" : "Submit request"}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default AssignTeacherModal;
