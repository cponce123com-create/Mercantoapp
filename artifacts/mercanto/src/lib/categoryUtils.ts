/**
 * Utilidad centralizada para el mapeo y filtrado de categorías
 * Asegura consistencia entre Home, Tiendas y Mapa
 */

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'restaurants': ['Restaurante', 'Comida', 'Pizzería', 'Café', 'Parrillada', 'Chifa'],
  'fruits': ['Frutas y Verduras', 'Frutería', 'Frutas', 'Verduras', 'Orgánicos'],
  'stores': ['Minimarket', 'Supermercado', 'Bodega', 'Tienda'],
  'clothes': ['Ropa', 'Moda', 'Zapatería', 'Deportes', 'Calzado'],
  'home': ['Hogar', 'Ferretería', 'Muebles', 'Decoración', 'Herramientas', 'Flores', 'Plantas'],
  'tech': ['Tecnología', 'Electro', 'Celulares', 'Laptops', 'Electrónica'],
  'pharmacy': ['Salud', 'Farmacia', 'Botica', 'Medicamentos']
};

/**
 * Determina la categoría de una tienda basándose en su descripción
 * @param description - Descripción de la tienda
 * @returns ID de categoría o 'all' si no coincide
 */
export const getStoreCategory = (description: string): string => {
  if (!description) return 'all';
  
  const descLower = description.toLowerCase();
  
  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => descLower.includes(keyword.toLowerCase()))) {
      return categoryId;
    }
  }
  
  return 'all';
};

/**
 * Filtra tiendas por categoría seleccionada
 * @param stores - Array de tiendas
 * @param selectedCategory - ID de categoría seleccionada
 * @returns Tiendas filtradas
 */
export const filterStoresByCategory = (stores: any[], selectedCategory: string): any[] => {
  if (selectedCategory === 'all') return stores;
  
  return stores.filter(store => {
    const storeCategory = getStoreCategory(store.description || '');
    return storeCategory === selectedCategory;
  });
};

/**
 * Filtra tiendas por búsqueda y categoría
 * @param stores - Array de tiendas
 * @param searchQuery - Texto de búsqueda
 * @param selectedCategory - ID de categoría
 * @returns Tiendas filtradas
 */
export const filterStores = (stores: any[], searchQuery: string, selectedCategory: string): any[] => {
  let filtered = stores;
  
  // Filtrar por búsqueda
  if (searchQuery.trim()) {
    const queryLower = searchQuery.toLowerCase();
    filtered = filtered.filter(store =>
      store.name.toLowerCase().includes(queryLower) ||
      (store.description || '').toLowerCase().includes(queryLower)
    );
  }
  
  // Filtrar por categoría
  filtered = filterStoresByCategory(filtered, selectedCategory);
  
  return filtered;
};
