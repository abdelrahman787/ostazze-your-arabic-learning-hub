import { it, expect } from "vitest";
import { allUniversities } from "@/data/universities/all";
import { UNIVERSITY_COUNT } from "@/data/catalogStats";
it("UNIVERSITY_COUNT matches the catalog", () => expect(UNIVERSITY_COUNT).toBe(allUniversities.length));
