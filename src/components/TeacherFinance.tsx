import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Wallet, Landmark, Loader2, TrendingUp, Clock, ArrowDownCircle,
  ArrowUpCircle, Gift, MinusCircle, RotateCcw, Save, Receipt,
} from "lucide-react";

interface Tx {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  paid_at: string | null;
  created_at: string;
}

interface Summary {
  available_balance: number;
  pending_amount: number;
  total_earned: number;
  total_paid_out: number;
  transactions_count: number;
}

const emptyBank = {
  account_holder: "",
  bank_name: "",
  country: "",
  iban: "",
  account_number: "",
  swift: "",
};

export const typeMeta: Record<string, { ar: string; en: string; icon: typeof Wallet; cls: string; sign: 1 | -1 }> = {
  earning: { ar: "أرباح حصة", en: "Session earning", icon: ArrowUpCircle, cls: "text-success", sign: 1 },
  bonus: { ar: "مكافأة", en: "Bonus", icon: Gift, cls: "text-success", sign: 1 },
  payout: { ar: "تحويل بنكي", en: "Payout", icon: ArrowDownCircle, cls: "text-primary", sign: -1 },
  deduction: { ar: "خصم", en: "Deduction", icon: MinusCircle, cls: "text-destructive", sign: -1 },
  refund: { ar: "استرداد", en: "Refund", icon: RotateCcw, cls: "text-destructive", sign: -1 },
};

export const statusMeta: Record<string, { ar: string; en: string; cls: string }> = {
  pending: { ar: "قيد الانتظار", en: "Pending", cls: "bg-warning/10 text-warning" },
  completed: { ar: "مكتملة", en: "Completed", cls: "bg-success/10 text-success" },
  cancelled: { ar: "ملغاة", en: "Cancelled", cls: "bg-muted text-muted-foreground" },
};

export const fmtMoney = (v: number, currency = "EGP", lang = "ar") =>
  `${new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", { maximumFractionDigits: 2 }).format(v)} ${currency}`;

const TeacherFinance = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const T = (ar: string, en: string) => (isAr ? ar : en);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [bank, setBank] = useState(emptyBank);
  const [hasBank, setHasBank] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [sumRes, txRes, bankRes] = await Promise.all([
      supabase.rpc("get_teacher_finance_summary", { _teacher_id: user.id }),
      supabase
        .from("teacher_transactions")
        .select("id, type, amount, currency, status, description, paid_at, created_at")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false }),
      supabase.from("teacher_bank_accounts").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    const s = Array.isArray(sumRes.data) ? sumRes.data[0] : sumRes.data;
    setSummary(
      s
        ? {
            available_balance: Number(s.available_balance || 0),
            pending_amount: Number(s.pending_amount || 0),
            total_earned: Number(s.total_earned || 0),
            total_paid_out: Number(s.total_paid_out || 0),
            transactions_count: Number(s.transactions_count || 0),
          }
        : { available_balance: 0, pending_amount: 0, total_earned: 0, total_paid_out: 0, transactions_count: 0 }
    );
    setTxs((txRes.data || []).map((t) => ({ ...t, amount: Number(t.amount) })));
    if (bankRes.data) {
      setHasBank(true);
      setBank({
        account_holder: bankRes.data.account_holder || "",
        bank_name: bankRes.data.bank_name || "",
        country: bankRes.data.country || "",
        iban: bankRes.data.iban || "",
        account_number: bankRes.data.account_number || "",
        swift: bankRes.data.swift || "",
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const saveBank = async () => {
    if (!user) return;
    if (!bank.account_holder.trim() || !bank.bank_name.trim())
      return toast.error(T("اسم صاحب الحساب واسم البنك مطلوبان", "Account holder and bank name are required"));
    if (!bank.iban.trim() && !bank.account_number.trim())
      return toast.error(T("أدخل رقم الآيبان أو رقم الحساب", "Enter an IBAN or an account number"));
    setSaving(true);
    const { error } = await supabase.from("teacher_bank_accounts").upsert(
      {
        user_id: user.id,
        account_holder: bank.account_holder,
        bank_name: bank.bank_name,
        country: bank.country || null,
        iban: bank.iban || null,
        account_number: bank.account_number || null,
        swift: bank.swift || null,
      },
      { onConflict: "user_id" }
    );
    setSaving(false);
    if (error) return toast.error(error.message);
    setHasBank(true);
    toast.success(T("تم حفظ بيانات الحساب البنكي", "Bank details saved"));
  };

  const currency = txs[0]?.currency || "EGP";
  const input = "input-base w-full";
  const lbl = "block text-sm font-bold mb-1.5";

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  const cards = [
    { label: T("الرصيد المتاح", "Available balance"), value: summary?.available_balance ?? 0, icon: Wallet, cls: "bg-primary/10 text-primary" },
    { label: T("قيد الانتظار", "Pending"), value: summary?.pending_amount ?? 0, icon: Clock, cls: "bg-warning/10 text-warning" },
    { label: T("إجمالي الأرباح", "Total earned"), value: summary?.total_earned ?? 0, icon: TrendingUp, cls: "bg-success/10 text-success" },
    { label: T("إجمالي المسحوب", "Total paid out"), value: summary?.total_paid_out ?? 0, icon: ArrowDownCircle, cls: "bg-muted text-foreground" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card-base p-5">
            <div className={`icon-box ${c.cls} mb-3`}>
              <c.icon size={18} />
            </div>
            <div className="text-lg font-black">{fmtMoney(c.value, currency, lang)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Bank details */}
      <div className="card-base p-6">
        <div className="flex items-center gap-2 mb-5">
          <Landmark size={18} className="text-primary" />
          <h3 className="font-extrabold">{T("بيانات الحساب البنكي", "Bank account details")}</h3>
          {!hasBank && (
            <span className="tag-outline text-[0.65rem] text-warning border-warning/40">
              {T("غير مكتمل", "Incomplete")}
            </span>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={lbl}>{T("اسم صاحب الحساب", "Account holder")}</label>
            <input className={input} value={bank.account_holder} onChange={(e) => setBank((b) => ({ ...b, account_holder: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{T("اسم البنك", "Bank name")}</label>
            <input className={input} value={bank.bank_name} onChange={(e) => setBank((b) => ({ ...b, bank_name: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{T("الدولة", "Country")}</label>
            <input className={input} value={bank.country} onChange={(e) => setBank((b) => ({ ...b, country: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>IBAN</label>
            <input className={input} dir="ltr" value={bank.iban} onChange={(e) => setBank((b) => ({ ...b, iban: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{T("رقم الحساب", "Account number")}</label>
            <input className={input} dir="ltr" value={bank.account_number} onChange={(e) => setBank((b) => ({ ...b, account_number: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>SWIFT</label>
            <input className={input} dir="ltr" value={bank.swift} onChange={(e) => setBank((b) => ({ ...b, swift: e.target.value }))} />
          </div>
        </div>
        <button onClick={saveBank} disabled={saving} className="btn-primary mt-5 flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {T("حفظ البيانات", "Save details")}
        </button>
      </div>

      {/* Transactions */}
      <div className="card-base p-6">
        <div className="flex items-center gap-2 mb-5">
          <Receipt size={18} className="text-primary" />
          <h3 className="font-extrabold">{T("كل المعاملات المالية", "All transactions")}</h3>
          <span className="text-xs text-muted-foreground">({summary?.transactions_count ?? 0})</span>
        </div>
        {txs.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-10">
            {T("لا توجد معاملات مالية بعد", "No transactions yet")}
          </p>
        ) : (
          <div className="space-y-2">
            {txs.map((tx) => {
              const meta = typeMeta[tx.type] || typeMeta.earning;
              const st = statusMeta[tx.status] || statusMeta.pending;
              const Icon = meta.icon;
              return (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/60 border">
                  <div className={`icon-box bg-card ${meta.cls}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{isAr ? meta.ar : meta.en}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {tx.description || "—"} · {new Date(tx.paid_at || tx.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <span className={`text-[0.65rem] font-bold px-2 py-1 rounded-full ${st.cls}`}>{isAr ? st.ar : st.en}</span>
                  <div className={`text-sm font-black shrink-0 ${meta.sign === 1 ? "text-success" : "text-destructive"}`} dir="ltr">
                    {meta.sign === 1 ? "+" : "-"}
                    {fmtMoney(tx.amount, tx.currency, lang)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherFinance;
