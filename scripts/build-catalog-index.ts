// Writes the lightweight catalog indexes from the per-country modules.
import { writeFileSync } from "node:fs";
import { allUniversities } from "../src/data/universities/all";
import {
  buildCatalogIndex,
  renderUniversityIndexModule,
  renderSubjectIndexModule,
} from "../src/data/universities/buildIndex";

const idx = buildCatalogIndex(allUniversities);
writeFileSync(
  "src/data/universities/universityIndex.generated.ts",
  renderUniversityIndexModule(idx),
);
writeFileSync(
  "src/data/universities/subjectIndex.generated.ts",
  renderSubjectIndexModule(idx),
);
console.log(
  `catalog indexes written (${idx.universities.length} universities, ${idx.subjects.length} subjects)`,
);
