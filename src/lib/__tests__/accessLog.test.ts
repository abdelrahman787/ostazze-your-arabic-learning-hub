import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logAccessDenied, logRoleRedirect, logSignedUrlFailure } from "@/lib/accessLog";

describe("accessLog", () => {
  let infoSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    infoSpy.mockRestore();
  });

  it("logs access_denied with required + actual role", () => {
    logAccessDenied("ProtectedRoute", "admin", "student", "/admin");
    expect(infoSpy).toHaveBeenCalledTimes(1);
    const [prefix, type, payload] = infoSpy.mock.calls[0];
    expect(prefix).toBe("[access]");
    expect(type).toBe("access_denied");
    expect(payload).toMatchObject({
      type: "access_denied",
      source: "ProtectedRoute",
      required: "admin",
      actual: "student",
      resource: "/admin",
    });
  });

  it("treats undefined actual as anonymous", () => {
    logAccessDenied("ProtectedRoute", "admin", undefined);
    const [, , payload] = infoSpy.mock.calls[0];
    expect((payload as Record<string, unknown>).actual).toBe("anonymous");
  });

  it("logs role_redirect with from/to in extras", () => {
    logRoleRedirect("SmartDashboard", "/dashboard", "/admin", "admin");
    const [, type, payload] = infoSpy.mock.calls[0];
    expect(type).toBe("role_redirect");
    expect(payload).toMatchObject({
      source: "SmartDashboard",
      actual: "admin",
      resource: "/dashboard",
      extra: { to: "/admin" },
    });
  });

  it("emits signed_url_missing_path when path is null", () => {
    logSignedUrlFailure("lecture-videos", null);
    const [, type, payload] = infoSpy.mock.calls[0];
    expect(type).toBe("signed_url_missing_path");
    expect((payload as Record<string, unknown>).resource).toBe("lecture-videos/<no-path>");
  });

  it("emits signed_url_failure when path is present and includes error message", () => {
    logSignedUrlFailure("lecture-pdfs", "doc.pdf", new Error("RLS denied"));
    const [, type, payload] = infoSpy.mock.calls[0];
    expect(type).toBe("signed_url_failure");
    expect((payload as Record<string, unknown>).resource).toBe("lecture-pdfs/doc.pdf");
    expect((payload as { extra?: { error?: string } }).extra?.error).toBe("RLS denied");
  });
});
