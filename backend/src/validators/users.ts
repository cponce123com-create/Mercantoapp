import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['admin', 'store_owner', 'customer']).default('customer'),
});

export const updateUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  role: z.enum(['admin', 'store_owner', 'customer']).optional(),
});

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive('ID debe ser un número positivo'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
