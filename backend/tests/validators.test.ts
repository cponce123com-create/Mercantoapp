import { describe, it, expect } from 'vitest';
import {
  createStoreSchema,
  updateStoreSchema,
  listStoresSchema,
} from '@/validators/stores';
import {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
} from '@/validators/products';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '@/validators/orders';

describe('Store Validators', () => {
  it('should validate create store input', () => {
    const validInput = {
      owner_id: 1,
      name: 'Test Store',
      email: 'store@example.com',
      is_active: true,
    };

    const result = createStoreSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidInput = {
      owner_id: 1,
      name: 'Test Store',
      email: 'invalid-email',
      is_active: true,
    };

    const result = createStoreSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should validate list stores query', () => {
    const query = {
      page: '1',
      limit: '10',
      owner_id: '1',
    };

    const result = listStoresSchema.safeParse(query);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    }
  });
});

describe('Product Validators', () => {
  it('should validate create product input', () => {
    const validInput = {
      store_id: 1,
      name: 'Test Product',
      price: '29.99',
      stock: 100,
    };

    const result = createProductSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should reject negative price', () => {
    const invalidInput = {
      store_id: 1,
      name: 'Test Product',
      price: '-10',
      stock: 100,
    };

    const result = createProductSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should validate list products query', () => {
    const query = {
      store_id: '1',
      page: '1',
      limit: '10',
      category: 'Electronics',
    };

    const result = listProductsSchema.safeParse(query);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.store_id).toBe(1);
      expect(result.data.category).toBe('Electronics');
    }
  });
});

describe('Order Validators', () => {
  it('should validate create order input', () => {
    const validInput = {
      user_id: 1,
      store_id: 1,
      shipping_address: '123 Main St, City, Country',
      items: [
        {
          product_id: 1,
          quantity: 2,
        },
      ],
    };

    const result = createOrderSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should reject order without items', () => {
    const invalidInput = {
      user_id: 1,
      store_id: 1,
      shipping_address: '123 Main St, City, Country',
      items: [],
    };

    const result = createOrderSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it('should validate order status update', () => {
    const validInput = {
      status: 'confirmed',
    };

    const result = updateOrderStatusSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should reject invalid order status', () => {
    const invalidInput = {
      status: 'invalid_status',
    };

    const result = updateOrderStatusSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});
