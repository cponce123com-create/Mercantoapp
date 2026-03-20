import { eq, count, sum, gte, lt, and, desc } from 'drizzle-orm';
import { getDb, orders, stores, users } from '@/db';
import { AppError } from '@/utils/types';

export const adminController = {
  async getDashboardMetrics() {
    const db = getDb();

    try {
      // Total orders today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const ordersResult = await db
        .select({ count: count() })
        .from(orders)
        .where(gte(orders.created_at, today));

      const totalOrdersToday = Number(ordersResult[0]?.count || 0);

      // Total revenue today
      const revenueResult = await db
        .select({ total: sum(orders.total_amount) })
        .from(orders)
        .where(gte(orders.created_at, today));

      const totalRevenueToday = parseFloat(revenueResult[0]?.total || '0');

      // Active stores
      const activeStoresResult = await db
        .select({ count: count() })
        .from(stores)
        .where(eq(stores.is_active, true));

      const totalActiveStores = Number(activeStoresResult[0]?.count || 0);

      // Total users
      const usersResult = await db
        .select({ count: count() })
        .from(users);

      const totalUsers = Number(usersResult[0]?.count || 0);

      // Pending stores for approval
      const pendingStoresResult = await db
        .select({ count: count() })
        .from(stores)
        .where(eq(stores.status, 'pending'));

      const pendingStores = Number(pendingStoresResult[0]?.count || 0);

      // Orders by status
      const statusBreakdown = await db
        .select({
          status: orders.status,
          count: count(),
        })
        .from(orders)
        .groupBy(orders.status);

      // Sales by day (last 7 days)
      const salesByDay = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayResult = await db
          .select({ total: sum(orders.total_amount) })
          .from(orders)
          .where(
            and(
              gte(orders.created_at, date),
              lt(orders.created_at, nextDate)
            )
          );

        const dayTotal = parseFloat(dayResult[0]?.total || '0');
        salesByDay.push({
          date: date.toISOString().split('T')[0],
          total: dayTotal,
        });
      }

      return {
        totalOrdersToday,
        totalRevenueToday,
        totalActiveStores,
        totalUsers,
        pendingStores,
        statusBreakdown,
        salesByDay,
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw new AppError(500, 'Error al obtener métricas del dashboard', undefined);
    }
  },

  async getPendingStores() {
    const db = getDb();

    try {
      const result = await db
        .select()
        .from(stores)
        .where(eq(stores.status, 'pending'))
        .orderBy(desc(stores.created_at));

      return result;
    } catch (error) {
      throw new AppError(500, 'Error al obtener tiendas pendientes', undefined);
    }
  },

  async getRecentOrders(limit: number = 10) {
    const db = getDb();

    try {
      const result = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.created_at))
        .limit(limit);

      return result;
    } catch (error) {
      throw new AppError(500, 'Error al obtener pedidos recientes', undefined);
    }
  },
};
