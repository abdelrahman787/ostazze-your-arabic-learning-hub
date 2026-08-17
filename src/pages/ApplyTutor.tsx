import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, GraduationCap, Upload, FileText, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";

import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";

const SPECIALIZATIONS = [
  ["المحاسبة", "Accounting"],
  ["اللغة العربية", "Arabic"],
  ["الهندسة المعمارية", "Architecture"],
  ["الكيمياء الحيوية", "Biochemistry"],
  ["الأحياء", "Biology"],
  ["الهندسة الطبية الحيوية", "Biomedical Engineering"],
  ["الهندسة الكيميائية", "Chemical Engineering"],
  ["الكيمياء", "Chemistry"],
  ["الهندسة المدنية", "Civil Engineering"],
  ["الصيدلة الإكلينيكية", "Clinical Pharmacy"],
  ["هندسة الحاسب", "Computer Engineering"],
  ["علوم الحاسب", "Computer Science"],
  ["الاقتصاد", "Economics"],
  ["الهندسة الكهربائية", "Electrical Engineering"],
  ["اللغة الإنجليزية", "English"],
  ["التمويل", "Finance"],
  ["الطب البشري", "Human Medicine"],
  ["الهندسة الصناعية", "Industrial Engineering"],
  ["القانون", "Law"],
  ["الإدارة", "Management"],
  ["التسويق", "Marketing"],
  ["الرياضيات", "Mathematics"],
  ["الهندسة الميكانيكية", "Mechanical Engineering"],
  ["التمريض", "Nursing"],
  ["التغذية", "Nutrition"],
  ["الفيزياء", "Physics"],
  ["علم النفس", "Psychology"],
  ["أخرى", "Other"],
];

const TOOLS = [
  "Explain Everything",
  "GoodNotes",
  "Notability",
  "PowerPoint",
  "Canva",
  "OBS",
  "Zoom",
  "iPad Screen Recording",
  "Other",
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  nationality: "",
  country: "",
  specialization: "",
  university: "",
  degree: "",
  experience: "",
  teachLang: "",
  courses: "",
  recordedBefore: "",
  quietPlace: "",
  demoLink: "",
};


const FieldBase = ({
  k,
  label,
  hint,
  type = "text",
  required,
  full,
  area,
  options,
  placeholder,
  value,
  onChange,
  selectLabel,
}: {
  k: string;
  label: string;
  hint?: string;
  type?: string;
  required?: boolean;
  full?: boolean;
  area?: boolean;
  options?: string[];
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  selectLabel: string;
}) => (
  <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
    <label htmlFor={k} className="block text-sm font-bold">
      {label} {required && <span className="text-primary">*</span>}
    </label>
    {options ? (
      <select
        id={k}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-base w-full"
      >
        <option value="">{selectLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    ) : area ? (
      <textarea
        id={k}
        rows={3}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-base w-full resize-none"
      />
    ) : (
      <input
        id={k}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-base w-full"
      />
    )}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const Section = ({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="card-base p-6 md:p-8 space-y-6">
    <div className="flex items-center gap-3 border-b border-border pb-4">
      <span className="w-10 h-10 rounded-xl bg-primary/12 text-primary font-black flex items-center justify-center text-sm">
        {num}
      </span>
      <h2 className="text-lg md:text-xl font-black">{title}</h2>
    </div>
    <div className="grid sm:grid-cols-2 gap-5">{children}</div>
  </section>
);



const ApplyTutor = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [tools, setTools] = useState<string[]>([]);

  
  const toggleTool = (t: string) =>
    setTools((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const T = {
    eyebrow: isAr ? "التقديم مفتوح لعام ٢٠٢٦" : "2026 Applications Open",
    title: isAr ? "انضم إلى فريق معلمي أستاذي" : "Become an Ostaze Teacher",
    lede: isAr
      ? "يرجى تعبئة النموذج التالي، وسيقوم فريقنا بمراجعة طلبك والتواصل معك في حال تم اختيارك."
      : "Please fill in the form below. Our team will review your application and contact you if shortlisted.",
    checklist: isAr
      ? [
          "جهّز السيرة الذاتية بصيغة PDF أو DOC أو DOCX.",
          "جهّز فيديو شرح تجريبي مدته من ٥ إلى ١٠ دقائق.",
          "استخدم رابط Google Drive أو YouTube غير معلن.",
          "يرجى تعبئة جميع الحقول المطلوبة بدقة.",
        ]
      : [
          "Prepare your CV in PDF, DOC, or DOCX format.",
          "Prepare a 5–10 minute demo lesson video.",
          "Use a Google Drive or Unlisted YouTube link.",
          "Complete all required fields carefully.",
        ],
    s1: isAr ? "البيانات الأساسية" : "Basic Information",
    s2: isAr ? "البيانات الأكاديمية" : "Academic Information",
    s3: isAr ? "جاهزية التسجيل والإنتاج" : "Recording & Production Readiness",
    s4: isAr ? "السيرة الذاتية وفيديو الشرح" : "CV & Demo Lesson",
    select: isAr ? "اختر" : "Select",
    submit: isAr ? "إرسال الطلب عبر واتساب" : "Submit via WhatsApp",
    note: isAr
      ? "بإرسال الطلب، أنت تؤكد أن المعلومات أعلاه صحيحة."
      : "By submitting, you confirm the information above is accurate.",
    doneTitle: isAr ? "تم استلام طلبك" : "Application received",
    doneBody: isAr
      ? "سيتواصل معك فريقنا في حال تم اختيارك. أكمل الإرسال في نافذة واتساب."
      : "Our team will review it and contact you if shortlisted. Complete sending in the WhatsApp window.",
  };

  const yesNo = isAr
    ? ["نعم", "لا", "أحياناً"]
    : ["Yes", "No", "Sometimes"];

  const [saving, setSaving] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const [demoFile, setDemoFile] = useState<File | null>(null);
  const [demoError, setDemoError] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoError, setPhotoError] = useState("");
  const [useAvatar, setUseAvatar] = useState<boolean | null>(null);

  const onPickPhoto = (file: File | null) => {
    setPhotoError("");
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    if (!file) {
      setUseAvatar(null);
      return setPhotoFile(null);
    }
    if (!/^image\//.test(file.type)) {
      setPhotoError(isAr ? "الرجاء اختيار صورة JPG أو PNG" : "Please choose a JPG or PNG image");
      return setPhotoFile(null);
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError(isAr ? "الحد الأقصى لحجم الصورة ٥ ميجابايت" : "Maximum photo size is 5 MB");
      return setPhotoFile(null);
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onPickCv = (file: File | null) => {
    setCvError("");
    if (!file) return setCvFile(null);
    const okExt = /\.(pdf|doc|docx)$/i.test(file.name);
    if (!okExt) {
      setCvError(isAr ? "الملفات المسموحة: PDF أو DOC أو DOCX" : "Allowed files: PDF, DOC or DOCX");
      return setCvFile(null);
    }
    if (file.size > 10 * 1024 * 1024) {
      setCvError(isAr ? "الحد الأقصى لحجم الملف ١٠ ميجابايت" : "Maximum file size is 10 MB");
      return setCvFile(null);
    }
    setCvFile(file);
  };

  const onPickDemo = (file: File | null) => {
    setDemoError("");
    if (!file) return setDemoFile(null);
    const okExt = /\.(mp4|mov|m4v|webm|avi|mkv)$/i.test(file.name);
    if (!okExt) {
      setDemoError(isAr ? "الصيغ المسموحة: MP4 أو MOV أو WEBM" : "Allowed formats: MP4, MOV or WEBM");
      return setDemoFile(null);
    }
    if (file.size > 100 * 1024 * 1024) {
      setDemoError(isAr ? "الحد الأقصى لحجم الفيديو ١٠٠ ميجابايت" : "Maximum video size is 100 MB");
      return setDemoFile(null);
    }
    setDemoFile(file);
  };


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let cvPath: string | null = null;
    if (cvFile) {
      const ext = cvFile.name.split(".").pop()?.toLowerCase() || "pdf";
      const safeName = (form.name || "applicant").replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40);
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("tutor-cvs")
        .upload(path, cvFile, { contentType: cvFile.type || undefined, upsert: false });
      if (upErr) {
        console.error("cv upload failed", upErr);
        setCvError(isAr ? "تعذر رفع الملف، حاول مرة أخرى." : "Upload failed, please try again.");
        setSaving(false);
        return;
      }
      cvPath = path;
    }

    let demoPath: string | null = null;
    if (demoFile) {
      const ext = demoFile.name.split(".").pop()?.toLowerCase() || "mp4";
      const safeName = (form.name || "applicant").replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40);
      const path = `${new Date().getFullYear()}/demo-${crypto.randomUUID()}-${safeName}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("tutor-cvs")
        .upload(path, demoFile, { contentType: demoFile.type || undefined, upsert: false });
      if (upErr) {
        console.error("demo upload failed", upErr);
        setDemoError(isAr ? "تعذر رفع الفيديو، حاول مرة أخرى." : "Video upload failed, please try again.");
        setSaving(false);
        return;
      }
      demoPath = path;
    }

    let photoPath: string | null = null;
    if (photoFile) {
      const ext = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeName = (form.name || "applicant").replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40);
      const path = `${new Date().getFullYear()}/photo-${crypto.randomUUID()}-${safeName}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("tutor-cvs")
        .upload(path, photoFile, { contentType: photoFile.type || undefined, upsert: false });
      if (upErr) {
        console.error("photo upload failed", upErr);
        setPhotoError(isAr ? "تعذر رفع الصورة، حاول مرة أخرى." : "Photo upload failed, please try again.");
        setSaving(false);
        return;
      }
      photoPath = path;
    }

    const { error } = await supabase.from("tutor_applications").insert({
      cv_file_path: cvPath,
      demo_file_path: demoPath,
      photo_file_path: photoPath,
      use_photo_as_avatar: photoFile ? useAvatar ?? false : null,
      full_name: form.name,
      phone: form.phone,
      email: form.email,
      nationality: form.nationality || null,
      country: form.country || null,
      city: null,
      specialization: form.specialization || null,
      university: form.university || null,
      degree: form.degree || null,
      experience: form.experience || null,
      teach_lang: form.teachLang || null,
      courses: form.courses || null,
      recorded_before: form.recordedBefore || null,
      quiet_place: form.quietPlace || null,
      tools,
      device: null,
      microphone: null,

      cv_link: null,
      demo_link: form.demoLink || null,
      lang,
    });
    setSaving(false);
    if (error) console.error("tutor application save failed", error);
    const L = (ar: string, en: string) => (isAr ? ar : en);
    const lines = [
      L("طلب انضمام كمعلم في أستاذي", "Teacher application — Ostaze"),
      "",
      `${L("الاسم", "Name")}: ${form.name}`,
      `${L("واتساب", "WhatsApp")}: ${form.phone}`,
      `${L("البريد", "Email")}: ${form.email}`,
      `${L("الجنسية", "Nationality")}: ${form.nationality}`,
      `${L("الدولة", "Country")}: ${form.country}`,
      `${L("صورة شخصية", "Photo")}: ${photoFile ? (useAvatar ? L("مرفوعة - موافق كصورة ملف شخصي", "uploaded - approved as profile picture") : L("مرفوعة - غير موافق", "uploaded - not approved")) : L("غير مرفقة", "not provided")}`,
      `${L("التخصص", "Specialization")}: ${form.specialization}`,
      `${L("الجامعة", "University")}: ${form.university}`,
      `${L("المؤهل", "Degree")}: ${form.degree}`,
      `${L("سنوات الخبرة", "Experience")}: ${form.experience}`,
      `${L("لغة التدريس", "Teaching language")}: ${form.teachLang}`,
      `${L("المواد", "Courses")}: ${form.courses}`,
      `${L("سبق التسجيل", "Recorded before")}: ${form.recordedBefore}`,
      `${L("مكان هادئ", "Quiet place")}: ${form.quietPlace}`,
      `${L("الأدوات", "Tools")}: ${tools.join(", ")}`,
      `${L("رابط الفيديو التجريبي", "Demo video")}: ${form.demoLink || L("مرفوع/غير متوفر", "uploaded / not provided")}`,
    ];
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener"
    );
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stateRef = useRef({ form, selectLabel: T.select });
  stateRef.current = { form, selectLabel: T.select };

  const Field = useCallback(
    (props: {
      k: keyof typeof emptyForm;
      label: string;
      hint?: string;
      type?: string;
      required?: boolean;
      full?: boolean;
      area?: boolean;
      options?: string[];
      placeholder?: string;
    }) => (
      <FieldBase
        {...props}
        value={stateRef.current.form[props.k]}
        selectLabel={stateRef.current.selectLabel}
        onChange={(v) => setForm((p) => ({ ...p, [props.k]: v }))}
      />
    ),
    []
  );



  return (
    <div>
      <PageHelmet
        title={isAr ? "انضم كمعلم - أستاذي OSTAZE" : "Become a Tutor - OSTAZE"}
        description={
          isAr
            ? "قدّم طلبك للانضمام إلى نخبة معلمي أستاذي ودرّس طلاب الجامعات أونلاين بجدول مرن."
            : "Apply to join Ostaze's elite tutors and teach university students online on a flexible schedule."
        }
        canonical="https://ostaze.com/apply-tutor"
      />

      {/* Hero */}
      <header className="pt-page bg-gradient-to-b from-primary/10 via-background to-background border-b border-border">
        <div className="container py-12 md:py-16 max-w-4xl">
          <span className="inline-block text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full bg-primary/15 text-primary">
            {T.eyebrow}
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-foreground">
            انضم إلى فريق أستاذي
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">{T.lede}</p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3">
            {T.checklist.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="container py-10 max-w-4xl">
        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-base p-10 text-center space-y-3"
          >
            <GraduationCap size={40} className="mx-auto text-primary" />
            <h2 className="text-2xl font-black">{T.doneTitle}</h2>
            <p className="text-muted-foreground">{T.doneBody}</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={onSubmit}
            className="space-y-6"
          >
            <Section num="01" title={T.s1}>
              {Field({
                k: "name",
                label: isAr ? "الاسم الكامل" : "Full Name",
                required: true,
                full: true,
                hint: isAr
                  ? "اكتب اسمك الكامل كما هو في المستندات الرسمية."
                  : "Write your full name as it appears in official documents.",
              })}
              {Field({
                k: "phone",
                label: isAr ? "رقم الواتساب" : "Mobile / WhatsApp",
                type: "tel",
                required: true,
                placeholder: "+9665XXXXXXXX",
                hint: isAr ? "مع مفتاح الدولة." : "Include country code.",
              })}
              {Field({
                k: "email",
                label: isAr ? "البريد الإلكتروني" : "Email",
                type: "email",
                placeholder: "name@example.com",
              })}
              {Field({ k: "nationality", label: isAr ? "الجنسية" : "Nationality" })}
              {Field({ k: "city", label: isAr ? "المدينة" : "City" })}
              <div className="sm:col-span-2 space-y-3">
                <label htmlFor="photoFile" className="block text-sm font-bold">
                  {isAr ? "صورتك الشخصية (اختياري)" : "Your photo (optional)"}
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt={isAr ? "معاينة الصورة" : "Photo preview"}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover border border-border"
                    />
                  )}
                  <label
                    htmlFor="photoFile"
                    className="btn-ghost cursor-pointer text-sm flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl"
                  >
                    <Upload size={16} />
                    {isAr ? "اختر صورة (JPG / PNG)" : "Choose photo (JPG / PNG)"}
                  </label>
                  <input
                    id="photoFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                    className="sr-only"
                    onChange={(e) => onPickPhoto(e.target.files?.[0] || null)}
                  />
                  {photoFile && (
                    <button
                      type="button"
                      onClick={() => onPickPhoto(null)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={isAr ? "إزالة الصورة" : "Remove photo"}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
                {photoError ? (
                  <p className="text-xs text-destructive">{photoError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {isAr
                      ? "صورة واضحة للوجه (الحد الأقصى ٥ ميجابايت)."
                      : "A clear face photo (max 5 MB)."}
                  </p>
                )}
                {photoFile && (
                  <div className="space-y-2">
                    <span className="block text-sm font-bold">
                      {isAr
                        ? "هل توافق على استخدام صورتك كصورة للملف الشخصي؟"
                        : "Do you want this photo used as your profile picture?"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[true, false].map((val) => (
                        <button
                          key={String(val)}
                          type="button"
                          aria-pressed={useAvatar === val}
                          onClick={() => setUseAvatar(val)}
                          className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                            useAvatar === val
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {val ? (isAr ? "نعم" : "Yes") : isAr ? "لا" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>

            <Section num="02" title={T.s2}>
              {Field({
                k: "specialization",
                label: isAr ? "التخصص" : "Specialization",
                required: true,
                full: true,
                options: SPECIALIZATIONS.map(([ar, en]) => (isAr ? ar : en)),
                hint: isAr
                  ? "اختر أقرب تخصص للمواد التي تستطيع تدريسها."
                  : "Choose the closest specialization to the courses you can teach.",
              })}
              {Field({ k: "university", label: isAr ? "الجامعة" : "University" })}
              {Field({
                k: "degree",
                label: isAr ? "المؤهل العلمي" : "Degree",
                placeholder: isAr ? "بكالوريوس / ماجستير / دكتوراه" : "Bachelor, Master, PhD",
              })}
              {Field({
                k: "experience",
                label: isAr ? "سنوات الخبرة في التدريس" : "Years of Teaching Experience",
                type: "number",
              })}
              {Field({
                k: "teachLang",
                label: isAr ? "لغة التدريس" : "Teaching Language",
                options: isAr
                  ? ["عربي", "إنجليزي", "عربي وإنجليزي"]
                  : ["Arabic", "English", "Arabic and English"],
              })}
              {Field({
                k: "courses",
                label: isAr ? "المواد التي تستطيع تدريسها" : "Courses You Can Teach",
                required: true,
                full: true,
                area: true,
                placeholder: isAr ? "مثال: تفاضل ١، فيزياء ١٠١" : "Example: Calculus 1, Physics 101",
              })}
            </Section>

            <Section num="03" title={T.s3}>
              {Field({
                k: "recordedBefore",
                label: isAr ? "هل سبق لك تسجيل دروس؟" : "Have you recorded lessons before?",
                options: yesNo,
              })}
              {Field({
                k: "quietPlace",
                label: isAr ? "هل لديك مكان هادئ للتسجيل؟" : "Do you have a quiet place for recording?",
                options: yesNo,
              })}
              <div className="sm:col-span-2 space-y-2">
                <span className="block text-sm font-bold">
                  {isAr ? "البرامج أو الأدوات المستخدمة" : "Tools / Apps Used Before"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {TOOLS.map((tool) => {
                    const active = tools.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleTool(tool)}
                        className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {tool}
                      </button>
                    );
                  })}
                </div>
              </div>
              {Field({
                k: "device",
                label: isAr ? "الجهاز المستخدم للتسجيل" : "Device Used for Recording",
                placeholder: isAr ? "آيباد، لابتوب..." : "iPad, tablet, laptop...",
              })}
              {Field({
                k: "microphone",
                label: isAr ? "الميكروفون المستخدم" : "Microphone Used",
                placeholder: isAr ? "ميكروفون داخلي، AirPods..." : "Built-in mic, AirPods...",
              })}
            </Section>

            <Section num="04" title={T.s4}>
              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="cvFile" className="block text-sm font-bold">
                  {isAr ? "رفع ملف السيرة الذاتية" : "Upload your CV file"}
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="cvFile"
                    className="btn-ghost cursor-pointer text-sm flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl"
                  >
                    <Upload size={16} />
                    {isAr ? "اختر ملف (PDF / DOC / DOCX)" : "Choose file (PDF / DOC / DOCX)"}
                  </label>
                  <input
                    id="cvFile"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={(e) => onPickCv(e.target.files?.[0] || null)}
                  />
                  {cvFile && (
                    <span className="flex items-center gap-2 text-sm font-bold text-primary">
                      <FileText size={15} /> {cvFile.name}
                      <button
                        type="button"
                        onClick={() => onPickCv(null)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={isAr ? "إزالة الملف" : "Remove file"}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
                {cvError ? (
                  <p className="text-xs text-destructive">{cvError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {isAr
                      ? "ارفع سيرتك الذاتية مباشرة ليراجعها فريقنا (الحد الأقصى ١٠ ميجابايت)."
                      : "Upload your CV directly for our team to review (max 10 MB)."}
                  </p>
                )}
              </div>
              {Field({
                k: "demoLink",
                label: isAr
                  ? "رابط فيديو الشرح التجريبي (اختياري)"
                  : "Demo Lesson Video Link (optional)",
                type: "url",
                full: true,
                placeholder: "https://youtube.com/...",
                hint: isAr
                  ? "فيديو من ٥ إلى ١٠ دقائق، وتأكد أن الصلاحية «Anyone with the link can view»."
                  : "A 5–10 minute video. Make sure sharing is set to “Anyone with the link can view”.",
              })}
              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="demoFile" className="block text-sm font-bold">
                  {isAr ? "أو ارفع فيديو الشرح (اختياري)" : "Or upload your demo video (optional)"}
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="demoFile"
                    className="btn-ghost cursor-pointer text-sm flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl"
                  >
                    <Upload size={16} />
                    {isAr ? "اختر فيديو (MP4 / MOV / WEBM)" : "Choose video (MP4 / MOV / WEBM)"}
                  </label>
                  <input
                    id="demoFile"
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.m4v,.webm"
                    className="sr-only"
                    onChange={(e) => onPickDemo(e.target.files?.[0] || null)}
                  />
                  {demoFile && (
                    <span className="flex items-center gap-2 text-sm font-bold text-primary">
                      <FileText size={15} /> {demoFile.name}
                      <button
                        type="button"
                        onClick={() => onPickDemo(null)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={isAr ? "إزالة الفيديو" : "Remove video"}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
                {demoError ? (
                  <p className="text-xs text-destructive">{demoError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {isAr
                      ? "يمكنك مشاركة رابط الفيديو أو رفعه مباشرة (الحد الأقصى ١٠٠ ميجابايت). كلاهما اختياري."
                      : "Share a video link or upload the file directly (max 100 MB). Both are optional."}
                  </p>
                )}
              </div>
            </Section>

            <div className="card-base p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <p className="text-sm text-muted-foreground">{T.note}</p>
              <button type="submit" className="btn-primary flex items-center justify-center gap-2 shrink-0">
                <Send size={16} />
                {saving ? "..." : T.submit}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default ApplyTutor;
