import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type UserRole = "worker" | "client";

export interface AuthUser {

  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;

  token: string | null;
  /** Called after a successful backend sign-up. Stores the user session locally. */
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


const USER_KEY  = "lindakazi-auth-user";
const TOKEN_KEY = "lindakazi-auth-token";


function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {

    const raw = window.localStorage.getItem(USER_KEY);

    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<AuthUser | null>(getStoredUser);
  const [token, setToken] = useState<string | null>(getStoredToken);

  // Keep localStorage in sync whenever auth state changes
  useEffect(() => {
    if (user && token) {
      window.localStorage.setItem(USER_KEY,  JSON.stringify(user));
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.removeItem(TOKEN_KEY);
    }
  }, [user, token]);

  const login = (newUser: AuthUser, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>

      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}