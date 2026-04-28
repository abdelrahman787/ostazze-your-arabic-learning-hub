import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import PageTransition from "@/components/PageTransition";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AIChatWidget from "@/components/AIChatWidget";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import GlobalSeo from "@/components/GlobalSeo";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";

const Teachers = lazy(() => import("./pages/Teachers"));
const TeacherProfile = lazy(() => import("./pages/TeacherProfile"));
const Subjects = lazy(() => import("./pages/Subjects"));
const Universities = lazy(() => import("./pages/Universities"));
const CollegeDetail = lazy(() => import("./pages/CollegeDetail"));
const Categories = lazy(() => import("./pages/Categories"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const SmartDashboard = lazy(() => import("./pages/SmartDashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const LectureView = lazy(() => import("./pages/LectureView"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Refund = lazy(() => import("./pages/Refund"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CheckoutReturn = lazy(() => import("./pages/CheckoutReturn"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ZoomTestPage = lazy(() => import("./pages/ZoomTestPage"));
const MyBookings = lazy(() => import("./pages/MyBookings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

const RouteFallback = () => <div className="min-h-[40vh]" aria-hidden="true" />;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideFooter =
    [
      "/login",
      "/register",
      "/forgot-password",
      "/dashboard",
      "/dashboard/teacher",
      "/admin",
    ].includes(location.pathname) ||
    location.pathname.startsWith("/lectures/");

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Skip Navigation for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold">
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
      <FloatingWhatsApp />
      <AIChatWidget />
      <CookieConsent />
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <GlobalSeo />
                  <Layout>
                    <PageTransition>
                      <Suspense fallback={<RouteFallback />}>
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/teachers" element={<Teachers />} />
                          <Route path="/teachers/:id" element={<TeacherProfile />} />
                          <Route path="/subjects" element={<Subjects />} />
                          <Route path="/universities" element={<Universities />} />
                          <Route path="/universities/:uniId/colleges/:collegeId" element={<CollegeDetail />} />
                          <Route path="/categories" element={<Categories />} />
                          <Route path="/courses" element={<Courses />} />
                          <Route path="/courses/:id" element={<CourseDetail />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/dashboard" element={<ProtectedRoute><SmartDashboard /></ProtectedRoute>} />
                          <Route path="/dashboard/teacher" element={<ProtectedRoute><SmartDashboard /></ProtectedRoute>} />
                          <Route path="/lectures/:id" element={<ProtectedRoute><LectureView /></ProtectedRoute>} />
                          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/privacy" element={<Privacy />} />
                          <Route path="/refund" element={<Refund />} />
                          <Route path="/checkout/return" element={<CheckoutReturn />} />
                          <Route path="/faq" element={<FAQ />} />
                          <Route path="/zoom-test" element={<ProtectedRoute><ZoomTestPage /></ProtectedRoute>} />
                          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </PageTransition>
                  </Layout>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
