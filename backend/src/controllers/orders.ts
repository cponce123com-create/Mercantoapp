import { eq, and, desc, sql, gte, count, inArray } from 'drizzle-orm';
import { getDb, orders, order_items, products, Order, NewOrder, OrderItem, NewOrderItem } from '@/db';
import { AppError } from '@/utils/types';
import type { CreateOrderInput, UpdateOrderStatusInput, ListOrdersInput } from '@/validators/orders';

export const ordersController = {
  async createOrder(input: CreateOrderInput): Promise<Order> {
    const db = getDb();

    try {
      return await db.transaction(async (tx) => {
        // 1. Obtener todos los productos involucrados en una sola query
        const productIds = input.items.map(item => item.product_id);
        const dbProducts = await tx
          .select()
          .from(products)
          .where(inArray(products.id, productIds));
        
        const productMap = new Map(dbProducts.map(p => [p.id, p]));
        
        let totalAmount = 0;

        // 2. Validar stock y decrementar atómicamente
        for (const item of input.items) {
          const product = productMap.get(item.product_id);
          
          if (!product) {
            throw new AppError(404, `Producto con ID ${item.product_id} no encontrado`);
          }
          
          // Decrementar stock atómicamente en la transacción
          const updated = await tx
            .update(products)
            .set({ 
              stock: sql`${products.stock} - ${item.quantity}`,
              updated_at: new Date()
            })
            .where(and(
              eq(products.id, item.product_id),
              gte(products.stock, item.quantity)
            ))
            .returning();

          if (!updated.length) {
            throw new AppError(400, `Stock insuficiente para el producto: ${product.name}`);
          }

          const subtotal = parseFloat(product.price) * item.quantity;
          totalAmount += subtotal;
        }

        // 3. Crear la orden
        const newOrder: NewOrder = {
          user_id: input.user_id,
          store_id: input.store_id,
          status: 'pending',
          total_amount: String(totalAmount),
          shipping_address: input.shipping_address,
          notes: input.notes,
        };

        const orderResult = await tx.insert(orders).values(newOrder).returning();
        const createdOrder = orderResult[0];

        // 4. Crear los items de la orden (bulk insert)
        const orderItemsToInsert: NewOrderItem[] = input.items.map(item => {
          const product = productMap.get(item.product_id)!;
          const subtotal = parseFloat(product.price) * item.quantity;

          return {
            order_id: createdOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: product.price,
            subtotal: String(subtotal),
          };
        });

        await tx.insert(order_items).values(orderItemsToInsert);

        return createdOrder;
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error al crear la orden:', error);
      throw new AppError(500, 'Error al crear la orden', undefined);
    }
  },

  async getOrderById(id: number): Promise<Order> {
    const db = getDb();

    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);

    if (!result.length) {
      throw new AppError(404, 'Orden no encontrada');
    }

    return result[0];
  },

  async getOrderWithItems(orderId: number): Promise<{
    order: Order;
    items: Array<OrderItem & { product: { name: string; price: string } }>;
  }> {
    const db = getDb();

    const order = await this.getOrderById(orderId);

    const items = await db
      .select({
        id: order_items.id,
        order_id: order_items.order_id,
        product_id: order_items.product_id,
        quantity: order_items.quantity,
        unit_price: order_items.unit_price,
        subtotal: order_items.subtotal,
        created_at: order_items.created_at,
        product: {
          name: products.name,
          price: products.price,
        },
      })
      .from(order_items)
      .leftJoin(products, eq(order_items.product_id, products.id))
      .where(eq(order_items.order_id, orderId));

    return { order, items: items as any };
  },

  async listOrders(input: ListOrdersInput): Promise<{ orders: Order[]; total: number }> {
    const db = getDb();
    const offset = (input.page - 1) * input.limit;

    const conditions = [];

    if (input.user_id) {
      conditions.push(eq(orders.user_id, input.user_id));
    }

    if (input.store_id) {
      conditions.push(eq(orders.store_id, input.store_id));
    }

    if (input.status) {
      conditions.push(eq(orders.status, input.status));
    }

    let query = db.select().from(orders);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query
      .orderBy(desc(orders.created_at))
      .limit(input.limit)
      .offset(offset);

    // Get total count
    const [countResult] = await db
      .select({ total: count() })
      .from(orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = Number(countResult.total);

    return { orders: result, total };
  },

  async updateOrderStatus(id: number, input: UpdateOrderStatusInput): Promise<Order> {
    const db = getDb();

    // Verify order exists
    await this.getOrderById(id);

    const result = await db
      .update(orders)
      .set({ status: input.status, updated_at: new Date() })
      .where(eq(orders.id, id))
      .returning();

    return result[0];
  },

  async cancelOrder(id: number): Promise<Order> {
    const db = getDb();

    return await db.transaction(async (tx) => {
      const orderResult = await tx.select().from(orders).where(eq(orders.id, id)).limit(1);
      
      if (!orderResult.length) {
        throw new AppError(404, 'Orden no encontrada');
      }
      
      const order = orderResult[0];

      if (order.status !== 'pending') {
        throw new AppError(400, 'Solo se pueden cancelar órdenes pendientes');
      }

      // Restore product stock
      const items = await tx.select().from(order_items).where(eq(order_items.order_id, id));

      for (const item of items) {
        await tx
          .update(products)
          .set({ 
            stock: sql`${products.stock} + ${item.quantity}`,
            updated_at: new Date()
          })
          .where(eq(products.id, item.product_id));
      }

      const result = await tx
        .update(orders)
        .set({ status: 'cancelled', updated_at: new Date() })
        .where(eq(orders.id, id))
        .returning();

      return result[0];
    });
  },
};
