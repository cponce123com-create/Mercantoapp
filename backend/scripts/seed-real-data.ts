import { getDb, stores, products, users } from '../src/db';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🚀 Iniciando carga de 30 tiendas reales y sus productos...');
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

  const storeData = [
    { name: "Bodega Don Lucho", category: "Bodega", description: "Abarrotes, bebidas y productos de primera necesidad en el corazón del barrio.", address: "Jr. Libertad 450, San Ramón", logo: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=800&auto=format&fit=crop" },
    { name: "Farmacia Santa Rosa", category: "Farmacia", description: "Medicamentos, cuidado personal y atención farmacéutica las 24 horas.", address: "Av. Rivera 120, San Ramón", logo: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=800&auto=format&fit=crop" },
    { name: "Ferretería El Martillo", category: "Ferretería", description: "Todo en herramientas, pinturas y materiales de construcción para tu hogar.", address: "Av. Ejército 315, San Ramón", logo: "https://images.unsplash.com/photo-1530124560676-587cad321376?q=80&w=800&auto=format&fit=crop" },
    { name: "Panadería La Espiga", category: "Panadería", description: "Pan calientito, pasteles y postres tradicionales recién horneados.", address: "Jr. Tarma 210, San Ramón", logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop" },
    { name: "Boutique Elegancia", category: "Ropa", description: "Moda para damas y caballeros con las últimas tendencias de la temporada.", address: "Jr. Progreso 105, San Ramón", logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop" },
    { name: "Restaurante El Sabor Selva", category: "Comida", description: "Los mejores platos típicos de la selva central: tacacho, cecina y más.", address: "Av. Principal 500, San Ramón", logo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop" },
    { name: "Librería El Saber", category: "Librería", description: "Útiles escolares, oficina y una amplia variedad de libros y revistas.", address: "Jr. Junín 320, San Ramón", logo: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop" },
    { name: "Pet Shop Huellitas", category: "Mascotas", description: "Alimentos, accesorios y servicios de peluquería para tus engreídos.", address: "Jr. Arequipa 150, San Ramón", logo: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop" },
    { name: "Electrónica Tech", category: "Tecnología", description: "Venta de celulares, laptops y accesorios tecnológicos de última generación.", address: "Av. Chanchamayo 440, San Ramón", logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop" },
    { name: "Zapatería Pasos", category: "Calzado", description: "Calzado nacional e importado para toda la familia y toda ocasión.", address: "Jr. Lima 225, San Ramón", logo: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop" },
    { name: "Minimarket El Sol", category: "Minimarket", description: "Variedad de productos frescos, lácteos y embutidos con la mejor atención.", address: "Av. Los Incas 110, San Ramón", logo: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=800&auto=format&fit=crop" },
    { name: "Florería Aroma", category: "Regalos", description: "Arreglos florales para toda ocasión y detalles especiales para regalar.", address: "Jr. Bolognesi 412, San Ramón", logo: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop" },
    { name: "Licorería El Brindis", category: "Bebidas", description: "Vinos, licores y cervezas nacionales e importadas al mejor precio.", address: "Av. Selva Alegre 205, San Ramón", logo: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop" },
    { name: "Juguetería Diversión", category: "Juguetes", description: "Los mejores juguetes para niños de todas las edades y juegos de mesa.", address: "Jr. Huánuco 130, San Ramón", logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop" },
    { name: "Óptica Visión", category: "Salud", description: "Examen de la vista, monturas y lentes de contacto de alta calidad.", address: "Av. Grau 330, San Ramón", logo: "https://images.unsplash.com/photo-1511317559916-56d5ddb62563?q=80&w=800&auto=format&fit=crop" },
    { name: "Peluquería Estilo", category: "Belleza", description: "Cortes, tintes y tratamientos capilares para resaltar tu belleza.", address: "Jr. Callao 215, San Ramón", logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop" },
    { name: "Deportes Extremos", category: "Deportes", description: "Ropa y accesorios para ciclismo, trekking y deportes de aventura.", address: "Av. La Merced 400, San Ramón", logo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop" },
    { name: "Mueblería El Roble", category: "Hogar", description: "Muebles de madera fina para sala, comedor y dormitorio.", address: "Jr. Ayacucho 520, San Ramón", logo: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop" },
    { name: "Pastelería Dulce Tentación", category: "Repostería", description: "Tortas personalizadas, bocaditos y dulces para tus eventos.", address: "Jr. Ica 145, San Ramón", logo: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop" },
    { name: "Carnicería El Buen Corte", category: "Alimentos", description: "Carnes de res, cerdo y pollo de la mejor calidad y frescura.", address: "Mercado Central Puesto 15, San Ramón", logo: "https://images.unsplash.com/photo-1607623814075-e512199b6244?q=80&w=800&auto=format&fit=crop" },
    { name: "Vivero La Selva", category: "Hogar", description: "Plantas ornamentales, frutales y todo para tu jardín.", address: "Carretera Marginal Km 2, San Ramón", logo: "https://images.unsplash.com/photo-1416872834464-c3fd96fe3bc7?q=80&w=800&auto=format&fit=crop" },
    { name: "Relojería El Tiempo", category: "Accesorios", description: "Venta y reparación de relojes de pulsera y de pared.", address: "Jr. Puno 112, San Ramón", logo: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop" },
    { name: "Sastrería Velasco", category: "Ropa", description: "Confección de ternos y composturas de ropa a medida.", address: "Jr. Cusco 305, San Ramón", logo: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=800&auto=format&fit=crop" },
    { name: "Veterinaria San Francisco", category: "Mascotas", description: "Atención médica, vacunas y cirugías para animales menores.", address: "Av. San Martín 220, San Ramón", logo: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=800&auto=format&fit=crop" },
    { name: "Bazar El Regalo", category: "Regalos", description: "Novedades, artículos de regalo y envoltorios creativos.", address: "Jr. Moquegua 125, San Ramón", logo: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800&auto=format&fit=crop" },
    { name: "Cafetería Aroma de Café", category: "Comida", description: "El mejor café de Chanchamayo acompañado de postres caseros.", address: "Av. Principal 150, San Ramón", logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop" },
    { name: "Mercería La Costura", category: "Hogar", description: "Hilos, botones, lanas y todo para tus manualidades.", address: "Jr. Tacna 410, San Ramón", logo: "https://images.unsplash.com/photo-1506806732259-39c2d4a78ae7?q=80&w=800&auto=format&fit=crop" },
    { name: "Tienda de Pesca El Anzuelo", category: "Deportes", description: "Equipos de pesca para río y laguna, carnadas y accesorios.", address: "Jr. Ucayali 102, San Ramón", logo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop" },
    { name: "Frutería La Delicia", category: "Alimentos", description: "Frutas de estación y exóticas traídas directamente del campo.", address: "Mercado Central Puesto 45, San Ramón", logo: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop" },
    { name: "Lavandería Burbujas", category: "Servicios", description: "Lavado al seco, por kilo y planchado de prendas delicadas.", address: "Jr. Loreto 218, San Ramón", logo: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=800&auto=format&fit=crop" }
  ];

  const productImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526170315870-ef682c535941?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585314062340-f1a5ad799d00?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=400&auto=format&fit=crop"
  ];

  try {
    for (let i = 0; i < storeData.length; i++) {
      const s = storeData[i];
      console.log(`🏪 Insertando tienda ${i + 1}: ${s.name}`);
      
      const newStore = await db.insert(stores).values({
        owner_id: ownerId,
        name: s.name,
        description: s.description,
        email: `contacto@${s.name.toLowerCase().replace(/\s+/g, '')}.pe`,
        phone: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: s.address,
        city: "San Ramón",
        country: "Perú",
        logo_url: s.logo,
        status: 'approved',
        is_active: true
      }).returning({ id: stores.id });

      const currentStoreId = newStore[0].id;

      console.log(`📦 Insertando 10 productos para ${s.name}...`);
      for (let j = 1; j <= 10; j++) {
        const originalPrice = 10 + Math.random() * 90;
        const discountPercentage = Math.floor(Math.random() * 46) + 5; // 5% a 50%
        const price = originalPrice * (1 - discountPercentage / 100);
        
        const productName = `${s.category} Producto ${j}`;
        const imgUrl = productImages[(i + j) % productImages.length];

        await db.insert(products).values({
          store_id: currentStoreId,
          name: productName,
          description: `Excelente ${productName} de alta calidad, disponible en ${s.name}.`,
          price: price.toFixed(2),
          original_price: originalPrice.toFixed(2),
          discount_percentage: discountPercentage,
          stock: 5 + Math.floor(Math.random() * 45),
          sku: `SKU-${currentStoreId}-${j}-${Math.floor(Math.random() * 1000)}`,
          category: s.category,
          image_url: imgUrl,
          images: [imgUrl],
          is_active: true
        });
      }
    }

    console.log('✅ Se han insertado 30 tiendas y 300 productos exitosamente.');
  } catch (error) {
    console.error('❌ Error durante la carga de datos:', error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
