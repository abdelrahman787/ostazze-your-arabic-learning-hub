// Writes src/data/universities/catalog.generated.ts (lightweight index) from the per-country modules.
import { writeFileSync } from "node:fs";
import { allUniversities } from "../src/data/universities/all";
import { buildCatalogIndex, renderCatalogModule } from "../src/data/universities/buildIndex";

writeFileSync("src/data/universities/catalog.generated.ts", renderCatalogModule(buildCatalogIndex(allUniversities)));
console.log(`catalog index written (${allUniversities.length} universities)`);
