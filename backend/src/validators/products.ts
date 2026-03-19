import { z } from 'zod';

export const createProductSchema = z.object({
  store_id: z.coerce.number().int().positive('store_id debe ser un número positivo'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(255),
  description: z.string().optional(),
  price: z.string().or(z.number()).refine((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return num > 0 && !isNaN(num);
  }, 'El precio debe ser un número positivo'),
  stock: z.coerce.number().int().nonnegative('El stock no puede ser negativo').default(0),
  sku: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  image_url: z.string().url('URL de imagen inválida').optional(),
  is_active: z.boolean().default(true),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(255).optional(),
  description: z.string().optional(),
  price: z.string().or(z.number()).refine((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return num > 0 && !isNaN(num);
  }, 'El precio debe ser un número positivo').optional(),
  stock: z.coerce.number().int().nonnegative('El stock no puede ser negativo').optional(),
  sku: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  image_url: z.string().url('URL de imagen inválida').optional(),
  is_active: z.boolean().optional(),
});

export const productIdSchema = z.object({
  id: z.coerce.number().int().positive('ID debe ser un número positivo'),
});

export const listProductsSchema = z.object({
  store_id: z.coerce.number().int().positive('store_id debe ser un número positivo'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  category: z.string().optional(),
  is_active: z.coerce.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsInput = z.infer<typeof listProductsSchema>;
