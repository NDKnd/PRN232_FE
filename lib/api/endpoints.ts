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

  // Questions
  QUESTIONS: {
    BASE: "/questions",
    AVAILABLE: "/questions/available",
  },

  // Levels
  LEVELS: {
    BASE: "/levels",
    BY_ID: (id: number) => `/levels/${id}`,
  },

  // Attachments
  ATTACHMENTS: {
    BASE: "/attachments",
    BY_ID: (id: number) => `/attachments/${id}`,
  },

  // Quizzes
  QUIZZES: {
    BASE: "/quizzes",
    BY_ID: (id: number) => `/quizzes/${id}`,
    MY_QUIZZES: "/quizzes/my-quizzes",
    PUBLISH: (id: number) => `/quizzes/${id}/publish`,
    UNPUBLISH: (id: number) => `/quizzes/${id}/unpublish`,
    STATISTICS: (id: number) => `/quizzes/${id}/statistics`,
    ADD_QUESTIONS: (id: number) => `/quizzes/${id}/questions`,
    REMOVE_QUESTION: (id: number, questionId: number) => `/quizzes/${id}/questions/${questionId}`,
  },

  // AI
  AI: {
    LESSON_PLANS_GENERATE: "/ai/lesson-plans/generate",
    LESSON_PLANS_PREVIEW: "/ai/lesson-plans/preview",
    QUESTIONS_GENERATE: "/ai/questions/generate",
    QUESTIONS_PREVIEW: "/ai/questions/preview",
    QUIZZES_GENERATE: "/ai/quizzes/generate",
    QUIZZES_PREVIEW: "/ai/quizzes/preview",
    CHAT: "/ai/chat",
    HEALTH: "/ai/health",
    REQUESTS_HISTORY: "/ai/requests/history",
    REQUESTS_DETAIL: (id: number) => `/ai/requests/${id}`,
  },
    // Thêm vào file ENDPOINTS
PROGRESS: {
    START: (lessonId: number) => `/progress/start/${lessonId}`,
    COMPLETE: (lessonId: number) => `/progress/complete/${lessonId}`,
    BY_LESSON_PLAN: (lessonPlanId: number) =>
      `/progress/lesson-plan/${lessonPlanId}`,
    OVERALL: "/progress/overall",
    SCORE_TREND: "/progress/score-trend",
    TOPICS: "/progress/topics",
    IMPROVEMENT: "/progress/improvement",
  },

  // ------------------- SUBMISSIONS -------------------
  SUBMISSIONS: {
    START: (quizId: number) => `/submissions/start/${quizId}`,
    SUBMIT: (submissionId: number) => `/submissions/${submissionId}/submit`,
    BY_ID: (submissionId: number) => `/submissions/${submissionId}`,
    BY_QUIZ: (quizId: number) => `/submissions/quiz/${quizId}`,
  },
} as const;

export default ENDPOINTS;
