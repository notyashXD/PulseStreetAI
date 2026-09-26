"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  title: string;
  avatar: string;
  ward?: string;
  department?: string;
  badge: string;
}

export const PRESET_USERS: Record<string, { pass: string; user: AuthUser }> = {
  admin: {
    pass: "admin",
    user: {
      id: "usr_admin_01",
      username: "admin",
      name: "Yash Mishra",
      role: "admin",
      title: "Chief Municipal Response Officer",
      avatar: "👑",
      department: "Pollution Control & Civic Triage",
      badge: "Municipal Admin",
    },
  },
  user: {
    pass: "user",
    user: {
      id: "usr_resident_01",
      username: "user",
      name: "Palak Khare",
      role: "user",
      title: "Verified Resident",
      avatar: "👤",
      ward: "Kothrud",
      badge: "Citizen Monitor",
    },
  },
};

interface AuthContextType {
  currentUser: AuthUser;
  role: UserRole;
  isAdmin: boolean;
  isUser: boolean;
  login: (username: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "streetpulse_auth_session_v4";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser>(PRESET_USERS.admin.user);

  useEffect(() => {
    try {
      // Clear legacy storage keys
      localStorage.removeItem("streetpulse_auth_session");
      localStorage.removeItem("streetpulse_auth_session_v2");
      localStorage.removeItem("streetpulse_auth_session_v3");

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const role = (parsed?.role === "user" ? "user" : "admin") as UserRole;
        // Always take fresh profile data from PRESET_USERS for this role
        const fresh = PRESET_USERS[role]?.user || PRESET_USERS.admin.user;
        setCurrentUser(fresh);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      } else {
        setCurrentUser(PRESET_USERS.admin.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(PRESET_USERS.admin.user));
      }
    } catch {
      setCurrentUser(PRESET_USERS.admin.user);
    }
  }, []);

  const login = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    const preset = PRESET_USERS[cleanUser];
    if (preset && preset.pass === cleanPass) {
      setCurrentUser(preset.user);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preset.user));
      } catch { }
      return { success: true };
    }

    return {
      success: false,
      error: "Invalid credentials. Use 'admin' / 'admin' for Admin access, or 'user' / 'user' for Citizen access.",
    };
  };

  const logout = () => {
    // Revert to user role on logout
    const defaultCitizen = PRESET_USERS.user.user;
    setCurrentUser(defaultCitizen);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCitizen));
    } catch { }
  };

  const switchRole = (newRole: UserRole) => {
    const target = PRESET_USERS[newRole]?.user || PRESET_USERS.admin.user;
    setCurrentUser(target);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(target));
    } catch { }
  };

  const value: AuthContextType = {
    currentUser,
    role: currentUser.role,
    isAdmin: currentUser.role === "admin",
    isUser: currentUser.role === "user",
    login,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
