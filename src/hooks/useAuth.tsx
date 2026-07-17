"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@/types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If real Supabase doesn't have a session, check for a local auth session
      // (used by the guest login fallback when Supabase anonymous sign-in fails)
      if (!session?.user) {
        try {
          const localData = localStorage.getItem("sitemint_session");
          if (localData) {
            const localSession = JSON.parse(localData);
            if (localSession?.user) {
              setUser({
                id: localSession.user.id,
                email: localSession.user.email!,
                display_name: localSession.user.user_metadata?.display_name,
                avatar_url: localSession.user.user_metadata?.avatar_url,
                created_at: localSession.user.created_at,
                is_guest: localSession.user.user_metadata?.is_guest,
              });
              setLoading(false);
              return;
            }
          }
        } catch {
          // Ignore parse errors
        }
      }

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          display_name: session.user.user_metadata?.display_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
          is_guest: session.user.user_metadata?.is_guest,
        });
      }
      setLoading(false);
    };
    getUser();

    const {
      data: { subscription },
    } =    supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          display_name: session.user.user_metadata?.display_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
          is_guest: session.user.user_metadata?.is_guest,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // Clear any local auth session (guest login fallback)
    localStorage.removeItem("sitemint_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
