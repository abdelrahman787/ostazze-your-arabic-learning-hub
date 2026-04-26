import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
  GraduationCap, Users, Search, Plus,
  Shield, Video, BookOpen, Loader2, Upload, X, FileText, UserPlus, Home, ShoppingBag,
  ChevronLeft, ChevronRight, Clock, Menu, LogOut, LayoutDashboard, User, Lock,
  Calendar, CreditCard
} from "lucide-react";
import { motion } from "framer-motion";
import SalesHub from "@/components/SalesHub";
import NotificationBell from "@/components/NotificationBell";
import AdminCourses from "@/components/AdminCourses";
import AdminInvoices from "@/components/AdminInvoices";
import NoIndex from "@/components/NoIndex";

// --- Types ---
interface TeacherRow {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  university: string | null;
  subjects: string[];
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

interface AvailabilitySlot {
  id: string;
  teacher_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  teacher_name?: string;
}

// --- Sub-components ---
const StatCard = ({ label, value, icon: Icon, color, index }: { label: string; value: string; icon: LucideIcon; color: string; index: number }) => (
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
const Admin = () => {
  const { user, loading: authLoading, logout, changePassword } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("sales");
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ teachers: 0, students: 0, lectures: 0 });
  const [teacherPage, setTeacherPage] = useState(0);
  const TEACHERS_PER_PAGE = 10;
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Teacher availability state
  const [teacherAvailability, setTeacherAvailability] = useState<AvailabilitySlot[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);

  // Add teacher modal
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [teacherForm, setTeacherForm] = useState({ email: "", password: "", full_name: "", university: "", subjects: "" });
  const [addingTeacher, setAddingTeacher] = useState(false);

  // Add admin/moderator modal
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [addAdminEmail, setAddAdminEmail] = useState("");
  const [addAdminRole, setAddAdminRole] = useState<"admin" | "moderator">("moderator");
  const [addingAdmin, setAddingAdmin] = useState(false);

  // Password change
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const DAYS = [t("day_sun"), t("day_mon"), t("day_tue"), t("day_wed"), t("day_thu"), t("day_fri"), t("day_sat")];

  // --- Data Fetching ---
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    const { data: teacherProfiles } = await supabase
      .from("teacher_profiles")
      .select("user_id, university, verified, subjects");

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

  const fetchTeacherAvailability = useCallback(async () => {
    setAvailabilityLoading(true);
    const { data } = await supabase
      .from("teacher_availability")
      .select("*")
      .eq("is_active", true)
      .order("day_of_week")
      .order("start_time");

    if (data && data.length > 0) {
      const teacherIds = [...new Set(data.map((s) => s.teacher_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", teacherIds);
      const pMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
      setTeacherAvailability(data.map((s) => ({ ...s, teacher_name: pMap.get(s.teacher_id) || "—" })));
    } else {
      setTeacherAvailability([]);
    }
    setAvailabilityLoading(false);
  }, []);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetchTeachers();
    fetchStats();
    fetchLectures();
    fetchProfiles();
    fetchAdmins();
    fetchTeacherAvailability();
  }, [user, fetchTeachers, fetchStats, fetchLectures, fetchProfiles, fetchAdmins, fetchTeacherAvailability]);

  // --- Handlers ---
  const handleVerify = async (userId: string) => {
    const { error } = await supabase.from("teacher_profiles").update({ verified: true }).eq("user_id", userId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("teacher_verified"));
      setTeachers((prev) => prev.map((tc) => tc.user_id === userId ? { ...tc, verified: true } : tc));
    }
  };

  const handleDeleteTeacher = async (userId: string) => {
    if (!confirm(t("admin_delete") + "?")) return;
    const { error } = await supabase.from("teacher_profiles").delete().eq("user_id", userId);
    if (error) { toast.error(error.message); return; }
    await supabase.from("profiles").update({ account_type: "student" }).eq("user_id", userId);
    toast.success(t("admin_delete") + " ✓");
    setTeachers((prev) => prev.filter((tc) => tc.user_id !== userId));
    fetchStats();
    fetchProfiles();
  };

  const handleAddLecture = async () => {
    if (!lectureForm.title || !lectureForm.teacher_id || !lectureForm.student_id) {
      toast.error(t("admin_fill_required_fields"));
      return;
    }
    setUploading(true);
    let video_url: string | null = null;
    let pdf_url: string | null = null;
    let uploadedVideoPaths: string[] = [];
    let uploadedPdfPaths: string[] = [];

    try {
      if (videoFile) {
        const ext = videoFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("lecture-videos").upload(path, videoFile);
        if (error) throw error;
        uploadedVideoPaths.push(path);
        // Store storage path; signed URL is generated on demand by LectureView
        video_url = path;
      }
      if (pdfFile) {
        const ext = pdfFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("lecture-pdfs").upload(path, pdfFile);
        if (error) throw error;
        uploadedPdfPaths.push(path);
        pdf_url = path;
      }

      const { error } = await supabase.from("lectures").insert({
        title: lectureForm.title,
        subject: lectureForm.subject || null,
        teacher_id: lectureForm.teacher_id,
        student_id: lectureForm.student_id,
        video_url,
        pdf_url,
      });
      if (error) {
        if (uploadedVideoPaths.length > 0) await supabase.storage.from("lecture-videos").remove(uploadedVideoPaths);
        if (uploadedPdfPaths.length > 0) await supabase.storage.from("lecture-pdfs").remove(uploadedPdfPaths);
        throw error;
      }

      toast.success(t("lecture_added"));
      setShowAddLecture(false);
      setLectureForm({ title: "", subject: "", teacher_id: "", student_id: "" });
      setVideoFile(null);
      setPdfFile(null);
      fetchLectures();
      fetchStats();
    } catch (err: any) {
      toast.error(err.message);
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
        video_url = path;
      }
      if (editPdfFile) {
        const ext = editPdfFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("lecture-pdfs").upload(path, editPdfFile);
        if (error) throw error;
        pdf_url = path;
      }

      const { error } = await supabase.from("lectures").update({ video_url, pdf_url }).eq("id", editLecture.id);
      if (error) throw error;

      toast.success(t("lecture_updated"));
      setEditLecture(null);
      setEditVideoFile(null);
      setEditPdfFile(null);
      fetchLectures();
    } catch (err: any) {
      toast.error(err.message);
    }
    setEditUploading(false);
  };

  const handleDeleteLecture = async (id: string) => {
    if (!confirm(t("admin_delete") + "?")) return;
    const { error } = await supabase.from("lectures").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(t("admin_delete") + " ✓");
    setLectures((prev) => prev.filter((l) => l.id !== id));
    fetchStats();
  };

  const handleAddTeacher = async () => {
    if (!teacherForm.email || !teacherForm.password || !teacherForm.full_name) {
      toast.error(t("admin_fill_required_fields"));
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
          price: 0,
        },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.error) throw new Error(res.error.message);
      const result = res.data as any;
      if (result?.error) throw new Error(result.error);
      toast.success(t("teacher_account_created"));
      setShowAddTeacher(false);
      setTeacherForm({ email: "", password: "", full_name: "", university: "", subjects: "" });
      fetchTeachers();
      fetchStats();
      fetchProfiles();
    } catch (err: any) {
      toast.error(err.message);
    }
    setAddingTeacher(false);
  };

  const handleAddAdmin = async () => {
    if (!addAdminEmail) {
      toast.error(t("admin_enter_email"));
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
      toast.success(t("admin_role_added"));
      setShowAddAdmin(false);
      setAddAdminEmail("");
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.message);
    }
    setAddingAdmin(false);
  };

  const handleChangePassword = async () => {
    if (pwForm.newPw !== pwForm.confirm) {
      toast.error(t("password_mismatch"));
      return;
    }
    if (pwForm.newPw.length < 8) {
      toast.error(t("password_too_short"));
      return;
    }
    setPwSaving(true);
    const result = await changePassword(pwForm.current, pwForm.newPw);
    if (result.error) {
      toast.error(result.error === "current_password_wrong" ? t("current_password_wrong") : result.error);
    } else {
      toast.success(t("password_changed"));
      setPwForm({ current: "", newPw: "", confirm: "" });
    }
    setPwSaving(false);
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

  // Group availability by teacher
  const availabilityByTeacher = teacherAvailability.reduce((acc, slot) => {
    const key = slot.teacher_id;
    if (!acc[key]) acc[key] = { name: slot.teacher_name || "—", slots: [] };
    acc[key].slots.push(slot);
    return acc;
  }, {} as Record<string, { name: string; slots: AvailabilitySlot[] }>);

  // --- Sidebar config ---
  const sidebarLinks = [
    { section: t("section_main"), items: [
      { icon: ShoppingBag, label: t("sales_hub"), tab: "sales" },
      { icon: CreditCard, label: "الفواتير والتقارير", tab: "invoices" },
      { icon: GraduationCap, label: t("admin_teachers"), tab: "teachers" },
      { icon: Video, label: "المحاضرات", tab: "lectures" },
      { icon: Clock, label: t("sidebar_available_times"), tab: "availability" },
    ]},
    { section: t("section_account"), items: [
      { icon: Shield, label: t("admin_admins"), tab: "admins" },
      { icon: Lock, label: t("dash_change_password"), tab: "password" },
    ]},
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

  const currentTabLabel = sidebarLinks.flatMap((s) => s.items).find((i) => i.tab === activeTab)?.label || t("admin_title");

  return (
    <div className="flex min-h-screen">
      <NoIndex title="Admin Panel" />
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-40 w-[260px] bg-card border-l flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b">
          <Link to="/" className="text-xl font-black text-primary tracking-tight">OSTAZE</Link>
          <p className="text-xs text-muted-foreground mt-0.5">{t("admin_title")}</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {sidebarLinks.map((s) => (
            <div key={s.section}>
              <div className="text-xs font-bold text-muted-foreground mb-2 px-3">{s.section}</div>
              {s.items.map((item) => (
                <button key={item.tab} onClick={() => { setActiveTab(item.tab); setSearchQuery(""); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mb-1 ${activeTab === item.tab ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"}`}>
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }}><item.icon size={16} /></motion.div>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={16} /> {t("nav_logout")}
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu size={20} /></button>
            <h2 className="font-bold">{currentTabLabel}</h2>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{user?.name?.charAt(0) || "A"}</div>
            <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
          </div>
        </header>

        <div className="p-6">
          {/* Stats — show on sales tab */}
          {activeTab === "sales" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  { label: t("admin_teachers"), value: String(stats.teachers), icon: GraduationCap, color: "bg-primary/10 text-primary" },
                  { label: t("admin_students"), value: String(stats.students), icon: Users, color: "bg-warning/10 text-warning" },
                  { label: "المحاضرات", value: String(stats.lectures), icon: BookOpen, color: "bg-muted text-muted-foreground" },
                ].map((s, i) => (
                  <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} index={i} />
                ))}
              </div>
              <SalesHub />
            </div>
          )}

          {/* Teachers Tab */}
          {activeTab === "teachers" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md min-w-[200px]">
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setTeacherPage(0); }} placeholder={t("admin_search_placeholder")} className="input-base !pr-10 !py-2.5 text-sm" />
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddTeacher(true)}
                  className="btn-primary !py-2.5 text-sm flex items-center gap-2">
                  <UserPlus size={16} /> إضافة معلم
                </motion.button>
              </div>

              {loading ? (
                <div className="card-base p-16 text-center"><Loader2 className="mx-auto animate-spin text-muted-foreground mb-3" size={32} /></div>
              ) : filteredTeachers.length === 0 ? (
                <div className="card-base p-16 text-center"><GraduationCap size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">{searchQuery ? t("no_results") : t("no_teachers_registered")}</p></div>
              ) : (
                <div className="card-base overflow-hidden">
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
                        {filteredTeachers.slice(teacherPage * TEACHERS_PER_PAGE, (teacherPage + 1) * TEACHERS_PER_PAGE).map((tc) => (
                          <tr key={tc.user_id} className="border-t hover:bg-secondary/30 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="icon-box bg-primary/10"><GraduationCap size={18} className="text-primary" /></div>
                                <div className="font-bold text-sm">{tc.full_name || "—"}</div>
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
                  {filteredTeachers.length > TEACHERS_PER_PAGE && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                      <span className="text-xs text-muted-foreground">
                        {t("page_label")} {teacherPage + 1} {t("page_of")} {Math.ceil(filteredTeachers.length / TEACHERS_PER_PAGE)}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => setTeacherPage((p) => Math.max(0, p - 1))} disabled={teacherPage === 0}
                          className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-secondary/80">
                          <ChevronRight size={14} /> {t("page_prev")}
                        </button>
                        <button onClick={() => setTeacherPage((p) => Math.min(Math.ceil(filteredTeachers.length / TEACHERS_PER_PAGE) - 1, p + 1))}
                          disabled={teacherPage >= Math.ceil(filteredTeachers.length / TEACHERS_PER_PAGE) - 1}
                          className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-secondary/80">
                          {t("page_next")} <ChevronLeft size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Invoices & Reports Tab */}
          {activeTab === "invoices" && (
            <div className="animate-fade-in">
              <AdminInvoices />
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="animate-fade-in">
              <AdminCourses />
            </div>
          )}

          {/* Lectures Tab */}
          {activeTab === "lectures" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md min-w-[200px]">
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("admin_search_placeholder")} className="input-base !pr-10 !py-2.5 text-sm" />
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddLecture(true)}
                  className="btn-primary !py-2.5 text-sm flex items-center gap-2">
                  <Plus size={16} /> إضافة محاضرة
                </motion.button>
              </div>

              {lecturesLoading ? (
                <div className="card-base p-16 text-center"><Loader2 className="mx-auto animate-spin text-muted-foreground mb-3" size={32} /></div>
              ) : filteredLectures.length === 0 ? (
                <div className="card-base p-16 text-center"><BookOpen size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">{searchQuery ? "لا توجد نتائج" : "لا توجد محاضرات بعد"}</p></div>
              ) : (
                <div className="card-base overflow-hidden">
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
                </div>
              )}
            </div>
          )}

          {/* Teacher Availability Tab */}
          {activeTab === "availability" && (
            <div className="space-y-4 animate-fade-in">
              {availabilityLoading ? (
                <div className="card-base p-16 text-center"><Loader2 className="mx-auto animate-spin text-muted-foreground mb-3" size={32} /></div>
              ) : Object.keys(availabilityByTeacher).length === 0 ? (
                <div className="card-base p-16 text-center">
                  <Clock size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">لا توجد مواعيد متاحة من المعلمين</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(availabilityByTeacher).map(([teacherId, { name, slots }]) => (
                    <motion.div key={teacherId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-base p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="icon-box bg-primary/10"><GraduationCap size={18} className="text-primary" /></div>
                        <h4 className="font-bold">{name}</h4>
                      </div>
                      <div className="space-y-2">
                        {slots.map((slot) => (
                          <div key={slot.id} className="flex items-center justify-between p-3 bg-secondary rounded-xl text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-primary" />
                              <span className="font-medium">{DAYS[slot.day_of_week]}</span>
                            </div>
                            <span className="text-muted-foreground">{slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === "admins" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-end">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAddAdmin(true)}
                  className="btn-primary !py-2.5 text-sm flex items-center gap-2">
                  <Shield size={16} /> إضافة مشرف
                </motion.button>
              </div>
              {adminsLoading ? (
                <div className="card-base p-16 text-center"><Loader2 className="mx-auto animate-spin text-muted-foreground mb-3" size={32} /></div>
              ) : admins.length === 0 ? (
                <div className="card-base p-16 text-center"><Shield size={40} className="mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">لا يوجد مدراء</p></div>
              ) : (
                <div className="card-base overflow-hidden">
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
                </div>
              )}
            </div>
          )}

          {/* Password Change Tab */}
          {activeTab === "password" && (
            <div className="card-base p-6 animate-fade-in max-w-lg">
              <h3 className="font-extrabold text-lg mb-6">{t("dash_change_password")}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5">{t("dash_current_password")}</label>
                  <input type="password" value={pwForm.current} onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))} className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">{t("dash_new_password")}</label>
                  <input type="password" value={pwForm.newPw} onChange={(e) => setPwForm((f) => ({ ...f, newPw: e.target.value }))} className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">{t("register_confirm")}</label>
                  <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))} className="input-base" />
                </div>
                <button onClick={handleChangePassword} disabled={pwSaving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                  {pwSaving && <Loader2 size={14} className="animate-spin" />}
                  {t("dash_update_password")}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

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
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">الطالب *</label>
              <select value={lectureForm.student_id} onChange={(e) => setLectureForm((f) => ({ ...f, student_id: e.target.value }))} className="input-base">
                <option value="">اختر الطالب</option>
                {studentProfilesList.map((p) => <option key={p.user_id} value={p.user_id}>{p.full_name || p.user_id}</option>)}
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
                <button onClick={() => setAddAdminRole("moderator")}
                  className={`flex-1 p-3 rounded-xl border-2 text-sm font-bold transition-all ${addAdminRole === "moderator" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"}`}>
                  مشرف
                </button>
                <button onClick={() => setAddAdminRole("admin")}
                  className={`flex-1 p-3 rounded-xl border-2 text-sm font-bold transition-all ${addAdminRole === "admin" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground"}`}>
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
};

export default Admin;
