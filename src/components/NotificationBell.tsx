import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Bell, BookOpen, MessageSquare, Check, X, Loader2, CalendarCheck, CheckCircle, ShoppingBag, AlertTriangle, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  lecture_id: string | null;
  is_read: boolean;
  created_at: string;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setNotifications((data as NotificationItem[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          setNotifications((prev) => [payload.new as NotificationItem, ...prev]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const switchTab = (tab: string) => {
    // Dispatch immediately and after a short delay (in case the dashboard mounts after navigation)
    const fire = () => window.dispatchEvent(new CustomEvent("switch-dashboard-tab", { detail: tab }));
    fire();
    setTimeout(fire, 150);
    setTimeout(fire, 400);
  };

  const handleNotificationClick = (n: NotificationItem) => {
    markAsRead(n.id);
    setOpen(false);

    const role = user?.role;

    // Navigate based on notification type
    if ((n.type === "new_lecture" || n.type === "new_message") && n.lecture_id) {
      navigate(`/lectures/${n.lecture_id}`);
      return;
    }

    if (n.type === "booking_confirmed" || n.type === "booking_rejected" || n.type === "booking_cancelled" || n.type === "new_booking") {
      // Route to the appropriate dashboard based on role; SmartDashboard handles /dashboard for both
      navigate("/dashboard");
      switchTab("mylessons");
      return;
    }

    if (n.type === "admin_new_request" || n.type === "admin_cancellation") {
      navigate("/admin");
      switchTab("sales");
      return;
    }

    if (n.type === "admin_new_payment") {
      navigate("/admin");
      switchTab("invoices");
      return;
    }

    // Fallback: go to dashboard
    navigate(role === "admin" ? "/admin" : "/dashboard");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_lecture": return <BookOpen size={14} className="text-primary" />;
      case "new_message": return <MessageSquare size={14} className="text-success" />;
      case "booking_confirmed": return <CheckCircle size={14} className="text-success" />;
      case "booking_rejected": return <X size={14} className="text-destructive" />;
      case "new_booking": return <CalendarCheck size={14} className="text-primary" />;
      case "admin_new_request": return <ShoppingBag size={14} className="text-primary" />;
      case "admin_cancellation": return <AlertTriangle size={14} className="text-destructive" />;
      case "admin_new_payment": return <DollarSign size={14} className="text-success" />;
      default: return <Bell size={14} className="text-muted-foreground" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_lecture": return "bg-primary/10";
      case "new_message": return "bg-success/10";
      case "booking_confirmed": return "bg-success/10";
      case "booking_rejected": return "bg-destructive/10";
      case "new_booking": return "bg-primary/10";
      case "admin_new_request": return "bg-primary/10";
      case "admin_cancellation": return "bg-destructive/10";
      case "admin_new_payment": return "bg-success/10";
      default: return "bg-muted";
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        className="relative w-8 h-8 rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[0.6rem] font-bold flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute left-0 top-12 z-50 w-80 max-h-[70vh] bg-card border rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-extrabold text-sm">الإشعارات</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary font-bold hover:underline">
                      قراءة الكل
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto max-h-[55vh]">
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={20} /></div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground text-sm">لا توجد إشعارات</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-right flex gap-3 p-3 border-b last:border-0 transition-colors hover:bg-secondary/50 ${!n.is_read ? "bg-primary/5" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getNotificationColor(n.type)}`}>
                        {getNotificationIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs leading-relaxed">{n.title}</p>
                        {n.body && <p className="text-muted-foreground text-[0.7rem] truncate">{n.body}</p>}
                        <p className="text-[0.6rem] text-muted-foreground mt-1">{timeAgo(n.created_at)}</p>
                      </div>
                      {!n.is_read && (
                        <div className="shrink-0 self-start mt-1">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
