import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 md:py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
              <div className="bg-primary text-white p-1.5 rounded-xl group-hover:scale-105 transition-transform">
                <ShoppingCart size={24} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white group-hover:text-primary/90 transition-colors">
                Mercanto
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              El marketplace local que conecta tu distrito. Compra rápido, seguro y apoya a los negocios de tu zona.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Sobre nosotros</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Inicio</Link></li>
              <li><Link href="/tiendas" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Tiendas</Link></li>
              <li><Link href="/tacora" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Tacora</Link></li>
              <li><span className="text-muted-foreground">Sobre Mercanto</span></li> {/* Cambiado a span si no es una página real */}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Para Negocios</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><span className="text-muted-foreground">Vende en Mercanto</span></li>
              <li><span className="text-muted-foreground">Portal de vendedores</span></li>
              <li><span className="text-muted-foreground">Casos de éxito</span></li>
              <li><span className="text-muted-foreground">Centro de ayuda</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Contacto</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><span className="text-muted-foreground">Soporte al cliente</span></li>
              <li><span className="text-muted-foreground">hola@mercanto.app</span></li>
            </ul>
            <div className="mt-6">
              <span className="px-5 py-2.5 bg-white/10 text-white rounded-xl text-sm font-semibold">Descargar la App</span>
            </div>
          </div>

        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Mercanto. Todos los derechos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="text-muted-foreground">Instagram</span>
            <span className="text-muted-foreground">Facebook</span>
            <span className="text-muted-foreground">TikTok</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
