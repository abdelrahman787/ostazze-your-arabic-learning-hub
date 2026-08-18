CREATE OR REPLACE FUNCTION public.get_automation_cron_status()
RETURNS TABLE(jobname text, schedule text, active boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, cron
AS $$
  SELECT j.jobname::text, j.schedule::text, j.active
  FROM cron.job j
  WHERE j.jobname = 'session-whatsapp-reminders'
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_automation_cron_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_automation_cron_status() TO service_role;