import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const WHATSAPP_NUMBER = "201130382206";

const WhatsAppLogo = () => (
  <svg
    viewBox="0 0 24 24"
    width="26"
    height="26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.175L2.546 22l4.978-1.207A9.936 9.936 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.942 14.327c-.217.61-1.08 1.113-1.487 1.182-.398.067-.796.09-1.194-.022-.425-.12-.793-.298-1.088-.48-.294-.181-.774-.58-1.212-.934-.438-.354-1.297-1.177-1.56-1.637-.263-.46-.592-.99-.497-1.568.047-.283.192-.51.365-.673.174-.163.353-.264.53-.365.177-.101.39-.176.586-.254.197-.078.427-.07.57.048.143.118.6.694.765.89.166.196.27.39.158.6-.113.21-.425.527-.56.684-.135.158-.256.287-.154.48.102.192.46.744.984 1.214.525.47 1.1.774 1.55.857.45.083.71-.106.892-.318.182-.212.383-.557.53-.754.147-.197.384-.222.6-.123.217.1 1.234.58 1.45.68.217.1.358.168.41.263.053.095.053.59-.165 1.2z"
      fill="currentColor"
    />
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
