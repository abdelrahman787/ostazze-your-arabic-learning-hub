import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mockSessions } from "@/data/mockData";
import { Menu } from "lucide-react";

const statusMap: Record<string, { label: string; cls: string }> = {
  pending: { label: "قيد الانتظار", cls: "bg-warning/10 text-warning" },
  confirmed: { label: "مؤكدة", cls: "bg-success/10 text-success" },
  completed: { label: "مكتملة", cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  cancelled: { label: "ملغية", cls: "bg-destructive/10 text-destructive" },
};

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    { section: "الرئيسية", items: [{ icon: "📊", label: "نظرة عامة", tab: "overview" }] },
    { section: "كمعلم", items: [
      { icon: "📅", label: "جلسات الطلاب", tab: "sessions" },
      { icon: "✏️", label: "تعديل الملف الشخصي", tab: "profile" },
      { icon: "🗓️", label: "مواعيد الإتاحة", tab: "availability" },
      { icon: "💰", label: "الأرباح", tab: "earnings" },
    ]},
  ];

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed lg:static inset-y-0 right-0 z-40 w-[260px] bg-card border-l flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b"><Link to="/" className="text-xl font-black text-primary">🎓 OSTAZZE</Link></div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {sidebarLinks.map((s) => (
            <div key={s.section}>
              <div className="text-xs font-bold text-muted-foreground mb-2 px-3">{s.section}</div>
              {s.items.map((item) => (
                <button key={item.tab} onClick={() => { setTab(item.tab); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-colors mb-1 ${tab === item.tab ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-primary-light hover:text-primary-dark"}`}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-destructive hover:bg-destructive/10 transition-colors">🚪 تسجيل الخروج</button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 min-w-0">
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu size={20} /></button>
            <h2 className="font-bold">لوحة تحكم المعلم</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{user?.name?.charAt(0) || "م"}</div>
          </div>
        </header>

        <div className="p-6">
          {tab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "إجمالي الجلسات", value: "45", icon: "📅", color: "text-primary" },
                  { label: "جلسات اليوم", value: "3", icon: "🗓️", color: "text-success" },
                  { label: "إجمالي الأرباح", value: "6,750 ر.س", icon: "💰", color: "text-warning" },
                  { label: "متوسط التقييم", value: "4.9 ★", icon: "⭐", color: "text-primary" },
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
                <h3 className="text-xl font-extrabold mb-2">مرحباً أيها المعلم! 👋</h3>
                <p className="opacity-90 text-sm">لديك 3 جلسات اليوم. تأكد من مراجعة جدولك.</p>
              </div>
            </div>
          )}

          {tab === "sessions" && (
            <div className="card-base overflow-x-auto animate-fade-in">
              <table className="w-full text-sm">
                <thead><tr className="bg-secondary">
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">الطالب</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">المادة</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">التاريخ</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">السعر</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">الحالة</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">الإجراء</th>
                </tr></thead>
                <tbody>
                  {mockSessions.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-secondary/50">
                      <td className="p-4 font-bold">{s.teacherName}</td>
                      <td className="p-4">{s.subject}</td>
                      <td className="p-4 text-muted-foreground">{s.date}</td>
                      <td className="p-4 font-bold text-primary">{s.price} ر.س</td>
                      <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusMap[s.status].cls}`}>{statusMap[s.status].label}</span></td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {s.status === "pending" && <><button className="text-xs bg-success/10 text-success px-3 py-1 rounded-[10px] font-semibold">تأكيد</button><button className="text-xs bg-destructive/10 text-destructive px-3 py-1 rounded-[10px] font-semibold">إلغاء</button></>}
                          {s.status === "confirmed" && <><button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-[10px] font-semibold">إكمال</button><button className="text-xs bg-destructive/10 text-destructive px-3 py-1 rounded-[10px] font-semibold">إلغاء</button></>}
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
              <h3 className="font-extrabold text-lg mb-6">تعديل الملف الشخصي</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-bold mb-1.5">لقبك الأكاديمي</label><input className="input-base" placeholder="دكتوراه في..." /></div>
                <div><label className="block text-sm font-bold mb-1.5">نبذة تعريفية</label><textarea rows={4} className="input-base resize-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold mb-1.5">سعر الجلسة (ر.س)</label><input type="number" className="input-base" placeholder="150" /></div>
                  <div><label className="block text-sm font-bold mb-1.5">سنوات الخبرة</label><input type="number" className="input-base" placeholder="5" /></div>
                </div>
                <div><label className="block text-sm font-bold mb-1.5">رابط Zoom</label><input className="input-base" placeholder="https://zoom.us/j/..." /></div>
                <button className="btn-primary">حفظ التغييرات</button>
              </div>
            </div>
          )}

          {tab === "availability" && (
            <div className="card-base p-6 animate-fade-in max-w-2xl">
              <h3 className="font-extrabold text-lg mb-6">مواعيد الإتاحة</h3>
              <div className="space-y-3">
                {["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"].map((day) => (
                  <div key={day} className="flex items-center gap-4 p-3 bg-secondary rounded-[10px]">
                    <input type="checkbox" className="w-4 h-4 accent-primary" />
                    <span className="font-bold text-sm w-20">{day}</span>
                    <input type="time" className="input-base !w-auto" defaultValue="09:00" />
                    <span className="text-muted-foreground">إلى</span>
                    <input type="time" className="input-base !w-auto" defaultValue="17:00" />
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-4">حفظ المواعيد</button>
            </div>
          )}

          {tab === "earnings" && (
            <div className="card-base p-12 text-center animate-fade-in">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="font-extrabold text-xl mb-2">إجمالي الأرباح: 6,750 ر.س</h3>
              <p className="text-muted-foreground">تفاصيل الأرباح ستتوفر قريباً</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
