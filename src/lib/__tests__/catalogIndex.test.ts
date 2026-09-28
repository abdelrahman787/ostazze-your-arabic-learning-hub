import { it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { allUniversities } from "@/data/universities/all";
import {
  buildCatalogIndex,
  renderUniversityIndexModule,
  renderSubjectIndexModule,
} from "@/data/universities/buildIndex";

// The generated indexes must be derived from the current per-country data (run `npm run catalog:index`).
it("generated catalog indexes are up to date", () => {
  const idx = buildCatalogIndex(allUniversities);
  expect(
    readFileSync("src/data/universities/universityIndex.generated.ts", "utf8"),
  ).toBe(renderUniversityIndexModule(idx));
  expect(
    readFileSync("src/data/universities/subjectIndex.generated.ts", "utf8"),
  ).toBe(renderSubjectIndexModule(idx));
});

it("has no duplicate universities across country modules", () => {
  const ids = allUniversities.map((u) => u.id);
  expect(new Set(ids).size).toBe(ids.length);
});
