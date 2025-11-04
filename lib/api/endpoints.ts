/**
 * API Endpoints
 * Centralized endpoint definitions
 * Updated to match Backend API routes
 */

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  // Users (Admin only - requires Bearer token với role Admin)
  USERS: {
    BASE: "/users",
    BY_ID: (id: number) => `/users/${id}`,
  },

  // Lesson Plans
  LESSON_PLANS: {
    BASE: "/lesson-plans",
    BY_ID: (id: number) => `/lesson-plans/${id}`,
    WITH_LESSONS: (id: number) => `/lesson-plans/${id}/with-lessons`,
    BY_TEACHER: (teacherId: number) => `/lesson-plans/teacher/${teacherId}`,
    BY_LEVEL: (levelId: number) => `/lesson-plans/level/${levelId}`,
    PUBLIC: "/lesson-plans/public",
    SEARCH: "/lesson-plans/search",
    PUBLISH: (id: number) => `/lesson-plans/${id}/publish`,
    UNPUBLISH: (id: number) => `/lesson-plans/${id}/unpublish`,
    DUPLICATE: (id: number) => `/lesson-plans/${id}/duplicate`,
    CAN_DELETE: (id: number) => `/lesson-plans/${id}/can-delete`,
  },

  // Lessons
  LESSONS: {
    BASE: "/lessons",
    BY_ID: (id: number) => `/lessons/${id}`,
  },

  // Lesson Details
  LESSON_DETAILS: {
    BASE: "/lesson-details",
    BY_ID: (id: number) => `/lesson-details/${id}`,
  },

  // Question Banks
  QUESTION_BANKS: {
    BASE: "/question-banks",
    BY_ID: (id: number) => `/question-banks/${id}`,
  },

  // Difficulties
  DIFFICULTIES: {
    BASE: "/difficulties",
    BY_ID: (id: number) => `/difficulties/${id}`,
  },

  // Attachments
  ATTACHMENTS: {
    BASE: "/attachments",
    BY_ID: (id: number) => `/attachments/${id}`,
  },
} as const;

export default ENDPOINTS;
