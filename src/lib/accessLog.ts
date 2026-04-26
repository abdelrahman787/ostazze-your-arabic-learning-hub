/**
 * Lightweight client-side access/observability logger.
 *
 * Centralizes how we report:
 *  - Access-denied events (role mismatch, ProtectedRoute rejections)
 *  - Signed URL failures (storage 403/404, sign errors)
 *  - Role-based redirects (e.g. admin landing on /dashboard → /admin)
 *
 * Logs are emitted to the console with a stable prefix so they can be
 * filtered easily in DevTools or piped to an external collector later.
 *
 * Future: swap console.* for a network beacon to a logging endpoint.
 */

type AccessEventType =
  | "access_denied"
  | "role_redirect"
  | "signed_url_failure"
  | "signed_url_missing_path";

interface AccessEvent {
  type: AccessEventType;
  /** Where the event happened (component/page name). */
  source: string;
  /** Required role / expected condition, if applicable. */
  required?: string;
  /** Actual role of the current user, if applicable. */
  actual?: string;
  /** Resource being accessed (route, bucket/path, etc.). */
  resource?: string;
  /** Free-form extra context. */
  extra?: Record<string, unknown>;
}

const PREFIX = "[access]";

export function logAccessEvent(event: AccessEvent) {
  const payload = {
    ts: new Date().toISOString(),
    ...event,
  };
  // eslint-disable-next-line no-console
  console.info(PREFIX, event.type, payload);
}

export function logAccessDenied(
  source: string,
  required: string,
  actual: string | undefined,
  resource?: string
) {
  logAccessEvent({
    type: "access_denied",
    source,
    required,
    actual: actual ?? "anonymous",
    resource,
  });
}

export function logRoleRedirect(
  source: string,
  from: string,
  to: string,
  role: string
) {
  logAccessEvent({
    type: "role_redirect",
    source,
    actual: role,
    resource: from,
    extra: { to },
  });
}

export function logSignedUrlFailure(
  bucket: string,
  path: string | null | undefined,
  error?: unknown
) {
  logAccessEvent({
    type: path ? "signed_url_failure" : "signed_url_missing_path",
    source: "storageUrls",
    resource: `${bucket}/${path ?? "<no-path>"}`,
    extra: error ? { error: String((error as Error)?.message ?? error) } : undefined,
  });
}
