export enum QuizStatus {
  Draft = "Draft",
  Published = "Published",
  Deleted = "Deleted",
}

export enum QuestionType {
  MultipleChoice = "MultipleChoice",
  FillInTheBlank = "FillInTheBlank",
  TrueFalse = "TrueFalse",
  ShortAnswer = "ShortAnswer",
  Essay = "Essay",
}

export enum Topic {
  Calculus = "Calculus",
  Trigonometry = "Trigonometry",
  Geometry = "Geometry",
  Algebra = "Algebra",
  Statistics = "Statistics",
  Probability = "Probability",
  NumberTheory = "NumberTheory",
  Combinatorics = "Combinatorics",
  LinearAlgebra = "LinearAlgebra",
  DifferentialEquations = "DifferentialEquations",
}

export interface Answer {
  answerId: number;
  answerText: string;
  isCorrect: boolean;
}

export interface Question {
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
  answers: Answer[];
}

export interface Quiz {
  quizId: number;
  title: string;
  levelId: number;
  levelName: string;
  teacherId: number;
  teacherName: string;
  timeLimit: number;
  attemptLimit: number;
  totalScore: number;
  isAIGenerated: boolean;
  status: string;
  createdAt: string;
  publishedAt?: string;
  questionCount: number;
  submissionCount: number;
}

export interface QuizDetail extends Quiz {
  questions: Question[];
}

export interface QuizStatistics {
  quizId: number;
  title: string;
  totalSubmissions: number;
  completedSubmissions: number;
  inProgressSubmissions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averageDuration: number;
  totalStudents: number;
}

export interface CreateQuizRequest {
  title: string;
  levelId: number;
  timeLimit: number;
  attemptLimit: number;
  questionIds?: number[];
}

export interface UpdateQuizRequest {
  title?: string;
  timeLimit?: number;
  attemptLimit?: number;
  questionIds?: number[];
}

export interface QuizSearchParams {
  keyword?: string;
  levelId?: number;
  status?: QuizStatus;
  teacherId?: number;
  page?: number;
  limit?: number;
}

export interface Level {
  levelId: number;
  levelName: string;
  educationLevel: string;
  order: number;
}
