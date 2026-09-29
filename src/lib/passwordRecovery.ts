export const RECOVERY_NEXT_PATH = "/reset-password";

const RECOVERY_MARKER_KEY = "ostaze_password_recovery";
const RECOVERY_MARKER_TTL_MS = 10 * 60 * 1000;
const PRODUCTION_HOSTS = new Set(["ostaze.com", "www.ostaze.com"]);
const PUBLISHED_HOST = "ostazze-learn-hub.lovable.app";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

type RecoverySession = {
  user: { id: string };
};

type RecoveryAuth = {
  exchangeCodeForSession: (code: string) => Promise<{
    data: {
      session: RecoverySession | null;
      redirectType?: string | null;
    };
    error: unknown;
  }>;
  signOut: (options?: { scope?: "local" }) => Promise<unknown>;
};

export type RecoveryCallbackResult =
  { ok: true; next: typeof RECOVERY_NEXT_PATH } | { ok: false };

export function getRecoveryCallbackUrl(origin: string): string {
  const current = new URL(origin);
  const callbackOrigin =
    PRODUCTION_HOSTS.has(current.hostname) ||
    current.hostname === PUBLISHED_HOST
      ? "https://ostaze.com"
      : current.origin;
  const callback = new URL("/auth/callback", callbackOrigin);
  callback.searchParams.set("next", RECOVERY_NEXT_PATH);
  return callback.toString();
}

export function getSafeRecoveryNext(
  value: string | null,
): typeof RECOVERY_NEXT_PATH | null {
  return value === RECOVERY_NEXT_PATH ? RECOVERY_NEXT_PATH : null;
}

export async function completeRecoveryCallback(
  auth: RecoveryAuth,
  storage: StorageLike,
  input: { code: string | null; next: string | null },
  now = Date.now(),
): Promise<RecoveryCallbackResult> {
  const next = getSafeRecoveryNext(input.next);
  if (!next || !input.code) return { ok: false };

  try {
    const { data, error } = await auth.exchangeCodeForSession(input.code);
    if (error || !data.session?.user.id || data.redirectType !== "recovery") {
      if (data.session) await auth.signOut({ scope: "local" });
      return { ok: false };
    }

    storage.setItem(
      RECOVERY_MARKER_KEY,
      JSON.stringify({
        userId: data.session.user.id,
        expiresAt: now + RECOVERY_MARKER_TTL_MS,
      }),
    );
    return { ok: true, next };
  } catch {
    return { ok: false };
  }
}

export function hasValidRecoveryMarker(
  storage: StorageLike,
  userId: string,
  now = Date.now(),
): boolean {
  const value = storage.getItem(RECOVERY_MARKER_KEY);
  if (!value) return false;
  try {
    const parsed = JSON.parse(value) as {
      userId?: unknown;
      expiresAt?: unknown;
    };
    const valid =
      parsed.userId === userId &&
      typeof parsed.expiresAt === "number" &&
      parsed.expiresAt > now;
    if (!valid) storage.removeItem(RECOVERY_MARKER_KEY);
    return valid;
  } catch {
    storage.removeItem(RECOVERY_MARKER_KEY);
    return false;
  }
}

export function clearRecoveryMarker(storage: StorageLike): void {
  storage.removeItem(RECOVERY_MARKER_KEY);
}
