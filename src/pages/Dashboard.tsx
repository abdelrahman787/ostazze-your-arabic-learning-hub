import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockSessions } from "@/data/mockData";
import { Search, Calendar, CreditCard, Star, Heart, User, MessageSquare, Bell, Settings, LogOut, Menu, LayoutDashboard, CalendarCheck, Wallet, GraduationCap, BookOpen } from "lucide-react";
import StudentLectures from "@/pages/StudentLectures";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { t, d } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionFilter, setSessionFilter] = useState("all");

  const statusMap: Record<string, { label: string; cls: string }> = {
    pending: { label: t("status_pending"), cls: "bg-warning/10 text-warning" },
    confirmed: { label: t("status_confirmed"), cls: "bg-success/10 text-success" },
    completed: { label: t("status_completed"), cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    cancelled: { label: t("status_cancelled"), cls: "bg-destructive/10 text-destructive" },
  };

  const sidebarLinks = [
    { section: t("section_main"), items: [{ icon: LayoutDashboard, label: t("dash_overview"), tab: "overview" }] },
    { section: t("section_as_student"), items: [
      { icon: Search, label: t("dash_search_teacher"), tab: "search", href: "/teachers" },
      { icon: BookOpen, label: "محاضراتي", tab: "lectures" },
      { icon: CalendarCheck, label: t("dash_sessions"), tab: "sessions" },
      { icon: Wallet, label: t("dash_payments"), tab: "payments" },
      { icon: Heart, label: t("dash_favorites"), tab: "favorites" },
    ]},
    { section: t("section_account"), items: [
      { icon: User, label: t("dash_profile"), tab: "profile" },
      { icon: MessageSquare, label: t("dash_messages"), tab: "messages" },
      { icon: Bell, label: t("dash_notifications"), tab: "notifications" },
      { icon: Settings, label: t("dash_settings"), tab: "settings" },
    ]},
  ];

  const filteredSessions = sessionFilter === "all" ? mockSessions : mockSessions.filter((s) => s.status === sessionFilter);

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed lg:static inset-y-0 right-0 z-40 w-[260px] bg-card border-l flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b"><Link to="/" className="text-xl font-black text-primary tracking-tight">OSTAZZE</Link></div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {sidebarLinks.map((s) => (
            <div key={s.section}>
              <div className="text-xs font-bold text-muted-foreground mb-2 px-3">{s.section}</div>
              {s.items.map((item) => (
                <button key={item.tab} onClick={() => { if ((item as any).href) navigate((item as any).href); else setTab(item.tab); setSidebarOpen(false); }}
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
            <h2 className="font-bold">{tab === "overview" ? t("dash_overview") : tab === "sessions" ? t("dash_sessions") : tab === "profile" ? t("dash_profile") : ""}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{user?.name?.charAt(0) || "م"}</div>
            <span className="text-sm font-medium hidden sm:block">{user?.name || t("user_word")}</span>
          </div>
        </header>

        <div className="p-6">
          {tab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: t("dash_total_sessions"), value: "12", icon: CalendarCheck, color: "bg-primary/10 text-primary" },
                  { label: t("dash_upcoming"), value: "3", icon: Calendar, color: "bg-success/10 text-success" },
                  { label: t("dash_total_payments"), value: "1,850 " + t("sar"), icon: Wallet, color: "bg-warning/10 text-warning" },
                  { label: t("dash_given_rating"), value: "4.8 ★", icon: Star, color: "bg-primary/10 text-primary" },
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
                <h3 className="text-xl font-extrabold mb-2">{t("dash_welcome")} 👋</h3>
                <p className="opacity-90 text-sm">{t("dash_welcome_sub")}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card-base p-6">
                  <h3 className="font-extrabold mb-4">{t("dash_quick_actions")}</h3>
                  <div className="space-y-3">
                    <Link to="/teachers" className="btn-primary block text-center text-sm">{t("dash_search_teacher")}</Link>
                    <button onClick={() => setTab("sessions")} className="btn-outline w-full text-sm">{t("dash_sessions")}</button>
                  </div>
                </div>
                <div className="card-base p-6">
                  <h3 className="font-extrabold mb-4">{t("dash_recent_sessions")}</h3>
                  <div className="space-y-3">
                    {mockSessions.slice(0, 3).map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                        <div><div className="font-bold text-sm">{d(s.teacherName)}</div><div className="text-muted-foreground text-xs">{s.date}</div></div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusMap[s.status].cls}`}>{statusMap[s.status].label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "sessions" && (
            <div className="animate-fade-in">
              <div className="flex gap-2 mb-6 flex-wrap">
                {[
                  { key: "all", label: t("status_all") },
                  { key: "pending", label: t("status_pending") },
                  { key: "confirmed", label: t("status_confirmed") },
                  { key: "completed", label: t("status_completed") },
                  { key: "cancelled", label: t("status_cancelled") },
                ].map((f) => (
                  <button key={f.key} onClick={() => setSessionFilter(f.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${sessionFilter === f.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="card-base overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60">
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_teacher")}</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_subject")}</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_date")}</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_price")}</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_status")}</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_action")}</th>
                  </tr></thead>
                  <tbody>
                    {filteredSessions.map((s) => (
                      <tr key={s.id} className="border-t hover:bg-secondary/30 transition-colors">
                        <td className="p-4 font-bold">{d(s.teacherName)}</td>
                        <td className="p-4">{d(s.subject)}</td>
                        <td className="p-4 text-muted-foreground">{s.date}</td>
                        <td className="p-4 font-bold text-primary">{s.price} {t("sar")}</td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusMap[s.status].cls}`}>{statusMap[s.status].label}</span></td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {s.status === "completed" && <button className="text-xs btn-primary !py-1 !px-3">{t("action_rate")}</button>}
                            {s.status === "confirmed" && s.zoomLink && <a href={s.zoomLink} target="_blank" rel="noreferrer" className="text-xs bg-success text-success-foreground px-3 py-1 rounded-lg font-semibold">{t("action_join")} →</a>}
                            {(s.status === "pending" || s.status === "confirmed") && <button className="text-xs bg-destructive/10 text-destructive px-3 py-1 rounded-lg font-semibold">{t("action_cancel")}</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "profile" && (
            <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
              <div className="card-base p-6">
                <h3 className="font-extrabold mb-4">{t("dash_edit_profile")}</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-bold mb-1.5">{t("dash_full_name")}</label><input defaultValue={user?.name} className="input-base" /></div>
                  <div><label className="block text-sm font-bold mb-1.5">{t("dash_phone")}</label><input placeholder="+966" className="input-base" /></div>
                  <div><label className="block text-sm font-bold mb-1.5">{t("dash_bio")}</label><textarea rows={3} className="input-base resize-none" /></div>
                  <button className="btn-primary">{t("dash_save")}</button>
                </div>
              </div>
              <div className="card-base p-6">
                <h3 className="font-extrabold mb-4">{t("dash_change_password")}</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-bold mb-1.5">{t("dash_current_password")}</label><input type="password" className="input-base" /></div>
                  <div><label className="block text-sm font-bold mb-1.5">{t("dash_new_password")}</label><input type="password" className="input-base" /></div>
                  <div><label className="block text-sm font-bold mb-1.5">{t("register_confirm")}</label><input type="password" className="input-base" /></div>
                  <button className="btn-primary">{t("dash_update_password")}</button>
                </div>
              </div>
            </div>
          )}

          {tab === "lectures" && (
            <div className="animate-fade-in">
              <StudentLectures />
            </div>
          )}

          {!["overview", "sessions", "profile", "lectures"].includes(tab) && (
            <div className="card-base p-12 text-center animate-fade-in">
              <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="inline-block mb-4">
                <GraduationCap size={48} className="text-muted-foreground/30" />
              </motion.div>
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
