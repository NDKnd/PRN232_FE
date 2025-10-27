/**
 * Auth Types
 * Authentication-related type definitions
 */

export type UserRole = "student" | "teacher" | "admin";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface AuthUser {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  levelId?: number;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  error?: string;
}
