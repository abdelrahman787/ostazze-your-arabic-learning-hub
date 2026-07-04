## Goal
Generate one Excel file containing every course/material (physics, math, etc.) from every university across all countries in the site, and deliver it as a downloadable artifact.

## Source
`src/data/universitiesData.ts` — the `allUniversities` array (Kuwait, Qatar, KSA, and any others). Each university → colleges → departments → courses.

## Output
`/mnt/documents/ostazze_all_materials.xlsx`

### Sheet 1 — "All Courses" (flat, one row per course)
Columns:
- Country (EN) | Country (AR)
- University (EN) | University (AR)
- College (EN) | College (AR)
- Department (EN) | Department (AR)
- Subject Group (e.g. Physics, Mathematics — derived via `src/lib/courseSubjectMap.ts` `resolveCourseSubject`)
- Course Code
- Course Name (EN) | Course Name (AR)
- Credits
- Type (Required/Elective, when present)

Frozen header row, bold header, autosized columns, autofilter enabled.

### Sheet 2 — "By Subject"
Pivot-style summary: Subject Group → count of courses, list of countries offering it. Helps the user see all "Physics" or "Math" materials at a glance.

### Sheet 3 — "Universities Summary"
Country | University | # Colleges | # Departments | # Courses.

## Approach
1. Parse `universitiesData.ts` in a Node script (import the module directly with `tsx`) to guarantee identical data to the site — no re-parsing risks.
2. Walk the tree, deduplicate exact `(university, code, name_en)` duplicates.
3. Use `exceljs` (or `xlsx`) to build the workbook with formatting.
4. Save to `/mnt/documents/`, then present with `<presentation-artifact>`.

## Deliverable
A single `.xlsx` the user can download, then a short confirmation message.
