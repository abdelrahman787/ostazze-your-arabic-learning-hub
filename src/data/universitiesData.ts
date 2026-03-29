export interface Course {
  code: string;
  name_en: string;
  name_ar: string;
  credits: number;
}

export interface Department {
  id: string;
  name_ar: string;
  name_en: string;
  degrees: string[];
  courses: Course[];
}

export interface College {
  id: string;
  name_ar: string;
  name_en: string;
  departments: Department[];
}

export interface University {
  id: string;
  name_ar: string;
  name_en: string;
  website: string;
  type: "public" | "private";
  founded: number;
  country_code: string;
  country_ar: string;
  country_en: string;
  logo?: string;
  colleges: College[];
}

// Helper to find university by name (ar or en)
export const findUniversityByName = (name: string | null | undefined): University | undefined => {
  if (!name) return undefined;
  const lower = name.toLowerCase().trim();
  return allUniversities.find(
    (u) =>
      u.name_ar === name ||
      u.name_en.toLowerCase() === lower ||
      lower.includes(u.name_en.toLowerCase()) ||
      lower.includes(u.name_ar)
  );
};

export const allUniversities: University[] = [
  // ===== KUWAIT =====
  {
    id: "KW-KU",
    name_ar: "جامعة الكويت",
    name_en: "Kuwait University",
    website: "https://www.ku.edu.kw",
    type: "public",
    founded: 1966,
    country_code: "KW",
    country_ar: "الكويت",
    country_en: "Kuwait",
    colleges: [
      {
        id: "KW-KU-ARTS",
        name_ar: "كلية الآداب",
        name_en: "College of Arts",
        departments: [
          { id: "KW-KU-ARTS-ARABIC", name_ar: "قسم اللغة العربية وآدابها", name_en: "Department of Arabic Language and Literature", degrees: ["BA"], courses: [{ code: "ARAB101", name_en: "Introduction to Arabic Literature", name_ar: "مقدمة في الأدب العربي", credits: 3 }, { code: "ARAB102", name_en: "Arabic Grammar I", name_ar: "النحو العربي ١", credits: 3 }, { code: "ARAB201", name_en: "Classical Arabic Poetry", name_ar: "الشعر العربي الكلاسيكي", credits: 3 }, { code: "ARAB202", name_en: "Arabic Morphology", name_ar: "الصرف العربي", credits: 3 }, { code: "ARAB301", name_en: "Modern Arabic Literature", name_ar: "الأدب العربي الحديث", credits: 3 }, { code: "ARAB302", name_en: "Arabic Rhetoric", name_ar: "البلاغة العربية", credits: 3 }, { code: "ARAB401", name_en: "Research Methods in Arabic", name_ar: "مناهج البحث في اللغة العربية", credits: 3 }] },
          { id: "KW-KU-ARTS-ENGLISH", name_ar: "قسم اللغة الإنجليزية وآدابها", name_en: "Department of English Language and Literature", degrees: ["BA"], courses: [{ code: "ENGL101", name_en: "Introduction to Literature", name_ar: "مقدمة في الأدب", credits: 3 }, { code: "ENGL102", name_en: "Academic Writing", name_ar: "الكتابة الأكاديمية", credits: 3 }, { code: "ENGL201", name_en: "British Literature I", name_ar: "الأدب البريطاني ١", credits: 3 }, { code: "ENGL202", name_en: "American Literature I", name_ar: "الأدب الأمريكي ١", credits: 3 }, { code: "ENGL301", name_en: "Linguistics", name_ar: "علم اللغة", credits: 3 }, { code: "ENGL302", name_en: "Modern Poetry", name_ar: "الشعر الحديث", credits: 3 }, { code: "ENGL401", name_en: "Postcolonial Literature", name_ar: "أدب ما بعد الاستعمار", credits: 3 }] },
          { id: "KW-KU-ARTS-HIST", name_ar: "قسم التاريخ", name_en: "Department of History", degrees: ["BA"], courses: [{ code: "HIST101", name_en: "Ancient History", name_ar: "التاريخ القديم", credits: 3 }, { code: "HIST102", name_en: "Islamic History", name_ar: "التاريخ الإسلامي", credits: 3 }, { code: "HIST201", name_en: "Modern World History", name_ar: "تاريخ العالم الحديث", credits: 3 }, { code: "HIST202", name_en: "History of the Arabian Peninsula", name_ar: "تاريخ شبه الجزيرة العربية", credits: 3 }, { code: "HIST301", name_en: "History of Kuwait", name_ar: "تاريخ الكويت", credits: 3 }, { code: "HIST401", name_en: "Historical Research Methods", name_ar: "مناهج البحث التاريخي", credits: 3 }] },
          { id: "KW-KU-ARTS-PHIL", name_ar: "قسم الفلسفة", name_en: "Department of Philosophy", degrees: ["BA"], courses: [{ code: "PHIL101", name_en: "Introduction to Philosophy", name_ar: "مقدمة في الفلسفة", credits: 3 }, { code: "PHIL201", name_en: "Logic", name_ar: "المنطق", credits: 3 }, { code: "PHIL202", name_en: "Ethics", name_ar: "الأخلاق", credits: 3 }, { code: "PHIL301", name_en: "Philosophy of Science", name_ar: "فلسفة العلوم", credits: 3 }, { code: "PHIL401", name_en: "Contemporary Philosophy", name_ar: "الفلسفة المعاصرة", credits: 3 }] },
          { id: "KW-KU-ARTS-GEO", name_ar: "قسم الجغرافيا", name_en: "Department of Geography", degrees: ["BA"], courses: [{ code: "GEOG101", name_en: "Physical Geography", name_ar: "الجغرافيا الطبيعية", credits: 3 }, { code: "GEOG102", name_en: "Human Geography", name_ar: "الجغرافيا البشرية", credits: 3 }, { code: "GEOG201", name_en: "Regional Geography of the Middle East", name_ar: "جغرافيا الشرق الأوسط الإقليمية", credits: 3 }, { code: "GEOG202", name_en: "Cartography and GIS", name_ar: "رسم الخرائط ونظم المعلومات الجغرافية", credits: 3 }, { code: "GEOG301", name_en: "Urban Geography", name_ar: "الجغرافيا الحضرية", credits: 3 }, { code: "GEOG401", name_en: "Environmental Geography", name_ar: "الجغرافيا البيئية", credits: 3 }] },
          { id: "KW-KU-ARTS-SOC", name_ar: "قسم علم الاجتماع", name_en: "Department of Sociology and Social Work", degrees: ["BA"], courses: [{ code: "SOC101", name_en: "Introduction to Sociology", name_ar: "مقدمة في علم الاجتماع", credits: 3 }, { code: "SOC102", name_en: "Social Research Methods", name_ar: "مناهج البحث الاجتماعي", credits: 3 }, { code: "SOC201", name_en: "Social Theory", name_ar: "النظرية الاجتماعية", credits: 3 }, { code: "SOC202", name_en: "Family and Society", name_ar: "الأسرة والمجتمع", credits: 3 }, { code: "SOC301", name_en: "Sociology of Development", name_ar: "علم اجتماع التنمية", credits: 3 }, { code: "SOC401", name_en: "Sociology of Gulf Societies", name_ar: "علم اجتماع مجتمعات الخليج", credits: 3 }] },
          { id: "KW-KU-ARTS-PSYCH", name_ar: "قسم علم النفس", name_en: "Department of Psychology", degrees: ["BA"], courses: [{ code: "PSYC101", name_en: "General Psychology", name_ar: "علم النفس العام", credits: 3 }, { code: "PSYC102", name_en: "Developmental Psychology", name_ar: "علم النفس التطوري", credits: 3 }, { code: "PSYC201", name_en: "Social Psychology", name_ar: "علم النفس الاجتماعي", credits: 3 }, { code: "PSYC202", name_en: "Abnormal Psychology", name_ar: "علم النفس المرضي", credits: 3 }, { code: "PSYC301", name_en: "Cognitive Psychology", name_ar: "علم النفس المعرفي", credits: 3 }, { code: "PSYC401", name_en: "Psychological Testing", name_ar: "الاختبارات النفسية", credits: 3 }] },
          { id: "KW-KU-ARTS-INFO", name_ar: "قسم المعلومات والمكتبات", name_en: "Department of Library and Information Science", degrees: ["BA"], courses: [{ code: "LIS101", name_en: "Introduction to Library Science", name_ar: "مقدمة في علم المكتبات", credits: 3 }, { code: "LIS201", name_en: "Information Organization", name_ar: "تنظيم المعلومات", credits: 3 }, { code: "LIS202", name_en: "Reference Services", name_ar: "خدمات المراجع", credits: 3 }, { code: "LIS301", name_en: "Digital Libraries", name_ar: "المكتبات الرقمية", credits: 3 }, { code: "LIS401", name_en: "Knowledge Management", name_ar: "إدارة المعرفة", credits: 3 }] },
          { id: "KW-KU-ARTS-MASS", name_ar: "قسم الإعلام", name_en: "Department of Mass Communication", degrees: ["BA"], courses: [{ code: "MCOM101", name_en: "Introduction to Mass Communication", name_ar: "مقدمة في الاتصال الجماهيري", credits: 3 }, { code: "MCOM201", name_en: "Journalism", name_ar: "الصحافة", credits: 3 }, { code: "MCOM202", name_en: "Public Relations", name_ar: "العلاقات العامة", credits: 3 }, { code: "MCOM301", name_en: "Broadcast Media", name_ar: "الإعلام المرئي والمسموع", credits: 3 }, { code: "MCOM302", name_en: "Digital Media", name_ar: "الإعلام الرقمي", credits: 3 }, { code: "MCOM401", name_en: "Media Research Methods", name_ar: "مناهج البحث الإعلامي", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-SCI",
        name_ar: "كلية العلوم",
        name_en: "College of Science",
        departments: [
          { id: "KW-KU-SCI-MATH", name_ar: "قسم الرياضيات", name_en: "Department of Mathematics", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "MATH101", name_en: "Calculus I", name_ar: "التفاضل والتكامل ١", credits: 3 }, { code: "MATH102", name_en: "Calculus II", name_ar: "التفاضل والتكامل ٢", credits: 3 }, { code: "MATH201", name_en: "Linear Algebra", name_ar: "الجبر الخطي", credits: 3 }, { code: "MATH202", name_en: "Differential Equations", name_ar: "المعادلات التفاضلية", credits: 3 }, { code: "MATH301", name_en: "Real Analysis", name_ar: "التحليل الحقيقي", credits: 3 }, { code: "MATH302", name_en: "Abstract Algebra", name_ar: "الجبر المجرد", credits: 3 }, { code: "MATH401", name_en: "Numerical Analysis", name_ar: "التحليل العددي", credits: 3 }, { code: "MATH402", name_en: "Topology", name_ar: "الطوبولوجيا", credits: 3 }] },
          { id: "KW-KU-SCI-PHYS", name_ar: "قسم الفيزياء", name_en: "Department of Physics", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "PHYS101", name_en: "General Physics I", name_ar: "الفيزياء العامة ١", credits: 3 }, { code: "PHYS102", name_en: "General Physics II", name_ar: "الفيزياء العامة ٢", credits: 3 }, { code: "PHYS201", name_en: "Classical Mechanics", name_ar: "الميكانيكا الكلاسيكية", credits: 3 }, { code: "PHYS202", name_en: "Electromagnetism", name_ar: "الكهرومغناطيسية", credits: 3 }, { code: "PHYS301", name_en: "Quantum Mechanics", name_ar: "ميكانيكا الكم", credits: 3 }, { code: "PHYS302", name_en: "Thermodynamics", name_ar: "الديناميكا الحرارية", credits: 3 }, { code: "PHYS401", name_en: "Nuclear Physics", name_ar: "الفيزياء النووية", credits: 3 }, { code: "PHYS402", name_en: "Solid State Physics", name_ar: "فيزياء الحالة الصلبة", credits: 3 }] },
          { id: "KW-KU-SCI-CHEM", name_ar: "قسم الكيمياء", name_en: "Department of Chemistry", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "CHEM101", name_en: "General Chemistry I", name_ar: "الكيمياء العامة ١", credits: 3 }, { code: "CHEM102", name_en: "General Chemistry II", name_ar: "الكيمياء العامة ٢", credits: 3 }, { code: "CHEM201", name_en: "Organic Chemistry I", name_ar: "الكيمياء العضوية ١", credits: 3 }, { code: "CHEM202", name_en: "Analytical Chemistry", name_ar: "الكيمياء التحليلية", credits: 3 }, { code: "CHEM301", name_en: "Physical Chemistry", name_ar: "الكيمياء الفيزيائية", credits: 3 }, { code: "CHEM302", name_en: "Inorganic Chemistry", name_ar: "الكيمياء غير العضوية", credits: 3 }, { code: "CHEM401", name_en: "Biochemistry", name_ar: "الكيمياء الحيوية", credits: 3 }, { code: "CHEM402", name_en: "Industrial Chemistry", name_ar: "الكيمياء الصناعية", credits: 3 }] },
          { id: "KW-KU-SCI-BIO", name_ar: "قسم علم الحياة", name_en: "Department of Biological Sciences", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "BIOL101", name_en: "General Biology I", name_ar: "الأحياء العامة ١", credits: 3 }, { code: "BIOL102", name_en: "General Biology II", name_ar: "الأحياء العامة ٢", credits: 3 }, { code: "BIOL201", name_en: "Cell Biology", name_ar: "بيولوجيا الخلية", credits: 3 }, { code: "BIOL202", name_en: "Genetics", name_ar: "علم الوراثة", credits: 3 }, { code: "BIOL301", name_en: "Ecology", name_ar: "علم البيئة", credits: 3 }, { code: "BIOL302", name_en: "Microbiology", name_ar: "علم الأحياء الدقيقة", credits: 3 }, { code: "BIOL401", name_en: "Molecular Biology", name_ar: "الأحياء الجزيئية", credits: 3 }, { code: "BIOL402", name_en: "Biotechnology", name_ar: "التقنية الحيوية", credits: 3 }] },
          { id: "KW-KU-SCI-STAT", name_ar: "قسم الإحصاء والبحوث", name_en: "Department of Statistics and Operations Research", degrees: ["BSc", "MSc"], courses: [{ code: "STAT101", name_en: "Introduction to Statistics", name_ar: "مقدمة في الإحصاء", credits: 3 }, { code: "STAT201", name_en: "Probability Theory", name_ar: "نظرية الاحتمالات", credits: 3 }, { code: "STAT202", name_en: "Statistical Inference", name_ar: "الاستدلال الإحصائي", credits: 3 }, { code: "STAT301", name_en: "Regression Analysis", name_ar: "تحليل الانحدار", credits: 3 }, { code: "STAT302", name_en: "Operations Research", name_ar: "بحوث العمليات", credits: 3 }, { code: "STAT401", name_en: "Multivariate Analysis", name_ar: "التحليل متعدد المتغيرات", credits: 3 }] },
          { id: "KW-KU-SCI-CS", name_ar: "قسم علوم الحاسب", name_en: "Department of Computer Science", degrees: ["BSc", "MSc"], courses: [{ code: "CS101", name_en: "Introduction to Programming", name_ar: "مقدمة في البرمجة", credits: 3 }, { code: "CS102", name_en: "Data Structures", name_ar: "هياكل البيانات", credits: 3 }, { code: "CS201", name_en: "Algorithms", name_ar: "الخوارزميات", credits: 3 }, { code: "CS202", name_en: "Database Systems", name_ar: "أنظمة قواعد البيانات", credits: 3 }, { code: "CS301", name_en: "Operating Systems", name_ar: "أنظمة التشغيل", credits: 3 }, { code: "CS302", name_en: "Computer Networks", name_ar: "شبكات الحاسب", credits: 3 }, { code: "CS401", name_en: "Artificial Intelligence", name_ar: "الذكاء الاصطناعي", credits: 3 }, { code: "CS402", name_en: "Software Engineering", name_ar: "هندسة البرمجيات", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-ENG",
        name_ar: "كلية الهندسة والبترول",
        name_en: "College of Engineering and Petroleum",
        departments: [
          { id: "KW-KU-ENG-CIVIL", name_ar: "قسم الهندسة المدنية", name_en: "Department of Civil Engineering", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "CIVL101", name_en: "Engineering Drawing", name_ar: "الرسم الهندسي", credits: 2 }, { code: "CIVL201", name_en: "Statics", name_ar: "الاستاتيكا", credits: 3 }, { code: "CIVL202", name_en: "Mechanics of Materials", name_ar: "ميكانيكا المواد", credits: 3 }, { code: "CIVL301", name_en: "Structural Analysis", name_ar: "التحليل الإنشائي", credits: 3 }, { code: "CIVL302", name_en: "Fluid Mechanics", name_ar: "ميكانيكا الموائع", credits: 3 }, { code: "CIVL303", name_en: "Soil Mechanics", name_ar: "ميكانيكا التربة", credits: 3 }, { code: "CIVL401", name_en: "Foundation Engineering", name_ar: "هندسة الأساسات", credits: 3 }, { code: "CIVL402", name_en: "Transportation Engineering", name_ar: "هندسة النقل", credits: 3 }] },
          { id: "KW-KU-ENG-MECH", name_ar: "قسم الهندسة الميكانيكية", name_en: "Department of Mechanical Engineering", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "MECH201", name_en: "Engineering Thermodynamics", name_ar: "الديناميكا الحرارية الهندسية", credits: 3 }, { code: "MECH202", name_en: "Dynamics", name_ar: "الديناميكا", credits: 3 }, { code: "MECH301", name_en: "Fluid Mechanics", name_ar: "ميكانيكا الموائع", credits: 3 }, { code: "MECH302", name_en: "Heat Transfer", name_ar: "انتقال الحرارة", credits: 3 }, { code: "MECH303", name_en: "Machine Design", name_ar: "تصميم الآلات", credits: 3 }, { code: "MECH401", name_en: "Manufacturing Processes", name_ar: "عمليات التصنيع", credits: 3 }, { code: "MECH402", name_en: "Control Systems", name_ar: "أنظمة التحكم", credits: 3 }] },
          { id: "KW-KU-ENG-ELEC", name_ar: "قسم الهندسة الكهربائية", name_en: "Department of Electrical Engineering", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "ELEE201", name_en: "Circuit Analysis I", name_ar: "تحليل الدوائر ١", credits: 3 }, { code: "ELEE202", name_en: "Circuit Analysis II", name_ar: "تحليل الدوائر ٢", credits: 3 }, { code: "ELEE301", name_en: "Electronics I", name_ar: "الإلكترونيات ١", credits: 3 }, { code: "ELEE302", name_en: "Signals and Systems", name_ar: "الإشارات والأنظمة", credits: 3 }, { code: "ELEE303", name_en: "Electromagnetic Fields", name_ar: "الحقول الكهرومغناطيسية", credits: 3 }, { code: "ELEE401", name_en: "Power Systems", name_ar: "أنظمة القوى الكهربائية", credits: 3 }, { code: "ELEE402", name_en: "Digital Communications", name_ar: "الاتصالات الرقمية", credits: 3 }] },
          { id: "KW-KU-ENG-CHEM", name_ar: "قسم الهندسة الكيميائية", name_en: "Department of Chemical Engineering", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "CHEN201", name_en: "Material and Energy Balances", name_ar: "موازين المادة والطاقة", credits: 3 }, { code: "CHEN202", name_en: "Thermodynamics I", name_ar: "الديناميكا الحرارية ١", credits: 3 }, { code: "CHEN301", name_en: "Transport Phenomena", name_ar: "ظواهر الانتقال", credits: 3 }, { code: "CHEN302", name_en: "Chemical Reaction Engineering", name_ar: "هندسة التفاعلات الكيميائية", credits: 3 }, { code: "CHEN401", name_en: "Process Design", name_ar: "تصميم العمليات", credits: 3 }, { code: "CHEN402", name_en: "Petroleum Refining", name_ar: "تكرير البترول", credits: 3 }] },
          { id: "KW-KU-ENG-PETRO", name_ar: "قسم هندسة البترول", name_en: "Department of Petroleum Engineering", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "PETE201", name_en: "Introduction to Petroleum Engineering", name_ar: "مقدمة في هندسة البترول", credits: 3 }, { code: "PETE202", name_en: "Reservoir Mechanics", name_ar: "ميكانيكا المكامن", credits: 3 }, { code: "PETE301", name_en: "Drilling Engineering", name_ar: "هندسة الحفر", credits: 3 }, { code: "PETE302", name_en: "Production Engineering", name_ar: "هندسة الإنتاج", credits: 3 }, { code: "PETE401", name_en: "Reservoir Simulation", name_ar: "محاكاة المكامن", credits: 3 }, { code: "PETE402", name_en: "Enhanced Oil Recovery", name_ar: "الاستخلاص المعزز للنفط", credits: 3 }] },
          { id: "KW-KU-ENG-ARCH", name_ar: "قسم العمارة", name_en: "Department of Architecture", degrees: ["BArch", "MSc"], courses: [{ code: "ARCH101", name_en: "Architectural Design I", name_ar: "التصميم المعماري ١", credits: 4 }, { code: "ARCH102", name_en: "Architectural Design II", name_ar: "التصميم المعماري ٢", credits: 4 }, { code: "ARCH201", name_en: "History of Architecture", name_ar: "تاريخ العمارة", credits: 3 }, { code: "ARCH202", name_en: "Structural Systems", name_ar: "الأنظمة الإنشائية", credits: 3 }, { code: "ARCH301", name_en: "Urban Design", name_ar: "التصميم الحضري", credits: 3 }, { code: "ARCH401", name_en: "Sustainable Architecture", name_ar: "العمارة المستدامة", credits: 3 }] },
          { id: "KW-KU-ENG-IND", name_ar: "قسم الهندسة الصناعية وهندسة الإدارة", name_en: "Department of Industrial and Management Engineering", degrees: ["BSc", "MSc"], courses: [{ code: "INDE201", name_en: "Engineering Economy", name_ar: "اقتصاد هندسي", credits: 3 }, { code: "INDE202", name_en: "Production Planning", name_ar: "تخطيط الإنتاج", credits: 3 }, { code: "INDE301", name_en: "Quality Control", name_ar: "ضبط الجودة", credits: 3 }, { code: "INDE302", name_en: "Simulation", name_ar: "المحاكاة", credits: 3 }, { code: "INDE401", name_en: "Supply Chain Management", name_ar: "إدارة سلسلة التوريد", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-MED",
        name_ar: "كلية الطب",
        name_en: "College of Medicine",
        departments: [
          { id: "KW-KU-MED-BASIC", name_ar: "العلوم الطبية الأساسية", name_en: "Basic Medical Sciences", degrees: ["MBBS"], courses: [{ code: "MED101", name_en: "Human Anatomy I", name_ar: "التشريح البشري ١", credits: 4 }, { code: "MED102", name_en: "Physiology I", name_ar: "الفسيولوجيا ١", credits: 4 }, { code: "MED103", name_en: "Biochemistry", name_ar: "الكيمياء الحيوية", credits: 3 }, { code: "MED201", name_en: "Pathology", name_ar: "علم الأمراض", credits: 4 }, { code: "MED202", name_en: "Pharmacology", name_ar: "علم الأدوية", credits: 3 }, { code: "MED203", name_en: "Microbiology", name_ar: "علم الأحياء الدقيقة", credits: 3 }] },
          { id: "KW-KU-MED-CLIN", name_ar: "العلوم السريرية", name_en: "Clinical Sciences", degrees: ["MBBS"], courses: [{ code: "CLIN301", name_en: "Internal Medicine", name_ar: "الطب الباطني", credits: 6 }, { code: "CLIN302", name_en: "Surgery", name_ar: "الجراحة", credits: 6 }, { code: "CLIN303", name_en: "Pediatrics", name_ar: "طب الأطفال", credits: 4 }, { code: "CLIN304", name_en: "Obstetrics and Gynecology", name_ar: "التوليد وأمراض النساء", credits: 4 }, { code: "CLIN401", name_en: "Psychiatry", name_ar: "الطب النفسي", credits: 3 }, { code: "CLIN402", name_en: "Community Medicine", name_ar: "طب المجتمع", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-LAW",
        name_ar: "كلية الحقوق",
        name_en: "College of Law",
        departments: [
          { id: "KW-KU-LAW-PUB", name_ar: "القانون العام", name_en: "Department of Public Law", degrees: ["LLB", "LLM"], courses: [{ code: "LAW101", name_en: "Introduction to Law", name_ar: "مقدمة في القانون", credits: 3 }, { code: "LAW201", name_en: "Constitutional Law", name_ar: "القانون الدستوري", credits: 3 }, { code: "LAW202", name_en: "Administrative Law", name_ar: "القانون الإداري", credits: 3 }, { code: "LAW301", name_en: "International Public Law", name_ar: "القانون الدولي العام", credits: 3 }, { code: "LAW401", name_en: "Human Rights Law", name_ar: "قانون حقوق الإنسان", credits: 3 }] },
          { id: "KW-KU-LAW-PRIV", name_ar: "القانون الخاص", name_en: "Department of Private Law", degrees: ["LLB", "LLM"], courses: [{ code: "LAWP201", name_en: "Civil Law", name_ar: "القانون المدني", credits: 3 }, { code: "LAWP202", name_en: "Commercial Law", name_ar: "القانون التجاري", credits: 3 }, { code: "LAWP301", name_en: "Contract Law", name_ar: "قانون العقود", credits: 3 }, { code: "LAWP302", name_en: "Family Law", name_ar: "قانون الأسرة", credits: 3 }, { code: "LAWP401", name_en: "International Private Law", name_ar: "القانون الدولي الخاص", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-BUS",
        name_ar: "كلية إدارة الأعمال",
        name_en: "College of Business Administration",
        departments: [
          { id: "KW-KU-BUS-ACC", name_ar: "قسم المحاسبة", name_en: "Department of Accounting", degrees: ["BSc", "MSc"], courses: [{ code: "ACCT101", name_en: "Financial Accounting I", name_ar: "المحاسبة المالية ١", credits: 3 }, { code: "ACCT102", name_en: "Financial Accounting II", name_ar: "المحاسبة المالية ٢", credits: 3 }, { code: "ACCT201", name_en: "Cost Accounting", name_ar: "محاسبة التكاليف", credits: 3 }, { code: "ACCT202", name_en: "Auditing", name_ar: "المراجعة والتدقيق", credits: 3 }, { code: "ACCT301", name_en: "Advanced Financial Accounting", name_ar: "المحاسبة المالية المتقدمة", credits: 3 }, { code: "ACCT401", name_en: "Tax Accounting", name_ar: "المحاسبة الضريبية", credits: 3 }] },
          { id: "KW-KU-BUS-FIN", name_ar: "قسم المالية والاقتصاد", name_en: "Department of Finance and Economics", degrees: ["BSc", "MSc"], courses: [{ code: "FIN101", name_en: "Principles of Economics", name_ar: "مبادئ الاقتصاد", credits: 3 }, { code: "FIN201", name_en: "Corporate Finance", name_ar: "تمويل الشركات", credits: 3 }, { code: "FIN202", name_en: "Financial Markets", name_ar: "الأسواق المالية", credits: 3 }, { code: "FIN301", name_en: "Investment Analysis", name_ar: "تحليل الاستثمارات", credits: 3 }, { code: "FIN302", name_en: "Financial Econometrics", name_ar: "الاقتصاد القياسي المالي", credits: 3 }, { code: "FIN401", name_en: "International Finance", name_ar: "التمويل الدولي", credits: 3 }] },
          { id: "KW-KU-BUS-MGMT", name_ar: "قسم الإدارة", name_en: "Department of Management and Marketing", degrees: ["BSc", "MSc", "MBA"], courses: [{ code: "MGMT101", name_en: "Principles of Management", name_ar: "مبادئ الإدارة", credits: 3 }, { code: "MGMT201", name_en: "Organizational Behavior", name_ar: "السلوك التنظيمي", credits: 3 }, { code: "MGMT202", name_en: "Marketing Management", name_ar: "إدارة التسويق", credits: 3 }, { code: "MGMT301", name_en: "Strategic Management", name_ar: "الإدارة الاستراتيجية", credits: 3 }, { code: "MGMT302", name_en: "Human Resource Management", name_ar: "إدارة الموارد البشرية", credits: 3 }, { code: "MGMT401", name_en: "Entrepreneurship", name_ar: "ريادة الأعمال", credits: 3 }] },
          { id: "KW-KU-BUS-QM", name_ar: "قسم الأساليب الكمية", name_en: "Department of Quantitative Methods and Information Systems", degrees: ["BSc", "MSc"], courses: [{ code: "QMIS101", name_en: "Business Statistics", name_ar: "Business Statistics", credits: 3 }, { code: "QMIS201", name_en: "Management Information Systems", name_ar: "نظم المعلومات الإدارية", credits: 3 }, { code: "QMIS202", name_en: "Business Analytics", name_ar: "Business Analytics", credits: 3 }, { code: "QMIS301", name_en: "Decision Analysis", name_ar: "Decision Analysis", credits: 3 }, { code: "QMIS401", name_en: "Data Mining for Business", name_ar: "Data Mining for Business", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-EDU",
        name_ar: "كلية التربية",
        name_en: "College of Education",
        departments: [
          { id: "KW-KU-EDU-CURR", name_ar: "قسم المناهج وطرق التدريس", name_en: "Department of Curriculum and Instruction", degrees: ["BA", "MEd"], courses: [{ code: "EDUC101", name_en: "Foundations of Education", name_ar: "أسس التربية", credits: 3 }, { code: "EDUC201", name_en: "Curriculum Design", name_ar: "تصميم المناهج", credits: 3 }, { code: "EDUC202", name_en: "Teaching Methods", name_ar: "طرق التدريس", credits: 3 }, { code: "EDUC301", name_en: "Educational Technology", name_ar: "تقنيات التعليم", credits: 3 }, { code: "EDUC401", name_en: "Assessment and Evaluation", name_ar: "Assessment and Evaluation", credits: 3 }] },
          { id: "KW-KU-EDU-PSYCH", name_ar: "قسم علم النفس التربوي", name_en: "Department of Educational Psychology", degrees: ["BA", "MEd"], courses: [{ code: "EDPS201", name_en: "Educational Psychology", name_ar: "علم النفس التربوي", credits: 3 }, { code: "EDPS202", name_en: "Learning Theories", name_ar: "Learning Theories", credits: 3 }, { code: "EDPS301", name_en: "Child Development", name_ar: "نمو الطفل", credits: 3 }, { code: "EDPS401", name_en: "Special Education", name_ar: "التربية الخاصة", credits: 3 }] },
          { id: "KW-KU-EDU-ADMIN", name_ar: "قسم الإدارة والأصول التربوية", name_en: "Department of Educational Administration", degrees: ["BA", "MEd"], courses: [{ code: "EDAC201", name_en: "Educational Administration", name_ar: "Educational Administration", credits: 3 }, { code: "EDAC202", name_en: "School Management", name_ar: "School Management", credits: 3 }, { code: "EDAC301", name_en: "Education Policy", name_ar: "Education Policy", credits: 3 }, { code: "EDAC401", name_en: "Educational Leadership", name_ar: "القيادة التربوية", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-PHARM",
        name_ar: "كلية الصيدلة",
        name_en: "College of Pharmacy",
        departments: [
          { id: "KW-KU-PHARM-PHARM", name_ar: "قسم الصيدلانيات", name_en: "Department of Pharmaceutics", degrees: ["BPharm", "MSc", "PhD"], courses: [{ code: "PHRM101", name_en: "Introduction to Pharmacy", name_ar: "Introduction to Pharmacy", credits: 3 }, { code: "PHRM201", name_en: "Pharmaceutics I", name_ar: "Pharmaceutics I", credits: 3 }, { code: "PHRM202", name_en: "Pharmacognosy", name_ar: "Pharmacognosy", credits: 3 }, { code: "PHRM301", name_en: "Pharmacokinetics", name_ar: "حركية الدواء", credits: 3 }, { code: "PHRM401", name_en: "Clinical Pharmacy", name_ar: "Clinical Pharmacy", credits: 3 }] },
          { id: "KW-KU-PHARM-CHEM", name_ar: "قسم الكيمياء الصيدلانية", name_en: "Department of Pharmaceutical Chemistry", degrees: ["BPharm", "MSc", "PhD"], courses: [{ code: "PHCH201", name_en: "Medicinal Chemistry I", name_ar: "Medicinal Chemistry I", credits: 3 }, { code: "PHCH202", name_en: "Drug Analysis", name_ar: "Drug Analysis", credits: 3 }, { code: "PHCH301", name_en: "Drug Design", name_ar: "Drug Design", credits: 3 }, { code: "PHCH401", name_en: "Toxicology", name_ar: "Toxicology", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-ALLIED",
        name_ar: "كلية العلوم الطبية المساندة",
        name_en: "College of Allied Health Sciences",
        departments: [
          { id: "KW-KU-ALLIED-MLT", name_ar: "قسم تقنية المختبرات الطبية", name_en: "Department of Medical Laboratory Sciences", degrees: ["BSc"], courses: [{ code: "MLSC201", name_en: "Clinical Hematology", name_ar: "Clinical Hematology", credits: 3 }, { code: "MLSC202", name_en: "Clinical Biochemistry", name_ar: "الكيمياء الحيوية السريرية", credits: 3 }, { code: "MLSC301", name_en: "Clinical Microbiology", name_ar: "Clinical Microbiology", credits: 3 }, { code: "MLSC302", name_en: "Blood Banking", name_ar: "Blood Banking", credits: 3 }, { code: "MLSC401", name_en: "Histopathology", name_ar: "Histopathology", credits: 3 }] },
          { id: "KW-KU-ALLIED-RAD", name_ar: "قسم الأشعة", name_en: "Department of Radiological Sciences", degrees: ["BSc"], courses: [{ code: "RADS201", name_en: "Radiographic Anatomy", name_ar: "Radiographic Anatomy", credits: 3 }, { code: "RADS202", name_en: "Diagnostic Imaging", name_ar: "Diagnostic Imaging", credits: 3 }, { code: "RADS301", name_en: "Nuclear Medicine", name_ar: "Nuclear Medicine", credits: 3 }, { code: "RADS401", name_en: "Radiation Physics", name_ar: "Radiation Physics", credits: 3 }] },
          { id: "KW-KU-ALLIED-PT", name_ar: "قسم العلاج الطبيعي", name_en: "Department of Physical Therapy", degrees: ["BSc"], courses: [{ code: "PHYT201", name_en: "Anatomy for Physical Therapy", name_ar: "Anatomy for Physical Therapy", credits: 3 }, { code: "PHYT202", name_en: "Kinesiology", name_ar: "Kinesiology", credits: 3 }, { code: "PHYT301", name_en: "Therapeutic Exercise", name_ar: "Therapeutic Exercise", credits: 3 }, { code: "PHYT401", name_en: "Clinical Rehabilitation", name_ar: "Clinical Rehabilitation", credits: 4 }] },
        ],
      },
      {
        id: "KW-KU-SHARIA",
        name_ar: "كلية الشريعة والدراسات الإسلامية",
        name_en: "College of Sharia and Islamic Studies",
        departments: [
          { id: "KW-KU-SHARIA-FIQH", name_ar: "قسم الفقه وأصوله", name_en: "Department of Islamic Jurisprudence", degrees: ["BA", "MA"], courses: [{ code: "ISLM101", name_en: "Introduction to Islamic Law", name_ar: "مقدمة في الشريعة الإسلامية", credits: 3 }, { code: "ISLM201", name_en: "Principles of Jurisprudence", name_ar: "Principles of Jurisprudence", credits: 3 }, { code: "ISLM202", name_en: "Comparative Fiqh", name_ar: "Comparative Fiqh", credits: 3 }, { code: "ISLM301", name_en: "Family Law in Islam", name_ar: "Family Law in Islam", credits: 3 }, { code: "ISLM401", name_en: "Islamic Finance", name_ar: "التمويل الإسلامي", credits: 3 }] },
          { id: "KW-KU-SHARIA-QURAN", name_ar: "قسم القرآن الكريم وعلومه", name_en: "Department of Quran and Islamic Sciences", degrees: ["BA", "MA"], courses: [{ code: "QRNS101", name_en: "Quran Recitation and Memorization", name_ar: "Quran Recitation and Memorization", credits: 2 }, { code: "QRNS201", name_en: "Tafsir (Quranic Exegesis)", name_ar: "Tafsir (Quranic Exegesis)", credits: 3 }, { code: "QRNS202", name_en: "Hadith Sciences", name_ar: "علوم الحديث", credits: 3 }, { code: "QRNS301", name_en: "Aqeedah (Islamic Theology)", name_ar: "Aqeedah (Islamic Theology)", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-NURS",
        name_ar: "كلية التمريض",
        name_en: "College of Nursing",
        departments: [
          { id: "KW-KU-NURS-BASIC", name_ar: "قسم التمريض الأساسي", name_en: "Department of Basic Nursing", degrees: ["BSc", "MSc"], courses: [{ code: "NURS101", name_en: "Fundamentals of Nursing", name_ar: "أساسيات التمريض", credits: 3 }, { code: "NURS201", name_en: "Adult Health Nursing", name_ar: "تمريض صحة البالغين", credits: 4 }, { code: "NURS202", name_en: "Mental Health Nursing", name_ar: "Mental Health Nursing", credits: 3 }, { code: "NURS301", name_en: "Community Health Nursing", name_ar: "تمريض صحة المجتمع", credits: 3 }, { code: "NURS401", name_en: "Nursing Research", name_ar: "Nursing Research", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-FINE",
        name_ar: "كلية الفنون الجميلة والتصميم",
        name_en: "College of Fine Arts",
        departments: [
          { id: "KW-KU-FINE-DESIGN", name_ar: "قسم التصميم الجرافيكي", name_en: "Department of Graphic Design", degrees: ["BA"], courses: [{ code: "GRDS101", name_en: "Design Principles", name_ar: "Design Principles", credits: 3 }, { code: "GRDS201", name_en: "Typography", name_ar: "فن الطباعة", credits: 3 }, { code: "GRDS202", name_en: "Digital Illustration", name_ar: "Digital Illustration", credits: 3 }, { code: "GRDS301", name_en: "Brand Identity Design", name_ar: "Brand Identity Design", credits: 3 }, { code: "GRDS401", name_en: "UI/UX Design", name_ar: "UI/UX Design", credits: 3 }] },
        ],
      },
    ],
  },
  // GUST
  {
    id: "KW-GUST",
    name_ar: "جامعة الخليج للعلوم والتكنولوجيا",
    name_en: "Gulf University for Science and Technology",
    website: "https://www.gust.edu.kw",
    type: "private",
    founded: 2002,
    country_code: "KW",
    country_ar: "الكويت",
    country_en: "Kuwait",
    colleges: [
      {
        id: "KW-GUST-BUS",
        name_ar: "كلية إدارة الأعمال",
        name_en: "College of Business Administration",
        departments: [
          { id: "KW-GUST-BUS-ACC", name_ar: "قسم المحاسبة", name_en: "Department of Accounting", degrees: ["BSc"], courses: [{ code: "GACC101", name_en: "Financial Accounting I", name_ar: "المحاسبة المالية ١", credits: 3 }, { code: "GACC201", name_en: "Managerial Accounting", name_ar: "المحاسبة الإدارية", credits: 3 }, { code: "GACC301", name_en: "Auditing", name_ar: "المراجعة والتدقيق", credits: 3 }, { code: "GACC401", name_en: "Accounting Information Systems", name_ar: "نظم المعلومات المحاسبية", credits: 3 }] },
          { id: "KW-GUST-BUS-FIN", name_ar: "قسم التمويل والاقتصاد", name_en: "Department of Finance and Economics", degrees: ["BSc"], courses: [{ code: "GFIN101", name_en: "Principles of Economics", name_ar: "مبادئ الاقتصاد", credits: 3 }, { code: "GFIN201", name_en: "Corporate Finance", name_ar: "تمويل الشركات", credits: 3 }, { code: "GFIN301", name_en: "Financial Markets and Institutions", name_ar: "الأسواق والمؤسسات المالية", credits: 3 }, { code: "GFIN401", name_en: "International Financial Management", name_ar: "الإدارة المالية الدولية", credits: 3 }] },
          { id: "KW-GUST-BUS-MKT", name_ar: "قسم التسويق وإدارة الأعمال", name_en: "Department of Marketing and Management", degrees: ["BSc", "MBA"], courses: [{ code: "GMKT201", name_en: "Marketing Management", name_ar: "إدارة التسويق", credits: 3 }, { code: "GMKT202", name_en: "Consumer Behavior", name_ar: "سلوك المستهلك", credits: 3 }, { code: "GMKT301", name_en: "Digital Marketing", name_ar: "التسويق الرقمي", credits: 3 }, { code: "GMKT401", name_en: "Strategic Marketing", name_ar: "التسويق الاستراتيجي", credits: 3 }] },
        ],
      },
      {
        id: "KW-GUST-ARTS",
        name_ar: "كلية الآداب والعلوم",
        name_en: "College of Arts and Sciences",
        departments: [
          { id: "KW-GUST-ARTS-MATH", name_ar: "قسم الرياضيات وعلوم الحاسب", name_en: "Department of Mathematics and Computer Science", degrees: ["BSc"], courses: [{ code: "GMAT101", name_en: "Calculus I", name_ar: "التفاضل والتكامل ١", credits: 3 }, { code: "GMAT201", name_en: "Discrete Mathematics", name_ar: "الرياضيات المتقطعة", credits: 3 }, { code: "GCS101", name_en: "Programming Fundamentals", name_ar: "أساسيات البرمجة", credits: 3 }, { code: "GCS201", name_en: "Data Structures", name_ar: "هياكل البيانات", credits: 3 }, { code: "GCS301", name_en: "Artificial Intelligence", name_ar: "الذكاء الاصطناعي", credits: 3 }] },
        ],
      },
    ],
  },
  // AUK
  {
    id: "KW-AUK",
    name_ar: "الجامعة الأمريكية في الكويت",
    name_en: "American University of Kuwait",
    website: "https://www.auk.edu.kw",
    type: "private",
    founded: 2004,
    country_code: "KW",
    country_ar: "الكويت",
    country_en: "Kuwait",
    colleges: [
      {
        id: "KW-AUK-ART",
        name_ar: "كلية الآداب والعلوم",
        name_en: "College of Arts and Sciences",
        departments: [
          { id: "KW-AUK-ART-ENG", name_ar: "قسم اللغة الإنجليزية والتواصل", name_en: "Department of English and Communication", degrees: ["BA"], courses: [{ code: "AENG101", name_en: "Academic English I", name_ar: "الإنجليزية الأكاديمية ١", credits: 3 }, { code: "AENG201", name_en: "Communication Skills", name_ar: "مهارات الاتصال", credits: 3 }, { code: "AENG301", name_en: "Technical Writing", name_ar: "الكتابة الفنية", credits: 3 }] },
          { id: "KW-AUK-ART-SS", name_ar: "قسم العلوم الاجتماعية", name_en: "Department of Social Sciences", degrees: ["BA"], courses: [{ code: "ASSC101", name_en: "Introduction to Sociology", name_ar: "مقدمة في علم الاجتماع", credits: 3 }, { code: "ASSC201", name_en: "Political Science", name_ar: "العلوم السياسية", credits: 3 }, { code: "ASSC301", name_en: "International Relations", name_ar: "العلاقات الدولية", credits: 3 }] },
        ],
      },
      {
        id: "KW-AUK-BUS",
        name_ar: "كلية إدارة الأعمال",
        name_en: "College of Business Administration",
        departments: [
          { id: "KW-AUK-BUS-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["BSc", "MBA"], courses: [{ code: "ABAS101", name_en: "Principles of Management", name_ar: "مبادئ الإدارة", credits: 3 }, { code: "ABAS201", name_en: "Business Ethics", name_ar: "أخلاقيات الأعمال", credits: 3 }, { code: "ABAS301", name_en: "Entrepreneurship", name_ar: "ريادة الأعمال", credits: 3 }] },
        ],
      },
    ],
  },
  // ACM
  {
    id: "KW-ACK",
    name_ar: "الكلية الأمريكية للشرق الأوسط",
    name_en: "American College of the Middle East",
    website: "https://www.acm.edu.kw",
    type: "private",
    founded: 2010,
    country_code: "KW",
    country_ar: "الكويت",
    country_en: "Kuwait",
    colleges: [
      {
        id: "KW-ACK-ENG",
        name_ar: "كلية الهندسة",
        name_en: "College of Engineering",
        departments: [
          { id: "KW-ACK-ENG-CS", name_ar: "قسم علوم الحاسب وهندسته", name_en: "Department of Computer Science and Engineering", degrees: ["BSc"], courses: [{ code: "ACCS101", name_en: "Introduction to Computing", name_ar: "مقدمة في الحوسبة", credits: 3 }, { code: "ACCS201", name_en: "Data Structures and Algorithms", name_ar: "هياكل البيانات والخوارزميات", credits: 3 }, { code: "ACCS301", name_en: "Software Engineering", name_ar: "هندسة البرمجيات", credits: 3 }, { code: "ACCS401", name_en: "Machine Learning", name_ar: "التعلم الآلي", credits: 3 }] },
        ],
      },
      {
        id: "KW-ACK-BUS",
        name_ar: "كلية الأعمال",
        name_en: "College of Business",
        departments: [
          { id: "KW-ACK-BUS-MGMT", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Management", degrees: ["BSc"], courses: [{ code: "ACBM101", name_en: "Business Foundations", name_ar: "أساسيات الأعمال", credits: 3 }, { code: "ACBM201", name_en: "Management Principles", name_ar: "مبادئ الإدارة", credits: 3 }, { code: "ACBM301", name_en: "Project Management", name_ar: "إدارة المشاريع", credits: 3 }] },
        ],
      },
    ],
  },
  // AOU
  {
    id: "KW-AAUM",
    name_ar: "جامعة العربية المفتوحة - الكويت",
    name_en: "Arab Open University - Kuwait",
    website: "https://www.aou.edu.kw",
    type: "private",
    founded: 2002,
    country_code: "KW",
    country_ar: "الكويت",
    country_en: "Kuwait",
    colleges: [
      {
        id: "KW-AAUM-BUS",
        name_ar: "كلية الأعمال",
        name_en: "Faculty of Business Studies",
        departments: [
          { id: "KW-AAUM-BUS-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["BSc", "MBA"], courses: [{ code: "AOUB101", name_en: "Business Environment", name_ar: "بيئة الأعمال", credits: 8 }, { code: "AOUB201", name_en: "Managing People", name_ar: "إدارة الأفراد", credits: 8 }, { code: "AOUB301", name_en: "Marketing", name_ar: "التسويق", credits: 8 }] },
        ],
      },
      {
        id: "KW-AAUM-IT",
        name_ar: "كلية تقنية المعلومات والحوسبة",
        name_en: "Faculty of Computing and Information Technology",
        departments: [
          { id: "KW-AAUM-IT-CS", name_ar: "قسم علوم الحاسب", name_en: "Department of Computer Science", degrees: ["BSc"], courses: [{ code: "AOIT101", name_en: "Introduction to IT", name_ar: "مقدمة في تقنية المعلومات", credits: 8 }, { code: "AOIT201", name_en: "Databases", name_ar: "قواعد البيانات", credits: 8 }, { code: "AOIT301", name_en: "Network Technologies", name_ar: "تقنيات الشبكات", credits: 8 }] },
        ],
      },
    ],
  },
  // ===== QATAR =====
  {
    id: "QA-QU",
    name_ar: "جامعة قطر",
    name_en: "Qatar University",
    website: "https://www.qu.edu.qa",
    type: "public",
    founded: 1977,
    country_code: "QA",
    country_ar: "قطر",
    country_en: "Qatar",
    colleges: [
      {
        id: "QA-QU-ARTS",
        name_ar: "كلية الآداب والعلوم",
        name_en: "College of Arts and Sciences",
        departments: [
          { id: "QA-QU-ARTS-ARABIC", name_ar: "قسم اللغة العربية", name_en: "Department of Arabic Language", degrees: ["BA","MA"], courses: [{ code: "ARAB100", name_en: "Arabic Language Skills", name_ar: "مهارات اللغة العربية", credits: 3 }, { code: "ARAB200", name_en: "Arabic Literature I", name_ar: "الأدب العربي ١", credits: 3 }, { code: "ARAB201", name_en: "Arabic Grammar and Syntax", name_ar: "النحو والصرف العربي", credits: 3 }, { code: "ARAB300", name_en: "Classical Arabic Texts", name_ar: "النصوص العربية الكلاسيكية", credits: 3 }, { code: "ARAB400", name_en: "Modern Arabic Literature", name_ar: "الأدب العربي الحديث", credits: 3 }] },
          { id: "QA-QU-ARTS-BIO", name_ar: "قسم العلوم البيولوجية والبيئية", name_en: "Department of Biological and Environmental Sciences", degrees: ["BSc","MSc"], courses: [{ code: "BIOL101", name_en: "General Biology I", name_ar: "الأحياء العامة ١", credits: 3 }, { code: "BIOL102", name_en: "General Biology II", name_ar: "الأحياء العامة ٢", credits: 3 }, { code: "BIOL201", name_en: "Cell Biology", name_ar: "بيولوجيا الخلية", credits: 3 }, { code: "BIOL202", name_en: "Genetics", name_ar: "علم الوراثة", credits: 3 }, { code: "BIOL301", name_en: "Ecology", name_ar: "علم البيئة", credits: 3 }, { code: "ENVS301", name_en: "Environmental Science", name_ar: "العلوم البيئية", credits: 3 }, { code: "BIOL401", name_en: "Molecular Biology", name_ar: "الأحياء الجزيئية", credits: 3 }] },
          { id: "QA-QU-ARTS-CHEM", name_ar: "قسم الكيمياء وعلوم الأرض", name_en: "Department of Chemistry and Earth Sciences", degrees: ["BSc","MSc"], courses: [{ code: "CHEM101", name_en: "General Chemistry I", name_ar: "الكيمياء العامة ١", credits: 3 }, { code: "CHEM102", name_en: "General Chemistry II", name_ar: "الكيمياء العامة ٢", credits: 3 }, { code: "CHEM201", name_en: "Organic Chemistry I", name_ar: "الكيمياء العضوية ١", credits: 3 }, { code: "CHEM202", name_en: "Analytical Chemistry", name_ar: "الكيمياء التحليلية", credits: 3 }, { code: "CHEM301", name_en: "Physical Chemistry", name_ar: "الكيمياء الفيزيائية", credits: 3 }, { code: "CHEM401", name_en: "Biochemistry", name_ar: "الكيمياء الحيوية", credits: 3 }, { code: "ESCI301", name_en: "Earth Sciences", name_ar: "علوم الأرض", credits: 3 }] },
          { id: "QA-QU-ARTS-MATH", name_ar: "قسم الرياضيات والإحصاء والفيزياء", name_en: "Department of Mathematics, Statistics and Physics", degrees: ["BSc","MSc"], courses: [{ code: "MATH101", name_en: "Calculus I", name_ar: "التفاضل والتكامل ١", credits: 3 }, { code: "MATH102", name_en: "Calculus II", name_ar: "التفاضل والتكامل ٢", credits: 3 }, { code: "MATH201", name_en: "Linear Algebra", name_ar: "الجبر الخطي", credits: 3 }, { code: "MATH301", name_en: "Real Analysis", name_ar: "التحليل الحقيقي", credits: 3 }, { code: "STAT201", name_en: "Probability and Statistics", name_ar: "الاحتمالات والإحصاء", credits: 3 }, { code: "PHYS101", name_en: "General Physics I", name_ar: "الفيزياء العامة ١", credits: 3 }, { code: "PHYS102", name_en: "General Physics II", name_ar: "الفيزياء العامة ٢", credits: 3 }] },
          { id: "QA-QU-ARTS-ENG", name_ar: "قسم اللغة الإنجليزية", name_en: "Department of English Literature and Linguistics", degrees: ["BA","MA"], courses: [{ code: "ENGL100", name_en: "English Composition", name_ar: "التعبير الإنجليزي", credits: 3 }, { code: "ENGL200", name_en: "Introduction to Literature", name_ar: "مقدمة في الأدب", credits: 3 }, { code: "ENGL201", name_en: "Linguistics", name_ar: "علم اللغة", credits: 3 }, { code: "ENGL300", name_en: "British Literature", name_ar: "الأدب البريطاني", credits: 3 }, { code: "ENGL400", name_en: "Literary Theory", name_ar: "النظرية الأدبية", credits: 3 }] },
          { id: "QA-QU-ARTS-HIST", name_ar: "قسم التاريخ والشؤون الدولية", name_en: "Department of History and International Affairs", degrees: ["BA","MA"], courses: [{ code: "HIST100", name_en: "World History", name_ar: "تاريخ العالم", credits: 3 }, { code: "HIST200", name_en: "History of the Middle East", name_ar: "تاريخ الشرق الأوسط", credits: 3 }, { code: "HIST301", name_en: "Modern Gulf History", name_ar: "تاريخ الخليج الحديث", credits: 3 }, { code: "INTA200", name_en: "Introduction to International Relations", name_ar: "مقدمة في العلاقات الدولية", credits: 3 }, { code: "INTA300", name_en: "Foreign Policy Analysis", name_ar: "تحليل السياسة الخارجية", credits: 3 }] },
          { id: "QA-QU-ARTS-SOC", name_ar: "قسم العلوم الاجتماعية", name_en: "Department of Social Sciences", degrees: ["BA","MA"], courses: [{ code: "SOC100", name_en: "Introduction to Sociology", name_ar: "مقدمة في علم الاجتماع", credits: 3 }, { code: "SOC200", name_en: "Social Research Methods", name_ar: "مناهج البحث الاجتماعي", credits: 3 }, { code: "SOC201", name_en: "Social Psychology", name_ar: "علم النفس الاجتماعي", credits: 3 }, { code: "SOC300", name_en: "Sociology of Gulf Society", name_ar: "علم اجتماع مجتمع الخليج", credits: 3 }, { code: "SOC400", name_en: "Sociology of Development", name_ar: "علم اجتماع التنمية", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-BUS",
        name_ar: "كلية الأعمال والاقتصاد",
        name_en: "College of Business and Economics",
        departments: [
          { id: "QA-QU-BUS-ACC", name_ar: "قسم المحاسبة والمعلومات", name_en: "Department of Accounting and Information Systems", degrees: ["BSc","MSc"], courses: [{ code: "ACCT201", name_en: "Financial Accounting", name_ar: "المحاسبة المالية", credits: 3 }, { code: "ACCT202", name_en: "Managerial Accounting", name_ar: "المحاسبة الإدارية", credits: 3 }, { code: "ACCT301", name_en: "Intermediate Accounting", name_ar: "المحاسبة المتوسطة", credits: 3 }, { code: "ACCT302", name_en: "Auditing", name_ar: "المراجعة والتدقيق", credits: 3 }, { code: "ACCT401", name_en: "Accounting Information Systems", name_ar: "نظم المعلومات المحاسبية", credits: 3 }] },
          { id: "QA-QU-BUS-FIN", name_ar: "قسم التمويل والاقتصاد", name_en: "Department of Finance and Economics", degrees: ["BSc","MSc"], courses: [{ code: "ECON201", name_en: "Microeconomics", name_ar: "الاقتصاد الجزئي", credits: 3 }, { code: "ECON202", name_en: "Macroeconomics", name_ar: "الاقتصاد الكلي", credits: 3 }, { code: "FINA201", name_en: "Corporate Finance", name_ar: "تمويل الشركات", credits: 3 }, { code: "FINA301", name_en: "Investments", name_ar: "الاستثمارات", credits: 3 }, { code: "FINA401", name_en: "Islamic Finance", name_ar: "التمويل الإسلامي", credits: 3 }] },
          { id: "QA-QU-BUS-MGMT", name_ar: "قسم الإدارة والتسويق", name_en: "Department of Management and Marketing", degrees: ["BSc","MSc","MBA"], courses: [{ code: "MGMT200", name_en: "Principles of Management", name_ar: "مبادئ الإدارة", credits: 3 }, { code: "MGMT301", name_en: "Organizational Behavior", name_ar: "السلوك التنظيمي", credits: 3 }, { code: "MKTG200", name_en: "Marketing Principles", name_ar: "مبادئ التسويق", credits: 3 }, { code: "MKTG301", name_en: "Consumer Behavior", name_ar: "سلوك المستهلك", credits: 3 }, { code: "MGMT401", name_en: "Strategic Management", name_ar: "الإدارة الاستراتيجية", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-ENG",
        name_ar: "كلية الهندسة",
        name_en: "College of Engineering",
        departments: [
          { id: "QA-QU-ENG-CIVIL", name_ar: "قسم الهندسة المدنية", name_en: "Department of Civil and Architectural Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "CVLE200", name_en: "Engineering Mechanics", name_ar: "الميكانيكا الهندسية", credits: 3 }, { code: "CVLE301", name_en: "Structural Analysis", name_ar: "التحليل الإنشائي", credits: 3 }, { code: "CVLE302", name_en: "Geotechnical Engineering", name_ar: "الهندسة الجيوتقنية", credits: 3 }, { code: "CVLE303", name_en: "Fluid Mechanics", name_ar: "ميكانيكا الموائع", credits: 3 }, { code: "CVLE401", name_en: "Construction Management", name_ar: "إدارة البناء", credits: 3 }] },
          { id: "QA-QU-ENG-ELEC", name_ar: "قسم الهندسة الكهربائية", name_en: "Department of Electrical Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "ELEE201", name_en: "Circuit Analysis", name_ar: "تحليل الدوائر", credits: 3 }, { code: "ELEE301", name_en: "Electronics", name_ar: "الإلكترونيات", credits: 3 }, { code: "ELEE302", name_en: "Signals and Systems", name_ar: "الإشارات والأنظمة", credits: 3 }, { code: "ELEE401", name_en: "Power Systems", name_ar: "أنظمة القوى الكهربائية", credits: 3 }, { code: "ELEE402", name_en: "Wireless Communications", name_ar: "الاتصالات اللاسلكية", credits: 3 }] },
          { id: "QA-QU-ENG-MECH", name_ar: "قسم الهندسة الميكانيكية والصناعية", name_en: "Department of Mechanical and Industrial Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "MECH201", name_en: "Thermodynamics", name_ar: "الديناميكا الحرارية", credits: 3 }, { code: "MECH202", name_en: "Engineering Mechanics", name_ar: "الميكانيكا الهندسية", credits: 3 }, { code: "MECH301", name_en: "Heat Transfer", name_ar: "انتقال الحرارة", credits: 3 }, { code: "MECH302", name_en: "Machine Design", name_ar: "تصميم الآلات", credits: 3 }, { code: "INDE301", name_en: "Industrial Engineering", name_ar: "الهندسة الصناعية", credits: 3 }] },
          { id: "QA-QU-ENG-CHEM", name_ar: "قسم الهندسة الكيميائية", name_en: "Department of Chemical Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "CHEN201", name_en: "Material and Energy Balances", name_ar: "موازين المادة والطاقة", credits: 3 }, { code: "CHEN301", name_en: "Transport Phenomena", name_ar: "ظواهر الانتقال", credits: 3 }, { code: "CHEN302", name_en: "Reaction Engineering", name_ar: "هندسة التفاعلات", credits: 3 }, { code: "CHEN401", name_en: "Process Control", name_ar: "التحكم في العمليات", credits: 3 }, { code: "CHEN402", name_en: "Petroleum Processes", name_ar: "عمليات البترول", credits: 3 }] },
          { id: "QA-QU-ENG-CS", name_ar: "قسم الهندسة الحاسوبية", name_en: "Department of Computer Science and Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "CMPE201", name_en: "Programming Fundamentals", name_ar: "أساسيات البرمجة", credits: 3 }, { code: "CMPE202", name_en: "Data Structures", name_ar: "هياكل البيانات", credits: 3 }, { code: "CMPE301", name_en: "Algorithms", name_ar: "الخوارزميات", credits: 3 }, { code: "CMPE302", name_en: "Operating Systems", name_ar: "أنظمة التشغيل", credits: 3 }, { code: "CMPE401", name_en: "Machine Learning", name_ar: "التعلم الآلي", credits: 3 }, { code: "CMPE402", name_en: "Cybersecurity", name_ar: "الأمن السيبراني", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-LAW",
        name_ar: "كلية القانون",
        name_en: "College of Law",
        departments: [
          { id: "QA-QU-LAW-PUB", name_ar: "القانون العام والخاص", name_en: "Department of Public and Private Law", degrees: ["LLB","LLM"], courses: [{ code: "LAW100", name_en: "Introduction to Law", name_ar: "مقدمة في القانون", credits: 3 }, { code: "LAW201", name_en: "Constitutional Law", name_ar: "القانون الدستوري", credits: 3 }, { code: "LAW202", name_en: "Civil Law", name_ar: "القانون المدني", credits: 3 }, { code: "LAW301", name_en: "Commercial Law", name_ar: "القانون التجاري", credits: 3 }, { code: "LAW401", name_en: "International Law", name_ar: "القانون الدولي", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-HLTH",
        name_ar: "كلية العلوم الصحية",
        name_en: "College of Health Sciences",
        departments: [
          { id: "QA-QU-HLTH-PHN", name_ar: "قسم الصحة العامة", name_en: "Department of Public Health", degrees: ["BSc","MPH"], courses: [{ code: "PBHL201", name_en: "Introduction to Public Health", name_ar: "مقدمة في الصحة العامة", credits: 3 }, { code: "PBHL202", name_en: "Epidemiology", name_ar: "علم الوبائيات", credits: 3 }, { code: "PBHL301", name_en: "Health Promotion", name_ar: "تعزيز الصحة", credits: 3 }, { code: "PBHL401", name_en: "Health Policy", name_ar: "السياسة الصحية", credits: 3 }] },
          { id: "QA-QU-HLTH-BIOMD", name_ar: "قسم العلوم الطبية الحيوية", name_en: "Department of Biomedical Science", degrees: ["BSc","MSc"], courses: [{ code: "BIOM201", name_en: "Anatomy and Physiology", name_ar: "التشريح والفسيولوجيا", credits: 3 }, { code: "BIOM202", name_en: "Pathophysiology", name_ar: "الفسيولوجيا المرضية", credits: 3 }, { code: "BIOM301", name_en: "Immunology", name_ar: "علم المناعة", credits: 3 }, { code: "BIOM401", name_en: "Clinical Biochemistry", name_ar: "الكيمياء الحيوية السريرية", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-PHARM",
        name_ar: "كلية الصيدلة",
        name_en: "College of Pharmacy",
        departments: [
          { id: "QA-QU-PHARM-PHARM", name_ar: "قسم الصيدلة الإكلينيكية", name_en: "Department of Clinical Pharmacy and Practice", degrees: ["PharmD","MSc"], courses: [{ code: "PHRM201", name_en: "Pharmacology I", name_ar: "علم الأدوية ١", credits: 3 }, { code: "PHRM202", name_en: "Pharmaceutics", name_ar: "علم الصيدلانيات", credits: 3 }, { code: "PHRM301", name_en: "Pharmacokinetics", name_ar: "حركية الدواء", credits: 3 }, { code: "PHRM401", name_en: "Clinical Pharmacy Practice", name_ar: "ممارسة الصيدلة السريرية", credits: 4 }] },
        ],
      },
      {
        id: "QA-QU-EDU",
        name_ar: "كلية التربية",
        name_en: "College of Education",
        departments: [
          { id: "QA-QU-EDU-CURR", name_ar: "قسم المناهج وطرق التدريس", name_en: "Department of Curriculum and Instruction", degrees: ["BA","MEd"], courses: [{ code: "EDUC200", name_en: "Foundations of Education", name_ar: "أسس التربية", credits: 3 }, { code: "EDUC201", name_en: "Curriculum Design", name_ar: "تصميم المناهج", credits: 3 }, { code: "EDUC301", name_en: "Educational Technology", name_ar: "تقنيات التعليم", credits: 3 }, { code: "EDUC401", name_en: "Assessment in Education", name_ar: "التقويم التربوي", credits: 3 }] },
          { id: "QA-QU-EDU-PSYCH", name_ar: "قسم علم النفس التربوي والإرشاد", name_en: "Department of Educational Psychology and Counseling", degrees: ["BA","MEd"], courses: [{ code: "EDPS200", name_en: "Educational Psychology", name_ar: "علم النفس التربوي", credits: 3 }, { code: "EDPS301", name_en: "Learning and Motivation", name_ar: "Learning and Motivation", credits: 3 }, { code: "COUNS301", name_en: "School Counseling", name_ar: "School Counseling", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-MED",
        name_ar: "كلية الطب",
        name_en: "College of Medicine",
        departments: [
          { id: "QA-QU-MED-BASIC", name_ar: "العلوم الطبية الأساسية", name_en: "Basic Medical Sciences", degrees: ["MD"], courses: [{ code: "MEDS101", name_en: "Human Anatomy", name_ar: "التشريح البشري", credits: 4 }, { code: "MEDS102", name_en: "Physiology", name_ar: "الفسيولوجيا", credits: 4 }, { code: "MEDS201", name_en: "Pathology", name_ar: "علم الأمراض", credits: 4 }, { code: "MEDS202", name_en: "Pharmacology", name_ar: "علم الأدوية", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-SHARIA",
        name_ar: "كلية الشريعة والدراسات الإسلامية",
        name_en: "College of Sharia and Islamic Studies",
        departments: [
          { id: "QA-QU-SHARIA-FIQH", name_ar: "قسم الفقه وأصوله", name_en: "Department of Islamic Jurisprudence", degrees: ["BA","MA"], courses: [{ code: "ISLM100", name_en: "Introduction to Islamic Law", name_ar: "مقدمة في الشريعة الإسلامية", credits: 3 }, { code: "ISLM201", name_en: "Principles of Islamic Jurisprudence", name_ar: "أصول الفقه الإسلامي", credits: 3 }, { code: "ISLM301", name_en: "Comparative Islamic Law", name_ar: "القانون الإسلامي المقارن", credits: 3 }] },
        ],
      },
    ],
  },
  {
    id: "QA-UDST",
    name_ar: "جامعة الدوحة للعلوم والتكنولوجيا",
    name_en: "University of Doha for Science and Technology",
    website: "https://www.udst.edu.qa",
    type: "public",
    founded: 2022,
    country_code: "QA",
    country_ar: "قطر",
    country_en: "Qatar",
    colleges: [
      {
        id: "QA-UDST-ENG",
        name_ar: "كلية الهندسة والتكنولوجيا",
        name_en: "College of Engineering and Technology",
        departments: [
          { id: "QA-UDST-ENG-ELEC", name_ar: "قسم الهندسة الكهربائية", name_en: "Department of Electrical Engineering", degrees: ["BSc"], courses: [{ code: "ELEC101", name_en: "Electrical Circuits", name_ar: "الدوائر الكهربائية", credits: 3 }, { code: "ELEC201", name_en: "Electronics", name_ar: "الإلكترونيات", credits: 3 }, { code: "ELEC301", name_en: "Automation and Control", name_ar: "الأتمتة والتحكم", credits: 3 }, { code: "ELEC302", name_en: "Power and Renewable Energy", name_ar: "الطاقة والطاقة المتجددة", credits: 3 }, { code: "ELEC303", name_en: "Telecommunications Networks", name_ar: "شبكات الاتصالات", credits: 3 }, { code: "ELEC401", name_en: "Smart Grid Systems", name_ar: "أنظمة الشبكات الذكية", credits: 3 }] },
          { id: "QA-UDST-ENG-MECH", name_ar: "قسم الهندسة الميكانيكية", name_en: "Department of Mechanical Engineering", degrees: ["BSc"], courses: [{ code: "MECH101", name_en: "Engineering Mechanics", name_ar: "الميكانيكا الهندسية", credits: 3 }, { code: "MECH201", name_en: "Thermodynamics", name_ar: "الديناميكا الحرارية", credits: 3 }, { code: "MECH301", name_en: "Maintenance Engineering", name_ar: "هندسة الصيانة", credits: 3 }, { code: "MECH302", name_en: "Smart Manufacturing", name_ar: "التصنيع الذكي", credits: 3 }, { code: "MECH401", name_en: "Robotics and Automation", name_ar: "الروبوتات والأتمتة", credits: 3 }] },
          { id: "QA-UDST-ENG-MARINE", name_ar: "قسم الهندسة البحرية", name_en: "Department of Marine Engineering", degrees: ["BSc"], courses: [{ code: "MARE101", name_en: "Marine Engineering Fundamentals", name_ar: "أساسيات الهندسة البحرية", credits: 3 }, { code: "MARE201", name_en: "Ship Systems", name_ar: "أنظمة السفن", credits: 3 }, { code: "MARE301", name_en: "Marine Propulsion", name_ar: "الدفع البحري", credits: 3 }, { code: "MARE401", name_en: "Port and Harbor Engineering", name_ar: "هندسة الموانئ والمرافئ", credits: 3 }] },
        ],
      },
      {
        id: "QA-UDST-CIT",
        name_ar: "كلية الحوسبة وتقنية المعلومات",
        name_en: "College of Computing and Information Technology",
        departments: [
          { id: "QA-UDST-CIT-IT", name_ar: "قسم تقنية المعلومات", name_en: "Department of Information Technology", degrees: ["BSc"], courses: [{ code: "ITECH101", name_en: "Introduction to IT", name_ar: "مقدمة في تقنية المعلومات", credits: 3 }, { code: "ITECH201", name_en: "Network Administration", name_ar: "إدارة الشبكات", credits: 3 }, { code: "ITECH202", name_en: "Database Management", name_ar: "إدارة قواعد البيانات", credits: 3 }, { code: "ITECH301", name_en: "Cloud Computing", name_ar: "الحوسبة السحابية", credits: 3 }, { code: "ITECH401", name_en: "IT Project Management", name_ar: "إدارة مشاريع تقنية المعلومات", credits: 3 }] },
          { id: "QA-UDST-CIT-IS", name_ar: "قسم نظم المعلومات", name_en: "Department of Information Systems", degrees: ["BSc"], courses: [{ code: "ISYS101", name_en: "Introduction to Information Systems", name_ar: "مقدمة في نظم المعلومات", credits: 3 }, { code: "ISYS201", name_en: "Systems Analysis and Design", name_ar: "تحليل وتصميم النظم", credits: 3 }, { code: "ISYS301", name_en: "Enterprise Resource Planning", name_ar: "تخطيط موارد المؤسسة", credits: 3 }, { code: "ISYS401", name_en: "Business Intelligence", name_ar: "ذكاء الأعمال", credits: 3 }] },
          { id: "QA-UDST-CIT-SE", name_ar: "قسم هندسة البرمجيات", name_en: "Department of Software Engineering", degrees: ["BSc"], courses: [{ code: "SENG101", name_en: "Programming Fundamentals", name_ar: "أساسيات البرمجة", credits: 3 }, { code: "SENG201", name_en: "Object-Oriented Programming", name_ar: "البرمجة كائنية التوجه", credits: 3 }, { code: "SENG202", name_en: "Software Design Patterns", name_ar: "أنماط تصميم البرمجيات", credits: 3 }, { code: "SENG301", name_en: "Software Testing", name_ar: "اختبار البرمجيات", credits: 3 }, { code: "SENG401", name_en: "Mobile App Development", name_ar: "تطوير تطبيقات الجوال", credits: 3 }] },
          { id: "QA-UDST-CIT-MEDIA", name_ar: "قسم الإعلام الرقمي", name_en: "Department of Digital Communication and Media", degrees: ["BSc"], courses: [{ code: "DCMP101", name_en: "Digital Media Fundamentals", name_ar: "أساسيات الإعلام الرقمي", credits: 3 }, { code: "DCMP201", name_en: "Media Production", name_ar: "الإنتاج الإعلامي", credits: 3 }, { code: "DCMP301", name_en: "Digital Storytelling", name_ar: "السرد الرقمي", credits: 3 }, { code: "DCMP401", name_en: "Social Media Strategy", name_ar: "استراتيجية وسائل التواصل الاجتماعي", credits: 3 }] },
        ],
      },
      {
        id: "QA-UDST-BUS",
        name_ar: "كلية الأعمال",
        name_en: "College of Business",
        departments: [
          { id: "QA-UDST-BUS-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["BSc","MBA"], courses: [{ code: "BUSN101", name_en: "Business Fundamentals", name_ar: "أساسيات الأعمال", credits: 3 }, { code: "BUSN201", name_en: "Accounting Principles", name_ar: "مبادئ المحاسبة", credits: 3 }, { code: "BUSN202", name_en: "Business Law", name_ar: "قانون الأعمال", credits: 3 }, { code: "BUSN301", name_en: "Operations Management", name_ar: "إدارة العمليات", credits: 3 }, { code: "BUSN401", name_en: "International Business", name_ar: "الأعمال الدولية", credits: 3 }] },
        ],
      },
      {
        id: "QA-UDST-HLTH",
        name_ar: "كلية العلوم الصحية",
        name_en: "College of Health Sciences",
        departments: [
          { id: "QA-UDST-HLTH-NURS", name_ar: "قسم التمريض", name_en: "Department of Nursing", degrees: ["BSc"], courses: [{ code: "NURS101", name_en: "Fundamentals of Nursing", name_ar: "أساسيات التمريض", credits: 3 }, { code: "NURS201", name_en: "Adult Health Nursing", name_ar: "تمريض صحة البالغين", credits: 4 }, { code: "NURS202", name_en: "Community Health Nursing", name_ar: "تمريض صحة المجتمع", credits: 3 }, { code: "NURS301", name_en: "Pediatric Nursing", name_ar: "تمريض الأطفال", credits: 4 }, { code: "NURS401", name_en: "Critical Care Nursing", name_ar: "تمريض الرعاية الحرجة", credits: 4 }] },
          { id: "QA-UDST-HLTH-ALLIED", name_ar: "قسم العلوم الصحية المساندة", name_en: "Department of Allied Health Sciences", degrees: ["BSc"], courses: [{ code: "ALHL101", name_en: "Medical Radiography Fundamentals", name_ar: "أساسيات التصوير الإشعاعي الطبي", credits: 3 }, { code: "ALHL201", name_en: "Paramedicine", name_ar: "الطب الطوارئ", credits: 3 }, { code: "ALHL202", name_en: "Respiratory Therapy", name_ar: "العلاج التنفسي", credits: 3 }, { code: "ALHL301", name_en: "Pharmacy Technology", name_ar: "تقنية الصيدلة", credits: 3 }, { code: "ALHL302", name_en: "Environmental Health", name_ar: "الصحة البيئية", credits: 3 }, { code: "ALHL303", name_en: "Occupational Health and Safety", name_ar: "الصحة والسلامة المهنية", credits: 3 }] },
          { id: "QA-UDST-HLTH-MIDWIFE", name_ar: "قسم القبالة", name_en: "Department of Midwifery", degrees: ["BSc"], courses: [{ code: "MIDW201", name_en: "Midwifery Practice I", name_ar: "ممارسة القبالة ١", credits: 4 }, { code: "MIDW202", name_en: "Antenatal Care", name_ar: "رعاية ما قبل الولادة", credits: 3 }, { code: "MIDW301", name_en: "Intrapartum Care", name_ar: "رعاية أثناء الولادة", credits: 4 }, { code: "MIDW401", name_en: "Postnatal Care", name_ar: "رعاية ما بعد الولادة", credits: 3 }] },
        ],
      },
    ],
  },
  {
    id: "QA-HBKU",
    name_ar: "جامعة حمد بن خليفة",
    name_en: "Hamad Bin Khalifa University",
    website: "https://www.hbku.edu.qa",
    type: "public",
    founded: 2010,
    country_code: "QA",
    country_ar: "قطر",
    country_en: "Qatar",
    colleges: [
      {
        id: "QA-HBKU-CSE",
        name_ar: "كلية العلوم والهندسة",
        name_en: "College of Science and Engineering",
        departments: [
          { id: "QA-HBKU-CSE-CHEME", name_ar: "قسم الهندسة الكيميائية", name_en: "Department of Chemical Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "HCHE201", name_en: "Chemical Process Fundamentals", name_ar: "أساسيات العمليات الكيميائية", credits: 3 }, { code: "HCHE301", name_en: "Reaction Engineering", name_ar: "هندسة التفاعلات", credits: 3 }, { code: "HCHE302", name_en: "Separation Processes", name_ar: "عمليات الفصل", credits: 3 }, { code: "HCHE401", name_en: "Sustainable Chemical Engineering", name_ar: "الهندسة الكيميائية المستدامة", credits: 3 }] },
          { id: "QA-HBKU-CSE-ELECE", name_ar: "قسم الهندسة الكهربائية", name_en: "Department of Electrical Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "HELE201", name_en: "Digital Systems", name_ar: "الأنظمة الرقمية", credits: 3 }, { code: "HELE301", name_en: "Communications Engineering", name_ar: "هندسة الاتصالات", credits: 3 }, { code: "HELE302", name_en: "VLSI Design", name_ar: "تصميم الدوائر المتكاملة", credits: 3 }, { code: "HELE401", name_en: "Embedded Systems", name_ar: "الأنظمة المدمجة", credits: 3 }] },
          { id: "QA-HBKU-CSE-MECHE", name_ar: "قسم الهندسة الميكانيكية", name_en: "Department of Mechanical Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "HMEC201", name_en: "Engineering Mechanics", name_ar: "الميكانيكا الهندسية", credits: 3 }, { code: "HMEC301", name_en: "Advanced Thermodynamics", name_ar: "الديناميكا الحرارية المتقدمة", credits: 3 }, { code: "HMEC302", name_en: "Computational Fluid Dynamics", name_ar: "ديناميكا الموائع الحاسوبية", credits: 3 }, { code: "HMEC401", name_en: "Advanced Manufacturing", name_ar: "التصنيع المتقدم", credits: 3 }] },
          { id: "QA-HBKU-CSE-CE", name_ar: "قسم هندسة الحاسب", name_en: "Department of Computer Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "HCEN201", name_en: "Computer Architecture", name_ar: "معمارية الحاسب", credits: 3 }, { code: "HCEN301", name_en: "Artificial Intelligence", name_ar: "الذكاء الاصطناعي", credits: 3 }, { code: "HCEN302", name_en: "Cybersecurity", name_ar: "الأمن السيبراني", credits: 3 }, { code: "HCEN401", name_en: "Machine Learning", name_ar: "التعلم الآلي", credits: 3 }] },
        ],
      },
      {
        id: "QA-HBKU-ISLM",
        name_ar: "كلية الدراسات الإسلامية",
        name_en: "College of Islamic Studies",
        departments: [
          { id: "QA-HBKU-ISLM-FINANCE", name_ar: "قسم التمويل الإسلامي", name_en: "Department of Islamic Finance", degrees: ["MA","PhD"], courses: [{ code: "ISFI201", name_en: "Foundations of Islamic Finance", name_ar: "أسس التمويل الإسلامي", credits: 3 }, { code: "ISFI301", name_en: "Islamic Banking", name_ar: "المصرفية الإسلامية", credits: 3 }, { code: "ISFI302", name_en: "Sukuk and Islamic Capital Markets", name_ar: "الصكوك وأسواق المال الإسلامية", credits: 3 }, { code: "ISFI401", name_en: "Islamic Microfinance", name_ar: "التمويل الإسلامي المتناهي الصغر", credits: 3 }] },
          { id: "QA-HBKU-ISLM-ETH", name_ar: "قسم الأخلاق والقيم الإسلامية", name_en: "Department of Islamic Ethics", degrees: ["MA","PhD"], courses: [{ code: "ISET201", name_en: "Islamic Ethics and Civilization", name_ar: "الأخلاق الإسلامية والحضارة", credits: 3 }, { code: "ISET301", name_en: "Bioethics in Islam", name_ar: "أخلاقيات الطب في الإسلام", credits: 3 }, { code: "ISET401", name_en: "Environmental Ethics in Islam", name_ar: "أخلاقيات البيئة في الإسلام", credits: 3 }] },
        ],
      },
      {
        id: "QA-HBKU-HSS",
        name_ar: "كلية العلوم الإنسانية والاجتماعية",
        name_en: "College of Humanities and Social Sciences",
        departments: [
          { id: "QA-HBKU-HSS-MEDIA", name_ar: "قسم الإعلام والاتصال", name_en: "Department of Media and Communication", degrees: ["MA","PhD"], courses: [{ code: "HMCD201", name_en: "Media Studies", name_ar: "دراسات إعلامية", credits: 3 }, { code: "HMCD301", name_en: "Digital Journalism", name_ar: "الصحافة الرقمية", credits: 3 }, { code: "HMCD302", name_en: "Communication Research Methods", name_ar: "مناهج بحث الاتصال", credits: 3 }, { code: "HMCD401", name_en: "Media Policy", name_ar: "سياسة الإعلام", credits: 3 }] },
          { id: "QA-HBKU-HSS-TRANS", name_ar: "قسم الترجمة والدراسات اللغوية", name_en: "Department of Translation and Language Studies", degrees: ["MA"], courses: [{ code: "HTLS201", name_en: "Translation Theory", name_ar: "نظرية الترجمة", credits: 3 }, { code: "HTLS202", name_en: "Arabic-English Translation", name_ar: "الترجمة العربية الإنجليزية", credits: 3 }, { code: "HTLS301", name_en: "Simultaneous Interpretation", name_ar: "الترجمة الفورية", credits: 3 }, { code: "HTLS401", name_en: "Localization and Technology", name_ar: "التوطين والتقنية", credits: 3 }] },
        ],
      },
      {
        id: "QA-HBKU-PP",
        name_ar: "كلية السياسات العامة",
        name_en: "College of Public Policy",
        departments: [
          { id: "QA-HBKU-PP-POLICY", name_ar: "قسم السياسات العامة", name_en: "Department of Public Policy", degrees: ["MPP","PhD"], courses: [{ code: "HPPL201", name_en: "Introduction to Public Policy", name_ar: "مقدمة في السياسة العامة", credits: 3 }, { code: "HPPL301", name_en: "Policy Analysis", name_ar: "تحليل السياسات", credits: 3 }, { code: "HPPL302", name_en: "Governance and Institutions", name_ar: "الحوكمة والمؤسسات", credits: 3 }, { code: "HPPL401", name_en: "Global Public Policy", name_ar: "السياسة العامة العالمية", credits: 3 }] },
        ],
      },
    ],
  },
  {
    id: "QA-LU",
    name_ar: "جامعة لوسيل",
    name_en: "Lusail University",
    website: "https://www.lu.edu.qa",
    type: "private",
    founded: 2019,
    country_code: "QA",
    country_ar: "قطر",
    country_en: "Qatar",
    colleges: [
      {
        id: "QA-LU-LAW",
        name_ar: "كلية القانون",
        name_en: "College of Law",
        departments: [
          { id: "QA-LU-LAW-MAIN", name_ar: "قسم القانون", name_en: "Department of Law", degrees: ["LLB","LLM"], courses: [{ code: "LULAW100", name_en: "Foundations of Law", name_ar: "أسس القانون", credits: 3 }, { code: "LULAW201", name_en: "Civil Law", name_ar: "القانون المدني", credits: 3 }, { code: "LULAW202", name_en: "Commercial Law", name_ar: "القانون التجاري", credits: 3 }, { code: "LULAW301", name_en: "Constitutional Law", name_ar: "القانون الدستوري", credits: 3 }, { code: "LULAW401", name_en: "International Law", name_ar: "القانون الدولي", credits: 3 }] },
        ],
      },
      {
        id: "QA-LU-BUS",
        name_ar: "كلية التجارة والأعمال",
        name_en: "College of Commerce and Business",
        departments: [
          { id: "QA-LU-BUS-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["BSc","MBA"], courses: [{ code: "LUBS101", name_en: "Business Fundamentals", name_ar: "أساسيات الأعمال", credits: 3 }, { code: "LUBS201", name_en: "Financial Accounting", name_ar: "المحاسبة المالية", credits: 3 }, { code: "LUBS202", name_en: "Marketing Management", name_ar: "إدارة التسويق", credits: 3 }, { code: "LUBS301", name_en: "Human Resource Management", name_ar: "إدارة الموارد البشرية", credits: 3 }, { code: "LUBS401", name_en: "Strategic Management", name_ar: "الإدارة الاستراتيجية", credits: 3 }] },
        ],
      },
      {
        id: "QA-LU-EDU",
        name_ar: "كلية التعليم والفنون",
        name_en: "College of Education and Arts",
        departments: [
          { id: "QA-LU-EDU-EDUC", name_ar: "قسم التربية", name_en: "Department of Education", degrees: ["BA","MEd"], courses: [{ code: "LUED101", name_en: "Educational Foundations", name_ar: "أسس التعليم", credits: 3 }, { code: "LUED201", name_en: "Teaching Methods", name_ar: "طرق التدريس", credits: 3 }, { code: "LUED301", name_en: "Classroom Management", name_ar: "إدارة الصف", credits: 3 }, { code: "LUED401", name_en: "Educational Leadership", name_ar: "القيادة التربوية", credits: 3 }] },
        ],
      },
      {
        id: "QA-LU-IT",
        name_ar: "كلية تقنية المعلومات",
        name_en: "College of Information Technology",
        departments: [
          { id: "QA-LU-IT-CS", name_ar: "قسم علوم الحاسب", name_en: "Department of Computer Science", degrees: ["BSc"], courses: [{ code: "LUIT101", name_en: "Introduction to Computing", name_ar: "مقدمة في الحوسبة", credits: 3 }, { code: "LUIT201", name_en: "Programming and Algorithms", name_ar: "البرمجة والخوارزميات", credits: 3 }, { code: "LUIT202", name_en: "Database Design", name_ar: "تصميم قواعد البيانات", credits: 3 }, { code: "LUIT301", name_en: "Network Security", name_ar: "أمن الشبكات", credits: 3 }, { code: "LUIT401", name_en: "Artificial Intelligence Applications", name_ar: "تطبيقات الذكاء الاصطناعي", credits: 3 }] },
        ],
      },
    ],
  },
  {
    id: "QA-CCQ",
    name_ar: "كلية قطر المجتمعية",
    name_en: "Community College of Qatar",
    website: "https://www.community.edu.qa",
    type: "public",
    founded: 2010,
    country_code: "QA",
    country_ar: "قطر",
    country_en: "Qatar",
    colleges: [
      {
        id: "QA-CCQ-ARTS",
        name_ar: "برامج الآداب والعلوم",
        name_en: "Arts and Sciences Programs",
        departments: [
          { id: "QA-CCQ-ARTS-LIB", name_ar: "قسم الآداب العامة", name_en: "Department of Liberal Arts", degrees: ["AA"], courses: [{ code: "CCLA101", name_en: "English Composition I", name_ar: "التعبير الإنجليزي ١", credits: 3 }, { code: "CCLA102", name_en: "English Composition II", name_ar: "التعبير الإنجليزي ٢", credits: 3 }, { code: "CCLA201", name_en: "Introduction to Social Sciences", name_ar: "مقدمة في العلوم الاجتماعية", credits: 3 }, { code: "CCLA202", name_en: "World Civilizations", name_ar: "الحضارات العالمية", credits: 3 }] },
          { id: "QA-CCQ-ARTS-ECE", name_ar: "قسم تعليم الطفولة المبكرة", name_en: "Department of Early Childhood Education", degrees: ["AA"], courses: [{ code: "CCECE101", name_en: "Child Development", name_ar: "نمو الطفل", credits: 3 }, { code: "CCECE201", name_en: "Early Childhood Curriculum", name_ar: "مناهج الطفولة المبكرة", credits: 3 }, { code: "CCECE202", name_en: "Family and Community Relations", name_ar: "العلاقات الأسرية والمجتمعية", credits: 3 }, { code: "CCECE301", name_en: "Practicum in Early Childhood", name_ar: "التدريب العملي في الطفولة المبكرة", credits: 3 }] },
        ],
      },
      {
        id: "QA-CCQ-BUS",
        name_ar: "برامج الأعمال",
        name_en: "Business Programs",
        departments: [
          { id: "QA-CCQ-BUS-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["AA"], courses: [{ code: "CCBA101", name_en: "Introduction to Business", name_ar: "مقدمة في الأعمال", credits: 3 }, { code: "CCBA201", name_en: "Principles of Accounting", name_ar: "Principles of Accounting", credits: 3 }, { code: "CCBA202", name_en: "Business Communication", name_ar: "الاتصال التجاري", credits: 3 }, { code: "CCBA301", name_en: "Marketing Fundamentals", name_ar: "أساسيات التسويق", credits: 3 }] },
        ],
      },
    ],
  },
  {
    id: "QA-CMUQ",
    name_ar: "جامعة كارنيغي ميلون في قطر",
    name_en: "Carnegie Mellon University in Qatar",
    website: "https://www.qatar.cmu.edu",
    type: "private",
    founded: 2004,
    country_code: "QA",
    country_ar: "قطر",
    country_en: "Qatar",
    colleges: [
      {
        id: "QA-CMUQ-SCS",
        name_ar: "مدرسة علوم الحاسب",
        name_en: "School of Computer Science",
        departments: [
          { id: "QA-CMUQ-SCS-CS", name_ar: "قسم علوم الحاسب", name_en: "Department of Computer Science", degrees: ["BSc"], courses: [{ code: "15110", name_en: "Principles of Computing", name_ar: "مبادئ الحوسبة", credits: 9 }, { code: "15122", name_en: "Principles of Imperative Computation", name_ar: "مبادئ الحوسبة الأمرية", credits: 10 }, { code: "15150", name_en: "Functional Programming", name_ar: "البرمجة الوظيفية", credits: 10 }, { code: "15210", name_en: "Parallel and Sequential Data Structures", name_ar: "هياكل البيانات المتوازية والمتسلسلة", credits: 12 }, { code: "15440", name_en: "Distributed Systems", name_ar: "الأنظمة الموزعة", credits: 12 }] },
          { id: "QA-CMUQ-SCS-AI", name_ar: "قسم الذكاء الاصطناعي", name_en: "Department of Artificial Intelligence", degrees: ["BSc"], courses: [{ code: "10315", name_en: "Introduction to Machine Learning", name_ar: "مقدمة في التعلم الآلي", credits: 12 }, { code: "10417", name_en: "Intermediate Deep Learning", name_ar: "التعلم العميق المتوسط", credits: 12 }, { code: "10423", name_en: "Generative AI", name_ar: "الذكاء الاصطناعي التوليدي", credits: 12 }, { code: "15381", name_en: "Artificial Intelligence", name_ar: "الذكاء الاصطناعي", credits: 9 }] },
        ],
      },
      {
        id: "QA-CMUQ-TEPPER",
        name_ar: "مدرسة تيبر لإدارة الأعمال",
        name_en: "Tepper School of Business",
        departments: [
          { id: "QA-CMUQ-TEPPER-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["BSc"], courses: [{ code: "70100", name_en: "Business Communication", name_ar: "الاتصال التجاري", credits: 9 }, { code: "70311", name_en: "Organizational Behavior", name_ar: "السلوك التنظيمي", credits: 9 }, { code: "73230", name_en: "Financial Accounting", name_ar: "المحاسبة المالية", credits: 9 }, { code: "73330", name_en: "Corporate Finance", name_ar: "تمويل الشركات", credits: 9 }] },
        ],
      },
      {
        id: "QA-CMUQ-BXA",
        name_ar: "قسم علم الأحياء",
        name_en: "Department of Biological Sciences",
        departments: [
          { id: "QA-CMUQ-BXA-BIO", name_ar: "علم الأحياء", name_en: "Biological Sciences", degrees: ["BSc"], courses: [{ code: "03121", name_en: "Modern Biology I", name_ar: "الأحياء الحديثة ١", credits: 9 }, { code: "03122", name_en: "Modern Biology II", name_ar: "الأحياء الحديثة ٢", credits: 9 }, { code: "03230", name_en: "Cellular Neuroscience", name_ar: "علم الأعصاب الخلوي", credits: 9 }, { code: "03310", name_en: "Biochemistry", name_ar: "الكيمياء الحيوية", credits: 9 }] },
        ],
      },
      {
        id: "QA-CMUQ-IS",
        name_ar: "قسم نظم المعلومات",
        name_en: "Department of Information Systems",
        departments: [
          { id: "QA-CMUQ-IS-IS", name_ar: "نظم المعلومات", name_en: "Information Systems", degrees: ["BSc"], courses: [{ code: "67262", name_en: "Database Design and Development", name_ar: "تصميم وتطوير قواعد البيانات", credits: 12 }, { code: "67364", name_en: "IS Strategy and Management", name_ar: "استراتيجية وإدارة نظم المعلومات", credits: 9 }, { code: "67373", name_en: "Agile Methods", name_ar: "المنهجيات الرشيقة", credits: 9 }, { code: "67442", name_en: "Design of AI-Powered Products", name_ar: "تصميم المنتجات المدعومة بالذكاء الاصطناعي", credits: 12 }] },
        ],
      },
    ],
  },
  {
    id: "QA-GUQ",
    name_ar: "جامعة جورجتاون في قطر",
    name_en: "Georgetown University in Qatar",
    website: "https://guq.qatar.georgetown.edu",
    type: "private",
    founded: 2005,
    country_code: "QA",
    country_ar: "قطر",
    country_en: "Qatar",
    colleges: [
      {
        id: "QA-GUQ-SFS",
        name_ar: "مدرسة الشؤون الخارجية",
        name_en: "School of Foreign Service",
        departments: [
          { id: "QA-GUQ-SFS-CULT", name_ar: "قسم الثقافة والسياسة", name_en: "Department of Culture and Politics", degrees: ["BSFS"], courses: [{ code: "CULT101", name_en: "Introduction to Cultural Theory", name_ar: "مقدمة في النظرية الثقافية", credits: 3 }, { code: "CULT201", name_en: "Politics and Culture in the Middle East", name_ar: "السياسة والثقافة في الشرق الأوسط", credits: 3 }, { code: "CULT301", name_en: "Religion and Global Politics", name_ar: "الدين والسياسة العالمية", credits: 3 }] },
          { id: "QA-GUQ-SFS-IPES", name_ar: "قسم الاقتصاد السياسي الدولي", name_en: "Department of International Political Economy", degrees: ["BSFS"], courses: [{ code: "IPES101", name_en: "Principles of Economics", name_ar: "مبادئ الاقتصاد", credits: 3 }, { code: "IPES201", name_en: "International Political Economy", name_ar: "الاقتصاد السياسي الدولي", credits: 3 }, { code: "IPES301", name_en: "Development Economics", name_ar: "اقتصاديات التنمية", credits: 3 }, { code: "IPES401", name_en: "Global Trade and Finance", name_ar: "التجارة والتمويل العالمي", credits: 3 }] },
          { id: "QA-GUQ-SFS-IR", name_ar: "قسم العلاقات الدولية", name_en: "Department of International Relations", degrees: ["BSFS"], courses: [{ code: "INRE101", name_en: "Theories of International Relations", name_ar: "نظريات العلاقات الدولية", credits: 3 }, { code: "INRE201", name_en: "Middle East Politics", name_ar: "سياسة الشرق الأوسط", credits: 3 }, { code: "INRE301", name_en: "Security Studies", name_ar: "الدراسات الأمنية", credits: 3 }, { code: "INRE401", name_en: "Diplomacy and Negotiation", name_ar: "الدبلوماسية والتفاوض", credits: 3 }] },
          { id: "QA-GUQ-SFS-SS", name_ar: "قسم العلوم الاجتماعية", name_en: "Department of Science, Technology and International Affairs", degrees: ["BSFS"], courses: [{ code: "STIA101", name_en: "Science, Technology and Society", name_ar: "العلم والتقنية والمجتمع", credits: 3 }, { code: "STIA201", name_en: "Energy Policy", name_ar: "سياسة الطاقة", credits: 3 }, { code: "STIA301", name_en: "Cybersecurity Policy", name_ar: "سياسة الأمن السيبراني", credits: 3 }] },
        ],
      },
    ],
  },
  {
    id: "QA-NUQ",
    name_ar: "جامعة نورث وسترن في قطر",
    name_en: "Northwestern University in Qatar",
    website: "https://www.qatar.northwestern.edu",
    type: "private",
    founded: 2008,
    country_code: "QA",
    country_ar: "قطر",
    country_en: "Qatar",
    colleges: [
      {
        id: "QA-NUQ-MEDILL",
        name_ar: "مدرسة ميديل للصحافة",
        name_en: "Medill School of Journalism",
        departments: [
          { id: "QA-NUQ-MEDILL-JOUR", name_ar: "قسم الصحافة", name_en: "Department of Journalism", degrees: ["BSJ"], courses: [{ code: "JOUR101", name_en: "Introduction to Journalism", name_ar: "مقدمة في الصحافة", credits: 4 }, { code: "JOUR201", name_en: "Reporting and Writing", name_ar: "التقارير والكتابة", credits: 4 }, { code: "JOUR202", name_en: "Multimedia Storytelling", name_ar: "السرد متعدد الوسائط", credits: 4 }, { code: "JOUR301", name_en: "Investigative Journalism", name_ar: "الصحافة الاستقصائية", credits: 4 }, { code: "JOUR401", name_en: "Data Journalism", name_ar: "صحافة البيانات", credits: 4 }] },
        ],
      },
      {
        id: "QA-NUQ-COMM",
        name_ar: "مدرسة الاتصال",
        name_en: "School of Communication",
        departments: [
          { id: "QA-NUQ-COMM-COMMST", name_ar: "قسم الاتصال", name_en: "Department of Communication Studies", degrees: ["BSC"], courses: [{ code: "COMM101", name_en: "Introduction to Communication", name_ar: "مقدمة في الاتصال", credits: 4 }, { code: "COMM201", name_en: "Media and Society", name_ar: "الإعلام والمجتمع", credits: 4 }, { code: "COMM202", name_en: "Digital Media Production", name_ar: "إنتاج الإعلام الرقمي", credits: 4 }, { code: "COMM301", name_en: "Strategic Communication", name_ar: "الاتصال الاستراتيجي", credits: 4 }] },
        ],
      },
    ],
  },
  {
    id: "QA-VCUQ",
    name_ar: "جامعة فيرجينيا كومنولث للفنون في قطر",
    name_en: "VCUarts Qatar",
    website: "https://qatar.vcu.edu",
    type: "private",
    founded: 1998,
    country_code: "QA",
    country_ar: "قطر",
    country_en: "Qatar",
    colleges: [
      {
        id: "QA-VCUQ-ART",
        name_ar: "كلية الفنون والتصميم",
        name_en: "College of Art and Design",
        departments: [
          { id: "QA-VCUQ-ART-GD", name_ar: "قسم التصميم الجرافيكي", name_en: "Department of Graphic Design", degrees: ["BFA"], courses: [{ code: "GRDS101", name_en: "Foundation Design I", name_ar: "أسس التصميم ١", credits: 3 }, { code: "GRDS201", name_en: "Typography", name_ar: "فن الطباعة", credits: 3 }, { code: "GRDS202", name_en: "Visual Communication", name_ar: "الاتصال البصري", credits: 3 }, { code: "GRDS301", name_en: "Brand Identity", name_ar: "الهوية البصرية", credits: 3 }, { code: "GRDS401", name_en: "Motion Graphics", name_ar: "الرسوم المتحركة", credits: 3 }] },
          { id: "QA-VCUQ-ART-FD", name_ar: "قسم تصميم الأزياء", name_en: "Department of Fashion Design", degrees: ["BFA"], courses: [{ code: "FASD101", name_en: "Fashion Drawing", name_ar: "رسم الأزياء", credits: 3 }, { code: "FASD201", name_en: "Pattern Making", name_ar: "صنع الباترونات", credits: 3 }, { code: "FASD202", name_en: "Fashion History", name_ar: "تاريخ الأزياء", credits: 3 }, { code: "FASD301", name_en: "Textile Design", name_ar: "تصميم المنسوجات", credits: 3 }, { code: "FASD401", name_en: "Collection Development", name_ar: "تطوير المجموعات", credits: 3 }] },
          { id: "QA-VCUQ-ART-ID", name_ar: "قسم التصميم الداخلي", name_en: "Department of Interior Design", degrees: ["BFA"], courses: [{ code: "INTD101", name_en: "Design Fundamentals", name_ar: "أساسيات التصميم", credits: 3 }, { code: "INTD201", name_en: "Interior Architecture", name_ar: "العمارة الداخلية", credits: 3 }, { code: "INTD202", name_en: "Lighting Design", name_ar: "تصميم الإضاءة", credits: 3 }, { code: "INTD301", name_en: "Space Planning", name_ar: "تخطيط المساحات", credits: 3 }, { code: "INTD401", name_en: "Sustainable Interior Design", name_ar: "التصميم الداخلي المستدام", credits: 3 }] },
          { id: "QA-VCUQ-ART-FILM", name_ar: "قسم الأفلام والصور المتحركة", name_en: "Department of Film and Animation", degrees: ["BFA"], courses: [{ code: "FILM101", name_en: "Introduction to Film", name_ar: "مقدمة في السينما", credits: 3 }, { code: "FILM201", name_en: "Cinematography", name_ar: "التصوير السينمائي", credits: 3 }, { code: "FILM202", name_en: "3D Animation", name_ar: "الرسوم ثلاثية الأبعاد", credits: 3 }, { code: "FILM301", name_en: "Film Editing", name_ar: "مونتاج الأفلام", credits: 3 }, { code: "FILM401", name_en: "Documentary Filmmaking", name_ar: "صناعة الأفلام الوثائقية", credits: 3 }] },
          { id: "QA-VCUQ-ART-PAINT", name_ar: "قسم الفنون الجميلة", name_en: "Department of Painting and Printmaking", degrees: ["BFA"], courses: [{ code: "PAIN101", name_en: "Drawing I", name_ar: "الرسم ١", credits: 3 }, { code: "PAIN201", name_en: "Painting I", name_ar: "الرسم الزيتي ١", credits: 3 }, { code: "PAIN202", name_en: "Printmaking", name_ar: "فن الطباعة والحفر", credits: 3 }, { code: "PAIN301", name_en: "Contemporary Art Practice", name_ar: "ممارسة الفن المعاصر", credits: 3 }] },
        ],
      },
    ],
  },
  {
    id: "QA-WCMQ",
    name_ar: "كلية وايل كورنيل للطب في قطر",
    name_en: "Weill Cornell Medicine-Qatar",
    website: "https://qatar-weill.cornell.edu",
    type: "private",
    founded: 2001,
    country_code: "QA",
    country_ar: "قطر",
    country_en: "Qatar",
    colleges: [
      {
        id: "QA-WCMQ-MED",
        name_ar: "برنامج الطب",
        name_en: "Medicine Program",
        departments: [
          { id: "QA-WCMQ-MED-PRE", name_ar: "المرحلة التمهيدية للطب", name_en: "Pre-Medical Sciences", degrees: ["MD"], courses: [{ code: "WCBI101", name_en: "Biology for Medicine I", name_ar: "الأحياء للطب ١", credits: 4 }, { code: "WCBI102", name_en: "Biology for Medicine II", name_ar: "الأحياء للطب ٢", credits: 4 }, { code: "WCCH101", name_en: "Chemistry for Medicine", name_ar: "الكيمياء للطب", credits: 4 }, { code: "WCPH101", name_en: "Physics for Medicine", name_ar: "الفيزياء للطب", credits: 3 }] },
          { id: "QA-WCMQ-MED-CLIN", name_ar: "الطب السريري", name_en: "Clinical Medicine", degrees: ["MD"], courses: [{ code: "WCMD301", name_en: "Internal Medicine Clerkship", name_ar: "التدريب السريري في الطب الباطني", credits: 6 }, { code: "WCMD302", name_en: "Surgery Clerkship", name_ar: "التدريب السريري في الجراحة", credits: 6 }, { code: "WCMD303", name_en: "Pediatrics Clerkship", name_ar: "التدريب السريري في طب الأطفال", credits: 4 }, { code: "WCMD304", name_en: "Psychiatry Clerkship", name_ar: "التدريب السريري في الطب النفسي", credits: 3 }, { code: "WCMD401", name_en: "Family Medicine", name_ar: "طب الأسرة", credits: 4 }] },
        ],
      },
    ],
  },
];
