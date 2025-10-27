export type UserRole = "student" | "teacher";

export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginState = {
  email: string;
  password: string;
  isLoading: boolean;
  error?: string;
};

export type AuthResponse = {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: {
    code: number;
    message: string;
  };
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};
