import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBilingual } from "@/hooks/useBilingual";
import { Star, Clock, BookOpen, Loader2, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BookSessionModal from "@/components/BookSessionModal";
import RefundNote from "@/components/RefundNote";
import PageHelmet from "@/components/PageHelmet";
import { personJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import UniversityDetails from "@/components/UniversityDetails";
import { findUniversityByName } from "@/data/universitiesData";

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
  price: number;
  verified: boolean;
}

interface AvailSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface Review {
  id: string;
  student_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  student_name?: string;
}

const StarRating = ({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <motion.button
        key={star}
        type="button"
        whileHover={!readonly ? { scale: 1.2 } : undefined}
        whileTap={!readonly ? { scale: 0.9 } : undefined}
        onClick={() => !readonly && onChange?.(star)}
        className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer"}`}
        disabled={readonly}
      >
        <Star
          size={readonly ? 14 : 20}
          className={star <= value ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}
        />
      </motion.button>
    ))}
  </div>
);

const TeacherProfile = () => {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const { b, bArr } = useBilingual();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<TeacherFull | null>(null);
  const [availability, setAvailability] = useState<AvailSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const DAYS = [t("day_sun"), t("day_mon"), t("day_tue"), t("day_wed"), t("day_thu"), t("day_fri"), t("day_sat")];

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const { data: tp } = await supabase
        .from("teacher_profiles")
        .select("user_id, subjects, subjects_en, university, university_en, price, verified")
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

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      const { data } = await supabase
        .from("teacher_reviews" as any)
        .select("*")
        .eq("teacher_id", id)
        .order("created_at", { ascending: false });

      if (data && (data as any[]).length > 0) {
        const studentIds = [...new Set((data as any[]).map((r: any) => r.student_id))];
        const { data: profiles } = await supabase.rpc("get_public_profiles", { _user_ids: studentIds });
        const pMap = new Map((profiles || []).map((p: any) => [p.user_id, p.full_name]));
        const pMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
        setReviews((data as any[]).map((r: any) => ({ ...r, student_name: pMap.get(r.student_id) || "—" })));
      } else {
        setReviews([]);
      }
      setReviewsLoading(false);
    };
    fetchReviews();
  }, [id]);

  // Check if current user can leave a review
  useEffect(() => {
    if (!user || !id) return;
    const checkEligibility = async () => {
      // Must have a completed booking with this teacher
      const { data: completedBooking } = await supabase
        .from("bookings")
        .select("id")
        .eq("student_id", user.id)
        .eq("teacher_id", id)
        .eq("status", "completed")
        .maybeSingle();

      if (!completedBooking) { setCanReview(false); return; }

      // Check if already reviewed
      const { data: existingReview } = await supabase
        .from("teacher_reviews" as any)
        .select("id")
        .eq("teacher_id", id)
        .eq("student_id", user.id)
        .maybeSingle();

      setAlreadyReviewed(!!existingReview);
      setCanReview(!existingReview);
    };
    checkEligibility();
  }, [user, id]);

  const handleSubmitReview = async () => {
    if (!user || !id) { toast.error(t("review_login_required")); return; }
    if (!canReview) { toast.error(t("review_booking_required")); return; }
    setSubmittingReview(true);
    const { error } = await supabase
      .from("teacher_reviews" as any)
      .insert({ teacher_id: id, student_id: user.id, rating: reviewRating, comment: reviewComment || null });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("review_submitted"));
      setCanReview(false);
      setAlreadyReviewed(true);
      // Reload reviews
      const { data } = await supabase
        .from("teacher_reviews" as any)
        .select("*")
        .eq("teacher_id", id)
        .order("created_at", { ascending: false });
      if (data) {
        const studentIds = [...new Set((data as any[]).map((r: any) => r.student_id))];
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", studentIds);
        const pMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);
        setReviews((data as any[]).map((r: any) => ({ ...r, student_name: pMap.get(r.student_id) || "—" })));
      }
    }
    setSubmittingReview(false);
  };

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

  const displayName = b(teacher.full_name, teacher.full_name_en, t("the_teacher"));
  const displayUni = b(teacher.university, teacher.university_en);
  const displayBio = b(teacher.bio, teacher.bio_en);
  const displaySubjects = bArr(teacher.subjects, teacher.subjects_en);
  const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const universityData = findUniversityByName(teacher.university) || findUniversityByName(teacher.university_en);

  return (
    <div>
      <PageHelmet
        title={displayName}
        description={(displayBio || `${displayName} — ${displayUni || ""}`).slice(0, 160)}
        ogType="profile"
        jsonLd={[
          personJsonLd({
            id: teacher.user_id,
            name: displayName,
            jobTitle: lang === "ar" ? "معلم" : "Tutor",
            university: displayUni,
            subjects: displaySubjects,
          }),
          breadcrumbJsonLd([
            { name: lang === "ar" ? "الرئيسية" : "Home", path: "/" },
            { name: t("nav_teachers"), path: "/teachers" },
            { name: displayName, path: `/teachers/${teacher.user_id}` },
          ]),
        ]}
      />
      <section className="hero-gradient py-8">
        <div className="container">
          <p className="text-muted-foreground text-sm">
            <Link to="/teachers" className="hover:text-primary">{t("nav_teachers")}</Link> / {displayName}
          </p>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-base p-6">
              <div className="flex gap-5 mb-6">
                <motion.div whileHover={{ scale: 1.08, rotate: 5 }} className="w-20 h-20 rounded-2xl stats-gradient text-primary-foreground flex items-center justify-center text-2xl font-black shrink-0">
                  {initials}
                </motion.div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-xl font-black">{displayName}</h1>
                    {teacher.verified && <span className="text-xs bg-success/10 text-success px-2.5 py-1 rounded-full font-semibold">{t("teacher_verified")}</span>}
                  </div>
                  {displayUni && (
                    <div className="inline-flex items-center gap-1.5 mt-2 text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-1 rounded-full">
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}><BookOpen size={12} /></motion.div>
                      {displayUni}
                    </div>
                  )}
                </div>
              </div>

              {displayBio && <p className="text-muted-foreground leading-relaxed mb-6">{displayBio}</p>}

              <div className="flex flex-wrap gap-2 mb-6">
                {displaySubjects.map((s, i) => <span key={i} className="badge-brand">{s}</span>)}
              </div>

              <RefundNote className="mb-4" />

              <div className="flex gap-4 items-center flex-wrap">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowBooking(true)} className="btn-primary flex-1 text-center text-lg">
                  {t("teacher_book")} →
                </motion.button>
              </div>

              <BookSessionModal
                open={showBooking}
                onClose={() => setShowBooking(false)}
                teacherId={teacher.user_id}
                teacherName={displayName}
                subjects={displaySubjects}
                price={teacher.price || undefined}
              />
            </div>

            {availability.length > 0 && (
              <div className="card-base p-6">
                <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}><Clock size={20} className="text-primary" /></motion.div>
                  {t("teacher_availability")}
                </h3>
                <div className="space-y-3">
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

          <div className="space-y-6">
            {universityData && <UniversityDetails university={universityData} />}
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg">{t("teacher_reviews")}</h3>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating value={Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)} readonly />
                    <span className="text-sm font-bold">
                      {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">({reviews.length} {t("reviews_count_label")})</span>
                  </div>
                )}
              </div>

              {reviewsLoading ? (
                <div className="flex justify-center py-6"><Loader2 className="animate-spin text-primary" size={20} /></div>
              ) : reviews.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground text-sm">{t("no_reviews_yet")}</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {reviews.map((r) => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-secondary rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{r.student_name}</span>
                        <StarRating value={r.rating} readonly />
                      </div>
                      {r.comment && <p className="text-muted-foreground text-sm">{r.comment}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Review form */}
              {user && user.id !== id && (
                <div className="border-t pt-4">
                  {alreadyReviewed ? (
                    <p className="text-xs text-muted-foreground text-center">{t("already_reviewed")}</p>
                  ) : canReview ? (
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm">{t("rate_teacher")}</h4>
                      <StarRating value={reviewRating} onChange={setReviewRating} />
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={2}
                        className="input-base resize-none text-sm"
                        placeholder={t("review_comment_placeholder")}
                      />
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSubmitReview}
                        disabled={submittingReview}
                        className="btn-primary w-full text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {submittingReview ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        {t("submit_review")}
                      </motion.button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center">{t("review_booking_required")}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
