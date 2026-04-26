// Shared sizing logic for country flags.
// The flag artwork is normalized to a 2:1 canvas so Kuwait and Qatar render
// with identical visual width/height and never depend on SVG intrinsic quirks.

export const FLAG_RATIOS: Record<string, number> = {
  KW: 2, // Kuwait — official 2:1
  QA: 2, // Qatar — normalized UI asset ratio for parity with Kuwait
};

// Largest official ratio across all supported flags. Used to cap the
// uniform height so even the widest flag still fits inside the square
// container without overflowing or being cropped.
const MAX_RATIO = Math.max(...Object.values(FLAG_RATIOS));

// Maximum share of the container the flag width is allowed to consume.
// Leaves a small breathing margin around the flag inside the square.
const MAX_WIDTH_FRACTION = 0.9;

export interface FlagDimensions {
  width: number;
  height: number;
  ratio: number;
}

export function getFlagRatio(code: string): number {
  return FLAG_RATIOS[code] ?? 1.5;
}

/**
 * Compute a flag's rendered pixel dimensions inside a square container.
 *
 * - height is identical across all countries (so KW and QA align visually)
 * - width follows the normalized asset ratio (no cropping, no distortion)
 * - both width and height always fit inside the container at every size
 */
export function getFlagDimensions(code: string, containerSize: number): FlagDimensions {
  const ratio = getFlagRatio(code);
  // Cap height so widest flag (MAX_RATIO) stays within MAX_WIDTH_FRACTION of container.
  const maxHeightForWidth = (containerSize * MAX_WIDTH_FRACTION) / MAX_RATIO;
  const height = Math.round(maxHeightForWidth);
  const width = Math.round(height * ratio);
  return { width, height, ratio };
}
