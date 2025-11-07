/**
 * API Client Configuration
 * Centralized API client with error handling and interceptors
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5044/api";
    this.timeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Add authentication token to request
   */
  private getAuthHeaders(): HeadersInit {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      return {
        ...this.defaultHeaders,
        Authorization: `Bearer ${token}`,
      };
    }
    return this.defaultHeaders;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    // Combine baseURL and endpoint properly
    // Remove leading slash from endpoint if baseURL ends with slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const cleanBase = this.baseURL.endsWith('/') ? this.baseURL : this.baseURL + '/';
    const fullUrl = cleanBase + cleanEndpoint;
    
    const url = new URL(fullUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }

  /**
   * Make HTTP request with timeout
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, ...fetchConfig } = config;
    const url = this.buildURL(endpoint, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers: {
          ...this.getAuthHeaders(),
          ...fetchConfig.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return {
          success: true,
          data: (await response.text()) as any,
        };
      }

      const data = await response.json();

      // API returns success/error format
      if (!response.ok) {
        return {
          success: false,
          error: {
            code: response.status,
            message: data.error?.message || data.message || "Request failed",
          },
        };
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            error: {
              code: 408,
              message: "Request timeout",
            },
          };
        }

        return {
          success: false,
          error: {
            code: 0,
            message: error.message || "Network error",
          },
        };
      }

      return {
        success: false,
        error: {
          code: 0,
          message: "Unknown error occurred",
        },
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    params?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      params,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    params?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      params,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    params?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      params,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", params });
  }

  /**
   * Upload file
   */
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
      headers,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
