import { z } from 'zod';

export const createOrderItemSchema = z.object({
  product_id: z.coerce.number().int().positive('product_id debe ser un número positivo'),
  quantity: z.coerce.number().int().positive('La cantidad debe ser mayor a 0'),
});

export const createOrderSchema = z.object({
  user_id: z.coerce.number().int().positive('user_id debe ser un número positivo'),
  store_id: z.coerce.number().int().positive('store_id debe ser un número positivo'),
  delivery_method: z.enum(['pickup', 'delivery']).default('pickup'),
  shipping_address: z.string().nullable().optional(),
  notes: z.string().optional(),
  items: z.array(createOrderItemSchema).min(1, 'Debe haber al menos un producto en la orden'),
}).refine((data) => {
  if (data.delivery_method === 'delivery') {
    return !!data.shipping_address && data.shipping_address.length >= 5;
  }
  return true;
}, {
  message: 'La dirección es obligatoria y debe tener al menos 5 caracteres para envíos a domicilio',
  path: ['shipping_address'],
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
});

export const orderIdSchema = z.object({
  id: z.coerce.number().int().positive('ID debe ser un número positivo'),
});

export const listOrdersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  user_id: z.coerce.number().int().positive().optional(),
  store_id: z.coerce.number().int().positive().optional(),
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).optional(),
});

export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ListOrdersInput = z.infer<typeof listOrdersSchema>;
