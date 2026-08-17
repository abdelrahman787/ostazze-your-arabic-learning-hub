import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle } from "lucide-react";

import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M16.075 5.5C10.273 5.5 5.5 10.273 5.5 16.075c0 1.92.532 3.79 1.534 5.41L5.5 26.5l5.13-1.508a10.55 10.55 0 0 0 5.445 1.513h.005c5.8 0 10.575-4.773 10.575-10.575 0-2.823-1.1-5.475-3.097-7.47A10.494 10.494 0 0 0 16.076 5.5zM19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.738.33-.42.43-1.21 1.318-1.21 2.494 0 1.146.832 2.264 1.318 2.808 1.418 1.62 3.32 3.022 5.388 3.624.96.288 1.918.404 2.78.434.687.026 1.347-.103 1.847-.41.32-.195.52-.482.62-.722.16-.38.16-.7.16-1.013 0-.146-.16-.246-.36-.345l-1.66-.866c-.246-.13-.41-.246-.575-.246z"/>
  </svg>
);

const WhatsAppTutorBanner = () => {
  const { lang, t } = useLanguage();
  const isRtl = lang === "ar";

  const message = encodeURIComponent(
    lang === "ar"
      ? "مرحباً، أريد المساعدة في إيجاد معلم مناسب."
      : "Hi, I need help finding a suitable tutor."
  );
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <section className="w-full border-y border-border/50 bg-gradient-to-r from-[#25D366]/10 via-[#25D366]/5 to-[#25D366]/10 dark:from-[#25D366]/15 dark:via-[#25D366]/5 dark:to-[#25D366]/15" dir={isRtl ? "rtl" : "ltr"}>
      <div className="container py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between rounded-2xl bg-background/95 border border-[#25D366]/20 px-5 py-5 md:px-8 md:py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
              <WhatsAppIcon />
            </div>
            <div>
              <h3 className="font-black text-base md:text-lg text-foreground leading-tight">
                {lang === "ar" ? "هل تبحث عن معلم؟" : "Looking for a Tutor?\u00A0"}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t("whatsapp_tutor_desc")}
              </p>
            </div>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold shadow hover:shadow-lg hover:brightness-110 transition-all"
          >
            <MessageCircle size={18} />
            {t("whatsapp_tutor_cta")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppTutorBanner;
