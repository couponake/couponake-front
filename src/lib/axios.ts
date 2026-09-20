import axios from "axios";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
// Create an axios instance with a base URL
const baseURL =
  process.env.NEXT_PUBLIC_Couponake_API_URL || "http://localhost:3000"; // Fallback for server

const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.data?.message?.includes("Unauthorized")
    ) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname + window.location.search;
        localStorage.removeItem("access_token");
        Cookies.remove("access_token");
        signOut().then(() => {
          window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
        });
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
