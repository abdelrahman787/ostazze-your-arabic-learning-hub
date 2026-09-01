import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search, X } from "lucide-react";

interface CourseOption {
  key: string;
  ar: string;
  en: string;
  dept: string;
  uni: string;
}

interface Props {
  /** Comma separated list of course names */
  value: string;
  onChange: (value: string) => void;
  isAr: boolean;
}

const split = (v: string) =>
  v
    .split(/[,،]/)
    .map((s) => s.trim())
    .filter(Boolean);

const TutorCoursesPicker = ({ value, onChange, isAr }: Props) => {
  const [catalog, setCatalog] = useState<CourseOption[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [manual, setManual] = useState("");

  const selected = useMemo(() => split(value), [value]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    import("@/data/universitiesData").then((mod) => {
      if (cancelled) return;
      const seen = new Set<string>();
      const out: CourseOption[] = [];
      for (const uni of mod.allUniversities) {
        for (const college of uni.colleges || []) {
          for (const dept of college.departments || []) {
            for (const c of dept.courses || []) {
              const ar = (c.name_ar || c.name_en || "").trim();
              const en = (c.name_en || c.name_ar || "").trim();
              if (!ar && !en) continue;
              const key = `${ar}|${en}`;
              if (seen.has(key)) continue;
              seen.add(key);
              out.push({
                key,
                ar,
                en,
                dept: dept.name_ar || dept.name_en,
                uni: uni.name_ar || uni.name_en,
              });
            }
          }
        }
      }
      setCatalog(out);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!catalog || q.length < 2) return [];
    const picked = new Set(selected.map((s) => s.toLowerCase()));
    return catalog
      .filter((c) => {
        const label = (isAr ? c.ar : c.en).toLowerCase();
        return (
          !picked.has(label) &&
          (c.ar.toLowerCase().includes(q) ||
            c.en.toLowerCase().includes(q) ||
            c.dept.toLowerCase().includes(q))
        );
      })
      .slice(0, 40);
  }, [catalog, query, selected, isAr]);

  const add = (name: string) => {
    const v = name.trim();
    if (!v) return;
    if (selected.some((s) => s.toLowerCase() === v.toLowerCase())) return;
    onChange([...selected, v].join("، ".trim() === "" ? ", " : isAr ? "، " : ", "));
  };

  const remove = (i: number) =>
    onChange(selected.filter((_, idx) => idx !== i).join(isAr ? "، " : ", "));

  return (
    <div className="sm:col-span-2 space-y-3">
      <label className="block text-sm font-bold">
        {isAr ? "المواد التي تستطيع تدريسها" : "Courses You Can Teach"}
        <span className="text-destructive"> *</span>
      </label>

      <div className="flex flex-wrap gap-2 min-h-[2.75rem] p-2 rounded-xl border border-border bg-muted/30">
        {selected.length === 0 && (
          <span className="text-xs text-muted-foreground self-center px-1">
            {isAr
              ? "ابحث واختر موادك، أو اكتبها يدوياً بالأسفل."
              : "Search and pick your courses, or add them manually below."}
          </span>
        )}
        {selected.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold px-3 py-1.5"
          >
            {s}
            <button
              type="button"
              onClick={() => remove(i)}
              className="hover:text-destructive"
              aria-label={isAr ? `إزالة ${s}` : `Remove ${s}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-base ps-9"
          placeholder={
            isAr ? "ابحث في مقررات الجامعات..." : "Search university courses..."
          }
        />
        {loading && (
          <Loader2 size={16} className="animate-spin absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground" />
        )}
      </div>

      {query.trim().length >= 2 && (
        <div className="rounded-xl border border-border">
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-muted/40">
            <span className="text-[0.7rem] text-muted-foreground">
              {isAr
                ? "يمكنك اختيار أكثر من مادة — القائمة تبقى مفتوحة"
                : "Pick as many courses as you want — the list stays open"}
            </span>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[0.7rem] font-bold text-primary hover:underline"
            >
              {isAr ? "إغلاق القائمة" : "Close list"}
            </button>
          </div>
          <div className="max-h-56 overflow-y-auto divide-y divide-border">
            {results.length === 0 ? (
              <p className="p-3 text-xs text-muted-foreground">
                {isAr
                  ? "لا توجد نتائج — أضف المادة يدوياً بالأسفل."
                  : "No results — add the course manually below."}
              </p>
            ) : (
              results.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => add(isAr ? c.ar : c.en)}
                  className="w-full text-start p-2.5 hover:bg-muted/60 transition flex items-center justify-between gap-3"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold truncate">{isAr ? c.ar : c.en}</span>
                    <span className="block text-[0.7rem] text-muted-foreground truncate">
                      {c.dept} · {c.uni}
                    </span>
                  </span>
                  <Plus size={14} className="text-primary shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-[1fr_auto] gap-2">
        <input
          type="text"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(manual);
              setManual("");
            }
          }}
          className="input-base"
          placeholder={isAr ? "أو اكتب اسم المادة يدوياً" : "Or type a course name manually"}
        />
        <button
          type="button"
          onClick={() => {
            add(manual);
            setManual("");
          }}
          className="btn-outline flex items-center justify-center gap-1.5 px-4"
        >
          <Plus size={14} /> {isAr ? "إضافة" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default TutorCoursesPicker;
