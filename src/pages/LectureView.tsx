import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Send, ArrowRight, Loader2, MessageSquare, Video } from "lucide-react";
import { motion } from "framer-motion";

interface Lecture {
  id: string;
  title: string;
  subject: string | null;
  teacher_id: string;
  student_id: string;
  video_url: string | null;
  pdf_url: string | null;
}

interface ChatMsg {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const LectureView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const fetchLecture = useCallback(async () => {
    if (!id) return;
    const { data } = await supabase.from("lectures").select("*").eq("id", id).maybeSingle();
    if (data) setLecture(data as Lecture);
    setLoading(false);
  }, [id]);

  const fetchMessages = useCallback(async () => {
    if (!id) return;
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("lecture_id", id)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as ChatMsg[]);
  }, [id]);

  useEffect(() => {
    fetchLecture();
    fetchMessages();
  }, [fetchLecture, fetchMessages]);

  // Realtime subscription
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`chat-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `lecture_id=eq.${id}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMsg]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim() || !user || !id) return;
    setSending(true);
    await supabase.from("chat_messages").insert({ lecture_id: id, sender_id: user.id, content: newMsg.trim() });
    setNewMsg("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">المحاضرة غير موجودة</p>
        <Link to="/dashboard" className="btn-primary text-sm">العودة للوحة التحكم</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowRight size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-sm">{lecture.title}</h1>
            {lecture.subject && <p className="text-muted-foreground text-xs">{lecture.subject}</p>}
          </div>
        </div>
      </header>

      {/* 3-column layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-53px)]">
        {/* Right: Lecture name + PDF */}
        <div className="lg:w-72 border-l bg-card p-4 order-1 lg:order-3 flex flex-col gap-4 overflow-y-auto">
          <div>
            <h2 className="font-extrabold text-lg mb-1">{lecture.title}</h2>
            {lecture.subject && (
              <span className="tag-outline text-xs">{lecture.subject}</span>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <FileText size={16} className="text-primary" /> ملف المادة
            </h3>
            {lecture.pdf_url ? (
              <a
                href={lecture.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <FileText size={20} className="text-destructive" />
                </div>
                <div>
                  <div className="font-bold text-sm">تحميل PDF</div>
                  <div className="text-muted-foreground text-xs">اضغط لفتح الملف</div>
                </div>
              </a>
            ) : (
              <p className="text-muted-foreground text-xs text-center p-4">لا يوجد ملف مرفق</p>
            )}
          </div>
        </div>

        {/* Center: Video */}
        <div className="flex-1 order-2 bg-background p-4 flex flex-col items-center justify-center">
          {lecture.video_url ? (
            <div className="w-full max-w-4xl">
              <div className="aspect-video bg-foreground/5 rounded-2xl overflow-hidden">
                <video
                  src={lecture.video_url}
                  controls
                  className="w-full h-full object-contain"
                  controlsList="nodownload"
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Video size={48} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">لا يوجد فيديو لهذه المحاضرة</p>
            </div>
          )}
        </div>

        {/* Left: Chat */}
        <div className="lg:w-80 border-r bg-card order-3 lg:order-1 flex flex-col h-80 lg:h-auto">
          <div className="p-3 border-b flex items-center gap-2">
            <MessageSquare size={16} className="text-primary" />
            <h3 className="font-bold text-sm">المحادثة</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <p className="text-muted-foreground text-xs text-center mt-8">لا توجد رسائل بعد. ابدأ المحادثة!</p>
            )}
            {messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                    {msg.content}
                    <div className={`text-[0.6rem] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {new Date(msg.created_at).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالة..."
                className="input-base flex-1 !py-2 text-sm"
                disabled={sending}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={sending || !newMsg.trim()}
                className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
              >
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureView;
