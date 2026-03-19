import { useState } from "react";
import { User, Package, MapPin, CreditCard, ChevronRight, CheckCircle2, Clock, Map } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  const orders = [
    {
      id: '1001',
      store: 'Supermercado El Ahorro',
      items: [
        { name: 'Arroz Costeño 5kg', qty: 1, price: 18.50 },
        { name: 'Aceite Primor 1L', qty: 1, price: 9.80 },
        { name: 'Leche Gloria', qty: 1, price: 4.40 }
      ],
      total: 32.70,
      status: 'Completado',
      statusColor: 'bg-green-100 text-green-700',
      icon: <CheckCircle2 size={16} />,
      date: '15 Mar 2026'
    },
    {
      id: '1002',
      store: 'Pizzería La Bella',
      items: [
        { name: 'Pizza Americana', qty: 1, price: 25.00 },
        { name: 'Pizza Pepperoni', qty: 1, price: 28.00 }
      ],
      total: 53.00,
      status: 'Completado',
      statusColor: 'bg-green-100 text-green-700',
      icon: <CheckCircle2 size={16} />,
      date: '12 Mar 2026'
    },
    {
      id: '1003',
      store: 'Frutería San José',
      items: [
        { name: 'Manzana Israel x Kg', qty: 2, price: 11.00 },
        { name: 'Plátano Seda x Kg', qty: 1, price: 3.50 },
        { name: 'Papaya x Kg', qty: 1, price: 4.00 },
        { name: 'Limón x Kg', qty: 0.5, price: 3.25 }
      ],
      total: 21.75,
      status: 'En proceso',
      statusColor: 'bg-yellow-100 text-yellow-700',
      icon: <Clock size={16} />,
      date: '18 Mar 2026'
    },
    {
      id: '1004',
      store: 'TecnoMundo',
      items: [
        { name: 'Audífonos Bluetooth', qty: 1, price: 89.00 }
      ],
      total: 89.00,
      status: 'Listo para recojo',
      statusColor: 'bg-blue-100 text-blue-700',
      icon: <MapPin size={16} />,
      date: '19 Mar 2026'
    }
  ];

  return (
    <div className="bg-background min-h-[calc(100vh-80px)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <h1 className="text-3xl font-display font-bold mb-8">Mi Cuenta</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'profile' 
                  ? 'border-b-2 border-primary text-primary bg-primary/5' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <User size={18} />
              Mi Perfil
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'orders' 
                  ? 'border-b-2 border-primary text-primary bg-primary/5' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Package size={18} />
              Mis Pedidos
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'profile' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-rose-400 flex items-center justify-center text-4xl font-display font-bold text-white shadow-lg">
                      JR
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Juan Rodriguez</h2>
                      <p className="text-muted-foreground">juan.rodriguez@gmail.com</p>
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                      <MapPin size={18} />
                      <span>Miraflores, Lima</span>
                    </div>

                    <button className="px-6 py-2 bg-muted hover:bg-accent hover:text-primary text-foreground font-semibold rounded-xl transition-colors">
                      Editar perfil
                    </button>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                      <Package size={24} />
                    </div>
                    <span className="text-3xl font-bold text-blue-900">5</span>
                    <span className="text-sm font-medium text-blue-700">Pedidos realizados</span>
                  </div>
                  
                  <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                      <Map size={24} />
                    </div>
                    <span className="text-3xl font-bold text-orange-900">3</span>
                    <span className="text-sm font-medium text-orange-700">Tiendas favoritas</span>
                  </div>

                  <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                      <CreditCard size={24} />
                    </div>
                    <span className="text-3xl font-bold text-green-900">S/ 248.50</span>
                    <span className="text-sm font-medium text-green-700">Gastados</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-border rounded-2xl overflow-hidden group hover:border-primary/30 transition-colors">
                    <div className="p-5 bg-muted/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-lg">Orden #{order.id}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${order.statusColor}`}>
                            {order.icon}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.date} • {order.store}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                        <span className="text-xl font-bold text-foreground">S/ {order.total.toFixed(2)}</span>
                        <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                          Ver recibo <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-5 bg-white border-t border-border">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Artículos ({order.items.length})</h4>
                      <ul className="space-y-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm">
                            <div className="flex gap-3">
                              <span className="text-muted-foreground font-medium w-6">{item.qty}x</span>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <span className="text-muted-foreground">S/ {item.price.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
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
