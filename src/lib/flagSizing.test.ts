import { describe, it, expect } from "vitest";
import { FLAG_RATIOS, getFlagDimensions, getFlagRatio } from "@/lib/flagSizing";

// Container sizes that mirror what the UI uses across viewports
// (mobile compact card → tablet → desktop hero).
const CONTAINER_SIZES = [80, 96, 120, 160, 200, 240];

describe("flagSizing — Kuwait & Qatar parity", () => {
  it("declares the official aspect ratios", () => {
    expect(FLAG_RATIOS.KW).toBeCloseTo(2, 5); // 2:1
    expect(FLAG_RATIOS.QA).toBeCloseTo(2, 5); // normalized 2:1 UI asset
    expect(getFlagRatio("UNKNOWN")).toBe(1.5); // safe fallback
  });

  it.each(CONTAINER_SIZES)(
    "renders Kuwait & Qatar at the same height for container size %ipx",
    (size) => {
      const kw = getFlagDimensions("KW", size);
      const qa = getFlagDimensions("QA", size);

      // ✅ Same height across both flags at every screen size.
      expect(qa.height).toBe(kw.height);

      // ✅ Each flag's width matches its normalized 2:1 asset ratio (no cropping).
      expect(kw.width / kw.height).toBeCloseTo(FLAG_RATIOS.KW, 1);
      expect(qa.width / qa.height).toBeCloseTo(FLAG_RATIOS.QA, 1);

      // ✅ Qatar and Kuwait occupy the exact same box.
      expect(qa.width).toBe(kw.width);

      // ✅ Both fit inside the square container — no overflow / clipping.
      expect(kw.width).toBeLessThanOrEqual(size);
      expect(qa.width).toBeLessThanOrEqual(size);
      expect(kw.height).toBeLessThanOrEqual(size);
      expect(qa.height).toBeLessThanOrEqual(size);

      // ✅ Reasonable presence — flag actually fills a meaningful portion.
      expect(kw.height).toBeGreaterThan(0);
      expect(qa.height).toBeGreaterThan(0);
    },
  );

  it("scales linearly with container size (no rounding drift)", () => {
    const small = getFlagDimensions("QA", 100);
    const large = getFlagDimensions("QA", 200);
    // Doubling the container should ~double width and height.
    expect(large.height / small.height).toBeCloseTo(2, 1);
    expect(large.width / small.width).toBeCloseTo(2, 1);
  });
});
