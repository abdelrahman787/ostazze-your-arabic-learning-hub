import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes — avoids unnecessary re-fetches
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
    <>
      <Navbar />
      {children}
      {!hideFooter && <Footer />}
      <FloatingWhatsApp />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/teachers/:id" element={<TeacherProfile />} />
                  <Route path="/subjects" element={<Subjects />} />
                  <Route path="/universities" element={<Universities />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Protected routes — redirect to /login if not authenticated */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <SmartDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/teacher"
                    element={
                      <ProtectedRoute>
                        <SmartDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/lectures/:id"
                    element={
                      <ProtectedRoute>
                        <LectureView />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin-only route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
