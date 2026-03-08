import { mockCategories } from "@/data/mockData";

const Categories = () => (
  <div>
    <section className="hero-gradient py-12">
      <div className="container">
        <h1 className="text-3xl font-black mb-2">التصنيفات الدراسية</h1>
        <p className="text-muted-foreground">تصفح المواد حسب التخصص</p>
      </div>
    </section>
    <div className="container py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mockCategories.map((c) => (
          <div key={c.id} className="card-base card-hover p-8 text-center hover:border-primary cursor-pointer">
            <div className="text-5xl mb-3">{c.icon}</div>
            <h3 className="font-bold text-lg mb-1">{c.name}</h3>
            <p className="text-muted-foreground text-sm">{c.count}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Categories;
