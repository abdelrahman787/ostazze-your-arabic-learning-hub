import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const isChunkLoadError = (err: unknown): boolean => {
  if (!err) return false;
  const e = err as { name?: string; message?: string };
  const msg = `${e.name ?? ""} ${e.message ?? ""}`;
  return /ChunkLoadError|Loading chunk|Loading CSS chunk|dynamically imported module|Failed to fetch dynamically/i.test(msg);
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[OSTAZE] Error Boundary caught:", error, errorInfo);

    // Auto-recover from stale chunk errors after a deploy: hard-reload once.
    if (isChunkLoadError(error) && typeof window !== "undefined") {
      const KEY = "ostaze:chunk-reload";
      if (!sessionStorage.getItem(KEY)) {
        sessionStorage.setItem(KEY, "1");
        window.location.reload();
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const chunk = isChunkLoadError(this.state.error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚠️
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-2">
              {chunk ? "جاري تحديث النسخة…" : "حدث خطأ غير متوقع"}
            </h1>
            <p className="text-muted-foreground mb-6 text-sm">
              {chunk
                ? "تم إصدار تحديث جديد. سيتم تحميل أحدث نسخة الآن."
                : "نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="bg-secondary text-secondary-foreground px-5 py-3 rounded-xl font-bold transition-all hover:opacity-90"
              >
                إعادة المحاولة
              </button>
              <button
                onClick={() => window.location.reload()}
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
