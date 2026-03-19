import { Hono } from 'hono';
import { config } from '@/config/env';
import { errorHandler } from '@/middleware/errorHandler';
import { corsMiddleware } from '@/middleware/cors';
import { loggerMiddleware } from '@/middleware/logger';
import healthRouter from '@/routes/health';
import storesRouter from '@/routes/stores';
import productsRouter from '@/routes/products';
import ordersRouter from '@/routes/orders';

const app = new Hono();

// Global middleware
app.use(loggerMiddleware);
app.use(corsMiddleware);
app.use(errorHandler);

// Health check routes
app.route('/api', healthRouter);

// API routes
app.route('/api/stores', storesRouter);
app.route('/api/products', productsRouter);
app.route('/api/orders', ordersRouter);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Mercanto API Backend',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/healthz',
      stores: '/api/stores',
      products: '/api/products',
      orders: '/api/orders',
    },
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: 'Ruta no encontrada' }, 404);
});

// Start server
const port = config.port;

console.log(`🚀 Mercanto API Backend iniciado`);
console.log(`📍 Servidor escuchando en http://localhost:${port}`);
console.log(`🌍 Entorno: ${config.node_env}`);
console.log(`📊 Base de datos: ${config.database_url.split('@')[1] || 'configurada'}`);

export default app;
