/**
 * Lesson Plan Types
 * Matches Backend LessonPlan model and DTOs
 */

export interface LessonPlan {
  lessonPlanId: number;
  title: string;
  topic: string;
  description: string;
  estimatedDuration: number;
  status: string; // "Draft" | "Published" | "Archived"
  isPublic: boolean;
  version: number;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
  teacherId: number;
  levelId: number;
  aiRequestId: number | null;
  teacherName?: string;
  levelName?: string;
  lessonsCount: number;
}

export interface LessonPlanWithLessons extends LessonPlan {
  lessons: Lesson[];
}

export interface Lesson {
  lessonId: number;
  title: string;
  content: string;
  order: number;
  isShared: boolean;
  publishedDate: string | null;
  createdAt: string;
  updatedAt: string;
  lessonPlanId: number;
  lessonPlanTitle?: string;
  lessonDetailsCount: number;
  progressCount: number;
}

export interface CreateLessonPlanDto {
  teacherId: number;
  levelId: number;
  topicName?: string;
  title: string;
}

export interface UpdateLessonPlanDto {
  teacherId: number;
  levelId: number;
  topicName?: string;
  title: string;
}

export interface DuplicateLessonPlanDto {
  newTeacherId: number;
}
