CREATE TABLE IF NOT EXISTS public.teacher_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('earning','payout','bonus','deduction','refund')),
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'EGP',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','cancelled')),
  description text,
  session_request_id uuid REFERENCES public.session_requests(id) ON DELETE SET NULL,
  paid_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS teacher_transactions_teacher_idx ON public.teacher_transactions(teacher_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_transactions TO authenticated;
GRANT ALL ON public.teacher_transactions TO service_role;

ALTER TABLE public.teacher_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers read own transactions"
ON public.teacher_transactions FOR SELECT TO authenticated
USING (teacher_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert transactions"
ON public.teacher_transactions FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update transactions"
ON public.teacher_transactions FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete transactions"
ON public.teacher_transactions FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER teacher_transactions_updated_at
BEFORE UPDATE ON public.teacher_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Keep balance on teacher_bank_accounts in sync with completed transactions
CREATE OR REPLACE FUNCTION public.sync_teacher_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _teacher uuid := COALESCE(NEW.teacher_id, OLD.teacher_id);
  _balance numeric;
BEGIN
  SELECT COALESCE(SUM(
    CASE WHEN type IN ('earning','bonus') THEN amount ELSE -amount END
  ), 0)
  INTO _balance
  FROM public.teacher_transactions
  WHERE teacher_id = _teacher AND status = 'completed';

  UPDATE public.teacher_bank_accounts
  SET balance = _balance, updated_at = now()
  WHERE user_id = _teacher;

  RETURN NULL;
END;
$$;

CREATE TRIGGER teacher_transactions_sync_balance
AFTER INSERT OR UPDATE OR DELETE ON public.teacher_transactions
FOR EACH ROW EXECUTE FUNCTION public.sync_teacher_balance();

-- Summary helper
CREATE OR REPLACE FUNCTION public.get_teacher_finance_summary(_teacher_id uuid)
RETURNS TABLE (
  available_balance numeric,
  pending_amount numeric,
  total_earned numeric,
  total_paid_out numeric,
  transactions_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(SUM(CASE WHEN status = 'completed' THEN (CASE WHEN type IN ('earning','bonus') THEN amount ELSE -amount END) ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'pending' AND type IN ('earning','bonus') THEN amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'completed' AND type IN ('earning','bonus') THEN amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'completed' AND type = 'payout' THEN amount ELSE 0 END), 0),
    COUNT(*)
  FROM public.teacher_transactions
  WHERE teacher_id = _teacher_id
    AND (_teacher_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
$$;

GRANT EXECUTE ON FUNCTION public.get_teacher_finance_summary(uuid) TO authenticated;