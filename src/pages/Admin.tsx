import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  GraduationCap, Users, CalendarCheck, TrendingUp, Search, Plus,
  Shield, Video, BookOpen, Loader2
} from "lucide-react";
import { motion } from "framer-motion";

interface TeacherRow {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  university: string | null;
  subjects: string[];
  price: number;
  verified: boolean;
}

const Admin = () => {
  const { user } = useAuth();
  const { t, d } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("teachers");
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ teachers: 0, students: 0 });

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    // Fetch teacher profiles joined with profiles
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
    const [{ count: teacherCount }, { count: studentCount }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("account_type", "teacher"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("account_type", "student"),
    ]);
    setStats({ teachers: teacherCount || 0, students: studentCount || 0 });
  }, []);

  useEffect(() => {
    fetchTeachers();
    fetchStats();
  }, [fetchTeachers, fetchStats]);

  const handleVerify = async (userId: string) => {
    const { error } = await supabase
      .from("teacher_profiles")
      .update({ verified: true })
      .eq("user_id", userId);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم التوثيق بنجاح" });
      setTeachers((prev) => prev.map((tc) => tc.user_id === userId ? { ...tc, verified: true } : tc));
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المعلم؟")) return;

    const { error: tpErr } = await supabase.from("teacher_profiles").delete().eq("user_id", userId);
    if (tpErr) {
      toast({ title: "خطأ", description: tpErr.message, variant: "destructive" });
      return;
    }
    // Update profile account_type to student (soft remove teacher status)
    await supabase.from("profiles").update({ account_type: "student" }).eq("user_id", userId);
    toast({ title: "تم حذف المعلم بنجاح" });
    setTeachers((prev) => prev.filter((tc) => tc.user_id !== userId));
    fetchStats();
  };

  const filteredTeachers = teachers.filter((tc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      tc.full_name?.toLowerCase().includes(q) ||
      tc.university?.toLowerCase().includes(q) ||
      tc.subjects.some((s) => s.toLowerCase().includes(q))
    );
  });

  const tabs = [
    { id: "teachers", label: t("admin_teachers"), icon: GraduationCap },
    { id: "admins", label: t("admin_admins"), icon: Shield },
    { id: "videos", label: t("admin_videos"), icon: Video },
    { id: "content", label: t("admin_content"), icon: BookOpen },
  ];

  const statCards = [
    { label: t("admin_teachers"), value: String(stats.teachers), icon: GraduationCap, color: "bg-primary/10 text-primary" },
    { label: t("admin_students"), value: String(stats.students), icon: Users, color: "bg-warning/10 text-warning" },
    { label: t("stats_sessions"), value: "0", icon: CalendarCheck, color: "bg-muted text-muted-foreground" },
    { label: t("admin_revenue"), value: "0", icon: TrendingUp, color: "bg-destructive/5 text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <motion.div whileHover={{ scale: 1.15, rotate: 15 }}><Shield size={20} className="text-primary" /></motion.div>
            <h1 className="text-2xl font-extrabold">{t("admin_title")}</h1>
          </div>
          <p className="text-muted-foreground text-sm">{t("admin_subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card-base p-5">
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.15, rotate: 10 }} className={`icon-box ${s.color}`}>
                  <s.icon size={20} />
                </motion.div>
                <div>
                  <div className="text-2xl font-black">{s.value}</div>
                  <div className="text-muted-foreground text-xs">{s.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="card-base overflow-hidden">
          <div className="flex border-b bg-secondary/30">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${activeTab === tab.id ? "bg-card text-foreground border-b-2 border-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}>
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}><tab.icon size={16} /></motion.div>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("search_placeholder")} className="input-base !pr-10 !py-2.5 text-sm" />
            </div>
          </div>

          {activeTab === "teachers" && (
            loading ? (
              <div className="p-16 text-center">
                <Loader2 className="mx-auto animate-spin text-muted-foreground mb-3" size={32} />
                <p className="text-muted-foreground text-sm">جاري التحميل...</p>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="p-16 text-center">
                <GraduationCap size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">{searchQuery ? "لا توجد نتائج للبحث" : "لا يوجد معلمون مسجلون بعد"}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_teacher")}</th>
                      <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_university")}</th>
                      <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_subjects")}</th>
                      <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_status")}</th>
                      <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((tc) => (
                      <tr key={tc.user_id} className="border-t hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="icon-box bg-primary/10">
                              <GraduationCap size={18} className="text-primary" />
                            </motion.div>
                            <div>
                              <div className="font-bold text-sm">{tc.full_name || "—"}</div>
                              <div className="text-muted-foreground text-xs">{tc.price} {t("sar")} / {t("teacher_per_session")}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm">{tc.university || "—"}</td>
                        <td className="p-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {tc.subjects.length > 0
                              ? tc.subjects.slice(0, 2).map((s, i) => <span key={i} className="tag-outline text-[0.7rem]">{s}</span>)
                              : <span className="text-muted-foreground text-xs">—</span>}
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
                              <button onClick={() => handleVerify(tc.user_id)} className="text-xs bg-success/10 text-success px-3 py-1.5 rounded-lg font-semibold hover:bg-success/20 transition-colors">
                                {t("admin_verify")}
                              </button>
                            )}
                            <button onClick={() => handleDelete(tc.user_id)} className="text-xs bg-destructive/10 text-destructive px-3 py-1.5 rounded-lg font-semibold hover:bg-destructive/20 transition-colors">
                              {t("admin_delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {activeTab !== "teachers" && (
            <div className="p-16 text-center">
              <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="inline-block">
                <GraduationCap size={40} className="mx-auto text-muted-foreground/30 mb-3" />
              </motion.div>
              <p className="text-muted-foreground">{t("admin_developing")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
