import { useState } from "react";
import { Link } from "wouter";
import { 
  LayoutDashboard, 
  Store as StoreIcon, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  ArrowLeft,
  TrendingUp,
  Activity,
  DollarSign,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { FEATURED_STORES, PRODUCTS } from "@/data/mock";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stores' | 'orders'>('dashboard');

  const stats = [
    { label: "Pedidos hoy", value: "248", icon: <ShoppingCart size={20} />, trend: "+12%", color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Ingresos hoy", value: "S/ 12,450", icon: <DollarSign size={20} />, trend: "+8%", color: "text-green-600", bg: "bg-green-100" },
    { label: "Tiendas activas", value: "52", icon: <StoreIcon size={20} />, trend: "+2", color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Usuarios", value: "1,240", icon: <Users size={20} />, trend: "+24", color: "text-orange-600", bg: "bg-orange-100" },
  ];

  const recentOrders = [
    { id: "1005", customer: "Ana María Soto", store: "Pizzería La Bella", total: 45.00, status: "Completado", date: "Hace 10 min" },
    { id: "1004", customer: "Carlos Vega", store: "TecnoMundo", total: 120.00, status: "En proceso", date: "Hace 25 min" },
    { id: "1003", customer: "Lucía Castro", store: "Supermercado El Ahorro", total: 68.50, status: "Pendiente", date: "Hace 42 min" },
    { id: "1002", customer: "Martín Rivas", store: "Farmacia Vida", total: 15.00, status: "Completado", date: "Hace 1 hora" },
    { id: "1001", customer: "Jorge Pérez", store: "Frutería San José", total: 22.00, status: "Cancelado", date: "Hace 2 horas" },
    { id: "1000", customer: "Sofía Luna", store: "Moda Express", total: 85.00, status: "Completado", date: "Hace 3 horas" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completado': return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 size={12}/> Completado</span>;
      case 'En proceso': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Activity size={12}/> En proceso</span>;
      case 'Pendiente': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Clock size={12}/> Pendiente</span>;
      case 'Cancelado': return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><XCircle size={12}/> Cancelado</span>;
      default: return <span>{status}</span>;
    }
  };

  // Chart data
  const chartData = [40, 65, 45, 80, 55, 90, 75];
  const maxVal = Math.max(...chartData);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="text-white hover:text-white flex items-center gap-2 font-display font-bold text-xl mb-4 group">
            <div className="bg-primary text-white p-1 rounded-lg group-hover:scale-105 transition-transform">
              <ShoppingCart size={20} />
            </div>
            mercanto <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-sans tracking-wide">ADMIN</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Volver a la tienda
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('stores')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'stores' ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <StoreIcon size={20} /> Tiendas
          </button>
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 hover:text-white"
          >
            <Package size={20} /> Productos
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <ShoppingCart size={20} /> Pedidos
          </button>
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 hover:text-white"
          >
            <Users size={20} /> Usuarios
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 hover:text-white">
            <Settings size={20} /> Configuración
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-screen p-4 md:p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize font-display">
              {activeTab}
            </h1>
            <p className="text-slate-500 text-sm">Resumen y gestión de la plataforma</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Sistema Operativo
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold">
              AD
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
                      <TrendingUp size={12} /> {stat.trend}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
                    <p className="text-2xl font-bold text-slate-900 font-display">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Table */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="font-bold text-slate-900">Pedidos Recientes</h2>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-primary font-semibold hover:underline">Ver todos</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">Tienda</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentOrders.map((order, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
                          <td className="px-6 py-4 text-slate-700">{order.customer}</td>
                          <td className="px-6 py-4 text-slate-600">{order.store}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">S/ {order.total.toFixed(2)}</td>
                          <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                <h2 className="font-bold text-slate-900 mb-6">Ventas por Día (Últimos 7 días)</h2>
                
                <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto pt-4 border-b border-slate-100 pb-2">
                  {chartData.map((val, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-full group">
                      <div className="relative w-full flex justify-center h-full items-end">
                        <div 
                          className="w-full max-w-[2rem] bg-primary/20 hover:bg-primary rounded-t-sm transition-all duration-300"
                          style={{ height: `${(val / maxVal) * 100}%` }}
                        ></div>
                        <div className="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          S/{val}k
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="animate-in fade-in duration-300 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="font-bold text-slate-900">Directorio de Tiendas</h2>
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors">
                + Agregar tienda
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Tienda</th>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4">Productos</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {FEATURED_STORES.map((store) => {
                    const productCount = PRODUCTS.filter(p => p.storeId === store.id).length;
                    return (
                      <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${store.gradient} flex items-center justify-center text-sm`}>
                              {store.icon}
                            </div>
                            <span className="font-bold text-slate-900">{store.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{store.category}</td>
                        <td className="px-6 py-4 font-medium">{productCount} items</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">Activa</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-100">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="animate-in fade-in duration-300 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="font-bold text-slate-900">Gestión de Pedidos</h2>
              <div className="flex gap-2">
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary">
                  <option>Todos los estados</option>
                  <option>Pendientes</option>
                  <option>En proceso</option>
                  <option>Completados</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">ID / Fecha</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Tienda</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">#{order.id}</div>
                        <div className="text-xs text-slate-500">{order.date}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{order.customer}</td>
                      <td className="px-6 py-4 text-slate-600">{order.store}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">S/ {order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary text-sm font-semibold hover:underline">Ver detalle</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
