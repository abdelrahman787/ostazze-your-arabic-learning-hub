import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Upload, X, Video, Calendar, BookMarked, ChevronDown, ChevronRight, FileText, PlayCircle } from "lucide-react";

type CourseType = "recorded" | "live" | "hybrid";

interface Course {
  id: string;
  title: string;
  title_en: string | null;
  description: string;
  description_en: string | null;
  short_description: string | null;
  short_description_en: string | null;
  price: number;
  course_type: CourseType;
  cover_image_url: string | null;
  total_hours: number;
  category: string | null;
  category_en: string | null;
  instructor_name: string | null;
  instructor_name_en: string | null;
  level: string | null;
  is_published: boolean;
  enrollment_count: number;
}

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  video_url: string | null;
  duration_minutes: number;
  order_index: number;
  is_free_preview: boolean;
}

interface LiveSession {
  id: string;
  course_id: string;
  title: string;
  title_en: string | null;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  zoom_url: string | null;
  is_completed: boolean;
}

const emptyCourse = {
  title: "",
  title_en: "",
  description: "",
  description_en: "",
  short_description: "",
  short_description_en: "",
  price: 0,
  course_type: "recorded" as CourseType,
  total_hours: 0,
  category: "",
  category_en: "",
  instructor_name: "",
  instructor_name_en: "",
  level: "beginner",
  is_published: false,
};

const AdminCourses = () => {
  const { lang } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyCourse);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", title_en: "", description: "", duration_minutes: 0, order_index: 0, is_free_preview: false });
  const [lessonVideoFile, setLessonVideoFile] = useState<File | null>(null);
  const [lessonSaving, setLessonSaving] = useState(false);
  const lessonVideoRef = useRef<HTMLInputElement>(null);

  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState<LiveSession | null>(null);
  const [sessionForm, setSessionForm] = useState({ title: "", title_en: "", scheduled_date: "", scheduled_time: "", duration_minutes: 60, zoom_url: "" });
  const [sessionSaving, setSessionSaving] = useState(false);

  const T = (ar: string, en: string) => (lang === "ar" ? ar : en);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setCourses((data as Course[]) || []);
    setLoading(false);
  }, []);

  const fetchCourseChildren = useCallback(async (courseId: string) => {
    const [{ data: l }, { data: s }] = await Promise.all([
      supabase.from("course_lessons").select("*").eq("course_id", courseId).order("order_index"),
      supabase.from("course_live_sessions").select("*").eq("course_id", courseId).order("scheduled_date").order("scheduled_time"),
    ]);
    setLessons((l as Lesson[]) || []);
    setLiveSessions((s as LiveSession[]) || []);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ===== Course handlers =====
  const openCreate = () => {
    setEditing(null);
    setForm(emptyCourse);
    setCoverFile(null);
    setShowForm(true);
  };

  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({
      title: c.title,
      title_en: c.title_en || "",
      description: c.description,
      description_en: c.description_en || "",
      short_description: c.short_description || "",
      short_description_en: c.short_description_en || "",
      price: Number(c.price),
      course_type: c.course_type,
      total_hours: Number(c.total_hours),
      category: c.category || "",
      category_en: c.category_en || "",
      instructor_name: c.instructor_name || "",
      instructor_name_en: c.instructor_name_en || "",
      level: c.level || "beginner",
      is_published: c.is_published,
    });
    setCoverFile(null);
    setShowForm(true);
  };

  const handleSaveCourse = async () => {
    if (!form.title || !form.description) {
      toast.error(T("العنوان والوصف مطلوبان", "Title and description are required"));
      return;
    }
    setSaving(true);
    try {
      let cover_image_url = editing?.cover_image_url || null;
      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const path = `courses/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("course-covers").upload(path, coverFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("course-covers").getPublicUrl(path);
        cover_image_url = urlData.publicUrl;
      }

      const payload = {
        title: form.title,
        title_en: form.title_en || null,
        description: form.description,
        description_en: form.description_en || null,
        short_description: form.short_description || null,
        short_description_en: form.short_description_en || null,
        price: form.price,
        course_type: form.course_type,
        total_hours: form.total_hours,
        category: form.category || null,
        category_en: form.category_en || null,
        instructor_name: form.instructor_name || null,
        instructor_name_en: form.instructor_name_en || null,
        level: form.level,
        is_published: form.is_published,
        cover_image_url,
      };

      if (editing) {
        const { error } = await supabase.from("courses").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success(T("تم تحديث الكورس", "Course updated"));
      } else {
        const { error } = await supabase.from("courses").insert(payload);
        if (error) throw error;
        toast.success(T("تم إنشاء الكورس", "Course created"));
      }

      setShowForm(false);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message);
    }
    setSaving(false);
  };

  const handleTogglePublish = async (c: Course) => {
    const { error } = await supabase.from("courses").update({ is_published: !c.is_published }).eq("id", c.id);
    if (error) { toast.error(error.message); return; }
    toast.success(!c.is_published ? T("تم النشر", "Published") : T("تم إخفاء الكورس", "Unpublished"));
    fetchCourses();
  };

  const handleDeleteCourse = async (c: Course) => {
    if (!confirm(T(`حذف الكورس "${c.title}"؟ هذا سيحذف جميع الدروس والجلسات المرتبطة.`, `Delete course "${c.title}"? This removes all related lessons and sessions.`))) return;
    const { error } = await supabase.from("courses").delete().eq("id", c.id);
    if (error) { toast.error(error.message); return; }
    toast.success(T("تم الحذف ✓", "Deleted ✓"));
    fetchCourses();
  };

  const toggleExpand = async (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      setLessons([]);
      setLiveSessions([]);
    } else {
      setExpandedCourse(courseId);
      await fetchCourseChildren(courseId);
    }
  };

  // ===== Lesson handlers =====
  const openCreateLesson = () => {
    setEditingLesson(null);
    setLessonForm({ title: "", title_en: "", description: "", duration_minutes: 0, order_index: lessons.length, is_free_preview: false });
    setLessonVideoFile(null);
    setShowLessonForm(true);
  };

  const openEditLesson = (l: Lesson) => {
    setEditingLesson(l);
    setLessonForm({
      title: l.title,
      title_en: l.title_en || "",
      description: l.description || "",
      duration_minutes: l.duration_minutes,
      order_index: l.order_index,
      is_free_preview: l.is_free_preview,
    });
    setLessonVideoFile(null);
    setShowLessonForm(true);
  };

  const handleSaveLesson = async () => {
    if (!expandedCourse || !lessonForm.title) {
      toast.error(T("العنوان مطلوب", "Title required"));
      return;
    }
    setLessonSaving(true);
    try {
      let video_url = editingLesson?.video_url || null;
      if (lessonVideoFile) {
        const ext = lessonVideoFile.name.split(".").pop();
        const path = `${expandedCourse}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("course-videos").upload(path, lessonVideoFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("course-videos").getPublicUrl(path);
        video_url = urlData.publicUrl;
      }

      const payload = {
        course_id: expandedCourse,
        title: lessonForm.title,
        title_en: lessonForm.title_en || null,
        description: lessonForm.description || null,
        duration_minutes: lessonForm.duration_minutes,
        order_index: lessonForm.order_index,
        is_free_preview: lessonForm.is_free_preview,
        video_url,
      };

      if (editingLesson) {
        const { error } = await supabase.from("course_lessons").update(payload).eq("id", editingLesson.id);
        if (error) throw error;
        toast.success(T("تم تحديث الدرس", "Lesson updated"));
      } else {
        const { error } = await supabase.from("course_lessons").insert(payload);
        if (error) throw error;
        toast.success(T("تم إضافة الدرس", "Lesson added"));
      }
      setShowLessonForm(false);
      await fetchCourseChildren(expandedCourse);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLessonSaving(false);
  };

  const handleDeleteLesson = async (l: Lesson) => {
    if (!confirm(T(`حذف الدرس "${l.title}"؟`, `Delete lesson "${l.title}"?`))) return;
    const { error } = await supabase.from("course_lessons").delete().eq("id", l.id);
    if (error) { toast.error(error.message); return; }
    toast.success(T("تم الحذف ✓", "Deleted ✓"));
    if (expandedCourse) await fetchCourseChildren(expandedCourse);
  };

  // ===== Live session handlers =====
  const openCreateSession = () => {
    setEditingSession(null);
    setSessionForm({ title: "", title_en: "", scheduled_date: "", scheduled_time: "", duration_minutes: 60, zoom_url: "" });
    setShowSessionForm(true);
  };

  const openEditSession = (s: LiveSession) => {
    setEditingSession(s);
    setSessionForm({
      title: s.title,
      title_en: s.title_en || "",
      scheduled_date: s.scheduled_date,
      scheduled_time: s.scheduled_time.slice(0, 5),
      duration_minutes: s.duration_minutes,
      zoom_url: s.zoom_url || "",
    });
    setShowSessionForm(true);
  };

  const handleSaveSession = async () => {
    if (!expandedCourse || !sessionForm.title || !sessionForm.scheduled_date || !sessionForm.scheduled_time) {
      toast.error(T("جميع الحقول مطلوبة", "All fields required"));
      return;
    }
    setSessionSaving(true);
    try {
      const payload = {
        course_id: expandedCourse,
        title: sessionForm.title,
        title_en: sessionForm.title_en || null,
        scheduled_date: sessionForm.scheduled_date,
        scheduled_time: sessionForm.scheduled_time,
        duration_minutes: sessionForm.duration_minutes,
        zoom_url: sessionForm.zoom_url || null,
      };
      if (editingSession) {
        const { error } = await supabase.from("course_live_sessions").update(payload).eq("id", editingSession.id);
        if (error) throw error;
        toast.success(T("تم التحديث", "Updated"));
      } else {
        const { error } = await supabase.from("course_live_sessions").insert(payload);
        if (error) throw error;
        toast.success(T("تم إضافة الجلسة", "Session added"));
      }
      setShowSessionForm(false);
      await fetchCourseChildren(expandedCourse);
    } catch (err: any) {
      toast.error(err.message);
    }
    setSessionSaving(false);
  };

  const handleDeleteSession = async (s: LiveSession) => {
    if (!confirm(T("حذف الجلسة؟", "Delete session?"))) return;
    const { error } = await supabase.from("course_live_sessions").delete().eq("id", s.id);
    if (error) { toast.error(error.message); return; }
    toast.success(T("تم الحذف ✓", "Deleted ✓"));
    if (expandedCourse) await fetchCourseChildren(expandedCourse);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold">{T("إدارة الكورسات", "Course Management")}</h2>
          <p className="text-sm text-muted-foreground">{T("إنشاء وتعديل وحذف الكورسات والدروس والجلسات", "Create, edit, and manage courses, lessons, and live sessions")}</p>
        </div>
        <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> {T("كورس جديد", "New Course")}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 size={28} className="animate-spin text-primary mx-auto" /></div>
      ) : courses.length === 0 ? (
        <div className="card-base p-12 text-center">
          <BookMarked size={48} className="text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">{T("لا توجد كورسات بعد. أنشئ أول كورس!", "No courses yet. Create your first course!")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c.id} className="card-base overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <button onClick={() => toggleExpand(c.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                  {expandedCourse === c.id ? <ChevronDown size={18} /> : <ChevronRight size={18} className={lang === "ar" ? "rotate-180" : ""} />}
                </button>
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 shrink-0 flex items-center justify-center">
                  {c.cover_image_url ? (
                    <img src={c.cover_image_url} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookMarked size={20} className="text-primary/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base">{c.title}</h3>
                    <span className={`text-[0.65rem] px-2 py-0.5 rounded-full font-bold ${
                      c.is_published ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                    }`}>
                      {c.is_published ? T("منشور", "Published") : T("مسودة", "Draft")}
                    </span>
                    <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary capitalize">
                      {c.course_type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {c.price === 0 ? T("مجاني", "Free") : `${c.price} ${T("ر.س", "SAR")}`} • {c.enrollment_count} {T("مشترك", "enrolled")}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleTogglePublish(c)} className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center" title={c.is_published ? T("إخفاء", "Unpublish") : T("نشر", "Publish")}>
                    {c.is_published ? <Eye size={16} /> : <EyeOff size={16} className="text-muted-foreground" />}
                  </button>
                  <button onClick={() => openEdit(c)} className="w-9 h-9 rounded-lg hover:bg-secondary flex items-center justify-center" title={T("تعديل", "Edit")}>
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDeleteCourse(c)} className="w-9 h-9 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center" title={T("حذف", "Delete")}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Expanded: lessons + live sessions */}
              {expandedCourse === c.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t bg-secondary/30 p-4 space-y-5">
                  {/* Lessons */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-sm flex items-center gap-2"><Video size={15} /> {T("الدروس المسجلة", "Recorded Lessons")} ({lessons.length})</h4>
                      <button onClick={openCreateLesson} className="text-xs btn-outline !py-1.5 !px-3 inline-flex items-center gap-1">
                        <Plus size={12} /> {T("إضافة درس", "Add Lesson")}
                      </button>
                    </div>
                    {lessons.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic px-3 py-4 text-center">{T("لا توجد دروس بعد", "No lessons yet")}</p>
                    ) : (
                      <div className="space-y-1.5">
                        {lessons.map((l) => (
                          <div key={l.id} className="flex items-center gap-3 bg-card rounded-lg p-3">
                            <PlayCircle size={16} className="text-primary shrink-0" />
                            <span className="text-xs font-bold text-muted-foreground tabular-nums w-6">{l.order_index + 1}.</span>
                            <span className="text-sm font-semibold flex-1 line-clamp-1">{l.title}</span>
                            {l.is_free_preview && <span className="text-[0.6rem] bg-success/15 text-success px-2 py-0.5 rounded-full font-bold">{T("مجاني", "Free")}</span>}
                            {l.video_url && <FileText size={13} className="text-success" />}
                            <span className="text-xs text-muted-foreground tabular-nums">{l.duration_minutes}{T("د", "m")}</span>
                            <button onClick={() => openEditLesson(l)} className="w-7 h-7 rounded hover:bg-secondary flex items-center justify-center"><Edit2 size={12} /></button>
                            <button onClick={() => handleDeleteLesson(l)} className="w-7 h-7 rounded hover:bg-destructive/10 text-destructive flex items-center justify-center"><Trash2 size={12} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Live Sessions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-sm flex items-center gap-2"><Calendar size={15} /> {T("جلسات اللايف", "Live Sessions")} ({liveSessions.length})</h4>
                      <button onClick={openCreateSession} className="text-xs btn-outline !py-1.5 !px-3 inline-flex items-center gap-1">
                        <Plus size={12} /> {T("إضافة جلسة", "Add Session")}
                      </button>
                    </div>
                    {liveSessions.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic px-3 py-4 text-center">{T("لا توجد جلسات بعد", "No sessions yet")}</p>
                    ) : (
                      <div className="space-y-1.5">
                        {liveSessions.map((s) => (
                          <div key={s.id} className="flex items-center gap-3 bg-card rounded-lg p-3">
                            <Calendar size={16} className="text-rose-500 shrink-0" />
                            <span className="text-sm font-semibold flex-1 line-clamp-1">{s.title}</span>
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {new Date(s.scheduled_date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { day: "numeric", month: "short" })} • {s.scheduled_time.slice(0, 5)}
                            </span>
                            <button onClick={() => openEditSession(s)} className="w-7 h-7 rounded hover:bg-secondary flex items-center justify-center"><Edit2 size={12} /></button>
                            <button onClick={() => handleDeleteSession(s)} className="w-7 h-7 rounded hover:bg-destructive/10 text-destructive flex items-center justify-center"><Trash2 size={12} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== Course form modal ===== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b p-5 flex items-center justify-between z-10">
              <h3 className="text-lg font-extrabold">{editing ? T("تعديل الكورس", "Edit Course") : T("كورس جديد", "New Course")}</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-4">
              {/* Cover */}
              <div>
                <label className="block text-sm font-bold mb-2">{T("صورة الغلاف", "Cover Image")}</label>
                <div className="flex items-center gap-3">
                  {(coverFile || editing?.cover_image_url) && (
                    <img
                      src={coverFile ? URL.createObjectURL(coverFile) : editing!.cover_image_url!}
                      alt="cover"
                      className="w-24 h-16 rounded-lg object-cover border"
                    />
                  )}
                  <input ref={coverRef} type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="hidden" />
                  <button type="button" onClick={() => coverRef.current?.click()} className="btn-outline !py-2 inline-flex items-center gap-2">
                    <Upload size={14} /> {T("رفع صورة", "Upload Image")}
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("العنوان (عربي) *", "Title (Arabic) *")}</label>
                  <input className="input-base" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("العنوان (إنجليزي)", "Title (English)")}</label>
                  <input className="input-base" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("وصف قصير (عربي)", "Short description (Arabic)")}</label>
                  <input className="input-base" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} placeholder={T("سطر واحد يظهر في البطاقة", "One line shown on card")} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("وصف قصير (إنجليزي)", "Short description (English)")}</label>
                  <input className="input-base" value={form.short_description_en} onChange={(e) => setForm({ ...form, short_description_en: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">{T("الوصف الكامل (عربي) *", "Full description (Arabic) *")}</label>
                <textarea rows={4} className="input-base" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">{T("الوصف الكامل (إنجليزي)", "Full description (English)")}</label>
                <textarea rows={4} className="input-base" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("النوع", "Type")}</label>
                  <select className="input-base" value={form.course_type} onChange={(e) => setForm({ ...form, course_type: e.target.value as CourseType })}>
                    <option value="recorded">{T("مسجّل", "Recorded")}</option>
                    <option value="live">{T("لايف", "Live")}</option>
                    <option value="hybrid">{T("مختلط", "Hybrid")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("السعر (ر.س)", "Price (SAR)")}</label>
                  <input type="number" min={0} step={0.01} className="input-base" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("عدد الساعات", "Total hours")}</label>
                  <input type="number" min={0} step={0.5} className="input-base" value={form.total_hours} onChange={(e) => setForm({ ...form, total_hours: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("التصنيف (عربي)", "Category (Arabic)")}</label>
                  <input className="input-base" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder={T("مثل: برمجة، تسويق", "e.g. Programming, Marketing")} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("التصنيف (إنجليزي)", "Category (English)")}</label>
                  <input className="input-base" value={form.category_en} onChange={(e) => setForm({ ...form, category_en: e.target.value })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("المدرّس (عربي)", "Instructor (Arabic)")}</label>
                  <input className="input-base" value={form.instructor_name} onChange={(e) => setForm({ ...form, instructor_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("المدرّس (إنجليزي)", "Instructor (English)")}</label>
                  <input className="input-base" value={form.instructor_name_en} onChange={(e) => setForm({ ...form, instructor_name_en: e.target.value })} />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm font-semibold">{T("نشر الكورس فوراً", "Publish immediately")}</span>
              </label>
            </div>

            <div className="sticky bottom-0 bg-card border-t p-4 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="btn-outline">{T("إلغاء", "Cancel")}</button>
              <button onClick={handleSaveCourse} disabled={saving} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editing ? T("حفظ التغييرات", "Save Changes") : T("إنشاء الكورس", "Create Course")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ===== Lesson form modal ===== */}
      {showLessonForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b p-5 flex items-center justify-between">
              <h3 className="text-lg font-extrabold">{editingLesson ? T("تعديل الدرس", "Edit Lesson") : T("درس جديد", "New Lesson")}</h3>
              <button onClick={() => setShowLessonForm(false)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("العنوان (عربي) *", "Title (Arabic) *")}</label>
                  <input className="input-base" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("العنوان (إنجليزي)", "Title (English)")}</label>
                  <input className="input-base" value={lessonForm.title_en} onChange={(e) => setLessonForm({ ...lessonForm, title_en: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">{T("وصف الدرس", "Description")}</label>
                <textarea rows={3} className="input-base" value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("الترتيب", "Order")}</label>
                  <input type="number" min={0} className="input-base" value={lessonForm.order_index} onChange={(e) => setLessonForm({ ...lessonForm, order_index: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("المدة (دقيقة)", "Duration (min)")}</label>
                  <input type="number" min={0} className="input-base" value={lessonForm.duration_minutes} onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">{T("ملف الفيديو", "Video file")}</label>
                <input ref={lessonVideoRef} type="file" accept="video/*" onChange={(e) => setLessonVideoFile(e.target.files?.[0] || null)} className="hidden" />
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => lessonVideoRef.current?.click()} className="btn-outline !py-2 inline-flex items-center gap-2 text-sm">
                    <Upload size={14} /> {T("اختر فيديو", "Select video")}
                  </button>
                  {lessonVideoFile && <span className="text-xs text-muted-foreground truncate">{lessonVideoFile.name}</span>}
                  {!lessonVideoFile && editingLesson?.video_url && <span className="text-xs text-success">{T("✓ فيديو موجود", "✓ Video uploaded")}</span>}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={lessonForm.is_free_preview} onChange={(e) => setLessonForm({ ...lessonForm, is_free_preview: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm">{T("متاح كمعاينة مجانية للزوار", "Available as free preview")}</span>
              </label>
            </div>

            <div className="sticky bottom-0 bg-card border-t p-4 flex justify-end gap-2">
              <button onClick={() => setShowLessonForm(false)} className="btn-outline">{T("إلغاء", "Cancel")}</button>
              <button onClick={handleSaveLesson} disabled={lessonSaving} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
                {lessonSaving && <Loader2 size={14} className="animate-spin" />}
                {T("حفظ", "Save")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ===== Live session form modal ===== */}
      {showSessionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl shadow-xl w-full max-w-xl">
            <div className="border-b p-5 flex items-center justify-between">
              <h3 className="text-lg font-extrabold">{editingSession ? T("تعديل الجلسة", "Edit Session") : T("جلسة جديدة", "New Session")}</h3>
              <button onClick={() => setShowSessionForm(false)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("العنوان (عربي) *", "Title (Arabic) *")}</label>
                  <input className="input-base" value={sessionForm.title} onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("العنوان (إنجليزي)", "Title (English)")}</label>
                  <input className="input-base" value={sessionForm.title_en} onChange={(e) => setSessionForm({ ...sessionForm, title_en: e.target.value })} />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("التاريخ *", "Date *")}</label>
                  <input type="date" className="input-base" value={sessionForm.scheduled_date} onChange={(e) => setSessionForm({ ...sessionForm, scheduled_date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("الوقت *", "Time *")}</label>
                  <input type="time" className="input-base" value={sessionForm.scheduled_time} onChange={(e) => setSessionForm({ ...sessionForm, scheduled_time: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5">{T("المدة (د)", "Duration (m)")}</label>
                  <input type="number" min={15} className="input-base" value={sessionForm.duration_minutes} onChange={(e) => setSessionForm({ ...sessionForm, duration_minutes: parseInt(e.target.value) || 60 })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">{T("رابط Zoom", "Zoom link")}</label>
                <input type="url" className="input-base" value={sessionForm.zoom_url} onChange={(e) => setSessionForm({ ...sessionForm, zoom_url: e.target.value })} placeholder="https://zoom.us/j/..." />
              </div>
            </div>

            <div className="border-t p-4 flex justify-end gap-2">
              <button onClick={() => setShowSessionForm(false)} className="btn-outline">{T("إلغاء", "Cancel")}</button>
              <button onClick={handleSaveSession} disabled={sessionSaving} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
                {sessionSaving && <Loader2 size={14} className="animate-spin" />}
                {T("حفظ", "Save")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
