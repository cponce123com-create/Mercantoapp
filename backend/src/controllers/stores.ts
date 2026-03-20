import { eq, and, desc } from 'drizzle-orm';
import { getDb, stores, Store, NewStore } from '@/db';
import { AppError } from '@/utils/types';
import type { CreateStoreInput, UpdateStoreInput, ListStoresInput } from '@/validators/stores';

export const storesController = {
  async createStore(input: CreateStoreInput): Promise<Store> {
    const db = getDb();

    try {
      const newStore: NewStore = {
        owner_id: input.owner_id,
        name: input.name,
        description: input.description,
        email: input.email,
        phone: input.phone,
        address: input.address,
        city: input.city,
        country: input.country,
        logo_url: input.logo_url,
        is_active: input.is_active,
        status: 'pending',
      };

      const result = await db.insert(stores).values(newStore).returning();
      return result[0];
    } catch (error) {
      throw new AppError(500, 'Error al crear la tienda', undefined);
    }
  },

  async getStoreById(id: number): Promise<Store> {
    const db = getDb();

    const result = await db.select().from(stores).where(eq(stores.id, id)).limit(1);

    if (!result.length) {
      throw new AppError(404, 'Tienda no encontrada');
    }

    return result[0];
  },

  async listStores(input: ListStoresInput): Promise<{ stores: Store[]; total: number }> {
    const db = getDb();
    const offset = (input.page - 1) * input.limit;

    let query = db.select().from(stores);

    const conditions = [];
    if (input.owner_id) {
      conditions.push(eq(stores.owner_id, input.owner_id));
    }
    if (input.is_active !== undefined) {
      conditions.push(eq(stores.is_active, input.is_active));
    }
    if (input.status) {
      conditions.push(eq(stores.status, input.status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query
      .orderBy(desc(stores.created_at))
      .limit(input.limit)
      .offset(offset);

    // Get total count
    let countQuery = db.select({ count: stores.id }).from(stores);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }

    const countResult = await countQuery;
    const total = countResult.length;

    return { stores: result, total };
  },

  async updateStore(id: number, input: UpdateStoreInput): Promise<Store> {
    const db = getDb();

    // Verify store exists
    await this.getStoreById(id);

    const updateData: Partial<NewStore> = {
      ...input,
      updated_at: new Date(),
    };

    const result = await db
      .update(stores)
      .set(updateData)
      .where(eq(stores.id, id))
      .returning();

    return result[0];
  },

  async deleteStore(id: number): Promise<void> {
    const db = getDb();

    // Verify store exists
    await this.getStoreById(id);

    await db.delete(stores).where(eq(stores.id, id));
  },
};
