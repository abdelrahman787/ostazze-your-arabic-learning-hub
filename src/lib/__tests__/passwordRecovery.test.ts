import { describe, expect, it, vi } from "vitest";
import {
  completeRecoveryCallback,
  getRecoveryCallbackUrl,
  getSafeRecoveryNext,
  hasValidRecoveryMarker,
} from "@/lib/passwordRecovery";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

describe("password recovery", () => {
  it("uses the canonical callback on the production domains", () => {
    expect(getRecoveryCallbackUrl("https://ostaze.com")).toBe(
      "https://ostaze.com/auth/callback?next=%2Freset-password",
    );
    expect(getRecoveryCallbackUrl("https://www.ostaze.com")).toBe(
      "https://ostaze.com/auth/callback?next=%2Freset-password",
    );
  });

  it("keeps the exact active preview origin", () => {
    expect(
      getRecoveryCallbackUrl(
        "https://id-preview--dc7db421-26c3-4945-8236-93600ec382aa.lovable.app",
      ),
    ).toBe(
      "https://id-preview--dc7db421-26c3-4945-8236-93600ec382aa.lovable.app/auth/callback?next=%2Freset-password",
    );
  });

  it("rejects external and unapproved next destinations", () => {
    expect(getSafeRecoveryNext("https://attacker.example")).toBeNull();
    expect(getSafeRecoveryNext("//attacker.example")).toBeNull();
    expect(getSafeRecoveryNext("/admin")).toBeNull();
    expect(getSafeRecoveryNext("/reset-password")).toBe("/reset-password");
  });

  it("exchanges a recovery code before authorizing the reset page", async () => {
    const storage = memoryStorage();
    const auth = {
      exchangeCodeForSession: vi.fn().mockResolvedValue({
        data: {
          session: { user: { id: "owner" } },
          redirectType: "recovery",
        },
        error: null,
      }),
      signOut: vi.fn(),
    };
    const result = await completeRecoveryCallback(
      auth,
      storage,
      { code: "one-time-code", next: "/reset-password" },
      1_000,
    );
    expect(result).toEqual({ ok: true, next: "/reset-password" });
    expect(hasValidRecoveryMarker(storage, "owner", 1_001)).toBe(true);
  });

  it("fails safely for missing, expired, invalid, or reused codes", async () => {
    const storage = memoryStorage();
    const exchangeCodeForSession = vi.fn().mockResolvedValue({
      data: { session: null, redirectType: null },
      error: new Error("invalid code"),
    });
    const auth = { exchangeCodeForSession, signOut: vi.fn() };

    await expect(
      completeRecoveryCallback(auth, storage, {
        code: null,
        next: "/reset-password",
      }),
    ).resolves.toEqual({ ok: false });
    await expect(
      completeRecoveryCallback(auth, storage, {
        code: "expired-or-reused",
        next: "/reset-password",
      }),
    ).resolves.toEqual({ ok: false });
    expect(hasValidRecoveryMarker(storage, "owner")).toBe(false);
  });

  it("rejects a non-recovery code and ends the accidental session", async () => {
    const storage = memoryStorage();
    const signOut = vi.fn().mockResolvedValue({ error: null });
    const auth = {
      exchangeCodeForSession: vi.fn().mockResolvedValue({
        data: {
          session: { user: { id: "owner" } },
          redirectType: "signup",
        },
        error: null,
      }),
      signOut,
    };
    await expect(
      completeRecoveryCallback(auth, storage, {
        code: "wrong-flow-code",
        next: "/reset-password",
      }),
    ).resolves.toEqual({ ok: false });
    expect(signOut).toHaveBeenCalledWith({ scope: "local" });
  });
});