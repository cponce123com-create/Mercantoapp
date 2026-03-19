import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Search, Filter, Tag, Info } from "lucide-react";
import { TACORA_ITEMS } from "@/data/mock";

const TACORA_CATEGORIES = ['Todos', 'Ropa', 'Electrónicos', 'Hogar', 'Libros', 'Deportes', 'Instrumentos'];

export default function Tacora() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredItems = TACORA_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-violet-600 hover:text-violet-800 mb-4 transition-colors font-medium"
          >
            <ArrowLeft size={18} /> Volver al inicio
          </button>
          
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl mb-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                <Tag size={14} /> Segunda Mano
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4 drop-shadow-md">
                Tacora Local
              </h1>
              <p className="text-violet-100 text-lg md:text-xl font-medium">
                Encuentra tesoros vintage, ropa circular y objetos únicos de tus vecinos. Compra y vende de forma segura en tu distrito.
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar artículos de segunda mano..."
              className="w-full pl-11 pr-4 py-4 bg-white border border-violet-100 shadow-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-2xl text-base transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl border border-violet-100 p-6 shadow-sm sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-foreground font-bold text-lg">
                <Filter size={20} className="text-violet-600" /> Categorías
              </div>
              
              <div className="flex lg:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
                {TACORA_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all whitespace-nowrap lg:whitespace-normal font-medium ${
                      selectedCategory === cat 
                        ? 'bg-violet-600 text-white shadow-md' 
                        : 'hover:bg-violet-50 text-muted-foreground hover:text-violet-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl border border-violet-100 p-12 text-center flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center text-4xl mb-6">
                  🛍️
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No se encontraron artículos</h3>
                <p className="text-muted-foreground text-lg max-w-md">
                  No hay resultados en la categoría seleccionada.
                </p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("Todos"); }}
                  className="mt-8 px-6 py-3 bg-violet-100 text-violet-700 hover:bg-violet-200 rounded-xl font-bold transition-colors"
                >
                  Ver todos los artículos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <div key={item.id} className="bg-white rounded-3xl border border-violet-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className="w-full aspect-square bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl mb-4 flex items-center justify-center text-7xl border border-violet-100/50">
                      {item.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-lg leading-tight text-foreground">{item.name}</h3>
                        <span className="font-bold text-violet-600 whitespace-nowrap bg-violet-50 px-2 py-1 rounded-lg">
                          S/ {item.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs font-semibold px-2 py-1 bg-muted text-muted-foreground rounded-md">
                          {item.category}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          item.condition === 'Como Nuevo' ? 'bg-green-100 text-green-700' :
                          item.condition === 'Muy Bueno' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {item.condition}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-violet-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">
                          {item.seller.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">{item.seller}</span>
                      </div>
                      <button className="text-violet-600 hover:text-violet-800 transition-colors">
                        <Info size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}