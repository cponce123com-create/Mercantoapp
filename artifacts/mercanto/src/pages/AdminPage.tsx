import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/AuthContext";
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
  Clock,
  AlertCircle,
  Loader,
  Check,
  X
} from "lucide-react";

interface DashboardMetrics {
  totalOrdersToday: number;
  totalRevenueToday: number;
  totalActiveStores: number;
  totalUsers: number;
  pendingStores: number;
  statusBreakdown: Array<{ status: string; count: number }>;
  salesByDay: Array<{ date: string; total: number }>;
}

interface Store {
  id: number;
  name: string;
  email: string;
  status: string;
  is_active: boolean;
  created_at: string;
  owner_id: number;
}

interface Order {
  id: number;
  user_id: number;
  store_id: number;
  status: string;
  total_amount: string;
  created_at: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stores' | 'orders'>('dashboard');
  
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Fetch dashboard metrics
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard/metrics');
      const data = await res.json();
      if (res.ok) {
        setMetrics(data.data);
      } else {
        setError(data.error || 'Error al cargar métricas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending stores
  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stores?status=pending&limit=100');
      const data = await res.json();
      if (res.ok) {
        setStores(data.data);
      } else {
        setError(data.error || 'Error al cargar tiendas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders/recent?limit=20');
      const data = await res.json();
      if (res.ok) {
        setOrders(data.data);
      } else {
        setError(data.error || 'Error al cargar pedidos');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchMetrics();
    } else if (activeTab === 'stores') {
      fetchStores();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const approveStore = async (storeId: number) => {
    try {
      setActionLoading(storeId);
      const res = await fetch(`/api/stores/${storeId}/approve`, { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        setStores(stores.map(s => s.id === storeId ? { ...s, status: 'approved' } : s));
      } else {
        setError(data.error || 'Error al aprobar tienda');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setActionLoading(null);
    }
  };

  const rejectStore = async (storeId: number) => {
    try {
      setActionLoading(storeId);
      const res = await fetch(`/api/stores/${storeId}/reject`, { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        setStores(stores.map(s => s.id === storeId ? { ...s, status: 'rejected' } : s));
      } else {
        setError(data.error || 'Error al rechazar tienda');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'Completado':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 size={12}/> Completado</span>;
      case 'pending':
      case 'En proceso':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Clock size={12}/> Pendiente</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Activity size={12}/> Confirmado</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Activity size={12}/> Enviado</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 size={12}/> Entregado</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><XCircle size={12}/> Cancelado</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold">{status}</span>;
    }
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 size={12}/> Aprobada</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><XCircle size={12}/> Rechazada</span>;
      case 'pending':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Clock size={12}/> Pendiente</span>;
      default:
        return <span>{status}</span>;
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-6">Solo los administradores pueden acceder a este panel.</p>
          <Link href="/" className="px-6 py-2 bg-primary text-white rounded-xl font-bold">Volver al inicio</Link>
        </div>
      </div>
    );
  }

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
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <ShoppingCart size={20} /> Pedidos
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
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
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
            <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size={32} className="animate-spin text-primary" />
              </div>
            ) : metrics ? (
              <>
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                        <ShoppingCart size={20} />
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
                        <TrendingUp size={12} /> Hoy
                      </span>
                    </div>
                    <div>
                      <h3 className="text-slate-500 text-sm font-medium mb-1">Pedidos hoy</h3>
                      <p className="text-2xl font-bold text-slate-900 font-display">{metrics.totalOrdersToday}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-green-100 text-green-600">
                        <DollarSign size={20} />
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
                        <TrendingUp size={12} /> Hoy
                      </span>
                    </div>
                    <div>
                      <h3 className="text-slate-500 text-sm font-medium mb-1">Ingresos hoy</h3>
                      <p className="text-2xl font-bold text-slate-900 font-display">S/ {metrics.totalRevenueToday.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                        <StoreIcon size={20} />
                      </div>
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                        {metrics.pendingStores} pendientes
                      </span>
                    </div>
                    <div>
                      <h3 className="text-slate-500 text-sm font-medium mb-1">Tiendas activas</h3>
                      <p className="text-2xl font-bold text-slate-900 font-display">{metrics.totalActiveStores}</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                        <Users size={20} />
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
                        <TrendingUp size={12} /> Activos
                      </span>
                    </div>
                    <div>
                      <h3 className="text-slate-500 text-sm font-medium mb-1">Usuarios</h3>
                      <p className="text-2xl font-bold text-slate-900 font-display">{metrics.totalUsers}</p>
                    </div>
                  </div>
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
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {metrics.statusBreakdown.slice(0, 5).map((item, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-900">#{i + 1000}</td>
                              <td className="px-6 py-4 text-slate-700">Usuario {i + 1}</td>
                              <td className="px-6 py-4 font-bold text-slate-900">S/ {(Math.random() * 200).toFixed(2)}</td>
                              <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
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
                      {metrics.salesByDay.map((day, i) => {
                        const maxSale = Math.max(...metrics.salesByDay.map(d => d.total), 1);
                        return (
                          <div key={i} className="flex flex-col items-center gap-2 w-full group">
                            <div className="relative w-full flex justify-center h-full items-end">
                              <div 
                                className="w-full max-w-[2rem] bg-primary/20 hover:bg-primary rounded-t-sm transition-all duration-300"
                                style={{ height: `${(day.total / maxSale) * 100}%` || '5%' }}
                              ></div>
                              <div className="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                S/{day.total.toFixed(0)}
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">
                              {new Date(day.date).toLocaleDateString('es-PE', { weekday: 'short' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <div className="animate-in fade-in duration-300 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="font-bold text-slate-900">Tiendas Pendientes de Aprobación</h2>
              <div className="text-sm text-slate-600">
                {stores.length} tienda{stores.length !== 1 ? 's' : ''} pendiente{stores.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size={32} className="animate-spin text-primary" />
              </div>
            ) : stores.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500" />
                <p className="text-slate-600">No hay tiendas pendientes de aprobación</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Tienda</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stores.map((store) => (
                      <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900">{store.name}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{store.email}</td>
                        <td className="px-6 py-4">
                          {getApprovalStatusBadge(store.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => approveStore(store.id)}
                              disabled={actionLoading === store.id || store.status !== 'pending'}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Aprobar tienda"
                            >
                              {actionLoading === store.id ? (
                                <Loader size={16} className="animate-spin" />
                              ) : (
                                <Check size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => rejectStore(store.id)}
                              disabled={actionLoading === store.id || store.status !== 'pending'}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Rechazar tienda"
                            >
                              {actionLoading === store.id ? (
                                <Loader size={16} className="animate-spin" />
                              ) : (
                                <X size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in duration-300 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="font-bold text-slate-900">Gestión de Pedidos</h2>
              <div className="text-sm text-slate-600">
                {orders.length} pedido{orders.length !== 1 ? 's' : ''} reciente{orders.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size={32} className="animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingCart size={48} className="mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600">No hay pedidos registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {new Date(order.created_at).toLocaleDateString('es-PE')}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">S/ {parseFloat(order.total_amount).toFixed(2)}</td>
                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
