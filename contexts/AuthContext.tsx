"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { userAPI } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const userData = await userAPI.getProfile();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
