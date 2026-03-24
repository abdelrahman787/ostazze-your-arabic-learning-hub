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
  emailVerified?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    accountType: string,
    timezone?: string
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    full_name?: string;
    bio?: string;
    phone?: string;
    price?: number;
  }) => Promise<{ error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error?: string }>;
  resendVerificationEmail: () => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => ({}),
  register: async () => ({}),
  logout: async () => {},
  updateProfile: async () => ({}),
  changePassword: async () => ({}),
  resendVerificationEmail: async () => ({}),
});

export const useAuth = () => useContext(AuthContext);

// Parallelizes role + profile fetch: 2 concurrent queries instead of 2-3 sequential ones
async function buildAppUser(supaUser: SupabaseUser): Promise<AppUser> {
  const [roleResult, profileResult] = await Promise.all([
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", supaUser.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("full_name, avatar_url, account_type")
      .eq("user_id", supaUser.id)
      .maybeSingle(),
  ]);

  let role: "student" | "teacher" | "admin" = "student";
  if (
    roleResult.data?.role === "admin" ||
    roleResult.data?.role === "moderator"
  ) {
    role = "admin";
  } else if (profileResult.data?.account_type === "teacher") {
    role = "teacher";
  }

  return {
    id: supaUser.id,
    name:
      profileResult.data?.full_name ||
      supaUser.user_metadata?.full_name ||
      "",
    email: supaUser.email || "",
    role,
    avatar: profileResult.data?.avatar_url || undefined,
    roleResolved: true,
    emailVerified: !!supaUser.email_confirmed_at,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION immediately on subscribe,
    // so getSession() is redundant and only causes duplicate DB queries + race conditions.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const su = session.user;
        // Set a lightweight user immediately so UI can render without waiting for DB
        setUser({
          id: su.id,
          name: su.user_metadata?.full_name || "",
          email: su.email || "",
          role: "student",
          emailVerified: !!su.email_confirmed_at,
        });
        // Fetch role + profile in background (no await — avoids Supabase deadlocks)
        buildAppUser(su).then((appUser) => setUser(appUser));
      } else {
        setUser(null);
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

  const register = async (
    email: string,
    password: string,
    fullName: string,
    accountType: string,
    timezone?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, account_type: accountType, timezone },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };

    // Upsert profile row with timezone (a DB trigger may have already created it)
    if (data.user) {
      await supabase.from("profiles").upsert(
        {
          user_id: data.user.id,
          full_name: fullName,
          account_type: accountType,
          ...(timezone ? { timezone } : {}),
        },
        { onConflict: "user_id" }
      );
    }
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (data: {
    full_name?: string;
    bio?: string;
    phone?: string;
    price?: number;
  }) => {
    if (!user) return { error: "Not logged in" };
    try {
      // Build the profiles update payload (only include defined fields)
      const profileData: Record<string, string | undefined> = {};
      if (data.full_name !== undefined) profileData.full_name = data.full_name;
      if (data.bio !== undefined) profileData.bio = data.bio;
      if (data.phone !== undefined) profileData.phone = data.phone;

      if (Object.keys(profileData).length > 0) {
        const { error } = await supabase
          .from("profiles")
          .update(profileData)
          .eq("user_id", user.id);
        if (error) return { error: error.message };
      }

      // Update price in teacher_profiles if provided
      if (data.price !== undefined) {
        const { data: existingTp } = await supabase
          .from("teacher_profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (existingTp) {
          const { error } = await supabase
            .from("teacher_profiles")
            .update({ price: data.price })
            .eq("user_id", user.id);
          if (error) return { error: error.message };
        } else {
          const { error } = await supabase
            .from("teacher_profiles")
            .insert({ user_id: user.id, price: data.price });
          if (error) return { error: error.message };
        }
      }

      // Reflect name change locally without waiting for a re-fetch
      if (data.full_name !== undefined) {
        setUser((prev) =>
          prev ? { ...prev, name: data.full_name! } : null
        );
      }
      return {};
    } catch (e: any) {
      return { error: e.message };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!user) return { error: "Not logged in" };
    // Re-authenticate to verify current password before updating
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) return { error: "current_password_wrong" };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return {};
  };

  const resendVerificationEmail = async () => {
    if (!user) return { error: "Not logged in" };
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
    });
    if (error) return { error: error.message };
    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
