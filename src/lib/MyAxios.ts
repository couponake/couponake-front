import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";

interface ErrorResponse {
  message: string;
  status: number;
}

let base_url: string = "";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined in environment variables",
  );
} else {
  base_url = process.env.NEXT_PUBLIC_API_URL;
}

const getAccessToken = (): string | null | undefined => {
  if (typeof window !== "undefined") {
    return Cookies.get("access_token");
  }
  return null;
};
const getCurrentLang = () => {
  if (typeof window !== "undefined") {
    return Cookies.get("NEXT_LOCALE") || "ar";
  }
  return "ar";
};

const currentLang = getCurrentLang();

// Create an instance of Axios with default settings
const MyAxios = axios.create({
  baseURL: base_url,
  withCredentials: false,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Accept-Language": currentLang,
  },
});

// Get the access token and set it in the Authorization header if available
const accessToken = getAccessToken();
if (accessToken) {
  MyAxios.defaults.headers.common["token"] = accessToken;
  MyAxios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

// Add a request interceptor to add the 'lang' header
MyAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  // if (currentLang) {
  //   config.headers["Accept-Language"] = currentLang;
  // }
  return config;
});

// Add a response interceptor
MyAxios.interceptors.response.use(
  async (response: AxiosResponse) => {
    // Return response if it's successful
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    // Check if the error response indicates the user is unauthenticated
    if (
      error.response?.status === 401 ||
      error.response?.data?.message?.includes("Unauthenticated.") ||
      error.response?.data?.message?.includes("Unauthorized")
    ) {
      // Clear the access token
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

export const api = {
  static: async <T>(
    endpoint: string,
    revalidate = 60,
    token?: string | undefined,
    lang = "ar",
  ): Promise<T> => {
    try {
      // Use a cache key that includes the endpoint and token to ensure proper caching
      const cacheKey = `${endpoint}${token ? `-${token.substring(0, 8)}` : ""}`;

      const response = await fetch(`${base_url}${endpoint}`, {
        next: { revalidate, tags: [cacheKey] },
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: token ? `Bearer ${token}` : "",
          "Accept-Language": lang || currentLang,
        },
      });

      if (response.status === 301) {
        try {
          const data = await response.json();
          if (data.redirect_url) {
            return data as T;
          }
        } catch (e) {
          console.error("Error parsing 301 response:", e);
          throw new Error(
            `API error: ${response.status} ${response.statusText}`,
          );
        }
      }

      if (!response.ok) {
        // Handle 401 Unauthorized responses
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            const currentPath =
              window.location.pathname + window.location.search;
            localStorage.removeItem("access_token");
            Cookies.remove("access_token");
            signOut().then(() => {
              window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
            });
          }
        }
        const errorText = await response.text();
        throw new Error(
          `API error: ${response.status} ${errorText.substring(0, 100)}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error(`Static fetch error at ${endpoint}:`, error);
      // Return a default empty response instead of throwing to prevent page crashes
      return {} as T;
    }
  },

  dynamic: async <T>(
    endpoint: string,
    token?: string | undefined,
    lang = "ar",
  ): Promise<T> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${base_url}${endpoint}`, {
        cache: "no-store",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Accept-Language": lang || currentLang,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 301) {
        try {
          const data = await response.json();
          if (data.redirect_url) {
            return data as T;
          }
        } catch (e) {
          console.error("Error parsing 301 response:", e);
          throw new Error(
            `API error: ${response.status} ${response.statusText}`,
          );
        }
      }

      if (response?.status === 404 || response?.status === 400) {
        return response.json();
      }

      if (!response.ok) {
        // Handle 401 Unauthorized responses
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            const currentPath =
              window.location.pathname + window.location.search;
            localStorage.removeItem("access_token");
            Cookies.remove("access_token");
            signOut().then(() => {
              window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
            });
          }
        }
        const errorText = await response.text();
        throw new Error(
          `API error: ${response.status} ${errorText.substring(0, 100)}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error(`Dynamic fetch error at ${endpoint}:`, error);
      // Return a default empty response instead of throwing
      return {} as T;
    }
  },
};

export default MyAxios;
