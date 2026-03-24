
-- 1. Create session_requests table (replacing bookings)
CREATE TABLE public.session_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  teacher_id uuid,
  subject text,
  preferred_date date,
  preferred_time time,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  zoom_url text,
  assigned_by uuid,
  reject_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Add zoom_url to lectures
ALTER TABLE public.lectures ADD COLUMN IF NOT EXISTS zoom_url text;

-- 3. Add timezone to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Asia/Riyadh';

-- 4. Enable RLS on session_requests
ALTER TABLE public.session_requests ENABLE ROW LEVEL SECURITY;

-- RLS: Students can insert their own requests
CREATE POLICY "sr_insert_student" ON public.session_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- RLS: Students and assigned teachers can view their requests, admins can view all
CREATE POLICY "sr_select" ON public.session_requests
  FOR SELECT TO authenticated
  USING (
    auth.uid() = student_id 
    OR auth.uid() = teacher_id 
    OR has_role(auth.uid(), 'admin')
  );

-- RLS: Admins can update any request (assign teacher, change status)
CREATE POLICY "sr_update_admin" ON public.session_requests
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- RLS: Teacher can update their assigned requests (accept/reject)
CREATE POLICY "sr_update_teacher" ON public.session_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = teacher_id);

-- RLS: Student can cancel their own request
CREATE POLICY "sr_update_student" ON public.session_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = student_id);

-- RLS: Admin can delete
CREATE POLICY "sr_delete_admin" ON public.session_requests
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE TRIGGER set_updated_at_session_requests
  BEFORE UPDATE ON public.session_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_requests;
