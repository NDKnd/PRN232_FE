import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import type { Level, ApiResponse } from "@/types";

export const levelApi = {
  getAll: async (): Promise<ApiResponse<Level[]>> => {
    return apiClient.get<Level[]>(ENDPOINTS.LEVELS.BASE);
  },

  getById: async (id: number): Promise<ApiResponse<Level>> => {
    return apiClient.get<Level>(ENDPOINTS.LEVELS.BY_ID(id));
  },
};

export default levelApi;
