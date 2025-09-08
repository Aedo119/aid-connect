import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000", // your backend
  withCredentials: true, // send/receive cookies
});

// Refresh function
async function refreshToken() {
  try {
    await api.post("/auth/refresh"); // cookies handled automatically
    return true;
  } catch (err) {
    console.error("Refresh failed:", err.response?.data || err.message);
    return false;
  }
}

// Interceptor
api.interceptors.response.use(
  (response) => response, // pass successful responses
  async (error) => {
    if (error.response?.status === 401) {
      // Access token expired → try refresh
      const refreshed = await refreshToken();
      if (refreshed) {
        return api(error.config); // retry original request
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  // User (Donor) Login
  userLogin: async (email, password) => {
    try {
      const response = await api.post("/auth/user/login", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Organization (NGO) Login
  orgLogin: async (email, password) => {
    try {
      const response = await api.post("/auth/org/login", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Refresh token
  refresh: async () => {
    try {
      const response = await api.post("/auth/refresh");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // User (Donor) Signup
  userSignup: async (userData) => {
    try {
      const response = await api.post("/user/signup", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Organization (NGO) Signup
  orgSignup: async (orgData) => {
    try {
      const response = await api.post("/org/signup", orgData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
