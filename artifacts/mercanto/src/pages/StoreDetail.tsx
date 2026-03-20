import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, MapPin, ShoppingBag, Star, Info, Clock, Plus, Check, Minus, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useGetStore, useListProductsByStore } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function StoreDetail() {
  const [, params] = useRoute("/tienda/:id");
  const [, setLocation] = useLocation();
  const { items, addItem, updateQuantity } = useCart();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [imageIndices, setImageIndices] = useState<Record<number, number>>({});
  
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
    const cartProduct = {
      ...product,
      id: product.id.toString(),
      icon: product.image_url ? '🖼️' : '📦'
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

  const handlePrevImage = (productId: number, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) === 0 ? totalImages - 1 : (prev[productId] || 0) - 1
    }));
  };

  const handleNextImage = (productId: number, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const categories = Array.from(new Set(storeProducts.map(p => p.category || 'General')));

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Store Header */}
      <div className={`w-full h-40 md:h-64 bg-gradient-to-r from-slate-700 to-slate-900 relative flex items-center justify-center`}>
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
        <div className="text-6xl md:text-8xl drop-shadow-xl z-10">
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
              <h1 className="text-2xl md:text-4xl font-display font-extrabold text-foreground mb-2">{store.name}</h1>
              <p className="text-muted-foreground text-base md:text-lg mb-4">{store.description || 'Sin descripción disponible.'}</p>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-medium">
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star size={16} fill="currentColor" /> 4.8
                </div>
                <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded-lg max-w-[200px] truncate">
                  <MapPin size={16} className="shrink-0" /> <span className="truncate">{store.address || store.city || 'Ubicación'}</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  <Clock size={16} /> Abierto
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex flex-shrink-0 gap-3">
              <button className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold transition-colors flex items-center gap-2">
                <Info size={18} /> Info
              </button>
            </div>
          </div>
        </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {storeProducts.filter(p => (p.category || 'General') === category).map(product => {
                  const quantity = getItemQuantity(product.id);
                  const inCart = quantity > 0;
                  const images = product.images || [product.image_url];
                  const currentImageIndex = imageIndices[product.id] || 0;
                  const currentImage = images[currentImageIndex];
                  const hasMultipleImages = images.length > 1;
                  const discountPercentage = product.discount_percentage || 0;
                  const originalPrice = product.original_price || product.price;
                  const discountPrice = product.discount_price || product.price;
                  
                  return (
                    <div key={product.id} className={`bg-white p-3 md:p-4 rounded-2xl border ${inCart ? 'border-green-500 bg-green-50/30' : 'border-border'} shadow-sm hover:shadow-md transition-all flex flex-col`}>
                      {/* Image Carousel */}
                      <div className="relative w-full aspect-square bg-muted/30 rounded-xl flex items-center justify-center text-4xl md:text-6xl overflow-hidden mb-3 group">
                        {currentImage ? (
                          <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          '📦'
                        )}
                        
                        {/* Image Navigation */}
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={() => handlePrevImage(product.id, images.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button
                              onClick={() => handleNextImage(product.id, images.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronRight size={18} />
                            </button>
                            
                            {/* Image Indicators */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {images.map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                        
                        {/* Discount Badge */}
                        {discountPercentage > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                            -{discountPercentage}%
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col">
                        <h4 className="font-bold text-base md:text-lg leading-tight mb-1 line-clamp-2">{product.name}</h4>
                        <p className="text-muted-foreground text-xs md:text-sm mb-2">{product.description || product.category || 'General'}</p>
                        
                        {/* Pricing */}
                        <div className="mt-auto mb-3">
                          {discountPercentage > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg md:text-xl font-bold text-primary">S/ {discountPrice.toFixed(2)}</span>
                              <span className="text-sm text-muted-foreground line-through">S/ {originalPrice.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="text-lg md:text-xl font-bold text-primary">S/ {originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        
                        {/* Add to Cart / Quantity */}
                        <div className="flex items-center justify-end">
                          {inCart ? (
                            <div className="flex items-center gap-2 bg-green-100 rounded-full p-1 border border-green-200 scale-90 sm:scale-100 origin-right">
                              <button 
                                onClick={() => updateQuantity(product.id.toString(), -1)}
                                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-green-700 hover:bg-green-50 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold w-4 text-center text-green-800">{quantity}</span>
                              <button 
                                onClick={() => updateQuantity(product.id.toString(), 1)}
                                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-green-700 hover:bg-green-50 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleAddToCart(product)}
                              className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors bg-primary/10 text-primary hover:bg-primary hover:text-white"
                            >
                              <Plus size={18} />
                            </button>
                          )}
                        </div>
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
