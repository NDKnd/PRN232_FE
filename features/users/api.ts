/**
 * User API Service
 * All user-related API calls
 */

import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api";
import type { User, CreateUserDto, UpdateUserDto } from "./types";

export const userApi = {
  /**
   * Get all users with optional pagination
   */
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
    return apiClient.get<User[]>(ENDPOINTS.USERS.BASE, { page, limit });
  },

  /**
   * Get user by ID
   */
  getById: async (id: number): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(ENDPOINTS.USERS.BY_ID(id));
  },

  /**
   * Create new user
   */
  create: async (data: CreateUserDto): Promise<ApiResponse<User>> => {
    return apiClient.post<User>(ENDPOINTS.USERS.BASE, data);
  },

  /**
   * Update user
   */
  update: async (
    id: number,
    data: UpdateUserDto
  ): Promise<ApiResponse<User>> => {
    return apiClient.put<User>(ENDPOINTS.USERS.BY_ID(id), data);
  },

  /**
   * Delete user
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(ENDPOINTS.USERS.BY_ID(id));
  },

  /**
   * Get users by role
   */
  getByRole: async (role: number): Promise<ApiResponse<User[]>> => {
    return apiClient.get<User[]>(ENDPOINTS.USERS.BY_ROLE(role));
  },

  /**
   * Get users by level
   */
  getByLevel: async (levelId: number): Promise<ApiResponse<User[]>> => {
    return apiClient.get<User[]>(ENDPOINTS.USERS.BY_LEVEL(levelId));
  },
} as const;
