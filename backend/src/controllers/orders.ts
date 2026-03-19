import { eq, and, desc } from 'drizzle-orm';
import { getDb, orders, order_items, products, Order, NewOrder, OrderItem, NewOrderItem } from '@/db';
import { AppError } from '@/utils/types';
import type { CreateOrderInput, UpdateOrderStatusInput, ListOrdersInput } from '@/validators/orders';
import { productsController } from './products';

export const ordersController = {
  async createOrder(input: CreateOrderInput): Promise<Order> {
    const db = getDb();

    try {
      // Calculate total amount
      let totalAmount = 0;

      for (const item of input.items) {
        const product = await productsController.getProductById(item.product_id);
        const subtotal = parseFloat(product.price) * item.quantity;
        totalAmount += subtotal;
      }

      // Create order
      const newOrder: NewOrder = {
        user_id: input.user_id,
        store_id: input.store_id,
        status: 'pending',
        total_amount: String(totalAmount),
        shipping_address: input.shipping_address,
        notes: input.notes,
      };

      const orderResult = await db.insert(orders).values(newOrder).returning();
      const createdOrder = orderResult[0];

      // Create order items
      for (const item of input.items) {
        const product = await productsController.getProductById(item.product_id);
        const subtotal = parseFloat(product.price) * item.quantity;

        const newOrderItem: NewOrderItem = {
          order_id: createdOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: product.price,
          subtotal: String(subtotal),
        };

        await db.insert(order_items).values(newOrderItem);

        // Decrease product stock
        await productsController.decreaseStock(item.product_id, item.quantity);
      }

      return createdOrder;
    } catch (error) {
      if (error instanceof AppError) throw error;
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
    let countQuery = db.select({ count: orders.id }).from(orders);

    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }

    const countResult = await countQuery;
    const total = countResult.length;

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

    const order = await this.getOrderById(id);

    if (order.status !== 'pending') {
      throw new AppError(400, 'Solo se pueden cancelar órdenes pendientes');
    }

    // Restore product stock
    const items = await db.select().from(order_items).where(eq(order_items.order_id, id));

    for (const item of items) {
      const product = await productsController.getProductById(item.product_id);
      await db
        .update(products)
        .set({ stock: product.stock + item.quantity })
        .where(eq(products.id, item.product_id));
    }

    const result = await db
      .update(orders)
      .set({ status: 'cancelled', updated_at: new Date() })
      .where(eq(orders.id, id))
      .returning();

    return result[0];
  },
};
