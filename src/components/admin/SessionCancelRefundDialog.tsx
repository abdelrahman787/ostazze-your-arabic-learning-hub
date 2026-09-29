import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export type RefundDialogMode = "cancel" | "decision" | "record";

interface Props {
  mode: RefundDialogMode;
  request: { id: string; payment_state?: string | null; subject: string | null };
  onClose: () => void;
  onDone: () => void;
}

const decisionLabels: Record<string, string> = {
  refund_not_required: "لا يتطلب استرداد",
  refund_pending: "استرداد قيد المراجعة",
  refund_approved: "الموافقة على الاسترداد",
  refund_rejected: "رفض الاسترداد",
  credit_issued: "رصيد في الحساب (باختيار الطالب)",
};

/** Admin-only (MFA enforced in the database) cancellation and refund workflow. */
const SessionCancelRefundDialog = ({ mode, request, onClose, onDone }: Props) => {
  const paid = request.payment_state !== "unpaid";
  const [actor, setActor] = useState("admin");
  const [reason, setReason] = useState("");
  const [decision, setDecision] = useState(paid ? "refund_pending" : "");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EGP");
  const [reference, setReference] = useState("");
  const [refundedAt, setRefundedAt] = useState("");
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      let error;
      if (mode === "cancel") {
        ({ error } = await supabase.rpc("admin_cancel_session_request", {
          _request_id: request.id,
          _actor: actor,
          _reason: reason,
          _refund_decision: paid ? decision : "",
        }));
      } else if (mode === "decision") {
        ({ error } = await supabase.rpc("admin_set_refund_decision", {
          _request_id: request.id,
          _decision: decision,
          _reason: reason,
        }));
      } else {
        ({ error } = await supabase.rpc("admin_record_refund", {
          _target_type: "session_request",
          _target_id: request.id,
          _amount: Number(amount),
          _currency: currency,
          _provider_reference: reference,
          _refunded_at: new Date(refundedAt).toISOString(),
          _internal_note: note,
        }));
      }
      if (error) throw error;
      toast.success("تم الحفظ");
      onDone();
      onClose();
    } catch (caught) {
      toast.error((caught as Error).message);
    }
    setBusy(false);
  };

  const canSubmit =
    mode === "record"
      ? Number(amount) > 0 &&
        currency.trim().length === 3 &&
        reference.trim().length >= 3 &&
        !!refundedAt &&
        confirmed
      : reason.trim().length >= 3 && (!paid || !!decision);

  const title =
    mode === "cancel"
      ? "إلغاء الجلسة"
      : mode === "decision"
        ? "قرار الاسترداد"
        : "تسجيل استرداد تم تنفيذه";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
        <h3 className="font-extrabold text-lg">{title}</h3>
        <p className="text-xs text-muted-foreground">
          {request.subject || "—"} · {paid ? "مدفوعة" : "غير مدفوعة"}
        </p>

        {mode === "cancel" && (
          <label className="block text-sm font-bold">
            من طلب الإلغاء؟
            <select value={actor} onChange={(e) => setActor(e.target.value)} className="input-base mt-1.5">
              <option value="student">الطالب</option>
              <option value="tutor">المعلم</option>
              <option value="admin">الإدارة</option>
              <option value="platform">المنصة (عطل/عدم توفر معلم)</option>
            </select>
          </label>
        )}

        {mode !== "record" && (
          <label className="block text-sm font-bold">
            السبب (مطلوب)
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="input-base mt-1.5 resize-none" />
          </label>
        )}

        {mode !== "record" && paid && (
          <label className="block text-sm font-bold">
            قرار الاسترداد
            <select value={decision} onChange={(e) => setDecision(e.target.value)} className="input-base mt-1.5">
              {Object.entries(decisionLabels)
                .filter(([k]) => mode === "decision" || k !== "credit_issued")
                .map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
            </select>
          </label>
        )}

        {mode === "record" && (
          <>
            <p className="text-xs bg-warning/10 text-foreground rounded-lg p-2">
              سجّل فقط استردادًا نُفّذ فعلًا عبر مزوّد الدفع. هذا الإجراء لا يحرّك أي أموال.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-bold">المبلغ
                <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-base mt-1.5" />
              </label>
              <label className="block text-sm font-bold">العملة
                <input value={currency} maxLength={3} onChange={(e) => setCurrency(e.target.value.toUpperCase())} className="input-base mt-1.5" />
              </label>
            </div>
            <label className="block text-sm font-bold">مرجع الاسترداد لدى المزوّد
              <input value={reference} onChange={(e) => setReference(e.target.value)} className="input-base mt-1.5" dir="ltr" />
            </label>
            <label className="block text-sm font-bold">وقت تنفيذ الاسترداد
              <input type="datetime-local" value={refundedAt} onChange={(e) => setRefundedAt(e.target.value)} className="input-base mt-1.5" />
            </label>
            <label className="block text-sm font-bold">ملاحظة داخلية (اختيارية، لا تظهر للطالب)
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="input-base mt-1.5 resize-none" />
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" />
              أؤكد أن الاسترداد تم عبر مزوّد الدفع.
            </label>
          </>
        )}

        <div className="flex gap-3">
          <button onClick={submit} disabled={!canSubmit || busy} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
            {busy && <Loader2 size={16} className="animate-spin" />} حفظ
          </button>
          <button onClick={onClose} className="btn-outline flex-1">إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default SessionCancelRefundDialog;
