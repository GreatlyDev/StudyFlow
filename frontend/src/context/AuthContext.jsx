import { createContext, useContext, useEffect, useState } from "react";

import { authApi } from "../api/client";

const TOKEN_KEY = "studyflow_token";
const USER_KEY = "studyflow_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  const saveSession = (authData) => {
    setToken(authData.access_token);
    setUser(authData.user);
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.getCurrentUser(token);
        if (isMounted) {
          setUser(currentUser);
          localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        }
      } catch (error) {
        if (isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (credentials) => {
    const authData = await authApi.login(credentials);
    saveSession(authData);
    return authData.user;
  };

  const signup = async (payload) => {
    const authData = await authApi.register(payload);
    saveSession(authData);
    return authData.user;
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
