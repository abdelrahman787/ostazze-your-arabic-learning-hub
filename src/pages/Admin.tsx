import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mockTeachers } from "@/data/mockData";
import { Menu } from "lucide-react";

const Admin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    { icon: "📊", label: "نظرة عامة", tab: "overview" },
    { icon: "👥", label: "المستخدمون", tab: "users" },
    { icon: "👨‍🏫", label: "المعلمون", tab: "teachers" },
    { icon: "📅", label: "الجلسات", tab: "sessions" },
    { icon: "📂", label: "التصنيفات", tab: "categories" },
    { icon: "📖", label: "المواد", tab: "subjects" },
    { icon: "🎓", label: "الجامعات", tab: "universities" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed lg:static inset-y-0 right-0 z-40 w-[260px] bg-card border-l flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b"><Link to="/" className="text-xl font-black text-primary">🎓 OSTAZZE</Link><div className="text-xs text-muted-foreground mt-1">لوحة الإدارة</div></div>
        <nav className="flex-1 overflow-y-auto p-4">
          {sidebarLinks.map((item) => (
            <button key={item.tab} onClick={() => { setTab(item.tab); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-colors mb-1 ${tab === item.tab ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-primary-light hover:text-primary-dark"}`}>
              <span>{item.icon}</span>{item.label}
            </button>
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
            <h2 className="font-bold">لوحة الإدارة</h2>
          </div>
        </header>

        <div className="p-6">
          {tab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "إجمالي المستخدمين", value: "1,250", icon: "👥" },
                  { label: "المعلمون", value: "200", icon: "👨‍🏫" },
                  { label: "الجلسات الكلية", value: "12,500", icon: "📅" },
                  { label: "إجمالي الإيرادات", value: "450K ر.س", icon: "💰" },
                ].map((s) => (
                  <div key={s.label} className="card-base p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground text-sm">{s.label}</span>
                      <span className="text-2xl">{s.icon}</span>
                    </div>
                    <div className="text-xl font-black text-primary">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "teachers" && (
            <div className="card-base overflow-x-auto animate-fade-in">
              <table className="w-full text-sm">
                <thead><tr className="bg-secondary">
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">#</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">الاسم</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">السعر</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">التقييم</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">التوثيق</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">الإجراء</th>
                </tr></thead>
                <tbody>
                  {mockTeachers.map((t, i) => (
                    <tr key={t.id} className="border-t hover:bg-secondary/50">
                      <td className="p-4 text-muted-foreground">{i + 1}</td>
                      <td className="p-4 font-bold">{t.name}</td>
                      <td className="p-4">{t.price} ر.س</td>
                      <td className="p-4">{t.rating} ★</td>
                      <td className="p-4">
                        {t.verified
                          ? <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-semibold">موثق ✓</span>
                          : <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full font-semibold">غير موثق</span>}
                      </td>
                      <td className="p-4">
                        {!t.verified && <button className="text-xs bg-success/10 text-success px-3 py-1 rounded-[10px] font-semibold">توثيق ✓</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "users" && (
            <div className="card-base overflow-x-auto animate-fade-in">
              <table className="w-full text-sm">
                <thead><tr className="bg-secondary">
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">#</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">الاسم</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">البريد</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">النوع</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">الحالة</th>
                  <th className="text-start p-4 font-bold text-muted-foreground text-xs">الإجراء</th>
                </tr></thead>
                <tbody>
                  {[
                    { name: "عبدالله المالكي", email: "abdullah@email.com", type: "طالب", active: true },
                    { name: "د. أحمد الراشد", email: "ahmed@email.com", type: "معلم", active: true },
                    { name: "نورا الشمري", email: "noura@email.com", type: "طالب", active: false },
                  ].map((u, i) => (
                    <tr key={i} className="border-t hover:bg-secondary/50">
                      <td className="p-4 text-muted-foreground">{i + 1}</td>
                      <td className="p-4 font-bold">{u.name}</td>
                      <td className="p-4 text-muted-foreground">{u.email}</td>
                      <td className="p-4"><span className="badge-brand text-xs">{u.type}</span></td>
                      <td className="p-4">{u.active ? <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-semibold">نشط</span> : <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full font-semibold">موقف</span>}</td>
                      <td className="p-4"><button className={`text-xs px-3 py-1 rounded-[10px] font-semibold ${u.active ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>{u.active ? "إيقاف" : "تفعيل"}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!["overview", "teachers", "users"].includes(tab) && (
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

export default Admin;
