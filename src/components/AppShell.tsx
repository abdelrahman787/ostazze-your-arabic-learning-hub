import {
  Component,
  ErrorInfo,
  ReactNode,
  Suspense,
  lazy,
  useEffect,
} from "react";
import { useLocation } from "@/lib/router-compat";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import RouteSkeleton from "@/components/RouteSkeleton";
import { useDeferredMount } from "@/hooks/useDeferredMount";

const Toaster = lazy(() =>
  import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })),
);
const Sonner = lazy(() =>
  import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })),
);
const FloatingWhatsApp = lazy(() => import("@/components/FloatingWhatsApp"));
const AIChatWidget = lazy(() => import("@/components/AIChatWidget"));
const CookieConsent = lazy(() => import("@/components/CookieConsent"));
const CountryGate = lazy(() => import("@/components/CountryGate"));
const WhatsAppNumberGate = lazy(
  () => import("@/components/WhatsAppNumberGate"),
);

const RouteFallback = () => <RouteSkeleton />;

class NonCriticalBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("[OSTAZE] Deferred widget skipped:", error, errorInfo);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

const DeferredWidgets = () => {
  // Keep non-critical widgets out of the cold-load path and don't trigger
  // chunk fetches on first tap/scroll, which can cause stale mobile caches to reload.
  const ready = useDeferredMount({
    timeout: 8000,
    skipIdle: true,
    onInteraction: false,
  });
  if (!ready) return null;
  return (
    <NonCriticalBoundary>
      <Suspense fallback={null}>
        <Toaster />
        <Sonner />
        <FloatingWhatsApp />
        <AIChatWidget />
        <CookieConsent />
        <CountryGate>{null}</CountryGate>
        <WhatsAppNumberGate />
      </Suspense>
    </NonCriticalBoundary>
  );
};

/** Warm the most likely next route chunks once the browser is idle. */
export const IdlePrefetch = () => {
  useEffect(() => {
    const run = () => {
      import("@/pages/Universities");
      import("@/pages/Teachers");
      import("@/pages/Subjects");
    };
    const ric = (
      window as unknown as {
        requestIdleCallback?: (
          cb: () => void,
          o?: { timeout: number },
        ) => number;
      }
    ).requestIdleCallback;
    if (typeof ric === "function") {
      ric(run, { timeout: 4000 });
    } else {
      const id = window.setTimeout(run, 2500);
      return () => window.clearTimeout(id);
    }
  }, []);
  return null;
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideFooter =
    [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/dashboard",
      "/dashboard/teacher",
      "/admin",
    ].includes(location.pathname) || location.pathname.startsWith("/lectures/");

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Skip Navigation for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
      >
        Skip to content
      </a>
      <Navbar />
      {/* Pull content under the floating navbar using its measured height */}
      <main
        id="main-content"
        className="flex-1"
        style={{ marginTop: "calc(var(--navbar-h, 72px) * -1)" }}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
      <DeferredWidgets />
    </div>
  );
};

export { RouteFallback };
