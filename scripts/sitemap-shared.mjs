export const BASE_URL = "https://ostaze.com";
export const SUPABASE_URL = "https://dqqfzpghixfvhhpxfgwv.supabase.co";
export const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxcWZ6cGdoaXhmdmhocHhmZ3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwOTMzNjcsImV4cCI6MjA4ODY2OTM2N30.7WsVUn0uoogL7xfQ80Fw_UUncbEHPf10tPYue4DuYSg";

// Routes that must never appear in the sitemap (auth, private, noindex).
export const BLOCKED_PREFIXES = [
  "/login", "/register", "/forgot-password", "/reset-password",
  "/dashboard", "/admin", "/checkout", "/lectures", "/my-bookings",
  "/my-courses", "/zoom-test", "/teacher/onboarding",
];

/** Throws on failure so callers can decide how to handle offline builds. */
export async function fetchRows(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.json();
}

// Must match what the pages themselves query, so every URL renders real content.
export const TEACHERS_QUERY = "teacher_profiles?select=id,user_id,updated_at&user_id=not.is.null&limit=5000";
export const COURSES_QUERY = "courses?select=id,updated_at&is_published=eq.true&limit=5000";
