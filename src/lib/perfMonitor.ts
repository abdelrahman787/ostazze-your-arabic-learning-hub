/**
 * Lightweight performance monitor for Lovable preview / dev mode.
 * Tracks Core Web Vitals (LCP, CLS) and detects long tasks that may
 * cause animation jank, then logs developer-facing warnings.
 *
 * Production-safe: only logs to console (no UI side effects),
 * uses native PerformanceObserver, and silently no-ops on unsupported
 * browsers.
 */

type PerfThresholds = {
  lcpMs: number;       // Largest Contentful Paint warning threshold
  clsScore: number;    // Cumulative Layout Shift warning threshold
  longTaskMs: number;  // Single long task duration threshold
  longTaskBudgetMs: number; // Total long-task time within window
  windowMs: number;    // Window for accumulating long tasks
};

const DEFAULTS: PerfThresholds = {
  lcpMs: 2500,
  clsScore: 0.1,
  longTaskMs: 50,
  longTaskBudgetMs: 200,
  windowMs: 3000,
};

const tag = "%c[OSTAZE/perf]";
const tagStyle = "background:#E84E0F;color:#fff;padding:2px 6px;border-radius:4px;font-weight:bold";

let started = false;

export function startPerfMonitor(thresholds: Partial<PerfThresholds> = {}) {
  if (started || typeof window === "undefined") return;
  started = true;
  const t = { ...DEFAULTS, ...thresholds };

  // ---- LCP ----
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      const time = (last as any).renderTime || (last as any).loadTime || last.startTime;
      const level = time > t.lcpMs ? "warn" : "log";
      console[level](tag, tagStyle, `LCP: ${Math.round(time)}ms${time > t.lcpMs ? "  ⚠ slow" : "  ✓"}`);
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    /* unsupported */
  }

  // ---- CLS ----
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      const level = clsValue > t.clsScore ? "warn" : "log";
      console[level](tag, tagStyle, `CLS: ${clsValue.toFixed(3)}${clsValue > t.clsScore ? "  ⚠ layout shift" : ""}`);
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });
  } catch {
    /* unsupported */
  }

  // ---- Long tasks → animation jank detection ----
  try {
    const recent: { end: number; dur: number }[] = [];
    let warned = false;

    const longTaskObserver = new PerformanceObserver((list) => {
      const now = performance.now();
      for (const entry of list.getEntries()) {
        if (entry.duration >= t.longTaskMs) {
          recent.push({ end: entry.startTime + entry.duration, dur: entry.duration });
        }
      }
      // Drop entries outside the rolling window
      while (recent.length && now - recent[0].end > t.windowMs) {
        recent.shift();
      }
      const total = recent.reduce((s, r) => s + r.dur, 0);
      if (total > t.longTaskBudgetMs && !warned) {
        warned = true;
        console.warn(
          tag,
          tagStyle,
          `Animation jank likely: ${recent.length} long tasks consumed ${Math.round(total)}ms in the last ${t.windowMs}ms. ` +
            `Consider deferring heavy work, lazy-loading routes, or reducing CSS filters/blurs.`
        );
        // Re-enable warnings after a cooldown so we don't spam the console.
        setTimeout(() => {
          warned = false;
        }, 5000);
      }
    });
    longTaskObserver.observe({ type: "longtask", buffered: true });
  } catch {
    /* unsupported */
  }
}
