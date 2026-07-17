// LocalStorage-based authentication for when Supabase is not configured.
// Provides a Supabase-compatible API shape so the rest of the app works unchanged.
//
// ⚠️ SECURITY WARNING: This stores passwords in plaintext in localStorage.
// This is acceptable for local MVP/demo use only.
// NEVER use this fallback in production or with real user credentials.
// For production, configure real Supabase credentials in .env.local.

interface LocalUser {
  id: string;
  email: string;
  user_metadata: {
    display_name?: string;
    avatar_url?: string;
    is_guest?: boolean;
  };
  created_at: string;
}

interface LocalSession {
  user: LocalUser;
  access_token: string;
  refresh_token: string;
}

const STORAGE_KEY = "sitemint_auth";
const SESSION_KEY = "sitemint_session";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getUsers(): LocalUser[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: LocalUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getSession(): LocalSession | null {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveSession(session: LocalSession | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function createLocalAuthClient() {
  // Initialize trigger functions that will call the actual listeners
  let authChangeListeners: Array<(event: string, session: LocalSession | null) => void> = [];

  const notifyListeners = (event: string, session: LocalSession | null) => {
    authChangeListeners.forEach((fn) => fn(event, session));
  };

  return {
    auth: {
      getSession: async () => {
        const session = getSession();
        return { data: { session }, error: null };
      },

      onAuthStateChange: (
        callback: (event: string, session: any) => void
      ) => {
        authChangeListeners.push(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                authChangeListeners = authChangeListeners.filter(
                  (fn) => fn !== callback
                );
              },
            },
          },
        };
      },

      signInWithPassword: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        const users = getUsers();
        // Find user with matching email and password (stored as email:password hash)
        const user = users.find(
          (u) => u.email === email
        );

        if (!user) {
          return {
            data: {},
            error: new Error("Invalid login credentials"),
          };
        }

        // Verify password (in production, use proper hashing)
        const stored = localStorage.getItem(`sitemint_pwd_${email}`);
        if (stored !== password) {
          return {
            data: {},
            error: new Error("Invalid login credentials"),
          };
        }

        const session: LocalSession = {
          user,
          access_token: generateId(),
          refresh_token: generateId(),
        };
        saveSession(session);
        notifyListeners("SIGNED_IN", session);

        return { data: { session, user }, error: null };
      },

      signUp: async ({
        email,
        password,
        options,
      }: {
        email: string;
        password: string;
        options?: { data?: { display_name?: string; avatar_url?: string } };
      }) => {
        const users = getUsers();

        // Check if user already exists
        if (users.find((u) => u.email === email)) {
          return {
            data: {},
            error: new Error("A user with this email already exists"),
          };
        }

        const newUser: LocalUser = {
          id: generateId(),
          email,
          user_metadata: {
            display_name:
              options?.data?.display_name || email.split("@")[0],
            avatar_url: options?.data?.avatar_url,
          },
          created_at: new Date().toISOString(),
        };

        // Store user and password
        users.push(newUser);
        saveUsers(users);
        localStorage.setItem(`sitemint_pwd_${email}`, password);

        // Auto sign in after sign up
        const session: LocalSession = {
          user: newUser,
          access_token: generateId(),
          refresh_token: generateId(),
        };
        saveSession(session);
        notifyListeners("SIGNED_IN", session);

        return { data: { session, user: newUser }, error: null };
      },

      signInAnonymously: async (options?: {
        options?: { data?: Record<string, unknown> };
      }) => {
        const guestUser: LocalUser = {
          id: generateId(),
          email: `guest_${generateId().slice(0, 8)}@sitemint.app`,
          user_metadata: {
            display_name: (options?.options?.data?.display_name as string) || "Guest",
            is_guest: true,
            ...(options?.options?.data || {}),
          },
          created_at: new Date().toISOString(),
        };

        const session: LocalSession = {
          user: guestUser,
          access_token: generateId(),
          refresh_token: generateId(),
        };
        saveSession(session);
        notifyListeners("SIGNED_IN", session);

        return { data: { session, user: guestUser }, error: null };
      },

      convertGuestAccount: async ({
        email,
        password,
        display_name,
      }: {
        email: string;
        password: string;
        display_name?: string;
      }) => {
        const users = getUsers();

        // Check if email already exists
        if (users.find((u) => u.email === email)) {
          return {
            data: {},
            error: new Error("An account with this email already exists"),
          };
        }

        // Get current guest session so we can preserve the user id / data
        const oldSession = getSession();

        const newUser: LocalUser = {
          id: oldSession?.user?.id || generateId(),
          email,
          user_metadata: {
            display_name: display_name || email.split("@")[0],
            is_guest: false,
          },
          created_at: oldSession?.user?.created_at || new Date().toISOString(),
        };

        // Update user in the users list (or create if not there)
        const existingIdx = users.findIndex((u) => u.id === newUser.id);
        if (existingIdx >= 0) {
          users[existingIdx] = newUser;
        } else {
          users.push(newUser);
        }
        saveUsers(users);
        localStorage.setItem(`sitemint_pwd_${email}`, password);

        // Update the session with the real user
        const newSession: LocalSession = {
          user: newUser,
          access_token: oldSession?.access_token || generateId(),
          refresh_token: oldSession?.refresh_token || generateId(),
        };
        saveSession(newSession);
        notifyListeners("SIGNED_IN", newSession);

        return { data: { session: newSession, user: newUser }, error: null };
      },

      signOut: async () => {
        saveSession(null);
        notifyListeners("SIGNED_OUT", null);
      },

      resetPasswordForEmail: async (
        email: string,
        _options?: { redirectTo?: string }
      ) => {
        const users = getUsers();
        const user = users.find((u) => u.email === email);
        if (!user) {
          return {
            data: {},
            error: new Error("No user found with this email"),
          };
        }
        // In local mode, password reset is just a success message
        return { data: {}, error: null };
      },

      updateUser: async (attrs: {
        password?: string;
        data?: { display_name?: string };
      }) => {
        const session = getSession();
        if (!session) {
          return {
            data: {},
            error: new Error("Not authenticated"),
          };
        }

        const users = getUsers();
        const idx = users.findIndex((u) => u.id === session.user.id);
        if (idx === -1) {
          return {
            data: {},
            error: new Error("User not found"),
          };
        }

        if (attrs.data?.display_name) {
          users[idx].user_metadata.display_name = attrs.data.display_name;
          session.user.user_metadata.display_name = attrs.data.display_name;
        }

        if (attrs.password) {
          localStorage.setItem(
            `sitemint_pwd_${session.user.email}`,
            attrs.password
          );
        }

        saveUsers(users);
        saveSession(session);

        return { data: { user: session.user }, error: null };
      },
    },
    storage: {
      from: () => ({
        upload: async () => ({
          data: {},
          error: new Error("Storage not available in local mode"),
        }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  };
}
