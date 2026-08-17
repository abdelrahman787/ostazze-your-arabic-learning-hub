import { useLanguage } from "@/contexts/LanguageContext";

import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M16.075 5.5C10.273 5.5 5.5 10.273 5.5 16.075c0 1.92.532 3.79 1.534 5.41L5.5 26.5l5.13-1.508a10.55 10.55 0 0 0 5.445 1.513h.005c5.8 0 10.575-4.773 10.575-10.575 0-2.823-1.1-5.475-3.097-7.47A10.494 10.494 0 0 0 16.076 5.5zM19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.738.33-.42.43-1.21 1.318-1.21 2.494 0 1.146.832 2.264 1.318 2.808 1.418 1.62 3.32 3.022 5.388 3.624.96.288 1.918.404 2.78.434.687.026 1.347-.103 1.847-.41.32-.195.52-.482.62-.722.16-.38.16-.7.16-1.013 0-.146-.16-.246-.36-.345l-1.66-.866c-.246-.13-.41-.246-.575-.246z" />
  </svg>
);

interface Props {
  /** e.g. "جامعة الملك سعود" — appended to the message for context */
  context?: string;
  /** compact = small inline pill; banner = full-width strip */
  variant?: "compact" | "banner";
  className?: string;
}

const WhatsAppQuickBook = ({ context, variant = "banner", className = "" }: Props) => {
  const { lang } = useLanguage();
  const isRtl = lang === "ar";

  const msg =
    lang === "ar"
      ? `مرحباً، أريد حجز حصة${context ? ` — ${context}` : ""}.`
      : `Hi, I'd like to book a session${context ? ` — ${context}` : ""}.`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  if (variant === "compact") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        dir={isRtl ? "rtl" : "ltr"}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] text-white text-sm font-bold shadow hover:shadow-lg hover:brightness-110 transition-all ${className}`}
      >
        <WhatsAppIcon size={16} />
        {lang === "ar" ? "احجز عبر واتساب" : "Book via WhatsApp"}
      </a>
    );
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between rounded-2xl bg-gradient-to-r from-[#25D366]/10 via-[#25D366]/5 to-[#25D366]/10 border border-[#25D366]/25 px-5 py-4 md:px-6 md:py-5 ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
          <WhatsAppIcon size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-sm md:text-base leading-tight">
            {lang === "ar" ? "حجز سريع عبر واتساب" : "Quick Book via WhatsApp"}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5 truncate">
            {context
              ? lang === "ar"
                ? `تواصل معنا لحجز مدرس في ${context}`
                : `Message us to book a tutor in ${context}`
              : lang === "ar"
              ? "تواصل معنا لحجز مدرس مناسب"
              : "Message us to book a suitable tutor"}
          </p>
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold shadow hover:shadow-lg hover:brightness-110 transition-all shrink-0"
      >
        <WhatsAppIcon size={16} />
        {lang === "ar" ? "احجز الآن" : "Book Now"}
      </a>
    </div>
  );
};

export default WhatsAppQuickBook;
