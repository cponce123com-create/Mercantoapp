import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, MapPin, CheckCircle, CreditCard, ShoppingBag, Truck, User, AlertCircle, Loader } from "lucide-react";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    shippingAddress: "",
    deliveryMethod: "pickup",
    notes: "",
  });

  const storeName = items.length > 0 ? items[0].storeName : "";
  const storeId = items.length > 0 ? parseInt(items[0].storeId) : null;

  // Esperando verificación de auth
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader size={32} className="animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // No autenticado — redirigir a login
  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <User size={64} className="text-muted-foreground/30 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Inicia sesión para continuar</h2>
        <p className="text-muted-foreground mb-6">
          Necesitas una cuenta para realizar un pedido.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setLocation("/login")}
            className="px-6 py-2 bg-primary text-white rounded-xl font-bold"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setLocation("/registro")}
            className="px-6 py-2 border border-primary text-primary rounded-xl font-bold"
          >
            Registrarse
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={64} className="text-muted-foreground/30 mb-6" />
        <h2 className="text-2xl font-bold mb-2">No hay pedido en curso</h2>
        <p className="text-muted-foreground mb-6">
          Agrega productos a tu carrito para realizar un pedido.
        </p>
        <button
          onClick={() => setLocation("/")}
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validar que todos los campos requeridos estén llenos
      if (!formData.name.trim()) {
        throw new Error("Por favor ingresa tu nombre completo");
      }
      if (!formData.phone.trim()) {
        throw new Error("Por favor ingresa tu teléfono o WhatsApp");
      }
      if (!formData.shippingAddress.trim()) {
        throw new Error("Por favor ingresa tu dirección de entrega");
      }

      // Preparar los items del pedido
      const orderItems = items.map((item) => ({
        product_id: parseInt(item.productId),
        quantity: item.quantity,
      }));

      // Crear la orden
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          store_id: storeId,
          shipping_address: formData.shippingAddress,
          notes: formData.notes || undefined,
          items: orderItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear la orden");
      }

      // Éxito: guardar ID de orden, limpiar carrito y mostrar confirmación
      setSuccessOrderId(data.data.id);
      clearCart();
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error al procesar el pedido");
      console.error("Error en checkout:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess && successOrderId) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {Array.from({ length: 50 }).map((_, i) => {
            const left = `${Math.random() * 100}%`;
            const animDuration = `${Math.random() * 3 + 2}s`;
            const animDelay = `${Math.random() * 2}s`;
            const colors = ["bg-primary", "bg-blue-500", "bg-green-500", "bg-yellow-400", "bg-purple-500"];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div
                key={i}
                className={`absolute top-[-10px] w-2 h-2 sm:w-3 sm:h-3 rounded-full ${color} animate-[fall_linear_infinite]`}
                style={{ left, animationDuration: animDuration, animationDelay: animDelay }}
              />
            );
          })}
          <style>{`
            @keyframes fall {
              0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
          `}</style>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-border max-w-md w-full text-center relative z-10 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-foreground mb-2">¡Pedido Recibido!</h1>
          <p className="text-muted-foreground mb-6">
            La tienda se contactará contigo en breve para coordinar la entrega.
          </p>
          <div className="bg-muted/30 border border-border rounded-2xl p-6 mb-8 text-left">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
              <span className="text-muted-foreground font-medium">Orden</span>
              <span className="font-bold text-lg text-foreground">#{successOrderId}</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
              <span className="text-muted-foreground font-medium">Tienda</span>
              <span className="font-bold text-foreground text-right">{storeName}</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
              <span className="text-muted-foreground font-medium">Total</span>
              <span className="font-bold text-foreground">S/ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Método</span>
              <span className="font-bold text-foreground bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                Recojo en tienda
              </span>
            </div>
          </div>
          <button
            onClick={() => setLocation("/")}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/" className="p-2 bg-white rounded-full shadow-sm hover:bg-muted transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-display font-bold">Finalizar Pedido</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User size={18} className="text-primary" /> Datos de contacto
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nombre completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Teléfono o WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="+51 999 999 999"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-primary" /> Dirección de entrega
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Dirección completa</label>
                  <input
                    type="text"
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Av. Principal 123, Apto 4B, Distrito Centro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Notas adicionales (opcional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Ej: Tocar timbre 3 veces, puerta roja..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Truck size={18} className="text-primary" /> Opciones de entrega
              </h2>
              <div className="space-y-3">
                <label className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
                  <div className="mt-0.5">
                    <input 
                      type="radio" 
                      checked={formData.deliveryMethod === "pickup"} 
                      onChange={() => setFormData({ ...formData, deliveryMethod: "pickup" })}
                      className="w-4 h-4 text-primary" 
                    />
                  </div>
                  <div>
                    <span className="block font-bold text-foreground">Recojo en tienda</span>
                    <span className="block text-sm text-muted-foreground mt-1">Gratis. Prepararemos tu pedido para que pases a recogerlo.</span>
                    <div className="mt-3 bg-white p-3 rounded-lg border border-border/50 text-sm flex gap-2 items-start">
                      <MapPin size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                      <span>Av. Principal 123, Distrito Centro (Dirección de {storeName})</span>
                    </div>
                  </div>
                </label>
                <label className="flex items-start gap-4 p-4 border-2 border-border/50 bg-muted/20 rounded-xl cursor-not-allowed opacity-60">
                  <div className="mt-0.5">
                    <input type="radio" disabled className="w-4 h-4" />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className="block font-bold text-foreground">Envío a domicilio</span>
                      <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Próximamente</span>
                    </div>
                    <span className="block text-sm text-muted-foreground mt-1">Llevaremos el pedido a tu dirección.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-primary" /> Pago
              </h2>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-800 text-sm">
                <div className="shrink-0 mt-0.5">
                  <CheckCircle size={16} />
                </div>
                <p><strong>Pagas al recibir.</strong> Coordinarás el método de pago directamente con la tienda (Efectivo, Yape, Plin o Tarjeta) al momento de recoger tu pedido.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm sticky top-24">
              <h2 className="text-lg font-bold mb-4 border-b border-border pb-4">Resumen del Pedido</h2>
              <div className="mb-4 text-sm font-medium text-muted-foreground">
                Tienda: <span className="text-foreground font-bold">{storeName}</span>
              </div>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-muted/30 rounded-lg flex items-center justify-center text-xl shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">{item.name}</h4>
                        <span className="text-xs text-muted-foreground">Cant: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-sm shrink-0">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Subtotal</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 text-sm font-medium">
                  <span>Envío (Recojo)</span>
                  <span>S/ 0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                  <span>Total a pagar</span>
                  <span className="text-primary">S/ {total.toFixed(2)}</span>
                </div>
              </div>
              <form onSubmit={handleConfirm}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar pedido"
                  )}
                </button>
              </form>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Al confirmar aceptas los términos y condiciones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
