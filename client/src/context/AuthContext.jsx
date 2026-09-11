import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await authService.getMe();
          if (data) {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
          }
        } catch (err) {
          // If token is invalid (401), clean up, otherwise keep local cache
          if (err?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data?.token) {
      localStorage.setItem('token', data.token);
      const userData = data.user || data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return data;
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data?.token) {
      localStorage.setItem('token', data.token);
      const userObj = data.user || data;
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
      return data;
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager' || user?.role === 'admin',
    isReceptionist: user?.role === 'receptionist' || user?.role === 'admin',
    isHousekeeping: user?.role === 'housekeeping' || user?.role === 'admin',
    isStaff: ['admin', 'manager', 'receptionist', 'housekeeping'].includes(user?.role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
