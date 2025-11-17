/**
 * Submissions API Service
 * All quiz submission related API calls
 * Matches Backend SubmissionsController
 */

import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api";
import type {
  SubmissionStartResponse,
  SubmissionResult,
  SubmissionSummary,
  SubmitAnswersDto,
} from "./types";

export const submissionsApi = {
  /**
   * Start a new quiz submission
   * POST /api/submissions/start/{quizId}
   */
  start: async (quizId: number): Promise<ApiResponse<SubmissionStartResponse>> => {
    return apiClient.post<SubmissionStartResponse>(
      ENDPOINTS.SUBMISSIONS.START(quizId),
      {}
    );
  },

  /**
   * Submit answers for a submission
   * POST /api/submissions/{submissionId}/submit
   */
  submit: async (
    submissionId: number,
    data: SubmitAnswersDto
  ): Promise<ApiResponse<SubmissionResult>> => {
    return apiClient.post<SubmissionResult>(
      ENDPOINTS.SUBMISSIONS.SUBMIT(submissionId),
      data
    );
  },

  /**
   * Get submission details by ID
   * GET /api/submissions/{submissionId}
   */
  getById: async (submissionId: number): Promise<ApiResponse<SubmissionResult>> => {
    return apiClient.get<SubmissionResult>(
      ENDPOINTS.SUBMISSIONS.BY_ID(submissionId)
    );
  },

  /**
   * Get all submissions for a quiz (history)
   * GET /api/submissions/quiz/{quizId}
   */
  getByQuiz: async (quizId: number): Promise<ApiResponse<SubmissionSummary[]>> => {
    return apiClient.get<SubmissionSummary[]>(
      ENDPOINTS.SUBMISSIONS.BY_QUIZ(quizId)
    );
  },
} as const;