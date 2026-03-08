import { useState } from "react";
import { Link } from "react-router-dom";
import TeacherCard from "@/components/TeacherCard";
import { mockTeachers } from "@/data/mockData";
import { Search, SlidersHorizontal } from "lucide-react";

const Teachers = () => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const filtered = mockTeachers.filter((t) =>
    t.name.includes(search) || t.subjects.some((s) => s.includes(search)) || t.title.includes(search)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    return 0;
  });

  return (
    <div>
      <section className="hero-gradient py-12">
        <div className="container">
          <h1 className="text-3xl font-black mb-2">المعلمون</h1>
          <p className="text-muted-foreground">اختر معلمك المفضل وابدأ التعلم</p>
        </div>
      </section>

      <div className="container py-8">
        <div className="card-base p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث عن معلم..." className="input-base !pr-10" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="btn-outline !py-2 flex items-center gap-2">
              <SlidersHorizontal size={16} /> تصفية
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 mt-4 animate-fade-in">
              <select className="input-base !w-auto" onChange={(e) => setSortBy(e.target.value)}>
                <option value="">الترتيب</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="price-low">الأقل سعراً</option>
                <option value="price-high">الأعلى سعراً</option>
                <option value="reviews">الأكثر تقييماً</option>
              </select>
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm mb-6">عرض {sorted.length} من {mockTeachers.length} معلم</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((t) => <TeacherCard key={t.id} teacher={t} />)}
        </div>
      </div>
    </div>
  );
};

export default Teachers;
