import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Diagnostics = {
  secrets: Record<string, boolean | string>;
  wapilot: Record<string, unknown>;
  zoom: { ok: boolean; error: string | null };
  scheduler: { jobname?: string; schedule?: string; active?: boolean } | null;
  upcoming_confirmed_sessions: number;
  last_error: string | null;
};

const Dot = ({ ok }: { ok: boolean }) => (
  <span
    aria-hidden
    className={`inline-block w-2.5 h-2.5 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`}
  />
);

const Row = ({ label, ok, value }: { label: string; ok: boolean; value?: string }) => (
  <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border/60 last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="flex items-center gap-2 text-sm font-semibold">
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      <Dot ok={ok} />
      {ok ? "نعم" : "لا"}
    </span>
  </div>
);

export default function AdminAutomationDiagnostics() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Diagnostics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [confirmTest, setConfirmTest] = useState(false);
  const [sending, setSending] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    const { data: res, error: err } = await supabase.functions.invoke("automation-diagnostics", {
      body: { action: "diagnose" },
    });
    setLoading(false);
    if (err || !res?.success) {
      setError(res?.error || err?.message || "تعذر تشغيل الفحص");
      return;
    }
    setData(res as Diagnostics);
  };

  const sendTest = async () => {
    if (!confirmTest || !phone.trim()) return;
    setSending(true);
    const { data: res, error: err } = await supabase.functions.invoke("automation-diagnostics", {
      body: { action: "send_test", phone: phone.trim(), confirm: true },
    });
    setSending(false);
    if (err || !res?.success) {
      toast({ title: "فشل الإرسال", description: res?.error || err?.message, variant: "destructive" });
      return;
    }
    toast({ title: "تم إرسال رسالة الاختبار ✅" });
  };

  const s = data?.secrets;
  const w = data?.wapilot as Record<string, unknown> | undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-bold">فحص تكامل واتساب و Zoom</h2>
        <button
          onClick={run}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-60"
        >
          {loading ? "جاري الفحص..." : "تشغيل الفحص"}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      {data && (
        <>
          <div className="rounded-2xl border border-border p-4">
            <h3 className="font-bold mb-2 text-sm">المفاتيح السرية</h3>
            <Row label="WAPILOT_API_TOKEN" ok={Boolean(s?.wapilot_token)} />
            <Row label="WAPILOT_INSTANCE_ID" ok={Boolean(s?.wapilot_instance_id)} />
            <Row
              label="WAPILOT_API_BASE_URL"
              ok
              value={String(s?.wapilot_base_url_effective || "")}
            />
            <Row label="ZOOM_ACCOUNT_ID" ok={Boolean(s?.zoom_account_id)} />
            <Row label="ZOOM_CLIENT_ID" ok={Boolean(s?.zoom_client_id)} />
            <Row label="ZOOM_CLIENT_SECRET" ok={Boolean(s?.zoom_client_secret)} />
          </div>

          <div className="rounded-2xl border border-border p-4">
            <h3 className="font-bold mb-2 text-sm">اتصال WaPilot</h3>
            <Row label="الخدمة متاحة" ok={Boolean(w?.reachable)} />
            <Row label="الجهاز موجود" ok={Boolean(w?.instance_found)} />
            <Row label="الحالة" ok={w?.status === "WORKING"} value={String(w?.status ?? "-")} />
            <Row
              label="حالة الجلسة"
              ok={w?.session_status === "WORKING"}
              value={String(w?.session_status ?? "-")}
            />
            <Row label="API مفعل" ok={w?.is_api === true} />
            <Row
              label="الاشتراك نشط"
              ok={w?.subscription_status === "active"}
              value={String(w?.subscription_status ?? "-")}
            />
          </div>

          <div className="rounded-2xl border border-border p-4">
            <h3 className="font-bold mb-2 text-sm">Zoom والمجدول</h3>
            <Row label="بيانات Zoom صالحة" ok={data.zoom.ok} value={data.zoom.error || undefined} />
            <Row
              label="مهمة التذكيرات مفعلة"
              ok={Boolean(data.scheduler?.active)}
              value={data.scheduler?.schedule || "-"}
            />
            <Row label="جلسات مؤكدة قادمة" ok value={String(data.upcoming_confirmed_sessions)} />
          </div>

          {data.last_error && (
            <div className="p-4 rounded-xl bg-amber-500/10 text-amber-700 text-sm">
              آخر خطأ: {data.last_error}
            </div>
          )}

          <div className="rounded-2xl border border-border p-4 space-y-3">
            <h3 className="font-bold text-sm">رسالة اختبار (اختياري)</h3>
            <p className="text-xs text-muted-foreground">
              لا يتم إرسال أي رسالة إلا بعد تفعيل التأكيد أدناه.
            </p>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم دولي مثل 201130382206"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={confirmTest}
                onChange={(e) => setConfirmTest(e.target.checked)}
              />
              أؤكد إرسال رسالة اختبار إلى هذا الرقم
            </label>
            <button
              onClick={sendTest}
              disabled={!confirmTest || !phone.trim() || sending}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50"
            >
              {sending ? "جاري الإرسال..." : "إرسال رسالة اختبار"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
