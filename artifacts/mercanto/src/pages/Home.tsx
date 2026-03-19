import { motion } from "framer-motion";
import { ArrowRight, Check, MapPin, Search, ShieldCheck, ShoppingBag, Store, Tag, AlertCircle } from "lucide-react";
import { CATEGORY_CARDS } from "@/data/mock";
import { Link, useLocation } from "wouter";
import { useCategory } from "@/lib/CategoryContext";
import { useListStores } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const [, setLocation] = useLocation();
  const { activeCategory } = useCategory();

  const { data, isLoading, error, refetch } = useListStores({
    status: 'approved',
    is_active: true,
    limit: 8
  });

  const stores = data?.data || [];

  // Filtrado local por categoría si es necesario, aunque lo ideal sería por API
  const filteredStores = activeCategory === 'all' 
    ? stores 
    : stores.filter(store => {
        // Mapeo simple de categorías para el mock visual
        const categoryMap: Record<string, string> = {
          'restaurants': 'Restaurante',
          'fruits': 'Frutas y Verduras',
          'stores': 'Minimarket',
          'clothes': 'Ropa',
          'home': 'Hogar',
          'tech': 'Tecnología',
          'pharmacy': 'Salud'
        };
        return store.description?.includes(categoryMap[activeCategory]) || false;
      });

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-background pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Hero Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-primary text-sm font-bold mb-6 shadow-sm border border-primary/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Disponible en tu distrito
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold leading-[1.1] text-foreground mb-6">
                ¡Tu distrito, <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-600">
                  en una sola app!
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg font-medium">
                Compra local en tu distrito con recojo en tienda o envío programable. Apoya a los negocios de tu zona.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button onClick={() => setLocation('/tiendas')} className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <Store size={20} className="group-hover:scale-110 transition-transform" />
                  Explorar tiendas
                </button>
                <button onClick={() => setLocation('/tacora')} className="px-8 py-4 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-secondary/20 hover:shadow-2xl hover:shadow-secondary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <Tag size={20} className="group-hover:scale-110 transition-transform" />
                  Explorar Tacora
                </button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-6 border-t border-border/60">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <div className="bg-green-100 p-1.5 rounded-full text-green-600"><Check size={16} strokeWidth={3} /></div>
                  +500 tiendas locales
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <div className="bg-blue-100 p-1.5 rounded-full text-blue-600"><ShieldCheck size={16} strokeWidth={2.5} /></div>
                  Pago 100% seguro
                </div>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:flex justify-center items-center h-[500px]"
            >
              <div className="relative w-[400px] h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 via-primary to-orange-500 rounded-[3rem] rotate-6 shadow-2xl opacity-90 blur-[2px]"></div>
                <div className="absolute inset-0 bg-white rounded-[3rem] -rotate-3 shadow-xl border border-white/50 overflow-hidden flex flex-col">
                  <div className="h-16 bg-muted/30 border-b border-border/50 flex items-center px-6 gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><MapPin size={16} className="text-primary"/></div>
                    <div className="flex-1">
                      <div className="h-2.5 w-24 bg-muted-foreground/20 rounded-full mb-2"></div>
                      <div className="h-3 w-32 bg-foreground/20 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col gap-4">
                    <div className="h-10 w-full bg-muted/50 rounded-xl border border-border/50"></div>
                    <div className="flex gap-3 mt-2">
                      <div className="h-20 w-20 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl shadow-sm">🍔</div>
                      <div className="h-20 w-20 rounded-2xl bg-green-100 flex items-center justify-center text-3xl shadow-sm">🍎</div>
                      <div className="h-20 w-20 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl shadow-sm">🏪</div>
                    </div>
                    <div className="mt-4 flex-1 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-border/50 p-4 relative overflow-hidden">
                       <div className="h-4 w-3/4 bg-foreground/10 rounded-full mb-3"></div>
                       <div className="h-4 w-1/2 bg-foreground/10 rounded-full"></div>
                       <div className="absolute bottom-4 right-4 w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"><ShoppingBag size={20}/></div>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  animate={{ y: [-10, 10, -10] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-border flex items-center gap-3 z-20"
                >
                  <div className="bg-green-100 p-2 rounded-xl text-2xl">🛍️</div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">Pedido Listo</div>
                    <div className="text-sm font-bold text-foreground">Recojo en 15m</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  animate={{ y: [10, -10, 10] }} 
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-border flex items-center gap-3 z-20"
                >
                  <div className="bg-purple-100 p-2 rounded-xl text-2xl">✨</div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">Nuevo</div>
                    <div className="text-sm font-bold text-foreground">Tacora Segunda Mano</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* COMPRA POR CATEGORÍA */}
      <section className="py-16 lg:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Compra por categoría</h2>
              <p className="text-muted-foreground mt-2 text-lg">Encuentra exactamente lo que buscas en tu zona.</p>
            </div>
            <button onClick={() => setLocation('/tiendas')} className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors group">
              Ver todas <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CATEGORY_CARDS.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setLocation(`/tiendas?categoria=${cat.id}`)}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider">
                      {cat.badge}
                    </span>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {cat.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1 drop-shadow-md">{cat.title}</h3>
                  </div>
                </div>
              </button>
            ))}

            {/* Special Promo Card */}
            <button onClick={() => setLocation('/tacora')} className="group relative rounded-3xl overflow-hidden aspect-[4/3] sm:col-span-2 lg:col-span-2 xl:col-span-4 lg:aspect-auto xl:h-64 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600"></div>
              <div className="absolute inset-0 p-8 flex flex-col lg:flex-row items-center justify-between gap-8 z-10">
                <div className="max-w-md">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-4">
                    Segunda Mano
                  </span>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Tacora Digital</h3>
                  <p className="text-white/80 text-lg mb-6">Vende lo que ya no usas o encuentra tesoros únicos en tu distrito. Seguro, local y sostenible.</p>
                  <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
                    Explorar Tacora <ArrowRight size={20} />
                  </div>
                </div>
                <div className="hidden lg:flex items-center justify-center w-48 h-48 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-7xl shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  ✨
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* TIENDAS DESTACADAS */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Tiendas destacadas</h2>
              <p className="text-muted-foreground mt-2 text-lg">Los negocios favoritos de tus vecinos.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {['all', 'restaurants', 'fruits', 'stores'].map((catId) => (
                <button 
                  key={catId}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    activeCategory === catId 
                      ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                      : 'bg-white text-muted-foreground hover:bg-muted border border-border'
                  }`}
                >
                  {catId === 'all' ? 'Todas' : catId === 'restaurants' ? 'Restaurantes' : catId === 'fruits' ? 'Fruterías' : 'Minimarkets'}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-3xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive" className="rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                No se pudieron cargar las tiendas. Por favor, intenta de nuevo.
                <button onClick={() => refetch()} className="ml-4 underline font-bold">Reintentar</button>
              </AlertDescription>
            </Alert>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-border">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🏪</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No hay tiendas disponibles</h3>
              <p className="text-muted-foreground max-w-md mx-auto">Lo sentimos, no encontramos tiendas en esta categoría por el momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredStores.map((store) => (
                <Link key={store.id} href={`/tienda/${store.id}`}>
                  <motion.div 
                    whileHover={{ y: -8 }}
                    className="group bg-white rounded-[2.5rem] overflow-hidden border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer h-full flex flex-col"
                  >
                    <div className={`h-48 relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900`}>
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                          🏪
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-foreground shadow-sm">
                          Recojo en tienda
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Tienda</div>
                      <h3 className="text-xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{store.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed">{store.description || 'Sin descripción disponible.'}</p>
                      <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                          <MapPin size={14} className="text-primary" />
                          {store.city || 'Lima'}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
