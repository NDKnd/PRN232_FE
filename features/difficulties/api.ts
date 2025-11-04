/**
 * Difficulty API Service
 * All difficulty related API calls
 * Matches Backend DifficultyController
 */

import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api";
import type {
  Difficulty,
  CreateDifficultyDto,
  UpdateDifficultyDto,
} from "./types";

export const difficultyApi = {
  /**
   * Get all difficulties
   * GET /api/difficulties
   */
  getAll: async (): Promise<ApiResponse<Difficulty[]>> => {
    return apiClient.get<Difficulty[]>(ENDPOINTS.DIFFICULTIES.BASE);
  },

  /**
   * Get difficulty by ID
   * GET /api/difficulties/{id}
   */
  getById: async (id: number): Promise<ApiResponse<Difficulty>> => {
    return apiClient.get<Difficulty>(ENDPOINTS.DIFFICULTIES.BY_ID(id));
  },

  /**
   * Create new difficulty
   * POST /api/difficulties
   */
  create: async (
    data: CreateDifficultyDto
  ): Promise<ApiResponse<Difficulty>> => {
    return apiClient.post<Difficulty>(ENDPOINTS.DIFFICULTIES.BASE, data);
  },

  /**
   * Update difficulty
   * PUT /api/difficulties
   */
  update: async (data: UpdateDifficultyDto): Promise<ApiResponse<void>> => {
    return apiClient.put<void>(ENDPOINTS.DIFFICULTIES.BASE, data);
  },

  /**
   * Delete difficulty
   * DELETE /api/difficulties/{id}
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(ENDPOINTS.DIFFICULTIES.BY_ID(id));
  },
} as const;
