/**
 * Script de migración manual para agregar el campo status a la tabla stores.
 * Ejecutar con: npx tsx scripts/migrate.ts
 */
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('🔄 Ejecutando migración: add_store_status...');
    const sql = readFileSync(join(__dirname, '../migrations/0001_add_store_status.sql'), 'utf-8');
    await client.query(sql);
    console.log('✅ Migración completada exitosamente');
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
