/** Private storage holding each kind of tutor applicant file (resolved from the server-generated path prefix). */
export const tutorFileBucket = (path: string) =>
  path.startsWith("photo/") ? "tutor-photos" : path.startsWith("legacy-demo/") ? "tutor-legacy-demos" : "tutor-cvs";
