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
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", allIds);
      const pMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
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
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", ids);
      setTeachers(profiles || []);
    }
  }, []);

  useEffect(() => { fetchRequests(); fetchTeachers(); }, [fetchRequests, fetchTeachers]);

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
    assigned: "bg-primary/10 text-primary",
    confirmed: "bg-success/10 text-success",
    rejected: "bg-destructive/10 text-destructive",
    cancelled: "bg-muted text-muted-foreground",
    completed: "bg-success/10 text-success",
  };

  const statusLabel: Record<string, string> = {
    pending: "قيد الانتظار",
    pending_payment: "بانتظار الدفع",
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
    pending: requests.filter((r) => r.status === "pending" || r.status === "pending_payment").length,
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

      {/* Requests table */}
      <div className="card-base p-6">
        <h3 className="font-extrabold text-lg mb-4">{t("sales_requests")}</h3>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={24} /></div>
        ) : requests.length === 0 ? (
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
                {requests.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-secondary/50">
                    <td className="py-3 px-2 font-medium">{r.student_name}</td>
                    <td className="py-3 px-2">{r.subject || "—"}</td>
                    <td className="py-3 px-2">{r.preferred_date || "—"} {r.preferred_time?.slice(0, 5)}</td>
                    <td className="py-3 px-2">{r.teacher_name || "—"}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[r.status] || "bg-muted text-muted-foreground"}`}>
                        {t((`bstatus_${r.status}` as any)) || r.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {r.status === "pending" && (
                        <button onClick={() => { setAssigningId(r.id); setAssignTeacherId(""); setAssignZoom(""); }}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                          <Users size={12} /> {t("sales_assign")}
                        </button>
                      )}
                      {r.zoom_url && (
                        <a href={r.zoom_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                          <Video size={12} /> Zoom
                        </a>
                      )}
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
