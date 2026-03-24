import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Search, LogOut, Menu, LayoutDashboard, BookOpen, User,
  GraduationCap, Loader2, ArrowLeft, Video, FileText,
  MessageSquare, CalendarCheck, MailWarning,
} from "lucide-react";
import StudentLectures from "@/pages/StudentLectures";
import MyLessons from "@/components/MyLessons";
import NotificationBell from "@/components/NotificationBell";
import BookingManager from "@/components/BookingManager";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface RecentLecture {
  id: string;
  title: string;
  subject: string | null;
  teacher_id: string;
  video_url: string | null;
  pdf_url: string | null;
  teacher_name?: string;
}

const Dashboard = () => {
  const { user, logout, updateProfile, changePassword, resendVerificationEmail } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [recentLectures, setRecentLectures] = useState<RecentLecture[]>([]);
  const [stats, setStats] = useState({ totalLectures: 0, totalTeachers: 0, totalMessages: 0 });
  const [loadingData, setLoadingData] = useState(true);

  // Profile form state
  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "", bio: "" });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form state
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const [resendingEmail, setResendingEmail] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;

    // Fetch 3 most recent lectures for overview
    const { data } = await supabase
      .from("lectures")
      .select("id, title, subject, teacher_id, video_url, pdf_url")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    if (data && data.length > 0) {
      const teacherIds = [...new Set(data.map((l) => l.teacher_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", teacherIds);
      const pMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
      setRecentLectures(
        data.map((l) => ({ ...l, teacher_name: pMap.get(l.teacher_id) || "—" }))
      );
    }

    // Fetch full counts
    const { count: lectureCount } = await supabase
      .from("lectures")
      .select("*", { count: "exact", head: true })
      .eq("student_id", user.id);

    const { data: allLecs } = await supabase
      .from("lectures")
      .select("id, teacher_id")
      .eq("student_id", user.id);

    const uniqueTeachers = new Set(allLecs?.map((l) => l.teacher_id) || []);

    // Count distinct conversations (chat threads this student participated in)
    let chatCount = 0;
    if (allLecs && allLecs.length > 0) {
      const lectureIds = allLecs.map((l) => l.id);
      const { data: msgData } = await supabase
        .from("chat_messages")
        .select("lecture_id")
        .eq("sender_id", user.id)
        .in("lecture_id", lectureIds);
      chatCount = new Set(msgData?.map((m) => m.lecture_id) || []).size;
    }

    setStats({
      totalLectures: lectureCount || 0,
      totalTeachers: uniqueTeachers.size,
      totalMessages: chatCount,
    });
    setLoadingData(false);
  }, [user]);

  // Load profile data into the form on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, bio")
        .eq("user_id", user.id)
        .maybeSingle();
      setProfileForm({
        fullName: data?.full_name || user.name || "",
        phone: data?.phone || "",
        bio: data?.bio || "",
      });
    };
    loadProfile();
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    const result = await updateProfile({
      full_name: profileForm.fullName,
      bio: profileForm.bio,
      phone: profileForm.phone,
    });
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(t("profile_saved"));
    }
    setProfileSaving(false);
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

  const handleResendEmail = async () => {
    setResendingEmail(true);
    const result = await resendVerificationEmail();
    if (result.error) toast.error(result.error);
    else toast.success(t("email_resent"));
    setResendingEmail(false);
  };

  const sidebarLinks = [
    {
      section: t("section_main"),
      items: [{ icon: LayoutDashboard, label: t("dash_overview"), tab: "overview" }],
    },
    {
      section: t("section_as_student"),
      items: [
        { icon: Search, label: t("sidebar_find_teacher"), tab: "search", href: "/teachers" },
        { icon: BookOpen, label: t("sidebar_my_lectures"), tab: "lectures" },
        { icon: GraduationCap, label: t("sidebar_my_lessons"), tab: "mylessons" },
        { icon: CalendarCheck, label: t("sidebar_my_bookings"), tab: "bookings" },
      ],
    },
    {
      section: t("section_account"),
      items: [{ icon: User, label: t("dash_profile"), tab: "profile" }],
    },
  ];

  return (
    <div className="flex min-h-screen">
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-40 w-[260px] bg-card border-l flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b">
          <Link to="/" className="text-xl font-black text-primary tracking-tight">
            OSTAZZE
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("sidebar_student_dashboard")}
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {sidebarLinks.map((s) => (
            <div key={s.section}>
              <div className="text-xs font-bold text-muted-foreground mb-2 px-3">
                {s.section}
              </div>
              {s.items.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => {
                    if ((item as any).href) navigate((item as any).href);
                    else setTab(item.tab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mb-1 ${
                    tab === item.tab
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                  }`}
                >
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                    <item.icon size={16} />
                  </motion.div>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={16} /> {t("nav_logout")}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0">
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu size={20} />
            </button>
            <h2 className="font-bold">
              {tab === "overview"
                ? t("dash_overview")
                : tab === "lectures"
                ? t("sidebar_my_lectures")
                : tab === "mylessons"
                ? t("sidebar_my_lessons")
                : tab === "profile"
                ? t("dash_profile")
                : tab === "bookings"
                ? t("sidebar_my_bookings")
                : ""}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
          </div>
        </header>

        <div className="p-6">
          {/* Email verification banner */}
          {user && user.emailVerified === false && (
            <div className="mb-6 bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
              <MailWarning size={20} className="text-warning shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm text-warning">{t("email_not_verified_title")}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{t("email_not_verified_body")}</p>
              </div>
              <button
                onClick={handleResendEmail}
                disabled={resendingEmail}
                className="text-xs font-bold text-warning hover:underline shrink-0 disabled:opacity-50"
              >
                {resendingEmail ? <Loader2 size={14} className="animate-spin" /> : t("resend_email")}
              </button>
            </div>
          )}

          {tab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: t("stat_total_lectures"), value: String(stats.totalLectures), icon: BookOpen, color: "bg-primary/10 text-primary" },
                  { label: t("stat_num_teachers"), value: String(stats.totalTeachers), icon: GraduationCap, color: "bg-success/10 text-success" },
                  { label: t("stat_conversations"), value: String(stats.totalMessages), icon: MessageSquare, color: "bg-warning/10 text-warning" },
                ].map((s) => (
                  <div key={s.label} className="card-base p-5">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        className={`icon-box ${s.color}`}
                      >
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

              <div className="stats-gradient rounded-2xl p-7 text-primary-foreground">
                <h3 className="text-xl font-extrabold mb-2">
                  {t("welcome_student")} {user?.name} 👋
                </h3>
                <p className="opacity-90 text-sm">{t("welcome_student_sub")}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card-base p-6">
                  <h3 className="font-extrabold mb-4">{t("quick_actions")}</h3>
                  <div className="space-y-3">
                    <Link to="/teachers" className="btn-primary block text-center text-sm">
                      {t("sidebar_find_teacher")}
                    </Link>
                    <button
                      onClick={() => setTab("lectures")}
                      className="btn-outline w-full text-sm"
                    >
                      {t("sidebar_my_lectures")}
                    </button>
                  </div>
                </div>
                <div className="card-base p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold">{t("recent_lectures")}</h3>
                    {recentLectures.length > 0 && (
                      <button
                        onClick={() => setTab("lectures")}
                        className="text-primary text-sm font-bold hover:underline"
                      >
                        {t("view_all")}
                      </button>
                    )}
                  </div>
                  {loadingData ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="animate-spin text-primary" size={24} />
                    </div>
                  ) : recentLectures.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      {t("no_lectures_yet")}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentLectures.map((lec) => (
                        <Link
                          key={lec.id}
                          to={`/lectures/${lec.id}`}
                          className="flex items-center justify-between p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="icon-box bg-primary/10">
                              <BookOpen size={16} className="text-primary" />
                            </div>
                            <div>
                              <div className="font-bold text-sm group-hover:text-primary transition-colors">
                                {lec.title}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {t("the_teacher")}: {lec.teacher_name}
                                {lec.subject && ` • ${lec.subject}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lec.video_url && <Video size={14} className="text-success" />}
                            {lec.pdf_url && <FileText size={14} className="text-destructive" />}
                            <ArrowLeft size={14} className="text-muted-foreground group-hover:text-primary" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "lectures" && (
            <div className="animate-fade-in">
              <StudentLectures />
            </div>
          )}

          {tab === "bookings" && (
            <div className="animate-fade-in">
              <BookingManager role="student" />
            </div>
          )}

          {tab === "mylessons" && (
            <div className="animate-fade-in">
              <MyLessons role="student" />
            </div>
          )}

          {tab === "profile" && (
            <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
              <div className="card-base p-6">
                <h3 className="font-extrabold mb-4">{t("dash_edit_profile")}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-1.5">{t("dash_full_name")}</label>
                    <input
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm((f) => ({ ...f, fullName: e.target.value }))}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1.5">{t("dash_phone")}</label>
                    <input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+966"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1.5">{t("dash_bio")}</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm((f) => ({ ...f, bio: e.target.value }))}
                      rows={3}
                      className="input-base resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={profileSaving}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {profileSaving && <Loader2 size={14} className="animate-spin" />}
                    {t("dash_save")}
                  </button>
                </div>
              </div>

              <div className="card-base p-6">
                <h3 className="font-extrabold mb-4">{t("dash_change_password")}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-1.5">{t("dash_current_password")}</label>
                    <input
                      type="password"
                      value={pwForm.current}
                      onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1.5">{t("dash_new_password")}</label>
                    <input
                      type="password"
                      value={pwForm.newPw}
                      onChange={(e) => setPwForm((f) => ({ ...f, newPw: e.target.value }))}
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1.5">{t("register_confirm")}</label>
                    <input
                      type="password"
                      value={pwForm.confirm}
                      onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                      className="input-base"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={pwSaving}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {pwSaving && <Loader2 size={14} className="animate-spin" />}
                    {t("dash_update_password")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* "mylessons" is intentionally listed above so it renders its own panel.
              This guard only shows "coming soon" for truly unknown tabs. */}
          {!["overview", "lectures", "profile", "bookings", "mylessons"].includes(tab) && (
            <div className="card-base p-12 text-center animate-fade-in">
              <GraduationCap size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="font-extrabold text-xl mb-2">{t("coming_soon")}</h3>
              <p className="text-muted-foreground">{t("coming_soon_desc")}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
