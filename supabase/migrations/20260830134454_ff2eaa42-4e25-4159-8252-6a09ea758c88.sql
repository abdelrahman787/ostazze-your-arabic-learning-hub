REVOKE ALL ON FUNCTION public.sync_teacher_balance() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_teacher_finance_summary(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_teacher_finance_summary(uuid) TO authenticated;