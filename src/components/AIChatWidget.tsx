import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  showWhatsApp?: boolean;
}

const WHATSAPP_NUMBER = "201130382206";

// Heuristic to detect "I don't know" style responses where we should offer WhatsApp fallback
const isUnansweredResponse = (text: string): boolean => {
  if (!text) return true;
  const t = text.toLowerCase();
  const patterns = [
    "i don't know", "i do not know", "i'm not sure", "i am not sure",
    "i can't help", "i cannot help", "i'm unable", "i am unable",
    "sorry, i don't", "sorry, i can't", "i don't have", "no information",
    "لا أعرف", "لا اعرف", "مش عارف", "مش متأكد", "لست متأكد",
    "ماعنديش", "ما عنديش", "معنديش", "مش قادر", "لا أستطيع",
    "مفيش معلومات", "ما عندي معلومات", "للأسف", "للاسف",
  ];
  return patterns.some((p) => t.includes(p));
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ostazze-chat`;

const AIChatWidget = () => {
  const { user, isLoggedIn } = useAuth();
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Create conversation on first message
  const ensureConversation = useCallback(async () => {
    if (conversationId || !isLoggedIn || !user) return conversationId;
    const { data, error } = await supabase
      .from("ai_chat_conversations" as any)
      .insert({ user_id: user.id })
      .select("id")
      .single();
    if (error) {
      console.error("Failed to create conversation:", error);
      return null;
    }
    const id = (data as any).id;
    setConversationId(id);
    return id;
  }, [conversationId, isLoggedIn, user]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const convId = await ensureConversation();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use the user's session token when logged in so the function can derive student_id from JWT
          Authorization: `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          conversation_id: convId,
        }),
      });

      if (resp.status === 429) {
        toast({ title: lang === "ar" ? "انتظر قليلاً" : "Rate limited", description: lang === "ar" ? "حاول مرة أخرى بعد قليل" : "Please try again shortly", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast({ title: lang === "ar" ? "خطأ" : "Error", description: lang === "ar" ? "خدمة الذكاء الاصطناعي غير متاحة حالياً" : "AI service unavailable", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      const data = await resp.json();
      if (data.error) throw new Error(data.error);

      const content = data.content || "";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content, showWhatsApp: isUnansweredResponse(content) },
      ]);
    } catch (e: any) {
      console.error("Chat error:", e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: lang === "ar" ? "عذراً، حصلت مشكلة تقنية. حاول مرة تانية 🙏" : "Sorry, something went wrong. Please try again 🙏",
          showWhatsApp: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  const isRtl = lang === "ar";

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark text-primary-foreground flex items-center justify-center shadow-[0_8px_30px_hsl(14_91%_50%/0.5)] hover:shadow-[0_12px_40px_hsl(14_91%_50%/0.7)] transition-shadow"
            title={lang === "ar" ? "مساعد أستازي" : "Ostaze Assistant"}
            aria-label={lang === "ar" ? "افتح مساعد أستازي" : "Open Ostaze Assistant"}
          >
            {/* Pulsing rings */}
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
            {/* Icon */}
            <Bot size={28} className="relative z-10 drop-shadow-md" />
            {/* Online dot */}
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[hsl(142_76%_45%)] border-2 border-background z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 left-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-2rem)] rounded-2xl shadow-2xl border border-border bg-background flex flex-col overflow-hidden"
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0">
              <div className="flex items-center gap-2">
                <Bot size={22} />
                <div>
                  <h3 className="font-bold text-sm leading-tight">
                    {lang === "ar" ? "مساعد أستازي" : "Ostaze Assistant"}
                  </h3>
                  <p className="text-[11px] opacity-80">
                    {lang === "ar" ? "متاح دائماً لمساعدتك" : "Always here to help"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors" title={lang === "ar" ? "محادثة جديدة" : "New chat"}>
                    <Trash2 size={16} />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot size={32} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      {lang === "ar" ? "أهلاً! أنا أستازي 👋" : "Hi! I'm Ostaze 👋"}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {lang === "ar"
                        ? "أقدر أساعدك تلاقي معلم مناسب وتحجز جلسة. جرّب تسألني!"
                        : "I can help you find the right teacher and book a session. Try asking me!"}
                    </p>
                  </div>
                  {/* Quick Actions */}
                  <div className="space-y-2 pt-2">
                    {[
                      lang === "ar" ? "عاوز معلم رياضيات" : "I need a math teacher",
                      lang === "ar" ? "عرض حجوزاتي" : "Show my bookings",
                      lang === "ar" ? "إيه المواد المتاحة؟" : "What subjects are available?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setInput(q);
                          setTimeout(() => sendMessage(), 0);
                          // We need to set input and trigger send
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setMessages([{ role: "user", content: q }]);
                          setInput("");
                          setIsLoading(true);
                          // Trigger send with this message
                          (async () => {
                            try {
                              const convId = await ensureConversation();
                              const { data: sessionData } = await supabase.auth.getSession();
                              const accessToken = sessionData?.session?.access_token;
                              const resp = await fetch(CHAT_URL, {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${accessToken || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                                  apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
                                },
                                body: JSON.stringify({
                                  messages: [{ role: "user", content: q }],
                                  conversation_id: convId,
                                }),
                              });
                              const data = await resp.json();
                              const content = data.content || data.error || "Error";
                              setMessages((prev) => [...prev, { role: "assistant", content, showWhatsApp: isUnansweredResponse(content) || !!data.error }]);
                            } catch {
                              setMessages((prev) => [...prev, { role: "assistant", content: lang === "ar" ? "عذراً، حصلت مشكلة." : "Sorry, an error occurred.", showWhatsApp: true }]);
                            } finally {
                              setIsLoading(false);
                            }
                          })();
                        }}
                        className="block w-full text-start px-3 py-2 text-sm rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`flex gap-2 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={14} className="text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <User size={14} className="text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                  {msg.role === "assistant" && msg.showWhatsApp && (
                    <div className="mt-2 ms-9 max-w-[80%]">
                      <p className="text-xs text-muted-foreground mb-1.5">
                        {lang === "ar"
                          ? "محتاج مساعدة أكتر؟ كلّمنا على واتساب 👇"
                          : "Need more help? Chat with us on WhatsApp 👇"}
                      </p>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          lang === "ar"
                            ? "أهلاً، محتاج مساعدة من فريق أستازي"
                            : "Hi, I need help from the Ostazze team"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366] text-white text-sm font-semibold shadow hover:shadow-lg hover:brightness-110 transition"
                      >
                        <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true">
                          <path d="M16.075 5.5C10.273 5.5 5.5 10.273 5.5 16.075c0 1.92.532 3.79 1.534 5.41L5.5 26.5l5.13-1.508a10.55 10.55 0 0 0 5.445 1.513h.005c5.8 0 10.575-4.773 10.575-10.575 0-2.823-1.1-5.475-3.097-7.47A10.494 10.494 0 0 0 16.076 5.5zM19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.738.33-.42.43-1.21 1.318-1.21 2.494 0 1.146.832 2.264 1.318 2.808 1.418 1.62 3.32 3.022 5.388 3.624.96.288 1.918.404 2.78.434.687.026 1.347-.103 1.847-.41.32-.195.52-.482.62-.722.16-.38.16-.7.16-1.013 0-.146-.16-.246-.36-.345l-1.66-.866c-.246-.13-.41-.246-.575-.246z"/>
                        </svg>
                        {lang === "ar" ? "كلّمنا على واتساب" : "Chat on WhatsApp"}
                      </a>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border shrink-0">
              {!isLoggedIn && (
                <p className="text-xs text-muted-foreground text-center mb-2">
                  {lang === "ar"
                    ? "سجّل دخولك عشان تقدر تحجز جلسات"
                    : "Log in to book sessions"}
                </p>
              )}
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={lang === "ar" ? "اكتب رسالتك..." : "Type your message..."}
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 max-h-24"
                  style={{ minHeight: "40px" }}
                />
                <Button
                  size="icon"
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl h-10 w-10 shrink-0"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
