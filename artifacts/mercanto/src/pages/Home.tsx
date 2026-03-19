import { motion } from "framer-motion";
import { ArrowRight, Check, MapPin, Search, ShieldCheck, ShoppingBag, Store, Tag } from "lucide-react";
import { CATEGORY_CARDS, FEATURED_STORES } from "@/data/mock";

export default function Home() {
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
                <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <Store size={20} className="group-hover:scale-110 transition-transform" />
                  Explorar tiendas
                </button>
                <button className="px-8 py-4 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-secondary/20 hover:shadow-2xl hover:shadow-secondary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 group">
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

            {/* Hero Visual - Abstract Composition instead of real images */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:flex justify-center items-center h-[500px]"
            >
              {/* Complex CSS Composition */}
              <div className="relative w-[400px] h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 via-primary to-orange-500 rounded-[3rem] rotate-6 shadow-2xl opacity-90 blur-[2px]"></div>
                <div className="absolute inset-0 bg-white rounded-[3rem] -rotate-3 shadow-xl border border-white/50 overflow-hidden flex flex-col">
                  {/* Mock App Interface inside the rotated card */}
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
                
                {/* Floating Elements */}
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
            <button className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors group">
              Ver todas <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CATEGORY_CARDS.map((cat) => (
              <button 
                key={cat.id}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                {/* Decorative Pattern overlay */}
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
            <button className="group relative rounded-3xl overflow-hidden aspect-[4/3] sm:col-span-2 lg:col-span-2 xl:col-span-4 lg:aspect-auto xl:h-64 text-left transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
              
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between z-10 gap-6">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-violet-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                    </span>
                    NUEVO EN MERCANTO
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2 drop-shadow-md">Tacora Segunda Mano</h3>
                  <p className="text-violet-100 text-lg sm:text-xl font-medium">Encuentra tesoros vintage, ropa circular y objetos únicos de vendedores locales verificados.</p>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="px-6 py-3.5 bg-white text-violet-700 rounded-2xl font-bold text-lg shadow-lg group-hover:bg-violet-50 transition-colors flex items-center gap-2">
                    Explorar Tacora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              {/* Decorative graphic right */}
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            </button>
          </div>
          
          <button className="sm:hidden w-full mt-6 py-4 bg-muted text-foreground font-bold rounded-2xl flex items-center justify-center gap-2">
            Ver todas las categorías <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* TIENDAS DESTACADAS */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Tiendas destacadas en tu distrito</h2>
              <p className="text-muted-foreground mt-2 text-lg">Los negocios más confiables y populares cerca de ti.</p>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors group">
              Ver todas <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar snap-x gap-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            {FEATURED_STORES.map((store) => (
              <button 
                key={store.id}
                className="group flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl overflow-hidden border border-border/60 shadow-md shadow-black/5 hover:shadow-xl hover:border-primary/30 transition-all duration-300 snap-start text-left focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                {/* Visual Header */}
                <div className={`h-32 w-full bg-gradient-to-r ${store.gradient} relative flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                  <div className="text-5xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{store.icon}</div>
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
                    <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {store.name}
                    </h3>
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
            
            {/* View More Card */}
            <button className="group flex-shrink-0 w-72 sm:w-80 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20 hover:border-primary hover:bg-primary/10 transition-colors duration-300 snap-start flex flex-col items-center justify-center p-8 text-primary">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ArrowRight size={28} />
              </div>
              <h3 className="text-xl font-bold">Ver las 50+ tiendas</h3>
              <p className="text-primary/70 text-center mt-2 font-medium">Explora todo lo que tu distrito ofrece</p>
            </button>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">¿Cómo funciona Mercanto?</h2>
            <p className="text-muted-foreground mt-4 text-lg">Tu marketplace local en 3 simples pasos. Fácil, rápido y directo con el vendedor.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 -z-10"></div>

            <div className="bg-white rounded-3xl p-8 border border-border/80 shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="w-24 h-24 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                📍
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">1. Elige tu ubicación</h3>
              <p className="text-muted-foreground font-medium">Configura tu distrito para descubrir las tiendas y restaurantes disponibles en tu zona de entrega.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-border/80 shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="w-24 h-24 mx-auto bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300 relative">
                🛒
                <span className="absolute -top-1 -right-1 bg-primary w-6 h-6 rounded-full border-2 border-white"></span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">2. Explora y compra</h3>
              <p className="text-muted-foreground font-medium">Navega por miles de productos de negocios locales. Añade al carrito y paga de forma segura.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-border/80 shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group">
              <div className="w-24 h-24 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                🛍️
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">3. Recoge o recibe</h3>
              <p className="text-muted-foreground font-medium">Dirígete a la tienda a recoger tu pedido sin hacer colas o coordina la entrega directamente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS CTA */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* Informational Card */}
            <div className="bg-muted/50 rounded-[2.5rem] p-10 lg:p-14 border border-border">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 text-3xl">🤝</div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">¿Tienes un negocio o tienda?</h2>
              <p className="text-muted-foreground text-lg font-medium mb-8">
                Únete a Mercanto y digitaliza tu negocio hoy mismo. Conecta con miles de vecinos en tu distrito que buscan comprar local.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><Check size={16} strokeWidth={3}/></div>
                  <span className="text-foreground font-semibold text-lg">Sin costos fijos ni mensualidades</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><Check size={16} strokeWidth={3}/></div>
                  <span className="text-foreground font-semibold text-lg">Más clientes locales para tu negocio</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full"><Check size={16} strokeWidth={3}/></div>
                  <span className="text-foreground font-semibold text-lg">Panel de control fácil de usar desde el celular</span>
                </li>
              </ul>
            </div>
            
            {/* Action Card */}
            <div className="bg-secondary rounded-[2.5rem] p-10 lg:p-14 border border-secondary relative overflow-hidden flex flex-col justify-center">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 text-center lg:text-left">
                <h3 className="text-3xl sm:text-5xl font-display font-extrabold text-white mb-6 leading-tight">
                  Empieza a vender en <span className="text-primary">mercanto</span>
                </h3>
                <p className="text-secondary-foreground/80 text-xl font-medium mb-10">
                  Crea tu tienda online en menos de 5 minutos.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300">
                    Crear mi tienda gratis
                  </button>
                  <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-lg backdrop-blur-sm hover:-translate-y-0.5 transition-all duration-300">
                    Conocer más beneficios
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
