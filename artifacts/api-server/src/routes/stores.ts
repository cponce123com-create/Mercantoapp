import { Router } from "express";

const router = Router();

const STORES = [
  {
    id: 1,
    owner_id: 1,
    name: "Pollería El Gordito",
    description: "Restaurante de pollos a la brasa y parrillas. El mejor pollo del distrito.",
    email: "gordito@mercanto.pe",
    phone: "987001001",
    address: "Av. Principal 123",
    city: "San Ramón, Chanchamayo, Junín",
    country: "PE",
    logo_url: null,
    is_active: true,
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    owner_id: 2,
    name: "Frutería Doña Rosa",
    description: "Frutas y Verduras frescas del mercado. Delivery disponible.",
    email: "rosa@mercanto.pe",
    phone: "987001002",
    address: "Jr. Los Olivos 456",
    city: "San Ramón, Chanchamayo, Junín",
    country: "PE",
    logo_url: null,
    is_active: true,
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    owner_id: 3,
    name: "Minimarket San José",
    description: "Minimarket con abarrotes, bebidas y productos de primera necesidad.",
    email: "sanjose@mercanto.pe",
    phone: "987001003",
    address: "Calle Las Flores 789",
    city: "San Ramón, Chanchamayo, Junín",
    country: "PE",
    logo_url: null,
    is_active: true,
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    owner_id: 4,
    name: "Boutique Luna",
    description: "Ropa y Moda femenina. Últimas tendencias a precios accesibles.",
    email: "luna@mercanto.pe",
    phone: "987001004",
    address: "Av. Moda 321",
    city: "San Ramón, Chanchamayo, Junín",
    country: "PE",
    logo_url: null,
    is_active: true,
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    owner_id: 5,
    name: "TechStore Lima",
    description: "Tecnología, accesorios y gadgets. Reparación de celulares y laptops.",
    email: "tech@mercanto.pe",
    phone: "987001005",
    address: "Av. Digital 654",
    city: "San Ramón, Chanchamayo, Junín",
    country: "PE",
    logo_url: null,
    is_active: true,
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    owner_id: 6,
    name: "Farmacia Salud Total",
    description: "Salud y medicamentos. Atención 24 horas. Productos naturales y vitaminas.",
    email: "salud@mercanto.pe",
    phone: "987001006",
    address: "Calle Bienestar 987",
    city: "San Ramón, Chanchamayo, Junín",
    country: "PE",
    logo_url: null,
    is_active: true,
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    owner_id: 7,
    name: "Restaurante Sabor Criollo",
    description: "Restaurante con los mejores platos de la cocina peruana. Menú diario.",
    email: "criollo@mercanto.pe",
    phone: "987001007",
    address: "Jr. Tradición 147",
    city: "San Ramón, Chanchamayo, Junín",
    country: "PE",
    logo_url: null,
    is_active: true,
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    owner_id: 8,
    name: "Hogar & Deco",
    description: "Hogar, muebles y decoración para tu casa. Productos únicos y modernos.",
    email: "hogar@mercanto.pe",
    phone: "987001008",
    address: "Av. Decoración 258",
    city: "San Ramón, Chanchamayo, Junín",
    country: "PE",
    logo_url: null,
    is_active: true,
    status: "approved",
    created_at: new Date().toISOString(),
  },
];

const PRODUCTS: Record<number, any[]> = {
  1: [
    { id: 1, store_id: 1, name: "Pollo a la Brasa (1/4)", description: "Con papas y ensalada", price: 18.90, stock: 50, sku: "POLL-001", category: "Restaurante", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 2, store_id: 1, name: "Pollo a la Brasa (1/2)", description: "Con papas y ensalada", price: 32.00, stock: 50, sku: "POLL-002", category: "Restaurante", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 3, store_id: 1, name: "Pollo Entero", description: "Con papas y ensalada", price: 58.00, stock: 30, sku: "POLL-003", category: "Restaurante", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 4, store_id: 1, name: "Anticuchos", description: "Porción de 5 unidades", price: 12.00, stock: 40, sku: "ANTI-001", category: "Restaurante", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  2: [
    { id: 5, store_id: 2, name: "Manzanas (kg)", description: "Manzanas frescas importadas", price: 5.50, stock: 100, sku: "FRUT-001", category: "Frutas y Verduras", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 6, store_id: 2, name: "Plátanos (racimo)", description: "Plátanos de isla", price: 4.00, stock: 80, sku: "FRUT-002", category: "Frutas y Verduras", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 7, store_id: 2, name: "Tomates (kg)", description: "Tomates frescos", price: 3.50, stock: 120, sku: "VERD-001", category: "Frutas y Verduras", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 8, store_id: 2, name: "Palta (unidad)", description: "Palta hass madura", price: 2.50, stock: 60, sku: "FRUT-003", category: "Frutas y Verduras", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  3: [
    { id: 9, store_id: 3, name: "Arroz Costeño 5kg", description: "Arroz extra", price: 22.00, stock: 200, sku: "ABAR-001", category: "Minimarket", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 10, store_id: 3, name: "Aceite Primor 1L", description: "Aceite vegetal", price: 8.50, stock: 150, sku: "ABAR-002", category: "Minimarket", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 11, store_id: 3, name: "Coca Cola 3L", description: "Gaseosa", price: 9.00, stock: 100, sku: "BEB-001", category: "Minimarket", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 12, store_id: 3, name: "Leche Gloria 1L", description: "Leche entera", price: 4.50, stock: 180, sku: "LACT-001", category: "Minimarket", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  4: [
    { id: 13, store_id: 4, name: "Vestido Floral", description: "Talla S/M/L", price: 89.00, stock: 20, sku: "ROPA-001", category: "Ropa", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 14, store_id: 4, name: "Blusa Casual", description: "Talla S/M/L/XL", price: 45.00, stock: 30, sku: "ROPA-002", category: "Ropa", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 15, store_id: 4, name: "Jean Skinny", description: "Talla 28-34", price: 120.00, stock: 25, sku: "ROPA-003", category: "Ropa", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  5: [
    { id: 16, store_id: 5, name: "Audífonos Bluetooth", description: "Con cancelación de ruido", price: 150.00, stock: 15, sku: "TECH-001", category: "Tecnología", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 17, store_id: 5, name: "Cargador USB-C", description: "65W carga rápida", price: 35.00, stock: 40, sku: "TECH-002", category: "Tecnología", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 18, store_id: 5, name: "Case iPhone 15", description: "Protección total", price: 25.00, stock: 50, sku: "TECH-003", category: "Tecnología", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  6: [
    { id: 19, store_id: 6, name: "Paracetamol 500mg", description: "Caja x 20 tabletas", price: 8.50, stock: 200, sku: "MED-001", category: "Salud", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 20, store_id: 6, name: "Vitamina C 1000mg", description: "Frasco x 30 tabletas", price: 25.00, stock: 100, sku: "MED-002", category: "Salud", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 21, store_id: 6, name: "Alcohol 70% 1L", description: "Antiséptico", price: 12.00, stock: 80, sku: "MED-003", category: "Salud", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  7: [
    { id: 22, store_id: 7, name: "Lomo Saltado", description: "Con arroz y papas fritas", price: 22.00, stock: 30, sku: "CRIO-001", category: "Restaurante", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 23, store_id: 7, name: "Ceviche", description: "Con leche de tigre y choclo", price: 28.00, stock: 20, sku: "CRIO-002", category: "Restaurante", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 24, store_id: 7, name: "Aji de Gallina", description: "Con arroz y papa", price: 18.00, stock: 25, sku: "CRIO-003", category: "Restaurante", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  8: [
    { id: 25, store_id: 8, name: "Cojín Decorativo", description: "40x40cm varios colores", price: 35.00, stock: 40, sku: "DECO-001", category: "Hogar", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 26, store_id: 8, name: "Lámpara de Mesa", description: "LED moderna", price: 89.00, stock: 20, sku: "DECO-002", category: "Hogar", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 27, store_id: 8, name: "Cuadro Abstracto", description: "40x60cm", price: 120.00, stock: 15, sku: "DECO-003", category: "Hogar", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
};

// GET /api/stores
router.get("/", (req, res) => {
  const { status, is_active, limit = 10, page = 1 } = req.query;

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
  const products = PRODUCTS[storeId] || [];
  return res.json({
    success: true,
    data: products,
    pagination: { page: 1, limit: 50, total: products.length, pages: 1 },
  });
});

export default router;
