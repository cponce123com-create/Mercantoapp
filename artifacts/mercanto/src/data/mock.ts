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
    id: 'minimarkets',
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
    badge: 'Recojo en tienda',
    gradient: 'from-slate-700 to-slate-900',
    icon: '🏪'
  },
  {
    id: '2',
    name: 'Frutería San José',
    category: 'Frutas y Verduras',
    badge: 'Recojo en tienda',
    gradient: 'from-emerald-500 to-green-600',
    icon: '🍎'
  },
  {
    id: '3',
    name: 'Pizzería La Bella',
    category: 'Restaurante',
    badge: 'Recojo en tienda',
    gradient: 'from-orange-500 to-red-600',
    icon: '🍕'
  },
  {
    id: '4',
    name: 'Moda Express',
    category: 'Ropa',
    badge: 'Recojo en tienda',
    gradient: 'from-fuchsia-500 to-pink-600',
    icon: '👕'
  },
  {
    id: '5',
    name: 'Farmacia Vida',
    category: 'Salud',
    badge: 'Recojo en tienda',
    gradient: 'from-teal-400 to-teal-600',
    icon: '💊'
  },
  {
    id: '6',
    name: 'Panadería El Horno',
    category: 'Panadería',
    badge: 'Recojo en tienda',
    gradient: 'from-amber-600 to-orange-700',
    icon: '🥐'
  }
];
