import { supabase } from "@/integrations/supabase/client";
import * as tus from "tus-js-client";

/**
 * Uploads a video to Bunny.net Stream using the TUS resumable protocol.
 * TUS is officially CORS-enabled by Bunny, unlike the direct PUT endpoint.
 *
 * Steps:
 *  1. Edge function `bunny-create-video` creates the video entry and returns
 *     a signed authorization for TUS.
 *  2. Browser uploads the file in chunks to https://video.bunnycdn.com/tusupload
 *     using the tus-js-client library.
 */
export async function uploadVideoToBunny(
  file: File,
  title: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  // Step 1 — create video entry + get TUS signature
  const { data, error } = await supabase.functions.invoke("bunny-create-video", {
    body: { title },
  });
  if (error) throw new Error(error.message || "Failed to create Bunny video");
  const {
    videoId,
    libraryId,
    authorizationSignature,
    authorizationExpire,
    tusEndpoint,
  } = data as {
    videoId: string;
    libraryId: string;
    authorizationSignature: string;
    authorizationExpire: number;
    tusEndpoint: string;
  };
  if (!videoId || !authorizationSignature) {
    throw new Error("Bunny did not return upload info");
  }

  // Step 2 — TUS resumable upload (CORS supported)
  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: tusEndpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        AuthorizationSignature: authorizationSignature,
        AuthorizationExpire: String(authorizationExpire),
        VideoId: videoId,
        LibraryId: libraryId,
      },
      metadata: {
        filetype: file.type,
        title,
      },
      onError: (err) => reject(err),
      onProgress: (sent, total) => {
        if (onProgress) onProgress(Math.round((sent / total) * 100));
      },
      onSuccess: () => resolve(),
    });
    upload.start();
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
