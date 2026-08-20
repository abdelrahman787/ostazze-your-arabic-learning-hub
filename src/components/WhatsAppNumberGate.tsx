import { useEffect, useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Asks any signed-in user without a WhatsApp number to add one,
 * then triggers the one-time welcome WhatsApp message.
 */
const WhatsAppNumberGate = () => {
  const { user, isLoggedIn } = useAuth();
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [open, setOpen] = useState(false);
  const [dial, setDial] = useState("966");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("phone, welcome_whatsapp_sent_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled || !data) return;
      if (!data.phone) {
        setOpen(true);
      } else if (!data.welcome_whatsapp_sent_at) {
        // Number already on file — just send the welcome once.
        supabase.functions.invoke("send-welcome-whatsapp", { body: { lang } });
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user?.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const local = phone.replace(/[^0-9]/g, "").replace(/^0+/, "");
    const digits = local.startsWith(dial) ? local : `${dial}${local}`;
    if (local.length < 6 || digits.length < 8) {
      setError(isAr ? "أدخل رقم واتساب صحيح بصيغة دولية" : "Enter a valid WhatsApp number in international format");
      return;
    }
    setSaving(true);
    setError("");
    const { error: fnError } = await supabase.functions.invoke("send-welcome-whatsapp", {
      body: { phone: digits, lang },
    });
    setSaving(false);
    if (fnError) {
      // The number is saved server-side before sending; don't block the user.
      setOpen(false);
      return;
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60">
      <div className="card-base w-full max-w-md p-6" role="dialog" aria-modal="true">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-11 h-11 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
            <MessageCircle size={22} />
          </span>
          <h2 className="text-lg font-extrabold">
            {isAr ? "أضف رقم واتساب" : "Add your WhatsApp number"}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {isAr
            ? "نحتاج رقم واتساب لإرسال تأكيدات الحجز وروابط الحصص. اختر مفتاح الدولة ثم اكتب رقمك."
            : "We use WhatsApp to send booking confirmations and session links. Pick your country code, then type your number."}
        </p>
        <form onSubmit={submit} className="space-y-3">
          <div className="flex gap-2" dir="ltr">
            <DialCodeSelect value={dial} onChange={setDial} />
            <input
              type="tel"
              inputMode="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="5X XXX XXXX"
              className="input-base flex-1"
              required
            />
          </div>
          {error && (
            <p role="alert" className="text-destructive text-sm">
              {error}
            </p>
          )}
          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving && <Loader2 size={16} className="animate-spin" />}
            {isAr ? "حفظ ومتابعة" : "Save and continue"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full text-xs text-muted-foreground hover:underline"
          >
            {isAr ? "لاحقاً" : "Later"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppNumberGate;
