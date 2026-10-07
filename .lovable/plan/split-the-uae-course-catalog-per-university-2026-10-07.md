# Split the UAE course catalog per university

## Confirmed problem
The UAE data file is 6.8 MB. Opening any UAE university, college or subject page downloads and parses all 11 UAE universities, even though one university is only 60–820 KB (UAEU is the largest). Kuwait and Qatar have the same pattern on a smaller scale.

## What changes for visitors
UAE pages load only the university they show. Subject pages load only the universities that teach that subject. Content, addresses, page titles and the sitemap stay exactly the same.

## Technical details
- `scripts/split-catalog.ts` (new, one-off and re-runnable): writes `src/data/universities/unis/<country>/<id>.ts` (compact JSON, one university per file) from the current country files. Country files `ae.ts` and the others become thin re-exports used only by `all.ts` (scripts and tests), so nothing changes there.
- `loader.ts`: add `loadUniversity(id)` using `import.meta.glob("./unis/*/*.ts")` (one chunk per university, cached). `loadCountry(code)` now loads that country's universities in parallel and keeps its order from `UNIVERSITY_INDEX`. Add `useUniversities(ids)`, built like `useCountryUniversities`.
- `buildIndex.ts`: add `universityIds` per subject to `SUBJECT_INDEX`, then regenerate the indexes.
- Callers:
  - `routeGuards.requireCollege` and the university guard load a single university.
  - `CollegeDetail` loads one university.
  - The subject route loader and `Subjects.tsx` load only that subject's `universityIds`.
  - `Universities.tsx` country lists keep using summaries from `UNIVERSITY_INDEX` where possible. Otherwise they load the country.
  - The admin and tutor course pickers keep `loadAllUniversities` (they're admin-only and loaded on demand).
- Record the rule in AGENTS.md: "University data is split per university; pages load only the universities they render."

## Verification
- Production build: the largest UAE chunk becomes the UAEU file instead of the whole country.
- Typecheck, the 31 automated tests (catalog index test updated), sitemap generation (still 510 pages) and the live sitemap audit all pass.
- Homepage stays at or under 180 KB.
- Spot-check a UAE college, a UAE university and a mixed-country subject page in Arabic and English.
