import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MapPin, Search, ShoppingCart, User, ChevronDown, Menu, X } from "lucide-react";
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

  // Hide regular navbar on admin page
  if (location.startsWith('/admin')) {
    return null;
  }

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
          <div className="flex-1 max-w-2xl hidden sm:flex">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Buscar tiendas, productos, restaurantes..."
                aria-label="Buscar en Mercanto"
                className="w-full pl-11 pr-4 py-3.5 bg-muted/50 border-2 border-transparent hover:border-border hover:bg-muted focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl text-sm transition-all duration-300 outline-none"
              />
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
      <div className="sm:hidden px-4 pb-4">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Buscar en Mercanto..."
            aria-label="Buscar en Mercanto (móvil)"
            className="w-full pl-10 pr-4 py-3 bg-muted/50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Category Navigation Pills */}
      <nav className="border-t border-border/50 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto hide-scrollbar snap-x" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                role="tab"
                aria-selected={activeCategory === cat.id}
                aria-label={`Categoría: ${cat.name}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  activeCategory === cat.id 
                    ? "bg-primary text-white shadow-md shadow-primary/25 scale-105" 
                    : cat.color
                )}
              >
                <span className="text-base" aria-hidden="true">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
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
