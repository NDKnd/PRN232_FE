/**
 * Question Bank API Service
 * All question bank related API calls
 * Matches Backend QuestionBankController
 */

import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api";
import type {
  QuestionBank,
  CreateQuestionBankDto,
  UpdateQuestionBankDto,
} from "./types";

export const questionBankApi = {
  /**
   * Get all question banks
   * GET /api/question-banks
   */
  getAll: async (): Promise<ApiResponse<QuestionBank[]>> => {
    return apiClient.get<QuestionBank[]>(ENDPOINTS.QUESTION_BANKS.BASE);
  },

  /**
   * Get question bank by ID
   * GET /api/question-banks/{id}
   */
  getById: async (id: number): Promise<ApiResponse<QuestionBank>> => {
    return apiClient.get<QuestionBank>(ENDPOINTS.QUESTION_BANKS.BY_ID(id));
  },

  /**
   * Create new question bank
   * POST /api/question-banks
   */
  create: async (
    data: CreateQuestionBankDto
  ): Promise<ApiResponse<QuestionBank>> => {
    return apiClient.post<QuestionBank>(ENDPOINTS.QUESTION_BANKS.BASE, data);
  },

  /**
   * Update question bank
   * PUT /api/question-banks
   */
  update: async (data: UpdateQuestionBankDto): Promise<ApiResponse<void>> => {
    return apiClient.put<void>(ENDPOINTS.QUESTION_BANKS.BASE, data);
  },

  /**
   * Delete question bank
   * DELETE /api/question-banks/{id}
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(ENDPOINTS.QUESTION_BANKS.BY_ID(id));
  },
} as const;
