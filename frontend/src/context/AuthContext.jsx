import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authApi, setAccessToken, clearAccessToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true during initial session restore
  const isRestoringRef = useRef(false);

  // ── Session restore on app load ──────────────────────────────────────────
  useEffect(() => {
    if (isRestoringRef.current) return;
    isRestoringRef.current = true;

    authApi.post('/auth/refresh')
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        setUser(data.user);
      })
      .catch(() => {
        // No valid session — user needs to log in
        clearAccessToken();
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { data } = await authApi.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  // ── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (fullName, email, password) => {
    const { data } = await authApi.post('/auth/register', { fullName, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authApi.post('/auth/logout');
    } catch {
      // Best-effort logout — clear client state regardless
    }
    clearAccessToken();
    setUser(null);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
