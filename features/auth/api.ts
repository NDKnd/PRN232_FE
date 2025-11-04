/**
 * Auth API
 * Authentication-related API calls
 * Updated to match Backend API
 */

import { apiClient, ENDPOINTS } from "@/lib/api";
import type { ApiResponse } from "@/lib/api";
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  User,
  AuthUser,
} from "./types";

export const authApi = {
  /**
   * Login user
   * POST /api/auth/login
   * Body: { username, password }
   * Response: { token, userId, username, role }
   */
  login: (data: LoginDto): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data);
  },

  /**
   * Register new user
   * POST /api/auth/register
   * Body: { username, email, password, role, levelId, gradeLevel? }
   * Response: { userId, username, email, role, levelId, gradeLevel, isActive, createdAt }
   */
  register: (data: RegisterDto): Promise<ApiResponse<User>> => {
    return apiClient.post<User>(ENDPOINTS.AUTH.REGISTER, data);
  },

  /**
   * Logout user (client-side only)
   * Backend không có endpoint logout
   */
  logout: (): void => {
    authStorage.clear();
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
