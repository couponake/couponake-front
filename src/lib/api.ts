import apiClient from './api-client';

/**
 * Unified API interface that provides consistent methods for data fetching
 * This wrapper maintains compatibility with existing code while using the new centralized client
 */
export const api = {
  /**
   * Fetch data with caching (similar to the original api.static)
   * @param endpoint API endpoint path
   * @param revalidate Cache revalidation time in seconds
   * @param token Optional authentication token
   * @param lang Optional language code
   */
  static: async <T>(endpoint: string, revalidate = 60, token?: string, lang = 'ar'): Promise<T> => {
    return apiClient.fetchWithCache<T>(endpoint, { revalidate, lang }, token);
  },

  /**
   * Fetch data without caching (similar to the original api.dynamic)
   * @param endpoint API endpoint path
   * @param token Optional authentication token
   * @param lang Optional language code
   */
  dynamic: async <T>(endpoint: string, token?: string, lang = 'ar'): Promise<T> => {
    return apiClient.fetchDynamic<T>(endpoint, token, lang);
  },

  /**
   * Helper method to get data from an endpoint that requires authentication
   * Automatically handles guest vs user routes
   * @param endpoint Base endpoint path (without user/guest prefix)
   * @param token Optional authentication token
   * @param options Additional fetch options
   */
  getAuthenticatedData: async <T>(endpoint: string, token?: string, options = { revalidate: 60, lang: 'ar' }): Promise<T> => {
    const authenticatedEndpoint = apiClient.getAuthenticatedEndpoint(endpoint, token);
    return apiClient.fetchWithCache<T>(authenticatedEndpoint, options, token);
  },

  /**
   * Helper method to get data dynamically from an endpoint that requires authentication
   * Automatically handles guest vs user routes
   * @param endpoint Base endpoint path (without user/guest prefix)
   * @param token Optional authentication token
   * @param lang Optional language code
   */
  getAuthenticatedDynamicData: async <T>(endpoint: string, token?: string, lang = 'ar'): Promise<T> => {
    const authenticatedEndpoint = apiClient.getAuthenticatedEndpoint(endpoint, token);
    return apiClient.fetchDynamic<T>(authenticatedEndpoint, token, lang);
  },

  /**
   * Direct access to the underlying axios instance for more complex requests
   */
  request: {
    get: async <T = any>(endpoint: string, config = {}): Promise<T> => {
      return apiClient.get(endpoint, config);
    },
    post: async <T = any>(endpoint: string, data = {}, config = {}): Promise<T> => {
      return apiClient.post(endpoint, data, config);
    },
    put: async <T = any>(endpoint: string, data = {}, config = {}): Promise<T> => {
      return apiClient.put(endpoint, data, config);
    },
    delete: async <T = any>(endpoint: string, config = {}): Promise<T> => {
      return apiClient.delete(endpoint, config);
    }
  }
};

export default api;