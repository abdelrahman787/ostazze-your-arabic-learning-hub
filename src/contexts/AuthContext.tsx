import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  avatar?: string;
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
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();
  if (data?.role === "admin") return "admin";
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("user_id", userId)
    .single();
  
  return (profile?.account_type as "student" | "teacher") || "student";
}

async function buildAppUser(supaUser: SupabaseUser): Promise<AppUser> {
  const role = await fetchUserRole(supaUser.id);
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("user_id", supaUser.id)
    .single();

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const appUser = await buildAppUser(session.user);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const appUser = await buildAppUser(session.user);
        setUser(appUser);
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
