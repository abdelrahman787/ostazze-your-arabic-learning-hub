import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import appCss from "../styles.css?url";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";
import { IdlePrefetch, Layout } from "@/components/AppShell";
import NotFound from "@/pages/NotFound";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { startPerfMonitor } from "@/lib/perfMonitor";
import { initMotionVisibility } from "@/lib/motionVisibility";

// Page titles/descriptions come from each page (PageHelmet / NoIndex) so the root never duplicates them.
const CSP =
  "default-src 'self'; img-src 'self' data: blob: https://*.supabase.co https://storage.googleapis.com https://*.googleusercontent.com https://lh3.googleusercontent.com https://images.unsplash.com https://plus.unsplash.com https://*.b-cdn.net https://*.mediadelivery.net; style-src 'self' 'unsafe-inline' https://assets.mediadelivery.net; font-src 'self' data: https://assets.mediadelivery.net; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://assets.mediadelivery.net; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.lovable.app https://*.lovable.dev https://*.mediadelivery.net https://*.b-cdn.net; media-src 'self' blob: https://*.supabase.co https://*.mediadelivery.net https://*.b-cdn.net; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://docs.google.com https://www.youtube.com https://www.youtube-nocookie.com https://iframe.mediadelivery.net; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests";

// ported from main.tsx: flag Apple platforms before first paint (lighter decorative motion).
const APPLE_MOTION_SCRIPT =
  "try{var p=navigator.platform||'';if(/Mac|iPhone|iPad|iPod/i.test(p)||(p==='MacIntel'&&navigator.maxTouchPoints>1)){document.documentElement.dataset.appleMotionLite='1'}}catch(e){}";

// Theme bootstrap before first paint (avoids a light flash for dark-mode users).
const THEME_SCRIPT =
  "try{var t=localStorage.getItem('ostazze_theme');if(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)t='dark';if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        {
          name: "google-site-verification",
          content: "I1mHlSOpekjvp0cAlfyxLVLwVhjv2-6Q2muAEL3Mkgw",
        },
        {
          name: "google-site-verification",
          content: "yXef1zMfFx9-rAG2OaGpgyeB0LnB8Bh3C9fZ6ZUlfU4",
        },
        { name: "author", content: "OSTAZE - أستاذي" },
        { name: "application-name", content: "OSTAZE | أستاذي" },
        { name: "apple-mobile-web-app-title", content: "OSTAZE | أستاذي" },
        { httpEquiv: "Content-Security-Policy", content: CSP },
        { httpEquiv: "X-Content-Type-Options", content: "nosniff" },
        { name: "referrer", content: "strict-origin-when-cross-origin" },
        { name: "color-scheme", content: "dark light" },
        { name: "theme-color", content: "#0F172A" },
        { name: "format-detection", content: "telephone=no" },
        { property: "og:site_name", content: "OSTAZE" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:locale", content: "ar_SA" },
        { property: "og:locale:alternate", content: "en_US" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/ibm-plex-sans-arabic-700.woff2",
          crossOrigin: "anonymous",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32.png?v=3",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "192x192",
          href: "/favicon-192.png?v=3",
        },
        {
          rel: "shortcut icon",
          href: "/favicon-32.png?v=3",
          type: "image/png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png?v=3",
        },
      ],
      scripts: [
        { children: APPLE_MOTION_SCRIPT },
        { children: THEME_SCRIPT },
        {
          type: "application/ld+json",
          children: JSON.stringify(organizationJsonLd("ar")),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(websiteJsonLd("ar")),
        },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundPage,
    errorComponent: RootError,
  },
);

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function useClientInit() {
  useEffect(() => {
    // ported from main.tsx: reload once when an old page chunk disappears after an update.
    const RELOAD_KEY = "ostaze_chunk_reload";
    const reloadOnce = () => {
      if (sessionStorage.getItem(RELOAD_KEY)) return;
      sessionStorage.setItem(RELOAD_KEY, "1");
      window.location.reload();
    };
    const onPreload = (e: Event) => {
      e.preventDefault();
      reloadOnce();
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason as { message?: string } | undefined;
      const msg = String(reason?.message || e.reason || "");
      if (
        /dynamically imported module|Importing a module script failed/i.test(
          msg,
        )
      )
        reloadOnce();
    };
    window.addEventListener("vite:preloadError", onPreload);
    window.addEventListener("unhandledrejection", onRejection);
    const t = window.setTimeout(
      () => sessionStorage.removeItem(RELOAD_KEY),
      10000,
    );
    startPerfMonitor();
    initMotionVisibility();
    // Honour the OS "reduce motion" setting without putting the animation library in the first download.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      void import("framer-motion").then(({ MotionGlobalConfig }) => {
        MotionGlobalConfig.skipAnimations = true;
      });
    }
    return () => {
      window.removeEventListener("vite:preloadError", onPreload);
      window.removeEventListener("unhandledrejection", onRejection);
      window.clearTimeout(t);
    };
  }, []);
}

function Providers({ children }: { children: ReactNode }) {
  const { queryClient } = Route.useRouteContext();
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function RootComponent() {
  useClientInit();
  return (
    <Providers>
      <ScrollToTop />
      <IdlePrefetch />
      <Layout>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </Layout>
    </Providers>
  );
}

function NotFoundPage() {
  return <NotFound />;
}

function RootError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-bold">This page didn't load</h1>
        <p className="text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <Link
            to="/"
            className="border border-border px-5 py-2.5 rounded-xl font-bold"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
