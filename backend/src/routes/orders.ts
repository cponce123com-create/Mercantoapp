import { Hono } from 'hono';
import { ordersController } from '@/controllers/orders';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdSchema,
  listOrdersSchema,
} from '@/validators/orders';
import { AppError } from '@/utils/types';

const ordersRouter = new Hono();

// List orders
ordersRouter.get('/', async (c) => {
  try {
    const query = c.req.query();
    const input = listOrdersSchema.parse(query);
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

// Create order
ordersRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const input = createOrderSchema.parse(body);
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

// Get order by ID with items
ordersRouter.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const input = orderIdSchema.parse({ id });
    const orderData = await ordersController.getOrderWithItems(input.id);

    return c.json({ success: true, data: orderData });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al obtener orden' }, 500);
  }
});

// Update order status
ordersRouter.patch('/:id/status', async (c) => {
  try {
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

// Cancel order
ordersRouter.post('/:id/cancel', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const input = orderIdSchema.parse({ id });
    const order = await ordersController.cancelOrder(input.id);

    return c.json({ success: true, data: order });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al cancelar orden' }, 500);
  }
});

export default ordersRouter;
