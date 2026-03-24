import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Loader2, Calendar, Clock, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  teacherId: string;
  teacherName: string;
  subjects: string[];
}

const BookSessionModal = ({ open, onClose, teacherId, teacherName, subjects }: Props) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: subjects[0] || "", date: "", time: "", notes: "" });

  useEffect(() => {
    if (!open) return;
    setForm({ subject: subjects[0] || "", date: "", time: "", notes: "" });
  }, [open]);

  const handleSubmit = async () => {
    if (!user) { toast.error(t("login_required")); return; }
    if (!form.date || !form.time) { toast.error(t("select_date_time")); return; }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("session_requests").insert({
        student_id: user.id,
        teacher_id: teacherId,
        subject: form.subject || null,
        preferred_date: form.date,
        preferred_time: form.time,
        notes: form.notes || null,
        status: "pending",
      });

      if (error) throw error;

      toast.success(t("booking_success"));
      onClose();
    } catch (e: any) {
      toast.error("Error: " + e.message);
    }
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card rounded-2xl p-6 w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold">{t("book_with")} {teacherName}</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-accent/50 border border-accent rounded-xl p-3">
                <p className="text-xs text-muted-foreground">
                  💡 {t("custom_note")}
                </p>
              </div>

              {subjects.length > 0 && (
                <div>
                  <label className="block text-sm font-bold mb-1.5 flex items-center gap-1"><BookOpen size={14} /> {t("the_subject")}</label>
                  <select value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="input-base">
                    {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-1.5 flex items-center gap-1"><Calendar size={14} /> {t("the_date")}</label>
                <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5 flex items-center gap-1"><Clock size={14} /> {t("the_time")}</label>
                <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="input-base" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">{t("notes_optional")}</label>
                <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2} className="input-base resize-none" />
              </div>

              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleSubmit}
                disabled={submitting || !form.date || !form.time}
                className="btn-primary w-full text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
                {submitting ? t("sending") : t("confirm_booking_btn")}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookSessionModal;
