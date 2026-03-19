import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, MapPin, ShoppingBag, Star, Info, Clock, Plus, Check, Minus, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useGetStore, useListProductsByStore } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function StoreDetail() {
  const [, params] = useRoute("/tienda/:id");
  const [, setLocation] = useLocation();
  const { items, addItem, updateQuantity } = useCart();
  
  const storeId = params?.id ? parseInt(params.id, 10) : 0;

  const { 
    data: storeData, 
    isLoading: isLoadingStore, 
    error: storeError,
    refetch: refetchStore
  } = useGetStore(storeId, {
    query: { enabled: !!storeId }
  });

  const { 
    data: productsData, 
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts
  } = useListProductsByStore(storeId, {
    limit: 100
  }, {
    query: { enabled: !!storeId }
  });

  const store = storeData?.data;
  const storeProducts = productsData?.data || [];

  if (isLoadingStore) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <Skeleton className="w-full h-48 md:h-64" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-border/50 mb-10 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (storeError || !store) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Tienda no encontrada</h2>
        <p className="text-muted-foreground mb-6">La tienda que buscas no existe o ha sido eliminada.</p>
        <div className="flex gap-4">
          <button onClick={() => setLocation('/tiendas')} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">
            Ver todas las tiendas
          </button>
          {storeError && (
            <button onClick={() => refetchStore()} className="px-6 py-2 bg-muted text-foreground rounded-xl font-bold">
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    // Adaptar el producto de la API al formato esperado por el carrito si es necesario
    const cartProduct = {
      ...product,
      id: product.id.toString(),
      icon: product.image_url ? '🖼️' : '📦' // Fallback icon
    };
    addItem(cartProduct, {
      ...store,
      id: store.id.toString(),
      icon: store.logo_url ? '🖼️' : '🏪',
      badge: 'Recojo en tienda',
      gradient: 'from-slate-700 to-slate-900'
    });
  };

  const getItemQuantity = (productId: number) => {
    const item = items.find(i => i.productId === productId.toString());
    return item ? item.quantity : 0;
  };

  const categories = Array.from(new Set(storeProducts.map(p => p.category || 'General')));

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Store Header */}
      <div className={`w-full h-48 md:h-64 bg-gradient-to-r from-slate-700 to-slate-900 relative flex items-center justify-center`}>
        {store.logo_url && (
          <img src={store.logo_url} alt={store.name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
        <button 
          onClick={() => setLocation('/tiendas')}
          className="absolute top-6 left-6 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-7xl md:text-8xl drop-shadow-xl z-10">
          {store.logo_url ? '' : '🏪'}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-border/50 mb-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <ShoppingBag size={14} />
                Recojo en tienda
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-2">{store.name}</h1>
              <p className="text-muted-foreground text-lg mb-4">{store.description || 'Sin descripción disponible.'}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star size={16} fill="currentColor" /> 4.8 (120+ reseñas)
                </div>
                <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                  <MapPin size={16} /> {store.address || store.city || 'Ubicación no disponible'}
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
        
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        ) : productsError ? (
          <Alert variant="destructive" className="rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              No se pudieron cargar los productos.
              <button onClick={() => refetchProducts()} className="ml-4 underline font-bold">Reintentar</button>
            </AlertDescription>
          </Alert>
        ) : categories.length > 0 ? (
          categories.map(category => (
            <div key={category} className="mb-10">
              <h3 className="text-xl font-bold text-foreground mb-4 border-b pb-2">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {storeProducts.filter(p => (p.category || 'General') === category).map(product => {
                  const quantity = getItemQuantity(product.id);
                  const inCart = quantity > 0;
                  
                  return (
                    <div key={product.id} className={`bg-white p-4 rounded-2xl border ${inCart ? 'border-green-500 bg-green-50/30' : 'border-border'} shadow-sm hover:shadow-md transition-all flex flex-col`}>
                      <div className="w-full aspect-square bg-muted/30 rounded-xl mb-4 flex items-center justify-center text-6xl overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg leading-tight mb-1">{product.name}</h4>
                        <p className="text-muted-foreground text-sm mb-4">{product.category || 'General'}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-primary">S/ {Number(product.price).toFixed(2)}</span>
                        
                        {inCart ? (
                          <div className="flex items-center gap-2 bg-green-100 rounded-full p-1 border border-green-200">
                            <button 
                              onClick={() => updateQuantity(product.id.toString(), -1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-green-700 hover:bg-green-50 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center text-green-800">{quantity}</span>
                            <button 
                              onClick={() => updateQuantity(product.id.toString(), 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-green-700 hover:bg-green-50 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAddToCart(product)}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-primary/10 text-primary hover:bg-primary hover:text-white"
                          >
                            <Plus size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-border">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📦</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No hay productos</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Esta tienda aún no tiene productos registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
