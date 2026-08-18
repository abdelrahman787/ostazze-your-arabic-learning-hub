import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { copyApplicantPhotoToAvatar } from "@/lib/avatarUpload";

import { toast } from "sonner";
import { Loader2, Search, UserPlus, Mail, Phone, ExternalLink, X, RefreshCw, Check, Copy, FileDown } from "lucide-react";
import { motion } from "framer-motion";

interface TutorApplication {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  nationality: string | null;
  country: string | null;
  city: string | null;
  specialization: string | null;
  university: string | null;
  degree: string | null;
  experience: string | null;
  teach_lang: string | null;
  courses: string | null;
  recorded_before: string | null;
  quiet_place: string | null;
  tools: string[] | null;
  device: string | null;
  microphone: string | null;
  cv_link: string | null;
  cv_file_path: string | null;
  demo_link: string | null;
  demo_file_path: string | null;
  photo_file_path: string | null;
  use_photo_as_avatar: boolean | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const STATUSES: Record<string, { label: string; cls: string }> = {
  new: { label: "جديد", cls: "bg-warning/10 text-warning" },
  reviewed: { label: "تمت المراجعة", cls: "bg-primary/10 text-primary" },
  accepted: { label: "مقبول", cls: "bg-success/10 text-success" },
  rejected: { label: "مرفوض", cls: "bg-destructive/10 text-destructive" },
};

const AdminTutorApplications = () => {
  const [apps, setApps] = useState<TutorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<TutorApplication | null>(null);
  const [approving, setApproving] = useState(false);
  const [tempPassword, setTempPassword] = useState<{ email: string; password: string } | null>(null);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tutor_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("خطأ في التحميل: " + error.message);
    setApps((data as TutorApplication[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-tutor-applications")
      .on("postgres_changes", { event: "*", schema: "public", table: "tutor_applications" }, () => fetchApps())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchApps]);

  const openCvFile = async (path: string) => {
    const { data, error } = await supabase.storage.from("tutor-cvs").createSignedUrl(path, 300);
    if (error || !data?.signedUrl) return toast.error("تعذر فتح الملف");
    window.open(data.signedUrl, "_blank", "noopener");
  };

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("tutor_applications").update({ status }).eq("id", id);
    if (error) return toast.error("خطأ: " + error.message);
    toast.success("تم التحديث");
    setApps((p) => p.map((a) => (a.id === id ? { ...a, status } : a)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  };

  const approveAsTeacher = async (a: TutorApplication) => {
    if (!confirm(`سيتم إنشاء حساب معلم للمتقدم ${a.full_name} (${a.email}). متابعة؟`)) return;
    setApproving(true);
    try {
      const password = `Ostaze#${Math.random().toString(36).slice(2, 10)}${Math.floor(Math.random() * 90 + 10)}`;
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("manage-roles", {
        body: {
          action: "approve_tutor",
          email: a.email,
          password,
          full_name: a.full_name,
          university: a.university || null,
          subjects: a.specialization ? [a.specialization] : [],
        },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.error) throw new Error(res.error.message);
      const result = res.data as { error?: string; created?: boolean; message?: string; user_id?: string };
      if (result?.error) throw new Error(result.error);

      // If the applicant uploaded a photo and allowed public use, set it as their avatar.
      if (result?.user_id && a.photo_file_path && a.use_photo_as_avatar) {
        try {
          const url = await copyApplicantPhotoToAvatar(a.photo_file_path, result.user_id);
          await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", result.user_id);
        } catch {
          toast.warning("تم إنشاء الحساب لكن تعذر نقل الصورة الشخصية");
        }
      }

      await setStatus(a.id, "accepted");
      toast.success(result?.message || "تمت الإضافة كمعلم");
      if (result?.created) setTempPassword({ email: a.email, password });

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطأ غير متوقع");
    }
    setApproving(false);
  };

  const filtered = useMemo(() => apps.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    return [a.full_name, a.email, a.phone, a.specialization, a.university, a.country]
      .some((v) => v?.toLowerCase().includes(s));
  }), [apps, q, statusFilter]);

  const stats = {
    total: apps.length,
    new: apps.filter((a) => a.status === "new").length,
    accepted: apps.filter((a) => a.status === "accepted").length,
  };

  const Row = ({ label, value }: { label: string; value?: string | null }) =>
    value ? (
      <div className="flex gap-2 text-sm py-1.5 border-b border-border/60">
        <span className="text-muted-foreground min-w-[130px]">{label}</span>
        <span className="font-medium break-all">{value}</span>
      </div>
    ) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "إجمالي الطلبات", value: stats.total, cls: "bg-primary/10 text-primary" },
          { label: "طلبات جديدة", value: stats.new, cls: "bg-warning/10 text-warning" },
          { label: "مقبولون", value: stats.accepted, cls: "bg-success/10 text-success" },
        ].map((s) => (
          <div key={s.label} className="card-base p-5 flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} className={`icon-box ${s.cls}`}><UserPlus size={20} /></motion.div>
            <div>
              <div className="text-xl font-black">{s.value}</div>
              <div className="text-muted-foreground text-xs">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-base p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاسم، البريد، التخصص..." className="input-base !pr-10 !py-2.5 text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-base !py-2.5 text-sm w-auto">
          <option value="all">كل الحالات</option>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button onClick={fetchApps} className="btn-ghost flex items-center gap-2 text-sm px-3 py-2.5">
          <RefreshCw size={16} /> تحديث
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : filtered.length === 0 ? (
        <div className="card-base p-12 text-center text-muted-foreground">لا توجد طلبات انضمام حتى الآن</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="card-base p-5 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="font-black">{a.full_name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {[a.specialization, a.university, a.country].filter(Boolean).join(" • ")}
                </div>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                  <a href={`mailto:${a.email}`} className="flex items-center gap-1 hover:text-primary"><Mail size={13} /> {a.email}</a>
                  <a href={`https://wa.me/${a.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary"><Phone size={13} /> {a.phone}</a>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUSES[a.status]?.cls || "bg-muted"}`}>
                {STATUSES[a.status]?.label || a.status}
              </span>
              <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString("ar-EG")}</div>
              <button onClick={() => setSelected(a)} className="btn-primary text-sm px-4 py-2">التفاصيل</button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setSelected(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
              <h3 className="font-black text-lg">{selected.full_name}</h3>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-1">
              <Row label="البريد" value={selected.email} />
              <Row label="واتساب" value={selected.phone} />
              <Row label="الجنسية" value={selected.nationality} />
              <Row label="الدولة" value={selected.country} />
              
              <Row label="التخصص" value={selected.specialization} />
              <Row label="الجامعة" value={selected.university} />
              <Row label="المؤهل" value={selected.degree} />
              <Row label="سنوات الخبرة" value={selected.experience} />
              <Row label="لغة التدريس" value={selected.teach_lang} />
              <Row label="المواد" value={selected.courses} />
              <Row label="سبق التسجيل" value={selected.recorded_before} />
              <Row label="مكان هادئ" value={selected.quiet_place} />
              <Row label="الأدوات" value={selected.tools?.join(", ")} />

              <Row label="استخدام صورته كصورة ملف شخصي" value={selected.photo_file_path ? (selected.use_photo_as_avatar ? "نعم" : "لا") : null} />
              <div className="flex flex-wrap gap-3 pt-4">
                {selected.cv_file_path && (
                  <button onClick={() => openCvFile(selected.cv_file_path!)} className="btn-ghost text-sm flex items-center gap-2 px-3 py-2">
                    <FileDown size={15} /> ملف السيرة الذاتية المرفوع
                  </button>
                )}
                {selected.cv_link && (
                  <a href={selected.cv_link} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm flex items-center gap-2 px-3 py-2">
                    <ExternalLink size={15} /> السيرة الذاتية
                  </a>
                )}
                {selected.demo_link && (
                  <a href={selected.demo_link} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm flex items-center gap-2 px-3 py-2">
                    <ExternalLink size={15} /> رابط فيديو الشرح
                  </a>
                )}
                {selected.photo_file_path && (
                  <button onClick={() => openCvFile(selected.photo_file_path!)} className="btn-ghost text-sm flex items-center gap-2 px-3 py-2">
                    <FileDown size={15} /> الصورة الشخصية
                  </button>
                )}
                {selected.demo_file_path && (
                  <button onClick={() => openCvFile(selected.demo_file_path!)} className="btn-ghost text-sm flex items-center gap-2 px-3 py-2">
                    <FileDown size={15} /> فيديو الشرح المرفوع
                  </button>
                )}
              </div>
              <div className="pt-5">
                <button onClick={() => approveAsTeacher(selected)} disabled={approving}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60">
                  {approving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  قبول وإضافته كمعلم مباشرة
                </button>
                <p className="text-xs text-muted-foreground mt-2">
                  ينشئ حساب معلم بنفس بريد المتقدم (أو يرقّي حسابه الحالي) ويظهر فوراً في صفحة المعلمين.
                </p>
              </div>
              <div className="pt-5 flex flex-wrap gap-2">
                {Object.entries(STATUSES).map(([k, v]) => (
                  <button key={k} onClick={() => setStatus(selected.id, k)}
                    className={`text-sm font-bold px-4 py-2 rounded-xl transition ${selected.status === k ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {tempPassword && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/50 p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-black text-lg">تم إنشاء حساب المعلم ✅</h3>
            <p className="text-sm text-muted-foreground">
              أرسل بيانات الدخول للمعلم — لن تظهر كلمة المرور مرة أخرى. بعد تسجيل الدخول سيُكمل خطوات تعيين كلمة مرور جديدة، وتعديل ملفه الشخصي، وإضافة حسابه البنكي.
            </p>
            <div className="space-y-2 text-sm">
              <div className="p-3 rounded-xl bg-muted break-all"><b>البريد:</b> {tempPassword.email}</div>
              <div className="p-3 rounded-xl bg-muted break-all"><b>كلمة المرور المؤقتة:</b> {tempPassword.password}</div>
              <div className="p-3 rounded-xl bg-muted break-all"><b>رابط إكمال الحساب:</b> {`${window.location.origin}/teacher/onboarding`}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { navigator.clipboard.writeText(`Email: ${tempPassword.email}\nPassword: ${tempPassword.password}\nComplete your account: ${window.location.origin}/teacher/onboarding`); toast.success("تم النسخ"); }}
                className="btn-ghost flex-1 flex items-center justify-center gap-2 py-2.5"><Copy size={15} /> نسخ</button>

              <button onClick={() => setTempPassword(null)} className="btn-primary flex-1 py-2.5">تم</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTutorApplications;
