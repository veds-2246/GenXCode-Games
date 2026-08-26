import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import type { Profile, UserRole } from "../types";
import { USER_ROLES } from "../constants/roles";

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    profileData: Omit<Profile, "id" | "role" | "created_at" | "updated_at">,
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  requestAccess: () => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Failed to fetch profile:", error);
      return;
    }

    if (data) {
      const profile: Profile = {
        id: data.id,
        name: data.name,
        whatsapp_number: data.whatsapp_number,
        role: data.role as UserRole,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      setUser(profile);
      setRole(profile.role);
    }
  };

  const initializeAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Auth initialization failed"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await fetchProfile(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error);
      return { error };
    }
    return { error: null };
  };

  const signUp = async (
    email: string,
    password: string,
    profileData: Omit<Profile, "id" | "role" | "created_at" | "updated_at">,
  ) => {
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: profileData.name,
          whatsapp_number: profileData.whatsapp_number,
        },
      },
    });
    if (error) {
      setError(error);
      return { error };
    }

    if (data.user) {
      await fetchProfile(data.user.id);
    }

    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error);
    }
    setUser(null);
    setRole(null);
  };

  const requestAccess = async () => {
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      const error = new Error("No authenticated user");
      setError(error);
      return { error };
    }

    const { error } = await supabase.from("access_requests").insert({
      player_id: user.id,
      status: "pending",
    });

    if (error) {
      setError(error);
    }
    return { error };
  };

  const refreshProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const isAdmin = role === USER_ROLES.ADMIN;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        requestAccess,
        refreshProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
