/**
 * User Hooks
 * Simple React hooks for user operations without external dependencies
 */

import { useState, useEffect, useCallback } from "react";
import { userApi } from "./api";
import type { User, CreateUserDto, UpdateUserDto } from "./types";
import type { ApiResponse } from "@/lib/api";

interface UseUsersResult {
  data: User[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

/**
 * Get all users with pagination
 */
export function useUsers(page = 1, limit = 10): UseUsersResult {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<
    { page: number; limit: number; total: number } | undefined
  >();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userApi.getAll(page, limit);
      if (response.success) {
        setData(response.data || null);
        setPagination(response.pagination);
      } else {
        setError(response.error?.message || "Failed to fetch users");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, pagination };
}

/**
 * Get user by ID
 */
export function useUser(id: number) {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (id <= 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await userApi.getById(id);
      if (response.success) {
        setData(response.data || null);
      } else {
        setError(response.error?.message || "Failed to fetch user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Get users by role
 */
export function useUsersByRole(role: number) {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userApi.getByRole(role);
      if (response.success) {
        setData(response.data || null);
      } else {
        setError(response.error?.message || "Failed to fetch users");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Mutation hook for create/update/delete operations
 */
interface UseMutationResult<T, P> {
  mutate: (params: P) => Promise<ApiResponse<T>>;
  loading: boolean;
  error: string | null;
  data: T | null;
  reset: () => void;
}

function useMutation<T, P>(
  mutationFn: (params: P) => Promise<ApiResponse<T>>
): UseMutationResult<T, P> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = async (params: P): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutationFn(params);
      if (response.success) {
        setData(response.data || null);
      } else {
        setError(response.error?.message || "Mutation failed");
      }
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      return {
        success: false,
        error: { code: 0, message: errorMessage },
      };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, loading, error, data, reset };
}

/**
 * Create user
 */
export function useCreateUser() {
  return useMutation<User, CreateUserDto>((data) => userApi.create(data));
}

/**
 * Update user
 */
export function useUpdateUser() {
  return useMutation<User, { id: number; data: UpdateUserDto }>(
    ({ id, data }) => userApi.update(id, data)
  );
}

/**
 * Delete user
 */
export function useDeleteUser() {
  return useMutation<void, number>((id) => userApi.delete(id));
}
