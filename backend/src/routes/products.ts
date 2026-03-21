import { Hono } from 'hono';
import { productsController } from '@/controllers/products';
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  listProductsSchema,
} from '@/validators/products';
import { AppError } from '@/utils/types';

const productsRouter = new Hono();

// Search products
productsRouter.get('/search', async (c) => {
  try {
    const query = c.req.query('q');
    if (!query) {
      return c.json({ success: true, data: [] });
    }
    const products = await productsController.searchProducts(query);
    return c.json({ success: true, data: products });
  } catch (error) {
    return c.json({ success: false, error: 'Error al buscar productos' }, 500);
  }
});

// List products by store
productsRouter.get('/store/:storeId', async (c) => {
  try {
    const storeId = parseInt(c.req.param('storeId'), 10);
    const query = c.req.query();
    const input = listProductsSchema.parse({ ...query, store_id: storeId });
    const { products, total } = await productsController.listProductsByStore(input);

    const pages = Math.ceil(total / input.limit);

    return c.json({
      success: true,
      data: products,
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
    return c.json({ success: false, error: 'Error al listar productos' }, 500);
  }
});

// Create product
productsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const input = createProductSchema.parse(body);
    const product = await productsController.createProduct(input);

    return c.json({ success: true, data: product }, 201);
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({ success: false, error: 'Validación fallida', errors: (error as any).errors }, 400);
    }
    return c.json({ success: false, error: 'Error al crear producto' }, 500);
  }
});

// Get product by ID
productsRouter.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const input = productIdSchema.parse({ id });
    const product = await productsController.getProductById(input.id);

    return c.json({ success: true, data: product });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al obtener producto' }, 500);
  }
});

// Update product
productsRouter.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const body = await c.req.json();
    const input = updateProductSchema.parse(body);
    const product = await productsController.updateProduct(id, input);

    return c.json({ success: true, data: product });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({ success: false, error: 'Validación fallida', errors: (error as any).errors }, 400);
    }
    return c.json({ success: false, error: 'Error al actualizar producto' }, 500);
  }
});

// Delete product
productsRouter.delete('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const input = productIdSchema.parse({ id });
    await productsController.deleteProduct(input.id);

    return c.json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({ success: false, error: error.message }, error.statusCode);
    }
    return c.json({ success: false, error: 'Error al eliminar producto' }, 500);
  }
});

export default productsRouter;
