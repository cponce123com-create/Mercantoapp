import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL no está configurado. Usando valor por defecto de desarrollo.');
}

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET no está configurado en producción. Abortando por seguridad.');
}

export const config = {
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  database_url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mercanto',
  log_level: process.env.LOG_LEVEL || 'info',
  cors_origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwt_secret: process.env.JWT_SECRET || 'mercanto_secret_key',
};

export const isDevelopment = config.node_env === 'development';
export const isProduction = config.node_env === 'production';
