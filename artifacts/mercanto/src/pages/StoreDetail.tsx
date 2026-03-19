import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, MapPin, ShoppingBag, Star, Info, Clock, Plus, Check } from "lucide-react";
import { FEATURED_STORES, PRODUCTS } from "@/data/mock";

export default function StoreDetail() {
  const [, params] = useRoute("/tienda/:id");
  const [, setLocation] = useLocation();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  
  const storeId = params?.id;
  const store = FEATURED_STORES.find(s => s.id === storeId);
  const storeProducts = PRODUCTS.filter(p => p.storeId === storeId);

  if (!store) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Tienda no encontrada</h2>
        <p className="text-muted-foreground mb-6">La tienda que buscas no existe o ha sido eliminada.</p>
        <button onClick={() => setLocation('/tiendas')} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">
          Ver todas las tiendas
        </button>
      </div>
    );
  }

  const handleAddToCart = (productId: string) => {
    setAddedItems(prev => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [productId]: false }));
    }, 2000);
  };

  const categories = Array.from(new Set(storeProducts.map(p => p.category)));

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Store Header */}
      <div className={`w-full h-48 md:h-64 bg-gradient-to-r ${store.gradient} relative flex items-center justify-center`}>
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
        <button 
          onClick={() => setLocation('/tiendas')}
          className="absolute top-6 left-6 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-7xl md:text-8xl drop-shadow-xl z-10">{store.icon}</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-border/50 mb-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <ShoppingBag size={14} />
                {store.badge}
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-2">{store.name}</h1>
              <p className="text-muted-foreground text-lg mb-4">{store.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star size={16} fill="currentColor" /> 4.8 (120+ reseñas)
                </div>
                <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                  <MapPin size={16} /> 1.2 km de distancia
                </div>
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  <Clock size={16} /> Abierto ahora
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 flex gap-3">
              <button className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold transition-colors flex items-center gap-2">
                <Info size={18} /> Info
              </button>
            </div>
          </div>
        </div>

        {/* Products */}
        <h2 className="text-2xl font-display font-bold mb-6">Productos</h2>
        
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category} className="mb-10">
              <h3 className="text-xl font-bold text-foreground mb-4 border-b pb-2">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {storeProducts.filter(p => p.category === category).map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all flex flex-col">
                    <div className="w-full aspect-square bg-muted/30 rounded-xl mb-4 flex items-center justify-center text-6xl">
                      {product.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg leading-tight mb-1">{product.name}</h4>
                      <p className="text-muted-foreground text-sm mb-4">{product.category}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-bold text-primary">S/ {product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => handleAddToCart(product.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          addedItems[product.id] 
                            ? 'bg-green-500 text-white' 
                            : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        {addedItems[product.id] ? <Check size={20} /> : <Plus size={20} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-border">
            <p className="text-muted-foreground text-lg">Esta tienda aún no tiene productos registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
}