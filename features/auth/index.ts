/**
 * Auth Feature
 * Centralized exports for authentication functionality
 */

// API
export { authApi, authStorage } from "./api";

// Types
export type {
  UserRole,
  LoginDto,
  RegisterDto,
  AuthUser,
  AuthResponse,
  LoginState,
  RegisterState,
  User,
} from "./types";

// Hooks
export {
  useAuth,
  useRegister,
  useCurrentUser,
  useLogout,
  useChangePassword,
} from "./hooks-simple";
