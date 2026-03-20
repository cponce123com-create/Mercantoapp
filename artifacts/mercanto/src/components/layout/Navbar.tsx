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
      {/* Top Main Bar */} <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <img src="/logo.png" alt="Mercanto" className="h-10 w-10 group-hover:scale-105 transition-transform duration-300" />
              <span className="font-display font-extrabold text-xl tracking-tight text-primary hidden sm:inline">
                Mercanto
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
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-lg shadow-sm">
            <ShoppingCart size={20} strokeWidth={2.5} />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-primary">
            mercanto
          </span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <div className="px-2 pb-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Navegación</p>
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors",
              location === "/" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
            )}
          >
            <ShoppingCart size={20} />
            <span>Inicio</span>
          </Link>
          <Link 
            href="/tiendas" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors",
              location === "/tiendas" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
            )}
          >
            <Search size={20} />
            <span>Explorar Tiendas</span>
          </Link>
          <Link 
            href="/mapa" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors",
              location === "/mapa" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
            )}
          >
            <MapPin size={20} />
            <span>Mapa</span>
          </Link>
        </div>

        <div className="px-2 pt-4 border-t border-border/50">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Mi Cuenta</p>
          {user ? (
            <>
              <Link 
                href="/perfil" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors",
                  location === "/perfil" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                )}
              >
                <User size={20} />
                <span>Mi Perfil</span>
              </Link>
              {user.role === 'admin' && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors",
                    location === "/admin" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  )}
                >
                  <User size={20} className="text-primary" />
                  <span>Administración</span>
                </Link>
              )}
              <button 
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors mt-2"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <Link 
              href="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <User size={20} />
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-border/50 bg-muted/30">
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
          <MapPin size={14} />
          <span>Disponible en tu distrito</span>
        </div>
      </div>
    </div>
    </>
  );
}