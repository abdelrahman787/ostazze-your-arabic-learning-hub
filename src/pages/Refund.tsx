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
            icon: Clock,
            title: "الجلسات المدفوعة: 24 ساعة أو أكثر قبل الموعد",
            content:
              "إذا طلبت الإلغاء قبل 24 ساعة أو أكثر من موعد بدء الجلسة المدفوعة، تكون مؤهلاً لاسترداد كامل بعد مراجعة الإدارة. بعد الدفع لا يمكن إلغاء الجلسة مباشرة، بل عبر زر «طلب إلغاء» في صفحة حجوزاتي أو بالتواصل معنا.",
          },
          {
            icon: ShieldCheck,
            title: "أقل من 24 ساعة أو عدم حضور الطالب",
            content:
              "لا يوجد استرداد تلقائي للطلبات المقدمة قبل أقل من 24 ساعة من الموعد أو عند عدم حضور الطالب. يمكن مراجعة الظروف الاستثنائية الموثقة بشكل فردي.",
          },
          {
            icon: CheckCircle2,
            title: "إلغاء من المعلم أو المنصة",
            content:
              "إذا ألغى المعلم أو المنصة الجلسة، أو تعذّر تعيين معلم، أو تم الدفع مرتين، أو لم تُقدَّم الخدمة المدفوعة، يحق لك استرداد كامل أو رصيد في حسابك إذا اخترت الرصيد صراحةً.",
          },
          {
            icon: Clock,
            title: "الطلبات غير المدفوعة والحجوزات المباشرة",
            content:
              "يمكنك إلغاء طلب الجلسة قبل الدفع مباشرة. الحجوزات المباشرة مع المعلمين غير مدفوعة حالياً: يمكن إلغاء الحجز قيد الانتظار في أي وقت قبل موعده، والحجز المؤكد حتى 24 ساعة قبل موعده.",
          },
          {
            icon: Mail,
            title: "تنفيذ الاسترداد والتواصل",
            content:
              "يُعاد الاسترداد المالي المعتمد إلى وسيلة الدفع الأصلية متى أمكن، ولا يتم أي استرداد تلقائياً. تعتمد مدة المعالجة على مزوّد الدفع والبنك. للتواصل: info@ostaze.com أو واتساب ‎+20 11 3038 2206‎. لا تؤثر هذه السياسة على أي حقوق إلزامية للمستهلك بموجب القانون المصري.",
          },
        ]
      : [
          {
            icon: Clock,
            title: "Paid sessions: 24 hours or more before the start",
            content:
              "If you request cancellation 24 hours or more before a paid session starts, you are eligible for a full refund after Admin review. After payment, a session cannot be cancelled directly; use the ‘Request cancellation’ button on My Bookings or contact us.",
          },
          {
            icon: ShieldCheck,
            title: "Less than 24 hours or student no-show",
            content:
              "There is no automatic refund for requests made less than 24 hours before the start or when the student does not attend. Documented exceptional circumstances may be reviewed individually.",
          },
          {
            icon: CheckCircle2,
            title: "Tutor or platform cancellation",
            content:
              "If the tutor or the platform cancels, no tutor can be assigned, you were charged twice, or the purchased service was not provided, you are entitled to a full refund, or account credit if you explicitly choose credit.",
          },
          {
            icon: Clock,
            title: "Unpaid requests and direct bookings",
            content:
              "You can cancel a session request directly before paying. Direct tutor bookings are currently unpaid: a pending booking can be cancelled any time before it starts, and a confirmed booking up to 24 hours before it starts.",
          },
          {
            icon: Mail,
            title: "Processing and contact",
            content:
              "Approved monetary refunds are returned to the original payment method where possible; no refund is automatic. Processing time depends on the payment provider and bank. Contact: info@ostaze.com or WhatsApp +20 11 3038 2206. This policy does not affect any mandatory consumer rights under Egyptian law.",
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
