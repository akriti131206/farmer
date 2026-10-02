import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getSession, signIn, signOut, signUp } from "../services/authService";

const AuthContext = createContext(null);

function mapAuthUser(authUser) {
  if (!authUser) return null;
  const name = authUser.user_metadata?.full_name
    || authUser.user_metadata?.name
    || authUser.email?.split("@")[0]
    || "Farmer";

  return {
    id: authUser.id,
    name,
    email: authUser.email || "",
    farmName: authUser.user_metadata?.farm_name || "",
    avatar: authUser.user_metadata?.avatar_url || null,
    role: "Farm Owner",
  };
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [displayOverrides, setDisplayOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const user = authUser ? { ...authUser, ...displayOverrides } : null;

  useEffect(() => {
    let mounted = true;
    let authEventObserved = false;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventObserved = true;
      if (mounted) {
        setAuthUser(mapAuthUser(session?.user || null));
        setDisplayOverrides({});
        setLoading(false);
      }
    });

    getSession()
      .then(({ session }) => {
        if (!mounted || authEventObserved) return;
        setAuthUser(mapAuthUser(session?.user || null));
        setDisplayOverrides({});
      })
      .catch((error) => {
        if (mounted && !authEventObserved) {
          console.error("Could not restore the Supabase authentication session.", error);
          setAuthUser(null);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function login(email, password) {
    setLoading(true);
    try {
      const { user: signedInUser } = await signIn({ email, password });
      setAuthUser(mapAuthUser(signedInUser));
      setDisplayOverrides({});
      return signedInUser;
    } finally {
      setLoading(false);
    }
  }

  async function register(name, email, password) {
    setLoading(true);
    try {
      const result = await signUp({ fullName: name, email, password });
      if (result.session?.user) {
        setAuthUser(mapAuthUser(result.session.user));
        setDisplayOverrides({});
      }
      return result;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await signOut();
      setAuthUser(null);
      setDisplayOverrides({});
    } finally {
      setLoading(false);
    }
  }

  function setUser(update) {
    if (!authUser) return;
    const currentUser = { ...authUser, ...displayOverrides };
    const nextUser = typeof update === "function" ? update(currentUser) : update;
    if (!nextUser || nextUser.id !== authUser.id) return;
    setDisplayOverrides({
      name: nextUser.name,
      email: nextUser.email,
      farmName: nextUser.farmName,
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
