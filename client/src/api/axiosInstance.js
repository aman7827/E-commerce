/**
 * axiosInstance.js
 * Purpose: Single configured Axios instance for all API calls.
 * Full implementation in Phase 7 — interceptors, token refresh, etc.
 * Placeholder so imports don't break during development.
 */

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true, // Required for httpOnly cookie (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
