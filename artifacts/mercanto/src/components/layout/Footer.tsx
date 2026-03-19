import { ShoppingCart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 md:py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-white p-1.5 rounded-xl">
                <ShoppingCart size={24} strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                mercanto
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              El marketplace local que conecta tu distrito. Compra rápido, seguro y apoya a los negocios de tu zona.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Sobre nosotros</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><button className="hover:text-primary transition-colors">¿Cómo funciona?</button></li>
              <li><button className="hover:text-primary transition-colors">Preguntas frecuentes</button></li>
              <li><button className="hover:text-primary transition-colors">Términos y condiciones</button></li>
              <li><button className="hover:text-primary transition-colors">Política de privacidad</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Para Negocios</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><button className="hover:text-primary transition-colors">Vende en Mercanto</button></li>
              <li><button className="hover:text-primary transition-colors">Portal de vendedores</button></li>
              <li><button className="hover:text-primary transition-colors">Casos de éxito</button></li>
              <li><button className="hover:text-primary transition-colors">Centro de ayuda</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Contacto</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><button className="hover:text-primary transition-colors">Soporte al cliente</button></li>
              <li><button className="hover:text-primary transition-colors">hola@mercanto.app</button></li>
            </ul>
            <div className="mt-6">
              <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition-colors duration-200">
                Descargar la App
              </button>
            </div>
          </div>

        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Mercanto. Todos los derechos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button className="hover:text-white transition-colors">Instagram</button>
            <button className="hover:text-white transition-colors">Facebook</button>
            <button className="hover:text-white transition-colors">TikTok</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
