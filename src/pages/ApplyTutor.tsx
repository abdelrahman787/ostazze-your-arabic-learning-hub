import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import PageHelmet from "@/components/PageHelmet";
import PageHeader from "@/components/PageHeader";

const WHATSAPP_NUMBER = "201130382206";

const ApplyTutor = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    university: "",
    subjects: "",
    experience: "",
    about: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const L = {
    title: isAr ? "انضم كمعلم" : "Apply as a Tutor",
    subtitle: isAr
      ? "شارك خبرتك مع آلاف الطلاب الجامعيين واحصل على دخل مرن"
      : "Share your expertise with thousands of university students and earn flexibly",
    name: isAr ? "الاسم الكامل" : "Full name",
    email: isAr ? "البريد الإلكتروني" : "Email",
    phone: isAr ? "رقم الواتساب" : "WhatsApp number",
    university: isAr ? "الجامعة / الشهادة" : "University / Degree",
    subjects: isAr ? "المواد التي تدرّسها" : "Subjects you teach",
    experience: isAr ? "سنوات الخبرة" : "Years of experience",
    about: isAr ? "نبذة عنك" : "About you",
    submit: isAr ? "إرسال الطلب عبر واتساب" : "Send application via WhatsApp",
    done: isAr ? "تم فتح واتساب لإتمام إرسال طلبك ✅" : "WhatsApp opened to complete your application ✅",
    perks: isAr
      ? ["جدول مرن تحدده بنفسك", "طلاب من أفضل الجامعات", "دعم كامل من فريق أستاذي"]
      : ["Flexible schedule you control", "Students from top universities", "Full support from the Ostaze team"],
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = isAr
      ? `طلب انضمام كمعلم في أستاذي\n\nالاسم: ${form.name}\nالبريد: ${form.email}\nواتساب: ${form.phone}\nالجامعة/الشهادة: ${form.university}\nالمواد: ${form.subjects}\nالخبرة: ${form.experience}\nنبذة: ${form.about}`
      : `Tutor application — Ostaze\n\nName: ${form.name}\nEmail: ${form.email}\nWhatsApp: ${form.phone}\nUniversity/Degree: ${form.university}\nSubjects: ${form.subjects}\nExperience: ${form.experience}\nAbout: ${form.about}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    setSent(true);
  };

  const field = (
    key: keyof typeof form,
    label: string,
    opts: { type?: string; required?: boolean; area?: boolean } = {}
  ) => (
    <div className="space-y-1.5">
      <label htmlFor={key} className="text-sm font-bold">
        {label}
      </label>
      {opts.area ? (
        <textarea
          id={key}
          rows={4}
          required={opts.required}
          value={form[key]}
          onChange={(e) => set(key, e.target.value)}
          className="input-base w-full resize-none"
        />
      ) : (
        <input
          id={key}
          type={opts.type || "text"}
          required={opts.required}
          value={form[key]}
          onChange={(e) => set(key, e.target.value)}
          className="input-base w-full"
        />
      )}
    </div>
  );

  return (
    <div>
      <PageHelmet
        title={isAr ? "انضم كمعلم - أستاذي OSTAZE" : "Apply as a Tutor - OSTAZE"}
        description={
          isAr
            ? "قدّم طلبك للانضمام إلى نخبة معلمي أستاذي ودرّس طلاب الجامعات أونلاين بجدول مرن."
            : "Apply to join Ostaze's elite tutors and teach university students online on a flexible schedule."
        }
        canonical="https://ostaze.com/apply-tutor"
      />
      <PageHeader title={L.title} subtitle={L.subtitle} variant="teachers" />

      <div className="container py-10 grid lg:grid-cols-3 gap-8 items-start">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="card-base p-6 md:p-8 space-y-4 lg:col-span-2"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {field("name", L.name, { required: true })}
            {field("email", L.email, { type: "email", required: true })}
            {field("phone", L.phone, { required: true })}
            {field("university", L.university)}
            {field("subjects", L.subjects, { required: true })}
            {field("experience", L.experience)}
          </div>
          {field("about", L.about, { area: true })}

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Send size={16} />
            {L.submit}
          </button>

          {sent && (
            <p className="text-sm font-bold text-[#25D366] flex items-center gap-2">
              <CheckCircle2 size={16} /> {L.done}
            </p>
          )}
        </motion.form>

        <aside className="card-base p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
            <GraduationCap size={24} />
          </div>
          <h2 className="font-black text-lg">{isAr ? "لماذا أستاذي؟" : "Why Ostaze?"}</h2>
          <ul className="space-y-3">
            {L.perks.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default ApplyTutor;
