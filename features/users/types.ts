/**
 * User Types
 * Updated to match Backend API
 */

export interface User {
  userId: number;
  username: string;
  email: string;
  role: string; // "Student" | "Teacher" | "Admin"
  levelId: number | null;
  gradeLevel: string | null;
  credit: number;
  isActive: boolean;
  createdAt: string;
}

export type UserRole = "Student" | "Teacher" | "Admin";

// DTOs
export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  levelId?: number | null;
  gradeLevel?: string | null;
  credit?: number;
  isActive?: boolean;
}
