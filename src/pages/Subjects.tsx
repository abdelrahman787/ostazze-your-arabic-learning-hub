import { mockSubjects } from "@/data/mockData";

const Subjects = () => (
  <div>
    <section className="hero-gradient py-12">
      <div className="container">
        <h1 className="text-3xl font-black mb-2">المواد الدراسية</h1>
        <p className="text-muted-foreground">تصفح جميع المواد المتاحة</p>
      </div>
    </section>
    <div className="container py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockSubjects.map((s) => (
          <div key={s.id} className="card-base card-hover p-6 text-center">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="font-bold mb-2">{s.name}</h3>
            <p className="text-muted-foreground text-sm mb-2">👥 {s.teacherCount} معلم</p>
            <span className="badge-brand text-xs">{s.category}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Subjects;
