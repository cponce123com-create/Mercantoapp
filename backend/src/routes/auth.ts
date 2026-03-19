import { Hono } from 'hono';
import { register, login, logout, getCurrentSession } from '@/controllers/auth';
import { authMiddleware } from '@/middleware/auth';

const authRouter = new Hono();

// Rutas públicas
authRouter.post('/register', register);
authRouter.post('/login', login);

// Rutas protegidas
authRouter.get('/me', authMiddleware, getCurrentSession);
authRouter.post('/logout', authMiddleware, logout);

export default authRouter;
