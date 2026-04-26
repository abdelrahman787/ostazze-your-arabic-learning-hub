import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, Clock, BookOpen, User, Sparkles, CheckCircle2,
  XCircle, CreditCard, Loader2, Inbox, Video, MessageSquare, AlertCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

type RequestStatus =
  | "pending"
  | "pending_payment"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "completed";

interface SessionRequest {
  id: string;
  teacher_id: string | null;
  subject: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: RequestStatus;
  notes: string | null;
  reject_reason: string | null;
  zoom_url: string | null;
  created_at: string;
  teacher_name?: string | null;
  teacher_avatar?: string | null;
}

const statusMeta = (
  status: RequestStatus,
  lang: "ar" | "en"
): { label: string; tone: string; Icon: typeof CheckCircle2 } => {
  const map: Record<RequestStatus, { ar: string; en: string; tone: string; Icon: typeof CheckCircle2 }> = {
    pending: {
      ar: "بانتظار التأكيد",
      en: "Awaiting confirmation",
      tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      Icon: Loader2,
    },
    pending_payment: {
      ar: "بانتظار الدفع",
      en: "Pending payment",
      tone: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
      Icon: CreditCard,
    },
    confirmed: {
      ar: "مؤكدة ✅",
      en: "Confirmed ✅",
      tone: "bg-success/10 text-success border-success/30",
      Icon: CheckCircle2,
    },
    rejected: {
      ar: "مرفوضة",
      en: "Rejected",
      tone: "bg-destructive/10 text-destructive border-destructive/30",
      Icon: XCircle,
    },
    cancelled: {
      ar: "ملغاة",
      en: "Cancelled",
      tone: "bg-muted text-muted-foreground border-border",
      Icon: XCircle,
    },
    completed: {
      ar: "مكتملة",
      en: "Completed",
      tone: "bg-primary/10 text-primary border-primary/30",
      Icon: CheckCircle2,
    },
  };
  const m = map[status] || map.pending;
  return { label: lang === "ar" ? m.ar : m.en, tone: m.tone, Icon: m.Icon };
};

const formatDate = (date: string | null, lang: "ar" | "en") => {
  if (!date) return lang === "ar" ? "غير محدد" : "Not set";
  try {
    return new Date(date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
};

const formatTime = (time: string | null, lang: "ar" | "en") => {
  if (!time) return lang === "ar" ? "غير محدد" : "Not set";
  // Time stored as HH:MM:SS — drop seconds
  const [h, m] = time.split(":");
  if (!h || !m) return time;
  const d = new Date();
  d.setHours(parseInt(h, 10), parseInt(m, 10));
  return d.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const RequestCardSkeleton = () => (
  <div className="card-base p-5 space-y-3">
    <div className="flex items-start justify-between">
      <Skeleton className="h-6 w-32 rounded-lg" />
      <Skeleton className="h-7 w-24 rounded-full" />
    </div>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-10 w-full rounded-xl" />
  </div>
);

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "past">("all");

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("session_requests")
        .select("id, teacher_id, subject, preferred_date, preferred_time, status, notes, reject_reason, zoom_url, created_at")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[MyBookings] load error:", error);
        setLoading(false);
        return;
      }

      const rows = (data || []) as SessionRequest[];

      // Fetch teacher profiles in one shot
      const teacherIds = [...new Set(rows.map((r) => r.teacher_id).filter(Boolean) as string[])];
      let profileMap = new Map<string, { full_name: string | null; avatar_url: string | null }>();
      if (teacherIds.length > 0) {
        const { data: profiles } = await supabase.rpc("get_public_profiles", { _user_ids: teacherIds });
        profileMap = new Map(
          (profiles || []).map((p: any) => [
            p.user_id,
            {
              full_name: lang === "ar" ? p.full_name : p.full_name_en || p.full_name,
              avatar_url: p.avatar_url,
            },
          ])
        );
      }

      const enriched = rows.map((r) => ({
        ...r,
        teacher_name: r.teacher_id ? profileMap.get(r.teacher_id)?.full_name || null : null,
        teacher_avatar: r.teacher_id ? profileMap.get(r.teacher_id)?.avatar_url || null : null,
      }));

      setRequests(enriched);
      setLoading(false);
    };
    if (!authLoading) load();
  }, [user, authLoading, lang]);

  const filtered = requests.filter((r) => {
    if (filter === "active") return ["pending", "pending_payment", "confirmed"].includes(r.status);
    if (filter === "past") return ["rejected", "cancelled", "completed"].includes(r.status);
    return true;
  });

  const counts = {
    all: requests.length,
    active: requests.filter((r) => ["pending", "pending_payment", "confirmed"].includes(r.status)).length,
    past: requests.filter((r) => ["rejected", "cancelled", "completed"].includes(r.status)).length,
  };

  const tabs: { key: typeof filter; ar: string; en: string }[] = [
    { key: "all", ar: "الكل", en: "All" },
    { key: "active", ar: "نشطة", en: "Active" },
    { key: "past", ar: "سابقة", en: "Past" },
  ];

  if (!authLoading && !user) {
    return (
      <div>
        <PageHeader
          title={lang === "ar" ? "حجوزاتي" : "My Bookings"}
          subtitle={lang === "ar" ? "تتبع طلبات حصصك" : "Track your session requests"}
        />
        <div className="container py-16 text-center">
          <AlertCircle size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-lg font-bold mb-4">
            {lang === "ar" ? "يجب تسجيل الدخول لعرض حجوزاتك" : "Sign in to view your bookings"}
          </p>
          <Link to="/login" className="btn-primary inline-flex">
            {lang === "ar" ? "تسجيل الدخول" : "Sign in"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHelmet
        title={lang === "ar" ? "حجوزاتي | OSTAZZE" : "My Bookings | OSTAZZE"}
        description={lang === "ar" ? "تتبع حالة طلبات حصصك" : "Track your session request status"}
      />
      <PageHeader
        title={lang === "ar" ? "حجوزاتي" : "My Bookings"}
        subtitle={lang === "ar" ? "تتبع حالة طلبات حصصك ومواعيدها" : "Track your session requests and schedules"}
      />

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors border ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-foreground border-border hover:border-primary/40"
                }`}
              >
                {lang === "ar" ? tab.ar : tab.en}
                <span className={`ms-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[0.65rem] ${
                  active ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                }`}>
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => <RequestCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 max-w-md mx-auto"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
              <Inbox size={36} className="text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-extrabold mb-2">
              {lang === "ar" ? "لا توجد حجوزات بعد" : "No bookings yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {lang === "ar"
                ? "ابدأ بتصفح المعلمين أو موادك الجامعية لحجز أول حصة"
                : "Browse tutors or your university courses to book your first session"}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/teachers" className="btn-primary inline-flex items-center gap-2">
                <User size={16} />
                {lang === "ar" ? "تصفح المعلمين" : "Browse tutors"}
              </Link>
              <Link to="/universities" className="btn-outline inline-flex items-center gap-2">
                <BookOpen size={16} />
                {lang === "ar" ? "تصفح المواد" : "Browse subjects"}
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((req, i) => {
              const meta = statusMeta(req.status, lang);
              const isAutoAssign = !req.teacher_id;
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="card-base p-5 flex flex-col gap-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {isAutoAssign ? (
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shrink-0">
                          <Sparkles size={18} />
                        </div>
                      ) : req.teacher_avatar ? (
                        <img
                          src={req.teacher_avatar}
                          alt={req.teacher_name || ""}
                          className="w-11 h-11 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                          <User size={18} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-extrabold text-foreground text-sm truncate">
                          {isAutoAssign
                            ? lang === "ar" ? "سيتم تخصيص مدرس" : "Tutor will be assigned"
                            : req.teacher_name || (lang === "ar" ? "المدرس" : "Tutor")}
                        </p>
                        {req.subject && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <BookOpen size={11} />
                            <span className="truncate">{req.subject}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1.5 text-[0.7rem] font-bold px-2.5 py-1 rounded-full border ${meta.tone}`}>
                      <meta.Icon size={11} className={req.status === "pending" ? "animate-spin" : ""} />
                      {meta.label}
                    </span>
                  </div>

                  {/* Date / time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-secondary/60 rounded-xl p-3">
                      <p className="text-[0.65rem] text-muted-foreground font-bold uppercase tracking-wide flex items-center gap-1">
                        <Calendar size={10} />
                        {lang === "ar" ? "التاريخ" : "Date"}
                      </p>
                      <p className="text-sm font-bold mt-1 text-foreground">
                        {formatDate(req.preferred_date, lang)}
                      </p>
                    </div>
                    <div className="bg-secondary/60 rounded-xl p-3">
                      <p className="text-[0.65rem] text-muted-foreground font-bold uppercase tracking-wide flex items-center gap-1">
                        <Clock size={10} />
                        {lang === "ar" ? "الوقت" : "Time"}
                      </p>
                      <p className="text-sm font-bold mt-1 text-foreground">
                        {formatTime(req.preferred_time, lang)}
                      </p>
                    </div>
                  </div>

                  {/* Auto-assign note */}
                  {isAutoAssign && req.status !== "rejected" && req.status !== "cancelled" && (
                    <div className="flex items-start gap-2 text-xs bg-primary/5 border border-primary/20 rounded-lg p-2.5">
                      <Sparkles size={12} className="text-primary mt-0.5 shrink-0" />
                      <p className="text-foreground/80">
                        {lang === "ar"
                          ? "فريقنا يبحث لك عن أنسب مدرس متاح في هذه المادة وسنتواصل معك قريباً."
                          : "Our team is finding the best available tutor for this subject — we'll contact you soon."}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {req.notes && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <MessageSquare size={12} className="mt-0.5 shrink-0" />
                      <p className="line-clamp-2">{req.notes}</p>
                    </div>
                  )}

                  {/* Reject reason */}
                  {req.status === "rejected" && req.reject_reason && (
                    <div className="text-xs bg-destructive/5 border border-destructive/20 rounded-lg p-2.5">
                      <p className="font-bold text-destructive mb-0.5">
                        {lang === "ar" ? "سبب الرفض:" : "Reason:"}
                      </p>
                      <p className="text-foreground/80">{req.reject_reason}</p>
                    </div>
                  )}

                  {/* Action button */}
                  <div className="mt-auto pt-2">
                    {req.status === "confirmed" && req.zoom_url ? (
                      <a
                        href={req.zoom_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full inline-flex items-center justify-center gap-2 text-sm"
                      >
                        <Video size={14} />
                        {lang === "ar" ? "انضم للحصة" : "Join session"}
                      </a>
                    ) : req.status === "pending_payment" ? (
                      <Link
                        to="/teachers"
                        className="btn-primary w-full inline-flex items-center justify-center gap-2 text-sm"
                      >
                        <CreditCard size={14} />
                        {lang === "ar" ? "إكمال الدفع" : "Complete payment"}
                      </Link>
                    ) : req.status === "rejected" || req.status === "cancelled" ? (
                      <Link
                        to="/teachers"
                        className="btn-outline w-full inline-flex items-center justify-center gap-2 text-sm"
                      >
                        {lang === "ar" ? "احجز حصة جديدة" : "Book another session"}
                      </Link>
                    ) : (
                      <p className="text-center text-[0.7rem] text-muted-foreground">
                        {lang === "ar"
                          ? `طُلبت في ${new Date(req.created_at).toLocaleDateString("ar-EG")}`
                          : `Requested on ${new Date(req.created_at).toLocaleDateString("en-US")}`}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
