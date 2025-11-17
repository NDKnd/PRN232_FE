/**
 * Submissions Types
 * Matches Backend Submission model, DTOs & Responses
 */

export interface SubmissionStartResponse {
  submissionId: number;
  timeLimit: number; // minutes
  questions: Array<{
    questionId: number;
    questionText: string;
    // Có thể thêm: type, options, etc.
  }>;
}

export interface AnswerInput {
  questionId: number;
  answerText: string;
}

export interface SubmitAnswersDto {
  answers: AnswerInput[];
}

export interface SubmissionDetail {
  questionId: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string | null;
  isCorrect: boolean;
  scoreEarned: number;
  explanation: string | null;
}

export interface SubmissionResult {
  submissionId: number;
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  submittedAt: string; // ISO
  durationTaken: number; // seconds
  status: "Completed" | "InProgress" | "TimedOut";
  details: SubmissionDetail[];
}

export interface SubmissionSummary {
  submissionId: number;
  score: number;
  submittedAt: string; // ISO
  attemptNumber: number;
}