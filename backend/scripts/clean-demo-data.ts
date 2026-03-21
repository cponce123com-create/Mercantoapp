import { getDb, stores, products, orders, order_items } from '../src/db';

async function main() {
  console.log('🧹 Iniciando limpieza de datos demo...');
  const db = getDb();

  try {
    console.log('🗑️ Eliminando items de órdenes...');
    await db.delete(order_items);
    
    console.log('🗑️ Eliminando órdenes...');
    await db.delete(orders);
    
    console.log('🗑️ Eliminando productos...');
    await db.delete(products);
    
    console.log('🗑️ Eliminando tiendas...');
    await db.delete(stores);

    console.log('✅ Limpieza completada exitosamente.');
  } catch (error) {
    console.error('❌ Error durante la limpieza de datos:', error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
