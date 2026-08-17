ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.teacher_bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  account_holder text NOT NULL,
  bank_name text NOT NULL,
  country text,
  iban text,
  account_number text,
  swift text,
  balance numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.teacher_bank_accounts TO authenticated;
GRANT ALL ON public.teacher_bank_accounts TO service_role;

ALTER TABLE public.teacher_bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers view own bank account"
ON public.teacher_bank_accounts FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers insert own bank account"
ON public.teacher_bank_accounts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers update own bank account"
ON public.teacher_bank_accounts FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage bank accounts"
ON public.teacher_bank_accounts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_teacher_bank_accounts_updated_at
BEFORE UPDATE ON public.teacher_bank_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- balance is admin-controlled: block teachers from changing it
CREATE OR REPLACE FUNCTION public.lock_bank_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.balance IS DISTINCT FROM OLD.balance AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.balance := OLD.balance;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_lock_bank_balance
BEFORE UPDATE ON public.teacher_bank_accounts
FOR EACH ROW EXECUTE FUNCTION public.lock_bank_balance();