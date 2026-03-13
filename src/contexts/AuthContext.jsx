import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Base URL for Node.js Auth
  const API_URL = "http://localhost:5000/api/users";

  // Global Axios Interceptor: Automatically attaches token to every request
  // This is vital so the Flask backend on port 18080 also gets the token!
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role: role.toLowerCase(), // Normalize role string
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      // Destructure based on your specific backend response structure
      const { token, user: userData } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        setUser(userData);
        return userData;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Invalid credentials");
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/me`);
        setUser(response.data.user || response.data);
      } catch (error) {
        console.error("Session expired");
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [logout]);

  const value = {
    user,
    loading,
    // Normalize case sensitivity for role checks
    isAdmin: user?.role?.toLowerCase() === "admin",
    isTeacher: ["teacher", "instructor"].includes(user?.role?.toLowerCase()),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);