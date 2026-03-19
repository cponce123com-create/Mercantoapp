import { Router } from "express";

const router = Router();

const PRODUCTS: Record<number, any[]> = {
  1: [
    { id: 1, store_id: 1, name: "Pollo a la Brasa (1/4)", description: "Con papas y ensalada", price: 18.90, stock: 50, sku: "POLL-001", category: "Pollos", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 2, store_id: 1, name: "Pollo a la Brasa (1/2)", description: "Con papas y ensalada", price: 32.00, stock: 50, sku: "POLL-002", category: "Pollos", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 3, store_id: 1, name: "Pollo Entero", description: "Con papas y ensalada", price: 58.00, stock: 30, sku: "POLL-003", category: "Pollos", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 4, store_id: 1, name: "Anticuchos", description: "Porción de 5 unidades", price: 12.00, stock: 40, sku: "ANTI-001", category: "Parrilla", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  2: [
    { id: 5, store_id: 2, name: "Manzanas (kg)", description: "Manzanas frescas importadas", price: 5.50, stock: 100, sku: "FRUT-001", category: "Frutas", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 6, store_id: 2, name: "Plátanos (racimo)", description: "Plátanos de isla", price: 4.00, stock: 80, sku: "FRUT-002", category: "Frutas", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 7, store_id: 2, name: "Tomates (kg)", description: "Tomates frescos", price: 3.50, stock: 120, sku: "VERD-001", category: "Verduras", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 8, store_id: 2, name: "Palta (unidad)", description: "Palta hass madura", price: 2.50, stock: 60, sku: "FRUT-003", category: "Frutas", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  3: [
    { id: 9, store_id: 3, name: "Arroz Costeño 5kg", description: "Arroz extra", price: 22.00, stock: 200, sku: "ABAR-001", category: "Abarrotes", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 10, store_id: 3, name: "Aceite Primor 1L", description: "Aceite vegetal", price: 8.50, stock: 150, sku: "ABAR-002", category: "Abarrotes", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 11, store_id: 3, name: "Coca Cola 3L", description: "Gaseosa", price: 9.00, stock: 100, sku: "BEB-001", category: "Bebidas", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 12, store_id: 3, name: "Leche Gloria 1L", description: "Leche entera", price: 4.50, stock: 180, sku: "LACT-001", category: "Lácteos", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  4: [
    { id: 13, store_id: 4, name: "Vestido Floral", description: "Talla S/M/L", price: 89.00, stock: 20, sku: "ROPA-001", category: "Vestidos", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 14, store_id: 4, name: "Blusa Casual", description: "Talla S/M/L/XL", price: 45.00, stock: 30, sku: "ROPA-002", category: "Blusas", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 15, store_id: 4, name: "Jean Skinny", description: "Talla 28-34", price: 120.00, stock: 25, sku: "ROPA-003", category: "Pantalones", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  5: [
    { id: 16, store_id: 5, name: "Audífonos Bluetooth", description: "Con cancelación de ruido", price: 150.00, stock: 15, sku: "TECH-001", category: "Audio", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 17, store_id: 5, name: "Cargador USB-C 65W", description: "Carga rápida", price: 35.00, stock: 40, sku: "TECH-002", category: "Accesorios", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 18, store_id: 5, name: "Case iPhone 15", description: "Protección total", price: 25.00, stock: 50, sku: "TECH-003", category: "Accesorios", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  6: [
    { id: 19, store_id: 6, name: "Paracetamol 500mg", description: "Caja x 20 tabletas", price: 8.50, stock: 200, sku: "MED-001", category: "Medicamentos", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 20, store_id: 6, name: "Vitamina C 1000mg", description: "Frasco x 30 tabletas", price: 25.00, stock: 100, sku: "MED-002", category: "Vitaminas", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 21, store_id: 6, name: "Alcohol 70% 1L", description: "Antiséptico", price: 12.00, stock: 80, sku: "MED-003", category: "Higiene", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  7: [
    { id: 22, store_id: 7, name: "Lomo Saltado", description: "Con arroz y papas fritas", price: 22.00, stock: 30, sku: "CRIO-001", category: "Platos de fondo", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 23, store_id: 7, name: "Ceviche", description: "Con leche de tigre y choclo", price: 28.00, stock: 20, sku: "CRIO-002", category: "Entradas", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 24, store_id: 7, name: "Ají de Gallina", description: "Con arroz y papa", price: 18.00, stock: 25, sku: "CRIO-003", category: "Platos de fondo", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
  8: [
    { id: 25, store_id: 8, name: "Cojín Decorativo", description: "40x40cm varios colores", price: 35.00, stock: 40, sku: "DECO-001", category: "Decoración", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 26, store_id: 8, name: "Lámpara de Mesa LED", description: "Moderna y eficiente", price: 89.00, stock: 20, sku: "DECO-002", category: "Iluminación", image_url: null, is_active: true, created_at: new Date().toISOString() },
    { id: 27, store_id: 8, name: "Cuadro Abstracto", description: "40x60cm", price: 120.00, stock: 15, sku: "DECO-003", category: "Arte", image_url: null, is_active: true, created_at: new Date().toISOString() },
  ],
};

// GET /api/products/store/:storeId
router.get("/store/:storeId", (req, res) => {
  const storeId = parseInt(req.params.storeId);
  const products = PRODUCTS[storeId] || [];
  return res.json({
    success: true,
    data: products,
    pagination: { page: 1, limit: 50, total: products.length, pages: 1 },
  });
});

export default router;
