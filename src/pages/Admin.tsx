import { useState, useEffect, useCallback, useRef, forwardRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  GraduationCap, Users, TrendingUp, Search, Plus,
  Shield, Video, BookOpen, Loader2, Upload, X, FileText, UserPlus, Home, ShoppingBag
} from "lucide-react";
import { motion } from "framer-motion";
import SalesHub from "@/components/SalesHub";


// --- Types ---
interface TeacherRow {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  university: string | null;
  subjects: string[];
  price: number;
  verified: boolean;
}

interface LectureRow {
  id: string;
  title: string;
  subject: string | null;
  teacher_id: string;
  student_id: string;
  video_url: string | null;
  pdf_url: string | null;
  created_at: string;
  teacher_name?: string;
  student_name?: string;
}

interface AdminUser {
  user_id: string;
  full_name: string | null;
}

interface ProfileOption {
  user_id: string;
  full_name: string | null;
  account_type: string | null;
}

// --- Sub-components ---
const StatCard = ({ label, value, icon: Icon, color, index }: { label: string; value: string; icon: any; color: string; index: number }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="card-base p-5">
    <div className="flex items-center gap-3">
      <motion.div whileHover={{ scale: 1.15, rotate: 10 }} className={`icon-box ${color}`}><Icon size={20} /></motion.div>
      <div>
        <div className="text-2xl font-black">{value}</div>
        <div className="text-muted-foreground text-xs">{label}</div>
      </div>
    </div>
  </motion.div>
);

const ModalWrapper = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
      {children}
    </motion.div>
  </div>
);

// --- Main Component ---
const Admin = forwardRef<HTMLDivElement>((_, ref) => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("teachers");
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ teachers: 0, students: 0, lectures: 0 });

  // Lectures state
  const [lectures, setLectures] = useState<LectureRow[]>([]);
  const [lecturesLoading, setLecturesLoading] = useState(true);
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [lectureForm, setLectureForm] = useState({ title: "", subject: "", teacher_id: "", student_id: "" });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [allProfiles, setAllProfiles] = useState<ProfileOption[]>([]);
  const videoRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  // Edit lecture state
  const [editLecture, setEditLecture] = useState<LectureRow | null>(null);
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null);
  const [editPdfFile, setEditPdfFile] = useState<File | null>(null);
  const [editUploading, setEditUploading] = useState(false);
  const editVideoRef = useRef<HTMLInputElement>(null);
  const editPdfRef = useRef<HTMLInputElement>(null);

  // Admins state
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);

  // Add teacher modal
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [teacherForm, setTeacherForm] = useState({ email: "", password: "", full_name: "", university: "", subjects: "", price: "" });
  const [addingTeacher, setAddingTeacher] = useState(false);

  // Add admin/moderator modal
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [addAdminEmail, setAddAdminEmail] = useState("");
  const [addAdminRole, setAddAdminRole] = useState<"admin" | "moderator">("moderator");
  const [addingAdmin, setAddingAdmin] = useState(false);

  // --- Data Fetching ---
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    const { data: teacherProfiles } = await supabase
      .from("teacher_profiles")
      .select("user_id, university, price, verified, subjects");

    if (!teacherProfiles || teacherProfiles.length === 0) {
      setTeachers([]);
      setLoading(false);
      return;
    }

    const userIds = teacherProfiles.map((tp) => tp.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, avatar_url")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

    const merged: TeacherRow[] = teacherProfiles.map((tp) => {
      const profile = profileMap.get(tp.user_id);
      return {
        user_id: tp.user_id,
        full_name: profile?.full_name || null,
        avatar_url: profile?.avatar_url || null,
        university: tp.university,
        subjects: (tp.subjects as string[]) || [],
        price: Number(tp.price) || 0,
        verified: tp.verified ?? false,
      };
    });

    setTeachers(merged);
    setLoading(false);
  }, []);

  const fetchStats = useCallback(async () => {
    const [{ count: teacherCount }, { count: studentCount }, { count: lectureCount }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("account_type", "teacher"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("account_type", "student"),
      supabase.from("lectures").select("*", { count: "exact", head: true }),
    ]);
    setStats({ teachers: teacherCount || 0, students: studentCount || 0, lectures: lectureCount || 0 });
  }, []);

  const fetchLectures = useCallback(async () => {
    setLecturesLoading(true);
    const { data } = await supabase.from("lectures").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) {
      const allUserIds = [...new Set(data.flatMap((l) => [l.teacher_id, l.student_id]))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", allUserIds);
      const pMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
      setLectures(data.map((l) => ({ ...l, teacher_name: pMap.get(l.teacher_id) || "—", student_name: pMap.get(l.student_id) || "—" })) as LectureRow[]);
    } else {
      setLectures([]);
    }
    setLecturesLoading(false);
  }, []);

  const fetchProfiles = useCallback(async () => {
    const { data } = await supabase.from("profiles").select("user_id, full_name, account_type");
    setAllProfiles(data || []);
  }, []);

  const fetchAdmins = useCallback(async () => {
    setAdminsLoading(true);
    const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
    if (roles && roles.length > 0) {
      const ids = roles.map((r) => r.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", ids);
      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
      setAdmins(ids.map((id) => ({ user_id: id, full_name: profileMap.get(id) || null })));
    } else {
      setAdmins([]);
    }
    setAdminsLoading(false);
  }, []);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetchTeachers();
    fetchStats();
    fetchLectures();
    fetchProfiles();
    fetchAdmins();
  }, [user, fetchTeachers, fetchStats, fetchLectures, fetchProfiles, fetchAdmins]);

  // --- Handlers ---
  const handleVerify = async (userId: string) => {
    const { error } = await supabase.from("teacher_profiles").update({ verified: true }).eq("user_id", userId);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم التوثيق بنجاح" });
      setTeachers((prev) => prev.map((tc) => tc.user_id === userId ? { ...tc, verified: true } : tc));
    }
  };

  const handleDeleteTeacher = async (userId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المعلم؟")) return;
    const { error } = await supabase.from("teacher_profiles").delete().eq("user_id", userId);
    if (error) { toast({ title: "خطأ", description: error.message, variant: "destructive" }); return; }
    await supabase.from("profiles").update({ account_type: "student" }).eq("user_id", userId);
    toast({ title: "تم حذف المعلم بنجاح" });
    setTeachers((prev) => prev.filter((tc) => tc.user_id !== userId));
    fetchStats();
    fetchProfiles();
  };

  const handleAddLecture = async () => {
    if (!lectureForm.title || !lectureForm.teacher_id || !lectureForm.student_id) {
      toast({ title: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    setUploading(true);
    let video_url: string | null = null;
    let pdf_url: string | null = null;

    try {
      if (videoFile) {
        const ext = videoFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("lecture-videos").upload(path, videoFile);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("lecture-videos").getPublicUrl(path);
        video_url = urlData.publicUrl;
      }
      if (pdfFile) {
        const ext = pdfFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("lecture-pdfs").upload(path, pdfFile);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("lecture-pdfs").getPublicUrl(path);
        pdf_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("lectures").insert({
        title: lectureForm.title,
        subject: lectureForm.subject || null,
        teacher_id: lectureForm.teacher_id,
        student_id: lectureForm.student_id,
        video_url,
        pdf_url,
      });
      if (error) throw error;

      toast({ title: "تمت إضافة المحاضرة بنجاح" });
      setShowAddLecture(false);
      setLectureForm({ title: "", subject: "", teacher_id: "", student_id: "" });
      setVideoFile(null);
      setPdfFile(null);
      fetchLectures();
      fetchStats();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const handleEditLecture = async () => {
    if (!editLecture) return;
    setEditUploading(true);
    try {
      let video_url = editLecture.video_url;
      let pdf_url = editLecture.pdf_url;

      if (editVideoFile) {
        const ext = editVideoFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("lecture-videos").upload(path, editVideoFile);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("lecture-videos").getPublicUrl(path);
        video_url = urlData.publicUrl;
      }
      if (editPdfFile) {
        const ext = editPdfFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("lecture-pdfs").upload(path, editPdfFile);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("lecture-pdfs").getPublicUrl(path);
        pdf_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("lectures").update({ video_url, pdf_url }).eq("id", editLecture.id);
      if (error) throw error;

      toast({ title: "تم تحديث المحاضرة بنجاح" });
      setEditLecture(null);
      setEditVideoFile(null);
      setEditPdfFile(null);
      fetchLectures();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setEditUploading(false);
  };

  const handleDeleteLecture = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المحاضرة؟")) return;
    const { error } = await supabase.from("lectures").delete().eq("id", id);
    if (error) { toast({ title: "خطأ", description: error.message, variant: "destructive" }); return; }
    toast({ title: "تم حذف المحاضرة" });
    setLectures((prev) => prev.filter((l) => l.id !== id));
    fetchStats();
  };

  const handleAddTeacher = async () => {
    if (!teacherForm.email || !teacherForm.password || !teacherForm.full_name) {
      toast({ title: "يرجى ملء الحقول المطلوبة (الاسم، الإيميل، الباسورد)", variant: "destructive" });
      return;
    }
    setAddingTeacher(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("manage-roles", {
        body: {
          action: "create_teacher",
          email: teacherForm.email,
          password: teacherForm.password,
          full_name: teacherForm.full_name,
          university: teacherForm.university || null,
          subjects: teacherForm.subjects ? teacherForm.subjects.split(",").map((s) => s.trim()).filter(Boolean) : [],
          price: teacherForm.price ? Number(teacherForm.price) : 0,
        },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.error) throw new Error(res.error.message);
      const result = res.data as any;
      if (result?.error) throw new Error(result.error);
      toast({ title: "تم إنشاء حساب المعلم بنجاح" });
      setShowAddTeacher(false);
      setTeacherForm({ email: "", password: "", full_name: "", university: "", subjects: "", price: "" });
      fetchTeachers();
      fetchStats();
      fetchProfiles();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setAddingTeacher(false);
  };

  const handleAddAdmin = async () => {
    if (!addAdminEmail) {
      toast({ title: "يرجى إدخال البريد الإلكتروني", variant: "destructive" });
      return;
    }
    setAddingAdmin(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("manage-roles", {
        body: { action: "add_role", email: addAdminEmail, role: addAdminRole },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.error) throw new Error(res.error.message);
      const result = res.data as any;
      if (result?.error) throw new Error(result.error);
      toast({ title: addAdminRole === "admin" ? "تمت إضافة المدير بنجاح" : "تمت إضافة المشرف بنجاح" });
      setShowAddAdmin(false);
      setAddAdminEmail("");
      fetchAdmins();
    } catch (err: any) {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    }
    setAddingAdmin(false);
  };

  // --- Filters ---
  const filteredTeachers = teachers.filter((tc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return tc.full_name?.toLowerCase().includes(q) || tc.university?.toLowerCase().includes(q) || tc.subjects.some((s) => s.toLowerCase().includes(q));
  });

  const filteredLectures = lectures.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return l.title.toLowerCase().includes(q) || l.subject?.toLowerCase().includes(q) || l.teacher_name?.toLowerCase().includes(q) || l.student_name?.toLowerCase().includes(q);
  });

  const teacherProfilesList = allProfiles.filter((p) => p.account_type === "teacher");
  const studentProfilesList = allProfiles.filter((p) => p.account_type === "student");
  // Students who are not yet teachers (for add teacher modal)
  const nonTeacherProfiles = allProfiles.filter((p) => p.account_type === "student");

  // --- Config ---
  const tabs = [
    { id: "sales", label: t("sales_hub"), icon: ShoppingBag },
    { id: "teachers", label: t("admin_teachers"), icon: GraduationCap },
    { id: "lectures", label: "المحاضرات", icon: BookOpen },
    { id: "admins", label: t("admin_admins"), icon: Shield },
  ];

  const statCards = [
    { label: t("admin_teachers"), value: String(stats.teachers), icon: GraduationCap, color: "bg-primary/10 text-primary" },
    { label: t("admin_students"), value: String(stats.students), icon: Users, color: "bg-warning/10 text-warning" },
    { label: "المحاضرات", value: String(stats.lectures), icon: BookOpen, color: "bg-muted text-muted-foreground" },
    { label: t("admin_revenue"), value: "0", icon: TrendingUp, color: "bg-destructive/5 text-destructive" },
  ];

  // --- Auth loading / guard ---
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Shield size={48} className="text-muted-foreground/30" />
        <p className="text-muted-foreground font-bold">ليس لديك صلاحية الوصول لهذه الصفحة</p>
        <Link to="/" className="btn-primary text-sm flex items-center gap-2">
          <Home size={16} /> العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={20} className="text-primary" />
                <h1 className="text-2xl font-extrabold">{t("admin_title")}</h1>
              </div>
              <p className="text-muted-foreground text-sm">{t("admin_subtitle")}</p>
            </div>
            <Link to="/" className="btn-outline !py-2 !px-4 text-sm flex items-center gap-2">
              <Home size={14} /> الموقع
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} index={i} />
          ))}
        </div>

        {/* Tabs Card */}
        <div className="card-base overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b bg-secondary/30">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${activeTab === tab.id ? "bg-card text-foreground border-b-2 border-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}>
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search + Actions */}
          <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md min-w-[200px]">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث..." className="input-base !pr-10 !py-2.5 text-sm" />
            </div>
            <div className="flex gap-2">
              {activeTab === "teachers" && (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddTeacher(true)}
                  className="btn-primary !py-2.5 text-sm flex items-center gap-2">
                  <UserPlus size={16} /> إضافة معلم
                </motion.button>
              )}
              {activeTab === "lectures" && (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddLecture(true)}
                  className="btn-primary !py-2.5 text-sm flex items-center gap-2">
                  <Plus size={16} /> إضافة محاضرة
                </motion.button>
              )}
              {activeTab === "admins" && (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddAdmin(true)}
                  className="btn-primary !py-2.5 text-sm flex items-center gap-2">
                  <Shield size={16} /> إضافة مشرف
                </motion.button>
              )}
            </div>
          </div>

          {/* ===== Teachers Tab ===== */}
          {activeTab === "teachers" && (
            loading ? (
              <div className="p-16 text-center"><Loader2 className="mx-auto animate-spin text-muted-foreground mb-3" size={32} /><p className="text-muted-foreground text-sm">جاري التحميل...</p></div>
            ) : filteredTeachers.length === 0 ? (
              <div className="p-16 text-center"><GraduationCap size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">{searchQuery ? "لا توجد نتائج" : "لا يوجد معلمون"}</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60">
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_teacher")}</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_university")}</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_subjects")}</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_status")}</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_actions")}</th>
                  </tr></thead>
                  <tbody>
                    {filteredTeachers.map((tc) => (
                      <tr key={tc.user_id} className="border-t hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="icon-box bg-primary/10"><GraduationCap size={18} className="text-primary" /></div>
                            <div>
                              <div className="font-bold text-sm">{tc.full_name || "—"}</div>
                              <div className="text-muted-foreground text-xs">{tc.price} {t("sar")} / {t("teacher_per_session")}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm">{tc.university || "—"}</td>
                        <td className="p-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {tc.subjects.length > 0 ? tc.subjects.slice(0, 2).map((s, i) => <span key={i} className="tag-outline text-[0.7rem]">{s}</span>) : <span className="text-muted-foreground text-xs">—</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          {tc.verified
                            ? <span className="text-xs bg-success/10 text-success px-2.5 py-1 rounded-full font-semibold">{t("teacher_verified")}</span>
                            : <span className="text-xs bg-warning/10 text-warning px-2.5 py-1 rounded-full font-semibold">{t("admin_under_review")}</span>}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {!tc.verified && (
                              <button onClick={() => handleVerify(tc.user_id)} className="text-xs bg-success/10 text-success px-3 py-1.5 rounded-lg font-semibold hover:bg-success/20 transition-colors">{t("admin_verify")}</button>
                            )}
                            <button onClick={() => handleDeleteTeacher(tc.user_id)} className="text-xs bg-destructive/10 text-destructive px-3 py-1.5 rounded-lg font-semibold hover:bg-destructive/20 transition-colors">{t("admin_delete")}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* ===== Lectures Tab ===== */}
          {activeTab === "lectures" && (
            lecturesLoading ? (
              <div className="p-16 text-center"><Loader2 className="mx-auto animate-spin text-muted-foreground mb-3" size={32} /><p className="text-muted-foreground text-sm">جاري التحميل...</p></div>
            ) : filteredLectures.length === 0 ? (
              <div className="p-16 text-center"><BookOpen size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">{searchQuery ? "لا توجد نتائج" : "لا توجد محاضرات بعد"}</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60">
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">المحاضرة</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">المادة</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">المعلم</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">الطالب</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">المحتوى</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">الإجراءات</th>
                  </tr></thead>
                  <tbody>
                    {filteredLectures.map((l) => (
                      <tr key={l.id} className="border-t hover:bg-secondary/30 transition-colors">
                        <td className="p-4 font-bold text-sm">{l.title}</td>
                        <td className="p-4 text-muted-foreground text-sm">{l.subject || "—"}</td>
                        <td className="p-4 text-sm">{l.teacher_name}</td>
                        <td className="p-4 text-sm">{l.student_name}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {l.video_url && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold flex items-center gap-1"><Video size={10} /> فيديو</span>}
                            {l.pdf_url && <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full font-semibold flex items-center gap-1"><FileText size={10} /> PDF</span>}
                            {!l.video_url && !l.pdf_url && <span className="text-muted-foreground text-xs">—</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditLecture(l); setEditVideoFile(null); setEditPdfFile(null); }} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1"><Upload size={10} /> تعديل</button>
                            <button onClick={() => handleDeleteLecture(l.id)} className="text-xs bg-destructive/10 text-destructive px-3 py-1.5 rounded-lg font-semibold hover:bg-destructive/20 transition-colors">حذف</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* ===== Sales Hub Tab ===== */}
          {activeTab === "sales" && <SalesHub />}

          {/* ===== Admins Tab ===== */}
          {activeTab === "admins" && (
            adminsLoading ? (
              <div className="p-16 text-center"><Loader2 className="mx-auto animate-spin text-muted-foreground mb-3" size={32} /><p className="text-muted-foreground text-sm">جاري التحميل...</p></div>
            ) : admins.length === 0 ? (
              <div className="p-16 text-center"><Shield size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">لا يوجد مدراء</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60">
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">المدير</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">معرّف المستخدم</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">الحالة</th>
                  </tr></thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.user_id} className="border-t hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="icon-box bg-primary/10"><Shield size={18} className="text-primary" /></div>
                            <div className="font-bold text-sm">{admin.full_name || "مدير بدون اسم"}</div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs font-mono">{admin.user_id.slice(0, 8)}...</td>
                        <td className="p-4">
                          <span className="text-xs bg-success/10 text-success px-2.5 py-1 rounded-full font-semibold">مدير نشط</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>

      {/* ===== Add Lecture Modal ===== */}
      {showAddLecture && (
        <ModalWrapper onClose={() => setShowAddLecture(false)}>
          <div className="flex items-center justify-between p-5 border-b">
            <h3 className="font-extrabold text-lg">إضافة محاضرة جديدة</h3>
            <button onClick={() => setShowAddLecture(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1.5">اسم المحاضرة *</label>
              <input value={lectureForm.title} onChange={(e) => setLectureForm((f) => ({ ...f, title: e.target.value }))} className="input-base" placeholder="مثال: مقدمة في التفاضل" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">المادة</label>
              <input value={lectureForm.subject} onChange={(e) => setLectureForm((f) => ({ ...f, subject: e.target.value }))} className="input-base" placeholder="مثال: الرياضيات" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">المعلم *</label>
              <select value={lectureForm.teacher_id} onChange={(e) => setLectureForm((f) => ({ ...f, teacher_id: e.target.value }))} className="input-base">
                <option value="">اختر المعلم</option>
                {teacherProfilesList.map((p) => <option key={p.user_id} value={p.user_id}>{p.full_name || p.user_id}</option>)}
                {teacherProfilesList.length === 0 && <option disabled>لا يوجد معلمون مسجلون</option>}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">الطالب *</label>
              <select value={lectureForm.student_id} onChange={(e) => setLectureForm((f) => ({ ...f, student_id: e.target.value }))} className="input-base">
                <option value="">اختر الطالب</option>
                {studentProfilesList.map((p) => <option key={p.user_id} value={p.user_id}>{p.full_name || p.user_id}</option>)}
                {studentProfilesList.length === 0 && <option disabled>لا يوجد طلاب مسجلون</option>}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1.5">فيديو المحاضرة</label>
                <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                <button onClick={() => videoRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Upload size={16} />
                  {videoFile ? videoFile.name.slice(0, 20) : "رفع فيديو"}
                </button>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">ملف PDF</label>
                <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                <button onClick={() => pdfRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl text-sm text-muted-foreground hover:border-destructive hover:text-destructive transition-colors">
                  <FileText size={16} />
                  {pdfFile ? pdfFile.name.slice(0, 20) : "رفع PDF"}
                </button>
              </div>
            </div>
            <button onClick={handleAddLecture} disabled={uploading} className="btn-primary w-full flex items-center justify-center gap-2">
              {uploading ? <><Loader2 size={16} className="animate-spin" /> جاري الرفع...</> : <><Plus size={16} /> إضافة المحاضرة</>}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* ===== Edit Lecture Modal ===== */}
      {editLecture && (
        <ModalWrapper onClose={() => setEditLecture(null)}>
          <div className="flex items-center justify-between p-5 border-b">
            <h3 className="font-extrabold text-lg">تعديل محاضرة: {editLecture.title}</h3>
            <button onClick={() => setEditLecture(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>المادة: <span className="font-bold text-foreground">{editLecture.subject || "—"}</span></p>
              <p>المعلم: <span className="font-bold text-foreground">{editLecture.teacher_name || "—"}</span></p>
              <p>الطالب: <span className="font-bold text-foreground">{editLecture.student_name || "—"}</span></p>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div>
                <label className="block text-sm font-bold mb-1.5">فيديو المحاضرة {editLecture.video_url && <span className="text-success text-xs font-normal">(يوجد فيديو حالياً)</span>}</label>
                <input ref={editVideoRef} type="file" accept="video/*" className="hidden" onChange={(e) => setEditVideoFile(e.target.files?.[0] || null)} />
                <button onClick={() => editVideoRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Upload size={16} />
                  {editVideoFile ? editVideoFile.name.slice(0, 30) : editLecture.video_url ? "استبدال الفيديو" : "رفع فيديو"}
                </button>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">ملف PDF {editLecture.pdf_url && <span className="text-success text-xs font-normal">(يوجد ملف حالياً)</span>}</label>
                <input ref={editPdfRef} type="file" accept=".pdf" className="hidden" onChange={(e) => setEditPdfFile(e.target.files?.[0] || null)} />
                <button onClick={() => editPdfRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-xl text-sm text-muted-foreground hover:border-destructive hover:text-destructive transition-colors">
                  <FileText size={16} />
                  {editPdfFile ? editPdfFile.name.slice(0, 30) : editLecture.pdf_url ? "استبدال PDF" : "رفع PDF"}
                </button>
              </div>
            </div>

            <button onClick={handleEditLecture} disabled={editUploading || (!editVideoFile && !editPdfFile)} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {editUploading ? <><Loader2 size={16} className="animate-spin" /> جاري الرفع...</> : <><Upload size={16} /> حفظ التعديلات</>}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* ===== Add Teacher Modal ===== */}
      {showAddTeacher && (
        <ModalWrapper onClose={() => setShowAddTeacher(false)}>
          <div className="flex items-center justify-between p-5 border-b">
            <h3 className="font-extrabold text-lg">إضافة معلم جديد</h3>
            <button onClick={() => setShowAddTeacher(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-muted-foreground text-sm">أدخل بيانات المعلم لإنشاء حساب جديد.</p>
            <div>
              <label className="block text-sm font-bold mb-1.5">الاسم الكامل *</label>
              <input value={teacherForm.full_name} onChange={(e) => setTeacherForm((f) => ({ ...f, full_name: e.target.value }))} className="input-base" placeholder="مثال: أحمد محمد" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني *</label>
              <input value={teacherForm.email} onChange={(e) => setTeacherForm((f) => ({ ...f, email: e.target.value }))} className="input-base" placeholder="example@email.com" type="email" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">كلمة المرور *</label>
              <input value={teacherForm.password} onChange={(e) => setTeacherForm((f) => ({ ...f, password: e.target.value }))} className="input-base" placeholder="كلمة مرور قوية" type="password" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">الجامعة</label>
              <input value={teacherForm.university} onChange={(e) => setTeacherForm((f) => ({ ...f, university: e.target.value }))} className="input-base" placeholder="مثال: جامعة الملك سعود" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">المواد (مفصولة بفاصلة)</label>
              <input value={teacherForm.subjects} onChange={(e) => setTeacherForm((f) => ({ ...f, subjects: e.target.value }))} className="input-base" placeholder="مثال: رياضيات, فيزياء, كيمياء" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">سعر الجلسة (ريال)</label>
              <input value={teacherForm.price} onChange={(e) => setTeacherForm((f) => ({ ...f, price: e.target.value }))} className="input-base" placeholder="مثال: 150" type="number" />
            </div>
            <button onClick={handleAddTeacher} disabled={addingTeacher} className="btn-primary w-full flex items-center justify-center gap-2">
              {addingTeacher ? <><Loader2 size={16} className="animate-spin" /> جاري الإنشاء...</> : <><UserPlus size={16} /> إنشاء حساب المعلم</>}
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* ===== Add Admin/Moderator Modal ===== */}
      {showAddAdmin && (
        <ModalWrapper onClose={() => setShowAddAdmin(false)}>
          <div className="flex items-center justify-between p-5 border-b">
            <h3 className="font-extrabold text-lg">إضافة مشرف / مدير</h3>
            <button onClick={() => setShowAddAdmin(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-muted-foreground text-sm">أدخل البريد الإلكتروني لمستخدم مسجّل لمنحه صلاحية الإشراف أو الإدارة.</p>
            <div>
              <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني *</label>
              <input value={addAdminEmail} onChange={(e) => setAddAdminEmail(e.target.value)} className="input-base" placeholder="example@email.com" type="email" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">نوع الصلاحية</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setAddAdminRole("moderator")}
                  className={`flex-1 p-3 rounded-xl border-2 text-sm font-bold transition-all ${addAdminRole === "moderator" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"}`}
                >
                  مشرف
                </button>
                <button
                  onClick={() => setAddAdminRole("admin")}
                  className={`flex-1 p-3 rounded-xl border-2 text-sm font-bold transition-all ${addAdminRole === "admin" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"}`}
                >
                  مدير
                </button>
              </div>
            </div>
            <button onClick={handleAddAdmin} disabled={addingAdmin} className="btn-primary w-full flex items-center justify-center gap-2">
              {addingAdmin ? <><Loader2 size={16} className="animate-spin" /> جاري الإضافة...</> : <><Shield size={16} /> إضافة الصلاحية</>}
            </button>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
});

Admin.displayName = "Admin";

export default Admin;
