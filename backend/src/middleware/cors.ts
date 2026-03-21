import { Context, Next } from 'hono';
import { config } from '@/config/env';

export const corsMiddleware = async (c: Context, next: Next) => {
  const origin = c.req.header('Origin') || '*';

  // Check if origin is allowed
  const allowedOrigins = [config.cors_origin, 'http://localhost:3000', 'http://localhost:3001'];
  
  // Solo permitir cualquier origen si estamos explícitamente en desarrollo
  const isDevelopment = config.node_env === 'development';
  const isAllowed = allowedOrigins.includes(origin) || isDevelopment;

  if (c.req.method === 'OPTIONS') {
    return c.text('', 204, {
      'Access-Control-Allow-Origin': isAllowed ? origin : config.cors_origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    });  }

  await next();

  c.header('Access-Control-Allow-Origin', isAllowed ? origin : config.cors_origin);
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Allow-Credentials', 'true');
};