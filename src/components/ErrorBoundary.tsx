import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const RELOAD_KEY = "ostaze:chunk-reload-at";
const RELOAD_THROTTLE_MS = 10_000;

const isChunkLoadError = (err: unknown): boolean => {
  if (!err) return false;
  const e = err as { name?: string; message?: string };
  const msg = `${e.name ?? ""} ${e.message ?? ""}`;
  return /ChunkLoadError|Loading chunk|Loading CSS chunk|dynamically imported module|Failed to fetch dynamically|Importing a module script failed/i.test(msg);
};

class ErrorBoundary extends Component<Props, State> {
  private reloadForFreshVersion = () => {
    if (typeof window === "undefined") return;

    const lastReload = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    const now = Date.now();

    // Prevent reload loops if the device is fully offline or the request keeps failing.
    if (now - lastReload < RELOAD_THROTTLE_MS) return;

    sessionStorage.setItem(RELOAD_KEY, String(now));
    const url = new URL(window.location.href);
    url.searchParams.set("_r", String(now));
    window.location.replace(url.toString());
  };

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidMount() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(RELOAD_KEY);
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[OSTAZE] Error Boundary caught:", error, errorInfo);

    // Auto-recover from stale chunk errors after a deploy without showing an
    // intermediate error screen on mobile browsers with aggressive caching.
    if (isChunkLoadError(error)) {
      this.reloadForFreshVersion();
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleHardReload = () => {
    this.reloadForFreshVersion();
  };

  render() {
    if (this.state.hasError) {
      const chunk = isChunkLoadError(this.state.error);

      if (chunk) {
        this.reloadForFreshVersion();
        return <div className="min-h-screen bg-background" aria-hidden="true" />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚠️
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-2">حدث خطأ غير متوقع</h1>
            <p className="text-muted-foreground mb-6 text-sm">نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="bg-secondary text-secondary-foreground px-5 py-3 rounded-xl font-bold transition-all hover:opacity-90"
              >
                إعادة المحاولة
              </button>
              <button
                onClick={this.handleHardReload}
                className="bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold transition-all hover:opacity-90"
              >
                تحديث الصفحة
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

