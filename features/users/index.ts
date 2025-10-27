/**
 * Users Feature
 * Centralized exports for user-related functionality
 */

// API
export { userApi } from "./api";

// Types
export type { User, CreateUserDto, UpdateUserDto, Level } from "./types";
export { UserRole, EducationLevel } from "./types";

// Hooks (simple version without React Query)
export {
  useUsers,
  useUser,
  useUsersByRole,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "./hooks-simple";
