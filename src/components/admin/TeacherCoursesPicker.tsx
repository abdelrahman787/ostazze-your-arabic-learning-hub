import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search, X } from "lucide-react";

interface CourseOption {
  key: string;
  ar: string;
  en: string;
  uni: string;
  dept: string;
}

interface Props {
  /** Arabic course/subject names */
  valueAr: string[];
  /** English course/subject names (index-aligned when picked from the catalog) */
  valueEn: string[];
  onChange: (ar: string[], en: string[]) => void;
}

const TeacherCoursesPicker = ({ valueAr, valueEn, onChange }: Props) => {
  const [catalog, setCatalog] = useState<CourseOption[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [manual, setManual] = useState({ ar: "", en: "" });

  // Load the (large) universities catalog only when this picker is used
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
                uni: uni.name_ar || uni.name_en,
                dept: dept.name_ar || dept.name_en,
              });
            }
          }
        }
      }
      out.sort((a, b) => a.ar.localeCompare(b.ar, "ar"));
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
    const picked = new Set(valueAr.map((s) => s.toLowerCase()));
    return catalog
      .filter(
        (c) =>
          !picked.has(c.ar.toLowerCase()) &&
          (c.ar.toLowerCase().includes(q) ||
            c.en.toLowerCase().includes(q) ||
            c.dept.toLowerCase().includes(q))
      )
      .slice(0, 40);
  }, [catalog, query, valueAr]);

  const add = (ar: string, en: string) => {
    if (!ar.trim()) return;
    if (valueAr.some((s) => s.toLowerCase() === ar.trim().toLowerCase())) return;
    onChange([...valueAr, ar.trim()], [...valueEn, (en || ar).trim()]);
  };

  const remove = (i: number) => {
    onChange(
      valueAr.filter((_, idx) => idx !== i),
      valueEn.filter((_, idx) => idx !== i)
    );
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold">المقررات الدراسية للمعلم</label>

      {/* Selected chips */}
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 rounded-xl border-2 border-border bg-muted/30">
        {valueAr.length === 0 && (
          <span className="text-xs text-muted-foreground self-center px-1">
            لم يتم ربط أي مقرر بعد — ابحث بالأسفل وأضف المقررات.
          </span>
        )}
        {valueAr.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold px-3 py-1.5"
          >
            {s}
            {valueEn[i] && valueEn[i] !== s && (
              <span className="text-[0.65rem] opacity-70" dir="ltr">
                {valueEn[i]}
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="hover:text-destructive"
              aria-label={`إزالة ${s}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* Search catalog */}
      <div className="relative">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-base ps-9"
          placeholder="ابحث في مقررات الجامعات (عربي أو إنجليزي)..."
        />
        {loading && (
          <Loader2 size={16} className="animate-spin absolute top-1/2 -translate-y-1/2 end-3 text-muted-foreground" />
        )}
      </div>

      {query.trim().length >= 2 && (
        <div className="max-h-56 overflow-y-auto rounded-xl border-2 border-border divide-y divide-border">
          {results.length === 0 ? (
            <p className="p-3 text-xs text-muted-foreground">لا توجد نتائج — يمكنك إضافة المقرر يدوياً بالأسفل.</p>
          ) : (
            results.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  add(c.ar, c.en);
                  setQuery("");
                }}
                className="w-full text-start p-2.5 hover:bg-muted/60 transition flex items-center justify-between gap-3"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-bold truncate">{c.ar}</span>
                  <span className="block text-[0.7rem] text-muted-foreground truncate" dir="ltr">
                    {c.en} — {c.dept} · {c.uni}
                  </span>
                </span>
                <Plus size={14} className="text-primary shrink-0" />
              </button>
            ))
          )}
        </div>
      )}

      {/* Manual add */}
      <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
        <input
          value={manual.ar}
          onChange={(e) => setManual((m) => ({ ...m, ar: e.target.value }))}
          className="input-base"
          placeholder="اسم المقرر (عربي)"
        />
        <input
          dir="ltr"
          value={manual.en}
          onChange={(e) => setManual((m) => ({ ...m, en: e.target.value }))}
          className="input-base"
          placeholder="Course name (English)"
        />
        <button
          type="button"
          onClick={() => {
            add(manual.ar, manual.en || manual.ar);
            setManual({ ar: "", en: "" });
          }}
          className="btn-secondary flex items-center justify-center gap-1.5 px-4"
        >
          <Plus size={14} /> إضافة
        </button>
      </div>
    </div>
  );
};

export default TeacherCoursesPicker;
