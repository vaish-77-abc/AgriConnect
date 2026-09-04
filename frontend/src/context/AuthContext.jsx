import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agri_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('agri_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('agri_token');
      if (storedToken) {
        try {
          const res = await api.get('/api/auth/me');
          setUser(res.data);
          localStorage.setItem('agri_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Session validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('agri_token', access_token);
    localStorage.setItem('agri_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/api/auth/register', userData);
    const { access_token, user: newUser } = res.data;
    setToken(access_token);
    setUser(newUser);
    localStorage.setItem('agri_token', access_token);
    localStorage.setItem('agri_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agri_token');
    localStorage.removeItem('agri_user');
  };

  const updateUser = (newUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newUserData };
      localStorage.setItem('agri_user', JSON.stringify(updated));
      return updated;
    });
  };

  const isFarmer = user?.role === 'farmer';
  const isWorker = user?.role === 'worker';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isFarmer,
        isWorker,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
