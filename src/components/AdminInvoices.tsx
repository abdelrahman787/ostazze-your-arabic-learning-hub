import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CreditCard, Search, Download, FileText, TrendingUp, DollarSign, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  amount_paid: number | null;
  payment_id: string | null;
  payment_provider: string | null;
  status: string;
  enrolled_at: string;
  created_at: string;
  student_name?: string;
  course_title?: string;
}

interface SessionRow {
  id: string;
  student_id: string;
  teacher_id: string | null;
  subject: string | null;
  preferred_date: string | null;
  status: string;
  created_at: string;
  student_name?: string;
  teacher_name?: string;
  amount?: number;
}

const statusColor: Record<string, string> = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-muted text-muted-foreground",
  refunded: "bg-destructive/10 text-destructive",
};

const statusLabel: Record<string, string> = {
  active: "مدفوع ✓",
  pending: "قيد الانتظار",
  cancelled: "ملغي",
  refunded: "مسترد",
};

const AdminInvoices = () => {
  const [tab, setTab] = useState<"invoices" | "reports">("invoices");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [generating, setGenerating] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Enrollments + course/student info
      const { data: enr } = await supabase
        .from("course_enrollments")
        .select("*")
        .order("created_at", { ascending: false });

      if (enr && enr.length > 0) {
        const studentIds = [...new Set(enr.map((e) => e.student_id))];
        const courseIds = [...new Set(enr.map((e) => e.course_id))];
        const [{ data: profiles }, { data: courses }] = await Promise.all([
          supabase.from("profiles").select("user_id, full_name").in("user_id", studentIds),
          supabase.from("courses").select("id, title, price").in("id", courseIds),
        ]);
        const pMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
        const cMap = new Map(courses?.map((c) => [c.id, c]) || []);
        setEnrollments(
          enr.map((e: any) => ({
            ...e,
            student_name: pMap.get(e.student_id) || "—",
            course_title: cMap.get(e.course_id)?.title || "—",
            amount_paid: e.amount_paid ?? cMap.get(e.course_id)?.price ?? 0,
          }))
        );
      } else {
        setEnrollments([]);
      }

      // Session requests for revenue reports
      const { data: sr } = await supabase
        .from("session_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (sr && sr.length > 0) {
        const allIds = [...new Set(sr.flatMap((r: any) => [r.student_id, r.teacher_id].filter(Boolean)))];
        const teacherIds = [...new Set(sr.map((r: any) => r.teacher_id).filter(Boolean))];
        const [{ data: profiles }, { data: tps }] = await Promise.all([
          supabase.from("profiles").select("user_id, full_name").in("user_id", allIds),
          teacherIds.length > 0
            ? supabase.from("teacher_profiles").select("user_id, price").in("user_id", teacherIds)
            : Promise.resolve({ data: [] as any[] }),
        ]);
        const pMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
        const priceMap = new Map((tps || []).map((t: any) => [t.user_id, Number(t.price) || 0]));
        setSessions(
          sr.map((r: any) => ({
            ...r,
            student_name: pMap.get(r.student_id) || "—",
            teacher_name: r.teacher_id ? pMap.get(r.teacher_id) || "—" : null,
            amount: r.teacher_id ? priceMap.get(r.teacher_id) || 0 : 0,
          }))
        );
      } else {
        setSessions([]);
      }
    } catch (err: any) {
      toast.error("خطأ في تحميل البيانات: " + err.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    return enrollments.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          e.student_name?.toLowerCase().includes(q) ||
          e.course_title?.toLowerCase().includes(q) ||
          e.payment_id?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enrollments, search, statusFilter]);

  const stats = useMemo(() => {
    const paid = enrollments.filter((e) => e.status === "active");
    const totalRev = paid.reduce((sum, e) => sum + (Number(e.amount_paid) || 0), 0);
    const sessionRev = sessions.filter((s) => s.status === "completed" || s.status === "confirmed")
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    return {
      totalInvoices: enrollments.length,
      paidInvoices: paid.length,
      totalRevenue: totalRev + sessionRev,
      pendingCount: enrollments.filter((e) => e.status === "pending").length,
    };
  }, [enrollments, sessions]);

  // ---- PDF report generation ----
  const generateInvoicesReport = () => {
    setGenerating(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("OSTAZZE - Invoices Report", 14, 18);
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(`Generated: ${new Date().toLocaleString("en-US")}`, 14, 25);
      doc.text(`Total Invoices: ${stats.totalInvoices}  |  Paid: ${stats.paidInvoices}  |  Revenue: ${stats.totalRevenue.toFixed(2)} SAR`, 14, 31);

      autoTable(doc, {
        startY: 38,
        head: [["#", "Date", "Student", "Course", "Amount", "Status", "Payment ID"]],
        body: filtered.map((e, i) => [
          String(i + 1),
          new Date(e.created_at).toLocaleDateString("en-US"),
          e.student_name || "-",
          (e.course_title || "-").slice(0, 30),
          `${Number(e.amount_paid || 0).toFixed(2)} SAR`,
          (statusLabel[e.status] || e.status).replace(/[^\w\s]/g, ""),
          (e.payment_id || "-").slice(0, 20),
        ]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [232, 78, 15], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });

      doc.save(`ostazze-invoices-${Date.now()}.pdf`);
      toast.success("تم تنزيل التقرير ✓");
    } catch (err: any) {
      toast.error("خطأ: " + err.message);
    }
    setGenerating(false);
  };

  const generateSalesReport = () => {
    setGenerating(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("OSTAZZE - Sales Report", 14, 18);
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(`Generated: ${new Date().toLocaleString("en-US")}`, 14, 25);

      // Summary stats
      const sessionsCompleted = sessions.filter((s) => s.status === "completed").length;
      const sessionsConfirmed = sessions.filter((s) => s.status === "confirmed").length;
      const sessionRev = sessions.filter((s) => s.status === "completed" || s.status === "confirmed")
        .reduce((sum, s) => sum + (s.amount || 0), 0);

      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.text("Summary", 14, 38);
      doc.setFontSize(9);
      doc.text(`Total Sessions: ${sessions.length}`, 14, 45);
      doc.text(`Confirmed: ${sessionsConfirmed}  |  Completed: ${sessionsCompleted}`, 14, 51);
      doc.text(`Course Revenue: ${enrollments.filter((e) => e.status === "active").reduce((s, e) => s + Number(e.amount_paid || 0), 0).toFixed(2)} SAR`, 14, 57);
      doc.text(`Session Revenue: ${sessionRev.toFixed(2)} SAR`, 14, 63);
      doc.text(`Total Revenue: ${stats.totalRevenue.toFixed(2)} SAR`, 14, 69);

      autoTable(doc, {
        startY: 78,
        head: [["#", "Date", "Student", "Teacher", "Subject", "Amount", "Status"]],
        body: sessions.map((s, i) => [
          String(i + 1),
          new Date(s.created_at).toLocaleDateString("en-US"),
          s.student_name || "-",
          s.teacher_name || "-",
          (s.subject || "-").slice(0, 20),
          `${(s.amount || 0).toFixed(2)} SAR`,
          s.status,
        ]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [27, 42, 74], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });

      doc.save(`ostazze-sales-${Date.now()}.pdf`);
      toast.success("تم تنزيل التقرير ✓");
    } catch (err: any) {
      toast.error("خطأ: " + err.message);
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الفواتير", value: String(stats.totalInvoices), icon: FileText, color: "bg-primary/10 text-primary" },
          { label: "مدفوعة", value: String(stats.paidInvoices), icon: CreditCard, color: "bg-success/10 text-success" },
          { label: "قيد الانتظار", value: String(stats.pendingCount), icon: RefreshCw, color: "bg-warning/10 text-warning" },
          { label: "إجمالي الإيرادات", value: `${stats.totalRevenue.toFixed(0)} ر.س`, icon: DollarSign, color: "bg-accent text-accent-foreground" },
        ].map((s) => (
          <div key={s.label} className="card-base p-5">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.15, rotate: 10 }} className={`icon-box ${s.color}`}>
                <s.icon size={20} />
              </motion.div>
              <div>
                <div className="text-xl font-black">{s.value}</div>
                <div className="text-muted-foreground text-xs">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab("invoices")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${tab === "invoices" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <CreditCard size={14} className="inline ml-1" /> فواتير الدفع
        </button>
        <button
          onClick={() => setTab("reports")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${tab === "reports" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <TrendingUp size={14} className="inline ml-1" /> التقارير
        </button>
      </div>

      {tab === "invoices" && (
        <>
          {/* Filters */}
          <div className="card-base p-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم الطالب، الكورس، أو رقم الدفع..."
                className="input-base !pr-10 !py-2.5 text-sm"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-base !py-2.5 text-sm !w-auto min-w-[140px]">
              <option value="all">كل الحالات</option>
              <option value="active">مدفوع</option>
              <option value="pending">قيد الانتظار</option>
              <option value="cancelled">ملغي</option>
              <option value="refunded">مسترد</option>
            </select>
            <button onClick={fetchData} className="btn-outline !py-2.5 text-sm flex items-center gap-2">
              <RefreshCw size={14} /> تحديث
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={generateInvoicesReport}
              disabled={generating || filtered.length === 0}
              className="btn-primary !py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {generating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              تنزيل PDF
            </motion.button>
          </div>

          {/* Invoices table */}
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg">قائمة الفواتير</h3>
              <span className="text-xs text-muted-foreground">{filtered.length} / {enrollments.length}</span>
            </div>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : filtered.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">لا توجد فواتير</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground text-xs">
                      <th className="text-right py-3 px-2">التاريخ</th>
                      <th className="text-right py-3 px-2">الطالب</th>
                      <th className="text-right py-3 px-2">الكورس</th>
                      <th className="text-right py-3 px-2">المبلغ</th>
                      <th className="text-right py-3 px-2">طريقة الدفع</th>
                      <th className="text-right py-3 px-2">رقم الدفع</th>
                      <th className="text-right py-3 px-2">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => (
                      <tr key={e.id} className="border-b last:border-0 hover:bg-secondary/50">
                        <td className="py-3 px-2 whitespace-nowrap text-xs">{new Date(e.created_at).toLocaleDateString("ar-EG")}</td>
                        <td className="py-3 px-2 font-medium">{e.student_name}</td>
                        <td className="py-3 px-2">{e.course_title}</td>
                        <td className="py-3 px-2 font-bold text-primary whitespace-nowrap">{Number(e.amount_paid || 0).toFixed(2)} ر.س</td>
                        <td className="py-3 px-2 text-xs text-muted-foreground">{e.payment_provider || "—"}</td>
                        <td className="py-3 px-2 text-xs font-mono text-muted-foreground">{e.payment_id ? e.payment_id.slice(0, 12) + "..." : "—"}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusColor[e.status] || "bg-muted text-muted-foreground"}`}>
                            {statusLabel[e.status] || e.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "reports" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-base p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="icon-box bg-primary/10 text-primary"><FileText size={24} /></div>
              <div>
                <h3 className="font-extrabold text-lg mb-1">تقرير الفواتير</h3>
                <p className="text-sm text-muted-foreground">قائمة كاملة بكل عمليات الدفع، المبالغ، والحالات.</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mb-4">
              يحتوي على {enrollments.length} فاتورة • إجمالي {stats.totalRevenue.toFixed(0)} ر.س
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={generateInvoicesReport} disabled={generating}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              تنزيل تقرير الفواتير (PDF)
            </motion.button>
          </div>

          <div className="card-base p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="icon-box bg-accent text-accent-foreground"><TrendingUp size={24} /></div>
              <div>
                <h3 className="font-extrabold text-lg mb-1">تقرير المبيعات</h3>
                <p className="text-sm text-muted-foreground">تقرير شامل عن الجلسات والإيرادات بكل التفاصيل.</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mb-4">
              يحتوي على {sessions.length} جلسة • {sessions.filter((s) => s.status === "completed").length} مكتملة
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={generateSalesReport} disabled={generating}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              تنزيل تقرير المبيعات (PDF)
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;
