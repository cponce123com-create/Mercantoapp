import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { MapPin, Search, ShoppingCart, User, ChevronDown, Menu, X, Loader } from "lucide-react";
import { CATEGORIES } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useCategory } from "@/lib/CategoryContext";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { activeCategory, setActiveCategory } = useCategory();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, itemCount } = useCart();
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Hide regular navbar on admin page
  if (location.startsWith('/admin')) {
    return null;
  }

  // Handle search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        try {
          const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await response.json();
          if (data.success) {
            setSearchResults(data.data);
            setShowResults(true);
          }
        } catch (error) {
          console.error("Error searching products:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border/50 shadow-sm backdrop-blur-md bg-white/90">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
              <img src="/logo.png" alt="Mercanto" className="h-10 w-10 group-hover:scale-105 transition-transform duration-300" />
              <span className="font-display font-extrabold text-xl tracking-tight text-primary">
                Mercanto
              </span>
            </Link>
          </div>

          {/* Location Selector (Hidden on small mobile) */}
          <button 
            className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Seleccionar zona de entrega"
          >
            <div className="bg-accent text-primary p-2 rounded-full" aria-hidden="true">
              <MapPin size={18} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground font-medium">Entregar en</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-foreground">Mi Distrito</span>
                <ChevronDown size={14} className="text-muted-foreground" aria-hidden="true" />
              </div>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden sm:flex" ref={searchRef}>
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {isSearching ? (
                  <Loader size={20} className="text-primary animate-spin" aria-hidden="true" />
                ) : (
                  <Search size={20} className="text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden="true" />
                )}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 3 && setShowResults(true)}
                placeholder="Buscar productos..."
                aria-label="Buscar en Mercanto"
                className="w-full pl-11 pr-4 py-3.5 bg-muted/50 border-2 border-transparent hover:border-border hover:bg-muted focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl text-sm transition-all duration-300 outline-none"
              />

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResults.length > 0 ? (
                    <div className="max-h-[400px] overflow-y-auto py-2">
                      {searchResults.map((product) => (
                        <Link 
                          key={product.id} 
                          href={`/tienda/${product.store_id}`}
                          onClick={() => setShowResults(false)}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-muted transition-colors cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden border border-border">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Search size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-foreground truncate">{product.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                          </div>
                          <div className="text-sm font-bold text-primary">
                            S/ {parseFloat(product.price).toFixed(2)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Search size={40} className="mx-auto text-muted-foreground/20 mb-3" />
                      <p className="text-muted-foreground font-medium">No encontramos productos para "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/mapa" className="hidden lg:flex items-center gap-2 px-3 py-2.5 hover:bg-muted rounded-xl transition-colors duration-200 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <MapPin size={20} className="text-muted-foreground" aria-hidden="true" />
              <span>Mapa</span>
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="hidden sm:flex items-center gap-2 px-3 py-2.5 hover:bg-muted rounded-xl transition-colors duration-200 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <User size={20} className="text-primary" aria-hidden="true" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link href="/perfil" className="hidden sm:flex items-center gap-2 px-3 py-2.5 hover:bg-muted rounded-xl transition-colors duration-200 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <User size={20} className="text-muted-foreground" aria-hidden="true" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={logout}
                  aria-label="Cerrar sesión"
                  className="hidden sm:flex items-center gap-2 px-3 py-2.5 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors duration-200 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  <LogOut size={20} className="text-muted-foreground group-hover:text-red-600" aria-hidden="true" />
                </button>
              </>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-2 px-3 py-2.5 hover:bg-muted rounded-xl transition-colors duration-200 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <User size={20} className="text-muted-foreground" aria-hidden="true" />
                <span>Ingresar</span>
              </Link>
            )}
            <button 
              onClick={openCart}
              aria-label={`Abrir carrito (${itemCount} artículos)`}
              className="relative p-3 bg-muted/50 hover:bg-accent hover:text-primary rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ShoppingCart size={22} aria-hidden="true" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-primary rounded-full border-2 border-white" aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search (Shows only on very small screens) */}
      <div className="sm:hidden px-4 pb-4 relative" ref={searchRef}>
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader size={18} className="text-primary animate-spin" aria-hidden="true" />
            ) : (
              <Search size={18} className="text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 3 && setShowResults(true)}
            placeholder="Buscar productos..."
            aria-label="Buscar en Mercanto (móvil)"
            className="w-full pl-10 pr-4 py-3 bg-muted/50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {/* Mobile Search Results Dropdown */}
        {showResults && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-[60]">
            {searchResults.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto py-1">
                {searchResults.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/tienda/${product.store_id}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-md bg-muted flex-shrink-0 overflow-hidden border border-border">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Search size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate">{product.name}</h4>
                      <div className="text-xs font-bold text-primary">
                        S/ {parseFloat(product.price).toFixed(2)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No hay resultados
              </div>
            )}
          </div>
        )}
      </div>


    </header>

    {/* Mobile Menu Overlay */}
    <div 
      className={cn(
        "fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      onClick={() => setIsMobileMenuOpen(false)}
    />
    
    {/* Mobile Sidebar */}
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-[101] w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-6 border-b border-border/50 flex items-center justify-between bg-primary/5">
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
          <div className="bg-primary text-white p-1.5 rounded-lg shadow-sm" aria-hidden="true">
            <ShoppingCart size={20} strokeWidth={2.5} />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-primary">
            Mercanto
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Cerrar menú móvil"
          className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          <li>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <MapPin size={20} aria-hidden="true" />
              <span className="font-medium">Mi Distrito</span>
            </Link>
          </li>
          {user ? (
            <>
              {user.role === 'admin' && (
                <li>
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <User size={20} className="text-primary" aria-hidden="true" />
                    <span className="font-medium">Admin</span>
                  </Link>
                </li>
              )}
              <li>
                <Link href="/perfil" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <User size={20} className="text-muted-foreground" aria-hidden="true" />
                  <span className="font-medium">{user.name.split(' ')[0]}</span>
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  <LogOut size={20} aria-hidden="true" />
                  <span className="font-medium">Cerrar sesión</span>
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <User size={20} className="text-muted-foreground" aria-hidden="true" />
                <span className="font-medium">Ingresar</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
    </>
  );
}
