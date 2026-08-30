import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { resolveDisplayName } from "@/lib/teacherNameTranslate";
import { toast } from "sonner";
import {
  Loader2, Search, Wallet, Landmark, Plus, Trash2, CheckCircle2,
  XCircle, Clock, TrendingUp, ArrowDownCircle, RefreshCw,
} from "lucide-react";
import { fmtMoney, statusMeta, typeMeta } from "@/components/TeacherFinance";

interface TeacherLite {
  user_id: string;
  full_name: string | null;
  full_name_en: string | null;
}

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

interface BankRow {
  account_holder: string;
  bank_name: string;
  country: string | null;
  iban: string | null;
  account_number: string | null;
  swift: string | null;
  balance: number;
}

const TX_TYPES = ["earning", "bonus", "payout", "deduction", "refund"] as const;
const TX_STATUSES = ["pending", "completed", "cancelled"] as const;
const CURRENCIES = ["EGP", "SAR", "QAR", "KWD", "AED", "USD"];

const AdminTeacherFinance = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const T = (ar: string, en: string) => (isAr ? ar : en);

  const [teachers, setTeachers] = useState<TeacherLite[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TeacherLite | null>(null);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [bank, setBank] = useState<BankRow | null>(null);
  const [summary, setSummary] = useState({ available_balance: 0, pending_amount: 0, total_earned: 0, total_paid_out: 0 });
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "earning" as (typeof TX_TYPES)[number],
    amount: "",
    currency: "EGP",
    status: "completed" as (typeof TX_STATUSES)[number],
    description: "",
  });

  const loadTeachers = useCallback(async () => {
    setLoadingTeachers(true);
    const { data: tp } = await supabase.from("teacher_profiles").select("user_id");
    const ids = (tp || []).map((r) => r.user_id);
    if (ids.length === 0) {
      setTeachers([]);
      setLoadingTeachers(false);
      return;
    }
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, full_name_en")
      .in("user_id", ids);
    setTeachers(
      ids.map((id) => {
        const p = profiles?.find((x) => x.user_id === id);
        return { user_id: id, full_name: p?.full_name ?? null, full_name_en: p?.full_name_en ?? null };
      })
    );
    setLoadingTeachers(false);
  }, []);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const loadDetail = useCallback(async (teacherId: string) => {
    setLoadingDetail(true);
    const [txRes, bankRes, sumRes] = await Promise.all([
      supabase
        .from("teacher_transactions")
        .select("id, type, amount, currency, status, description, paid_at, created_at")
        .eq("teacher_id", teacherId)
        .order("created_at", { ascending: false }),
      supabase.from("teacher_bank_accounts").select("*").eq("user_id", teacherId).maybeSingle(),
      supabase.rpc("get_teacher_finance_summary", { _teacher_id: teacherId }),
    ]);
    setTxs((txRes.data || []).map((t) => ({ ...t, amount: Number(t.amount) })));
    setBank(
      bankRes.data
        ? {
            account_holder: bankRes.data.account_holder,
            bank_name: bankRes.data.bank_name,
            country: bankRes.data.country,
            iban: bankRes.data.iban,
            account_number: bankRes.data.account_number,
            swift: bankRes.data.swift,
            balance: Number(bankRes.data.balance || 0),
          }
        : null
    );
    const s = Array.isArray(sumRes.data) ? sumRes.data[0] : (sumRes.data as any);
    setSummary({
      available_balance: Number(s?.available_balance || 0),
      pending_amount: Number(s?.pending_amount || 0),
      total_earned: Number(s?.total_earned || 0),
      total_paid_out: Number(s?.total_paid_out || 0),
    });
    setLoadingDetail(false);
  }, []);

  useEffect(() => {
    if (selected) loadDetail(selected.user_id);
  }, [selected, loadDetail]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((tc) => [tc.full_name, tc.full_name_en].some((v) => (v || "").toLowerCase().includes(q)));
  }, [teachers, search]);

  const addTx = async () => {
    if (!selected) return;
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) return toast.error(T("أدخل مبلغًا صحيحًا", "Enter a valid amount"));
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from("teacher_transactions").insert({
      teacher_id: selected.user_id,
      type: form.type,
      amount,
      currency: form.currency,
      status: form.status,
      description: form.description || null,
      paid_at: form.status === "completed" ? new Date().toISOString() : null,
      created_by: auth.user?.id ?? null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(T("تمت إضافة المعاملة", "Transaction added"));
    setForm((f) => ({ ...f, amount: "", description: "" }));
    loadDetail(selected.user_id);
  };

  const updateStatus = async (tx: Tx, status: string) => {
    const { error } = await supabase
      .from("teacher_transactions")
      .update({ status, paid_at: status === "completed" ? new Date().toISOString() : null })
      .eq("id", tx.id);
    if (error) return toast.error(error.message);
    if (selected) loadDetail(selected.user_id);
  };

  const removeTx = async (tx: Tx) => {
    if (!confirm(T("حذف هذه المعاملة؟", "Delete this transaction?"))) return;
    const { error } = await supabase.from("teacher_transactions").delete().eq("id", tx.id);
    if (error) return toast.error(error.message);
    if (selected) loadDetail(selected.user_id);
  };

  const input = "input-base w-full";
  const lbl = "block text-xs font-bold mb-1";

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] animate-fade-in">
      {/* Teachers list */}
      <div className="card-base p-4 h-fit">
        <div className="relative mb-3">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
          <input
            className="input-base w-full ps-9"
            placeholder={T("ابحث عن معلم…", "Search teacher…")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loadingTeachers ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={20} /></div>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">{T("لا يوجد معلمون", "No teachers")}</p>
        ) : (
          <div className="space-y-1 max-h-[520px] overflow-y-auto">
            {filtered.map((tc) => {
              const name = resolveDisplayName(tc.full_name, tc.full_name_en, lang) || "—";
              const active = selected?.user_id === tc.user_id;
              return (
                <button
                  key={tc.user_id}
                  onClick={() => setSelected(tc)}
                  className={`w-full text-start px-3 py-2 rounded-xl text-sm transition-colors ${active ? "bg-primary text-primary-foreground font-bold" : "hover:bg-primary/5"}`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail */}
      {!selected ? (
        <div className="card-base p-12 text-center">
          <Wallet size={44} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">{T("اختر معلمًا لعرض حالته المالية", "Select a teacher to see their financials")}</p>
        </div>
      ) : loadingDetail ? (
        <div className="card-base p-12 flex justify-center"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg">
              {resolveDisplayName(selected.full_name, selected.full_name_en, lang)}
            </h3>
            <button onClick={() => loadDetail(selected.user_id)} className="text-xs font-bold text-primary flex items-center gap-1">
              <RefreshCw size={13} /> {T("تحديث", "Refresh")}
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: T("الرصيد المتاح", "Available"), value: summary.available_balance, icon: Wallet, cls: "bg-primary/10 text-primary" },
              { label: T("قيد الانتظار", "Pending"), value: summary.pending_amount, icon: Clock, cls: "bg-warning/10 text-warning" },
              { label: T("إجمالي الأرباح", "Total earned"), value: summary.total_earned, icon: TrendingUp, cls: "bg-success/10 text-success" },
              { label: T("إجمالي المسحوب", "Paid out"), value: summary.total_paid_out, icon: ArrowDownCircle, cls: "bg-muted text-foreground" },
            ].map((c) => (
              <div key={c.label} className="card-base p-4">
                <div className={`icon-box ${c.cls} mb-2`}><c.icon size={16} /></div>
                <div className="text-base font-black">{fmtMoney(c.value, form.currency, lang)}</div>
                <div className="text-[0.7rem] text-muted-foreground">{c.label}</div>
              </div>
            ))}
          </div>

          {/* Bank info */}
          <div className="card-base p-5">
            <div className="flex items-center gap-2 mb-3">
              <Landmark size={16} className="text-primary" />
              <h4 className="font-bold text-sm">{T("بيانات الحساب البنكي", "Bank account")}</h4>
            </div>
            {!bank ? (
              <p className="text-xs text-muted-foreground">{T("لم يضف المعلم بياناته البنكية بعد", "Teacher has not added bank details yet")}</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 text-sm">
                {[
                  [T("صاحب الحساب", "Account holder"), bank.account_holder],
                  [T("البنك", "Bank"), bank.bank_name],
                  [T("الدولة", "Country"), bank.country || "—"],
                  ["IBAN", bank.iban || "—"],
                  [T("رقم الحساب", "Account number"), bank.account_number || "—"],
                  ["SWIFT", bank.swift || "—"],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex justify-between gap-3 p-2 rounded-lg bg-muted/60 border">
                    <span className="text-muted-foreground text-xs">{k}</span>
                    <span className="font-medium text-xs truncate" dir="ltr">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add transaction */}
          <div className="card-base p-5">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><Plus size={16} className="text-primary" /> {T("إضافة معاملة", "Add transaction")}</h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={lbl}>{T("النوع", "Type")}</label>
                <select className={input} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))}>
                  {TX_TYPES.map((tp) => (
                    <option key={tp} value={tp}>{isAr ? typeMeta[tp].ar : typeMeta[tp].en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lbl}>{T("المبلغ", "Amount")}</label>
                <input className={input} type="number" min="0" step="0.01" dir="ltr" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
              </div>
              <div>
                <label className={lbl}>{T("العملة", "Currency")}</label>
                <select className={input} value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}>
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>{T("الحالة", "Status")}</label>
                <select className={input} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))}>
                  {TX_STATUSES.map((s) => (
                    <option key={s} value={s}>{isAr ? statusMeta[s].ar : statusMeta[s].en}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>{T("الوصف", "Description")}</label>
                <input className={input} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder={T("مثال: حصة رياضيات ٢ ساعة", "e.g. Math session, 2 hours")} />
              </div>
            </div>
            <button onClick={addTx} disabled={saving} className="btn-primary mt-4 flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              {T("إضافة", "Add")}
            </button>
          </div>

          {/* Transactions */}
          <div className="card-base p-5">
            <h4 className="font-bold text-sm mb-4">{T("سجل المعاملات", "Transaction history")} ({txs.length})</h4>
            {txs.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">{T("لا توجد معاملات", "No transactions")}</p>
            ) : (
              <div className="space-y-2">
                {txs.map((tx) => {
                  const meta = typeMeta[tx.type] || typeMeta.earning;
                  const st = statusMeta[tx.status] || statusMeta.pending;
                  const Icon = meta.icon;
                  return (
                    <div key={tx.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-muted/60 border">
                      <div className={`icon-box bg-card ${meta.cls}`}><Icon size={15} /></div>
                      <div className="flex-1 min-w-[140px]">
                        <div className="font-bold text-sm">{isAr ? meta.ar : meta.en}</div>
                        <div className="text-[0.7rem] text-muted-foreground truncate">
                          {tx.description || "—"} · {new Date(tx.paid_at || tx.created_at).toLocaleDateString(isAr ? "ar-EG" : "en-US")}
                        </div>
                      </div>
                      <span className={`text-[0.65rem] font-bold px-2 py-1 rounded-full ${st.cls}`}>{isAr ? st.ar : st.en}</span>
                      <div className={`text-sm font-black ${meta.sign === 1 ? "text-success" : "text-destructive"}`} dir="ltr">
                        {meta.sign === 1 ? "+" : "-"}{fmtMoney(tx.amount, tx.currency, lang)}
                      </div>
                      <div className="flex items-center gap-1">
                        {tx.status !== "completed" && (
                          <button onClick={() => updateStatus(tx, "completed")} title={T("تأكيد", "Mark completed")} className="p-1.5 rounded-lg hover:bg-success/10 text-success">
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                        {tx.status !== "cancelled" && (
                          <button onClick={() => updateStatus(tx, "cancelled")} title={T("إلغاء", "Cancel")} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                            <XCircle size={15} />
                          </button>
                        )}
                        <button onClick={() => removeTx(tx)} title={T("حذف", "Delete")} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeacherFinance;
