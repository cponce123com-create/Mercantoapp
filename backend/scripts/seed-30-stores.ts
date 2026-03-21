import { getDb, stores, products, users } from '../src/db';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🚀 Iniciando carga de 30 tiendas y 300 productos para Mercanto...');
  const db = getDb();

  // 1. Asegurar que exista un usuario dueño (owner)
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

  // 2. Definir categorías y datos base
  const categories = [
    "Restaurante", "Bodega", "Minimarket", "Farmacia", 
    "Ropa", "Ferretería", "Tecnología", "Frutas y Verduras"
  ];

  const storeImages: Record<string, string[]> = {
    "Restaurante": ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", "https://images.unsplash.com/photo-1552566626-52f8b828add9"],
    "Bodega": ["https://images.unsplash.com/photo-1534723452862-4c874018d66d", "https://images.unsplash.com/photo-1578916171728-46686eac8d58"],
    "Minimarket": ["https://images.unsplash.com/photo-1604719312566-8912e9227c6a", "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8"],
    "Farmacia": ["https://images.unsplash.com/photo-1586015555751-63bb77f4322a", "https://images.unsplash.com/photo-1631549916768-4119b2e5f926"],
    "Ropa": ["https://images.unsplash.com/photo-1441986300917-64674bd600d8", "https://images.unsplash.com/photo-1470309634618-16fe5032b745"],
    "Ferretería": ["https://images.unsplash.com/photo-1581244277943-fe4a9c777189", "https://images.unsplash.com/photo-1530124560676-587cad321376"],
    "Tecnología": ["https://images.unsplash.com/photo-1531297484001-80022131f5a1", "https://images.unsplash.com/photo-1498049794561-7780e7231661"],
    "Frutas y Verduras": ["https://images.unsplash.com/photo-1610348725531-843dff563e2c", "https://images.unsplash.com/photo-1542838132-92c53300491e"]
  };

  const productData: Record<string, { names: string[], images: string[] }> = {
    "Restaurante": {
      names: ["Lomo Saltado", "Ají de Gallina", "Ceviche Clásico", "Pollo a la Brasa", "Arroz con Pollo", "Pachamanca", "Anticuchos", "Causa Limeña", "Tacacho con Cecina", "Tallarines Verdes"],
      images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"]
    },
    "Bodega": {
      names: ["Arroz Extra 1kg", "Aceite Vegetal 1L", "Azúcar Rubia 1kg", "Leche Evaporada", "Fideos Spaghetti", "Atún en Conserva", "Café Instantáneo", "Galletas de Soda", "Detergente en Polvo", "Jabón de Tocador"],
      images: ["https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8", "https://images.unsplash.com/photo-1542838132-92c53300491e"]
    },
    "Minimarket": {
      names: ["Yogurt Natural", "Queso Fresco", "Jamón del País", "Pan de Molde", "Mantequilla con Sal", "Jugo de Naranja 1L", "Cereal de Maíz", "Huevos x12", "Snacks Variados", "Gaseosa 1.5L"],
      images: ["https://images.unsplash.com/photo-1542838132-92c53300491e", "https://images.unsplash.com/photo-1604719312566-8912e9227c6a"]
    },
    "Farmacia": {
      names: ["Paracetamol 500mg", "Ibuprofeno 400mg", "Mascarillas KN95", "Alcohol en Gel", "Vitaminas C", "Termómetro Digital", "Algodón Hidrófilo", "Gasa Estéril", "Jarabe para la Tos", "Protector Solar"],
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae", "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88"]
    },
    "Ropa": {
      names: ["Polo de Algodón", "Pantalón Jean", "Casaca Impermeable", "Camisa Formal", "Vestido de Verano", "Short Deportivo", "Medias de Lana", "Gorra Urbana", "Chompa de Hilo", "Correa de Cuero"],
      images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b", "https://images.unsplash.com/photo-1542291026-7eec264c27ff"]
    },
    "Ferretería": {
      names: ["Martillo de Acero", "Juego de Destornilladores", "Cinta Métrica 5m", "Taladro Percutor", "Alicate Universal", "Pintura Látex 1gl", "Brocha de 3 pulgadas", "Linterna LED", "Candado de Seguridad", "Escalera de Aluminio"],
      images: ["https://images.unsplash.com/photo-1581244277943-fe4a9c777189", "https://images.unsplash.com/photo-1572721726739-268944e29b48"]
    },
    "Tecnología": {
      names: ["Smartphone 128GB", "Laptop Core i5", "Audífonos Bluetooth", "Mouse Inalámbrico", "Teclado Mecánico", "Monitor 24 pulgadas", "Cargador Carga Rápida", "Power Bank 10000mAh", "Tablet 10 pulgadas", "Smartwatch"],
      images: ["https://images.unsplash.com/photo-1526733170375-bc818a901f02", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"]
    },
    "Frutas y Verduras": {
      names: ["Manzana Delicia 1kg", "Plátano de Seda 1kg", "Naranja para Jugo 1kg", "Papaya Madura", "Tomate Italiano 1kg", "Cebolla Roja 1kg", "Papa Amarilla 1kg", "Zanahoria Fresca 1kg", "Lechuga Orgánica", "Palta Fuerte 1kg"],
      images: ["https://images.unsplash.com/photo-1610348725531-843dff563e2c", "https://images.unsplash.com/photo-1518843875459-f738682238a6"]
    }
  };

  try {
    for (let i = 1; i <= 30; i++) {
      const category = categories[i % categories.length];
      const storeName = `${category} ${['Central', 'Express', 'Premium', 'La Merced', 'San Ramón', 'El Sol'][i % 6]} ${i}`;
      
      console.log(`🏪 Creando tienda ${i}/30: ${storeName} (${category})`);
      
      const storeValues = {
        owner_id: ownerId,
        name: storeName,
        description: `Tu mejor opción en la categoría ${category}. Ofrecemos calidad y confianza en cada compra.`,
        email: `contacto_tienda${i}@mercanto.pe`,
        phone: `9${Math.floor(10000000 + Math.random() * 89999999)}`,
        address: `Calle Principal ${100 + i}, San Ramón`,
        city: "San Ramón",
        country: "Perú",
        logo_url: storeImages[category][i % storeImages[category].length] + "?q=80&w=400&auto=format&fit=crop",
        status: 'approved',
        is_active: true,
        updated_at: new Date()
      };

      // Insertar tienda
      const newStore = await db.insert(stores).values(storeValues).returning({ id: stores.id });
      const currentStoreId = newStore[0].id;

      // 3. Crear 10 productos para esta tienda
      console.log(`  📦 Insertando 10 productos para la tienda ${currentStoreId}...`);
      
      const catData = productData[category];
      
      for (let j = 0; j < 10; j++) {
        const originalPrice = 10 + Math.random() * 100;
        const discountPercentage = Math.floor(Math.random() * 30);
        const price = originalPrice * (1 - discountPercentage / 100);
        
        const productName = catData.names[j];
        const productImage = catData.images[j % catData.images.length] + `?q=80&w=400&auto=format&fit=crop&sig=${i}-${j}`;

        await db.insert(products).values({
          store_id: currentStoreId,
          name: productName,
          description: `Excelente ${productName} disponible en ${storeName}. Calidad garantizada para nuestros clientes de ${category}.`,
          price: price.toFixed(2),
          original_price: originalPrice.toFixed(2),
          discount_price: price.toFixed(2),
          discount_percentage: discountPercentage,
          stock: 20 + Math.floor(Math.random() * 80),
          sku: `SKU-${currentStoreId}-${j}-${Math.floor(Math.random() * 1000)}`,
          category: category,
          image_url: productImage,
          images: [productImage],
          is_active: true,
          updated_at: new Date()
        });
      }
    }

    console.log('✅ ¡Éxito! Se han insertado 30 tiendas y 300 productos correctamente.');
  } catch (error) {
    console.error('❌ Error durante la ejecución del seed:', error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
