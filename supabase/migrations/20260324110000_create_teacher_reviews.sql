-- Create teacher_reviews table for the ratings/reviews system
create table if not exists public.teacher_reviews (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  unique(teacher_id, student_id)
);

-- Enable Row Level Security
alter table public.teacher_reviews enable row level security;

-- Anyone can read reviews
create policy "teacher_reviews_read_all"
  on public.teacher_reviews for select
  using (true);

-- Only authenticated students can insert their own review
create policy "teacher_reviews_insert_own"
  on public.teacher_reviews for insert
  with check (auth.uid() = student_id);

-- Students can update their own review
create policy "teacher_reviews_update_own"
  on public.teacher_reviews for update
  using (auth.uid() = student_id);
