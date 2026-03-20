import { Hono } from 'hono';
import { eq, and, desc, count, sql } from 'drizzle-orm';
import { getDb, stores, orders, users, products, order_items } from '@/db';
import { storesController } from '@/controllers/stores';
import { ordersController } from '@/controllers/orders';
import { authMiddleware, roleGuard } from '@/middleware/auth';
import { AppError } from '@/utils/types';
import { updateStoreStatusSchema, listStoresSchema, storeIdSchema, updateStoreSchema } from '@/validators/stores';
import { listOrdersSchema } from '@/validators/orders';
import { updateUserSchema } from '@/validators/users';

const adminRouter = new Hono();

// Aplicar autenticación y rol admin a todas las rutas
adminRouter.use('*', authMiddleware, roleGuard(['admin']));

// ============================================================================
// DASHBOARD - Métricas reales
// ============================================================================
adminRouter.get('/dashboard', async (c) => {
  try {
    const db = getDb();

    // Total de tiendas por estado
    const storesStats = await db
      .select({
        status: stores.status,
        total: count(stores.id),
      })
      .from(stores)
      .groupBy(stores.status);

    const storesPending = storesStats.find((s) => s.status === 'pending')?.total ?? 0;
    const storesApproved = storesStats.find((s) => s.status === 'approved')?.total ?? 0;
    const storesRejected = storesStats.find((s) => s.status === 'rejected')?.total ?? 0;
    const totalStores = Number(storesPending) + Number(storesApproved) + Number(storesRejected);

    // Total de pedidos por estado
    const ordersStats = await db
      .select({
        status: orders.status,
        total: count(orders.id),
      })
      .from(orders)
      .groupBy(orders.status);

    const totalOrders = ordersStats.reduce((acc, o) => acc + Number(o.total), 0);
    const pendingOrders = ordersStats.find((o) => o.status === 'pending')?.total ?? 0;
    const confirmedOrders = ordersStats.find((o) => o.status === 'confirmed')?.total ?? 0;
    const deliveredOrders = ordersStats.find((o) => o.status === 'delivered')?.total ?? 0;
    const cancelledOrders = ordersStats.find((o) => o.status === 'cancelled')?.total ?? 0;

    // Total de ingresos (suma de pedidos entregados)
    const revenueResult = await db
      .select({
        total: sql<string>`COALESCE(SUM(total_amount), 0)`,
      })
      .from(orders)
      .where(eq(orders.status, 'delivered'));

    const totalRevenue = parseFloat(revenueResult[0]?.total ?? '0');

    // Total de usuarios
    const usersResult = await db.select({ total: count(users.id) }).from(users);
    const totalUsers = Number(usersResult[0]?.total ?? 0);

    // Total de productos
    const productsResult = await db.select({ total: count(products.id) }).from(products);
    const totalProducts = Number(productsResult[0]?.total ?? 0);

    // Pedidos recientes (últimos 10) con info de usuario y tienda
    const recentOrders = await db
      .select({
        id: orders.id,
        status: orders.status,
        total_amount: orders.total_amount,
        created_at: orders.created_at,
        user_name: users.name,
        user_email: users.email,
        store_name: stores.name,
        store_id: orders.store_id,
        user_id: orders.user_id,
      })
      .from(orders)
      .leftJoin(users, eq(orders.user_id, users.id))
      .leftJoin(stores, eq(orders.store_id, stores.id))
      .orderBy(desc(orders.created_at))
      .limit(10);

    // Ingresos de los últimos 7 días (agrupados por día)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await db
      .select({
        day: sql<string>`DATE(created_at)`,
        total: sql<string>`COALESCE(SUM(total_amount), 0)`,
        count: count(orders.id),
      })
      .from(orders)
      .where(sql`created_at >= ${sevenDaysAgo.toISOString()}`)
      .groupBy(sql`DATE(created_at)`)
      .orderBy(sql`DATE(created_at)`);

    return c.json({
      success: true,
      data: {
        stores: {
          total: totalStores,
          pending: Number(storesPending),
          approved: Number(storesApproved),
          rejected: Number(storesRejected),
        },
        orders: {
          total: totalOrders,
          pending: Number(pendingOrders),
          confirmed: Number(confirmedOrders),
          delivered: Number(deliveredOrders),
          cancelled: Number(cancelledOrders),
        },
        revenue: {
          total: totalRevenue,
        },
        users: {
          total: totalUsers,
        },
        products: {
          total: totalProducts,
        },
        recentOrders,
        dailyRevenue,
      },
    });
  } catch (error) {
    console.error('Error en dashboard admin:', error);
    return c.json({ success: false, error: 'Error al obtener métricas del dashboard' }, 500);
  }
});

// ============================================================================
// TIENDAS - Listado y gestión de estado
// ============================================================================

// Listar todas las tiendas (con info del dueño)
adminRouter.get('/stores', async (c) => {
  try {
    const db = getDb();
    const query = c.req.query();
    const input = listStoresSchema.parse(query);
    const offset = (input.page - 1) * input.limit;

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

    let storesQuery = db
      .select({
        id: stores.id,
        name: stores.name,
        description: stores.description,
        email: stores.email,
        phone: stores.phone,
        address: stores.address,
        city: stores.city,
        country: stores.country,
        logo_url: stores.logo_url,
        status: stores.status,
        is_active: stores.is_active,
        created_at: stores.created_at,
        updated_at: stores.updated_at,
        owner_id: stores.owner_id,
        owner_name: users.name,
        owner_email: users.email,
      })
      .from(stores)
      .leftJoin(users, eq(stores.owner_id, users.id));

    if (conditions.length > 0) {
      storesQuery = storesQuery.where(and(...conditions));
    }

    const result = await storesQuery
      .orderBy(desc(stores.created_at))
      .limit(input.limit)
      .offset(offset);

    // Contar total
    let countQuery = db.select({ total: count(stores.id) }).from(stores);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    const countResult = await countQuery;
    const total = Number(countResult[0]?.total ?? 0);
    const pages = Math.ceil(total / input.limit);

    return c.json({
      success: true,
      data: result,
      pagination: { page: input.page, limit: input.limit, total, pages },
    });
  } catch (error) {
    console.error('Error al listar tiendas admin:', error);
    return c.json({ success: false, error: 'Error al listar tiendas' }, 500);
  }
});

// Aprobar tienda
adminRouter.patch('/stores/:id/approve', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const input = storeIdSchema.parse({ id });
    const store = await storesController.updateStoreStatus(input.id, 'approved');
    return c.json({ success: true, data: store });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al aprobar tienda' }, 500);
  }
});

// Rechazar tienda
adminRouter.patch('/stores/:id/reject', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const input = storeIdSchema.parse({ id });
    const store = await storesController.updateStoreStatus(input.id, 'rejected');
    return c.json({ success: true, data: store });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al rechazar tienda' }, 500);
  }
});

// Actualizar estado de tienda (genérico)
adminRouter.patch('/stores/:id/status', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const body = await c.req.json();
    const { status } = updateStoreStatusSchema.parse(body);
    const store = await storesController.updateStoreStatus(id, status);
    return c.json({ success: true, data: store });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({ success: false, error: 'Validación fallida', errors: (error as any).errors }, 400);
    }
    return c.json({ success: false, error: 'Error al actualizar estado de tienda' }, 500);
  }
});

// Editar tienda (admin)
adminRouter.put('/stores/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const body = await c.req.json();
    const input = updateStoreSchema.parse(body);
    const store = await storesController.updateStore(id, input);
    return c.json({ success: true, data: store });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({ success: false, error: 'Validación fallida', errors: (error as any).errors }, 400);
    }
    return c.json({ success: false, error: 'Error al actualizar tienda' }, 500);
  }
});

// ============================================================================
// PEDIDOS - Listado completo con info de usuario y tienda
// ============================================================================
adminRouter.get('/orders', async (c) => {
  try {
    const db = getDb();
    const query = c.req.query();
    const input = listOrdersSchema.parse(query);
    const offset = (input.page - 1) * input.limit;

    const conditions = [];
    if (input.user_id) conditions.push(eq(orders.user_id, input.user_id));
    if (input.store_id) conditions.push(eq(orders.store_id, input.store_id));
    if (input.status) conditions.push(eq(orders.status, input.status));

    let ordersQuery = db
      .select({
        id: orders.id,
        status: orders.status,
        total_amount: orders.total_amount,
        shipping_address: orders.shipping_address,
        notes: orders.notes,
        created_at: orders.created_at,
        updated_at: orders.updated_at,
        user_id: orders.user_id,
        store_id: orders.store_id,
        user_name: users.name,
        user_email: users.email,
        store_name: stores.name,
      })
      .from(orders)
      .leftJoin(users, eq(orders.user_id, users.id))
      .leftJoin(stores, eq(orders.store_id, stores.id));

    if (conditions.length > 0) {
      ordersQuery = ordersQuery.where(and(...conditions));
    }

    const result = await ordersQuery
      .orderBy(desc(orders.created_at))
      .limit(input.limit)
      .offset(offset);

    // Contar total
    let countQuery = db.select({ total: count(orders.id) }).from(orders);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    const countResult = await countQuery;
    const total = Number(countResult[0]?.total ?? 0);
    const pages = Math.ceil(total / input.limit);

    return c.json({
      success: true,
      data: result,
      pagination: { page: input.page, limit: input.limit, total, pages },
    });
  } catch (error) {
    console.error('Error al listar pedidos admin:', error);
    return c.json({ success: false, error: 'Error al listar pedidos' }, 500);
  }
});

// Actualizar estado de pedido
adminRouter.patch('/orders/:id/status', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const body = await c.req.json();
    const order = await ordersController.updateOrderStatus(id, body);
    return c.json({ success: true, data: order });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al actualizar estado de pedido' }, 500);
  }
});

// ============================================================================
// USUARIOS - Gestión de roles y listado
// ============================================================================

// Listar usuarios
adminRouter.get('/users', async (c) => {
  try {
    const db = getDb();
    const query = c.req.query();
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '15', 10);
    const offset = (page - 1) * limit;

    const result = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
      })
      .from(users)
      .orderBy(desc(users.created_at))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({ total: count(users.id) }).from(users);
    const total = Number(countResult[0]?.total ?? 0);
    const pages = Math.ceil(total / limit);

    return c.json({
      success: true,
      data: result,
      pagination: { page, limit, total, pages },
    });
  } catch (error) {
    console.error('Error al listar usuarios admin:', error);
    return c.json({ success: false, error: 'Error al listar usuarios' }, 500);
  }
});

// Actualizar rol de usuario
adminRouter.patch('/users/:id/role', async (c) => {
  try {
    const db = getDb();
    const id = parseInt(c.req.param('id'), 10);
    const body = await c.req.json();
    
    if (!['admin', 'store_owner', 'customer'].includes(body.role)) {
      return c.json({ success: false, error: 'Rol inválido' }, 400);
    }

    const [updatedUser] = await db
      .update(users)
      .set({ 
        role: body.role,
        updated_at: new Date()
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role
      });

    if (!updatedUser) {
      return c.json({ success: false, error: 'Usuario no encontrado' }, 404);
    }

    return c.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error);
    return c.json({ success: false, error: 'Error al actualizar rol' }, 500);
  }
});

// Eliminar usuario
adminRouter.delete('/users/:id', async (c) => {
  try {
    const db = getDb();
    const id = parseInt(c.req.param('id'), 10);
    
    // No permitir que un admin se borre a sí mismo
    const currentUser = c.get('user');
    if (currentUser.id === id) {
      return c.json({ success: false, error: 'No puedes eliminar tu propia cuenta' }, 400);
    }

    await db.delete(users).where(eq(users.id, id));
    
    return c.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return c.json({ success: false, error: 'Error al eliminar usuario' }, 500);
  }
});

export default adminRouter;
