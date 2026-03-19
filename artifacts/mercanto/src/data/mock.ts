export const CATEGORIES = [
  { id: 'all', name: 'Todo', icon: '✨', color: 'bg-primary text-white' },
  { id: 'restaurants', name: 'Restaurantes', icon: '🍔', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { id: 'fruits', name: 'Fruterías', icon: '🍎', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { id: 'stores', name: 'Tiendas', icon: '🏪', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { id: 'clothes', name: 'Ropa', icon: '👗', color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
  { id: 'home', name: 'Hogar', icon: '🏠', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { id: 'tech', name: 'Tecnología', icon: '💻', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
  { id: 'pharmacy', name: 'Farmacias', icon: '💊', color: 'bg-teal-100 text-teal-700 hover:bg-teal-200' },
];

export const CATEGORY_CARDS = [
  {
    id: 'restaurants',
    title: 'Restaurantes',
    badge: 'Recojo en tienda',
    gradient: 'from-orange-500 to-red-500',
    icon: '🍔'
  },
  {
    id: 'fruits',
    title: 'Fruterías',
    badge: 'Recojo en tienda',
    gradient: 'from-green-400 to-emerald-600',
    icon: '🥑'
  },
  {
    id: 'stores',
    title: 'Minimarkets',
    badge: 'Recojo en tienda',
    gradient: 'from-blue-400 to-blue-600',
    icon: '🛒'
  },
  {
    id: 'clothes',
    title: 'Ropa y Moda',
    badge: 'Recojo en tienda',
    gradient: 'from-pink-400 to-rose-500',
    icon: '👗'
  }
];

export const FEATURED_STORES = [
  {
    id: '1',
    name: 'Supermercado El Ahorro',
    category: 'Minimarket',
    categoryId: 'stores',
    badge: 'Recojo en tienda',
    gradient: 'from-slate-700 to-slate-900',
    icon: '🏪',
    description: 'Encuentra de todo para tu hogar a los mejores precios.'
  },
  {
    id: '2',
    name: 'Frutería San José',
    category: 'Frutas y Verduras',
    categoryId: 'fruits',
    badge: 'Recojo en tienda',
    gradient: 'from-emerald-500 to-green-600',
    icon: '🍎',
    description: 'Frutas y verduras frescas del campo a tu mesa.'
  },
  {
    id: '3',
    name: 'Pizzería La Bella',
    category: 'Restaurante',
    categoryId: 'restaurants',
    badge: 'Recojo en tienda',
    gradient: 'from-orange-500 to-red-600',
    icon: '🍕',
    description: 'La mejor pizza artesanal de la ciudad.'
  },
  {
    id: '4',
    name: 'Moda Express',
    category: 'Ropa',
    categoryId: 'clothes',
    badge: 'Recojo en tienda',
    gradient: 'from-fuchsia-500 to-pink-600',
    icon: '👕',
    description: 'Moda actual y accesorios para toda la familia.'
  },
  {
    id: '5',
    name: 'Farmacia Vida',
    category: 'Salud',
    categoryId: 'pharmacy',
    badge: 'Recojo en tienda',
    gradient: 'from-teal-400 to-teal-600',
    icon: '💊',
    description: 'Cuidando de tu salud las 24 horas.'
  },
  {
    id: '6',
    name: 'Panadería El Horno',
    category: 'Panadería',
    categoryId: 'restaurants',
    badge: 'Recojo en tienda',
    gradient: 'from-amber-600 to-orange-700',
    icon: '🥐',
    description: 'Pan fresco, postres y pasteles deliciosos.'
  },
  {
    id: '7',
    name: 'TecnoMundo',
    category: 'Tecnología',
    categoryId: 'tech',
    badge: 'Recojo en tienda',
    gradient: 'from-blue-600 to-indigo-800',
    icon: '📱',
    description: 'Gadgets, accesorios y reparaciones.'
  },
  {
    id: '8',
    name: 'Bodega Don Pepe',
    category: 'Tiendas',
    categoryId: 'stores',
    badge: 'Recojo en tienda',
    gradient: 'from-yellow-500 to-amber-600',
    icon: '🏬',
    description: 'Tu bodega de confianza a la vuelta de la esquina.'
  },
  {
    id: '9',
    name: 'Chifa El Dragón',
    category: 'Restaurante',
    categoryId: 'restaurants',
    badge: 'Recojo en tienda',
    gradient: 'from-red-600 to-rose-800',
    icon: '🍜',
    description: 'El mejor sabor oriental.'
  },
  {
    id: '10',
    name: 'DecoHogar',
    category: 'Hogar',
    categoryId: 'home',
    badge: 'Recojo en tienda',
    gradient: 'from-stone-500 to-stone-700',
    icon: '🛋️',
    description: 'Decora tu casa con estilo.'
  },
  {
    id: '11',
    name: 'Frutas El Edén',
    category: 'Frutas y Verduras',
    categoryId: 'fruits',
    badge: 'Recojo en tienda',
    gradient: 'from-lime-400 to-green-600',
    icon: '🍇',
    description: 'Lo mejor y más sano para tu familia.'
  },
  {
    id: '12',
    name: 'Boutique Elegance',
    category: 'Ropa',
    categoryId: 'clothes',
    badge: 'Recojo en tienda',
    gradient: 'from-purple-500 to-violet-700',
    icon: '👗',
    description: 'Vestidos y trajes para ocasiones especiales.'
  }
];

export const PRODUCTS = [
  { id: 'p1', storeId: '1', name: 'Arroz Costeño 5kg', price: 18.50, icon: '🍚', category: 'Abarrotes' },
  { id: 'p2', storeId: '1', name: 'Aceite Primor 1L', price: 9.80, icon: '🛢️', category: 'Abarrotes' },
  { id: 'p3', storeId: '1', name: 'Leche Gloria', price: 4.20, icon: '🥛', category: 'Lácteos' },
  { id: 'p4', storeId: '1', name: 'Huevos Pardos x15', price: 8.50, icon: '🥚', category: 'Lácteos' },
  { id: 'p5', storeId: '1', name: 'Pan Integral Bolsa', price: 6.00, icon: '🍞', category: 'Panadería' },
  { id: 'p6', storeId: '1', name: 'Atún Florida', price: 5.50, icon: '🐟', category: 'Conservas' },
  { id: 'p7', storeId: '1', name: 'Fideos Molitalia', price: 3.20, icon: '🍝', category: 'Abarrotes' },
  { id: 'p8', storeId: '1', name: 'Azúcar Blanca 1kg', price: 4.50, icon: '🧊', category: 'Abarrotes' },

  { id: 'p9', storeId: '2', name: 'Manzana Israel x Kg', price: 5.50, icon: '🍎', category: 'Frutas' },
  { id: 'p10', storeId: '2', name: 'Plátano Seda x Kg', price: 3.50, icon: '🍌', category: 'Frutas' },
  { id: 'p11', storeId: '2', name: 'Papaya x Kg', price: 4.00, icon: '🍈', category: 'Frutas' },
  { id: 'p12', storeId: '2', name: 'Limón x Kg', price: 6.50, icon: '🍋', category: 'Frutas' },
  { id: 'p13', storeId: '2', name: 'Tomate x Kg', price: 4.50, icon: '🍅', category: 'Verduras' },
  { id: 'p14', storeId: '2', name: 'Cebolla x Kg', price: 3.00, icon: '🧅', category: 'Verduras' },
  { id: 'p15', storeId: '2', name: 'Papa Canchan x Kg', price: 2.50, icon: '🥔', category: 'Verduras' },
  { id: 'p16', storeId: '2', name: 'Zanahoria x Kg', price: 2.80, icon: '🥕', category: 'Verduras' },

  { id: 'p17', storeId: '3', name: 'Pizza Americana', price: 25.00, icon: '🍕', category: 'Pizzas' },
  { id: 'p18', storeId: '3', name: 'Pizza Pepperoni', price: 28.00, icon: '🍕', category: 'Pizzas' },
  { id: 'p19', storeId: '3', name: 'Pizza Hawaiana', price: 26.00, icon: '🍕', category: 'Pizzas' },
  { id: 'p20', storeId: '3', name: 'Lasaña de Carne', price: 22.00, icon: '🍝', category: 'Pastas' },
  { id: 'p21', storeId: '3', name: 'Pan al Ajo x4', price: 8.00, icon: '🥖', category: 'Entradas' },
  { id: 'p22', storeId: '3', name: 'Gaseosa 1.5L', price: 9.00, icon: '🥤', category: 'Bebidas' },
  { id: 'p23', storeId: '3', name: 'Ensalada Fresca', price: 15.00, icon: '🥗', category: 'Entradas' },
  { id: 'p24', storeId: '3', name: 'Tiramisú', price: 12.00, icon: '🍰', category: 'Postres' },
];

export const TACORA_ITEMS = [
  { id: 't1', name: 'Laptop ThinkPad T480', price: 850, condition: 'Bueno', seller: 'Juan Pérez', category: 'Electrónicos', icon: '💻' },
  { id: 't2', name: 'Chaqueta de Cuero Vintage', price: 120, condition: 'Muy Bueno', seller: 'María Gómez', category: 'Ropa', icon: '🧥' },
  { id: 't3', name: 'Bicicleta Montañera Aro 26', price: 350, condition: 'Bueno', seller: 'Carlos Ruiz', category: 'Deportes', icon: '🚲' },
  { id: 't4', name: 'Consola PS4 500GB', price: 600, condition: 'Muy Bueno', seller: 'Ana Silva', category: 'Electrónicos', icon: '🎮' },
  { id: 't5', name: 'Libro "Cien Años de Soledad"', price: 25, condition: 'Como Nuevo', seller: 'Luis Torres', category: 'Libros', icon: '📚' },
  { id: 't6', name: 'Zapatillas Nike Air Max', price: 150, condition: 'Bueno', seller: 'Pedro Díaz', category: 'Ropa', icon: '👟' },
  { id: 't7', name: 'Mesa de Noche de Madera', price: 80, condition: 'Bueno', seller: 'Sofía Castro', category: 'Hogar', icon: '🪑' },
  { id: 't8', name: 'Monitor LG 24"', price: 250, condition: 'Muy Bueno', seller: 'Diego Flores', category: 'Electrónicos', icon: '🖥️' },
  { id: 't9', name: 'Set de Ollas Acero Inoxidable', price: 180, condition: 'Como Nuevo', seller: 'Elena Vega', category: 'Hogar', icon: '🥘' },
  { id: 't10', name: 'Guitarra Acústica Yamaha', price: 400, condition: 'Muy Bueno', seller: 'Javier Luna', category: 'Instrumentos', icon: '🎸' },
];
