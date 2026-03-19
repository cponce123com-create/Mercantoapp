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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border/50 shadow-sm backdrop-blur-md bg-white/90">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Abrir menú de navegación"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-primary text-white p-1.5 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-md shadow-primary/20">
                <ShoppingCart size={24} strokeWidth={2.5} />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-primary">
                mercanto
              </span>
            </Link>
          </div>

          {/* Location Selector (Hidden on small mobile) */}
          <button 
            className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-full transition-colors duration-200"
            aria-label="Seleccionar ubicación de entrega"
          >
            <div className="bg-accent text-primary p-2 rounded-full">
              <MapPin size={18} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground font-medium">Entregar en</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-foreground">Mi Distrito</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </div>
            </div>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden sm:flex">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Buscar tiendas, productos, restaurantes..."
                className="w-full pl-11 pr-4 py-3.5 bg-muted/50 border-2 border-transparent hover:border-border hover:bg-muted focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl text-sm transition-all duration-300 outline-none"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/mapa" className="hidden lg:flex items-center gap-2 px-3 py-2.5 hover:bg-muted rounded-xl transition-colors duration-200 text-sm font-semibold text-foreground">
              <MapPin size={20} className="text-muted-foreground" />
              <span>Mapa</span>
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="hidden sm:flex items-center gap-2 px-3 py-2.5 hover:bg-muted rounded-xl transition-colors duration-200 text-sm font-semibold text-foreground">
                    <User size={20} className="text-primary" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link href="/perfil" className="hidden sm:flex items-center gap-2 px-3 py-2.5 hover:bg-muted rounded-xl transition-colors duration-200 text-sm font-semibold text-foreground">
                  <User size={20} className="text-muted-foreground" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="hidden sm:flex items-center gap-2 px-3 py-2.5 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors duration-200 text-sm font-semibold text-foreground"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={20} className="text-muted-foreground group-hover:text-red-600" />
                </button>
              </>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center gap-2 px-3 py-2.5 hover:bg-muted rounded-xl transition-colors duration-200 text-sm font-semibold text-foreground">
                <User size={20} className="text-muted-foreground" />
                <span>Ingresar</span>
              </Link>
            )}
            <button 
              onClick={openCart}
              className="relative p-3 bg-muted/50 hover:bg-accent hover:text-primary rounded-xl transition-colors duration-200"
              aria-label={`Ver carrito con ${itemCount} productos`}
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-primary rounded-full border-2 border-white">
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
            <Search size={18} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Buscar en Mercanto..."
            className="w-full pl-10 pr-4 py-3 bg-muted/50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl text-sm transition-all outline-none"
          />
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="border-t border-border/50 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-3 overflow-x-auto hide-scrollbar snap-x">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 snap-start",
                  activeCategory === cat.id 
                    ? "bg-primary text-white shadow-md shadow-primary/25 scale-105" 
                    : cat.color
                )}
              >
                <span className="text-base">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
