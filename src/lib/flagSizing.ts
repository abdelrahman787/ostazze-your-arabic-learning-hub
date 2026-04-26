// Shared sizing logic for country flags.
// Keeps the same HEIGHT across countries (visual balance) while letting
// each flag's WIDTH follow its true official aspect ratio.

export const FLAG_RATIOS: Record<string, number> = {
  KW: 2, // Kuwait — official 2:1
  QA: 28 / 11, // Qatar — official 28:11 (~2.545)
};

export const FLAG_HEIGHT_RATIO = 0.55; // share of container size used for height

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
 * - width follows the official aspect ratio (no cropping, no distortion)
 */
export function getFlagDimensions(code: string, containerSize: number): FlagDimensions {
  const ratio = getFlagRatio(code);
  const height = Math.round(containerSize * FLAG_HEIGHT_RATIO);
  const width = Math.round(height * ratio);
  return { width, height, ratio };
}
