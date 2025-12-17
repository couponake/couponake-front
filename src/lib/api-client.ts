import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

interface ErrorResponse {
  message: string;
  status: number;
}

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
  cache?: "no-store" | "force-cache";
  timeout?: number;
  lang?: string;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private baseURL: string;
  private defaultLang: string;

  constructor() {
    // Ensure API URL is defined
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "";
    if (!this.baseURL) {
      throw new Error(
        "NEXT_PUBLIC_API_URL is not defined in environment variables"
      );
    }

    // Set default language
    this.defaultLang = this.getCurrentLang();

    // Create axios instance
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Accept-Language": this.defaultLang,
      },
    });

    // Setup interceptors
    this.setupInterceptors();
  }

  private async getAccessToken(req?: NextRequest): Promise<string | undefined> {
    // Client-side: Get token from cookies
    if (typeof window !== "undefined") {
      return Cookies.get("access_token");
    }

    // Server-side: Get token from next-auth
    if (req) {
      const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      return session?.token as string;
    }

    return undefined;
  }

  private getCurrentLang(): string {
    if (typeof window !== "undefined") {
      return Cookies.get("NEXT_LOCALE") || "ar";
    }
    return "ar";
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(async (config) => {
      const token = await this.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        this.handleAuthError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleAuthError(error: AxiosError<ErrorResponse> | Error): void {
    // Check if it's an axios error with a 401 status
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 ||
        error.response?.status === 402 ||
        error.response?.data?.message?.includes("Unauthenticated.") ||
        error.response?.data?.message?.includes("Unauthorized"))
    ) {
      this.logoutUser();
    }
  }

  private logoutUser(): void {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.removeItem("access_token");
      Cookies.remove("access_token");
      signOut().then(() => {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      });
    }
  }

  // Standard Axios methods
  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
    req?: NextRequest
  ): Promise<T> {
    try {
      // Ensure token is set in headers for server-side requests
      if (req && config?.headers) {
        const token = await this.getAccessToken(req);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      const response: any = await this.axiosInstance.get<T>(endpoint, {
        maxRedirects: 0,
        validateStatus: () => true,
        ...config,
      });

      if (response.status === 400 || response.status === 404) {
        return response.data;
      }

      // Handle manual redirect response
      if (response.status === 301 || response.status === 302) {
        console.warn(
          `Redirected from ${endpoint} to ${response.headers.location}`
        );

        return response.data;
      }

      return response.data;
    } catch (error) {
      console.error(`GET request error at ${endpoint}:`, error);
      throw error;
    }
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
    req?: NextRequest
  ): Promise<T> {
    try {
      // Ensure token is set in headers for server-side requests
      if (req && config?.headers) {
        const token = await this.getAccessToken(req);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      const response = await this.axiosInstance.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST request error at ${endpoint}:`, error);
      throw error;
    }
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
    req?: NextRequest
  ): Promise<T> {
    try {
      // Ensure token is set in headers for server-side requests
      if (req && config?.headers) {
        const token = await this.getAccessToken(req);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      const response = await this.axiosInstance.put<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT request error at ${endpoint}:`, error);
      throw error;
    }
  }

  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
    req?: NextRequest
  ): Promise<T> {
    try {
      // Ensure token is set in headers for server-side requests
      if (req && config?.headers) {
        const token = await this.getAccessToken(req);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      const response = await this.axiosInstance.delete<T>(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE request error at ${endpoint}:`, error);
      throw error;
    }
  }

  // Next.js specific methods with caching strategies
  async fetchWithCache<T>(
    endpoint: string,
    options: FetchOptions = {},
    token?: string,
    req?: NextRequest
  ): Promise<T> {
    const {
      revalidate = 60,
      tags = [],
      cache = "force-cache",
      lang = this.defaultLang,
    } = options;

    try {
      // If token is not provided, try to get it
      if (!token && req) {
        token = await this.getAccessToken(req);
      }

      // Create a cache key that includes the endpoint and token
      const cacheKey = `${endpoint}${token ? `-${token.substring(0, 8)}` : ""}`;
      const tagsList = [...tags, cacheKey];

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        next: { revalidate, tags: tagsList },
        cache,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Accept-Language": lang,
          "Access-Control-Allow-Origin": "*",
        },
      });

      if (response.status === 400 || response.status === 404) {
        return response.json();
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 402) {
          this.logoutUser();
        }
        const errorText = await response.text();
        throw new Error(
          `API error: ${response.status} ${errorText.substring(0, 100)}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`Fetch with cache error at ${endpoint}:`, error);
      // Return empty object instead of throwing to prevent page crashes
      return {} as T;
    }
  }

  async fetchDynamic<T>(
    endpoint: string,
    token?: string,
    lang = this.defaultLang,
    timeoutMs = 10000,
    req?: NextRequest
  ): Promise<T> {
    try {
      // If token is not provided, try to get it
      if (!token && req) {
        token = await this.getAccessToken(req);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        cache: "no-store",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Accept-Language": lang,
        },
        // signal: controller.signal
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
            `API error: ${response.status} ${response.statusText}`
          );
        }
      }

      if (response?.status === 404 || response?.status === 400) {
        return response.json();
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 402) {
          this.logoutUser();
        }
        const errorText = await response.text();
        throw new Error(
          `API error: ${response.status} ${errorText.substring(0, 100)}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`Dynamic fetch error at ${endpoint}:`, error);
      // Return empty object instead of throwing
      return {} as T;
    }
  }

  // Helper methods for common patterns
  getAuthenticatedEndpoint(endpoint: string, token?: string): string {
    return `${!!token ? "user" : "guest"}/${endpoint}`;
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();

export default apiClient;
