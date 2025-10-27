export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
};
