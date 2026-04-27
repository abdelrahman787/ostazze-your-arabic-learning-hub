import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a video through private app storage first, then lets a backend
 * function send it to Bunny.net Stream server-to-server.
 * This avoids browser → Bunny TUS network/CORS failures.
 */
export async function uploadVideoToBunny(
  file: File,
  title: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  onProgress?.(5);
  const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "mp4";
  const storagePath = `bunny-temp/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("lecture-videos")
    .upload(storagePath, file, {
      contentType: file.type || "video/mp4",
      upsert: false,
    });

  if (uploadError) throw uploadError;
  onProgress?.(45);

  const { data, error } = await supabase.functions.invoke("bunny-import-video", {
    body: {
      storagePath,
      title: title || file.name,
      contentType: file.type || "video/mp4",
    },
  });
  if (error) {
    await supabase.storage.from("lecture-videos").remove([storagePath]);
    throw new Error(error.message || "Failed to import video to Bunny");
  }

  const { videoId } = data as { videoId: string };
  if (!videoId) throw new Error("Bunny did not return a video id");
  onProgress?.(100);
  return videoId;
}

/**
 * Fetches a short-lived signed embed URL for a Bunny video tied to a lecture.
 * The URL includes a watermark with the viewer's name + masked email.
 */
export async function getBunnyEmbedUrl(lectureId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("bunny-playback-token", {
    body: { lectureId },
  });
  if (error) throw new Error(error.message || "Failed to get playback token");
  const { embedUrl } = data as { embedUrl: string };
  if (!embedUrl) throw new Error("No embed URL returned");
  return embedUrl;
}
