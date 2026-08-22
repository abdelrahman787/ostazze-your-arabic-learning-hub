import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBilingual } from "@/hooks/useBilingual";
import { Clock, BookOpen, Loader2, BadgeCheck, GraduationCap, Video, Languages, CalendarCheck, MessageCircle, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BookSessionModal from "@/components/BookSessionModal";
import RefundNote from "@/components/RefundNote";
import PageHelmet from "@/components/PageHelmet";
import { personJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { waLink } from "@/lib/whatsapp";

import { getTeacherMajor } from "@/lib/teacherMajors";
import { getTeacherAvatar } from "@/lib/teacherAvatars";

interface TeacherFull {
  user_id: string;
  full_name: string;
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
}

interface AvailSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

// Arabic → English transliteration fallback for names not stored bilingually.
const AR_MAP: Record<string, string> = {
  "ا": "a", "أ": "a", "إ": "i", "آ": "aa", "ب": "b", "ت": "t", "ث": "th",
  "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z",
  "س": "s", "ش": "sh", "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a",
  "غ": "gh", "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n",
  "ه": "h", "و": "w", "ي": "y", "ى": "a", "ة": "h", "ء": "", "ؤ": "o", "ئ": "e",
};

const transliterate = (name: string) =>
  name
    .split("")
    .map((ch) => (AR_MAP[ch] !== undefined ? AR_MAP[ch] : ch))
    .join("")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const TeacherProfile = () => {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { b, bArr } = useBilingual();
  const [teacher, setTeacher] = useState<TeacherFull | null>(null);
  const [availability, setAvailability] = useState<AvailSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  const ar = lang === "ar";
  const DAYS = [t("day_sun"), t("day_mon"), t("day_tue"), t("day_wed"), t("day_thu"), t("day_fri"), t("day_sat")];

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const { data: tp } = await supabase
        .from("teacher_profiles")
        .select("user_id, subjects, subjects_en, university, university_en, major, major_en, price, verified")
        .eq("user_id", id)
        .single();

      if (!tp) { setLoading(false); return; }

      const { data: profileRows } = await supabase.rpc("get_public_profile", { _user_id: id });
      const profile = (profileRows as any[])?.[0] || null;

      setTeacher({
        user_id: tp.user_id,
        full_name: profile?.full_name || t("the_teacher"),
        full_name_en: profile?.full_name_en || null,
        bio: profile?.bio || null,
        bio_en: profile?.bio_en || null,
        avatar_url: profile?.avatar_url || null,
        subjects: tp.subjects || [],
        subjects_en: (tp as any).subjects_en || [],
        university: tp.university || null,
        university_en: (tp as any).university_en || null,
        major: (tp as any).major || null,
        major_en: (tp as any).major_en || null,
        price: tp.price || 0,
        verified: tp.verified || false,
      });

      const { data: avail } = await supabase
        .from("teacher_availability")
        .select("day_of_week, start_time, end_time")
        .eq("teacher_id", id)
        .eq("is_active", true)
        .order("day_of_week");

      setAvailability((avail as AvailSlot[]) || []);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">{t("teacher_not_found")}</h1>
        <Link to="/teachers" className="btn-primary mt-4 inline-block">{t("teacher_back")}</Link>
      </div>
    );
  }

  const rawName = b(teacher.full_name, teacher.full_name_en, t("the_teacher"));
  const displayName =
    lang === "en" && !teacher.full_name_en && /[\u0600-\u06FF]/.test(rawName)
      ? transliterate(rawName)
      : rawName;
  const displayBio = b(teacher.bio, teacher.bio_en);
  const displaySubjects = bArr(teacher.subjects, teacher.subjects_en);
  const displayMajor =
    b(teacher.major, teacher.major_en) || getTeacherMajor(teacher.user_id, lang === "en" ? "en" : "ar");

  const facts = [
    { icon: GraduationCap, label: ar ? "التخصص" : "Specialization", value: displayMajor },
    { icon: BookOpen, label: ar ? "المقررات" : "Courses", value: `${displaySubjects.length}` },
    { icon: Video, label: ar ? "نوع الحصص" : "Session type", value: ar ? "أونلاين مباشر" : "Live online" },
    { icon: Languages, label: ar ? "لغة الشرح" : "Teaching language", value: ar ? "عربي / إنجليزي" : "Arabic / English" },
  ];

  return (
    <div className="pb-16">
      <PageHelmet
        title={displayName}
        description={(displayBio || `${displayName} — ${displayMajor}`).slice(0, 160)}
        ogType="profile"
        jsonLd={[
          personJsonLd({
            id: teacher.user_id,
            name: displayName,
            jobTitle: ar ? "معلم" : "Tutor",
            university: undefined,
            subjects: displaySubjects,
          }),
          breadcrumbJsonLd([
            { name: ar ? "الرئيسية" : "Home", path: "/" },
            { name: t("nav_teachers"), path: "/teachers" },
            { name: displayName, path: `/teachers/${teacher.user_id}` },
          ]),
        ]}
      />

      {/* Header banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/8 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.25),transparent_60%)]" />
        <div className="container relative pt-page pb-20">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5 flex-wrap">
            <Link to="/teachers" className="hover:text-primary font-medium">{t("nav_teachers")}</Link>
            <ChevronLeft size={14} className="ltr:rotate-180" />
            <span className="text-foreground font-semibold truncate max-w-[220px]">{displayName}</span>
          </nav>
        </div>
      </section>

      <div className="container -mt-16 relative">
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="card-base p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-5 text-center sm:text-start">
                <img
                  src={teacher.avatar_url || getTeacherAvatar(teacher.user_id, teacher.full_name)}
                  alt={displayName}
                  className="w-28 h-28 rounded-3xl object-cover shadow-lg border-4 border-card mx-auto sm:mx-0 shrink-0"
                  width={112}
                  height={112}
                  decoding="async"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mb-2">
                    <h1 className="text-2xl sm:text-3xl font-black leading-tight">{displayName}</h1>
                    {teacher.verified && (
                      <span className="inline-flex items-center gap-1 text-xs bg-success/15 text-success px-2.5 py-1 rounded-full font-bold">
                        <BadgeCheck size={13} />
                        {t("teacher_verified")}
                      </span>
                    )}
                  </div>
                  <p className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold">
                    <BookOpen size={13} />
                    {displayMajor}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {facts.map((f) => (
                      <div key={f.label} className="flex items-center gap-2.5 rounded-2xl bg-secondary p-3 text-start">
                        <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <f.icon size={16} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] text-muted-foreground font-medium">{f.label}</p>
                          <p className="text-sm font-bold truncate">{f.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* About */}
            <div className="card-base p-6">
              <h2 className="font-extrabold text-lg mb-3">{ar ? "نبذة عن المعلم" : "About the tutor"}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {displayBio ||
                  (ar
                    ? `معلم متخصص في ${displayMajor}، يقدّم حصص خصوصية أونلاين مباشرة مع شرح مبسّط، حل تمارين، ومراجعات قبل الاختبارات.`
                    : `A specialist tutor in ${displayMajor}, offering live one-on-one online sessions with simplified explanations, problem solving and exam revisions.`)}
              </p>
            </div>

            {/* Subjects */}
            {displaySubjects.length > 0 && (
              <div className="card-base p-6">
                <h2 className="font-extrabold text-lg mb-4">{ar ? "المقررات التي يدرّسها" : "Courses taught"}</h2>
                <div className="flex flex-wrap gap-2">
                  {displaySubjects.map((s, i) => (
                    <span key={i} className="badge-brand">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            {availability.length > 0 && (
              <div className="card-base p-6">
                <h2 className="font-extrabold text-lg mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  {t("teacher_availability")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {availability.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                      <span className="font-bold text-sm">{DAYS[a.day_of_week]}</span>
                      <span className="text-muted-foreground text-sm">{a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky booking sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-4">
            <div className="card-base p-6">
              <h2 className="font-extrabold text-lg mb-1">{ar ? "احجز مع المعلم" : "Book with this tutor"}</h2>
              <p className="text-sm text-muted-foreground mb-5">
                {ar ? "اختر وقتك المفضل وسنؤكد الحجز معك." : "Pick your preferred time and we'll confirm your booking."}
              </p>

              <ul className="space-y-2.5 mb-5 text-sm">
                {[
                  ar ? "حصة أونلاين مباشرة عبر Zoom" : "Live online session via Zoom",
                  ar ? "تأكيد سريع على الواتساب" : "Fast confirmation on WhatsApp",
                  ar ? "إعادة جدولة مرنة" : "Flexible rescheduling",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-muted-foreground">
                    <CalendarCheck size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setShowBooking(true)}
                className="btn-primary w-full text-center text-base mb-3"
              >
                {t("teacher_book")} →
              </button>

              <a
                href={waLink(
                  ar
                    ? `مرحباً، أريد حجز حصة مع ${displayName}`
                    : `Hello, I'd like to book a session with ${displayName}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle size={16} />
                {ar ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
              </a>

              <RefundNote className="mt-4" />
            </div>
          </aside>
        </div>
      </div>

      <BookSessionModal
        open={showBooking}
        onClose={() => setShowBooking(false)}
        teacherId={teacher.user_id}
        teacherName={displayName}
        subjects={displaySubjects}
      />
    </div>
  );
};

export default TeacherProfile;
