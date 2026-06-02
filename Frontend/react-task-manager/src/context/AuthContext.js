import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = process.env.REACT_APP_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // On mount: try to restore session
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const res = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          setUser(res.data.data);
          setToken(savedToken);
        } catch {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  // Register (user)
  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  // Login (user)
  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  // Admin Login
  const adminLogin = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/admin/login`, { email, password });
    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return res.data;
  };

  // Reset Password
  const resetPassword = async (resetToken, password) => {
    const res = await axios.post(`${API_URL}/auth/reset-password/${resetToken}`, { password });
    return res.data;
  };

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!token && !!user;

  // Axios helper: authenticated request header
  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isLoggedIn,
        register,
        login,
        adminLogin,
        logout,
        forgotPassword,
        resetPassword,
        authHeader
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
