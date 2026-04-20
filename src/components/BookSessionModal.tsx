import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Loader2, Calendar, Clock, BookOpen, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";

interface Props {
  open: boolean;
  onClose: () => void;
  teacherId: string;
  teacherName: string;
  subjects: string[];
  price?: number;
}

const BookSessionModal = ({ open, onClose, teacherId, teacherName, subjects, price }: Props) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: subjects[0] || "", date: "", time: "", notes: "" });
  const [showCheckout, setShowCheckout] = useState(false);
  const [sessionRequestId, setSessionRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setForm({ subject: subjects[0] || "", date: "", time: "", notes: "" });
      setShowCheckout(false);
      setSessionRequestId(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!user) { toast.error(t("login_required")); return; }
    if (!form.date || !form.time) { toast.error(t("select_date_time")); return; }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.from("session_requests").insert({
        student_id: user.id,
        teacher_id: teacherId,
        subject: form.subject || null,
        preferred_date: form.date,
        preferred_time: form.time,
        notes: form.notes || null,
        status: price ? "pending_payment" : "pending",
      }).select("id").single();

      if (error) throw error;

      if (price && price > 0) {
        setSessionRequestId(data.id);
        setShowCheckout(true);
      } else {
        toast.success(t("booking_success"));
        onClose();
      }
    } catch (e: any) {
      toast.error("Error: " + e.message);
    }
    setSubmitting(false);
  };

  const amountInCents = price ? Math.round(price * 100) : 0;

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto my-auto relative" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-foreground">{t("book_with")} {teacherName}</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors">
                <X size={16} />
              </button>
            </div>

            {showCheckout ? (
              <StripeEmbeddedCheckout
                amountInCents={amountInCents}
                teacherName={teacherName}
                subject={form.subject}
                customerEmail={user?.email || undefined}
                userId={user?.id}
                returnUrl={`${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`}
              />
            ) : (
              <div className="space-y-4">
                <div className="bg-secondary border border-border rounded-xl p-3">
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    💡 {t("custom_note")}
                  </p>
                </div>

                {price && price > 0 && (
                  <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-xl p-3 shadow-md">
                    <CreditCard size={18} />
                    <span className="text-sm font-extrabold">{t("session_price_label")}: ${price}</span>
                  </div>
                )}

                {subjects.length > 0 && (
                  <div>
                    <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5 text-foreground"><BookOpen size={14} className="text-primary" /> {t("the_subject")}</label>
                    <select value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="input-base">
                      {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5 text-foreground"><Calendar size={14} className="text-primary" /> {t("the_date")}</label>
                  <input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="input-base" />
                </div>
                <div>
                  <label className="text-sm font-bold mb-1.5 flex items-center gap-1.5 text-foreground"><Clock size={14} className="text-primary" /> {t("the_time")}</label>
                  <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="input-base" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5 text-foreground">{t("notes_optional")}</label>
                  <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={2} className="input-base resize-none" />
                </div>

                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleSubmit}
                  disabled={submitting || !form.date || !form.time}
                  className="w-full text-base font-extrabold bg-primary text-primary-foreground px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:bg-primary-dark hover:shadow-[0_8px_24px_hsl(14_91%_49%/0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none">
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
                  {submitting ? t("sending") : (price ? t("proceed_to_payment") : t("confirm_booking_btn"))}
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
