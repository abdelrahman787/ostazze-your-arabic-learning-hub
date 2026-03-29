export interface Course {
  code: string;
  name_en: string;
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
          { id: "KW-KU-ARTS-ARABIC", name_ar: "قسم اللغة العربية وآدابها", name_en: "Department of Arabic Language and Literature", degrees: ["BA"], courses: [{ code: "ARAB101", name_en: "Introduction to Arabic Literature", credits: 3 }, { code: "ARAB102", name_en: "Arabic Grammar I", credits: 3 }, { code: "ARAB201", name_en: "Classical Arabic Poetry", credits: 3 }, { code: "ARAB202", name_en: "Arabic Morphology", credits: 3 }, { code: "ARAB301", name_en: "Modern Arabic Literature", credits: 3 }, { code: "ARAB302", name_en: "Arabic Rhetoric", credits: 3 }, { code: "ARAB401", name_en: "Research Methods in Arabic", credits: 3 }] },
          { id: "KW-KU-ARTS-ENGLISH", name_ar: "قسم اللغة الإنجليزية وآدابها", name_en: "Department of English Language and Literature", degrees: ["BA"], courses: [{ code: "ENGL101", name_en: "Introduction to Literature", credits: 3 }, { code: "ENGL102", name_en: "Academic Writing", credits: 3 }, { code: "ENGL201", name_en: "British Literature I", credits: 3 }, { code: "ENGL202", name_en: "American Literature I", credits: 3 }, { code: "ENGL301", name_en: "Linguistics", credits: 3 }, { code: "ENGL302", name_en: "Modern Poetry", credits: 3 }, { code: "ENGL401", name_en: "Postcolonial Literature", credits: 3 }] },
          { id: "KW-KU-ARTS-HIST", name_ar: "قسم التاريخ", name_en: "Department of History", degrees: ["BA"], courses: [{ code: "HIST101", name_en: "Ancient History", credits: 3 }, { code: "HIST102", name_en: "Islamic History", credits: 3 }, { code: "HIST201", name_en: "Modern World History", credits: 3 }, { code: "HIST202", name_en: "History of the Arabian Peninsula", credits: 3 }, { code: "HIST301", name_en: "History of Kuwait", credits: 3 }, { code: "HIST401", name_en: "Historical Research Methods", credits: 3 }] },
          { id: "KW-KU-ARTS-PHIL", name_ar: "قسم الفلسفة", name_en: "Department of Philosophy", degrees: ["BA"], courses: [{ code: "PHIL101", name_en: "Introduction to Philosophy", credits: 3 }, { code: "PHIL201", name_en: "Logic", credits: 3 }, { code: "PHIL202", name_en: "Ethics", credits: 3 }, { code: "PHIL301", name_en: "Philosophy of Science", credits: 3 }, { code: "PHIL401", name_en: "Contemporary Philosophy", credits: 3 }] },
          { id: "KW-KU-ARTS-GEO", name_ar: "قسم الجغرافيا", name_en: "Department of Geography", degrees: ["BA"], courses: [{ code: "GEOG101", name_en: "Physical Geography", credits: 3 }, { code: "GEOG102", name_en: "Human Geography", credits: 3 }, { code: "GEOG201", name_en: "Regional Geography of the Middle East", credits: 3 }, { code: "GEOG202", name_en: "Cartography and GIS", credits: 3 }, { code: "GEOG301", name_en: "Urban Geography", credits: 3 }, { code: "GEOG401", name_en: "Environmental Geography", credits: 3 }] },
          { id: "KW-KU-ARTS-SOC", name_ar: "قسم علم الاجتماع", name_en: "Department of Sociology and Social Work", degrees: ["BA"], courses: [{ code: "SOC101", name_en: "Introduction to Sociology", credits: 3 }, { code: "SOC102", name_en: "Social Research Methods", credits: 3 }, { code: "SOC201", name_en: "Social Theory", credits: 3 }, { code: "SOC202", name_en: "Family and Society", credits: 3 }, { code: "SOC301", name_en: "Sociology of Development", credits: 3 }, { code: "SOC401", name_en: "Sociology of Gulf Societies", credits: 3 }] },
          { id: "KW-KU-ARTS-PSYCH", name_ar: "قسم علم النفس", name_en: "Department of Psychology", degrees: ["BA"], courses: [{ code: "PSYC101", name_en: "General Psychology", credits: 3 }, { code: "PSYC102", name_en: "Developmental Psychology", credits: 3 }, { code: "PSYC201", name_en: "Social Psychology", credits: 3 }, { code: "PSYC202", name_en: "Abnormal Psychology", credits: 3 }, { code: "PSYC301", name_en: "Cognitive Psychology", credits: 3 }, { code: "PSYC401", name_en: "Psychological Testing", credits: 3 }] },
          { id: "KW-KU-ARTS-INFO", name_ar: "قسم المعلومات والمكتبات", name_en: "Department of Library and Information Science", degrees: ["BA"], courses: [{ code: "LIS101", name_en: "Introduction to Library Science", credits: 3 }, { code: "LIS201", name_en: "Information Organization", credits: 3 }, { code: "LIS202", name_en: "Reference Services", credits: 3 }, { code: "LIS301", name_en: "Digital Libraries", credits: 3 }, { code: "LIS401", name_en: "Knowledge Management", credits: 3 }] },
          { id: "KW-KU-ARTS-MASS", name_ar: "قسم الإعلام", name_en: "Department of Mass Communication", degrees: ["BA"], courses: [{ code: "MCOM101", name_en: "Introduction to Mass Communication", credits: 3 }, { code: "MCOM201", name_en: "Journalism", credits: 3 }, { code: "MCOM202", name_en: "Public Relations", credits: 3 }, { code: "MCOM301", name_en: "Broadcast Media", credits: 3 }, { code: "MCOM302", name_en: "Digital Media", credits: 3 }, { code: "MCOM401", name_en: "Media Research Methods", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-SCI",
        name_ar: "كلية العلوم",
        name_en: "College of Science",
        departments: [
          { id: "KW-KU-SCI-MATH", name_ar: "قسم الرياضيات", name_en: "Department of Mathematics", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "MATH101", name_en: "Calculus I", credits: 3 }, { code: "MATH102", name_en: "Calculus II", credits: 3 }, { code: "MATH201", name_en: "Linear Algebra", credits: 3 }, { code: "MATH202", name_en: "Differential Equations", credits: 3 }, { code: "MATH301", name_en: "Real Analysis", credits: 3 }, { code: "MATH302", name_en: "Abstract Algebra", credits: 3 }, { code: "MATH401", name_en: "Numerical Analysis", credits: 3 }, { code: "MATH402", name_en: "Topology", credits: 3 }] },
          { id: "KW-KU-SCI-PHYS", name_ar: "قسم الفيزياء", name_en: "Department of Physics", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "PHYS101", name_en: "General Physics I", credits: 3 }, { code: "PHYS102", name_en: "General Physics II", credits: 3 }, { code: "PHYS201", name_en: "Classical Mechanics", credits: 3 }, { code: "PHYS202", name_en: "Electromagnetism", credits: 3 }, { code: "PHYS301", name_en: "Quantum Mechanics", credits: 3 }, { code: "PHYS302", name_en: "Thermodynamics", credits: 3 }, { code: "PHYS401", name_en: "Nuclear Physics", credits: 3 }, { code: "PHYS402", name_en: "Solid State Physics", credits: 3 }] },
          { id: "KW-KU-SCI-CHEM", name_ar: "قسم الكيمياء", name_en: "Department of Chemistry", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "CHEM101", name_en: "General Chemistry I", credits: 3 }, { code: "CHEM102", name_en: "General Chemistry II", credits: 3 }, { code: "CHEM201", name_en: "Organic Chemistry I", credits: 3 }, { code: "CHEM202", name_en: "Analytical Chemistry", credits: 3 }, { code: "CHEM301", name_en: "Physical Chemistry", credits: 3 }, { code: "CHEM302", name_en: "Inorganic Chemistry", credits: 3 }, { code: "CHEM401", name_en: "Biochemistry", credits: 3 }, { code: "CHEM402", name_en: "Industrial Chemistry", credits: 3 }] },
          { id: "KW-KU-SCI-BIO", name_ar: "قسم علم الحياة", name_en: "Department of Biological Sciences", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "BIOL101", name_en: "General Biology I", credits: 3 }, { code: "BIOL102", name_en: "General Biology II", credits: 3 }, { code: "BIOL201", name_en: "Cell Biology", credits: 3 }, { code: "BIOL202", name_en: "Genetics", credits: 3 }, { code: "BIOL301", name_en: "Ecology", credits: 3 }, { code: "BIOL302", name_en: "Microbiology", credits: 3 }, { code: "BIOL401", name_en: "Molecular Biology", credits: 3 }, { code: "BIOL402", name_en: "Biotechnology", credits: 3 }] },
          { id: "KW-KU-SCI-STAT", name_ar: "قسم الإحصاء والبحوث", name_en: "Department of Statistics and Operations Research", degrees: ["BSc", "MSc"], courses: [{ code: "STAT101", name_en: "Introduction to Statistics", credits: 3 }, { code: "STAT201", name_en: "Probability Theory", credits: 3 }, { code: "STAT202", name_en: "Statistical Inference", credits: 3 }, { code: "STAT301", name_en: "Regression Analysis", credits: 3 }, { code: "STAT302", name_en: "Operations Research", credits: 3 }, { code: "STAT401", name_en: "Multivariate Analysis", credits: 3 }] },
          { id: "KW-KU-SCI-CS", name_ar: "قسم علوم الحاسب", name_en: "Department of Computer Science", degrees: ["BSc", "MSc"], courses: [{ code: "CS101", name_en: "Introduction to Programming", credits: 3 }, { code: "CS102", name_en: "Data Structures", credits: 3 }, { code: "CS201", name_en: "Algorithms", credits: 3 }, { code: "CS202", name_en: "Database Systems", credits: 3 }, { code: "CS301", name_en: "Operating Systems", credits: 3 }, { code: "CS302", name_en: "Computer Networks", credits: 3 }, { code: "CS401", name_en: "Artificial Intelligence", credits: 3 }, { code: "CS402", name_en: "Software Engineering", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-ENG",
        name_ar: "كلية الهندسة والبترول",
        name_en: "College of Engineering and Petroleum",
        departments: [
          { id: "KW-KU-ENG-CIVIL", name_ar: "قسم الهندسة المدنية", name_en: "Department of Civil Engineering", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "CIVL101", name_en: "Engineering Drawing", credits: 2 }, { code: "CIVL201", name_en: "Statics", credits: 3 }, { code: "CIVL202", name_en: "Mechanics of Materials", credits: 3 }, { code: "CIVL301", name_en: "Structural Analysis", credits: 3 }, { code: "CIVL302", name_en: "Fluid Mechanics", credits: 3 }, { code: "CIVL303", name_en: "Soil Mechanics", credits: 3 }, { code: "CIVL401", name_en: "Foundation Engineering", credits: 3 }, { code: "CIVL402", name_en: "Transportation Engineering", credits: 3 }] },
          { id: "KW-KU-ENG-MECH", name_ar: "قسم الهندسة الميكانيكية", name_en: "Department of Mechanical Engineering", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "MECH201", name_en: "Engineering Thermodynamics", credits: 3 }, { code: "MECH202", name_en: "Dynamics", credits: 3 }, { code: "MECH301", name_en: "Fluid Mechanics", credits: 3 }, { code: "MECH302", name_en: "Heat Transfer", credits: 3 }, { code: "MECH303", name_en: "Machine Design", credits: 3 }, { code: "MECH401", name_en: "Manufacturing Processes", credits: 3 }, { code: "MECH402", name_en: "Control Systems", credits: 3 }] },
          { id: "KW-KU-ENG-ELEC", name_ar: "قسم الهندسة الكهربائية", name_en: "Department of Electrical Engineering", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "ELEE201", name_en: "Circuit Analysis I", credits: 3 }, { code: "ELEE202", name_en: "Circuit Analysis II", credits: 3 }, { code: "ELEE301", name_en: "Electronics I", credits: 3 }, { code: "ELEE302", name_en: "Signals and Systems", credits: 3 }, { code: "ELEE303", name_en: "Electromagnetic Fields", credits: 3 }, { code: "ELEE401", name_en: "Power Systems", credits: 3 }, { code: "ELEE402", name_en: "Digital Communications", credits: 3 }] },
          { id: "KW-KU-ENG-CHEM", name_ar: "قسم الهندسة الكيميائية", name_en: "Department of Chemical Engineering", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "CHEN201", name_en: "Material and Energy Balances", credits: 3 }, { code: "CHEN202", name_en: "Thermodynamics I", credits: 3 }, { code: "CHEN301", name_en: "Transport Phenomena", credits: 3 }, { code: "CHEN302", name_en: "Chemical Reaction Engineering", credits: 3 }, { code: "CHEN401", name_en: "Process Design", credits: 3 }, { code: "CHEN402", name_en: "Petroleum Refining", credits: 3 }] },
          { id: "KW-KU-ENG-PETRO", name_ar: "قسم هندسة البترول", name_en: "Department of Petroleum Engineering", degrees: ["BSc", "MSc", "PhD"], courses: [{ code: "PETE201", name_en: "Introduction to Petroleum Engineering", credits: 3 }, { code: "PETE202", name_en: "Reservoir Mechanics", credits: 3 }, { code: "PETE301", name_en: "Drilling Engineering", credits: 3 }, { code: "PETE302", name_en: "Production Engineering", credits: 3 }, { code: "PETE401", name_en: "Reservoir Simulation", credits: 3 }, { code: "PETE402", name_en: "Enhanced Oil Recovery", credits: 3 }] },
          { id: "KW-KU-ENG-ARCH", name_ar: "قسم العمارة", name_en: "Department of Architecture", degrees: ["BArch", "MSc"], courses: [{ code: "ARCH101", name_en: "Architectural Design I", credits: 4 }, { code: "ARCH102", name_en: "Architectural Design II", credits: 4 }, { code: "ARCH201", name_en: "History of Architecture", credits: 3 }, { code: "ARCH202", name_en: "Structural Systems", credits: 3 }, { code: "ARCH301", name_en: "Urban Design", credits: 3 }, { code: "ARCH401", name_en: "Sustainable Architecture", credits: 3 }] },
          { id: "KW-KU-ENG-IND", name_ar: "قسم الهندسة الصناعية وهندسة الإدارة", name_en: "Department of Industrial and Management Engineering", degrees: ["BSc", "MSc"], courses: [{ code: "INDE201", name_en: "Engineering Economy", credits: 3 }, { code: "INDE202", name_en: "Production Planning", credits: 3 }, { code: "INDE301", name_en: "Quality Control", credits: 3 }, { code: "INDE302", name_en: "Simulation", credits: 3 }, { code: "INDE401", name_en: "Supply Chain Management", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-MED",
        name_ar: "كلية الطب",
        name_en: "College of Medicine",
        departments: [
          { id: "KW-KU-MED-BASIC", name_ar: "العلوم الطبية الأساسية", name_en: "Basic Medical Sciences", degrees: ["MBBS"], courses: [{ code: "MED101", name_en: "Human Anatomy I", credits: 4 }, { code: "MED102", name_en: "Physiology I", credits: 4 }, { code: "MED103", name_en: "Biochemistry", credits: 3 }, { code: "MED201", name_en: "Pathology", credits: 4 }, { code: "MED202", name_en: "Pharmacology", credits: 3 }, { code: "MED203", name_en: "Microbiology", credits: 3 }] },
          { id: "KW-KU-MED-CLIN", name_ar: "العلوم السريرية", name_en: "Clinical Sciences", degrees: ["MBBS"], courses: [{ code: "CLIN301", name_en: "Internal Medicine", credits: 6 }, { code: "CLIN302", name_en: "Surgery", credits: 6 }, { code: "CLIN303", name_en: "Pediatrics", credits: 4 }, { code: "CLIN304", name_en: "Obstetrics and Gynecology", credits: 4 }, { code: "CLIN401", name_en: "Psychiatry", credits: 3 }, { code: "CLIN402", name_en: "Community Medicine", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-LAW",
        name_ar: "كلية الحقوق",
        name_en: "College of Law",
        departments: [
          { id: "KW-KU-LAW-PUB", name_ar: "القانون العام", name_en: "Department of Public Law", degrees: ["LLB", "LLM"], courses: [{ code: "LAW101", name_en: "Introduction to Law", credits: 3 }, { code: "LAW201", name_en: "Constitutional Law", credits: 3 }, { code: "LAW202", name_en: "Administrative Law", credits: 3 }, { code: "LAW301", name_en: "International Public Law", credits: 3 }, { code: "LAW401", name_en: "Human Rights Law", credits: 3 }] },
          { id: "KW-KU-LAW-PRIV", name_ar: "القانون الخاص", name_en: "Department of Private Law", degrees: ["LLB", "LLM"], courses: [{ code: "LAWP201", name_en: "Civil Law", credits: 3 }, { code: "LAWP202", name_en: "Commercial Law", credits: 3 }, { code: "LAWP301", name_en: "Contract Law", credits: 3 }, { code: "LAWP302", name_en: "Family Law", credits: 3 }, { code: "LAWP401", name_en: "International Private Law", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-BUS",
        name_ar: "كلية إدارة الأعمال",
        name_en: "College of Business Administration",
        departments: [
          { id: "KW-KU-BUS-ACC", name_ar: "قسم المحاسبة", name_en: "Department of Accounting", degrees: ["BSc", "MSc"], courses: [{ code: "ACCT101", name_en: "Financial Accounting I", credits: 3 }, { code: "ACCT102", name_en: "Financial Accounting II", credits: 3 }, { code: "ACCT201", name_en: "Cost Accounting", credits: 3 }, { code: "ACCT202", name_en: "Auditing", credits: 3 }, { code: "ACCT301", name_en: "Advanced Financial Accounting", credits: 3 }, { code: "ACCT401", name_en: "Tax Accounting", credits: 3 }] },
          { id: "KW-KU-BUS-FIN", name_ar: "قسم المالية والاقتصاد", name_en: "Department of Finance and Economics", degrees: ["BSc", "MSc"], courses: [{ code: "FIN101", name_en: "Principles of Economics", credits: 3 }, { code: "FIN201", name_en: "Corporate Finance", credits: 3 }, { code: "FIN202", name_en: "Financial Markets", credits: 3 }, { code: "FIN301", name_en: "Investment Analysis", credits: 3 }, { code: "FIN302", name_en: "Financial Econometrics", credits: 3 }, { code: "FIN401", name_en: "International Finance", credits: 3 }] },
          { id: "KW-KU-BUS-MGMT", name_ar: "قسم الإدارة", name_en: "Department of Management and Marketing", degrees: ["BSc", "MSc", "MBA"], courses: [{ code: "MGMT101", name_en: "Principles of Management", credits: 3 }, { code: "MGMT201", name_en: "Organizational Behavior", credits: 3 }, { code: "MGMT202", name_en: "Marketing Management", credits: 3 }, { code: "MGMT301", name_en: "Strategic Management", credits: 3 }, { code: "MGMT302", name_en: "Human Resource Management", credits: 3 }, { code: "MGMT401", name_en: "Entrepreneurship", credits: 3 }] },
          { id: "KW-KU-BUS-QM", name_ar: "قسم الأساليب الكمية", name_en: "Department of Quantitative Methods and Information Systems", degrees: ["BSc", "MSc"], courses: [{ code: "QMIS101", name_en: "Business Statistics", credits: 3 }, { code: "QMIS201", name_en: "Management Information Systems", credits: 3 }, { code: "QMIS202", name_en: "Business Analytics", credits: 3 }, { code: "QMIS301", name_en: "Decision Analysis", credits: 3 }, { code: "QMIS401", name_en: "Data Mining for Business", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-EDU",
        name_ar: "كلية التربية",
        name_en: "College of Education",
        departments: [
          { id: "KW-KU-EDU-CURR", name_ar: "قسم المناهج وطرق التدريس", name_en: "Department of Curriculum and Instruction", degrees: ["BA", "MEd"], courses: [{ code: "EDUC101", name_en: "Foundations of Education", credits: 3 }, { code: "EDUC201", name_en: "Curriculum Design", credits: 3 }, { code: "EDUC202", name_en: "Teaching Methods", credits: 3 }, { code: "EDUC301", name_en: "Educational Technology", credits: 3 }, { code: "EDUC401", name_en: "Assessment and Evaluation", credits: 3 }] },
          { id: "KW-KU-EDU-PSYCH", name_ar: "قسم علم النفس التربوي", name_en: "Department of Educational Psychology", degrees: ["BA", "MEd"], courses: [{ code: "EDPS201", name_en: "Educational Psychology", credits: 3 }, { code: "EDPS202", name_en: "Learning Theories", credits: 3 }, { code: "EDPS301", name_en: "Child Development", credits: 3 }, { code: "EDPS401", name_en: "Special Education", credits: 3 }] },
          { id: "KW-KU-EDU-ADMIN", name_ar: "قسم الإدارة والأصول التربوية", name_en: "Department of Educational Administration", degrees: ["BA", "MEd"], courses: [{ code: "EDAC201", name_en: "Educational Administration", credits: 3 }, { code: "EDAC202", name_en: "School Management", credits: 3 }, { code: "EDAC301", name_en: "Education Policy", credits: 3 }, { code: "EDAC401", name_en: "Educational Leadership", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-PHARM",
        name_ar: "كلية الصيدلة",
        name_en: "College of Pharmacy",
        departments: [
          { id: "KW-KU-PHARM-PHARM", name_ar: "قسم الصيدلانيات", name_en: "Department of Pharmaceutics", degrees: ["BPharm", "MSc", "PhD"], courses: [{ code: "PHRM101", name_en: "Introduction to Pharmacy", credits: 3 }, { code: "PHRM201", name_en: "Pharmaceutics I", credits: 3 }, { code: "PHRM202", name_en: "Pharmacognosy", credits: 3 }, { code: "PHRM301", name_en: "Pharmacokinetics", credits: 3 }, { code: "PHRM401", name_en: "Clinical Pharmacy", credits: 3 }] },
          { id: "KW-KU-PHARM-CHEM", name_ar: "قسم الكيمياء الصيدلانية", name_en: "Department of Pharmaceutical Chemistry", degrees: ["BPharm", "MSc", "PhD"], courses: [{ code: "PHCH201", name_en: "Medicinal Chemistry I", credits: 3 }, { code: "PHCH202", name_en: "Drug Analysis", credits: 3 }, { code: "PHCH301", name_en: "Drug Design", credits: 3 }, { code: "PHCH401", name_en: "Toxicology", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-ALLIED",
        name_ar: "كلية العلوم الطبية المساندة",
        name_en: "College of Allied Health Sciences",
        departments: [
          { id: "KW-KU-ALLIED-MLT", name_ar: "قسم تقنية المختبرات الطبية", name_en: "Department of Medical Laboratory Sciences", degrees: ["BSc"], courses: [{ code: "MLSC201", name_en: "Clinical Hematology", credits: 3 }, { code: "MLSC202", name_en: "Clinical Biochemistry", credits: 3 }, { code: "MLSC301", name_en: "Clinical Microbiology", credits: 3 }, { code: "MLSC302", name_en: "Blood Banking", credits: 3 }, { code: "MLSC401", name_en: "Histopathology", credits: 3 }] },
          { id: "KW-KU-ALLIED-RAD", name_ar: "قسم الأشعة", name_en: "Department of Radiological Sciences", degrees: ["BSc"], courses: [{ code: "RADS201", name_en: "Radiographic Anatomy", credits: 3 }, { code: "RADS202", name_en: "Diagnostic Imaging", credits: 3 }, { code: "RADS301", name_en: "Nuclear Medicine", credits: 3 }, { code: "RADS401", name_en: "Radiation Physics", credits: 3 }] },
          { id: "KW-KU-ALLIED-PT", name_ar: "قسم العلاج الطبيعي", name_en: "Department of Physical Therapy", degrees: ["BSc"], courses: [{ code: "PHYT201", name_en: "Anatomy for Physical Therapy", credits: 3 }, { code: "PHYT202", name_en: "Kinesiology", credits: 3 }, { code: "PHYT301", name_en: "Therapeutic Exercise", credits: 3 }, { code: "PHYT401", name_en: "Clinical Rehabilitation", credits: 4 }] },
        ],
      },
      {
        id: "KW-KU-SHARIA",
        name_ar: "كلية الشريعة والدراسات الإسلامية",
        name_en: "College of Sharia and Islamic Studies",
        departments: [
          { id: "KW-KU-SHARIA-FIQH", name_ar: "قسم الفقه وأصوله", name_en: "Department of Islamic Jurisprudence", degrees: ["BA", "MA"], courses: [{ code: "ISLM101", name_en: "Introduction to Islamic Law", credits: 3 }, { code: "ISLM201", name_en: "Principles of Jurisprudence", credits: 3 }, { code: "ISLM202", name_en: "Comparative Fiqh", credits: 3 }, { code: "ISLM301", name_en: "Family Law in Islam", credits: 3 }, { code: "ISLM401", name_en: "Islamic Finance", credits: 3 }] },
          { id: "KW-KU-SHARIA-QURAN", name_ar: "قسم القرآن الكريم وعلومه", name_en: "Department of Quran and Islamic Sciences", degrees: ["BA", "MA"], courses: [{ code: "QRNS101", name_en: "Quran Recitation and Memorization", credits: 2 }, { code: "QRNS201", name_en: "Tafsir (Quranic Exegesis)", credits: 3 }, { code: "QRNS202", name_en: "Hadith Sciences", credits: 3 }, { code: "QRNS301", name_en: "Aqeedah (Islamic Theology)", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-NURS",
        name_ar: "كلية التمريض",
        name_en: "College of Nursing",
        departments: [
          { id: "KW-KU-NURS-BASIC", name_ar: "قسم التمريض الأساسي", name_en: "Department of Basic Nursing", degrees: ["BSc", "MSc"], courses: [{ code: "NURS101", name_en: "Fundamentals of Nursing", credits: 3 }, { code: "NURS201", name_en: "Adult Health Nursing", credits: 4 }, { code: "NURS202", name_en: "Mental Health Nursing", credits: 3 }, { code: "NURS301", name_en: "Community Health Nursing", credits: 3 }, { code: "NURS401", name_en: "Nursing Research", credits: 3 }] },
        ],
      },
      {
        id: "KW-KU-FINE",
        name_ar: "كلية الفنون الجميلة والتصميم",
        name_en: "College of Fine Arts",
        departments: [
          { id: "KW-KU-FINE-DESIGN", name_ar: "قسم التصميم الجرافيكي", name_en: "Department of Graphic Design", degrees: ["BA"], courses: [{ code: "GRDS101", name_en: "Design Principles", credits: 3 }, { code: "GRDS201", name_en: "Typography", credits: 3 }, { code: "GRDS202", name_en: "Digital Illustration", credits: 3 }, { code: "GRDS301", name_en: "Brand Identity Design", credits: 3 }, { code: "GRDS401", name_en: "UI/UX Design", credits: 3 }] },
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
          { id: "KW-GUST-BUS-ACC", name_ar: "قسم المحاسبة", name_en: "Department of Accounting", degrees: ["BSc"], courses: [{ code: "GACC101", name_en: "Financial Accounting I", credits: 3 }, { code: "GACC201", name_en: "Managerial Accounting", credits: 3 }, { code: "GACC301", name_en: "Auditing", credits: 3 }, { code: "GACC401", name_en: "Accounting Information Systems", credits: 3 }] },
          { id: "KW-GUST-BUS-FIN", name_ar: "قسم التمويل والاقتصاد", name_en: "Department of Finance and Economics", degrees: ["BSc"], courses: [{ code: "GFIN101", name_en: "Principles of Economics", credits: 3 }, { code: "GFIN201", name_en: "Corporate Finance", credits: 3 }, { code: "GFIN301", name_en: "Financial Markets and Institutions", credits: 3 }, { code: "GFIN401", name_en: "International Financial Management", credits: 3 }] },
          { id: "KW-GUST-BUS-MKT", name_ar: "قسم التسويق وإدارة الأعمال", name_en: "Department of Marketing and Management", degrees: ["BSc", "MBA"], courses: [{ code: "GMKT201", name_en: "Marketing Management", credits: 3 }, { code: "GMKT202", name_en: "Consumer Behavior", credits: 3 }, { code: "GMKT301", name_en: "Digital Marketing", credits: 3 }, { code: "GMKT401", name_en: "Strategic Marketing", credits: 3 }] },
        ],
      },
      {
        id: "KW-GUST-ARTS",
        name_ar: "كلية الآداب والعلوم",
        name_en: "College of Arts and Sciences",
        departments: [
          { id: "KW-GUST-ARTS-MATH", name_ar: "قسم الرياضيات وعلوم الحاسب", name_en: "Department of Mathematics and Computer Science", degrees: ["BSc"], courses: [{ code: "GMAT101", name_en: "Calculus I", credits: 3 }, { code: "GMAT201", name_en: "Discrete Mathematics", credits: 3 }, { code: "GCS101", name_en: "Programming Fundamentals", credits: 3 }, { code: "GCS201", name_en: "Data Structures", credits: 3 }, { code: "GCS301", name_en: "Artificial Intelligence", credits: 3 }] },
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
          { id: "KW-AUK-ART-ENG", name_ar: "قسم اللغة الإنجليزية والتواصل", name_en: "Department of English and Communication", degrees: ["BA"], courses: [{ code: "AENG101", name_en: "Academic English I", credits: 3 }, { code: "AENG201", name_en: "Communication Skills", credits: 3 }, { code: "AENG301", name_en: "Technical Writing", credits: 3 }] },
          { id: "KW-AUK-ART-SS", name_ar: "قسم العلوم الاجتماعية", name_en: "Department of Social Sciences", degrees: ["BA"], courses: [{ code: "ASSC101", name_en: "Introduction to Sociology", credits: 3 }, { code: "ASSC201", name_en: "Political Science", credits: 3 }, { code: "ASSC301", name_en: "International Relations", credits: 3 }] },
        ],
      },
      {
        id: "KW-AUK-BUS",
        name_ar: "كلية إدارة الأعمال",
        name_en: "College of Business Administration",
        departments: [
          { id: "KW-AUK-BUS-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["BSc", "MBA"], courses: [{ code: "ABAS101", name_en: "Principles of Management", credits: 3 }, { code: "ABAS201", name_en: "Business Ethics", credits: 3 }, { code: "ABAS301", name_en: "Entrepreneurship", credits: 3 }] },
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
          { id: "KW-ACK-ENG-CS", name_ar: "قسم علوم الحاسب وهندسته", name_en: "Department of Computer Science and Engineering", degrees: ["BSc"], courses: [{ code: "ACCS101", name_en: "Introduction to Computing", credits: 3 }, { code: "ACCS201", name_en: "Data Structures and Algorithms", credits: 3 }, { code: "ACCS301", name_en: "Software Engineering", credits: 3 }, { code: "ACCS401", name_en: "Machine Learning", credits: 3 }] },
        ],
      },
      {
        id: "KW-ACK-BUS",
        name_ar: "كلية الأعمال",
        name_en: "College of Business",
        departments: [
          { id: "KW-ACK-BUS-MGMT", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Management", degrees: ["BSc"], courses: [{ code: "ACBM101", name_en: "Business Foundations", credits: 3 }, { code: "ACBM201", name_en: "Management Principles", credits: 3 }, { code: "ACBM301", name_en: "Project Management", credits: 3 }] },
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
          { id: "KW-AAUM-BUS-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["BSc", "MBA"], courses: [{ code: "AOUB101", name_en: "Business Environment", credits: 8 }, { code: "AOUB201", name_en: "Managing People", credits: 8 }, { code: "AOUB301", name_en: "Marketing", credits: 8 }] },
        ],
      },
      {
        id: "KW-AAUM-IT",
        name_ar: "كلية تقنية المعلومات والحوسبة",
        name_en: "Faculty of Computing and Information Technology",
        departments: [
          { id: "KW-AAUM-IT-CS", name_ar: "قسم علوم الحاسب", name_en: "Department of Computer Science", degrees: ["BSc"], courses: [{ code: "AOIT101", name_en: "Introduction to IT", credits: 8 }, { code: "AOIT201", name_en: "Databases", credits: 8 }, { code: "AOIT301", name_en: "Network Technologies", credits: 8 }] },
        ],
      },
    ],
  },
];
