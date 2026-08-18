ALTER TABLE public.session_requests
  ADD COLUMN IF NOT EXISTS whatsapp_reminder_1h_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS whatsapp_start_sent_at timestamptz;
