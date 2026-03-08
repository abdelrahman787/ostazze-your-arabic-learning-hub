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
import Index from "./pages/Index";
import Teachers from "./pages/Teachers";
import TeacherProfile from "./pages/TeacherProfile";
import Subjects from "./pages/Subjects";
import Universities from "./pages/Universities";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hideNavFooter = ["/dashboard", "/dashboard/teacher", "/admin"].includes(location.pathname);
  const hideFooter = ["/login", "/register", "/forgot-password"].includes(location.pathname);

  return (
    <>
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && !hideFooter && <Footer />}
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
                  <Route path="/" element={<Index />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/teachers/:id" element={<TeacherProfile />} />
                  <Route path="/subjects" element={<Subjects />} />
                  <Route path="/universities" element={<Universities />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
                  <Route path="/admin" element={<Admin />} />
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
