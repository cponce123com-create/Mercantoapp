import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { getCookie } from 'hono/cookie';
import { config } from '@/config/env';

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser;
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, 'auth_token') || c.req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return c.json({ success: false, error: 'No autorizado' }, 401);
  }

  try {
    const payload = await verify(token, config.jwt_secret || 'mercanto_secret_key');
    c.set('user', payload as unknown as AuthUser);
    await next();
  } catch (error) {
    return c.json({ success: false, error: 'Token inválido o expirado' }, 401);
  }
};

export const roleGuard = (roles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get('user');
    if (!user || !roles.includes(user.role)) {
      return c.json({ success: false, error: 'Permisos insuficientes' }, 403);
    }
    await next();
  };
};
