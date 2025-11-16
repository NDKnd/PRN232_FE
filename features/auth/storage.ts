import { AuthUser } from "./types";

/**
 * Auth Storage Helper
 */
export const authStorage = {
  /**
   * Save auth token to localStorage
   */
  saveToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  /**
   * Get auth token from localStorage
   */
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  /**
   * Remove auth token from localStorage
   */
  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      // Xóa cookie token
      document.cookie =
        "token=; path=/; max-age=0; SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      // Xóa cookie role
      document.cookie =
        "role=; path=/; max-age=0; SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  },

  /**
   * Save user data to localStorage
   */
  saveUser: (user: AuthUser): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  /**
   * Get user data from localStorage
   */
  getUser: (): AuthUser | null => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  /**
   * Remove user data from localStorage
   */
  removeUser: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  },

  /**
   * Clear all auth data
   */
  clear: (): void => {
    authStorage.removeToken();
    authStorage.removeUser();
  },

  getRoleFromToken(token: string | null) {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  },

  isTokenExpired(token: string | null) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime >= payload.exp;
    } catch {
      return true;
    }
  },

  getTokenExpirationDate(token: string | null) {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!payload.exp) return null;
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  },
};
