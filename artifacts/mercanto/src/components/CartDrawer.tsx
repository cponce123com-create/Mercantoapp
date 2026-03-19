import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/CartContext";
import { useEffect, useRef } from "react";

export function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, total } = useCart();
  const [, setLocation] = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div 
        ref={drawerRef}
        className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto z-[95] w-full h-[90vh] sm:h-full sm:w-[400px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out rounded-t-[2.5rem] sm:rounded-none"
        style={{ transform: isCartOpen ? 'translateY(0)' : 'translateY(100%)' }}
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>

        <div className="flex items-center justify-between p-6 pt-2 sm:pt-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <ShoppingBag size={20} />
            </div>
            <h2 className="text-xl font-bold font-display">Tu Carrito</h2>
          </div>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                <ShoppingBag size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-foreground">Tu carrito está vacío</h3>
              <p className="text-muted-foreground">
                ¿No sabes qué comprar? Miles de productos te esperan.
              </p>
              <button 
                onClick={closeCart}
                className="mt-4 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Empezar a comprar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-muted/50 p-3 rounded-xl inline-block w-full text-center">
                <span className="text-sm font-medium text-muted-foreground">Comprando en: </span>
                <span className="text-sm font-bold text-foreground">{items[0].storeName}</span>
              </div>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white border border-border rounded-2xl shadow-sm">
                    <div className="w-16 h-16 bg-muted/30 rounded-xl flex items-center justify-center text-3xl shrink-0">
                      {item.icon}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm leading-tight text-foreground">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.productId)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </span>
                        
                        <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.productId, -1)}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-foreground hover:bg-accent hover:text-primary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-foreground hover:bg-accent hover:text-primary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/50 p-6 bg-white shrink-0">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Costo de envío</span>
                <span>Gratis (Recojo)</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-foreground pt-3 border-t">
                <span>Total</span>
                <span className="text-primary">S/ {total.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                closeCart();
                setLocation('/pedido');
              }}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20"
            >
              Proceder al pedido
            </button>
            
            <div className="mt-4 text-center">
              <button 
                onClick={closeCart}
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
