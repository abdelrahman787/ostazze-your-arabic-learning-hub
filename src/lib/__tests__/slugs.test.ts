import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { allUniversities } from "@/data/universities/all";
import { countryPath, universityPath, collegePath, findUniversityBySlugs, isCollegeIndexable, isUniversityIndexable } from "@/lib/slugs";
import { allSubjectSlugs, subjectPath, subjectNameFromSlug, isSubjectIndexable } from "@/lib/subjectSlugs";

const sitemapPaths = () =>
  [...readFileSync(resolve("public/sitemap.xml"), "utf8").matchAll(/<loc>https:\/\/ostaze\.com([^<]*)<\/loc>/g)].map((m) => m[1]);

describe("slugs", () => {
  it("are lowercase and unique", () => {
    const slugs = allSubjectSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/));
  });

  it("round-trip universities and subjects", () => {
    for (const u of allUniversities) {
      const [, , c, us] = universityPath(u).split("/");
      expect(findUniversityBySlugs(c, us)?.id).toBe(u.id);
      for (const d of u.colleges.flatMap((c) => c.departments)) {
        expect(subjectNameFromSlug(subjectPath(d.name_en).split("/")[2])).toBe(d.name_en);
      }
    }
  });

  it("match the sitemap generator exactly", () => {
    const expected = new Set<string>();
    for (const u of allUniversities) {
      expected.add(countryPath(u.country_code));
      if (!isUniversityIndexable(u)) continue;
      expected.add(universityPath(u));
      u.colleges.forEach((c) => isCollegeIndexable(c) && expected.add(collegePath(u, c)));
    }
    allSubjectSlugs().filter((s) => isSubjectIndexable(subjectNameFromSlug(s)!)).forEach((s) => expected.add(`/subjects/${s}`));
    const inSitemap = new Set(sitemapPaths().filter((p) => /^\/(universities|subjects)\//.test(p)));
    expect([...inSitemap].sort()).toEqual([...expected].sort());
  });
});
