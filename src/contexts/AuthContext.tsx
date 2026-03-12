import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  avatar?: string;
  roleResolved?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, fullName: string, accountType: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => ({}),
  register: async () => ({}),
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

async function fetchUserRole(userId: string): Promise<"student" | "teacher" | "admin"> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (!error && data?.role === "admin") return "admin";
    if (!error && data?.role === "moderator") return "admin"; // moderators get admin access
  } catch (e) {
    console.warn("Failed to fetch user role:", e);
  }
  
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("user_id", userId)
      .maybeSingle();
    
    return (profile?.account_type as "student" | "teacher") || "student";
  } catch (e) {
    console.warn("Failed to fetch profile:", e);
    return "student";
  }
}

async function buildAppUser(supaUser: SupabaseUser): Promise<AppUser> {
  const role = await fetchUserRole(supaUser.id);
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("user_id", supaUser.id)
    .maybeSingle();

  return {
    id: supaUser.id,
    name: profile?.full_name || supaUser.user_metadata?.full_name || "",
    email: supaUser.email || "",
    role,
    avatar: profile?.avatar_url || undefined,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // IMPORTANT: Do NOT await inside onAuthStateChange to avoid deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Set basic user immediately, then fetch role async
        const su = session.user;
        setUser({
          id: su.id,
          name: su.user_metadata?.full_name || "",
          email: su.email || "",
          role: "student",
        });
        // Fetch role and profile in background (no await!)
        buildAppUser(su).then((appUser) => setUser(appUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const su = session.user;
        setUser({
          id: su.id,
          name: su.user_metadata?.full_name || "",
          email: su.email || "",
          role: "student",
        });
        buildAppUser(su).then((appUser) => setUser(appUser));
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const register = async (email: string, password: string, fullName: string, accountType: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, account_type: accountType },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
