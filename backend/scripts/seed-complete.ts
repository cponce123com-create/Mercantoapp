import { getDb, stores, products, users } from '../src/db';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🚀 Iniciando carga de datos completos para Mercanto (20 tiendas, 200 productos)...');
  const db = getDb();

  // Asegurar que exista un usuario dueño (owner)
  let ownerId = 1;
  const existingUser = await db.select().from(users).where(eq(users.id, 1)).limit(1);
  if (existingUser.length === 0) {
    console.log('👤 Creando usuario administrador/dueño...');
    const newUser = await db.insert(users).values({
      id: 1,
      email: 'admin@mercanto.pe',
      name: 'Admin Mercanto',
      password_hash: '$2a$10$rB2L6pXm.m8F9f9f9f9f9e', // Hash de ejemplo
      role: 'admin',
    }).returning({ id: users.id });
    ownerId = newUser[0].id;
  }

  const storeTypes = [
    { name: "Minimarket", category: "Minimarket", icon: "🛒" },
    { name: "Ferretería", category: "Ferretería", icon: "🛠️" },
    { name: "Farmacia", category: "Farmacia", icon: "💊" },
    { name: "Boutique", category: "Ropa", icon: "👕" },
    { name: "Tech", category: "Tecnología", icon: "💻" },
    { name: "Librería", category: "Librería", icon: "📚" },
    { name: "Pet Shop", category: "Mascotas", icon: "🐶" },
    { name: "Hogar", category: "Hogar", icon: "🏠" },
    { name: "Panadería", category: "Alimentos", icon: "🥐" },
    { name: "Licorería", category: "Bebidas", icon: "🍾" }
  ];

  const placeholderStoreImages = [
    "https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop"
  ];

  const placeholderProductImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526170315870-ef682c535941?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop"
  ];

  try {
    // 1. Crear 20 tiendas
    for (let i = 1; i <= 20; i++) {
      const type = storeTypes[i % storeTypes.length];
      const storeName = `${type.name} ${['San Ramón', 'La Merced', 'Central', 'El Sol', 'La Selva'][i % 5]} ${i}`;
      
      console.log(`🏪 Creando/Actualizando tienda ${i}: ${storeName}`);
      
      const storeValues = {
        owner_id: ownerId,
        name: storeName,
        description: `La mejor ${type.name} de la zona con productos de calidad y atención personalizada.`,
        email: `tienda${i}@mercanto.pe`,
        phone: `964${Math.floor(100000 + Math.random() * 900000)}`,
        address: `Av. Principal ${100 + i}, San Ramón`,
        city: "San Ramón, Chanchamayo",
        country: "Perú",
        logo_url: placeholderStoreImages[i % placeholderStoreImages.length],
        status: 'approved',
        is_active: true,
        updated_at: new Date()
      };

      let currentStoreId = i;
      const existingStore = await db.select().from(stores).where(eq(stores.id, i)).limit(1);
      
      if (existingStore.length > 0) {
        await db.update(stores).set(storeValues).where(eq(stores.id, i));
      } else {
        const newStore = await db.insert(stores).values({ id: i, ...storeValues }).returning({ id: stores.id });
        currentStoreId = newStore[0].id;
      }

      // 2. Crear 10 productos para cada tienda
      console.log(`📦 Creando 10 productos para la tienda ${currentStoreId}...`);
      
      // Limpiar productos existentes de esta tienda para evitar duplicados si se corre varias veces
      // (Opcional, pero ayuda a mantener el conteo exacto de 200)
      // await db.delete(products).where(eq(products.store_id, currentStoreId));

      for (let j = 1; j <= 10; j++) {
        const originalPrice = 20 + Math.random() * 180;
        const discountPercentage = Math.floor(Math.random() * 40) + 5; // 5% a 45%
        const discountPrice = originalPrice * (1 - discountPercentage / 100);
        
        const productName = `${type.category} Item ${j} - ${['Premium', 'Económico', 'Importado', 'Local', 'Especial'][j % 5]}`;
        
        // Generar 5 fotos para el arreglo images
        const productImages = [];
        for (let k = 0; k < 5; k++) {
          productImages.push(placeholderProductImages[(i + j + k) % placeholderProductImages.length]);
        }

        await db.insert(products).values({
          store_id: currentStoreId,
          name: productName,
          description: `Descripción detallada para ${productName}. Ideal para uso diario y garantizado por ${storeName}.`,
          price: discountPrice.toFixed(2),
          original_price: originalPrice.toFixed(2),
          discount_price: discountPrice.toFixed(2),
          discount_percentage: discountPercentage,
          stock: 10 + Math.floor(Math.random() * 90),
          sku: `SKU-${currentStoreId}-${j}-${Math.floor(Math.random() * 1000)}`,
          category: type.category,
          image_url: productImages[0],
          images: productImages,
          is_active: true
        });
      }
    }

    console.log('✅ Se han cargado 20 tiendas y 200 productos exitosamente.');
  } catch (error) {
    console.error('❌ Error durante la carga de datos:', error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
