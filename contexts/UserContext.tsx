"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthError, User } from "@supabase/supabase-js";

// Create the user context
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  profile: UserProfile | null; // Add profile type
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null); // Add state for profile

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const supabase = createClient();

        // Get the initial user state
        const { data, error: fetchError } = await supabase.auth.getUser();

        if (fetchError) {
          setError(fetchError);
          setUser(null);
        } else {
          setUser(data.user);
          setError(null);
        }

        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setUser(session?.user || null);
            if (session?.user) {
              // Fetch the profile again when auth state changes
              fetchProfile(session.user.id);
            }
          }
        );

        return () => {
          // Clean up the subscription
          if (authListener && authListener.subscription) {
            authListener.subscription.unsubscribe();
          }
        };
      } catch (err) {
        setError(err as AuthError);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async (userId: string) => {
      const supabase = createClient();
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single(); // 'id' column is the primary key

      if (profileError) {
        setProfile(null);
      } else {
        setProfile(profileData);
      }
    };

    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    profile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
