import { eq, and, desc } from 'drizzle-orm';
import { getDb, products, Product, NewProduct, stores } from '@/db';
import { AppError } from '@/utils/types';
import type { CreateProductInput, UpdateProductInput, ListProductsInput } from '@/validators/products';

export const productsController = {
  async createProduct(input: CreateProductInput): Promise<Product> {
    const db = getDb();

    // Verify store exists
    const storeExists = await db
      .select()
      .from(stores)
      .where(eq(stores.id, input.store_id))
      .limit(1);

    if (!storeExists.length) {
      throw new AppError(404, 'Tienda no encontrada');
    }

    try {
      const newProduct: NewProduct = {
        store_id: input.store_id,
        name: input.name,
        description: input.description,
        price: String(input.price),
        original_price: input.original_price ? String(input.original_price) : null,
        discount_price: input.discount_price ? String(input.discount_price) : null,
        discount_percentage: input.discount_percentage,
        stock: input.stock,
        sku: input.sku,
        category: input.category,
        image_url: input.image_url,
        images: input.images,
        is_active: input.is_active,
      };

      const result = await db.insert(products).values(newProduct).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating product:', error);
      throw new AppError(500, 'Error al crear el producto', undefined);
    }
  },

  async getProductById(id: number): Promise<Product> {
    const db = getDb();

    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);

    if (!result.length) {
      throw new AppError(404, 'Producto no encontrado');
    }

    return result[0];
  },

  async listProductsByStore(input: ListProductsInput): Promise<{ products: Product[]; total: number }> {
    const db = getDb();
    const offset = (input.page - 1) * input.limit;

    // Verify store exists
    const storeExists = await db
      .select()
      .from(stores)
      .where(eq(stores.id, input.store_id))
      .limit(1);

    if (!storeExists.length) {
      throw new AppError(404, 'Tienda no encontrada');
    }

    const conditions = [eq(products.store_id, input.store_id)];

    if (input.category) {
      conditions.push(eq(products.category, input.category));
    }

    if (input.is_active !== undefined) {
      conditions.push(eq(products.is_active, input.is_active));
    }

    const result = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.created_at))
      .limit(input.limit)
      .offset(offset);

    // Get total count
    const countResult = await db
      .select({ count: products.id })
      .from(products)
      .where(and(...conditions));

    const total = countResult.length;

    return { products: result, total };
  },

  async updateProduct(id: number, input: UpdateProductInput): Promise<Product> {
    const db = getDb();

    // Verify product exists
    await this.getProductById(id);

    const updateData: any = {
      ...input,
      price: input.price ? String(input.price) : undefined,
      original_price: input.original_price ? String(input.original_price) : undefined,
      discount_price: input.discount_price ? String(input.discount_price) : undefined,
      updated_at: new Date(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const result = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    return result[0];
  },

  async deleteProduct(id: number): Promise<void> {
    const db = getDb();

    // Verify product exists
    await this.getProductById(id);

    await db.delete(products).where(eq(products.id, id));
  },

  async decreaseStock(productId: number, quantity: number): Promise<void> {
    const db = getDb();

    const product = await this.getProductById(productId);

    if (product.stock < quantity) {
      throw new AppError(400, 'Stock insuficiente');
    }

    await db
      .update(products)
      .set({ stock: product.stock - quantity })
      .where(eq(products.id, productId));
  },
};
