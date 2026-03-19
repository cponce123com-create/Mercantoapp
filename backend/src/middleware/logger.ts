import { Context, Next } from 'hono';
import { config } from '@/config/env';

export const loggerMiddleware = async (c: Context, next: Next) => {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  if (config.log_level !== 'silent') {
    console.log(`[${new Date().toISOString()}] ${method} ${path}`);
  }

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  if (config.log_level !== 'silent') {
    console.log(`[${new Date().toISOString()}] ${method} ${path} - ${status} (${duration}ms)`);
  }
};
