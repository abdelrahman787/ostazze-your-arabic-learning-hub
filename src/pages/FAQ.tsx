import { Link } from "react-router-dom";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import FaqAccordion, { FaqItem } from "@/components/FaqAccordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { MessageCircle } from "lucide-react";

const FAQ = () => {
  const { t, lang } = useLanguage();

  const items: FaqItem[] = [
    { q: t("faq_q_book"), a: t("faq_a_book") },
    { q: t("faq_q_pay"), a: t("faq_a_pay") },
    { q: t("faq_q_refund"), a: t("faq_a_refund") },
    { q: t("faq_q_cancel"), a: t("faq_a_cancel") },
    { q: t("faq_q_live"), a: t("faq_a_live") },
    { q: t("faq_q_tech"), a: t("faq_a_tech") },
    { q: t("faq_q_become_tutor"), a: t("faq_a_become_tutor") },
  ];

  return (
    <div>
      <PageHelmet
        title={t("faq_title")}
        description={t("faq_subtitle")}
        keywords={lang === "ar"
          ? "أسئلة شائعة, ostaze, حجز جلسة, استرداد, دفع, جلسات مباشرة"
          : "FAQ, ostaze, booking, refund, payment, live sessions"}
        jsonLd={[
          faqJsonLd(items),
          breadcrumbJsonLd([
            { name: lang === "ar" ? "الرئيسية" : "Home", path: "/" },
            { name: t("faq_title"), path: "/faq" },
          ]),
        ]}
      />
      <PageHeader title={t("faq_title")} subtitle={t("faq_subtitle")} variant="teachers" />

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={items} defaultOpen={0} />

          <div className="mt-10 text-center card-base p-6">
            <p className="font-bold mb-2">{t("faq_more")}</p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              <MessageCircle size={16} /> {t("faq_contact_cta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
