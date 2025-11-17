/**
 * Progress Types
 * Matches Backend ProgressController responses (real data)
 */

export interface Progress {
  lessonId: number;
  completionStatus: "NotStarted" | "InProgress" | "Completed";
  attemptDate: string; // ISO
  completedDate?: string | null;
  score?: number | null;
  studentId?: number;
  lessonTitle?: string;
  lessonPlanId?: number;
}

// ==================== ANALYTICS ====================

export interface OverallProgress {
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  completionRate: number;
  averageScore?: number | null;
  totalTimeSpent?: number; // minutes
}

export interface ScoreTrend {
  week: string; // e.g., "Week 47"
  score: number;
}

export interface TopicProgress {
  topicName: string;
  completed: number;
  total: number;
  progressPercent: number; // 0-100
}

export interface AreaForImprovement {
  topicName: string;
  description: string;
  achievedPercent: number; // 0-100
}