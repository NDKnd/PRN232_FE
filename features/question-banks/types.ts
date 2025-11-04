/**
 * Question Bank Types
 * Matches Backend QuestionBank model and DTOs
 */

export interface QuestionBank {
  questionBankId: number;
  teacherId: number;
  teacherName?: string;
  levelId: number;
  levelName?: string;
  name: string;
  description: string;
  isPublic: boolean;
}

export interface CreateQuestionBankDto {
  teacherId: number;
  levelId: number;
  name: string;
  description: string;
  isPublic: boolean;
}

export interface UpdateQuestionBankDto {
  questionBankId: number;
  teacherId: number;
  levelId: number;
  name: string;
  description: string;
  isPublic: boolean;
}
