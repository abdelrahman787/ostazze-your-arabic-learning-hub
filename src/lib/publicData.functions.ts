// Public, read-only data for server-rendered tutor and course pages.
// Uses the publishable key (anon role), so the database's own rules decide what is visible:
// only verified tutors and published courses. Only explicit safe columns are selected —
// never emails, CVs, application data or private fields.
import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function publicClient() {
  const url = process.env["SUPABASE_URL"] || import.meta.env.VITE_SUPABASE_URL;
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storage: undefined,
    },
  });
}

// Short shared cache: edits, publishing or removal show up within about a minute.
function cachePublic() {
  try {
    setResponseHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=60, stale-while-revalidate=120",
    );
  } catch {
    /* not in a request context */
  }
}

export type PublicTeacher = {
  user_id: string;
  full_name: string | null;
  full_name_en: string | null;
  bio: string | null;
  bio_en: string | null;
  avatar_url: string | null;
  subjects: string[];
  subjects_en: string[];
  university: string | null;
  university_en: string | null;
  major: string | null;
  major_en: string | null;
  price: number;
  verified: boolean;
};

export const getPublicTeacher = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => {
    if (!input || typeof input.id !== "string") throw new Error("Invalid id");
    return { id: input.id };
  })
  .handler(async ({ data }): Promise<PublicTeacher | null> => {
    if (!UUID.test(data.id)) return null;
    const sb = publicClient();
    const { data: tp, error } = await sb
      .from("teacher_profiles")
      .select(
        "user_id, subjects, subjects_en, university, university_en, major, major_en, price, verified",
      )
      .eq("user_id", data.id)
      .eq("verified", true)
      .maybeSingle();
    if (error) throw new Error("Tutor lookup failed");
    if (!tp) return null;
    const { data: rows } = await sb.rpc("get_public_profile", {
      _user_id: data.id,
    });
    const p = (rows as Array<Record<string, string | null>> | null)?.[0];
    cachePublic();
    return {
      user_id: tp.user_id,
      full_name: p?.["full_name"] ?? null,
      full_name_en: p?.["full_name_en"] ?? null,
      bio: p?.["bio"] ?? null,
      bio_en: p?.["bio_en"] ?? null,
      avatar_url: p?.["avatar_url"] ?? null,
      subjects: tp.subjects || [],
      subjects_en: tp.subjects_en || [],
      university: tp.university ?? null,
      university_en: tp.university_en ?? null,
      major: tp.major ?? null,
      major_en: tp.major_en ?? null,
      price: Number(tp.price || 0),
      verified: !!tp.verified,
    };
  });

const COURSE_COLUMNS =
  "id, title, title_en, description, description_en, short_description, short_description_en, price, course_type, cover_image_url, total_hours, category, category_en, instructor_id, instructor_name, instructor_name_en, level, language, is_published, enrollment_count, created_at, updated_at";

export type PublicCourse = Database["public"]["Tables"]["courses"]["Row"];

export const getPublicCourse = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => {
    if (!input || typeof input.id !== "string") throw new Error("Invalid id");
    return { id: input.id };
  })
  .handler(async ({ data }): Promise<PublicCourse | null> => {
    if (!UUID.test(data.id)) return null;
    const { data: course, error } = await publicClient()
      .from("courses")
      .select(COURSE_COLUMNS)
      .eq("id", data.id)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error("Course lookup failed");
    if (!course) return null;
    cachePublic();
    return course as PublicCourse;
  });

// First page of list pages, server-rendered so crawlers see real cards and links.
export const LIST_PAGE_SIZE = 24;

export type PublicTeacherCard = Omit<PublicTeacher, never>;

export const listPublicTeachers = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicTeacherCard[]> => {
    const sb = publicClient();
    const { data: tps, error } = await sb
      .from("teacher_profiles")
      .select(
        "user_id, subjects, subjects_en, university, university_en, major, major_en, price, verified",
      )
      .eq("verified", true)
      .order("created_at", { ascending: true })
      .limit(LIST_PAGE_SIZE);
    if (error) throw new Error("Tutor list failed");
    if (!tps || tps.length === 0) {
      cachePublic();
      return [];
    }
    const { data: profiles } = await sb.rpc("get_public_profiles", {
      _user_ids: tps.map((t) => t.user_id),
    });
    const map = new Map(
      ((profiles as Array<Record<string, string | null>> | null) || []).map(
        (p) => [p["user_id"], p],
      ),
    );
    cachePublic();
    return tps.map((tp) => {
      const p = map.get(tp.user_id);
      return {
        user_id: tp.user_id,
        full_name: p?.["full_name"] ?? null,
        full_name_en: p?.["full_name_en"] ?? null,
        bio: p?.["bio"] ?? null,
        bio_en: p?.["bio_en"] ?? null,
        avatar_url: p?.["avatar_url"] ?? null,
        subjects: tp.subjects || [],
        subjects_en: tp.subjects_en || [],
        university: tp.university ?? null,
        university_en: tp.university_en ?? null,
        major: tp.major ?? null,
        major_en: tp.major_en ?? null,
        price: tp.price || 0,
        verified: true,
      };
    });
  },
);

const COURSE_CARD_COLUMNS =
  "id, title, title_en, short_description, short_description_en, price, course_type, cover_image_url, total_hours, category, category_en, instructor_name, instructor_name_en, level, enrollment_count";

export type PublicCourseCard = Pick<
  PublicCourse,
  | "id"
  | "title"
  | "title_en"
  | "short_description"
  | "short_description_en"
  | "price"
  | "course_type"
  | "cover_image_url"
  | "total_hours"
  | "category"
  | "category_en"
  | "instructor_name"
  | "instructor_name_en"
  | "level"
  | "enrollment_count"
>;

export const listPublicCourses = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicCourseCard[]> => {
    const { data, error } = await publicClient()
      .from("courses")
      .select(COURSE_CARD_COLUMNS)
      .eq("is_published", true)
      .order("enrollment_count", { ascending: false })
      .limit(LIST_PAGE_SIZE);
    if (error) throw new Error("Course list failed");
    cachePublic();
    return (data as PublicCourseCard[]) || [];
  },
);
