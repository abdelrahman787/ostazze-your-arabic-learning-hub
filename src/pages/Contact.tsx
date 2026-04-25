import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import FaqAccordion from "@/components/FaqAccordion";
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2, Building2, Clock, Timer, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const Contact = () => {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    await new Promise(r => setTimeout(r, 1500));
    toast({ title: t("contact_success") });
    setName(""); setEmail(""); setMessage("");
    setSending(false);
  };

  const contactInfo = [
    { icon: Mail, label: t("contact_email_label"), value: "info@ostaze.com", href: "mailto:info@ostaze.com" },
    { icon: Phone, label: t("contact_phone_label"), value: "+966 55 900 3498", href: "tel:+966559003498" },
    { icon: MapPin, label: t("contact_location_label"), value: t("footer_location"), href: "#" },
    { icon: MessageCircle, label: t("contact_whatsapp_label"), value: t("contact_whatsapp_value"), href: `https://wa.me/966559003498?text=${encodeURIComponent(lang === "ar" ? "مرحباً، أريد الاستفسار عن خدمات أسطازي" : "Hello, I'd like to inquire about Ostaze services")}` },
  ];

  const contactFaq = [
    { q: t("faq_q_book"), a: t("faq_a_book") },
    { q: t("faq_q_pay"), a: t("faq_a_pay") },
    { q: t("faq_q_refund"), a: t("faq_a_refund") },
    { q: t("faq_q_cancel"), a: t("faq_a_cancel") },
  ];

  return (
    <div>
      <PageHelmet
        title={t("contact_title")}
        description={t("contact_subtitle")}
        keywords={lang === "ar" ? "تواصل, دعم, ostaze, خدمة العملاء" : "contact, support, ostaze, customer service"}
        jsonLd={[
          faqJsonLd(contactFaq),
          breadcrumbJsonLd([
            { name: lang === "ar" ? "الرئيسية" : "Home", path: "/" },
            { name: t("contact_title"), path: "/contact" },
          ]),
        ]}
      />
      <PageHeader title={t("contact_title")} subtitle={t("contact_subtitle")} variant="teachers" />

      <div className="container py-12">
        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-5">
            {contactInfo.map((item, i) => (
              <motion.a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="card-base p-5 flex items-start gap-4 feature-card block">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold mb-0.5">{item.label}</p>
                  <p className="text-sm text-muted-foreground" dir={item.href.startsWith("tel") ? "ltr" : undefined}>{item.value}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
            <div className="card-base p-8">
              <h2 className="text-xl font-extrabold mb-6">{t("contact_form_title")}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-1.5">{t("contact_name")}</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-base" required maxLength={100} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">{t("contact_email")}</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-base" required maxLength={255} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">{t("contact_message")}</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} className="input-base resize-none" required maxLength={1000} />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2">
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={16} />}
                  {t("contact_send")}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Trust block */}
        <div className="mt-12 max-w-5xl mx-auto card-base p-6">
          <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            {lang === "ar" ? "بيانات الجهة" : "Business Information"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Building2 size={16} className="text-primary mt-1 shrink-0" />
              <div>
                <p className="font-bold">{t("contact_trust_entity_label")}</p>
                <p className="text-muted-foreground">{t("contact_trust_entity_value")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-primary mt-1 shrink-0" />
              <div>
                <p className="font-bold">{t("contact_trust_hours_label")}</p>
                <p className="text-muted-foreground">{t("contact_trust_hours_value")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Timer size={16} className="text-primary mt-1 shrink-0" />
              <div>
                <p className="font-bold">{t("contact_trust_sla_label")}</p>
                <p className="text-muted-foreground">{t("contact_trust_sla_value")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck size={16} className="text-primary mt-1 shrink-0" />
              <div>
                <p className="font-bold">{t("contact_trust_quick_help")}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Link to="/privacy" className="text-primary hover:underline">{t("footer_privacy")}</Link>
                  <Link to="/terms" className="text-primary hover:underline">{t("footer_terms")}</Link>
                  <Link to="/refund" className="text-primary hover:underline">{t("footer_refund")}</Link>
                  <Link to="/faq" className="text-primary hover:underline">{t("footer_faq")}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mini FAQ */}
        <section className="mt-10 max-w-3xl mx-auto">
          <h3 className="text-lg font-extrabold mb-3">{t("faq_title")}</h3>
          <FaqAccordion items={contactFaq} defaultOpen={0} />
          <div className="text-center mt-4">
            <Link to="/faq" className="text-primary text-sm font-bold hover:underline">
              {lang === "ar" ? "عرض كل الأسئلة الشائعة ←" : "View all FAQs →"}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
