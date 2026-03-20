import { Router } from "express";

const router = Router();

// Logos únicos para cada tienda
const STORE_LOGOS = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561341?w=300&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80",
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=300&q=80",
  "https://images.unsplash.com/photo-1578926078328-123456789012?w=300&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80",
  "https://images.unsplash.com/photo-1488459716781-6918f33427d7?w=300&q=80",
  "https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
  "https://images.unsplash.com/photo-1576091160550-112173f31c77?w=300&q=80",
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&q=80",
  "https://images.unsplash.com/photo-1552053831-71594a27c62d?w=300&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80",
  "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=300&q=80",
  "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=300&q=80",
  "https://images.unsplash.com/photo-1585074033192-4ff5ee7c583a?w=300&q=80",
  "https://images.unsplash.com/photo-1531305535295-c69b0b91c94c?w=300&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80"
];

const STORES = [
  { id: 1, name: "Bodega San Ramón", description: "Minimarket con productos de primera necesidad. Frutas y Verduras frescas.", email: "contacto@bodegasanramon.com", phone: "987654321", address: "Jr. Progreso 123", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[0], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 2, name: "Restaurante El Selva", description: "Comida típica de la selva. Restaurante tradicional.", email: "info@elselva.com", phone: "987654322", address: "Av. Selva Central 456", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[1], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 3, name: "Farmacia Central", description: "Salud y bienestar para tu familia. Medicamentos y cuidado personal.", email: "farmacia@central.com", phone: "987654323", address: "Jr. Comercio 789", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[2], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 4, name: "Ferretería El Martillo", description: "Hogar y construcción. Herramientas y materiales.", email: "ventas@elmartillo.com", phone: "987654324", address: "Av. Los Pioneros 101", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[3], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 5, name: "Moda Chanchamayo", description: "Ropa y accesorios para toda la familia.", email: "moda@chanchamayo.com", phone: "987654325", address: "Jr. Unión 202", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[4], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 6, name: "Tecno Selva", description: "Tecnología y celulares. Servicio técnico especializado.", email: "soporte@tecnoselva.com", phone: "987654326", address: "Av. Rivera 303", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[5], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 7, name: "Panadería El Trigal", description: "Pan caliente y pastelería fina. Desayunos.", email: "pan@eltrigal.com", phone: "987654327", address: "Jr. Libertad 404", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[6], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 8, name: "Frutería Tropical", description: "Frutas y Verduras directo del campo. Productos orgánicos.", email: "campo@tropical.com", phone: "987654328", address: "Mercado Central Puesto 15", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[7], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 9, name: "Librería San Ramón", description: "Útiles escolares y oficina. Copias e impresiones.", email: "libros@sanramon.com", phone: "987654329", address: "Jr. Ayacucho 505", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[8], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 10, name: "Zapatería El Paso", description: "Calzado para niños y adultos. Ropa deportiva.", email: "calzado@elpaso.com", phone: "987654330", address: "Av. Bolognesi 606", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[9], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 11, name: "Botica La Merced", description: "Salud al alcance de todos. Farmacia 24 horas.", email: "botica@lamerced.com", phone: "987654331", address: "Jr. Tarma 707", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[10], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 12, name: "Café Selva Central", description: "El mejor café de la región. Restaurante y cafetería.", email: "cafe@selvacentral.com", phone: "987654332", address: "Plaza de Armas 10", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[11], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 13, name: "Mascotas Felices", description: "Hogar y cuidado para tus mascotas. Alimentos y accesorios.", email: "pet@felices.com", phone: "987654333", address: "Av. Ejército 808", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[12], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 14, name: "Electro Hogar", description: "Tecnología y electrodomésticos para el hogar.", email: "electro@hogar.com", phone: "987654334", address: "Jr. Junín 909", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[13], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 15, name: "Pizzería Italia", description: "Pizzas artesanales y pastas. Restaurante italiano.", email: "pizza@italia.com", phone: "987654335", address: "Av. Principal 1010", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[14], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 16, name: "Supermercado El Sol", description: "Minimarket completo. Todo para tu hogar.", email: "elsol@super.com", phone: "987654336", address: "Jr. Ica 1111", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[15], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 17, name: "Deportes Extremos", description: "Ropa y equipo para aventura. Turismo.", email: "adventure@selva.com", phone: "987654337", address: "Av. Circunvalación 1212", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[16], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 18, name: "Florería El Jardín", description: "Arreglos florales y plantas para el Hogar.", email: "flores@eljardin.com", phone: "987654338", address: "Jr. Puno 1313", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[17], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 19, name: "Juguetería Diversión", description: "Juguetes y regalos. Tecnología para niños.", email: "juguetes@fun.com", phone: "987654339", address: "Av. Grau 1414", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[18], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 20, name: "Óptica Visión", description: "Salud visual. Lentes y monturas.", email: "vision@optica.com", phone: "987654340", address: "Jr. Huancayo 1515", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: STORE_LOGOS[19], status: "approved", is_active: true, created_at: new Date().toISOString() }
];

// Generar 10 productos detallados por tienda
const generateProductsForStore = (storeId: number, storeName: string) => {
  const products = [];
  const categories = ["Abarrotes", "Frutas y Verduras", "Ropa", "Tecnología", "Comida Típica", "Salud", "Hogar", "Deportes"];
  
  const productTemplates = [
    {
      name: "Arroz Premium 1kg",
      category: "Abarrotes",
      description: "Arroz de alta calidad, grano largo y blanco. Perfecto para cualquier comida.",
      price: 5.50,
      discount: 10,
      images: [
        "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500&q=80",
        "https://images.unsplash.com/photo-1585518419759-8f9e5c6b9e1e?w=500&q=80"
      ]
    },
    {
      name: "Aceite Vegetal 1L",
      category: "Abarrotes",
      description: "Aceite refinado para cocina, ideal para frituras y salsas.",
      price: 9.90,
      discount: 15,
      images: [
        "https://images.unsplash.com/photo-1585518419759-8f9e5c6b9e1e?w=500&q=80",
        "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500&q=80"
      ]
    },
    {
      name: "Azúcar Blanca 1kg",
      category: "Abarrotes",
      description: "Azúcar refinada de excelente calidad para endulzar tus bebidas.",
      price: 3.50,
      discount: 5,
      images: [
        "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500&q=80"
      ]
    },
    {
      name: "Plátano de Isla",
      category: "Frutas y Verduras",
      description: "Fruta fresca de la región, rica en potasio y vitaminas.",
      price: 2.50,
      discount: 0,
      images: [
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80",
        "https://images.unsplash.com/photo-1557804506-669714d2e9d8?w=500&q=80"
      ]
    },
    {
      name: "Papaya Selva",
      category: "Frutas y Verduras",
      description: "Papaya dulce y jugosa, recién cosechada del campo.",
      price: 4.00,
      discount: 20,
      images: [
        "https://images.unsplash.com/photo-1557804506-669714d2e9d8?w=500&q=80",
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80"
      ]
    },
    {
      name: "Naranja Fresca",
      category: "Frutas y Verduras",
      description: "Naranjas recién cosechadas, llenas de vitamina C.",
      price: 2.00,
      discount: 10,
      images: [
        "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500&q=80"
      ]
    },
    {
      name: "Polo Algodón Premium",
      category: "Ropa",
      description: "Polo de algodón 100%, cómodo y duradero para el día a día.",
      price: 35.00,
      discount: 25,
      images: [
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&q=80"
      ]
    },
    {
      name: "Pantalón Jeans Clásico",
      category: "Ropa",
      description: "Pantalón jeans de calidad, perfecto para cualquier ocasión.",
      price: 65.00,
      discount: 30,
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&q=80",
        "https://images.unsplash.com/photo-1506629082632-401017062bd9?w=500&q=80"
      ]
    },
    {
      name: "Zapatillas Deportivas",
      category: "Ropa",
      description: "Zapatillas cómodas y modernas para deportes y uso casual.",
      price: 85.00,
      discount: 35,
      images: [
        "https://images.unsplash.com/photo-1506629082632-401017062bd9?w=500&q=80",
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80"
      ]
    },
    {
      name: "Cable USB-C Rápido",
      category: "Tecnología",
      description: "Cable de carga rápida, compatible con múltiples dispositivos.",
      price: 20.00,
      discount: 15,
      images: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
      ]
    }
  ];

  // Crear 10 productos por tienda
  for (let i = 0; i < 10; i++) {
    const template = productTemplates[i % productTemplates.length];
    products.push({
      id: storeId * 1000 + i + 1,
      store_id: storeId,
      name: `${template.name} (${storeName})`,
      description: template.description,
      price: template.price + (i * 0.5),
      original_price: template.price + (i * 0.5),
      discount_percentage: template.discount,
      discount_price: Math.round(((template.price + (i * 0.5)) * (100 - template.discount)) / 100 * 100) / 100,
      stock: Math.floor(Math.random() * 100) + 10,
      sku: `SKU-${storeId}-${i + 1}`,
      category: template.category,
      image_url: template.images[0],
      images: template.images,
      is_active: true,
      created_at: new Date().toISOString()
    });
  }

  return products;
};

// Generar todos los productos
const ALL_PRODUCTS: any[] = [];
STORES.forEach(store => {
  ALL_PRODUCTS.push(...generateProductsForStore(store.id, store.name));
});

// GET /api/stores
router.get("/", (req, res) => {
  const { status, is_active, limit = 20, page = 1 } = req.query;

  let filtered = STORES.filter(s => {
    if (status && s.status !== status) return false;
    if (is_active !== undefined && s.is_active !== (is_active === "true")) return false;
    return true;
  });

  const total = filtered.length;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return res.json({
    success: true,
    data: paginated,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// GET /api/stores/:id
router.get("/:id", (req, res) => {
  const store = STORES.find(s => s.id === parseInt(req.params.id));
  if (!store) return res.status(404).json({ success: false, error: "Tienda no encontrada" });
  return res.json({ success: true, data: store });
});

// GET /api/stores/:id/products
router.get("/:id/products", (req, res) => {
  const storeId = parseInt(req.params.id);
  const products = ALL_PRODUCTS.filter(p => p.store_id === storeId);
  
  return res.json({
    success: true,
    data: products,
    pagination: { page: 1, limit: 100, total: products.length, pages: 1 },
  });
});

export default router;
