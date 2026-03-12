import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Menu, LogOut, LayoutDashboard, BookOpen, User, Clock, Wallet,
  GraduationCap, Video, FileText, MessageSquare, Loader2, ArrowLeft, CalendarCheck
} from "lucide-react";
import { motion } from "framer-motion";
import NotificationBell from "@/components/NotificationBell";
import TeacherAvailabilityManager from "@/components/TeacherAvailabilityManager";
import BookingManager from "@/components/BookingManager";

interface TeacherLecture {
  id: string;
  title: string;
  subject: string | null;
  student_id: string;
  video_url: string | null;
  pdf_url: string | null;
  created_at: string;
  student_name?: string;
}

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [lectures, setLectures] = useState<TeacherLecture[]>([]);
  const [lecturesLoading, setLecturesLoading] = useState(true);
  const [stats, setStats] = useState({ totalLectures: 0, totalStudents: 0 });

  const fetchLectures = useCallback(async () => {
    if (!user) return;
    setLecturesLoading(true);
    const { data } = await supabase
      .from("lectures")
      .select("id, title, subject, student_id, video_url, pdf_url, created_at")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      const studentIds = [...new Set(data.map((l) => l.student_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", studentIds);
      const pMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);

      const mapped = data.map((l) => ({
        ...l,
        student_name: pMap.get(l.student_id) || "—",
      }));
      setLectures(mapped);
      setStats({ totalLectures: mapped.length, totalStudents: studentIds.length });
    } else {
      setLectures([]);
      setStats({ totalLectures: 0, totalStudents: 0 });
    }
    setLecturesLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  const sidebarLinks = [
    { section: t("section_main"), items: [
      { icon: LayoutDashboard, label: t("dash_overview"), tab: "overview" },
    ]},
    { section: t("sidebar_teaching"), items: [
      { icon: BookOpen, label: t("sidebar_my_lectures"), tab: "lectures" },
      { icon: CalendarCheck, label: t("sidebar_bookings"), tab: "bookings" },
      { icon: Clock, label: t("sidebar_available_times"), tab: "availability" },
      { icon: Wallet, label: t("sidebar_my_earnings"), tab: "earnings" },
    ]},
    { section: t("section_account"), items: [
      { icon: User, label: t("sidebar_profile"), tab: "profile" },
    ]},
  ];

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed lg:static inset-y-0 right-0 z-40 w-[260px] bg-card border-l flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b">
          <Link to="/" className="text-xl font-black text-primary tracking-tight">OSTAZZE</Link>
          <p className="text-xs text-muted-foreground mt-0.5">{t("sidebar_teacher_dashboard")}</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {sidebarLinks.map((s) => (
            <div key={s.section}>
              <div className="text-xs font-bold text-muted-foreground mb-2 px-3">{s.section}</div>
              {s.items.map((item) => (
                <button key={item.tab} onClick={() => { setTab(item.tab); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mb-1 ${tab === item.tab ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"}`}>
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

      <main className="flex-1 min-w-0">
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu size={20} /></button>
            <h2 className="font-bold">
              {tab === "overview" ? t("dash_overview") : tab === "lectures" ? t("sidebar_my_lectures") : tab === "profile" ? t("sidebar_profile") : tab === "availability" ? t("sidebar_available_times") : tab === "bookings" ? t("sidebar_bookings") : t("sidebar_my_earnings")}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{user?.name?.charAt(0) || "م"}</div>
            <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
          </div>
        </header>

        <div className="p-6">
          {tab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: t("stat_total_lectures"), value: String(stats.totalLectures), icon: BookOpen, color: "bg-primary/10 text-primary" },
                  { label: t("stat_num_students"), value: String(stats.totalStudents), icon: GraduationCap, color: "bg-success/10 text-success" },
                  { label: t("stat_total_earnings"), value: "0 " + t("sar"), icon: Wallet, color: "bg-warning/10 text-warning" },
                  { label: t("stat_rating"), value: "—", icon: Clock, color: "bg-muted text-muted-foreground" },
                ].map((s) => (
                  <div key={s.label} className="card-base p-5">
                    <div className="flex items-center gap-3">
                      <motion.div whileHover={{ scale: 1.15, rotate: 10 }} className={`icon-box ${s.color}`}><s.icon size={20} /></motion.div>
                      <div><div className="text-xl font-black">{s.value}</div><div className="text-muted-foreground text-xs">{s.label}</div></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="stats-gradient rounded-2xl p-7 text-primary-foreground">
                <h3 className="text-xl font-extrabold mb-2">{t("welcome_teacher")} {user?.name} 👋</h3>
                <p className="opacity-90 text-sm">{t("welcome_teacher_sub")}</p>
              </div>

              <div className="card-base p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold">{t("recent_lectures")}</h3>
                  {lectures.length > 3 && (
                    <button onClick={() => setTab("lectures")} className="text-primary text-sm font-bold hover:underline">{t("view_all")}</button>
                  )}
                </div>
                {lecturesLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={24} /></div>
                ) : lectures.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-6">{t("no_lectures_recorded")}</p>
                ) : (
                  <div className="space-y-3">
                    {lectures.slice(0, 3).map((lec) => (
                      <Link key={lec.id} to={`/lectures/${lec.id}`} className="flex items-center justify-between p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="icon-box bg-primary/10"><BookOpen size={16} className="text-primary" /></div>
                          <div>
                            <div className="font-bold text-sm group-hover:text-primary transition-colors">{lec.title}</div>
                            <div className="text-muted-foreground text-xs">{t("the_student")}: {lec.student_name} {lec.subject && `• ${lec.subject}`}</div>
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
          )}

          {tab === "lectures" && (
            <div className="animate-fade-in">
              {lecturesLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
              ) : lectures.length === 0 ? (
                <div className="card-base p-12 text-center">
                  <BookOpen size={48} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">{t("no_lectures_recorded")}</p>
                  <p className="text-muted-foreground text-xs mt-1">{t("admin_adds_lectures")}</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {lectures.map((lec, i) => (
                    <motion.div key={lec.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link to={`/lectures/${lec.id}`} className="card-base p-5 block hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{lec.title}</h4>
                            {lec.subject && <span className="tag-outline text-[0.65rem] mt-1 inline-block">{lec.subject}</span>}
                          </div>
                          <ArrowLeft size={16} className="text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center text-xs font-bold">{lec.student_name?.charAt(0) || "ط"}</div>
                          <span className="text-sm text-muted-foreground">{t("the_student")}: <span className="text-foreground font-medium">{lec.student_name}</span></span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Video size={12} className={lec.video_url ? "text-success" : ""} />
                            {lec.video_url ? t("video_available") : t("no_video")}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText size={12} className={lec.pdf_url ? "text-destructive" : ""} />
                            {lec.pdf_url ? t("pdf_available") : t("no_file")}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={12} />
                            {t("chat_word")}
                          </span>
                        </div>

                        <div className="text-[0.65rem] text-muted-foreground mt-2">
                          {new Date(lec.created_at).toLocaleDateString(lang === "ar" ? "ar" : "en", { year: "numeric", month: "long", day: "numeric" })}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "profile" && (
            <div className="card-base p-6 animate-fade-in max-w-2xl">
              <h3 className="font-extrabold text-lg mb-6">{t("dash_edit_profile")}</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-bold mb-1.5">{t("academic_title")}</label><input className="input-base" placeholder={t("academic_title_placeholder")} /></div>
                <div><label className="block text-sm font-bold mb-1.5">{t("bio_label")}</label><textarea rows={4} className="input-base resize-none" placeholder={t("bio_placeholder")} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold mb-1.5">{t("session_price_label")} ({t("sar")})</label><input type="number" className="input-base" placeholder="150" /></div>
                  <div><label className="block text-sm font-bold mb-1.5">{t("years_experience")}</label><input type="number" className="input-base" placeholder="5" /></div>
                </div>
                <button className="btn-primary">{t("dash_save")}</button>
              </div>
            </div>
          )}

          {tab === "availability" && (
            <div className="animate-fade-in">
              <TeacherAvailabilityManager />
            </div>
          )}

          {tab === "bookings" && (
            <div className="animate-fade-in">
              <BookingManager role="teacher" />
            </div>
          )}

          {tab === "earnings" && (
            <div className="card-base p-12 text-center animate-fade-in">
              <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="inline-block mb-4">
                <Wallet size={48} className="text-warning" />
              </motion.div>
              <h3 className="font-extrabold text-xl mb-2">0 {t("sar")}</h3>
              <p className="text-muted-foreground">{t("earnings_system_dev")}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
