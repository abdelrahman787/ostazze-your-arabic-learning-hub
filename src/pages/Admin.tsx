import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { mockTeachers } from "@/data/mockData";
import {
  GraduationCap, Users, CalendarCheck, TrendingUp, Search, Plus,
  Shield, Video, BookOpen, ArrowUpLeft
} from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { id: "teachers", label: "المعلمون", icon: GraduationCap },
  { id: "admins", label: "المشرفون", icon: Shield },
  { id: "videos", label: "الفيديوهات", icon: Video },
  { id: "content", label: "المحتوى", icon: BookOpen },
];

const Admin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("teachers");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "المعلمون", value: "0", icon: GraduationCap, color: "bg-primary/10 text-primary" },
    { label: "الطلاب", value: "0", icon: Users, color: "bg-warning/10 text-warning" },
    { label: "الجلسات", value: "0", icon: CalendarCheck, color: "bg-muted text-muted-foreground" },
    { label: "الإيرادات", value: "0", icon: TrendingUp, color: "bg-destructive/5 text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <Shield size={20} className="text-primary" />
            <h1 className="text-2xl font-extrabold">لوحة الإدارة</h1>
          </div>
          <p className="text-muted-foreground text-sm">إدارة المعلمين والمشرفين والمحتوى</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card-base p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`icon-box ${s.color}`}>
                  <s.icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-black">{s.value}</div>
                  <div className="text-muted-foreground text-xs">{s.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card-base overflow-hidden">
          <div className="flex border-b bg-secondary/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-card text-foreground border-b-2 border-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث عن معلم..."
                className="input-base !pr-10 !py-2.5 text-sm"
              />
            </div>
            <button className="btn-primary !py-2.5 text-sm flex items-center gap-2">
              <Plus size={16} />
              إضافة معلم
            </button>
          </div>

          {/* Table */}
          {activeTab === "teachers" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">المعلم</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">الجامعة</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">المواد</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">الحالة</th>
                    <th className="text-start p-4 font-bold text-muted-foreground text-xs">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTeachers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-16 text-center">
                        <GraduationCap size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground">لا يوجد معلمون</p>
                      </td>
                    </tr>
                  ) : (
                    mockTeachers.map((t) => (
                      <tr key={t.id} className="border-t hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="icon-box bg-primary/10">
                              <GraduationCap size={18} className="text-primary" />
                            </div>
                            <div>
                              <div className="font-bold text-sm">{t.name}</div>
                              <div className="text-muted-foreground text-xs">{t.price} ر.س / جلسة</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-sm">{t.university || "—"}</td>
                        <td className="p-4">
                          <div className="flex gap-1.5">
                            {t.subjects.slice(0, 2).map((s) => (
                              <span key={s} className="tag-outline text-[0.7rem]">{s}</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          {t.verified ? (
                            <span className="text-xs bg-success/10 text-success px-2.5 py-1 rounded-full font-semibold">موثق</span>
                          ) : (
                            <span className="text-xs bg-warning/10 text-warning px-2.5 py-1 rounded-full font-semibold">قيد المراجعة</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {!t.verified && (
                              <button className="text-xs bg-success/10 text-success px-3 py-1.5 rounded-lg font-semibold hover:bg-success/20 transition-colors">
                                توثيق
                              </button>
                            )}
                            <button className="text-xs bg-destructive/10 text-destructive px-3 py-1.5 rounded-lg font-semibold hover:bg-destructive/20 transition-colors">
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab !== "teachers" && (
            <div className="p-16 text-center">
              <GraduationCap size={40} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">قسم قيد التطوير</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
