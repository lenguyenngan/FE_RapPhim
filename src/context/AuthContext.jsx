import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

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
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('role');

      if (storedToken && storedUser && storedRole) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      const { token: newToken, user: userData, role: userRole } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userRole);
      
      // Update state
      setToken(newToken);
      setUser(userData);
      setRole(userRole);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Đăng nhập thất bại'
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Đăng ký thất bại'
      };
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    // Clear state
    setToken(null);
    setUser(null);
    setRole(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(token && user && role);
  };

  // Check if user is admin
  const isAdmin = () => {
    return role === 'admin' || role === 'superadmin';
  };

  const value = {
    user,
    token,
    role,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
