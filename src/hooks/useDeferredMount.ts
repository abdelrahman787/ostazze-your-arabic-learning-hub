import { useEffect, useState } from "react";

/**
 * Returns true once the browser is idle after LCP, OR after the first
 * user interaction (scroll / pointer / key / touch), whichever comes
 * first. Used to defer non-critical widgets so they don't inflate TBT
 * or contend for the main thread during the initial render.
 */
export function useDeferredMount(options?: { timeout?: number; skipIdle?: boolean }): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const timeout = options?.timeout ?? 3500;
    const skipIdle = options?.skipIdle ?? false;

    let done = false;
    const arm = () => {
      if (done) return;
      done = true;
      cleanup();
      setReady(true);
    };

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "touchstart",
      "keydown",
      "scroll",
      "wheel",
    ];
    events.forEach((ev) =>
      window.addEventListener(ev, arm, { once: true, passive: true } as AddEventListenerOptions),
    );

    let ricId: number | undefined;
    let toId: number | undefined;
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
    if (!skipIdle && typeof ric === "function") {
      ricId = ric(arm, { timeout });
    } else {
      toId = window.setTimeout(arm, timeout);
    }

    function cleanup() {
      events.forEach((ev) => window.removeEventListener(ev, arm));
      if (ricId !== undefined && typeof cic === "function") cic(ricId);
      if (toId !== undefined) window.clearTimeout(toId);
    }

    return cleanup;
  }, [ready, options?.timeout, options?.skipIdle]);

  return ready;
}
