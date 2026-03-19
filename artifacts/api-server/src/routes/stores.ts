import { Router } from "express";

const router = Router();

// Imágenes de referencia reales para San Ramón y productos
const ASSETS = {
  STORES: [
    "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80",
    "https://images.unsplash.com/photo-1604719312563-882263566042?w=800&q=80"
  ],
  PRODUCTS: {
    FOOD: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
    FRUITS: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80",
    CLOTHES: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80",
    TECH: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80"
  }
};

const STORES = [
  { id: 1, name: "Bodega San Ramón", description: "Minimarket con productos de primera necesidad. Frutas y Verduras frescas.", email: "contacto@bodegasanramon.com", phone: "987654321", address: "Jr. Progreso 123", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[0], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 2, name: "Restaurante El Selva", description: "Comida típica de la selva. Restaurante tradicional.", email: "info@elselva.com", phone: "987654322", address: "Av. Selva Central 456", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[1], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 3, name: "Farmacia Central", description: "Salud y bienestar para tu familia. Medicamentos y cuidado personal.", email: "farmacia@central.com", phone: "987654323", address: "Jr. Comercio 789", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[2], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 4, name: "Ferretería El Martillo", description: "Hogar y construcción. Herramientas y materiales.", email: "ventas@elmartillo.com", phone: "987654324", address: "Av. Los Pioneros 101", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[3], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 5, name: "Moda Chanchamayo", description: "Ropa y accesorios para toda la familia.", email: "moda@chanchamayo.com", phone: "987654325", address: "Jr. Unión 202", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[4], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 6, name: "Tecno Selva", description: "Tecnología y celulares. Servicio técnico especializado.", email: "soporte@tecnoselva.com", phone: "987654326", address: "Av. Rivera 303", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[0], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 7, name: "Panadería El Trigal", description: "Pan caliente y pastelería fina. Desayunos.", email: "pan@eltrigal.com", phone: "987654327", address: "Jr. Libertad 404", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[1], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 8, name: "Frutería Tropical", description: "Frutas y Verduras directo del campo. Productos orgánicos.", email: "campo@tropical.com", phone: "987654328", address: "Mercado Central Puesto 15", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[2], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 9, name: "Librería San Ramón", description: "Útiles escolares y oficina. Copias e impresiones.", email: "libros@sanramon.com", phone: "987654329", address: "Jr. Ayacucho 505", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[3], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 10, name: "Zapatería El Paso", description: "Calzado para niños y adultos. Ropa deportiva.", email: "calzado@elpaso.com", phone: "987654330", address: "Av. Bolognesi 606", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[4], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 11, name: "Botica La Merced", description: "Salud al alcance de todos. Farmacia 24 horas.", email: "botica@lamerced.com", phone: "987654331", address: "Jr. Tarma 707", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[0], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 12, name: "Café Selva Central", description: "El mejor café de la región. Restaurante y cafetería.", email: "cafe@selvacentral.com", phone: "987654332", address: "Plaza de Armas 10", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[1], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 13, name: "Mascotas Felices", description: "Hogar y cuidado para tus mascotas. Alimentos y accesorios.", email: "pet@felices.com", phone: "987654333", address: "Av. Ejército 808", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[2], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 14, name: "Electro Hogar", description: "Tecnología y electrodomésticos para el hogar.", email: "electro@hogar.com", phone: "987654334", address: "Jr. Junín 909", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[3], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 15, name: "Pizzería Italia", description: "Pizzas artesanales y pastas. Restaurante italiano.", email: "pizza@italia.com", phone: "987654335", address: "Av. Principal 1010", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[4], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 16, name: "Supermercado El Sol", description: "Minimarket completo. Todo para tu hogar.", email: "elsol@super.com", phone: "987654336", address: "Jr. Ica 1111", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[0], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 17, name: "Deportes Extremos", description: "Ropa y equipo para aventura. Turismo.", email: "adventure@selva.com", phone: "987654337", address: "Av. Circunvalación 1212", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[1], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 18, name: "Florería El Jardín", description: "Arreglos florales y plantas para el Hogar.", email: "flores@eljardin.com", phone: "987654338", address: "Jr. Puno 1313", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[2], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 19, name: "Juguetería Diversión", description: "Juguetes y regalos. Tecnología para niños.", email: "juguetes@fun.com", phone: "987654339", address: "Av. Grau 1414", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[3], status: "approved", is_active: true, created_at: new Date().toISOString() },
  { id: 20, name: "Óptica Visión", description: "Salud visual. Lentes y monturas.", email: "vision@optica.com", phone: "987654340", address: "Jr. Huancayo 1515", city: "San Ramón, Chanchamayo", country: "Perú", logo_url: ASSETS.STORES[4], status: "approved", is_active: true, created_at: new Date().toISOString() }
];

const PRODUCTS_MOCK = [
  { id: 1, name: "Arroz Extra 1kg", description: "Arroz de alta calidad", price: 4.50, stock: 100, sku: "PROD-001", category: "Abarrotes", image_url: ASSETS.PRODUCTS.FOOD, is_active: true, created_at: new Date().toISOString() },
  { id: 2, name: "Aceite Vegetal 1L", description: "Aceite para cocina", price: 8.90, stock: 50, sku: "PROD-002", category: "Abarrotes", image_url: ASSETS.PRODUCTS.FOOD, is_active: true, created_at: new Date().toISOString() },
  { id: 3, name: "Plátano de Isla", description: "Fruta fresca de la región", price: 2.00, stock: 200, sku: "PROD-003", category: "Frutas", image_url: ASSETS.PRODUCTS.FRUITS, is_active: true, created_at: new Date().toISOString() },
  { id: 4, name: "Papaya Selva", description: "Papaya dulce y jugosa", price: 3.50, stock: 30, sku: "PROD-004", category: "Frutas", image_url: ASSETS.PRODUCTS.FRUITS, is_active: true, created_at: new Date().toISOString() },
  { id: 5, name: "Polo Algodón", description: "Polo de algodón 100%", price: 25.00, stock: 20, sku: "PROD-005", category: "Ropa", image_url: ASSETS.PRODUCTS.CLOTHES, is_active: true, created_at: new Date().toISOString() },
  { id: 6, name: "Cable USB-C", description: "Cable de carga rápida", price: 15.00, stock: 40, sku: "PROD-006", category: "Tecnología", image_url: ASSETS.PRODUCTS.TECH, is_active: true, created_at: new Date().toISOString() }
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
