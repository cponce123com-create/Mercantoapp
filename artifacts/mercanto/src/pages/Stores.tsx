import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, MapPin, ShoppingBag, ArrowLeft, Filter } from "lucide-react";
import { FEATURED_STORES, CATEGORIES } from "@/data/mock";

export default function Stores() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = new URLSearchParams(window.location.search);
  const urlCategory = searchParams.get('categoria') || "all";
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('categoria');
    if (cat) setSelectedCategory(cat);
  }, []);

  const filteredStores = useMemo(() => {
    return FEATURED_STORES.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           store.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || store.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Breadcrumb */}
        <div className="mb-8">
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors font-medium"
          >
            <ArrowLeft size={18} /> Volver al inicio
          </button>
          <h1 className="text-4xl font-display font-extrabold text-foreground mb-4">Todas las tiendas</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tiendas, restaurantes, minimarkets..."
              className="w-full pl-11 pr-4 py-4 bg-white border border-border shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl text-base transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl border border-border p-6 shadow-sm sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-foreground font-bold text-lg">
                <Filter size={20} /> Filtrar por categoría
              </div>
              
              <div className="flex lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap lg:whitespace-normal font-medium ${
                      selectedCategory === cat.id 
                        ? 'bg-primary text-white shadow-md' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            {filteredStores.length === 0 ? (
              <div className="bg-white rounded-3xl border border-border p-12 text-center flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-4xl mb-6">
                  🔍
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No se encontraron tiendas</h3>
                <p className="text-muted-foreground text-lg max-w-md">
                  No hay resultados para "{searchQuery}" en la categoría seleccionada. Intenta buscar con otros términos.
                </p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="mt-8 px-6 py-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-bold transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStores.map(store => (
                  <button 
                    key={store.id}
                    onClick={() => setLocation(`/tienda/${store.id}`)}
                    className="group flex-shrink-0 w-full bg-white rounded-3xl overflow-hidden border border-border/60 shadow-md shadow-black/5 hover:shadow-xl hover:border-primary/30 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-primary/20"
                  >
                    {/* Visual Header */}
                    <div className={`h-36 w-full bg-gradient-to-r ${store.gradient} relative flex items-center justify-center`}>
                      <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                      <div className="text-6xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{store.icon}</div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5 relative">
                      {/* Badge overlaps header */}
                      <div className="absolute -top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md text-xs font-bold text-primary flex items-center gap-1 border border-border/50">
                        <ShoppingBag size={12} />
                        {store.badge}
                      </div>
                      
                      <div className="mt-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                          {store.category}
                        </span>
                        <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors mb-2">
                          {store.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {store.description}
                        </p>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground font-medium border-t border-border pt-4">
                        <div className="flex items-center gap-1 text-amber-500">
                          <span className="text-base">★</span> 4.8
                        </div>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} /> 1.2 km
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}