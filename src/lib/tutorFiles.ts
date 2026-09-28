/** New applicant photos live in the private tutor-photos bucket under photo/; everything else (CVs, legacy files) is in tutor-cvs. */
export const tutorFileBucket = (path: string) => (path.startsWith("photo/") ? "tutor-photos" : "tutor-cvs");
