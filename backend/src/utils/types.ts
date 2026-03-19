export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  error: string;
  errors?: ValidationError[];
  statusCode: number;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: ValidationError[]
  ) {
    super(message);
    this.name = 'AppError';
  }
}
