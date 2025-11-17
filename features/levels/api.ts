import { apiClient } from "@/lib/api";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api";
import type { Level } from "./types";

export const levelApi = {
  getAll: async (): Promise<ApiResponse<Level[]>> => {
    return apiClient.get<Level[]>(ENDPOINTS.LEVELS.BASE);
  },

  getById: async (id: number): Promise<ApiResponse<Level>> => {
    return apiClient.get<Level>(ENDPOINTS.LEVELS.BY_ID(id));
  },
} as const;
