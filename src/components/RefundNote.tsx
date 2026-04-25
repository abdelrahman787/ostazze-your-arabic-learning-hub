import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const RefundNote = ({ className = "" }: { className?: string }) => {
  const { t } = useLanguage();
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-border/60 bg-foreground/[0.02] p-3 text-sm ${className}`}
      role="note"
    >
      <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <p className="font-bold text-foreground">{t("refund_note_title")}</p>
        <p className="text-muted-foreground">{t("refund_note_body")}</p>
        <Link to="/refund" className="text-primary hover:underline text-xs font-bold mt-0.5 inline-block">
          {t("refund_note_link")}
        </Link>
      </div>
    </div>
  );
};

export default RefundNote;
