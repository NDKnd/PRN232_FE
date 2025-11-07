import apiClient, { ApiResponse } from "@/lib/api/client";
import type {
  AiChatRequest,
  AiChatResponse,
  AiLessonPlanRequest,
  AiLessonPlanResponse,
  GeneratedLessonPlan,
  AiQuestionRequest,
  AiQuestionResponse,
  SavedQuestion,
  AiQuizRequest,
  AiQuizResponse,
  GeneratedQuiz,
  AiHealthStatus,
} from "@/types";

const AI_BASE_PATH = "ai";

/**
 * Chat with AI
 */
export const chatWithAi = async (
  request: AiChatRequest
): Promise<ApiResponse<AiChatResponse>> => {
  return apiClient.post<AiChatResponse>(`${AI_BASE_PATH}/chat`, request);
};

/**
 * Lesson Plan APIs
 */
export const previewLessonPlan = async (
  request: AiLessonPlanRequest
): Promise<ApiResponse<AiLessonPlanResponse>> => {
  return apiClient.post<AiLessonPlanResponse>(
    `${AI_BASE_PATH}/lesson-plans/preview`,
    request
  );
};

export const generateLessonPlan = async (
  request: AiLessonPlanRequest
): Promise<ApiResponse<GeneratedLessonPlan>> => {
  return apiClient.post<GeneratedLessonPlan>(
    `${AI_BASE_PATH}/lesson-plans/generate`,
    request
  );
};

/**
 * Question APIs
 */
export const previewQuestions = async (
  request: AiQuestionRequest
): Promise<ApiResponse<AiQuestionResponse>> => {
  return apiClient.post<AiQuestionResponse>(
    `${AI_BASE_PATH}/questions/preview`,
    request
  );
};

export const generateQuestions = async (
  request: AiQuestionRequest
): Promise<
  ApiResponse<{ count: number; questionIds: number[]; message: string }>
> => {
  return apiClient.post<{
    count: number;
    questionIds: number[];
    message: string;
  }>(`${AI_BASE_PATH}/questions/generate`, request);
};

/**
 * Quiz APIs
 */
export const previewQuiz = async (
  request: AiQuizRequest
): Promise<ApiResponse<AiQuizResponse>> => {
  return apiClient.post<AiQuizResponse>(
    `${AI_BASE_PATH}/quizzes/preview`,
    request
  );
};

export const generateQuiz = async (
  request: AiQuizRequest
): Promise<ApiResponse<GeneratedQuiz>> => {
  return apiClient.post<GeneratedQuiz>(
    `${AI_BASE_PATH}/quizzes/generate`,
    request
  );
};

/**
 * AI Service Health Check
 */
export const checkAiHealth = async (): Promise<
  ApiResponse<AiHealthStatus>
> => {
  return apiClient.get<AiHealthStatus>(`${AI_BASE_PATH}/health`);
};

/**
 * Get AI Request History
 */
export const getAiRequestHistory = async (params: {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<any>> => {
  // Don't send type parameter if it's "All" or undefined
  const queryParams: Record<string, any> = {};
  
  if (params.type && params.type !== "All") {
    queryParams.type = params.type;
  }
  
  if (params.status) {
    queryParams.status = params.status;
  }
  
  if (params.search) {
    queryParams.search = params.search;
  }
  
  if (params.page) {
    queryParams.page = params.page;
  }
  
  if (params.limit) {
    queryParams.limit = params.limit;
  }
  
  console.log("Fetching AI history with params:", queryParams); // Debug
  
  return apiClient.get(`${AI_BASE_PATH}/requests/history`, queryParams);
};

/**
 * Get AI Request Details
 */
export const getAiRequestDetails = async (
  requestId: number
): Promise<ApiResponse<any>> => {
  return apiClient.get(`${AI_BASE_PATH}/requests/${requestId}`);
};

/**
 * Create AI Request History
 */
export const createAiRequestHistory = async (data: {
  requestType: string;
  request: string;
  response?: string;
  status?: string;
  metadata?: any;
}): Promise<ApiResponse<any>> => {
  return apiClient.post(`${AI_BASE_PATH}/requests/history`, data);
};

/**
 * Update AI Request History Status
 */
export const updateAiRequestHistory = async (
  requestId: number,
  data: {
    status?: string;
    response?: string;
    completedAt?: Date;
    error?: string;
    metadata?: any;
  }
): Promise<ApiResponse<any>> => {
  return apiClient.patch(`${AI_BASE_PATH}/requests/${requestId}`, data);
};

/**
 * Download Lesson Plan as Document
 */
export const downloadLessonPlan = async (
  lessonPlanId: number
): Promise<string> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5044/api"}/lesson-plans/${lessonPlanId}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get download URL");
  }

  const data = await response.json();
  return data.data.downloadUrl;
};
