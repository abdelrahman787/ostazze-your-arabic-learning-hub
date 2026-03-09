import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockSessions } from "@/data/mockData";
import { Menu, LogOut, LayoutDashboard, CalendarCheck, User, Clock, Wallet, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const { t, d } = useLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statusMap: Record<string, { label: string; cls: string }> = {
    pending: { label: t("status_pending"), cls: "bg-warning/10 text-warning" },
    confirmed: { label: t("status_confirmed"), cls: "bg-success/10 text-success" },
    completed: { label: t("status_completed"), cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    cancelled: { label: t("status_cancelled"), cls: "bg-destructive/10 text-destructive" },
  };

  const sidebarLinks = [
    { section: t("section_main"), items: [{ icon: LayoutDashboard, label: t("dash_overview"), tab: "overview" }] },
    { section: t("section_as_teacher"), items: [
      { icon: CalendarCheck, label: t("tdash_student_sessions"), tab: "sessions" },
      { icon: User, label: t("tdash_edit_profile"), tab: "profile" },
      { icon: Clock, label: t("tdash_availability"), tab: "availability" },
      { icon: Wallet, label: t("tdash_earnings"), tab: "earnings" },
    ]},
  ];

  const days = [t("day_sun"), t("day_mon"), t("day_tue"), t("day_wed"), t("day_thu"), t("day_fri"), t("day_sat")];

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed lg:static inset-y-0 right-0 z-40 w-[260px] bg-card border-l flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b"><Link to="/" className="text-xl font-black text-primary tracking-tight">OSTAZZE</Link></div>
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
            <h2 className="font-bold">{t("tdash_title")}</h2>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{user?.name?.charAt(0) || "م"}</div>
        </header>

        <div className="p-6">
          {tab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: t("dash_total_sessions"), value: "45", icon: CalendarCheck, color: "bg-primary/10 text-primary" },
                  { label: t("tdash_today_sessions"), value: "3", icon: Clock, color: "bg-success/10 text-success" },
                  { label: t("tdash_total_earnings"), value: "6,750 " + t("sar"), icon: Wallet, color: "bg-warning/10 text-warning" },
                  { label: t("tdash_avg_rating"), value: "4.9 ★", icon: GraduationCap, color: "bg-primary/10 text-primary" },
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
                <h3 className="text-xl font-extrabold mb-2">{t("tdash_welcome")} 👋</h3>
                <p className="opacity-90 text-sm">{t("tdash_welcome_sub")}</p>
              </div>
            </div>
          )}

          {tab === "sessions" && (
            <div className="card-base overflow-x-auto animate-fade-in">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/60">
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_student")}</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_subject")}</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_date")}</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_price")}</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_status")}</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">{t("th_action")}</th>
                </tr></thead>
                <tbody>
                  {mockSessions.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-bold">{d(s.teacherName)}</td>
                      <td className="p-4">{d(s.subject)}</td>
                      <td className="p-4 text-muted-foreground">{s.date}</td>
                      <td className="p-4 font-bold text-primary">{s.price} {t("sar")}</td>
                      <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusMap[s.status].cls}`}>{statusMap[s.status].label}</span></td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {s.status === "pending" && <><button className="text-xs bg-success/10 text-success px-3 py-1 rounded-lg font-semibold">{t("action_confirm")}</button><button className="text-xs bg-destructive/10 text-destructive px-3 py-1 rounded-lg font-semibold">{t("action_cancel")}</button></>}
                          {s.status === "confirmed" && <><button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold">{t("action_complete")}</button><button className="text-xs bg-destructive/10 text-destructive px-3 py-1 rounded-lg font-semibold">{t("action_cancel")}</button></>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "profile" && (
            <div className="card-base p-6 animate-fade-in max-w-2xl">
              <h3 className="font-extrabold text-lg mb-6">{t("tdash_edit_profile")}</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-bold mb-1.5">{t("tdash_academic_title")}</label><input className="input-base" /></div>
                <div><label className="block text-sm font-bold mb-1.5">{t("tdash_bio")}</label><textarea rows={4} className="input-base resize-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold mb-1.5">{t("tdash_session_price")}</label><input type="number" className="input-base" placeholder="150" /></div>
                  <div><label className="block text-sm font-bold mb-1.5">{t("tdash_years_exp")}</label><input type="number" className="input-base" placeholder="5" /></div>
                </div>
                <div><label className="block text-sm font-bold mb-1.5">{t("tdash_zoom_link")}</label><input className="input-base" placeholder="https://zoom.us/j/..." /></div>
                <button className="btn-primary">{t("dash_save")}</button>
              </div>
            </div>
          )}

          {tab === "availability" && (
            <div className="card-base p-6 animate-fade-in max-w-2xl">
              <h3 className="font-extrabold text-lg mb-6">{t("tdash_availability")}</h3>
              <div className="space-y-3">
                {days.map((day) => (
                  <div key={day} className="flex items-center gap-4 p-3 bg-secondary rounded-xl">
                    <input type="checkbox" className="w-4 h-4 accent-primary" />
                    <span className="font-bold text-sm w-20">{day}</span>
                    <input type="time" className="input-base !w-auto" defaultValue="09:00" />
                    <span className="text-muted-foreground">{t("tdash_to")}</span>
                    <input type="time" className="input-base !w-auto" defaultValue="17:00" />
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-4">{t("tdash_save_schedule")}</button>
            </div>
          )}

          {tab === "earnings" && (
            <div className="card-base p-12 text-center animate-fade-in">
              <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="inline-block mb-4">
                <Wallet size={48} className="text-warning" />
              </motion.div>
              <h3 className="font-extrabold text-xl mb-2">{t("tdash_total_earnings_val")}</h3>
              <p className="text-muted-foreground">{t("tdash_earnings_coming")}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
