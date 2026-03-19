import { createContext, useContext, useState, ReactNode } from 'react';

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [conflictStore, setConflictStore] = useState<Store | null>(null);
  const [pendingItem, setPendingItem] = useState<{ product: any; store: Store } | null>(null);

  const currentStoreId = items.length > 0 ? items[0].storeId : null;
  const currentStoreName = items.length > 0 ? items[0].storeName : '';

  const addItem = (product: any, store: Store) => {
    if (currentStoreId && currentStoreId !== store.id) {
      setConflictStore(store);
      setPendingItem({ product, store });
      return;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: Math.random().toString(36).substring(7),
            productId: product.id,
            storeId: store.id,
            storeName: store.name,
            name: product.name,
            price: product.price,
            quantity: 1,
            icon: product.icon,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.productId === productId) {
            const newQuantity = item.quantity + delta;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const resolveConflict = (accept: boolean) => {
    if (accept && pendingItem) {
      clearCart();
      // Add pending item on next tick to avoid state mixing
      setTimeout(() => {
        addItem(pendingItem.product, pendingItem.store);
      }, 0);
    }
    setConflictStore(null);
    setPendingItem(null);
  };

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
