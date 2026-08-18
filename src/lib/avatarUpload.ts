import { supabase } from "@/integrations/supabase/client";

// Profile pictures are stored in the public `course-covers` bucket under a
// dedicated folder so they can be displayed publicly on teacher pages.
const BUCKET = "course-covers";
const FOLDER = "teacher-avatars";

const extOf = (nameOrType: string) => {
  const fromName = nameOrType.split(".").pop()?.toLowerCase();
  if (fromName && /^(jpe?g|png|webp|gif)$/.test(fromName)) return fromName;
  if (nameOrType.includes("png")) return "png";
  if (nameOrType.includes("webp")) return "webp";
  return "jpg";
};

/** Upload an image blob as a teacher avatar and return its public URL. */
export async function uploadTeacherAvatar(
  file: File | Blob,
  userId: string,
  fileName?: string
): Promise<string> {
  const ext = extOf(fileName || (file as File).name || file.type || "");
  const path = `${FOLDER}/${userId}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Copy an applicant photo from the private tutor-cvs bucket to a public avatar URL. */
export async function copyApplicantPhotoToAvatar(
  photoPath: string,
  userId: string
): Promise<string> {
  const { data, error } = await supabase.storage.from("tutor-cvs").download(photoPath);
  if (error || !data) throw error || new Error("تعذر تحميل الصورة");
  return uploadTeacherAvatar(data, userId, photoPath);
}
