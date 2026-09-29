import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  req: {
    id: string;
    status: string;
    payment_state?: string | null;
    refund_status?: string | null;
    preferred_date: string | null;
    preferred_time: string | null;
  };
  role: "student" | "tutor";
  lang: string;
  onChanged: () => void;
}

const refundText: Record<string, [string, string]> = {
  cancellation_requested: ["تم استلام طلب الإلغاء — قيد مراجعة الإدارة", "Cancellation request received — under Admin review"],
  refund_not_required: ["لا يتطلب استرداد", "No refund required"],
  refund_pending: ["الاسترداد قيد المراجعة", "Refund under review"],
  refund_approved: ["تمت الموافقة على الاسترداد", "Refund approved"],
  refunded: ["تم الاسترداد عبر مزوّد الدفع", "Refunded through the payment provider"],
  refund_rejected: ["لم تتم الموافقة على الاسترداد", "Refund not approved"],
  credit_issued: ["أضيف رصيد إلى حسابك", "Account credit issued"],
};

/**
 * Student/tutor actions on a session request. The database enforces every rule;
 * this only hides actions the server would refuse.
 */
const SessionRequestActions = ({ req, role, lang, onChanged }: Props) => {
  const ar = lang === "ar";
  const [open, setOpen] = useState<null | "cancel" | "reschedule" | "decline">(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const start =
    req.preferred_date != null
      ? new Date(`${req.preferred_date}T${req.preferred_time || "00:00"}`).getTime()
      : null;
  const hours = start == null ? null : (start - Date.now()) / 3_600_000;
  const past = hours != null && hours <= 0;
  const terminal = ["cancelled", "completed", "rejected"].includes(req.status);
  const unpaidDirect =
    role === "student" &&
    ["pending", "pending_payment"].includes(req.status) &&
    (req.payment_state ?? "unpaid") === "unpaid";
  const paid = (req.payment_state ?? "unpaid") !== "unpaid";

  const run = async (fn: () => PromiseLike<{ error: { message: string } | null }>) => {
    setBusy(true);
    const { error } = await fn();
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(ar ? "تم" : "Done");
    setOpen(null);
    setReason("");
    onChanged();
  };

  const status = req.refund_status ? refundText[req.refund_status] : null;

  if (terminal || past) {
    return status ? <p className="text-xs font-bold text-primary">{ar ? status[0] : status[1]}</p> : null;
  }

  return (
    <div className="space-y-2">
      {status && <p className="text-xs font-bold text-primary">{ar ? status[0] : status[1]}</p>}
      <div className="flex flex-wrap gap-2">
        {unpaidDirect ? (
          <button
            disabled={busy}
            onClick={() => run(() => supabase.rpc("student_cancel_session_request", { _request_id: req.id }))}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
          >
            {ar ? "إلغاء الطلب" : "Cancel request"}
          </button>
        ) : (
          req.refund_status !== "cancellation_requested" && (
            <>
              <button onClick={() => setOpen("cancel")} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20">
                {ar ? "طلب إلغاء" : "Request cancellation"}
              </button>
              {req.status !== "paid_awaiting_assignment" && (
                <button onClick={() => setOpen("reschedule")} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/70">
                  {ar ? "طلب إعادة جدولة" : "Request reschedule"}
                </button>
              )}
              {role === "tutor" && req.status === "assigned" && (
                <button onClick={() => setOpen("decline")} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/70">
                  {ar ? "الاعتذار عن التعيين" : "Decline assignment"}
                </button>
              )}
            </>
          )
        )}
      </div>

      {open && (
        <div className="p-3 bg-secondary/60 rounded-xl space-y-2">
          {role === "student" && open === "cancel" && paid && (
            <p className="text-xs text-foreground/80">
              {hours == null || hours >= 24
                ? ar
                  ? "طلبك قبل 24 ساعة أو أكثر من الموعد: مؤهل لاسترداد كامل بعد مراجعة الإدارة."
                  : "Requested 24+ hours before the start: eligible for a full refund after Admin review."
                : ar
                  ? "أقل من 24 ساعة قبل الموعد: لا يوجد استرداد تلقائي، ويمكن مراجعة الظروف الاستثنائية الموثقة."
                  : "Less than 24 hours before the start: no automatic refund; documented exceptional circumstances may be reviewed."}
            </p>
          )}
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            aria-label={ar ? "السبب" : "Reason"}
            placeholder={ar ? "السبب (مطلوب)" : "Reason (required)"}
            className="input-base resize-none text-sm"
          />
          <div className="flex gap-2">
            <button
              disabled={busy || reason.trim().length < 3}
              onClick={() =>
                run(() =>
                  open === "decline"
                    ? supabase.rpc("tutor_decline_assignment", { _request_id: req.id, _reason: reason })
                    : supabase.rpc("request_session_change", { _request_id: req.id, _kind: open, _reason: reason }),
                )
              }
              className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {busy && <Loader2 size={14} className="animate-spin" />}
              {ar ? "إرسال" : "Submit"}
            </button>
            <button onClick={() => setOpen(null)} className="px-4 py-2 rounded-xl bg-card text-sm font-bold">
              {ar ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionRequestActions;
