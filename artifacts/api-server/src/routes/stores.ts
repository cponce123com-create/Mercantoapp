import { Router } from "express";

const router = Router();

// Logos únicos para cada tienda
const STORE_LOGOS = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561341?w=300&q=80", // Minimarket
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80", // Restaurante
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=300&q=80", // Farmacia
  "https://images.unsplash.com/photo-1578926078328-123456789012?w=300&q=80", // Ferretería
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80", // Ropa
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80", // Tecnología
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80", // Panadería
  "https://images.unsplash.com/photo-1488459716781-6918f33427d7?w=300&q=80", // Frutas
  "https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&q=80", // Librería
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80", // Zapatería
  "https://images.unsplash.com/photo-1576091160550-112173f31c77?w=300&q=80", // Botica
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&q=80", // Café
  "https://images.unsplash.com/photo-1552053831-71594a27c62d?w=300&q=80", // Mascotas
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80", // Electro
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&q=80", // Pizzería
  "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=300&q=80", // Supermercado
  "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=300&q=80", // Deportes
  "https://images.unsplash.com/photo-1585074033192-4ff5ee7c583a?w=300&q=80", // Flores
  "https://images.unsplash.com/photo-1531305535295-c69b0b91c94c?w=300&q=80", // Juguetes
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80"  // Óptica
];

// Imágenes de productos variados
const PRODUCT_IMAGES = {
  ABARROTES: [
    "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400&q=80",
    "https://images.unsplash.com/photo-1585518419759-8f9e5c6b9e1e?w=400&q=80",
    "https://images.unsplash.com/photo-1585518419759-8f9e5c6b9e1e?w=400&q=80"
  ],
  FRUTAS: [
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80",
    "https://images.unsplash.com/photo-1557804506-669714d2e9d8?w=400&q=80",
    "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400&q=80"
  ],
  ROPA: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",
    "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&q=80",
    "https://images.unsplash.com/photo-1506629082632-401017062bd9?w=400&q=80"
  ],
  TECNOLOGIA: [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
  ],
  COMIDA: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"
  ],
  SALUD: [
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=400&q=80",
    "https://images.unsplash.com/photo-1576091160550-112173f31c77?w=400&q=80",
    "https://images.unsplash.com/photo-1631549916768-4c4f7da47eae?w=400&q=80"
  ],
  HOGAR: [
    "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&q=80",
    "https://images.unsplash.com/photo-1578926078328-123456789012?w=400&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"
  ]
};

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

const PRODUCTS_MOCK = [
  // Abarrotes
  { id: 1, name: "Arroz Extra 1kg", description: "Arroz de alta calidad", price: 4.50, stock: 100, sku: "PROD-001", category: "Abarrotes", image_url: PRODUCT_IMAGES.ABARROTES[0], is_active: true, created_at: new Date().toISOString() },
  { id: 2, name: "Aceite Vegetal 1L", description: "Aceite para cocina", price: 8.90, stock: 50, sku: "PROD-002", category: "Abarrotes", image_url: PRODUCT_IMAGES.ABARROTES[1], is_active: true, created_at: new Date().toISOString() },
  { id: 3, name: "Azúcar Blanca 1kg", description: "Azúcar refinada", price: 3.20, stock: 80, sku: "PROD-003", category: "Abarrotes", image_url: PRODUCT_IMAGES.ABARROTES[2], is_active: true, created_at: new Date().toISOString() },
  
  // Frutas
  { id: 4, name: "Plátano de Isla", description: "Fruta fresca de la región", price: 2.00, stock: 200, sku: "PROD-004", category: "Frutas y Verduras", image_url: PRODUCT_IMAGES.FRUTAS[0], is_active: true, created_at: new Date().toISOString() },
  { id: 5, name: "Papaya Selva", description: "Papaya dulce y jugosa", price: 3.50, stock: 30, sku: "PROD-005", category: "Frutas y Verduras", image_url: PRODUCT_IMAGES.FRUTAS[1], is_active: true, created_at: new Date().toISOString() },
  { id: 6, name: "Naranja Fresca", description: "Naranjas recién cosechadas", price: 1.50, stock: 150, sku: "PROD-006", category: "Frutas y Verduras", image_url: PRODUCT_IMAGES.FRUTAS[2], is_active: true, created_at: new Date().toISOString() },
  
  // Ropa
  { id: 7, name: "Polo Algodón", description: "Polo de algodón 100%", price: 25.00, stock: 20, sku: "PROD-007", category: "Ropa", image_url: PRODUCT_IMAGES.ROPA[0], is_active: true, created_at: new Date().toISOString() },
  { id: 8, name: "Pantalón Jeans", description: "Pantalón jeans de calidad", price: 45.00, stock: 15, sku: "PROD-008", category: "Ropa", image_url: PRODUCT_IMAGES.ROPA[1], is_active: true, created_at: new Date().toISOString() },
  { id: 9, name: "Zapatillas Deportivas", description: "Zapatillas cómodas", price: 60.00, stock: 10, sku: "PROD-009", category: "Ropa", image_url: PRODUCT_IMAGES.ROPA[2], is_active: true, created_at: new Date().toISOString() },
  
  // Tecnología
  { id: 10, name: "Cable USB-C", description: "Cable de carga rápida", price: 15.00, stock: 40, sku: "PROD-010", category: "Tecnología", image_url: PRODUCT_IMAGES.TECNOLOGIA[0], is_active: true, created_at: new Date().toISOString() },
  { id: 11, name: "Auriculares Bluetooth", description: "Auriculares inalámbricos", price: 85.00, stock: 25, sku: "PROD-011", category: "Tecnología", image_url: PRODUCT_IMAGES.TECNOLOGIA[1], is_active: true, created_at: new Date().toISOString() },
  { id: 12, name: "Power Bank 20000mAh", description: "Batería portátil", price: 55.00, stock: 18, sku: "PROD-012", category: "Tecnología", image_url: PRODUCT_IMAGES.TECNOLOGIA[2], is_active: true, created_at: new Date().toISOString() },
  
  // Comida
  { id: 13, name: "Arroz con Pollo", description: "Plato típico peruano", price: 18.00, stock: 50, sku: "PROD-013", category: "Comida Típica", image_url: PRODUCT_IMAGES.COMIDA[0], is_active: true, created_at: new Date().toISOString() },
  { id: 14, name: "Ceviche Fresco", description: "Ceviche de pescado", price: 22.00, stock: 30, sku: "PROD-014", category: "Comida Típica", image_url: PRODUCT_IMAGES.COMIDA[1], is_active: true, created_at: new Date().toISOString() },
  { id: 15, name: "Pizza Margherita", description: "Pizza artesanal", price: 25.00, stock: 20, sku: "PROD-015", category: "Comida Típica", image_url: PRODUCT_IMAGES.COMIDA[2], is_active: true, created_at: new Date().toISOString() },
  
  // Salud
  { id: 16, name: "Vitamina C 1000mg", description: "Suplemento vitamínico", price: 18.00, stock: 60, sku: "PROD-016", category: "Salud", image_url: PRODUCT_IMAGES.SALUD[0], is_active: true, created_at: new Date().toISOString() },
  { id: 17, name: "Analgésico Forte", description: "Medicamento para el dolor", price: 12.00, stock: 40, sku: "PROD-017", category: "Salud", image_url: PRODUCT_IMAGES.SALUD[1], is_active: true, created_at: new Date().toISOString() },
  { id: 18, name: "Protector Solar SPF 50", description: "Protección solar", price: 35.00, stock: 25, sku: "PROD-018", category: "Salud", image_url: PRODUCT_IMAGES.SALUD[2], is_active: true, created_at: new Date().toISOString() },
  
  // Hogar
  { id: 19, name: "Escoba de Fibra", description: "Escoba resistente", price: 12.00, stock: 50, sku: "PROD-019", category: "Hogar", image_url: PRODUCT_IMAGES.HOGAR[0], is_active: true, created_at: new Date().toISOString() },
  { id: 20, name: "Destornillador Set", description: "Set de herramientas", price: 28.00, stock: 35, sku: "PROD-020", category: "Hogar", image_url: PRODUCT_IMAGES.HOGAR[1], is_active: true, created_at: new Date().toISOString() },
  { id: 21, name: "Lámpara LED", description: "Lámpara de bajo consumo", price: 32.00, stock: 20, sku: "PROD-021", category: "Hogar", image_url: PRODUCT_IMAGES.HOGAR[2], is_active: true, created_at: new Date().toISOString() }
];

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
  // Devolvemos productos para todas las tiendas para que no se vea vacío
  const products = PRODUCTS_MOCK.map(p => ({ ...p, store_id: storeId }));
  return res.json({
    success: true,
    data: products,
    pagination: { page: 1, limit: 50, total: products.length, pages: 1 },
  });
});

export default router;
