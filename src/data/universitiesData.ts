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
          { id: "QA-QU-ARTS-ARABIC", name_ar: "قسم اللغة العربية", name_en: "Department of Arabic Language", degrees: ["BA","MA"], courses: [{ code: "ARAB100", name_en: "Arabic Language Skills", credits: 3 }, { code: "ARAB200", name_en: "Arabic Literature I", credits: 3 }, { code: "ARAB201", name_en: "Arabic Grammar and Syntax", credits: 3 }, { code: "ARAB300", name_en: "Classical Arabic Texts", credits: 3 }, { code: "ARAB400", name_en: "Modern Arabic Literature", credits: 3 }] },
          { id: "QA-QU-ARTS-BIO", name_ar: "قسم العلوم البيولوجية والبيئية", name_en: "Department of Biological and Environmental Sciences", degrees: ["BSc","MSc"], courses: [{ code: "BIOL101", name_en: "General Biology I", credits: 3 }, { code: "BIOL102", name_en: "General Biology II", credits: 3 }, { code: "BIOL201", name_en: "Cell Biology", credits: 3 }, { code: "BIOL202", name_en: "Genetics", credits: 3 }, { code: "BIOL301", name_en: "Ecology", credits: 3 }, { code: "ENVS301", name_en: "Environmental Science", credits: 3 }, { code: "BIOL401", name_en: "Molecular Biology", credits: 3 }] },
          { id: "QA-QU-ARTS-CHEM", name_ar: "قسم الكيمياء وعلوم الأرض", name_en: "Department of Chemistry and Earth Sciences", degrees: ["BSc","MSc"], courses: [{ code: "CHEM101", name_en: "General Chemistry I", credits: 3 }, { code: "CHEM102", name_en: "General Chemistry II", credits: 3 }, { code: "CHEM201", name_en: "Organic Chemistry I", credits: 3 }, { code: "CHEM202", name_en: "Analytical Chemistry", credits: 3 }, { code: "CHEM301", name_en: "Physical Chemistry", credits: 3 }, { code: "CHEM401", name_en: "Biochemistry", credits: 3 }, { code: "ESCI301", name_en: "Earth Sciences", credits: 3 }] },
          { id: "QA-QU-ARTS-MATH", name_ar: "قسم الرياضيات والإحصاء والفيزياء", name_en: "Department of Mathematics, Statistics and Physics", degrees: ["BSc","MSc"], courses: [{ code: "MATH101", name_en: "Calculus I", credits: 3 }, { code: "MATH102", name_en: "Calculus II", credits: 3 }, { code: "MATH201", name_en: "Linear Algebra", credits: 3 }, { code: "MATH301", name_en: "Real Analysis", credits: 3 }, { code: "STAT201", name_en: "Probability and Statistics", credits: 3 }, { code: "PHYS101", name_en: "General Physics I", credits: 3 }, { code: "PHYS102", name_en: "General Physics II", credits: 3 }] },
          { id: "QA-QU-ARTS-ENG", name_ar: "قسم اللغة الإنجليزية", name_en: "Department of English Literature and Linguistics", degrees: ["BA","MA"], courses: [{ code: "ENGL100", name_en: "English Composition", credits: 3 }, { code: "ENGL200", name_en: "Introduction to Literature", credits: 3 }, { code: "ENGL201", name_en: "Linguistics", credits: 3 }, { code: "ENGL300", name_en: "British Literature", credits: 3 }, { code: "ENGL400", name_en: "Literary Theory", credits: 3 }] },
          { id: "QA-QU-ARTS-HIST", name_ar: "قسم التاريخ والشؤون الدولية", name_en: "Department of History and International Affairs", degrees: ["BA","MA"], courses: [{ code: "HIST100", name_en: "World History", credits: 3 }, { code: "HIST200", name_en: "History of the Middle East", credits: 3 }, { code: "HIST301", name_en: "Modern Gulf History", credits: 3 }, { code: "INTA200", name_en: "Introduction to International Relations", credits: 3 }, { code: "INTA300", name_en: "Foreign Policy Analysis", credits: 3 }] },
          { id: "QA-QU-ARTS-SOC", name_ar: "قسم العلوم الاجتماعية", name_en: "Department of Social Sciences", degrees: ["BA","MA"], courses: [{ code: "SOC100", name_en: "Introduction to Sociology", credits: 3 }, { code: "SOC200", name_en: "Social Research Methods", credits: 3 }, { code: "SOC201", name_en: "Social Psychology", credits: 3 }, { code: "SOC300", name_en: "Sociology of Gulf Society", credits: 3 }, { code: "SOC400", name_en: "Sociology of Development", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-BUS",
        name_ar: "كلية الأعمال والاقتصاد",
        name_en: "College of Business and Economics",
        departments: [
          { id: "QA-QU-BUS-ACC", name_ar: "قسم المحاسبة والمعلومات", name_en: "Department of Accounting and Information Systems", degrees: ["BSc","MSc"], courses: [{ code: "ACCT201", name_en: "Financial Accounting", credits: 3 }, { code: "ACCT202", name_en: "Managerial Accounting", credits: 3 }, { code: "ACCT301", name_en: "Intermediate Accounting", credits: 3 }, { code: "ACCT302", name_en: "Auditing", credits: 3 }, { code: "ACCT401", name_en: "Accounting Information Systems", credits: 3 }] },
          { id: "QA-QU-BUS-FIN", name_ar: "قسم التمويل والاقتصاد", name_en: "Department of Finance and Economics", degrees: ["BSc","MSc"], courses: [{ code: "ECON201", name_en: "Microeconomics", credits: 3 }, { code: "ECON202", name_en: "Macroeconomics", credits: 3 }, { code: "FINA201", name_en: "Corporate Finance", credits: 3 }, { code: "FINA301", name_en: "Investments", credits: 3 }, { code: "FINA401", name_en: "Islamic Finance", credits: 3 }] },
          { id: "QA-QU-BUS-MGMT", name_ar: "قسم الإدارة والتسويق", name_en: "Department of Management and Marketing", degrees: ["BSc","MSc","MBA"], courses: [{ code: "MGMT200", name_en: "Principles of Management", credits: 3 }, { code: "MGMT301", name_en: "Organizational Behavior", credits: 3 }, { code: "MKTG200", name_en: "Marketing Principles", credits: 3 }, { code: "MKTG301", name_en: "Consumer Behavior", credits: 3 }, { code: "MGMT401", name_en: "Strategic Management", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-ENG",
        name_ar: "كلية الهندسة",
        name_en: "College of Engineering",
        departments: [
          { id: "QA-QU-ENG-CIVIL", name_ar: "قسم الهندسة المدنية", name_en: "Department of Civil and Architectural Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "CVLE200", name_en: "Engineering Mechanics", credits: 3 }, { code: "CVLE301", name_en: "Structural Analysis", credits: 3 }, { code: "CVLE302", name_en: "Geotechnical Engineering", credits: 3 }, { code: "CVLE303", name_en: "Fluid Mechanics", credits: 3 }, { code: "CVLE401", name_en: "Construction Management", credits: 3 }] },
          { id: "QA-QU-ENG-ELEC", name_ar: "قسم الهندسة الكهربائية", name_en: "Department of Electrical Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "ELEE201", name_en: "Circuit Analysis", credits: 3 }, { code: "ELEE301", name_en: "Electronics", credits: 3 }, { code: "ELEE302", name_en: "Signals and Systems", credits: 3 }, { code: "ELEE401", name_en: "Power Systems", credits: 3 }, { code: "ELEE402", name_en: "Wireless Communications", credits: 3 }] },
          { id: "QA-QU-ENG-MECH", name_ar: "قسم الهندسة الميكانيكية والصناعية", name_en: "Department of Mechanical and Industrial Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "MECH201", name_en: "Thermodynamics", credits: 3 }, { code: "MECH202", name_en: "Engineering Mechanics", credits: 3 }, { code: "MECH301", name_en: "Heat Transfer", credits: 3 }, { code: "MECH302", name_en: "Machine Design", credits: 3 }, { code: "INDE301", name_en: "Industrial Engineering", credits: 3 }] },
          { id: "QA-QU-ENG-CHEM", name_ar: "قسم الهندسة الكيميائية", name_en: "Department of Chemical Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "CHEN201", name_en: "Material and Energy Balances", credits: 3 }, { code: "CHEN301", name_en: "Transport Phenomena", credits: 3 }, { code: "CHEN302", name_en: "Reaction Engineering", credits: 3 }, { code: "CHEN401", name_en: "Process Control", credits: 3 }, { code: "CHEN402", name_en: "Petroleum Processes", credits: 3 }] },
          { id: "QA-QU-ENG-CS", name_ar: "قسم الهندسة الحاسوبية", name_en: "Department of Computer Science and Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "CMPE201", name_en: "Programming Fundamentals", credits: 3 }, { code: "CMPE202", name_en: "Data Structures", credits: 3 }, { code: "CMPE301", name_en: "Algorithms", credits: 3 }, { code: "CMPE302", name_en: "Operating Systems", credits: 3 }, { code: "CMPE401", name_en: "Machine Learning", credits: 3 }, { code: "CMPE402", name_en: "Cybersecurity", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-LAW",
        name_ar: "كلية القانون",
        name_en: "College of Law",
        departments: [
          { id: "QA-QU-LAW-PUB", name_ar: "القانون العام والخاص", name_en: "Department of Public and Private Law", degrees: ["LLB","LLM"], courses: [{ code: "LAW100", name_en: "Introduction to Law", credits: 3 }, { code: "LAW201", name_en: "Constitutional Law", credits: 3 }, { code: "LAW202", name_en: "Civil Law", credits: 3 }, { code: "LAW301", name_en: "Commercial Law", credits: 3 }, { code: "LAW401", name_en: "International Law", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-HLTH",
        name_ar: "كلية العلوم الصحية",
        name_en: "College of Health Sciences",
        departments: [
          { id: "QA-QU-HLTH-PHN", name_ar: "قسم الصحة العامة", name_en: "Department of Public Health", degrees: ["BSc","MPH"], courses: [{ code: "PBHL201", name_en: "Introduction to Public Health", credits: 3 }, { code: "PBHL202", name_en: "Epidemiology", credits: 3 }, { code: "PBHL301", name_en: "Health Promotion", credits: 3 }, { code: "PBHL401", name_en: "Health Policy", credits: 3 }] },
          { id: "QA-QU-HLTH-BIOMD", name_ar: "قسم العلوم الطبية الحيوية", name_en: "Department of Biomedical Science", degrees: ["BSc","MSc"], courses: [{ code: "BIOM201", name_en: "Anatomy and Physiology", credits: 3 }, { code: "BIOM202", name_en: "Pathophysiology", credits: 3 }, { code: "BIOM301", name_en: "Immunology", credits: 3 }, { code: "BIOM401", name_en: "Clinical Biochemistry", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-PHARM",
        name_ar: "كلية الصيدلة",
        name_en: "College of Pharmacy",
        departments: [
          { id: "QA-QU-PHARM-PHARM", name_ar: "قسم الصيدلة الإكلينيكية", name_en: "Department of Clinical Pharmacy and Practice", degrees: ["PharmD","MSc"], courses: [{ code: "PHRM201", name_en: "Pharmacology I", credits: 3 }, { code: "PHRM202", name_en: "Pharmaceutics", credits: 3 }, { code: "PHRM301", name_en: "Pharmacokinetics", credits: 3 }, { code: "PHRM401", name_en: "Clinical Pharmacy Practice", credits: 4 }] },
        ],
      },
      {
        id: "QA-QU-EDU",
        name_ar: "كلية التربية",
        name_en: "College of Education",
        departments: [
          { id: "QA-QU-EDU-CURR", name_ar: "قسم المناهج وطرق التدريس", name_en: "Department of Curriculum and Instruction", degrees: ["BA","MEd"], courses: [{ code: "EDUC200", name_en: "Foundations of Education", credits: 3 }, { code: "EDUC201", name_en: "Curriculum Design", credits: 3 }, { code: "EDUC301", name_en: "Educational Technology", credits: 3 }, { code: "EDUC401", name_en: "Assessment in Education", credits: 3 }] },
          { id: "QA-QU-EDU-PSYCH", name_ar: "قسم علم النفس التربوي والإرشاد", name_en: "Department of Educational Psychology and Counseling", degrees: ["BA","MEd"], courses: [{ code: "EDPS200", name_en: "Educational Psychology", credits: 3 }, { code: "EDPS301", name_en: "Learning and Motivation", credits: 3 }, { code: "COUNS301", name_en: "School Counseling", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-MED",
        name_ar: "كلية الطب",
        name_en: "College of Medicine",
        departments: [
          { id: "QA-QU-MED-BASIC", name_ar: "العلوم الطبية الأساسية", name_en: "Basic Medical Sciences", degrees: ["MD"], courses: [{ code: "MEDS101", name_en: "Human Anatomy", credits: 4 }, { code: "MEDS102", name_en: "Physiology", credits: 4 }, { code: "MEDS201", name_en: "Pathology", credits: 4 }, { code: "MEDS202", name_en: "Pharmacology", credits: 3 }] },
        ],
      },
      {
        id: "QA-QU-SHARIA",
        name_ar: "كلية الشريعة والدراسات الإسلامية",
        name_en: "College of Sharia and Islamic Studies",
        departments: [
          { id: "QA-QU-SHARIA-FIQH", name_ar: "قسم الفقه وأصوله", name_en: "Department of Islamic Jurisprudence", degrees: ["BA","MA"], courses: [{ code: "ISLM100", name_en: "Introduction to Islamic Law", credits: 3 }, { code: "ISLM201", name_en: "Principles of Islamic Jurisprudence", credits: 3 }, { code: "ISLM301", name_en: "Comparative Islamic Law", credits: 3 }] },
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
          { id: "QA-UDST-ENG-ELEC", name_ar: "قسم الهندسة الكهربائية", name_en: "Department of Electrical Engineering", degrees: ["BSc"], courses: [{ code: "ELEC101", name_en: "Electrical Circuits", credits: 3 }, { code: "ELEC201", name_en: "Electronics", credits: 3 }, { code: "ELEC301", name_en: "Automation and Control", credits: 3 }, { code: "ELEC302", name_en: "Power and Renewable Energy", credits: 3 }, { code: "ELEC303", name_en: "Telecommunications Networks", credits: 3 }, { code: "ELEC401", name_en: "Smart Grid Systems", credits: 3 }] },
          { id: "QA-UDST-ENG-MECH", name_ar: "قسم الهندسة الميكانيكية", name_en: "Department of Mechanical Engineering", degrees: ["BSc"], courses: [{ code: "MECH101", name_en: "Engineering Mechanics", credits: 3 }, { code: "MECH201", name_en: "Thermodynamics", credits: 3 }, { code: "MECH301", name_en: "Maintenance Engineering", credits: 3 }, { code: "MECH302", name_en: "Smart Manufacturing", credits: 3 }, { code: "MECH401", name_en: "Robotics and Automation", credits: 3 }] },
          { id: "QA-UDST-ENG-MARINE", name_ar: "قسم الهندسة البحرية", name_en: "Department of Marine Engineering", degrees: ["BSc"], courses: [{ code: "MARE101", name_en: "Marine Engineering Fundamentals", credits: 3 }, { code: "MARE201", name_en: "Ship Systems", credits: 3 }, { code: "MARE301", name_en: "Marine Propulsion", credits: 3 }, { code: "MARE401", name_en: "Port and Harbor Engineering", credits: 3 }] },
        ],
      },
      {
        id: "QA-UDST-CIT",
        name_ar: "كلية الحوسبة وتقنية المعلومات",
        name_en: "College of Computing and Information Technology",
        departments: [
          { id: "QA-UDST-CIT-IT", name_ar: "قسم تقنية المعلومات", name_en: "Department of Information Technology", degrees: ["BSc"], courses: [{ code: "ITECH101", name_en: "Introduction to IT", credits: 3 }, { code: "ITECH201", name_en: "Network Administration", credits: 3 }, { code: "ITECH202", name_en: "Database Management", credits: 3 }, { code: "ITECH301", name_en: "Cloud Computing", credits: 3 }, { code: "ITECH401", name_en: "IT Project Management", credits: 3 }] },
          { id: "QA-UDST-CIT-IS", name_ar: "قسم نظم المعلومات", name_en: "Department of Information Systems", degrees: ["BSc"], courses: [{ code: "ISYS101", name_en: "Introduction to Information Systems", credits: 3 }, { code: "ISYS201", name_en: "Systems Analysis and Design", credits: 3 }, { code: "ISYS301", name_en: "Enterprise Resource Planning", credits: 3 }, { code: "ISYS401", name_en: "Business Intelligence", credits: 3 }] },
          { id: "QA-UDST-CIT-SE", name_ar: "قسم هندسة البرمجيات", name_en: "Department of Software Engineering", degrees: ["BSc"], courses: [{ code: "SENG101", name_en: "Programming Fundamentals", credits: 3 }, { code: "SENG201", name_en: "Object-Oriented Programming", credits: 3 }, { code: "SENG202", name_en: "Software Design Patterns", credits: 3 }, { code: "SENG301", name_en: "Software Testing", credits: 3 }, { code: "SENG401", name_en: "Mobile App Development", credits: 3 }] },
          { id: "QA-UDST-CIT-MEDIA", name_ar: "قسم الإعلام الرقمي", name_en: "Department of Digital Communication and Media", degrees: ["BSc"], courses: [{ code: "DCMP101", name_en: "Digital Media Fundamentals", credits: 3 }, { code: "DCMP201", name_en: "Media Production", credits: 3 }, { code: "DCMP301", name_en: "Digital Storytelling", credits: 3 }, { code: "DCMP401", name_en: "Social Media Strategy", credits: 3 }] },
        ],
      },
      {
        id: "QA-UDST-BUS",
        name_ar: "كلية الأعمال",
        name_en: "College of Business",
        departments: [
          { id: "QA-UDST-BUS-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["BSc","MBA"], courses: [{ code: "BUSN101", name_en: "Business Fundamentals", credits: 3 }, { code: "BUSN201", name_en: "Accounting Principles", credits: 3 }, { code: "BUSN202", name_en: "Business Law", credits: 3 }, { code: "BUSN301", name_en: "Operations Management", credits: 3 }, { code: "BUSN401", name_en: "International Business", credits: 3 }] },
        ],
      },
      {
        id: "QA-UDST-HLTH",
        name_ar: "كلية العلوم الصحية",
        name_en: "College of Health Sciences",
        departments: [
          { id: "QA-UDST-HLTH-NURS", name_ar: "قسم التمريض", name_en: "Department of Nursing", degrees: ["BSc"], courses: [{ code: "NURS101", name_en: "Fundamentals of Nursing", credits: 3 }, { code: "NURS201", name_en: "Adult Health Nursing", credits: 4 }, { code: "NURS202", name_en: "Community Health Nursing", credits: 3 }, { code: "NURS301", name_en: "Pediatric Nursing", credits: 4 }, { code: "NURS401", name_en: "Critical Care Nursing", credits: 4 }] },
          { id: "QA-UDST-HLTH-ALLIED", name_ar: "قسم العلوم الصحية المساندة", name_en: "Department of Allied Health Sciences", degrees: ["BSc"], courses: [{ code: "ALHL101", name_en: "Medical Radiography Fundamentals", credits: 3 }, { code: "ALHL201", name_en: "Paramedicine", credits: 3 }, { code: "ALHL202", name_en: "Respiratory Therapy", credits: 3 }, { code: "ALHL301", name_en: "Pharmacy Technology", credits: 3 }, { code: "ALHL302", name_en: "Environmental Health", credits: 3 }, { code: "ALHL303", name_en: "Occupational Health and Safety", credits: 3 }] },
          { id: "QA-UDST-HLTH-MIDWIFE", name_ar: "قسم القبالة", name_en: "Department of Midwifery", degrees: ["BSc"], courses: [{ code: "MIDW201", name_en: "Midwifery Practice I", credits: 4 }, { code: "MIDW202", name_en: "Antenatal Care", credits: 3 }, { code: "MIDW301", name_en: "Intrapartum Care", credits: 4 }, { code: "MIDW401", name_en: "Postnatal Care", credits: 3 }] },
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
          { id: "QA-HBKU-CSE-CHEME", name_ar: "قسم الهندسة الكيميائية", name_en: "Department of Chemical Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "HCHE201", name_en: "Chemical Process Fundamentals", credits: 3 }, { code: "HCHE301", name_en: "Reaction Engineering", credits: 3 }, { code: "HCHE302", name_en: "Separation Processes", credits: 3 }, { code: "HCHE401", name_en: "Sustainable Chemical Engineering", credits: 3 }] },
          { id: "QA-HBKU-CSE-ELECE", name_ar: "قسم الهندسة الكهربائية", name_en: "Department of Electrical Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "HELE201", name_en: "Digital Systems", credits: 3 }, { code: "HELE301", name_en: "Communications Engineering", credits: 3 }, { code: "HELE302", name_en: "VLSI Design", credits: 3 }, { code: "HELE401", name_en: "Embedded Systems", credits: 3 }] },
          { id: "QA-HBKU-CSE-MECHE", name_ar: "قسم الهندسة الميكانيكية", name_en: "Department of Mechanical Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "HMEC201", name_en: "Engineering Mechanics", credits: 3 }, { code: "HMEC301", name_en: "Advanced Thermodynamics", credits: 3 }, { code: "HMEC302", name_en: "Computational Fluid Dynamics", credits: 3 }, { code: "HMEC401", name_en: "Advanced Manufacturing", credits: 3 }] },
          { id: "QA-HBKU-CSE-CE", name_ar: "قسم هندسة الحاسب", name_en: "Department of Computer Engineering", degrees: ["BSc","MSc","PhD"], courses: [{ code: "HCEN201", name_en: "Computer Architecture", credits: 3 }, { code: "HCEN301", name_en: "Artificial Intelligence", credits: 3 }, { code: "HCEN302", name_en: "Cybersecurity", credits: 3 }, { code: "HCEN401", name_en: "Machine Learning", credits: 3 }] },
        ],
      },
      {
        id: "QA-HBKU-ISLM",
        name_ar: "كلية الدراسات الإسلامية",
        name_en: "College of Islamic Studies",
        departments: [
          { id: "QA-HBKU-ISLM-FINANCE", name_ar: "قسم التمويل الإسلامي", name_en: "Department of Islamic Finance", degrees: ["MA","PhD"], courses: [{ code: "ISFI201", name_en: "Foundations of Islamic Finance", credits: 3 }, { code: "ISFI301", name_en: "Islamic Banking", credits: 3 }, { code: "ISFI302", name_en: "Sukuk and Islamic Capital Markets", credits: 3 }, { code: "ISFI401", name_en: "Islamic Microfinance", credits: 3 }] },
          { id: "QA-HBKU-ISLM-ETH", name_ar: "قسم الأخلاق والقيم الإسلامية", name_en: "Department of Islamic Ethics", degrees: ["MA","PhD"], courses: [{ code: "ISET201", name_en: "Islamic Ethics and Civilization", credits: 3 }, { code: "ISET301", name_en: "Bioethics in Islam", credits: 3 }, { code: "ISET401", name_en: "Environmental Ethics in Islam", credits: 3 }] },
        ],
      },
      {
        id: "QA-HBKU-HSS",
        name_ar: "كلية العلوم الإنسانية والاجتماعية",
        name_en: "College of Humanities and Social Sciences",
        departments: [
          { id: "QA-HBKU-HSS-MEDIA", name_ar: "قسم الإعلام والاتصال", name_en: "Department of Media and Communication", degrees: ["MA","PhD"], courses: [{ code: "HMCD201", name_en: "Media Studies", credits: 3 }, { code: "HMCD301", name_en: "Digital Journalism", credits: 3 }, { code: "HMCD302", name_en: "Communication Research Methods", credits: 3 }, { code: "HMCD401", name_en: "Media Policy", credits: 3 }] },
          { id: "QA-HBKU-HSS-TRANS", name_ar: "قسم الترجمة والدراسات اللغوية", name_en: "Department of Translation and Language Studies", degrees: ["MA"], courses: [{ code: "HTLS201", name_en: "Translation Theory", credits: 3 }, { code: "HTLS202", name_en: "Arabic-English Translation", credits: 3 }, { code: "HTLS301", name_en: "Simultaneous Interpretation", credits: 3 }, { code: "HTLS401", name_en: "Localization and Technology", credits: 3 }] },
        ],
      },
      {
        id: "QA-HBKU-PP",
        name_ar: "كلية السياسات العامة",
        name_en: "College of Public Policy",
        departments: [
          { id: "QA-HBKU-PP-POLICY", name_ar: "قسم السياسات العامة", name_en: "Department of Public Policy", degrees: ["MPP","PhD"], courses: [{ code: "HPPL201", name_en: "Introduction to Public Policy", credits: 3 }, { code: "HPPL301", name_en: "Policy Analysis", credits: 3 }, { code: "HPPL302", name_en: "Governance and Institutions", credits: 3 }, { code: "HPPL401", name_en: "Global Public Policy", credits: 3 }] },
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
          { id: "QA-LU-LAW-MAIN", name_ar: "قسم القانون", name_en: "Department of Law", degrees: ["LLB","LLM"], courses: [{ code: "LULAW100", name_en: "Foundations of Law", credits: 3 }, { code: "LULAW201", name_en: "Civil Law", credits: 3 }, { code: "LULAW202", name_en: "Commercial Law", credits: 3 }, { code: "LULAW301", name_en: "Constitutional Law", credits: 3 }, { code: "LULAW401", name_en: "International Law", credits: 3 }] },
        ],
      },
      {
        id: "QA-LU-BUS",
        name_ar: "كلية التجارة والأعمال",
        name_en: "College of Commerce and Business",
        departments: [
          { id: "QA-LU-BUS-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["BSc","MBA"], courses: [{ code: "LUBS101", name_en: "Business Fundamentals", credits: 3 }, { code: "LUBS201", name_en: "Financial Accounting", credits: 3 }, { code: "LUBS202", name_en: "Marketing Management", credits: 3 }, { code: "LUBS301", name_en: "Human Resource Management", credits: 3 }, { code: "LUBS401", name_en: "Strategic Management", credits: 3 }] },
        ],
      },
      {
        id: "QA-LU-EDU",
        name_ar: "كلية التعليم والفنون",
        name_en: "College of Education and Arts",
        departments: [
          { id: "QA-LU-EDU-EDUC", name_ar: "قسم التربية", name_en: "Department of Education", degrees: ["BA","MEd"], courses: [{ code: "LUED101", name_en: "Educational Foundations", credits: 3 }, { code: "LUED201", name_en: "Teaching Methods", credits: 3 }, { code: "LUED301", name_en: "Classroom Management", credits: 3 }, { code: "LUED401", name_en: "Educational Leadership", credits: 3 }] },
        ],
      },
      {
        id: "QA-LU-IT",
        name_ar: "كلية تقنية المعلومات",
        name_en: "College of Information Technology",
        departments: [
          { id: "QA-LU-IT-CS", name_ar: "قسم علوم الحاسب", name_en: "Department of Computer Science", degrees: ["BSc"], courses: [{ code: "LUIT101", name_en: "Introduction to Computing", credits: 3 }, { code: "LUIT201", name_en: "Programming and Algorithms", credits: 3 }, { code: "LUIT202", name_en: "Database Design", credits: 3 }, { code: "LUIT301", name_en: "Network Security", credits: 3 }, { code: "LUIT401", name_en: "Artificial Intelligence Applications", credits: 3 }] },
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
          { id: "QA-CCQ-ARTS-LIB", name_ar: "قسم الآداب العامة", name_en: "Department of Liberal Arts", degrees: ["AA"], courses: [{ code: "CCLA101", name_en: "English Composition I", credits: 3 }, { code: "CCLA102", name_en: "English Composition II", credits: 3 }, { code: "CCLA201", name_en: "Introduction to Social Sciences", credits: 3 }, { code: "CCLA202", name_en: "World Civilizations", credits: 3 }] },
          { id: "QA-CCQ-ARTS-ECE", name_ar: "قسم تعليم الطفولة المبكرة", name_en: "Department of Early Childhood Education", degrees: ["AA"], courses: [{ code: "CCECE101", name_en: "Child Development", credits: 3 }, { code: "CCECE201", name_en: "Early Childhood Curriculum", credits: 3 }, { code: "CCECE202", name_en: "Family and Community Relations", credits: 3 }, { code: "CCECE301", name_en: "Practicum in Early Childhood", credits: 3 }] },
        ],
      },
      {
        id: "QA-CCQ-BUS",
        name_ar: "برامج الأعمال",
        name_en: "Business Programs",
        departments: [
          { id: "QA-CCQ-BUS-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["AA"], courses: [{ code: "CCBA101", name_en: "Introduction to Business", credits: 3 }, { code: "CCBA201", name_en: "Principles of Accounting", credits: 3 }, { code: "CCBA202", name_en: "Business Communication", credits: 3 }, { code: "CCBA301", name_en: "Marketing Fundamentals", credits: 3 }] },
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
          { id: "QA-CMUQ-SCS-CS", name_ar: "قسم علوم الحاسب", name_en: "Department of Computer Science", degrees: ["BSc"], courses: [{ code: "15110", name_en: "Principles of Computing", credits: 9 }, { code: "15122", name_en: "Principles of Imperative Computation", credits: 10 }, { code: "15150", name_en: "Functional Programming", credits: 10 }, { code: "15210", name_en: "Parallel and Sequential Data Structures", credits: 12 }, { code: "15440", name_en: "Distributed Systems", credits: 12 }] },
          { id: "QA-CMUQ-SCS-AI", name_ar: "قسم الذكاء الاصطناعي", name_en: "Department of Artificial Intelligence", degrees: ["BSc"], courses: [{ code: "10315", name_en: "Introduction to Machine Learning", credits: 12 }, { code: "10417", name_en: "Intermediate Deep Learning", credits: 12 }, { code: "10423", name_en: "Generative AI", credits: 12 }, { code: "15381", name_en: "Artificial Intelligence", credits: 9 }] },
        ],
      },
      {
        id: "QA-CMUQ-TEPPER",
        name_ar: "مدرسة تيبر لإدارة الأعمال",
        name_en: "Tepper School of Business",
        departments: [
          { id: "QA-CMUQ-TEPPER-BA", name_ar: "قسم إدارة الأعمال", name_en: "Department of Business Administration", degrees: ["BSc"], courses: [{ code: "70100", name_en: "Business Communication", credits: 9 }, { code: "70311", name_en: "Organizational Behavior", credits: 9 }, { code: "73230", name_en: "Financial Accounting", credits: 9 }, { code: "73330", name_en: "Corporate Finance", credits: 9 }] },
        ],
      },
      {
        id: "QA-CMUQ-BXA",
        name_ar: "قسم علم الأحياء",
        name_en: "Department of Biological Sciences",
        departments: [
          { id: "QA-CMUQ-BXA-BIO", name_ar: "علم الأحياء", name_en: "Biological Sciences", degrees: ["BSc"], courses: [{ code: "03121", name_en: "Modern Biology I", credits: 9 }, { code: "03122", name_en: "Modern Biology II", credits: 9 }, { code: "03230", name_en: "Cellular Neuroscience", credits: 9 }, { code: "03310", name_en: "Biochemistry", credits: 9 }] },
        ],
      },
      {
        id: "QA-CMUQ-IS",
        name_ar: "قسم نظم المعلومات",
        name_en: "Department of Information Systems",
        departments: [
          { id: "QA-CMUQ-IS-IS", name_ar: "نظم المعلومات", name_en: "Information Systems", degrees: ["BSc"], courses: [{ code: "67262", name_en: "Database Design and Development", credits: 12 }, { code: "67364", name_en: "IS Strategy and Management", credits: 9 }, { code: "67373", name_en: "Agile Methods", credits: 9 }, { code: "67442", name_en: "Design of AI-Powered Products", credits: 12 }] },
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
          { id: "QA-GUQ-SFS-CULT", name_ar: "قسم الثقافة والسياسة", name_en: "Department of Culture and Politics", degrees: ["BSFS"], courses: [{ code: "CULT101", name_en: "Introduction to Cultural Theory", credits: 3 }, { code: "CULT201", name_en: "Politics and Culture in the Middle East", credits: 3 }, { code: "CULT301", name_en: "Religion and Global Politics", credits: 3 }] },
          { id: "QA-GUQ-SFS-IPES", name_ar: "قسم الاقتصاد السياسي الدولي", name_en: "Department of International Political Economy", degrees: ["BSFS"], courses: [{ code: "IPES101", name_en: "Principles of Economics", credits: 3 }, { code: "IPES201", name_en: "International Political Economy", credits: 3 }, { code: "IPES301", name_en: "Development Economics", credits: 3 }, { code: "IPES401", name_en: "Global Trade and Finance", credits: 3 }] },
          { id: "QA-GUQ-SFS-IR", name_ar: "قسم العلاقات الدولية", name_en: "Department of International Relations", degrees: ["BSFS"], courses: [{ code: "INRE101", name_en: "Theories of International Relations", credits: 3 }, { code: "INRE201", name_en: "Middle East Politics", credits: 3 }, { code: "INRE301", name_en: "Security Studies", credits: 3 }, { code: "INRE401", name_en: "Diplomacy and Negotiation", credits: 3 }] },
          { id: "QA-GUQ-SFS-SS", name_ar: "قسم العلوم الاجتماعية", name_en: "Department of Science, Technology and International Affairs", degrees: ["BSFS"], courses: [{ code: "STIA101", name_en: "Science, Technology and Society", credits: 3 }, { code: "STIA201", name_en: "Energy Policy", credits: 3 }, { code: "STIA301", name_en: "Cybersecurity Policy", credits: 3 }] },
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
          { id: "QA-NUQ-MEDILL-JOUR", name_ar: "قسم الصحافة", name_en: "Department of Journalism", degrees: ["BSJ"], courses: [{ code: "JOUR101", name_en: "Introduction to Journalism", credits: 4 }, { code: "JOUR201", name_en: "Reporting and Writing", credits: 4 }, { code: "JOUR202", name_en: "Multimedia Storytelling", credits: 4 }, { code: "JOUR301", name_en: "Investigative Journalism", credits: 4 }, { code: "JOUR401", name_en: "Data Journalism", credits: 4 }] },
        ],
      },
      {
        id: "QA-NUQ-COMM",
        name_ar: "مدرسة الاتصال",
        name_en: "School of Communication",
        departments: [
          { id: "QA-NUQ-COMM-COMMST", name_ar: "قسم الاتصال", name_en: "Department of Communication Studies", degrees: ["BSC"], courses: [{ code: "COMM101", name_en: "Introduction to Communication", credits: 4 }, { code: "COMM201", name_en: "Media and Society", credits: 4 }, { code: "COMM202", name_en: "Digital Media Production", credits: 4 }, { code: "COMM301", name_en: "Strategic Communication", credits: 4 }] },
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
          { id: "QA-VCUQ-ART-GD", name_ar: "قسم التصميم الجرافيكي", name_en: "Department of Graphic Design", degrees: ["BFA"], courses: [{ code: "GRDS101", name_en: "Foundation Design I", credits: 3 }, { code: "GRDS201", name_en: "Typography", credits: 3 }, { code: "GRDS202", name_en: "Visual Communication", credits: 3 }, { code: "GRDS301", name_en: "Brand Identity", credits: 3 }, { code: "GRDS401", name_en: "Motion Graphics", credits: 3 }] },
          { id: "QA-VCUQ-ART-FD", name_ar: "قسم تصميم الأزياء", name_en: "Department of Fashion Design", degrees: ["BFA"], courses: [{ code: "FASD101", name_en: "Fashion Drawing", credits: 3 }, { code: "FASD201", name_en: "Pattern Making", credits: 3 }, { code: "FASD202", name_en: "Fashion History", credits: 3 }, { code: "FASD301", name_en: "Textile Design", credits: 3 }, { code: "FASD401", name_en: "Collection Development", credits: 3 }] },
          { id: "QA-VCUQ-ART-ID", name_ar: "قسم التصميم الداخلي", name_en: "Department of Interior Design", degrees: ["BFA"], courses: [{ code: "INTD101", name_en: "Design Fundamentals", credits: 3 }, { code: "INTD201", name_en: "Interior Architecture", credits: 3 }, { code: "INTD202", name_en: "Lighting Design", credits: 3 }, { code: "INTD301", name_en: "Space Planning", credits: 3 }, { code: "INTD401", name_en: "Sustainable Interior Design", credits: 3 }] },
          { id: "QA-VCUQ-ART-FILM", name_ar: "قسم الأفلام والصور المتحركة", name_en: "Department of Film and Animation", degrees: ["BFA"], courses: [{ code: "FILM101", name_en: "Introduction to Film", credits: 3 }, { code: "FILM201", name_en: "Cinematography", credits: 3 }, { code: "FILM202", name_en: "3D Animation", credits: 3 }, { code: "FILM301", name_en: "Film Editing", credits: 3 }, { code: "FILM401", name_en: "Documentary Filmmaking", credits: 3 }] },
          { id: "QA-VCUQ-ART-PAINT", name_ar: "قسم الفنون الجميلة", name_en: "Department of Painting and Printmaking", degrees: ["BFA"], courses: [{ code: "PAIN101", name_en: "Drawing I", credits: 3 }, { code: "PAIN201", name_en: "Painting I", credits: 3 }, { code: "PAIN202", name_en: "Printmaking", credits: 3 }, { code: "PAIN301", name_en: "Contemporary Art Practice", credits: 3 }] },
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
          { id: "QA-WCMQ-MED-PRE", name_ar: "المرحلة التمهيدية للطب", name_en: "Pre-Medical Sciences", degrees: ["MD"], courses: [{ code: "WCBI101", name_en: "Biology for Medicine I", credits: 4 }, { code: "WCBI102", name_en: "Biology for Medicine II", credits: 4 }, { code: "WCCH101", name_en: "Chemistry for Medicine", credits: 4 }, { code: "WCPH101", name_en: "Physics for Medicine", credits: 3 }] },
          { id: "QA-WCMQ-MED-CLIN", name_ar: "الطب السريري", name_en: "Clinical Medicine", degrees: ["MD"], courses: [{ code: "WCMD301", name_en: "Internal Medicine Clerkship", credits: 6 }, { code: "WCMD302", name_en: "Surgery Clerkship", credits: 6 }, { code: "WCMD303", name_en: "Pediatrics Clerkship", credits: 4 }, { code: "WCMD304", name_en: "Psychiatry Clerkship", credits: 3 }, { code: "WCMD401", name_en: "Family Medicine", credits: 4 }] },
        ],
      },
    ],
  },
];
