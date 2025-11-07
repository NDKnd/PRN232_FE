/**
 * Auth Hooks
 * React hooks for authentication without external dependencies
 */

import { useState, useCallback } from "react";
import { authApi, authStorage } from "./api";
import type { LoginDto, RegisterDto, AuthUser, LoginState, RegisterState, UserRole } from "./types";

/**
 * Get redirect URL based on role
 */
function getRedirectUrl(role: string): string {
  const roleLower = role.toLowerCase();
  switch (roleLower) {
    case "teacher":
      return "/teacher/dashboard";
    case "student":
      return "/student/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

/**
 * Hook for login functionality
 */
export function useAuth() {
  const [loginState, setLoginState] = useState<LoginState>({
    username: "",
    password: "",
    isLoading: false,
    error: undefined,
  });

  const updateField = useCallback((field: keyof LoginDto, value: string) => {
    setLoginState((prev) => ({
      ...prev,
      [field]: value,
      error: undefined, // Clear error when user types
    }));
  }, []);

  const handleLogin = useCallback(
    async (role?: UserRole) => {
      setLoginState((prev) => ({
        ...prev,
        isLoading: true,
        error: undefined,
      }));

      try {
        const loginData: LoginDto = {
          username: loginState.username,
          password: loginState.password,
        };

        const response = await authApi.login(loginData);

        if (response.success && response.data) {
          // Save token and user data
          authStorage.saveToken(response.data.token);
          
          // Create AuthUser object from response
          const authUser: AuthUser = {
            userId: response.data.userId,
            username: response.data.username,
            role: response.data.role,
          };
          authStorage.saveUser(authUser);

          // Redirect based on role from backend
          const userRole = response.data.role.toLowerCase() as UserRole;
          const redirectUrl = getRedirectUrl(userRole);
          window.location.href = redirectUrl;
        } else {
          setLoginState((prev) => ({
            ...prev,
            isLoading: false,
            error: response.error?.message || "Login failed",
          }));
        }
      } catch (error) {
        setLoginState((prev) => ({
          ...prev,
          isLoading: false,
          error: "An unexpected error occurred",
        }));
      }
    },
    [loginState.username, loginState.password]
  );

  const reset = useCallback(() => {
    setLoginState({
      username: "",
      password: "",
      isLoading: false,
      error: undefined,
    });
  }, []);

  return {
    loginState,
    updateField,
    handleLogin,
    reset,
  };
}

/**
 * Hook for register functionality
 */
export function useRegister() {
  const [registerState, setRegisterState] = useState<RegisterState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
    levelId: 1,
    gradeLevel: "",
    isLoading: false,
    error: undefined,
  });

  const updateField = useCallback((field: keyof RegisterState, value: string | number) => {
    setRegisterState((prev) => ({
      ...prev,
      [field]: value,
      error: undefined, // Clear error when user types
    }));
  }, []);

  const handleRegister = useCallback(async () => {
    setRegisterState((prev) => ({
      ...prev,
      isLoading: true,
      error: undefined,
    }));

    // Validate passwords match
    if (registerState.password !== registerState.confirmPassword) {
      setRegisterState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Passwords do not match",
      }));
      return false;
    }

    // Validate password length
    if (registerState.password.length < 6) {
      setRegisterState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Password must be at least 6 characters",
      }));
      return false;
    }

    try {
      const registerData: RegisterDto = {
        username: registerState.username,
        email: registerState.email,
        password: registerState.password,
        role: registerState.role,
        levelId: registerState.levelId,
        gradeLevel: registerState.gradeLevel || undefined,
      };

      const response = await authApi.register(registerData);

      if (response.success && response.data) {
        // Registration successful, redirect to login
        window.location.href = "/login?registered=true";
        return true;
      } else {
        setRegisterState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error?.message || "Registration failed",
        }));
        return false;
      }
    } catch (error) {
      setRegisterState((prev) => ({
        ...prev,
        isLoading: false,
        error: "An unexpected error occurred",
      }));
      return false;
    }
  }, [registerState]);

  const reset = useCallback(() => {
    setRegisterState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Student",
      levelId: 1,
      gradeLevel: "",
      isLoading: false,
      error: undefined,
    });
  }, []);

  return {
    registerState,
    updateField,
    handleRegister,
    reset,
  };
}

/**
 * Hook for getting current user
 */
export function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    return authStorage.getUser();
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    // Backend không có endpoint getProfile
    // Chỉ lấy từ localStorage
    const storedUser = authStorage.getUser();
    if (storedUser) {
      setUser(storedUser);
    } else {
      setError("No user found");
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      authStorage.clear();
      setUser(null);
      setLoading(false);
      window.location.href = "/login";
    }
  }, []);

  return {
    user,
    loading,
    error,
    fetchUser,
    logout,
    isAuthenticated: !!user,
  };
}

/**
 * Hook for logout functionality
 */
export function useLogout() {
  const [loading, setLoading] = useState(false);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      authStorage.clear();
      setLoading(false);
      window.location.href = "/login";
    }
  }, []);

  return { logout, loading };
}

/**
 * Hook for changing password
 * Note: Backend chưa có endpoint change password
 */
export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        // TODO: Implement when backend has change password endpoint
        setError("Change password feature not implemented yet");
        return false;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    changePassword,
    loading,
    error,
    success,
    reset,
  };
}
