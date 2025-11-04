/**
 * User API Service
 * All user-related API calls
 * Updated to match Backend API
 */

import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api";
import type { User, UpdateUserDto } from "./types";

export const userApi = {
  /**
   * Get all users (Admin only)
   * GET /api/users
   * Requires: Bearer token with Admin role
   */
  getAll: async (): Promise<ApiResponse<User[]>> => {
    return apiClient.get<User[]>(ENDPOINTS.USERS.BASE);
  },

  /**
   * Get user by ID (Admin only)
   * GET /api/users/{id}
   */
  getById: async (id: number): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(ENDPOINTS.USERS.BY_ID(id));
  },

  /**
   * Update user (Admin only)
   * PUT /api/users/{id}
   */
  update: async (
    id: number,
    data: UpdateUserDto
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.put<{ message: string }>(ENDPOINTS.USERS.BY_ID(id), data);
  },

  /**
   * Delete user (soft delete - set IsActive = false) (Admin only)
   * DELETE /api/users/{id}
   */
  delete: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.delete<{ message: string }>(ENDPOINTS.USERS.BY_ID(id));
  },
} as const;
