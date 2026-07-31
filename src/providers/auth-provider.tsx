"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { logoutAction } from "@/actions/auth";

export type AuthUser = { name: string; email: string; initials: string };
type AuthContextValue = { user: AuthUser | null; ready: boolean; signIn: (user: AuthUser) => void; signOut: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = "pravohelper-office-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { const local = window.localStorage.getItem(storageKey); if (local) setUser(JSON.parse(local) as AuthUser); fetch("/api/auth/me").then((response) => response.ok ? response.json() as Promise<{ user: AuthUser | null }> : { user: null }).then(({ user: current }) => { if (current) { setUser(current); window.localStorage.setItem(storageKey, JSON.stringify(current)); } }).catch(() => undefined).finally(() => setReady(true)); }, []);
  const signIn = (nextUser: AuthUser) => { window.localStorage.setItem(storageKey, JSON.stringify(nextUser)); setUser(nextUser); };
  const signOut = async () => { try { await logoutAction(); } catch { /* Local mode has no server session. */ } window.localStorage.removeItem(storageKey); setUser(null); window.location.assign("/login"); };
  return <AuthContext.Provider value={{ user, ready, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
