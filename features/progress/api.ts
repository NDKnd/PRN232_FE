/**
 * Progress API Service
 * All student progress tracking API calls
 * Matches Backend ProgressController (real endpoints)
 */

import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api";
import type {
  Progress,
  ScoreTrend,
  TopicProgress,
  AreaForImprovement,
  OverallProgress,
} from "./types";

export const progressApi = {
  // ==================== LESSON PROGRESS ====================

  /**
   * Start a lesson
   * POST /api/progress/start/{lessonId}
   */
  startLesson: async (lessonId: number): Promise<ApiResponse<Progress>> => {
    return apiClient.post<Progress>(ENDPOINTS.PROGRESS.START(lessonId), {});
  },

  /**
   * Complete a lesson
   * POST /api/progress/complete/{lessonId}
   */
  completeLesson: async (
    lessonId: number
  ): Promise<ApiResponse<Progress>> => {
    return apiClient.post<Progress>(ENDPOINTS.PROGRESS.COMPLETE(lessonId), {});
  },

  /**
   * Get progress by lesson plan
   * GET /api/progress/lesson-plan/{lessonPlanId}
   */
  getByLessonPlan: async (
    lessonPlanId: number
  ): Promise<ApiResponse<Progress[]>> => {
    return apiClient.get<Progress[]>(
      ENDPOINTS.PROGRESS.BY_LESSON_PLAN(lessonPlanId)
    );
  },

  // ==================== ANALYTICS ====================

  /**
   * Get overall progress summary
   * GET /api/progress/overall
   */
  getOverall: async (): Promise<ApiResponse<OverallProgress>> => {
    return apiClient.get<OverallProgress>(ENDPOINTS.PROGRESS.OVERALL);
  },

  /**
   * Get score trend by week
   * GET /api/progress/score-trend
   * Response: [{ week: "Week 47", score: 0 }]
   */
  getScoreTrend: async (): Promise<ApiResponse<ScoreTrend[]>> => {
    return apiClient.get<ScoreTrend[]>(ENDPOINTS.PROGRESS.SCORE_TREND);
  },

  /**
   * Get progress by topics
   * GET /api/progress/topics
   * Response: [{ topicName, completed, total, progressPercent }]
   */
  getTopics: async (): Promise<ApiResponse<TopicProgress[]>> => {
    return apiClient.get<TopicProgress[]>(ENDPOINTS.PROGRESS.TOPICS);
  },

  /**
   * Get areas for improvement
   * GET /api/progress/improvement
   * Response: List<AreaForImprovementResponse>
   */
  getImprovement: async (): Promise<ApiResponse<AreaForImprovement[]>> => {
    return apiClient.get<AreaForImprovement[]>(ENDPOINTS.PROGRESS.IMPROVEMENT);
  },
} as const;