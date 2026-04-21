import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import WelcomeGuideModal from "@/components/WelcomeGuideModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Teachers from "./pages/Teachers";
import TeacherProfile from "./pages/TeacherProfile";
import Subjects from "./pages/Subjects";
import Universities from "./pages/Universities";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import SmartDashboard from "./pages/SmartDashboard";
import Admin from "./pages/Admin";
import LectureView from "./pages/LectureView";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import NotFound from "./pages/NotFound";
import CheckoutReturn from "./pages/CheckoutReturn";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import MyCourses from "./pages/MyCourses";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideFooter =
    [
      "/login",
      "/register",
      "/forgot-password",
      "/dashboard",
      "/dashboard/teacher",
    ].includes(location.pathname) ||
    location.pathname.startsWith("/lectures/");

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Skip Navigation for Accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold">
        Skip to content
      </a>
      <Navbar />
      {/* Pull content under the floating navbar */}
      <main id="main-content" className="-mt-[72px] flex-1">{children}</main>
      {!hideFooter && <Footer />}
      <FloatingWhatsApp />
      <AIChatWidget />
      <WelcomeGuideModal />
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
                  <Layout>
                    <PageTransition>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/courses/:id" element={<CourseDetail />} />
                        <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
                        <Route path="/teachers" element={<Teachers />} />
                        <Route path="/teachers/:id" element={<TeacherProfile />} />
                        <Route path="/subjects" element={<Subjects />} />
                        <Route path="/universities" element={<Universities />} />
                        <Route path="/categories" element={<Categories />} />
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
                        <Route path="*" element={<NotFound />} />
                      </Routes>
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
