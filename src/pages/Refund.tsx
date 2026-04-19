import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, XCircle, CheckCircle2, Mail } from "lucide-react";

const Refund = () => {
  const { t, lang } = useLanguage();

  const sections = lang === "ar" ? [
    {
      icon: Clock,
      title: "نافذة الاسترداد (14 يوماً)",
      content: "يحق لك طلب استرداد كامل قيمة الكورس خلال 14 يوماً من تاريخ الشراء، بشرط ألا تكون قد أكملت أكثر من 25% من محتوى الكورس (الدروس المسجلة) أو حضرت أكثر من جلسة مباشرة واحدة.",
    },
    {
      icon: CheckCircle2,
      title: "الحالات المؤهلة للاسترداد الكامل",
      content: "• عدم القدرة التقنية على الوصول للكورس بعد محاولات دعم متعددة.\n• اختلاف جوهري بين وصف الكورس والمحتوى الفعلي.\n• إلغاء الكورس من قبل المنصة قبل بدئه.\n• أخطاء فوترة أو خصم مزدوج.",
    },
    {
      icon: XCircle,
      title: "الحالات غير المؤهلة للاسترداد",
      content: "• مرور أكثر من 14 يوماً على الشراء.\n• إكمال أكثر من 25% من محتوى الكورس.\n• حضور أكثر من جلسة مباشرة واحدة في الكورسات الحية.\n• تنزيل أو حفظ مواد الكورس بشكل دائم.\n• الجلسات الخاصة (1-on-1) المؤكدة والتي تم تنفيذها.",
    },
    {
      icon: ShieldCheck,
      title: "كيفية تقديم طلب استرداد",
      content: "أرسل طلبك إلى refund@ostaze.com متضمناً:\n• البريد الإلكتروني المستخدم في الشراء.\n• رقم الكورس أو اسمه.\n• تاريخ الشراء ورقم العملية.\n• سبب طلب الاسترداد.\n\nسيتم الرد خلال 3 أيام عمل، وتنفيذ الاسترداد المعتمد خلال 5-10 أيام عمل عبر نفس وسيلة الدفع الأصلية.",
    },
    {
      icon: Mail,
      title: "النزاعات والاستفسارات",
      content: "إذا لم تكن راضياً عن قرار الاسترداد، يمكنك التواصل مع support@ostaze.com لمراجعة الحالة. نحن ملتزمون بمعاملة عادلة لكل طلب.",
    },
  ] : [
    {
      icon: Clock,
      title: "Refund Window (14 Days)",
      content: "You may request a full refund within 14 days of purchase, provided you have not completed more than 25% of the course content (recorded lessons) or attended more than one live session.",
    },
    {
      icon: CheckCircle2,
      title: "Eligible for Full Refund",
      content: "• Technical inability to access the course after multiple support attempts.\n• Material discrepancy between course description and actual content.\n• Course cancellation by the platform before start.\n• Billing errors or duplicate charges.",
    },
    {
      icon: XCircle,
      title: "Not Eligible for Refund",
      content: "• More than 14 days have passed since purchase.\n• Completed more than 25% of course content.\n• Attended more than one live session in live courses.\n• Permanently downloaded or saved course materials.\n• Confirmed and delivered private (1-on-1) sessions.",
    },
    {
      icon: ShieldCheck,
      title: "How to Request a Refund",
      content: "Email refund@ostaze.com with:\n• Email used for purchase.\n• Course ID or name.\n• Purchase date and transaction ID.\n• Reason for refund request.\n\nWe respond within 3 business days; approved refunds are processed within 5-10 business days via the original payment method.",
    },
    {
      icon: Mail,
      title: "Disputes and Inquiries",
      content: "If you are not satisfied with the refund decision, contact support@ostaze.com for case review. We are committed to fair treatment of every request.",
    },
  ];

  const title = lang === "ar" ? "سياسة الاسترداد" : "Refund Policy";
  const subtitle = lang === "ar"
    ? "سياسة شفافة وعادلة لاسترداد قيمة الكورسات والجلسات"
    : "A transparent and fair refund policy for courses and sessions";

  return (
    <div>
      <PageHelmet title={title} description={subtitle} />
      <PageHeader title={title} subtitle={subtitle} variant="subjects" />

      <div className="container py-12 max-w-3xl mx-auto">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground mb-8">
          {lang === "ar" ? "آخر تحديث: 19 أبريل 2026" : "Last updated: April 19, 2026"}
        </motion.p>
        <div className="space-y-6">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-base p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <s.icon size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-extrabold mb-3">{s.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">{s.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card-base p-6 mt-8 bg-primary/5 border-primary/20"
        >
          <p className="text-sm leading-relaxed">
            <strong>{lang === "ar" ? "ملاحظة قانونية:" : "Legal Notice:"}</strong>{" "}
            {lang === "ar"
              ? "تتوافق هذه السياسة مع قوانين حماية المستهلك المعمول بها. لا تؤثر هذه السياسة على حقوقك القانونية الإلزامية."
              : "This policy complies with applicable consumer protection laws. It does not affect your statutory rights."}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Refund;
