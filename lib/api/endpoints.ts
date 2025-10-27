/**
 * API Endpoints
 * Centralized endpoint definitions
 */

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  // Users
  USERS: {
    BASE: "/users",
    BY_ID: (id: number) => `/users/${id}`,
    BY_ROLE: (role: number) => `/users/role/${role}`,
    BY_LEVEL: (levelId: number) => `/users/level/${levelId}`,
  },

  // Lessons
  LESSONS: {
    PLANS: {
      BASE: "/lessonplans",
      BY_ID: (id: number) => `/lessonplans/${id}`,
      BY_TEACHER: (teacherId: number) => `/lessonplans/teacher/${teacherId}`,
      BY_LEVEL: (levelId: number) => `/lessonplans/level/${levelId}`,
      BY_STATUS: (status: number) => `/lessonplans/status/${status}`,
      PUBLISH: (id: number) => `/lessonplans/${id}/publish`,
      EXPORT: (id: number) => `/lessonplans/${id}/export`,
    },
    BASE: "/lessons",
    BY_ID: (id: number) => `/lessons/${id}`,
    BY_PLAN: (planId: number) => `/lessons/plan/${planId}`,
    SHARED: "/lessons/shared",
    DETAILS: {
      BASE: "/lessondetails",
      BY_ID: (id: number) => `/lessondetails/${id}`,
      BY_LESSON: (lessonId: number) => `/lessondetails/lesson/${lessonId}`,
      REORDER: (lessonId: number) =>
        `/lessondetails/lesson/${lessonId}/reorder`,
    },
  },

  // Quizzes
  QUIZZES: {
    BASE: "/quizzes",
    BY_ID: (id: number) => `/quizzes/${id}`,
    BY_TEACHER: (teacherId: number) => `/quizzes/teacher/${teacherId}`,
    BY_LEVEL: (levelId: number) => `/quizzes/level/${levelId}`,
    PUBLISH: (id: number) => `/quizzes/${id}/publish`,
  },

  // Questions
  QUESTIONS: {
    BASE: "/questions",
    BY_ID: (id: number) => `/questions/${id}`,
    BY_QUIZ: (quizId: number) => `/questions/quiz/${quizId}`,
    BY_TOPIC: (topic: number) => `/questions/topic/${topic}`,
    BY_TYPE: (type: number) => `/questions/type/${type}`,
    BY_DIFFICULTY: (difficultyId: number) =>
      `/questions/difficulty/${difficultyId}`,
    SEARCH: "/questions/search",
  },

  // Answers
  ANSWERS: {
    BASE: "/answers",
    BY_ID: (id: number) => `/answers/${id}`,
    BY_QUESTION: (questionId: number) => `/answers/question/${questionId}`,
  },

  // Question Banks
  QUESTION_BANKS: {
    BASE: "/questionbanks",
    BY_ID: (id: number) => `/questionbanks/${id}`,
    QUESTIONS: (bankId: number) => `/questionbanks/${bankId}/questions`,
    PUBLIC: "/questionbanks/public",
  },

  // Submissions
  SUBMISSIONS: {
    BASE: "/submissions",
    BY_ID: (id: number) => `/submissions/${id}`,
    BY_QUIZ: (quizId: number) => `/submissions/quiz/${quizId}`,
    BY_STUDENT: (studentId: number) => `/submissions/student/${studentId}`,
    SUBMIT: (id: number) => `/submissions/${id}/submit`,
    GRADE: (id: number) => `/submissions/${id}/grade`,
    DETAILS: (id: number) => `/submissions/${id}/details`,
  },

  // AI Requests
  AI: {
    BASE: "/airequests",
    BY_ID: (id: number) => `/airequests/${id}`,
    BY_USER: (userId: number) => `/airequests/user/${userId}`,
    BY_STATUS: (status: number) => `/airequests/status/${status}`,
  },

  // Progress
  PROGRESS: {
    BASE: "/progress",
    BY_STUDENT: (studentId: number) => `/progress/student/${studentId}`,
    BY_LESSON: (lessonId: number) => `/progress/lesson/${lessonId}`,
    SPECIFIC: (studentId: number, lessonId: number) =>
      `/progress/student/${studentId}/lesson/${lessonId}`,
    COMPLETE: (studentId: number, lessonId: number) =>
      `/progress/student/${studentId}/lesson/${lessonId}/complete`,
    OVERVIEW: (studentId: number) => `/progress/student/${studentId}/overview`,
  },

  // Levels
  LEVELS: {
    BASE: "/levels",
    BY_ID: (id: number) => `/levels/${id}`,
  },

  // Difficulties
  DIFFICULTIES: {
    BASE: "/difficulties",
    BY_ID: (id: number) => `/difficulties/${id}`,
  },

  // Analytics
  ANALYTICS: {
    CLASS_OVERVIEW: (teacherId: number) =>
      `/analytics/class-overview/${teacherId}`,
    STUDENT_PROGRESS: (studentId: number) =>
      `/analytics/student-progress/${studentId}`,
  },

  // Export
  EXPORT: {
    BASE: (type: string) => `/export/${type}`,
  },
} as const;

export default ENDPOINTS;
