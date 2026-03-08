import { mockUniversities } from "@/data/mockData";

const Universities = () => (
  <div>
    <section className="hero-gradient py-12">
      <div className="container">
        <h1 className="text-3xl font-black mb-2">الجامعات</h1>
        <p className="text-muted-foreground">تصفح الجامعات المتاحة في المنصة</p>
      </div>
    </section>
    <div className="container py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockUniversities.map((u) => (
          <div key={u.id} className="card-base card-hover p-6 text-center">
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="font-bold mb-2">{u.name}</h3>
            <p className="text-muted-foreground text-sm">{u.country}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Universities;
