import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export type CartItem = {
  id: string;
  productId: string;
  storeId: string;
  storeName: string;
  name: string;
  price: number;
  quantity: number;
  icon: string;
};

type Store = {
  id: string;
  name: string;
};

type CartContextType = {
  items: CartItem[];
  currentStoreId: string | null;
  addItem: (product: any, store: Store) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  conflictStore: Store | null;
  resolveConflict: (accept: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mercanto_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  // Inicializar estado desde localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [conflictStore, setConflictStore] = useState<Store | null>(null);
  const [pendingItem, setPendingItem] = useState<{ product: any; store: Store } | null>(null);

  // Persistir cambios en localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const currentStoreId = items.length > 0 ? items[0].storeId : null;
  const currentStoreName = items.length > 0 ? items[0].storeName : '';

  const addItem = useCallback((product: any, store: Store) => {
    const productId = product.id.toString();
    const storeId = store.id.toString();

    setItems((prevItems) => {
      // Validación de tienda única
      const activeStoreId = prevItems.length > 0 ? prevItems[0].storeId : null;
      
      if (activeStoreId && activeStoreId !== storeId) {
        setConflictStore(store);
        setPendingItem({ product, store });
        return prevItems;
      }

      const existingItem = prevItems.find((item) => item.productId === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prevItems,
          {
            // ID estable basado en store y product para evitar duplicados accidentales
            id: `${storeId}-${productId}`,
            productId: productId,
            storeId: storeId,
            storeName: store.name,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            icon: product.icon || '📦',
          },
        ];
      }
    });
    
    // Solo abrir el carrito si no hay conflicto
    const activeStoreId = items.length > 0 ? items[0].storeId : null;
    if (!activeStoreId || activeStoreId === storeId) {
      setIsCartOpen(true);
    }
  }, [items]);

  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId.toString()));
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    const pId = productId.toString();
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.productId === pId) {
            const newQuantity = item.quantity + delta;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const resolveConflict = useCallback((accept: boolean) => {
    if (accept && pendingItem) {
      const { product, store } = pendingItem;
      const productId = product.id.toString();
      const storeId = store.id.toString();

      // Reemplazar el carrito directamente con el nuevo item
      // Esto evita el uso de setTimeout al manejar la lógica en un solo paso
      setItems([
        {
          id: `${storeId}-${productId}`,
          productId: productId,
          storeId: storeId,
          storeName: store.name,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
          icon: product.icon || '📦',
        }
      ]);
      setIsCartOpen(true);
    }
    setConflictStore(null);
    setPendingItem(null);
  }, [pendingItem]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        currentStoreId,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        conflictStore,
        resolveConflict,
      }}
    >
      {children}
      {/* Conflict Modal */}
      {conflictStore && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4">¿Vaciar carrito?</h3>
            <p className="text-muted-foreground mb-6">
              Tu carrito tiene productos de <span className="font-bold text-foreground">{currentStoreName}</span>. 
              ¿Deseas vaciar el carrito y añadir de <span className="font-bold text-foreground">{conflictStore.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => resolveConflict(false)}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => resolveConflict(true)}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-colors"
              >
                Vaciar y añadir
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
