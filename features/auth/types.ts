/**
 * Auth Types
 * Authentication-related type definitions
 * Updated to match Backend API
 */

export type UserRole = "Student" | "Teacher" | "Admin";

export interface LoginDto {
  username: string; // Backend dùng username, không phải email
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role: UserRole; // "Teacher" | "Student" | "Admin"
  levelId: number; // Required trong backend
  gradeLevel?: string; // Optional
}

export interface AuthUser {
  userId: number;
  username: string;
  role: string; // Backend trả về string
}

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  role: string;
}

export interface LoginState {
  username: string;
  password: string;
  isLoading: boolean;
  error?: string;
}

// User full info (from /users endpoint)
export interface User {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
  levelId: number | null;
  gradeLevel: string | null;
  credit: number;
  isActive: boolean;
  createdAt: string;
}
