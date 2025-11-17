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
import { authStorage } from "./storage";

export const authApi = {
  /**
   * Login user
   * POST /api/auth/login
   * Body: { username, password }
   * Response: { token, userId, username, role }
   */
  login: async (data: LoginDto): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      data
    );

    // Backend trả về data trực tiếp, không wrap trong { success, data }
    // Cần transform response để phù hợp với ApiResponse format
    if (response.success && response.data) {
      return response;
    }

    // Nếu backend trả về token trực tiếp (không có success wrapper)
    if ((response as any).token) {
      return {
        success: true,
        data: response as any,
      };
    }

    return response;
  },

  /**
   * Register new user
   * POST /api/auth/register
   * Body: { username, email, password, role, levelId, gradeLevel? }
   * Response: { userId, username, email, role, levelId, gradeLevel, isActive, createdAt }
   */
  register: async (data: RegisterDto): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<User>(ENDPOINTS.AUTH.REGISTER, data);

    // Backend trả về user object trực tiếp sau khi tạo thành công
    if (response.success && response.data) {
      return response;
    }

    // Nếu backend trả về user trực tiếp (không có success wrapper)
    if ((response as any).userId) {
      return {
        success: true,
        data: response as any,
      };
    }

    return response;
  },

  /**
   * Logout user (client-side only)
   * Backend không có endpoint logout
   */
  logout: (): void => {
    authStorage.clear();
  },
};
