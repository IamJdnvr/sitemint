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
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          display_name: session.user.user_metadata?.display_name,
          avatar_url: session.user.user_metadata?.avatar_url,
          created_at: session.user.created_at,
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
