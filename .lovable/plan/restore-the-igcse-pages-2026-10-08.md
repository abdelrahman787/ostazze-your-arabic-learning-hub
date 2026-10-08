# Restore the IGCSE pages

## Changes
- Move the existing IGCSE course catalog and course-detail screens back into the live application.
- Restore `/igcse` and `/igcse/:courseId` with real not-found handling for unknown courses.
- Add IGCSE to desktop and mobile navigation so visitors can reach it again.
- Keep the existing course prices, teachers, bilingual copy, local-currency display, and WhatsApp enrollment flow unchanged.

## Verification
- Confirm the catalog and a course detail page render in Arabic and English.
- Confirm navigation works on desktop and mobile, and invalid course URLs return the not-found page.
- Check the preview build for errors. Do not publish.

## Technical details
- Use TanStack file routes and the existing drafted React screens.
- Add route-specific title, description, Open Graph, and Twitter metadata.
- Keep IGCSE routes excluded from the sitemap, matching the current indexing policy.
