/**
 * Lesson Plan API Service
 * All lesson plan related API calls
 * Matches Backend LessonPlanController
 */

import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api";
import type {
  LessonPlan,
  LessonPlanWithLessons,
  CreateLessonPlanDto,
  UpdateLessonPlanDto,
  DuplicateLessonPlanDto,
} from "./types";

export const lessonPlanApi = {
  /**
   * Get all lesson plans
   * GET /api/lesson-plans
   */
  getAll: async (): Promise<ApiResponse<LessonPlan[]>> => {
    return apiClient.get<LessonPlan[]>(ENDPOINTS.LESSON_PLANS.BASE);
  },

  /**
   * Get lesson plan by ID
   * GET /api/lesson-plans/{id}
   */
  getById: async (id: number): Promise<ApiResponse<LessonPlan>> => {
    return apiClient.get<LessonPlan>(ENDPOINTS.LESSON_PLANS.BY_ID(id));
  },

  /**
   * Get lesson plan with all lessons and details
   * GET /api/lesson-plans/{id}/with-lessons
   */
  getWithLessons: async (
    id: number
  ): Promise<ApiResponse<LessonPlanWithLessons>> => {
    return apiClient.get<LessonPlanWithLessons>(
      ENDPOINTS.LESSON_PLANS.WITH_LESSONS(id)
    );
  },

  /**
   * Get lesson plans by teacher
   * GET /api/lesson-plans/teacher/{teacherId}
   */
  getByTeacher: async (
    teacherId: number
  ): Promise<ApiResponse<LessonPlan[]>> => {
    return apiClient.get<LessonPlan[]>(
      ENDPOINTS.LESSON_PLANS.BY_TEACHER(teacherId)
    );
  },

  /**
   * Get lesson plans by level
   * GET /api/lesson-plans/level/{levelId}
   */
  getByLevel: async (levelId: number): Promise<ApiResponse<LessonPlan[]>> => {
    return apiClient.get<LessonPlan[]>(
      ENDPOINTS.LESSON_PLANS.BY_LEVEL(levelId)
    );
  },

  /**
   * Get all public lesson plans
   * GET /api/lesson-plans/public
   */
  getPublic: async (): Promise<ApiResponse<LessonPlan[]>> => {
    return apiClient.get<LessonPlan[]>(ENDPOINTS.LESSON_PLANS.PUBLIC);
  },

  /**
   * Search lesson plans by keyword
   * GET /api/lesson-plans/search?keyword={keyword}
   */
  search: async (keyword: string): Promise<ApiResponse<LessonPlan[]>> => {
    return apiClient.get<LessonPlan[]>(ENDPOINTS.LESSON_PLANS.SEARCH, {
      keyword,
    });
  },

  /**
   * Create new lesson plan
   * POST /api/lesson-plans
   */
  create: async (
    data: CreateLessonPlanDto
  ): Promise<ApiResponse<LessonPlan>> => {
    return apiClient.post<LessonPlan>(ENDPOINTS.LESSON_PLANS.BASE, data);
  },

  /**
   * Update lesson plan
   * PUT /api/lesson-plans/{id}
   */
  update: async (
    id: number,
    data: UpdateLessonPlanDto
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.put<{ message: string }>(
      ENDPOINTS.LESSON_PLANS.BY_ID(id),
      data
    );
  },

  /**
   * Delete lesson plan
   * DELETE /api/lesson-plans/{id}
   */
  delete: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.delete<{ message: string }>(
      ENDPOINTS.LESSON_PLANS.BY_ID(id)
    );
  },

  /**
   * Publish lesson plan
   * POST /api/lesson-plans/{id}/publish
   */
  publish: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(
      ENDPOINTS.LESSON_PLANS.PUBLISH(id),
      {}
    );
  },

  /**
   * Unpublish lesson plan
   * POST /api/lesson-plans/{id}/unpublish
   */
  unpublish: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(
      ENDPOINTS.LESSON_PLANS.UNPUBLISH(id),
      {}
    );
  },

  /**
   * Duplicate lesson plan for another teacher
   * POST /api/lesson-plans/{id}/duplicate
   */
  duplicate: async (
    id: number,
    data: DuplicateLessonPlanDto
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(
      ENDPOINTS.LESSON_PLANS.DUPLICATE(id),
      data
    );
  },

  /**
   * Check if lesson plan can be deleted
   * GET /api/lesson-plans/{id}/can-delete
   */
  canDelete: async (
    id: number
  ): Promise<ApiResponse<{ canDelete: boolean; message: string }>> => {
    return apiClient.get<{ canDelete: boolean; message: string }>(
      ENDPOINTS.LESSON_PLANS.CAN_DELETE(id)
    );
  },
} as const;
