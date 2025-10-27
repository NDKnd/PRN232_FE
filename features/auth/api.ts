/**
 * Auth API
 * Authentication-related API calls
 */

import { apiClient, ENDPOINTS } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";
import type { LoginDto, AuthResponse, AuthUser } from "./types";

export const authApi = {
  /**
   * Login user
   */
  login: (data: LoginDto): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data);
  },

  /**
   * Logout user
   */
  logout: (): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(ENDPOINTS.AUTH.LOGOUT, {});
  },

  /**
   * Get current user profile
   */
  getProfile: (): Promise<ApiResponse<AuthUser>> => {
    return apiClient.get<AuthUser>(ENDPOINTS.AUTH.PROFILE);
  },

  /**
   * Refresh token
   */
  refreshToken: (): Promise<ApiResponse<{ token: string }>> => {
    return apiClient.post<{ token: string }>(ENDPOINTS.AUTH.REFRESH, {});
  },

  /**
   * Change password
   */
  changePassword: (
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    });
  },
};

/**
 * Auth Storage Helper
 */
export const authStorage = {
  /**
   * Save auth token to localStorage
   */
  saveToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  /**
   * Get auth token from localStorage
   */
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  /**
   * Remove auth token from localStorage
   */
  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  /**
   * Save user data to localStorage
   */
  saveUser: (user: AuthUser): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  /**
   * Get user data from localStorage
   */
  getUser: (): AuthUser | null => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  /**
   * Remove user data from localStorage
   */
  removeUser: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  },

  /**
   * Clear all auth data
   */
  clear: (): void => {
    authStorage.removeToken();
    authStorage.removeUser();
  },
};
