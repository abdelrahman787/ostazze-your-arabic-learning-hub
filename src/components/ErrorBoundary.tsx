import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  didAutoReload: boolean;
}

const RELOAD_KEY = "ostaze:chunk-reload";

const isChunkLoadError = (err: unknown): boolean => {
  if (!err) return false;
  const e = err as { name?: string; message?: string };
  const msg = `${e.name ?? ""} ${e.message ?? ""}`;
  return /ChunkLoadError|Loading chunk|Loading CSS chunk|dynamically imported module|Failed to fetch dynamically|Importing a module script failed/i.test(msg);
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const didAutoReload =
      typeof window !== "undefined" && sessionStorage.getItem(RELOAD_KEY) === "1";
    this.state = { hasError: false, error: null, didAutoReload };
  }

  componentDidMount() {
    // Successful mount → clear the "we already tried reloading" flag so a
    // future stale-chunk error can auto-recover again.
    if (typeof window !== "undefined" && sessionStorage.getItem(RELOAD_KEY)) {
      sessionStorage.removeItem(RELOAD_KEY);
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[OSTAZE] Error Boundary caught:", error, errorInfo);

    // Auto-recover from stale chunk errors after a deploy: hard-reload ONCE.
    // If the reload already happened and the error persists, fall through to
    // the retry UI below instead of showing a stuck "updating" screen.
    if (
      isChunkLoadError(error) &&
      typeof window !== "undefined" &&
      !this.state.didAutoReload
    ) {
      sessionStorage.setItem(RELOAD_KEY, "1");
      window.location.reload();
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleHardReload = () => {
    // Cache-bust query so mobile Safari re-fetches the HTML.
    const url = new URL(window.location.href);
    url.searchParams.set("_r", Date.now().toString());
    window.location.replace(url.toString());
  };

  render() {
    if (this.state.hasError) {
      const chunk = isChunkLoadError(this.state.error);
      const stuck = chunk && this.state.didAutoReload;

      const title = stuck
        ? "تعذّر تحميل جزء من الصفحة"
        : chunk
          ? "جاري تحديث النسخة…"
          : "حدث خطأ غير متوقع";

      const body = stuck
        ? "من فضلك تحقق من اتصال الإنترنت ثم أعد تحميل الصفحة."
        : chunk
          ? "تم إصدار تحديث جديد. سيتم تحميل أحدث نسخة الآن."
          : "نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.";

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚠️
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground mb-6 text-sm">{body}</p>
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

