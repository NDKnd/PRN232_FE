/**
 * User Types
 */

export interface User {
  userId: number;
  levelId: number;
  username: string;
  email: string;
  hashedPassword: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  level?: Level;
}

export enum UserRole {
  Student = 0,
  Teacher = 1,
  Admin = 2,
}

export interface Level {
  levelId: number;
  levelName: string;
  educationLevel: EducationLevel;
  order: number;
}

export enum EducationLevel {
  Elementary = 0,
  MiddleSchool = 1,
  HighSchool = 2,
  University = 3,
}

// DTOs
export interface CreateUserDto {
  levelId: number;
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export interface UpdateUserDto {
  levelId?: number;
  username?: string;
  email?: string;
  fullName?: string;
  isActive?: boolean;
}
