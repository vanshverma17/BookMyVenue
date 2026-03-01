/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, setAuthToken, getAuthToken } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const token = getAuthToken();

        // Prefer token-based session
        if (token) {
          const me = await authApi.me();
          const meUser = me?.data ?? null;
          setUser(meUser);
          if (meUser) {
            localStorage.setItem('user', JSON.stringify(meUser));
          }
          return;
        }

        // Backward compatible: allow local-only sessions
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        // Token invalid/expired or backend down
        if (import.meta?.env?.DEV) console.debug(error);
        setAuthToken(null);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const login = (payload) => {
    // Supports either login(userData) or login({ user, token })
    const token = payload?.token;
    const userData = payload?.user ?? payload;

    if (token) setAuthToken(token);

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('user');
  };

  const refreshMe = async () => {
    const me = await authApi.me();
    const meUser = me?.data ?? null;
    setUser(meUser);
    if (meUser) localStorage.setItem('user', JSON.stringify(meUser));
    return meUser;
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, loading, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
};
