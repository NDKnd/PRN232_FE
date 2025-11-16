import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from './client';

export interface QuestionResponseDto {
  questionId: number;
  topic: string;
  questionText: string;
  questionType: string;
  correctAnswer?: string;
  explanation?: string;
  tags?: string;
  isAIGenerated: boolean;
  status: string;
  difficultyId?: number;
  difficultyName?: string;
  answers: AnswerResponseDto[];
}

export interface AnswerResponseDto {
  answerId: number;
  answerText: string;
  isCorrect: boolean;
}

export interface GetAvailableQuestionsParams {
  levelId?: number;
  difficultyId?: number;
  topic?: string;
  searchTerm?: string;
}

export const questionApi = {
  /**
   * Get available questions for adding to quiz (Approved status, not assigned to any quiz)
   */
  getAvailableQuestions: async (
    params?: GetAvailableQuestionsParams
  ): Promise<ApiResponse<QuestionResponseDto[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.levelId !== undefined) {
      queryParams.append('levelId', params.levelId.toString());
    }
    if (params?.difficultyId !== undefined) {
      queryParams.append('difficultyId', params.difficultyId.toString());
    }
    if (params?.topic) {
      queryParams.append('topic', params.topic);
    }
    if (params?.searchTerm) {
      queryParams.append('searchTerm', params.searchTerm);
    }

    const url = `${ENDPOINTS.QUESTIONS.AVAILABLE}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<QuestionResponseDto[]>(url);
  },
};
