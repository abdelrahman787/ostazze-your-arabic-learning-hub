import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WHATSAPP_NUMBER = "966559003498";

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
    >
      <MessageCircle size={26} fill="white" />
    </motion.a>
  );
};

export default FloatingWhatsApp;
  );
};

export default FloatingWhatsApp;
