import { supabase } from "@/integrations/supabase/client";
import { logSignedUrlFailure } from "@/lib/accessLog";

/**
 * Extract the storage object path from a stored value that may be either:
 *  - A full Supabase public URL like `https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>`
 *  - A bare object path like `1700000000-abc.mp4` or `course-id/123-xyz.mp4`
 */
export function extractStoragePath(stored: string | null | undefined, bucket: string): string | null {
  if (!stored) return null;
  // Already a path?
  if (!/^https?:\/\//i.test(stored)) return stored;

  // Try to find the marker `/object/public/<bucket>/` or `/object/sign/<bucket>/` or `/<bucket>/`
  const markers = [
    `/object/public/${bucket}/`,
    `/object/sign/${bucket}/`,
    `/object/authenticated/${bucket}/`,
  ];
  for (const m of markers) {
    const idx = stored.indexOf(m);
    if (idx !== -1) {
      const after = stored.slice(idx + m.length);
      // Strip query string (e.g. ?token=...)
      return after.split("?")[0];
    }
  }
  // Fallback: take the path after the last `/<bucket>/` occurrence
  const fallback = stored.split(`/${bucket}/`).pop();
  return fallback ? fallback.split("?")[0] : null;
}

/**
 * Generate a short-lived signed URL for a stored value (URL or path).
 * Returns null if path can't be resolved or signing fails.
 *
 * @param expiresIn Seconds the URL is valid (default: 1 hour).
 */
export async function getSignedFileUrl(
  bucket: string,
  storedValue: string | null | undefined,
  expiresIn = 3600
): Promise<string | null> {
  const path = extractStoragePath(storedValue, bucket);
  if (!path) {
    logSignedUrlFailure(bucket, null);
    return null;
  }

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) {
    logSignedUrlFailure(bucket, path, error);
    return null;
  }
  return data.signedUrl;
}
