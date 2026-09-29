import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, CheckCircle2, Mail } from "lucide-react";

const Refund = () => {
  const { t, lang } = useLanguage();

  const sections =
    lang === "ar"
      ? [
          {
            icon: ShieldCheck,
            title: "مراجعة الطلبات",
            content:
              "تُراجع طلبات الإلغاء والاسترداد للكورسات والجلسات بشكل فردي. لا توجد مدة استرداد تلقائية أو نسبة ثابتة؛ يُتخذ القرار بعد مراجعة تفاصيل كل طلب.",
          },
          {
            icon: Clock,
            title: "إلغاء الجلسات أو إعادة جدولتها",
            content:
              "تواصل معنا في أقرب وقت ممكن قبل موعد الجلسة لطلب الإلغاء أو إعادة الجدولة. إذا تغيّب المعلم عن جلسة مؤكدة، يحق لك طلب إعادة جدولتها أو استرداد قيمتها.",
          },
          {
            icon: Mail,
            title: "كيفية تقديم الطلب",
            content:
              "أرسل طلبك إلى info@ostaze.com أو عبر واتساب ‎+20 11 3038 2206‎ متضمناً:\n• البريد الإلكتروني المستخدم في الشراء.\n• اسم الكورس أو الجلسة وتاريخها.\n• رقم العملية إن وجد.\n• سبب الطلب.",
          },
          {
            icon: CheckCircle2,
            title: "تنفيذ الاسترداد المعتمد",
            content:
              "يتم الدفع بالجنيه المصري، ويُعاد المبلغ المعتمد عبر وسيلة الدفع الأصلية عند الإمكان. تعتمد مدة وصول المبلغ على مزود الدفع والبنك.",
          },
        ]
      : [
          {
            icon: ShieldCheck,
            title: "How Requests Are Reviewed",
            content:
              "Cancellation and refund requests for courses and sessions are reviewed individually. There is no automatic refund period or fixed percentage; a decision is made after reviewing the details of each request.",
          },
          {
            icon: Clock,
            title: "Cancelling or Rescheduling Sessions",
            content:
              "Contact us as early as possible before the session to request a cancellation or reschedule. If a tutor misses a confirmed session, you may request a rescheduled session or a refund of that session.",
          },
          {
            icon: Mail,
            title: "How to Submit a Request",
            content:
              "Send your request to info@ostaze.com or on WhatsApp +20 11 3038 2206 including:\n• The email used for the purchase.\n• The course or session name and date.\n• The transaction ID, if available.\n• The reason for your request.",
          },
          {
            icon: CheckCircle2,
            title: "Processing Approved Refunds",
            content:
              "Payments are charged in Egyptian pounds, and approved refunds are returned via the original payment method where possible. The time for funds to arrive depends on the payment provider and bank.",
          },
        ];

  const title = lang === "ar" ? "سياسة الاسترداد" : "Refund Policy";
  const subtitle =
    lang === "ar"
      ? "سياسة شفافة وعادلة لاسترداد قيمة الكورسات والجلسات"
      : "A transparent and fair refund policy for courses and sessions";

  return (
    <div>
      <PageHelmet
        title={
          lang === "ar"
            ? "سياسة الاسترجاع - أستاذي OSTAZE"
            : "Refund Policy - OSTAZE"
        }
        description={
          lang === "ar"
            ? "تعرف على سياسة استرجاع الأموال في منصة أستاذي — شروط الاسترجاع والإلغاء."
            : "Learn about OSTAZE refund policy — refund and cancellation terms."
        }
        canonical="https://ostaze.com/refund"
      />
      <PageHeader title={title} subtitle={subtitle} variant="subjects" />

      <div className="container py-12 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mb-8"
        >
          {lang === "ar"
            ? "تاريخ السريان: 29 سبتمبر 2026"
            : "Effective date: September 29, 2026"}
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
                  <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                    {s.content}
                  </p>
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
            <strong>
              {lang === "ar" ? "ملاحظة قانونية:" : "Legal Notice:"}
            </strong>{" "}
            {lang === "ar"
              ? "لا تؤثر هذه السياسة على أي حقوق إلزامية يكفلها لك القانون المصري."
              : "This policy does not affect any mandatory rights granted to you under Egyptian law."}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Refund;
