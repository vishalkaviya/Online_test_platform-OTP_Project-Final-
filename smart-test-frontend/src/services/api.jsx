// src/services/api.js
import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api/", // ✅ Update if your backend is hosted elsewhere
});

// Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Add JWT token to every request
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
