import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Check, X, Loader2, Clock, BookOpen, AlertCircle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Booking {
  id: string;
  student_id: string;
  teacher_id: string;
  subject: string | null;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  notes: string | null;
  reject_reason: string | null;
  lecture_id: string | null;
  created_at: string;
  other_name?: string;
}

interface Props {
  role: "student" | "teacher";
}

const BookingManager = ({ role }: Props) => {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: t("bstatus_pending"), color: "bg-warning/10 text-warning" },
    confirmed: { label: t("bstatus_confirmed"), color: "bg-success/10 text-success" },
    rejected: { label: t("bstatus_rejected"), color: "bg-destructive/10 text-destructive" },
    cancelled: { label: t("bstatus_cancelled"), color: "bg-muted text-muted-foreground" },
    completed: { label: t("bstatus_completed"), color: "bg-primary/10 text-primary" },
  };

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    const col = role === "teacher" ? "teacher_id" : "student_id";
    const otherCol = role === "teacher" ? "student_id" : "teacher_id";
    
    let query = supabase.from("bookings").select("*").eq(col, user.id).order("scheduled_date", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter as Database["public"]["Enums"]["booking_status"]);
    
    const { data } = await query;
    if (data && data.length > 0) {
      const otherIds = [...new Set(data.map((b: any) => b[otherCol]))];
      const { data: profiles } = await supabase.rpc("get_public_profiles", { _user_ids: otherIds });
      const pMap = new Map((profiles || []).map((p: any) => [p.user_id, p.full_name]));
      setBookings(data.map((b: any) => ({ ...b, other_name: pMap.get(b[otherCol]) || "—" })));
    } else {
      setBookings([]);
    }
    setLoading(false);
  }, [user, role, filter]);

  useEffect(() => { setLoading(true); fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (id: string, status: string, reason?: string) => {
    setActionLoading(id);
    try {
      const updateData: any = { status };
      if (reason) updateData.reject_reason = reason;
      
      const { error } = await supabase.from("bookings").update(updateData).eq("id", id);
      if (error) throw error;

      if (status === "confirmed") {
        const booking = bookings.find((b) => b.id === id);
        if (booking) {
          const { data: lecture, error: lecErr } = await supabase.from("lectures").insert({
            title: `${t("session_label")} ${booking.subject || t("subject_word")}`,
            subject: booking.subject,
            student_id: booking.student_id,
            teacher_id: booking.teacher_id,
          }).select("id").single();
          
          if (!lecErr && lecture) {
            await supabase.from("bookings").update({ lecture_id: lecture.id }).eq("id", id);
          }
        }
      }

      toast.success(status === "confirmed" ? t("booking_accepted") : status === "rejected" ? t("booking_rejected") : t("booking_updated"));
      setRejectId(null);
      setRejectReason("");
      fetchBookings();
    } catch (e: any) {
      toast.error("Error: " + e.message);
    }
    setActionLoading(null);
  };

  const filters = [
    { value: "all", label: t("status_all") },
    { value: "pending", label: t("bstatus_pending") },
    { value: "confirmed", label: t("bstatus_confirmed") },
    { value: "completed", label: t("bstatus_completed") },
    { value: "rejected", label: t("bstatus_rejected") },
    { value: "cancelled", label: t("bstatus_cancelled") },
  ];

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === f.value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="card-base p-12 text-center">
          <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">{t("no_bookings")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="card-base p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {b.other_name?.charAt(0) || "؟"}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{b.other_name}</div>
                    <div className="text-muted-foreground text-xs">{role === "teacher" ? t("the_student") : t("the_teacher")}</div>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusMap[b.status]?.color || ""}`}>
                  {statusMap[b.status]?.label || b.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm mb-3">
                {b.subject && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen size={14} /> {b.subject}
                  </span>
                )}
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar size={14} /> {b.scheduled_date}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock size={14} /> {b.scheduled_time?.slice(0, 5)}
                </span>
              </div>

              {b.notes && <p className="text-muted-foreground text-xs bg-secondary rounded-lg p-2 mb-3">{b.notes}</p>}
              {b.reject_reason && (
                <p className="text-destructive text-xs bg-destructive/5 rounded-lg p-2 mb-3 flex items-center gap-1">
                  <AlertCircle size={12} /> {t("rejection_reason_label")} {b.reject_reason}
                </p>
              )}

              {b.status === "pending" && (
                <div className="flex gap-2 mt-2">
                  {role === "teacher" && (
                    <>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateStatus(b.id, "confirmed")}
                        disabled={actionLoading === b.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-success/10 text-success font-bold text-sm hover:bg-success/20 transition-colors">
                        {actionLoading === b.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {t("accept_btn")}
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setRejectId(b.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-destructive/10 text-destructive font-bold text-sm hover:bg-destructive/20 transition-colors">
                        <X size={14} /> {t("reject_btn")}
                      </motion.button>
                    </>
                  )}
                  {role === "student" && (
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateStatus(b.id, "cancelled")}
                      disabled={actionLoading === b.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-destructive/10 text-destructive font-bold text-sm hover:bg-destructive/20 transition-colors">
                      {actionLoading === b.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} {t("cancel_booking")}
                    </motion.button>
                  )}
                </div>
              )}

              {b.status === "confirmed" && b.lecture_id && (
                <a href={`/lectures/${b.lecture_id}`} className="btn-primary block text-center text-sm mt-2">
                  {t("enter_lecture")}
                </a>
              )}

              {rejectId === b.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-3 p-3 bg-destructive/5 rounded-xl space-y-2">
                  <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                    placeholder={t("reject_reason")} rows={2} className="input-base resize-none text-sm" />
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(b.id, "rejected", rejectReason)}
                      disabled={actionLoading === b.id}
                      className="flex-1 py-2 rounded-xl bg-destructive text-destructive-foreground font-bold text-sm">
                      {actionLoading === b.id ? t("processing") : t("confirm_reject")}
                    </button>
                    <button onClick={() => { setRejectId(null); setRejectReason(""); }}
                      className="px-4 py-2 rounded-xl bg-secondary text-sm font-bold">{t("action_cancel")}</button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManager;
