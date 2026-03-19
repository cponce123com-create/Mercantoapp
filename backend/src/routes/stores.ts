import { Hono } from 'hono';
import { storesController } from '@/controllers/stores';
import {
  createStoreSchema,
  updateStoreSchema,
  storeIdSchema,
  listStoresSchema,
} from '@/validators/stores';
import { AppError } from '@/utils/types';

const storesRouter = new Hono();

// List stores
storesRouter.get('/', async (c) => {
  try {
    const query = c.req.query();
    const input = listStoresSchema.parse(query);
    const { stores, total } = await storesController.listStores(input);

    const pages = Math.ceil(total / input.limit);

    return c.json({
      success: true,
      data: stores,
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
    return c.json({ success: false, error: 'Error al listar tiendas' }, 500);
  }
});

// Create store
storesRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const input = createStoreSchema.parse(body);
    const store = await storesController.createStore(input);

    return c.json({ success: true, data: store }, 201);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({ success: false, error: 'Validación fallida', errors: (error as any).errors }, 400);
    }
    return c.json({ success: false, error: 'Error al crear tienda' }, 500);
  }
});

// Get store by ID
storesRouter.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const input = storeIdSchema.parse({ id });
    const store = await storesController.getStoreById(input.id);

    return c.json({ success: true, data: store });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al obtener tienda' }, 500);
  }
});

// Update store
storesRouter.put('/:id', async (c) => {
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

// Delete store
storesRouter.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const input = storeIdSchema.parse({ id });
    await storesController.deleteStore(input.id);

    return c.json({ success: true, message: 'Tienda eliminada' });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al eliminar tienda' }, 500);
  }
});

export default storesRouter;
