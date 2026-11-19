import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eduquest_token') || null);
  const [selectedGrade, setSelectedGrade] = useState(() => {
    const saved = localStorage.getItem('eduquest_grade');
    return saved ? Number(saved) : 10;
  });
  const [loading, setLoading] = useState(true);

  // Check auth on load
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('eduquest_token');
      if (savedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            if (res.user.grade) {
              setSelectedGrade(res.user.grade);
              localStorage.setItem('eduquest_grade', res.user.grade);
            }
          } else {
            // Invalid token
            logout();
          }
        } catch (err) {
          console.error('Auth verification error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleGradeChange = (grade) => {
    const num = Number(grade);
    setSelectedGrade(num);
    localStorage.setItem('eduquest_grade', num);
  };

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success && res.token) {
      localStorage.setItem('eduquest_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.user.grade) handleGradeChange(res.user.grade);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('eduquest_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.user.grade) handleGradeChange(res.user.grade);
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const guestLogin = async (grade = 10, role = 'student') => {
    const res = await api.guestLogin(grade, role);
    if (res.success && res.token) {
      localStorage.setItem('eduquest_token', res.token);
      setToken(res.token);
      setUser(res.user);
      handleGradeChange(res.user.grade || grade);
      return { success: true };
    }
    return { success: false, message: res.message || 'Guest login failed' };
  };

  const logout = () => {
    localStorage.removeItem('eduquest_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        selectedGrade,
        setSelectedGrade: handleGradeChange,
        loading,
        login,
        register,
        guestLogin,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
