/**
 * Registered-students counter that grows by 1–2 every day.
 * Deterministic: the same date always yields the same number,
 * so the value is stable across reloads and devices.
 */
const BASE_DATE = Date.UTC(2026, 7, 20); // 2026-08-20
const BASE_COUNT = 3326;
const DAY_MS = 86_400_000;

export function getRegisteredStudents(now: Date = new Date()): number {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const days = Math.floor((today - BASE_DATE) / DAY_MS);
  if (days <= 0) return BASE_COUNT;

  let total = BASE_COUNT;
  for (let i = 1; i <= days; i++) {
    // deterministic pseudo-random 1 or 2 per day
    const h = Math.sin(i * 12.9898) * 43758.5453;
    total += (h - Math.floor(h)) < 0.5 ? 1 : 2;
  }
  return total;
}
