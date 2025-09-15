import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../API/api.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try donor profile first
      const donorResponse = await authAPI.getDonorProfile();
      setUser(donorResponse.user);
      console.log(donorResponse.user);
    } catch (donorError) {
      try {
        // If donor fails, try org profile
        const orgResponse = await authAPI.getOrgProfile();
        setUser(orgResponse.user);
        console.log(orgResponse.user);
      } catch (orgError) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const userLogin = async (email, password) => {
    try {
      const response = await authAPI.userLogin(email, password);
      setUser(response.user);
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.error || error.message || "User login failed",
      };
    }
  };

  const orgLogin = async (email, password) => {
    try {
      const response = await authAPI.orgLogin(email, password);
      setUser(response.user);
      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.error || error.message || "Organization login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null);
      return { success: true, message: "Logged out successfully" };
    }
  };

  const value = {
    user,
    loading,
    userLogin,
    orgLogin,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
