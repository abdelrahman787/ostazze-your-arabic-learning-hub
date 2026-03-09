import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { mockTeachers } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  GraduationCap, Users, CalendarCheck, TrendingUp, Search, Plus,
  Shield, Video, BookOpen
} from "lucide-react";
import { motion } from "framer-motion";

const Admin = () => {
  const { logout } = useAuth();
  const { t, d } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("teachers");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "teachers", label: t("admin_teachers"), icon: GraduationCap },
    { id: "admins", label: t("admin_admins"), icon: Shield },
    { id: "videos", label: t("admin_videos"), icon: Video },
    { id: "content", label: t("admin_content"), icon: BookOpen },
  ];

  const stats = [
    { label: t("admin_teachers"), value: "0", icon: GraduationCap, color: "bg-primary/10 text-primary" },
    { label: t("admin_students"), value: "0", icon: Users, color: "bg-warning/10 text-warning" },
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
          {stats.map((s, i) => (
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
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary !py-2.5 text-sm flex items-center gap-2">
              <Plus size={16} />{t("admin_add_teacher")}
            </motion.button>
          </div>

          {activeTab === "teachers" && (
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
                  {mockTeachers.map((tc) => (
                    <tr key={tc.id} className="border-t hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="icon-box bg-primary/10">
                            <GraduationCap size={18} className="text-primary" />
                          </motion.div>
                          <div>
                            <div className="font-bold text-sm">{d(tc.name)}</div>
                            <div className="text-muted-foreground text-xs">{tc.price} {t("sar")} / {t("teacher_per_session")}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{tc.university ? d(tc.university) : "—"}</td>
                      <td className="p-4"><div className="flex gap-1.5">{tc.subjects.slice(0, 2).map((s, i) => <span key={i} className="tag-outline text-[0.7rem]">{d(s)}</span>)}</div></td>
                      <td className="p-4">
                        {tc.verified
                          ? <span className="text-xs bg-success/10 text-success px-2.5 py-1 rounded-full font-semibold">{t("teacher_verified")}</span>
                          : <span className="text-xs bg-warning/10 text-warning px-2.5 py-1 rounded-full font-semibold">{t("admin_under_review")}</span>}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {!tc.verified && <button className="text-xs bg-success/10 text-success px-3 py-1.5 rounded-lg font-semibold hover:bg-success/20 transition-colors">{t("admin_verify")}</button>}
                          <button className="text-xs bg-destructive/10 text-destructive px-3 py-1.5 rounded-lg font-semibold hover:bg-destructive/20 transition-colors">{t("admin_delete")}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
