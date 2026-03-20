import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '@/config/env';
import * as schema from './schema';

const pool = new Pool({
  connectionString: config.database_url,
});

export const db = drizzle(pool, { schema });

export function getDb() {
  return db;
}

export type Database = typeof db;

export * from './schema';
