import { useEffect, useState } from "react";

/**
 * Route loading skeleton shown while a lazy page chunk resolves.
 * - Delays visibility ~120ms to avoid flashing on fast (cached) navigations.
 * - Uses neutral placeholder blocks that match the general page rhythm
 *   (page header + card grid) so mobile transitions feel continuous
 *   instead of blank-white.
 * - Purely presentational; does not touch any provider/context state.
 */
const RouteSkeleton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`min-h-[60vh] pt-page transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Header block */}
        <div className="mb-6 space-y-3">
          <div className="h-7 w-2/3 max-w-md rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-1/2 max-w-sm rounded-md bg-muted/70 animate-pulse" />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-card/50 p-4 shadow-sm"
            >
              <div className="mb-4 h-32 w-full rounded-xl bg-muted animate-pulse" />
              <div className="mb-2 h-4 w-3/4 rounded-md bg-muted animate-pulse" />
              <div className="h-3 w-1/2 rounded-md bg-muted/70 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteSkeleton;
