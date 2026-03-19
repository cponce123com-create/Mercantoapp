import { Context, Next } from 'hono';
import { AppError } from '@/utils/types';

export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error:', error);

    if (error instanceof AppError) {
      return c.json(
        {
          success: false,
          error: error.message,
          errors: error.errors,
        },
        error.statusCode
      );
    }

    if (error instanceof Error && error.name === 'ZodError') {
      return c.json(
        {
          success: false,
          error: 'Validación fallida',
          errors: (error as any).errors,
        },
        400
      );
    }

    return c.json(
      {
        success: false,
        error: 'Error interno del servidor',
      },
      500
    );
  }
};
