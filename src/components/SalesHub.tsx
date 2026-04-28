import { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ShoppingBag, Clock, CheckCircle, Users, UserCheck, Video, CreditCard, XCircle, Search, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface SessionRequest {
  id: string;
  student_id: string;
  teacher_id: string | null;
  subject: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  status: string;
  zoom_url: string | null;
  created_at: string;
  student_name?: string;
  teacher_name?: string;
}

interface TeacherOption {
  user_id: string;
  full_name: string | null;
}

const SalesHub = () => {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQ, setSearchQ] = useState("");

  // Assignment modal
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [assignTeacherId, setAssignTeacherId] = useState("");
  const [assignZoom, setAssignZoom] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("session_requests").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Error loading requests: " + error.message);
      setLoading(false);
      return;
    }
    if (data && data.length > 0) {
      const allIds = [...new Set((data as any[]).flatMap((r: any) => [r.student_id, r.teacher_id].filter(Boolean)))];
      const { data: profiles } = await supabase.rpc("get_public_profiles", { _user_ids: allIds });
      const pMap = new Map((profiles || []).map((p: any) => [p.user_id, p.full_name]));
      setRequests((data as any[]).map((r: any) => ({
        ...r,
        student_name: pMap.get(r.student_id) || "—",
        teacher_name: r.teacher_id ? pMap.get(r.teacher_id) || "—" : null,
      })));
    } else {
      setRequests([]);
    }
    setLoading(false);
  }, []);

  const fetchTeachers = useCallback(async () => {
    const { data: tps } = await supabase.from("teacher_profiles").select("user_id");
    if (tps && tps.length > 0) {
      const ids = tps.map((t) => t.user_id);
      const { data: profiles } = await supabase.rpc("get_public_profiles", { _user_ids: ids });
      setTeachers((profiles || []).map((p: any) => ({ user_id: p.user_id, full_name: p.full_name })));
    }
  }, []);

  useEffect(() => { fetchRequests(); fetchTeachers(); }, [fetchRequests, fetchTeachers]);

  // Realtime: refresh on any change to session_requests
  useEffect(() => {
    const channel = supabase
      .channel("admin-session-requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "session_requests" }, () => {
        fetchRequests();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchRequests]);

  const handleAssign = async () => {
    if (!assigningId || !assignTeacherId) return;
    setAssigning(true);
    try {
      const { error } = await supabase.from("session_requests").update({
        teacher_id: assignTeacherId,
        zoom_url: assignZoom || null,
        status: "assigned",
      }).eq("id", assigningId);
      if (error) throw error;
      toast.success(t("sales_assigned"));
      setAssigningId(null);
      setAssignTeacherId("");
      setAssignZoom("");
      fetchRequests();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
    setAssigning(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase.from("session_requests").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      toast.success("تم التحديث");
      fetchRequests();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
    setUpdatingId(null);
  };

  const statusColor: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    pending_payment: "bg-warning/10 text-warning",
    paid_awaiting_assignment: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    assigned: "bg-primary/10 text-primary",
    confirmed: "bg-success/10 text-success",
    rejected: "bg-destructive/10 text-destructive",
    cancelled: "bg-muted text-muted-foreground",
    completed: "bg-success/10 text-success",
  };

  const statusLabel: Record<string, string> = {
    pending: "قيد الانتظار",
    pending_payment: "بانتظار الدفع",
    paid_awaiting_assignment: "💰 مدفوع — بانتظار تعيين مدرس",
    assigned: "تم التعيين",
    confirmed: "مؤكد",
    rejected: "مرفوض",
    cancelled: "ملغي",
    completed: "مكتمل",
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (searchQ) {
        const q = searchQ.toLowerCase();
        return (
          r.student_name?.toLowerCase().includes(q) ||
          r.teacher_name?.toLowerCase().includes(q) ||
          r.subject?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requests, statusFilter, searchQ]);

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending" || r.status === "pending_payment" || r.status === "paid_awaiting_assignment").length,
    assigned: requests.filter((r) => r.status === "assigned" || r.status === "confirmed").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("sales_total_requests"), value: String(stats.total), icon: ShoppingBag, color: "bg-primary/10 text-primary" },
          { label: t("sales_pending_requests"), value: String(stats.pending), icon: Clock, color: "bg-warning/10 text-warning" },
          { label: t("sales_assigned_requests"), value: String(stats.assigned), icon: UserCheck, color: "bg-accent text-accent-foreground" },
          { label: t("sales_completed_requests"), value: String(stats.completed), icon: CheckCircle, color: "bg-success/10 text-success" },
        ].map((s) => (
          <div key={s.label} className="card-base p-5">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.15, rotate: 10 }} className={`icon-box ${s.color}`}><s.icon size={20} /></motion.div>
              <div><div className="text-xl font-black">{s.value}</div><div className="text-muted-foreground text-xs">{s.label}</div></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="card-base p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="ابحث باسم الطالب، المعلم، أو المادة..."
            className="input-base !pr-10 !py-2.5 text-sm"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-base !py-2.5 text-sm !w-auto min-w-[160px]">
          <option value="all">كل الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="pending_payment">بانتظار الدفع</option>
          <option value="assigned">تم التعيين</option>
          <option value="confirmed">مؤكد</option>
          <option value="completed">مكتمل</option>
          <option value="rejected">مرفوض</option>
          <option value="cancelled">ملغي</option>
        </select>
        <button onClick={fetchRequests} className="btn-outline !py-2.5 text-sm flex items-center gap-2" title="تحديث">
          <RefreshCw size={14} /> تحديث
        </button>
      </div>

      {/* Requests table */}
      <div className="card-base p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-lg">{t("sales_requests")}</h3>
          <span className="text-xs text-muted-foreground">{filteredRequests.length} / {requests.length}</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={24} /></div>
        ) : filteredRequests.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-6">{t("sales_no_requests")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-xs">
                  <th className="text-right py-3 px-2">{t("th_student")}</th>
                  <th className="text-right py-3 px-2">{t("th_subject")}</th>
                  <th className="text-right py-3 px-2">{t("th_date")}</th>
                  <th className="text-right py-3 px-2">{t("th_teacher")}</th>
                  <th className="text-right py-3 px-2">{t("th_status")}</th>
                  <th className="text-right py-3 px-2">{t("th_actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-secondary/50">
                    <td className="py-3 px-2 font-medium">{r.student_name}</td>
                    <td className="py-3 px-2">{r.subject || "—"}</td>
                    <td className="py-3 px-2 whitespace-nowrap">{r.preferred_date || "—"} {r.preferred_time?.slice(0, 5)}</td>
                    <td className="py-3 px-2">{r.teacher_name || "—"}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusColor[r.status] || "bg-muted text-muted-foreground"}`}>
                        {statusLabel[r.status] || r.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {(r.status === "pending" || r.status === "pending_payment") && (
                          <button onClick={() => { setAssigningId(r.id); setAssignTeacherId(r.teacher_id || ""); setAssignZoom(r.zoom_url || ""); }}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            <Users size={12} /> {r.teacher_id ? "تعديل" : t("sales_assign")}
                          </button>
                        )}
                        {r.status === "assigned" && (
                          <button
                            disabled={updatingId === r.id}
                            onClick={() => handleStatusChange(r.id, "confirmed")}
                            className="text-xs font-bold text-success hover:underline flex items-center gap-1 disabled:opacity-50">
                            <CheckCircle size={12} /> تأكيد
                          </button>
                        )}
                        {(r.status === "assigned" || r.status === "confirmed") && (
                          <button
                            disabled={updatingId === r.id}
                            onClick={() => handleStatusChange(r.id, "completed")}
                            className="text-xs font-bold text-success hover:underline flex items-center gap-1 disabled:opacity-50">
                            <CheckCircle size={12} /> إنهاء
                          </button>
                        )}
                        {r.status !== "cancelled" && r.status !== "completed" && r.status !== "rejected" && (
                          <button
                            disabled={updatingId === r.id}
                            onClick={() => { if (confirm("هل تريد إلغاء الطلب؟")) handleStatusChange(r.id, "cancelled"); }}
                            className="text-xs font-bold text-destructive hover:underline flex items-center gap-1 disabled:opacity-50">
                            <XCircle size={12} /> إلغاء
                          </button>
                        )}
                        {r.zoom_url && (
                          <a href={r.zoom_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                            <Video size={12} /> Zoom
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {/* Assignment modal */}
      {assigningId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="font-extrabold text-lg mb-4">{t("sales_assign_teacher")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1.5">{t("sales_select_teacher")}</label>
                <select value={assignTeacherId} onChange={(e) => setAssignTeacherId(e.target.value)} className="input-base">
                  <option value="">—</option>
                  {teachers.map((tc) => (
                    <option key={tc.user_id} value={tc.user_id}>{tc.full_name || tc.user_id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">{t("sales_zoom_url")}</label>
                <input value={assignZoom} onChange={(e) => setAssignZoom(e.target.value)} placeholder="https://zoom.us/j/..." className="input-base" />
              </div>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleAssign} disabled={!assignTeacherId || assigning}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                  {assigning && <Loader2 size={16} className="animate-spin" />}
                  {t("sales_confirm_assign")}
                </motion.button>
                <button onClick={() => setAssigningId(null)} className="btn-outline flex-1">{t("action_cancel")}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SalesHub;
