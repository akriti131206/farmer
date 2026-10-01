import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "agrisense-user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Mock network delay to feel like a real auth call
  const login = (email) =>
    new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        const mockUser = {
          id: "usr_001",
          name: email.split("@")[0].replace(/[._]/g, " ") || "Farmer",
          email,
          farmName: "Green Valley Farm",
          avatar: null,
          role: "Farm Owner",
        };
        setUser(mockUser);
        setLoading(false);
        resolve(mockUser);
      }, 900);
    });

  const register = (name, email) =>
    new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        const mockUser = {
          id: "usr_" + Math.floor(Math.random() * 9000 + 1000),
          name,
          email,
          farmName: "New Farm",
          avatar: null,
          role: "Farm Owner",
        };
        setUser(mockUser);
        setLoading(false);
        resolve(mockUser);
      }, 900);
    });

  const logout = () => setUser(null);

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
