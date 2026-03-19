import { z } from 'zod';

export const createStoreSchema = z.object({
  owner_id: z.coerce.number().int().positive('owner_id debe ser un número positivo'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(255),
  description: z.string().optional(),
  email: z.string().email('Email inválido'),
  phone: z.string().max(20).optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  logo_url: z.string().url('URL de logo inválida').optional(),
  is_active: z.boolean().default(true),
});

export const updateStoreSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(255).optional(),
  description: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().max(20).optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  logo_url: z.string().url('URL de logo inválida').optional(),
  is_active: z.boolean().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export const updateStoreStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    errorMap: () => ({ message: 'Estado inválido. Debe ser pending, approved o rejected' }),
  }),
});

export type UpdateStoreStatusInput = z.infer<typeof updateStoreStatusSchema>;

export const storeIdSchema = z.object({
  id: z.coerce.number().int().positive('ID debe ser un número positivo'),
});

export const listStoresSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  owner_id: z.coerce.number().int().positive().optional(),
  is_active: z.coerce.boolean().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
export type ListStoresInput = z.infer<typeof listStoresSchema>;
