import { getDb, stores } from '../src/db';
import { eq, inArray } from 'drizzle-orm';

async function main() {
  console.log('🚀 Iniciando actualización de tiendas para el piloto en San Ramón...');
  const db = getDb();

  try {
    // Actualizar las primeras 8 tiendas
    const storeIds = [1, 2, 3, 4, 5, 6, 7, 8];
    
    await db.update(stores)
      .set({
        city: 'San Ramón, Chanchamayo, Junín',
        updated_at: new Date()
      })
      .where(inArray(stores.id, storeIds));

    console.log('✅ Se han actualizado las 8 tiendas exitosamente a San Ramón, Chanchamayo, Junín.');
  } catch (error) {
    console.error('❌ Error al actualizar las tiendas:', error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
