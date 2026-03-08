import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mockSessions } from "@/data/mockData";
import { Search, Calendar, CreditCard, Star, Heart, User, MessageSquare, Bell, Settings, LogOut, Menu } from "lucide-react";

const statusMap: Record<string, { label: string; cls: string }> = {
  pending: { label: "قيد الانتظار", cls: "bg-warning/10 text-warning" },
  confirmed: { label: "مؤكدة", cls: "bg-success/10 text-success" },
  completed: { label: "مكتملة", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  cancelled: { label: "ملغية", cls: "bg-destructive/10 text-destructive" },
};

const sidebarLinks = [
  { section: "الرئيسية", items: [{ icon: "📊", label: "نظرة عامة", tab: "overview" }] },
  { section: "كطالب", items: [
    { icon: "🔍", label: "ابحث عن معلم", tab: "search", href: "/teachers" },
    { icon: "📅", label: "جلساتي", tab: "sessions" },
    { icon: "💳", label: "المدفوعات", tab: "payments" },
    { icon: "❤️", label: "المعلمون المفضلون", tab: "favorites" },
  ]},
  { section: "الحساب", items: [
    { icon: "👤", label: "ملفي الشخصي", tab: "profile" },
    { icon: "💬", label: "الرسائل", tab: "messages" },
    { icon: "🔔", label: "الإشعارات", tab: "notifications" },
    { icon: "⚙️", label: "الإعدادات", tab: "settings" },
  ]},
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionFilter, setSessionFilter] = useState("all");

  const filteredSessions = sessionFilter === "all" ? mockSessions : mockSessions.filter((s) => s.status === sessionFilter);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-40 w-[260px] bg-card border-l flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b">
          <Link to="/" className="text-xl font-black text-primary">🎓 OSTAZZE</Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {sidebarLinks.map((s) => (
            <div key={s.section}>
              <div className="text-xs font-bold text-muted-foreground mb-2 px-3">{s.section}</div>
              {s.items.map((item) => (
                <button key={item.tab} onClick={() => { if (item.href) navigate(item.href); else setTab(item.tab); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-colors mb-1 ${tab === item.tab ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-primary-light hover:text-primary-dark"}`}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-destructive hover:bg-destructive/10 transition-colors">
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu size={20} /></button>
            <h2 className="font-bold">
              {tab === "overview" && "نظرة عامة"}
              {tab === "sessions" && "جلساتي"}
              {tab === "profile" && "ملفي الشخصي"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0) || "م"}
            </div>
            <span className="text-sm font-medium hidden sm:block">{user?.name || "مستخدم"}</span>
          </div>
        </header>

        <div className="p-6">
          {tab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "إجمالي الجلسات", value: "12", icon: "📅", color: "text-primary" },
                  { label: "الجلسات القادمة", value: "3", icon: "🗓️", color: "text-success" },
                  { label: "إجمالي المدفوعات", value: "1,850 ر.س", icon: "💰", color: "text-warning" },
                  { label: "التقييم المُعطى", value: "4.8 ★", icon: "⭐", color: "text-primary" },
                ].map((s) => (
                  <div key={s.label} className="card-base p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground text-sm">{s.label}</span>
                      <span className="text-2xl">{s.icon}</span>
                    </div>
                    <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div className="stats-gradient rounded-2xl p-7 text-primary-foreground">
                <h3 className="text-xl font-extrabold mb-2">مرحباً بك في Ostazze! 👋</h3>
                <p className="opacity-90 text-sm">ابدأ رحلتك التعليمية واحجز أول جلسة مع أفضل المعلمين</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card-base p-6">
                  <h3 className="font-extrabold mb-4">🚀 إجراءات سريعة</h3>
                  <div className="space-y-3">
                    <Link to="/teachers" className="btn-primary block text-center text-sm">🔍 ابحث عن معلم</Link>
                    <button onClick={() => setTab("sessions")} className="btn-outline w-full text-sm">📅 جلساتي</button>
                  </div>
                </div>
                <div className="card-base p-6">
                  <h3 className="font-extrabold mb-4">📋 آخر الجلسات</h3>
                  <div className="space-y-3">
                    {mockSessions.slice(0, 3).map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 bg-secondary rounded-[10px]">
                        <div>
                          <div className="font-bold text-sm">{s.teacherName}</div>
                          <div className="text-muted-foreground text-xs">{s.date}</div>
                        </div>
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
                  { key: "all", label: "الكل" },
                  { key: "pending", label: "قيد الانتظار" },
                  { key: "confirmed", label: "مؤكدة" },
                  { key: "completed", label: "مكتملة" },
                  { key: "cancelled", label: "ملغية" },
                ].map((f) => (
                  <button key={f.key} onClick={() => setSessionFilter(f.key)}
                    className={`px-4 py-2 rounded-[10px] text-sm font-semibold transition-colors ${sessionFilter === f.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="card-base overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="text-start p-4 font-bold text-muted-foreground text-xs">المعلم</th>
                      <th className="text-start p-4 font-bold text-muted-foreground text-xs">المادة</th>
                      <th className="text-start p-4 font-bold text-muted-foreground text-xs">التاريخ</th>
                      <th className="text-start p-4 font-bold text-muted-foreground text-xs">السعر</th>
                      <th className="text-start p-4 font-bold text-muted-foreground text-xs">الحالة</th>
                      <th className="text-start p-4 font-bold text-muted-foreground text-xs">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((s) => (
                      <tr key={s.id} className="border-t hover:bg-secondary/50 transition-colors">
                        <td className="p-4 font-bold">{s.teacherName}</td>
                        <td className="p-4">{s.subject}</td>
                        <td className="p-4 text-muted-foreground">{s.date}</td>
                        <td className="p-4 font-bold text-primary">{s.price} ر.س</td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusMap[s.status].cls}`}>{statusMap[s.status].label}</span></td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {s.status === "completed" && <button className="text-xs btn-primary !py-1 !px-3">تقييم</button>}
                            {s.status === "confirmed" && s.zoomLink && <a href={s.zoomLink} target="_blank" rel="noreferrer" className="text-xs bg-success text-success-foreground px-3 py-1 rounded-[10px] font-semibold">انضم →</a>}
                            {(s.status === "pending" || s.status === "confirmed") && <button className="text-xs bg-destructive/10 text-destructive px-3 py-1 rounded-[10px] font-semibold">إلغاء</button>}
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
                <h3 className="font-extrabold mb-4">تعديل الملف الشخصي</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-bold mb-1.5">الاسم الكامل</label><input defaultValue={user?.name} className="input-base" /></div>
                  <div><label className="block text-sm font-bold mb-1.5">رقم الهاتف</label><input placeholder="+966" className="input-base" /></div>
                  <div><label className="block text-sm font-bold mb-1.5">نبذة</label><textarea rows={3} className="input-base resize-none" /></div>
                  <button className="btn-primary">حفظ التغييرات</button>
                </div>
              </div>
              <div className="card-base p-6">
                <h3 className="font-extrabold mb-4">تغيير كلمة المرور</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-bold mb-1.5">كلمة المرور الحالية</label><input type="password" className="input-base" /></div>
                  <div><label className="block text-sm font-bold mb-1.5">كلمة المرور الجديدة</label><input type="password" className="input-base" /></div>
                  <div><label className="block text-sm font-bold mb-1.5">تأكيد كلمة المرور</label><input type="password" className="input-base" /></div>
                  <button className="btn-primary">تحديث كلمة المرور</button>
                </div>
              </div>
            </div>
          )}

          {!["overview", "sessions", "profile"].includes(tab) && (
            <div className="card-base p-12 text-center animate-fade-in">
              <div className="text-5xl mb-4">🚧</div>
              <h3 className="font-extrabold text-xl mb-2">قريباً</h3>
              <p className="text-muted-foreground">هذا القسم قيد التطوير</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
