import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a video file to Bunny.net Stream in two steps:
 *  1. Call edge function `bunny-create-video` to create an empty video entry
 *     and get a direct PUT upload URL + AccessKey header.
 *  2. PUT the file bytes directly to Bunny (browser → Bunny CDN).
 *
 * Returns the Bunny video GUID to store in the `lectures.bunny_video_id` column.
 */
export async function uploadVideoToBunny(
  file: File,
  title: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  // Step 1 — create video entry
  const { data, error } = await supabase.functions.invoke("bunny-create-video", {
    body: { title },
  });
  if (error) throw new Error(error.message || "Failed to create Bunny video");
  const { videoId, uploadUrl, uploadHeaders } = data as {
    videoId: string;
    uploadUrl: string;
    uploadHeaders: Record<string, string>;
  };
  if (!videoId || !uploadUrl) throw new Error("Bunny did not return upload info");

  // Step 2 — direct PUT upload with progress via XHR
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    Object.entries(uploadHeaders).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable && onProgress) {
        onProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Bunny upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error during Bunny upload"));
    xhr.send(file);
  });

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
