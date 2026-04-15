import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authApi, setAccessToken, clearAccessToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  // ── Register (Phase 2: returns email, NOT tokens — OTP required next) ────
  const register = useCallback(async (fullName, email, password) => {
    const { data } = await authApi.post('/auth/register', { fullName, email, password });
    // data = { email, message } — no tokens until OTP is verified
    return data;
  }, []);

  // ── Verify OTP (issues tokens, logs user in) ─────────────────────────────
  const verifyOtp = useCallback(async (email, otp) => {
    const { data } = await authApi.post('/auth/verify-otp', { email, otp });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  // ── Resend OTP ───────────────────────────────────────────────────────────
  const resendOtp = useCallback(async (email) => {
    const { data } = await authApi.post('/auth/resend-otp', { email });
    return data;
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authApi.post('/auth/logout');
    } catch {
      // Best-effort — clear client state regardless
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
    verifyOtp,
    resendOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
