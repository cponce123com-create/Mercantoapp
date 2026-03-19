import { Context } from 'hono';
import { sign } from 'hono/jwt';
import { setCookie, deleteCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { config } from '@/config/env';

export const register = async (c: Context) => {
  try {
    const { email, password, name, role } = await c.req.json();

    // Validar rol
    const validRoles = ['buyer', 'seller', 'admin'];
    const userRole = validRoles.includes(role) ? role : 'buyer';

    // Verificar si el usuario ya existe
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return c.json({ success: false, error: 'El correo electrónico ya está registrado' }, 400);
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const [newUser] = await db.insert(users).values({
      email,
      password_hash: passwordHash,
      name,
      role: userRole,
    }).returning();

    // Generar token JWT
    const token = await sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      config.jwt_secret
    );

    // Establecer cookie
    setCookie(c, 'auth_token', token, {
      httpOnly: true,
      secure: config.node_env === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return c.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return c.json({ success: false, error: 'Error al registrar usuario' }, 500);
  }
};

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();

    // Buscar usuario
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return c.json({ success: false, error: 'Credenciales inválidas' }, 401);
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return c.json({ success: false, error: 'Credenciales inválidas' }, 401);
    }

    // Generar token JWT
    const token = await sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt_secret
    );

    // Establecer cookie
    setCookie(c, 'auth_token', token, {
      httpOnly: true,
      secure: config.node_env === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    return c.json({ success: false, error: 'Error al iniciar sesión' }, 500);
  }
};

export const logout = async (c: Context) => {
  deleteCookie(c, 'auth_token');
  return c.json({ success: true, message: 'Sesión cerrada correctamente' });
};

export const getCurrentSession = async (c: Context) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ success: false, error: 'No hay sesión activa' }, 401);
  }

  // Opcional: Recargar datos frescos del usuario de la DB
  const [dbUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  
  if (!dbUser) {
    return c.json({ success: false, error: 'Usuario no encontrado' }, 404);
  }

  return c.json({
    success: true,
    user: {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
    },
  });
};
