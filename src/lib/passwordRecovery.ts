export const RECOVERY_NEXT_PATH = "/reset-password";

const RECOVERY_MARKER_KEY = "ostaze_password_recovery";
const RECOVERY_MARKER_TTL_MS = 10 * 60 * 1000;
const PRODUCTION_HOSTS = new Set(["ostaze.com", "www.ostaze.com"]);
const PRODUCTION_ORIGIN = "https://ostaze.com";

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

/**
 * Single source of truth for every auth callback (sign-up confirmation,
 * password recovery, Google sign-in). ostaze.com / www.ostaze.com and any
 * non-HTTPS origin always resolve to https://ostaze.com/auth/callback. Other
 * HTTPS origins (the Lovable-managed preview and published hosts) keep their
 * exact current origin so the PKCE verifier stays on the same origin.
 */
export function getAuthCallbackUrl(origin: string, next?: string): string {
  const current = new URL(origin);
  const callbackOrigin =
    PRODUCTION_HOSTS.has(current.hostname) || current.protocol !== "https:"
      ? PRODUCTION_ORIGIN
      : current.origin;
  const callback = new URL("/auth/callback", callbackOrigin);
  if (next) callback.searchParams.set("next", next);
  return callback.toString();
}

export function getRecoveryCallbackUrl(origin: string): string {
  return getAuthCallbackUrl(origin, RECOVERY_NEXT_PATH);
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
