import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Send, ArrowRight, Loader2, MessageSquare, Video, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AudioRecorder from "@/components/AudioRecorder";
import AudioPlayer from "@/components/AudioPlayer";

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
  audio_url?: string | null;
}

const LectureView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
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

  const handleAudioRecorded = async (audioUrl: string) => {
    if (!user || !id) return;
    await supabase.from("chat_messages").insert({
      lecture_id: id,
      sender_id: user.id,
      content: "🎤 رسالة صوتية",
      audio_url: audioUrl,
    });
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-2.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowRight size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-sm">{lecture.title}</h1>
            {lecture.subject && <p className="text-muted-foreground text-xs">{lecture.subject}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lecture.pdf_url && (
            <button
              onClick={() => setPdfOpen(!pdfOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${pdfOpen ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
            >
              <FileText size={14} />
              {pdfOpen ? "إخفاء الملف" : "عرض الملف"}
            </button>
          )}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${chatOpen ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
          >
            <MessageSquare size={14} />
            {chatOpen ? "إخفاء المحادثة" : "المحادثة"}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex h-[calc(100vh-49px)] overflow-hidden">
        {/* Video + PDF area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Video */}
          <div className={`flex-1 flex items-center justify-center p-4 ${pdfOpen ? "lg:w-1/2" : "w-full"}`}>
            {lecture.video_url ? (
              <div className="w-full max-w-5xl">
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

          {/* PDF inline viewer */}
          <AnimatePresence>
            {pdfOpen && lecture.pdf_url && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "50%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-l bg-card flex flex-col overflow-hidden hidden lg:flex"
              >
                <div className="p-2 border-b flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <FileText size={14} className="text-primary" /> ملف المادة
                  </span>
                  <button onClick={() => setPdfOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1">
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(lecture.pdf_url)}&embedded=true`}
                    className="w-full h-full"
                    title="PDF Viewer"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PDF mobile: show below video */}
          {pdfOpen && lecture.pdf_url && (
            <div className="lg:hidden border-t bg-card flex flex-col h-[50vh]">
              <div className="p-2 border-b flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <FileText size={14} className="text-primary" /> ملف المادة
                </span>
                <button onClick={() => setPdfOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1">
                <iframe
                  src={lecture.pdf_url}
                  className="w-full h-full"
                  title="PDF Viewer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Chat panel - collapsible */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-r bg-card flex flex-col overflow-hidden"
            >
              <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary" />
                  <h3 className="font-bold text-sm">المحادثة</h3>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
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
                        {msg.audio_url ? (
                          <AudioPlayer src={msg.audio_url} isMe={isMe} />
                        ) : (
                          msg.content
                        )}
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
                  {user && id && (
                    <AudioRecorder
                      onRecorded={handleAudioRecorded}
                      disabled={sending}
                      userId={user.id}
                      lectureId={id}
                    />
                  )}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LectureView;
