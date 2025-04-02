import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { isAuthenticated, login as serviceLogin, register as serviceRegister } from "../../../service/Auth.service";
import { RegisterResponse } from "../../../types/Auth.types";

interface AuthContextType {
  authenticated: boolean;
  login: (username: string, password: string, redirect?: boolean) => Promise<string | null>;
  register: (username: string, password: string) => Promise<RegisterResponse>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function checkAuth() {
    setLoading(true);
    try {
      const response = await isAuthenticated();
      setAuthenticated(response);
    } catch {
      setAuthenticated(false);
    }
    setLoading(false);
  }

  async function login(username: string, password: string, redirect: boolean = true): Promise<string | null> {
    try {
      const data = await serviceLogin({ username, password });
      if (data.error || !data.token) return data?.error ?? "Login fehlgeschlagen.";
      Cookies.set("accessToken", data.token, { secure: true, sameSite: "Strict" });   
      setAuthenticated(true);
      if (redirect) navigate("/");
      return null;
    } catch (e) {
      return "Unbekannter Fehler beim Login: " + e;
    }
  }

  async function register(username: string, password: string): Promise<RegisterResponse> {
    try {
      return await serviceRegister({ username, password });
    } catch (e) {
      return {
        success: false,
        message: "Unbekannter Fehler beim Registrieren: " + e,
      };
    }
  }

  function logout() {
    Cookies.remove("refreshToken");
    Cookies.remove("refresh_token");
    Cookies.remove("accessToken");
    setAuthenticated(false);
    navigate("/login");
  }

  async function refreshAuth() {
    try {
      const refreshed = await isAuthenticated();
      setAuthenticated(refreshed);
    } catch {
      setAuthenticated(false);
    }
  }

  useEffect(() => {
    checkAuth();
    const interval = setInterval(refreshAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}