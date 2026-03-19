import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '@/config/env';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const pool = new Pool({
      connectionString: config.database_url,
    });

    db = drizzle(pool, { schema });
  }

  return db;
}

export type Database = ReturnType<typeof getDb>;

export * from './schema';
