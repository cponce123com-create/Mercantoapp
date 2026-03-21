import { Hono } from 'hono';
import { ordersController } from '@/controllers/orders';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdSchema,
  listOrdersSchema,
} from '@/validators/orders';
import { AppError } from '@/utils/types';
import { authMiddleware } from '@/middleware/auth';

const ordersRouter = new Hono();

// List orders (Protected - requires authentication)
ordersRouter.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const query = c.req.query();
    const input = listOrdersSchema.parse(query);

    // If user is not admin, only show their own orders
    if (user.role !== 'admin' && !input.user_id) {
      input.user_id = user.id;
    }

    const { orders, total } = await ordersController.listOrders(input);

    const pages = Math.ceil(total / input.limit);

    return c.json({
      success: true,
      data: orders,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        pages,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al listar órdenes' }, 500);
  }
});

// Create order (Protected - requires authentication)
ordersRouter.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const input = createOrderSchema.parse(body);

    // Validate that the user_id matches the authenticated user
    if (input.user_id !== user.id) {
      return c.json({ success: false, error: 'No puedes crear órdenes para otros usuarios' }, 403);
    }

    const order = await ordersController.createOrder(input);

    return c.json({ success: true, data: order }, 201);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({ success: false, error: 'Validación fallida', errors: (error as any).errors }, 400);
    }
    return c.json({ success: false, error: 'Error al crear orden' }, 500);
  }
});

// Get order by ID with items (Protected - requires authentication)
ordersRouter.get('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const id = parseInt(c.req.param('id'), 10);
    const input = orderIdSchema.parse({ id });
    const orderData = await ordersController.getOrderWithItems(input.id);

    // Verify that the user owns this order or is an admin
    if (orderData.order.user_id !== user.id && user.role !== 'admin') {
      return c.json({ success: false, error: 'No tienes permiso para ver esta orden' }, 403);
    }

    return c.json({ success: true, data: orderData });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al obtener orden' }, 500);
  }
});

// Update order status (Protected - requires admin role)
ordersRouter.patch('/:id/status', authMiddleware, async (c) => {
  try {
    const user = c.get('user');

    // Only admins can update order status
    if (user.role !== 'admin') {
      return c.json({ success: false, error: 'Solo los administradores pueden actualizar el estado de las órdenes' }, 403);
    }

    const id = parseInt(c.req.param('id'), 10);
    const body = await c.req.json();
    const input = updateOrderStatusSchema.parse(body);
    const order = await ordersController.updateOrderStatus(id, input);

    return c.json({ success: true, data: order });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({ success: false, error: 'Validación fallida', errors: (error as any).errors }, 400);
    }
    return c.json({ success: false, error: 'Error al actualizar estado de orden' }, 500);
  }
});

// Cancel order (Protected - requires authentication)
ordersRouter.post('/:id/cancel', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const id = parseInt(c.req.param('id'), 10);
    const input = orderIdSchema.parse({ id });
    
    // 1. Obtener la orden para verificar propiedad ANTES de cancelar
    const order = await ordersController.getOrderById(input.id);

    // 2. Verificar que el usuario sea el dueño o admin
    if (order.user_id !== user.id && user.role !== 'admin') {
      return c.json({ success: false, error: 'No tienes permiso para cancelar esta orden' }, 403);
    }

    // 3. Solo entonces proceder a la cancelación
    const cancelledOrder = await ordersController.cancelOrder(input.id);

    return c.json({ success: true, data: cancelledOrder });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al cancelar orden' }, 500);
  }
});

// Get user's orders (convenience endpoint)
ordersRouter.get('/user/my-orders', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { orders, total } = await ordersController.listOrders({
      page: 1,
      limit: 50,
      user_id: user.id,
    });

    return c.json({
      success: true,
      data: orders,
      total,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al obtener tus órdenes' }, 500);
  }
});

export default ordersRouter;
