import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const WHATSAPP_NUMBER = "201130382206";

const WhatsAppLogo = () => (
  <svg
    viewBox="0 0 32 32"
    width="28"
    height="28"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.738.33-.42.43-1.21 1.318-1.21 2.494 0 1.146.832 2.264 1.318 2.808 1.418 1.62 3.32 3.022 5.388 3.624.96.288 1.918.404 2.78.434.687.026 1.347-.103 1.847-.41.32-.195.52-.482.62-.722.16-.38.16-.7.16-1.013 0-.146-.16-.246-.36-.345l-1.66-.866c-.246-.13-.41-.246-.575-.246zM16.075 5.5C10.273 5.5 5.5 10.273 5.5 16.075c0 1.92.532 3.79 1.534 5.41L5.5 26.5l5.13-1.508a10.55 10.55 0 0 0 5.445 1.513h.005c5.8 0 10.575-4.773 10.575-10.575 0-2.823-1.1-5.475-3.097-7.47A10.494 10.494 0 0 0 16.076 5.5zm6.21 16.78a8.706 8.706 0 0 1-6.21 2.572h-.004a8.71 8.71 0 0 1-4.435-1.215l-.318-.19-3.298.97.99-3.22-.207-.33a8.708 8.708 0 0 1-1.337-4.642c0-4.81 3.91-8.72 8.722-8.72 2.328 0 4.516.91 6.162 2.56a8.65 8.65 0 0 1 2.55 6.165c0 4.81-3.91 8.72-8.722 8.72z"/>
  </svg>
);

const FloatingWhatsApp = () => {
  const { t } = useLanguage();
  const msg = encodeURIComponent(t("whatsapp_msg"));
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      title="WhatsApp"
      aria-label="تواصل معنا عبر واتساب"
    >
      <WhatsAppLogo />
    </motion.a>
  );
};

export default FloatingWhatsApp;
