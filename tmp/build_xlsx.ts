import ExcelJS from "exceljs";
import { allUniversities } from "/tmp/uni.ts";
import { resolveCourseSubject } from "/dev-server/src/lib/courseSubjectMap.ts";

type Row = {
  countryEn: string; countryAr: string;
  uniEn: string; uniAr: string;
  collegeEn: string; collegeAr: string;
  deptEn: string; deptAr: string;
  subject: string;
  code: string; nameEn: string; nameAr: string;
  credits: number | string; type: string;
};

const rows: Row[] = [];
const seen = new Set<string>();

for (const u of allUniversities) {
  for (const col of u.colleges) {
    for (const dep of col.departments) {
      for (const c of dep.courses) {
        const key = `${u.id}|${c.code}|${c.name_en}`;
        if (seen.has(key)) continue;
        seen.add(key);
        rows.push({
          countryEn: u.country_en, countryAr: u.country_ar,
          uniEn: u.name_en, uniAr: u.name_ar,
          collegeEn: col.name_en, collegeAr: col.name_ar,
          deptEn: dep.name_en, deptAr: dep.name_ar,
          subject: resolveCourseSubject(c.code, { ar: dep.name_ar, en: dep.name_en }, "en"),
          code: c.code, nameEn: c.name_en, nameAr: c.name_ar,
          credits: c.credits ?? "", type: c.type ?? "",
        });
      }
    }
  }
}

console.log(`Total course rows: ${rows.length}`);

const wb = new ExcelJS.Workbook();
wb.creator = "OSTAZZE";
wb.created = new Date();

// Sheet 1
const s1 = wb.addWorksheet("All Courses", { views: [{ state: "frozen", ySplit: 1 }] });
s1.columns = [
  { header: "Country (EN)", key: "countryEn", width: 14 },
  { header: "Country (AR)", key: "countryAr", width: 14 },
  { header: "University (EN)", key: "uniEn", width: 32 },
  { header: "University (AR)", key: "uniAr", width: 28 },
  { header: "College (EN)", key: "collegeEn", width: 32 },
  { header: "College (AR)", key: "collegeAr", width: 28 },
  { header: "Department (EN)", key: "deptEn", width: 36 },
  { header: "Department (AR)", key: "deptAr", width: 32 },
  { header: "Subject Group", key: "subject", width: 22 },
  { header: "Course Code", key: "code", width: 14 },
  { header: "Course Name (EN)", key: "nameEn", width: 44 },
  { header: "Course Name (AR)", key: "nameAr", width: 36 },
  { header: "Credits", key: "credits", width: 8 },
  { header: "Type", key: "type", width: 12 },
];
s1.addRows(rows);
s1.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
s1.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE84E0F" } };
s1.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
s1.getRow(1).height = 22;
s1.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 14 } };

// Sheet 2 — By Subject
const bySubject = new Map<string, { count: number; countries: Set<string>; unis: Set<string> }>();
for (const r of rows) {
  const key = r.subject || "Uncategorized";
  const e = bySubject.get(key) ?? { count: 0, countries: new Set(), unis: new Set() };
  e.count++;
  e.countries.add(r.countryEn);
  e.unis.add(r.uniEn);
  bySubject.set(key, e);
}
const s2 = wb.addWorksheet("By Subject", { views: [{ state: "frozen", ySplit: 1 }] });
s2.columns = [
  { header: "Subject Group", key: "subject", width: 28 },
  { header: "# Courses", key: "count", width: 12 },
  { header: "# Universities", key: "unis", width: 14 },
  { header: "Countries", key: "countries", width: 40 },
];
[...bySubject.entries()]
  .sort((a, b) => b[1].count - a[1].count)
  .forEach(([k, v]) => s2.addRow({ subject: k, count: v.count, unis: v.unis.size, countries: [...v.countries].sort().join(", ") }));
s2.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
s2.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE84E0F" } };
s2.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 4 } };

// Sheet 3 — Universities Summary
const s3 = wb.addWorksheet("Universities", { views: [{ state: "frozen", ySplit: 1 }] });
s3.columns = [
  { header: "Country", key: "country", width: 16 },
  { header: "University (EN)", key: "uniEn", width: 36 },
  { header: "University (AR)", key: "uniAr", width: 30 },
  { header: "# Colleges", key: "colleges", width: 12 },
  { header: "# Departments", key: "depts", width: 14 },
  { header: "# Courses", key: "courses", width: 12 },
];
for (const u of allUniversities) {
  const depts = u.colleges.reduce((s, c) => s + c.departments.length, 0);
  const courses = u.colleges.reduce((s, c) => s + c.departments.reduce((s2, d) => s2 + d.courses.length, 0), 0);
  s3.addRow({ country: u.country_en, uniEn: u.name_en, uniAr: u.name_ar, colleges: u.colleges.length, depts, courses });
}
s3.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
s3.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE84E0F" } };
s3.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 6 } };

await wb.xlsx.writeFile("/mnt/documents/ostazze_all_materials.xlsx");
console.log("Done.");
