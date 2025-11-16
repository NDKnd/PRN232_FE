import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import type {
  Quiz,
  QuizDetail,
  QuizStatistics,
  CreateQuizRequest,
  UpdateQuizRequest,
  QuizSearchParams,
  ApiResponse,
} from "@/types";

export const quizApi = {
  getMyQuizzes: async (page = 1, limit = 20): Promise<ApiResponse<Quiz[]>> => {
    return apiClient.get<Quiz[]>(ENDPOINTS.QUIZZES.MY_QUIZZES, {
      page,
      limit,
    });
  },

  searchQuizzes: async (
    params: QuizSearchParams
  ): Promise<ApiResponse<Quiz[]>> => {
    return apiClient.get<Quiz[]>(ENDPOINTS.QUIZZES.BASE, params);
  },

  getQuizById: async (id: number): Promise<ApiResponse<QuizDetail>> => {
    return apiClient.get<QuizDetail>(ENDPOINTS.QUIZZES.BY_ID(id));
  },

  createQuiz: async (
    data: CreateQuizRequest
  ): Promise<ApiResponse<{ quizId: number; title: string; message: string }>> => {
    return apiClient.post(ENDPOINTS.QUIZZES.BASE, data);
  },

  updateQuiz: async (
    id: number,
    data: UpdateQuizRequest
  ): Promise<ApiResponse<{ quizId: number; title: string; message: string }>> => {
    return apiClient.put(ENDPOINTS.QUIZZES.BY_ID(id), data);
  },

  deleteQuiz: async (
    id: number
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.delete(ENDPOINTS.QUIZZES.BY_ID(id));
  },

  publishQuiz: async (
    id: number
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post(ENDPOINTS.QUIZZES.PUBLISH(id));
  },

  unpublishQuiz: async (
    id: number
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post(ENDPOINTS.QUIZZES.UNPUBLISH(id));
  },

  getQuizStatistics: async (
    id: number
  ): Promise<ApiResponse<QuizStatistics>> => {
    return apiClient.get<QuizStatistics>(ENDPOINTS.QUIZZES.STATISTICS(id));
  },

  addQuestionsToQuiz: async (
    id: number,
    questionIds: number[]
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post(ENDPOINTS.QUIZZES.ADD_QUESTIONS(id), { questionIds });
  },

  removeQuestionFromQuiz: async (
    id: number,
    questionId: number
  ): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.delete(ENDPOINTS.QUIZZES.REMOVE_QUESTION(id, questionId));
  },
};

export default quizApi;
