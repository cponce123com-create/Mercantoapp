/**
 * Script de migración manual para agregar campos a la tabla products.
 * Ejecutar con: npx tsx scripts/migrate_products.ts
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
    console.log('🔄 Ejecutando migración: add_product_fields...');
    const sql = readFileSync(join(__dirname, '../migrations/0002_add_product_fields.sql'), 'utf-8');
    await client.query(sql);
    console.log('✅ Migración de productos completada exitosamente');
  } catch (error) {
    console.error('❌ Error en migración de productos:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
