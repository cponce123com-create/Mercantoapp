import { describe, it, expect } from 'vitest';
import { AppError } from '@/utils/types';

describe('Error Handling', () => {
  it('should create AppError with statusCode and message', () => {
    const error = new AppError(404, 'Not found');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.name).toBe('AppError');
  });

  it('should create AppError with validation errors', () => {
    const validationErrors = [
      { field: 'email', message: 'Invalid email' },
      { field: 'name', message: 'Name is required' },
    ];

    const error = new AppError(400, 'Validation failed', validationErrors);
    expect(error.statusCode).toBe(400);
    expect(error.errors).toEqual(validationErrors);
    expect(error.errors?.length).toBe(2);
  });

  it('should handle 500 server errors', () => {
    const error = new AppError(500, 'Internal server error');
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Internal server error');
  });

  it('should handle 400 bad request errors', () => {
    const error = new AppError(400, 'Bad request');
    expect(error.statusCode).toBe(400);
  });

  it('should handle 403 forbidden errors', () => {
    const error = new AppError(403, 'Forbidden');
    expect(error.statusCode).toBe(403);
  });
});
