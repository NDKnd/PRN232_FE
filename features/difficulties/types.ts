/**
 * Difficulty Types
 * Matches Backend Difficulty model and DTOs
 */

export interface Difficulty {
  difficultyId: number;
  name: string;
  description: string;
  value: number;
}

export interface CreateDifficultyDto {
  name: string;
  description: string;
  value: number;
}

export interface UpdateDifficultyDto {
  difficultyId: number;
  name: string;
  description: string;
  value: number;
}
