"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToasts } from "./ToastProvider";
import { API_BASE_URL } from "../apiClient";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  selectedRole: "urban" | "farmer" | "industry";
  mode?: "demo" | "local" | "google";
}

interface AuthContextType {
  user: UserProfile | null;
  role: "urban" | "farmer" | "industry" | null;
  mode: "demo" | "local" | "google" | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (idToken: string) => Promise<UserProfile>;
  loginDemo: (role: "urban" | "farmer" | "industry") => Promise<UserProfile>;
  registerLocal: (name: string, email: string, password: string, preferredRole: string) => Promise<UserProfile>;
  loginLocal: (email: string, password: string, rememberMe: boolean) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserProfile["selectedRole"]) => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for client-side cookies
const setClientCookie = (name: string, value: string, days = 1) => {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; samesite=lax";
};

const deleteClientCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=lax";
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mode, setMode] = useState<"demo" | "local" | "google" | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToasts();

  const checkSession = async () => {
    setIsLoading(true);
    try {
      const savedMode = typeof window !== "undefined" ? localStorage.getItem("ecosphere_session_mode") : null;
      if (savedMode === "demo") {
        // Re-establish demo user
        const mockProfile: UserProfile = {
          id: "demo_user_active",
          name: "Simulated Demo User",
          email: "demo@ecosphere.internal",
          avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=demo_user",
          selectedRole: "urban",
          mode: "demo"
        };
        setUser(mockProfile);
        setMode("demo");
        setPermissions(["read:telemetry", "read:marketplace", "demo:simulate"]);
        setIsLoading(false);
        return;
      }
      
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/session`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const profile: UserProfile = await res.json();
        setUser(profile);
        setMode(profile.mode || (savedMode as any) || "google");
        setPermissions(["read:telemetry", "write:telemetry", "read:marketplace", "write:marketplace"]);
      } else {
        setUser(null);
        setMode(null);
        setPermissions([]);
      }
    } catch (e) {
      console.warn("Failed checking session offline:", e);
      setUser(null);
      setMode(null);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async (role: "urban" | "farmer" | "industry"): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const mockName = role === "urban" ? "Simulated Urban Citizen" : role === "farmer" ? "Simulated Punjabi Farmer" : "Simulated ESG Facility Manager";
      const mockProfile: UserProfile = {
        id: `demo_${role}`,
        name: mockName,
        email: `demo_${role}@ecosphere.internal`,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=demo_${role}`,
        selectedRole: role,
        mode: "demo"
      };
      
      setUser(mockProfile);
      setMode("demo");
      setPermissions(["read:telemetry", "read:marketplace", "demo:simulate"]);
      
      // Set mock session cookies so middleware allows the client to pass protected routes
      setClientCookie("ecosphere_session", "demo_session_token_xyz", 1);
      if (typeof window !== "undefined") {
        localStorage.setItem("ecosphere_session_mode", "demo");
      }
      
      addToast(`Successfully entered Demo Mode as ${role.toUpperCase()}.`, "success", "Welcome to Demo");
      return mockProfile;
    } catch (e: any) {
      addToast(e.message || "Demo login failed.", "error");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const registerLocal = async (name: string, email: string, password: string, preferredRole: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, preferredRole }),
        credentials: "include"
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Registration failed.");
      }
      
      const profile: UserProfile = await res.json();
      addToast("Local account registered successfully. You can now log in.", "success", "Signup Success");
      return profile;
    } catch (e: any) {
      addToast(e.message || "Registration error occurred.", "error", "Registration Failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const loginLocal = async (email: string, password: string, rememberMe: boolean): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/local-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: "include"
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Login failed.");
      }
      
      const profile: UserProfile = await res.json();
      setUser(profile);
      setMode("local");
      setPermissions(["read:telemetry", "write:telemetry", "read:marketplace", "write:marketplace"]);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("ecosphere_session_mode", "local");
      }
      
      addToast("Successfully authenticated via Local EcoSphere Account.", "success", "Welcome Back");
      return profile;
    } catch (e: any) {
      addToast(e.message || "Local sign in failed.", "error", "Authentication Failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (idToken: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
        credentials: "include"
      });
      
      if (!res.ok) {
        throw new Error("Google Login verification failed.");
      }
      
      const profile: UserProfile = await res.json();
      setUser(profile);
      setMode("google");
      setPermissions(["read:telemetry", "write:telemetry", "read:marketplace", "write:marketplace"]);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("ecosphere_session_mode", "google");
      }
      
      addToast("Successfully authenticated with Google OAuth.", "success", "Welcome");
      return profile;
    } catch (e: any) {
      addToast(e.message || "Authentication error occurred.", "error", "Login Failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (mode !== "demo") {
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, { 
          method: "POST",
          credentials: "include"
        });
      }
      setUser(null);
      setMode(null);
      setPermissions([]);
      deleteClientCookie("ecosphere_session");
      if (typeof window !== "undefined") {
        localStorage.removeItem("ecosphere_session_mode");
      }
      addToast("Successfully signed out.", "info", "Logged Out");
    } catch (e) {
      console.error(e);
      setUser(null);
      setMode(null);
      setPermissions([]);
      deleteClientCookie("ecosphere_session");
      if (typeof window !== "undefined") {
        localStorage.removeItem("ecosphere_session_mode");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (role: UserProfile["selectedRole"]) => {
    if (mode === "demo") {
      setUser(prev => prev ? { ...prev, selectedRole: role } : null);
      addToast(`Active view switched to ${role.toUpperCase()}.`, "success", "Role Switched");
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include"
      });
      
      if (!res.ok) {
        throw new Error("Failed to persist selected role on server.");
      }
      
      const profile: UserProfile = await res.json();
      setUser(profile);
      addToast(`Active view switched to ${role.toUpperCase()}.`, "success", "Role Switched");
    } catch (e: any) {
      addToast(e.message || "Error switching roles.", "error", "Switch Failed");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.selectedRole || null,
        mode,
        permissions,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginDemo,
        registerLocal,
        loginLocal,
        logout,
        updateUserRole,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
