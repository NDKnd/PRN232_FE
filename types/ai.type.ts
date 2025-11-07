/**
 * AI Feature Types
 */

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface AiChatRequest {
  message: string;
  conversationHistory?: AiChatMessage[];
}

export interface AiChatResponse {
  message: string;
  conversationId: string;
  timestamp: string;
}

// Lesson Plan Types
export interface AiLessonPlanRequest {
  topic: string;
  gradeLevel: string; // 'elementary', 'middle', 'high'
  duration: number;
  learningObjectives?: string[];
  additionalNotes?: string;
  // Backend required fields
  teacherId: number;
  levelId: number;
  grade: number; // 1-12
}

export interface AiLessonPlanResponse {
  title: string;
  topic: string;
  gradeLevel: string;
  duration: number;
  learningObjectives: string[];
  materials: string[];
  activities: LessonActivity[];
  assessment: string;
  homework?: string;
}

export interface LessonActivity {
  title: string;
  duration: number;
  description: string;
  teacherNotes?: string;
}

export interface GeneratedLessonPlan {
  lessonPlanId: number;
  title: string;
  topic: string;
  duration: number;
  status: string;
  createdAt: Date;
}

// Question Types
export interface AiQuestionRequest {
  topic: string;
  count: number;
  difficultyId?: number;
  questionType?: 'MultipleChoice' | 'TrueFalse' | 'ShortAnswer' | 'Essay';
  gradeLevel?: string;
  bloom_taxonomy_level?: string;
}

export interface AiQuestionResponse {
  questions: GeneratedQuestion[];
}

export interface GeneratedQuestion {
  questionText: string;
  questionType: 'MultipleChoice' | 'TrueFalse' | 'ShortAnswer' | 'Essay';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: string;
  bloomLevel?: string;
}

export interface SavedQuestion {
  questionId: number;
  questionText: string;
  questionType: string;
  createdAt: Date;
}

// Quiz Types
export interface AiQuizRequest {
  title: string;
  topic: string;
  questionCount: number;
  difficultyId?: number;
  timeLimit?: number;
  gradeLevel?: string;
  questionTypes?: string[];
}

export interface AiQuizResponse {
  title: string;
  description: string;
  timeLimit: number;
  totalScore: number;
  questions: GeneratedQuestion[];
}

export interface GeneratedQuiz {
  quizId: number;
  title: string;
  questionCount: number;
  totalScore: number;
  timeLimit: number;
  status: string;
  createdAt: Date;
}

// AI Request History
export interface AiRequestHistory {
  requestId: number;
  userId: number;
  userName?: string;
  requestType: 'LessonPlan' | 'Question' | 'Quiz' | 'Chat' | 'GenerateLessonPlan' | 'GenerateQuestions' | 'GenerateQuiz';
  prompt: string; // Backend uses 'prompt' instead of 'request'
  request?: string; // Alias for display
  response?: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Success'; // Backend uses 'Success' instead of 'Completed'
  cost?: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  levelId?: number;
  levelName?: string;
  metadata?: {
    lessonPlanId?: number;
    lessonPlanTitle?: string;
    questionIds?: number[];
    questionCount?: number;
    quizId?: number;
    quizTitle?: string;
    conversationId?: string;
  };
}

// AI Service Health
export interface AiHealthStatus {
  status: 'healthy' | 'unhealthy';
  message: string;
}

// Form Data Types for UI
export interface LessonPlanFormData extends AiLessonPlanRequest {
  saveToDatabase: boolean;
}

export interface QuestionFormData extends AiQuestionRequest {
  saveToDatabase: boolean;
}

export interface QuizFormData extends AiQuizRequest {
  saveToDatabase: boolean;
}

// Preview vs Generated Response
export type AiGenerateMode = 'preview' | 'generate';

export interface AiGenerateResult<T> {
  mode: AiGenerateMode;
  data: T;
  savedId?: number;
}
