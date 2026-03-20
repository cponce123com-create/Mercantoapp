/**
 * Este script simula la ejecución del seed en entornos donde no hay una base de datos PostgreSQL real.
 * En un entorno de desarrollo real, se usaría seed-complete.ts con una DB conectada.
 */
console.log('🚀 Iniciando carga de datos MOCK para Mercanto (20 tiendas, 200 productos)...');
console.log('👤 Usuario administrador/dueño asegurado.');

for (let i = 1; i <= 20; i++) {
  console.log(`🏪 Procesando tienda ${i}...`);
  console.log(`📦 Insertando 10 productos para la tienda ${i}...`);
}

console.log('✅ Se han simulado 20 tiendas y 200 productos exitosamente.');
console.log('📝 Nota: Los archivos de esquema y seed real han sido creados y están listos para ser usados en producción.');
