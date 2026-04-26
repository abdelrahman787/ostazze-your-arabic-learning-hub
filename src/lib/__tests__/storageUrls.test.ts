import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the supabase client BEFORE importing the module under test
const createSignedUrlMock = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    storage: {
      from: () => ({ createSignedUrl: createSignedUrlMock }),
    },
  },
}));

import { extractStoragePath, getSignedFileUrl } from "@/lib/storageUrls";

describe("extractStoragePath", () => {
  it("returns null for null/undefined/empty input", () => {
    expect(extractStoragePath(null, "lecture-videos")).toBeNull();
    expect(extractStoragePath(undefined, "lecture-videos")).toBeNull();
    expect(extractStoragePath("", "lecture-videos")).toBeNull();
  });

  it("passes through bare object paths", () => {
    expect(extractStoragePath("1700000000-abc.mp4", "lecture-videos"))
      .toBe("1700000000-abc.mp4");
    expect(extractStoragePath("course-id/123-xyz.mp4", "lecture-videos"))
      .toBe("course-id/123-xyz.mp4");
  });

  it("extracts path from public Supabase URLs", () => {
    const url = "https://abc.supabase.co/storage/v1/object/public/lecture-videos/1700-foo.mp4";
    expect(extractStoragePath(url, "lecture-videos")).toBe("1700-foo.mp4");
  });

  it("extracts path from signed Supabase URLs and strips query string", () => {
    const url = "https://abc.supabase.co/storage/v1/object/sign/lecture-pdfs/folder/file.pdf?token=xyz";
    expect(extractStoragePath(url, "lecture-pdfs")).toBe("folder/file.pdf");
  });

  it("extracts path from authenticated URLs", () => {
    const url = "https://abc.supabase.co/storage/v1/object/authenticated/chat-audio/u1/clip.webm";
    expect(extractStoragePath(url, "chat-audio")).toBe("u1/clip.webm");
  });

  it("falls back to last bucket occurrence when path doesn't match known markers", () => {
    const url = "https://cdn.example.com/lecture-videos/legacy/path.mp4";
    expect(extractStoragePath(url, "lecture-videos")).toBe("legacy/path.mp4");
  });
});

describe("getSignedFileUrl", () => {
  beforeEach(() => {
    createSignedUrlMock.mockReset();
  });

  it("returns null when path cannot be resolved", async () => {
    const url = await getSignedFileUrl("lecture-videos", null);
    expect(url).toBeNull();
    expect(createSignedUrlMock).not.toHaveBeenCalled();
  });

  it("returns signed URL on success", async () => {
    createSignedUrlMock.mockResolvedValueOnce({
      data: { signedUrl: "https://signed.example/file?token=abc" },
      error: null,
    });
    const url = await getSignedFileUrl("lecture-videos", "1700-foo.mp4", 600);
    expect(url).toBe("https://signed.example/file?token=abc");
  });

  it("returns null when supabase returns an error (e.g. RLS denial)", async () => {
    createSignedUrlMock.mockResolvedValueOnce({
      data: null,
      error: { message: "Object not allowed" },
    });
    const url = await getSignedFileUrl("lecture-videos", "1700-foo.mp4");
    expect(url).toBeNull();
  });

  it("returns null when no signedUrl is present in response", async () => {
    createSignedUrlMock.mockResolvedValueOnce({ data: {}, error: null });
    const url = await getSignedFileUrl("lecture-pdfs", "doc.pdf");
    expect(url).toBeNull();
  });
});
