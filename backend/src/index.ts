import { Hono } from 'hono';
import { rateLimiter } from 'hono-rate-limiter';
import { config } from '@/config/env';
import { errorHandler } from '@/middleware/errorHandler';
import { corsMiddleware } from '@/middleware/cors';
import { loggerMiddleware } from '@/middleware/logger';
import healthRouter from '@/routes/health';
import storesRouter from '@/routes/stores';
import productsRouter from '@/routes/products';
import ordersRouter from '@/routes/orders';
import authRouter from '@/routes/auth';
import adminRouter from '@/routes/admin';

const app = new Hono();

// Global middleware
app.use(loggerMiddleware);
app.use(corsMiddleware);
app.use(errorHandler);

// Rate limiting para autenticación (máximo 10 intentos cada 15 minutos)
const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (c) => c.req.header('x-forwarded-for') || 'unknown',
  handler: (c) => {
    return c.json({ 
      success: false, 
      error: 'Demasiados intentos. Por favor, inténtelo de nuevo más tarde.' 
    }, 429);
  },
});

// Health check routes
app.route('/api', healthRouter);

// API routes
app.use('/api/auth/*', authLimiter);
app.route('/api/auth', authRouter);
app.route('/api/stores', storesRouter);
app.route('/api/products', productsRouter);
app.route('/api/orders', ordersRouter);
app.route('/api/admin', adminRouter);

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
