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

<<<<<<< HEAD
=======
interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ============================================================================
// HELPERS
// ============================================================================
const apiFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Error en la solicitud");
  return data;
};

const formatCurrency = (value: number | string) =>
  `S/ ${parseFloat(String(value)).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 size={12} aria-hidden="true" /> Entregado</span>;
    case "confirmed":
      return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Activity size={12} aria-hidden="true" /> Confirmado</span>;
    case "shipped":
      return <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Package size={12} aria-hidden="true" /> Enviado</span>;
    case "pending":
      return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Clock size={12} aria-hidden="true" /> Pendiente</span>;
    case "cancelled":
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><XCircle size={12} aria-hidden="true" /> Cancelado</span>;
    default:
      return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold w-max">{status}</span>;
  }
};

const getStoreStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 size={12} aria-hidden="true" /> Aprobada</span>;
    case "pending":
      return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Clock size={12} aria-hidden="true" /> Pendiente</span>;
    case "rejected":
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><XCircle size={12} aria-hidden="true" /> Rechazada</span>;
    default:
      return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold w-max">{status}</span>;
  }
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
>>>>>>> f4f6938 (Feat: Pasada de calidad final al frontend (SEO, A11y, textos, tests))
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

<<<<<<< HEAD
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
=======
  // Redireccionar si no es admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return null; // O un loader/mensaje de acceso denegado
  }

  const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const chartData = dashboardData?.dailyRevenue || [];
  const maxVal = Math.max(...chartData.map(d => parseFloat(d.total)), 0);
>>>>>>> f4f6938 (Feat: Pasada de calidad final al frontend (SEO, A11y, textos, tests))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
<<<<<<< HEAD
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
=======
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col border-r border-gray-200">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="p-2 bg-white rounded-full shadow-sm hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Volver al inicio">
            <ArrowLeft size={20} aria-hidden="true" />
>>>>>>> f4f6938 (Feat: Pasada de calidad final al frontend (SEO, A11y, textos, tests))
          </Link>
          <h2 className="text-2xl font-display font-bold text-gray-800">Admin</h2>
        </div>
<<<<<<< HEAD

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
=======
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${activeTab === "dashboard" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-700 hover:bg-gray-100"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                aria-current={activeTab === "dashboard" ? "page" : undefined}
              >
                <LayoutDashboard size={20} aria-hidden="true" />
                <span className="font-medium">Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("stores")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${activeTab === "stores" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-700 hover:bg-gray-100"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                aria-current={activeTab === "stores" ? "page" : undefined}
              >
                <StoreIcon size={20} aria-hidden="true" />
                <span className="font-medium">Tiendas</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${activeTab === "orders" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-700 hover:bg-gray-100"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                aria-current={activeTab === "orders" ? "page" : undefined}
              >
                <Package size={20} aria-hidden="true" />
                <span className="font-medium">Pedidos</span>
              </button>
            </li>
            {/* Placeholder para futuras secciones */}
            <li>
              <button
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-gray-400 cursor-not-allowed"
                disabled
              >
                <ShoppingCart size={20} aria-hidden="true" />
                <span className="font-medium">Productos (próximamente)</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-gray-400 cursor-not-allowed"
                disabled
              >
                <Users size={20} aria-hidden="true" />
                <span className="font-medium">Usuarios (próximamente)</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-gray-400 cursor-not-allowed"
                disabled
              >
                <Settings size={20} aria-hidden="true" />
                <span className="font-medium">Configuración (próximamente)</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="mt-8">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <LogOut size={20} aria-hidden="true" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
>>>>>>> f4f6938 (Feat: Pasada de calidad final al frontend (SEO, A11y, textos, tests))
        </div>
      </aside>

      {/* Main Content */}
<<<<<<< HEAD
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
=======
      <main className="flex-1 p-8 overflow-auto">
        {/* ================================================================
            DASHBOARD TAB
        ================================================================ */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">Dashboard</h1>

            {dashboardLoading && (
              <div className="flex items-center justify-center py-20">
                <RefreshCw size={32} className="animate-spin text-primary" aria-hidden="true" />
                <span className="ml-3 text-gray-600">Cargando dashboard...</span>
              </div>
            )}

            {dashboardError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3" role="alert">
                <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-red-900">Error al cargar el Dashboard</h3>
                  <p className="text-sm text-red-700">{dashboardError}</p>
                  <button onClick={fetchDashboard} className="mt-2 text-sm font-medium underline text-red-700 hover:text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded">
                    Reintentar
                  </button>
                </div>
              </div>
            )}

            {!dashboardLoading && !dashboardError && dashboardData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600" aria-hidden="true">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Ventas Totales</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(dashboardData.revenue.total)}</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-100 text-purple-600" aria-hidden="true">
                      <ShoppingCart size={20} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Pedidos Totales</p>
                      <p className="text-2xl font-bold text-slate-900">{dashboardData.orders.total}</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-orange-100 text-orange-600" aria-hidden="true">
                      <StoreIcon size={20} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Tiendas Activas</p>
                      <p className="text-2xl font-bold text-slate-900">{dashboardData.stores.approved}</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-teal-100 text-teal-600" aria-hidden="true">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Usuarios Registrados</p>
                      <p className="text-2xl font-bold text-slate-900">{dashboardData.users.total}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Stores Overview */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-slate-900">Resumen de Tiendas</h2>
                      {dashboardData.stores.pending > 0 && (
                        <button
                          onClick={() => { setActiveTab("stores"); setStoresStatusFilter("pending"); }}
                          className="ml-auto text-sm text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          Revisar pendientes
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600" aria-hidden="true">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm">Tiendas pendientes</p>
                          <p className="text-2xl font-bold text-slate-900">{dashboardData.stores.pending}</p>
                        </div>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-green-100 text-green-600" aria-hidden="true">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm">Tiendas aprobadas</p>
                          <p className="text-2xl font-bold text-slate-900">{dashboardData.stores.approved}</p>
                        </div>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-100 text-red-600" aria-hidden="true">
                          <XCircle size={20} />
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm">Tiendas rechazadas</p>
                          <p className="text-2xl font-bold text-slate-900">{dashboardData.stores.rejected}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Orders Overview */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-slate-900">Resumen de Pedidos</h2>
                      {dashboardData.orders.pending > 0 && (
                        <button
                          onClick={() => { setActiveTab("orders"); setOrdersStatusFilter("pending"); }}
                          className="ml-auto text-sm text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          Revisar pendientes
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600" aria-hidden="true">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm">Pedidos pendientes</p>
                          <p className="text-2xl font-bold text-slate-900">{dashboardData.orders.pending}</p>
                        </div>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-100 text-blue-600" aria-hidden="true">
                          <Activity size={20} />
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm">Pedidos confirmados</p>
                          <p className="text-2xl font-bold text-slate-900">{dashboardData.orders.confirmed}</p>
                        </div>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-green-100 text-green-600" aria-hidden="true">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm">Pedidos entregados</p>
                          <p className="text-2xl font-bold text-slate-900">{dashboardData.orders.delivered}</p>
                        </div>
                      </div>
>>>>>>> f4f6938 (Feat: Pasada de calidad final al frontend (SEO, A11y, textos, tests))
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Orders Table */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="font-bold text-slate-900">Pedidos Recientes</h2>
<<<<<<< HEAD
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
=======
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-sm text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                      >
                        Ver todos
                      </button>
                    </div>
                    {dashboardData.recentOrders.length === 0 ? (
                      <div className="p-10 text-center text-slate-400">
                        <ShoppingCart size={32} className="mx-auto mb-3 opacity-40" aria-hidden="true" />
                        <p>No hay pedidos registrados</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left" role="table" aria-label="Pedidos recientes">
                          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                              <th scope="col" className="px-6 py-4">ID</th>
                              <th scope="col" className="px-6 py-4">Cliente</th>
                              <th scope="col" className="px-6 py-4">Tienda</th>
                              <th scope="col" className="px-6 py-4">Total</th>
                              <th scope="col" className="px-6 py-4">Estado</th>
>>>>>>> f4f6938 (Feat: Pasada de calidad final al frontend (SEO, A11y, textos, tests))
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                    <h2 className="font-bold text-slate-900 mb-6">Ventas por Día (Últimos 7 días)</h2>
<<<<<<< HEAD
                    
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
=======
                    {chartData.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                        Sin datos de ventas
                      </div>
                    ) : (
                      <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto pt-4 border-b border-slate-100 pb-2" aria-label="Gráfico de ventas por día">
                        {chartData.map((d, i) => {
                          const val = parseFloat(d.total);
                          const date = new Date(d.day);
                          const dayLabel = dayLabels[date.getDay()] ?? String(i);
                          return (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group" role="graphics-document" aria-label={`Ventas del ${dayLabel}: ${formatCurrency(val)}`}>
                              <div className="relative w-full flex justify-center h-full items-end">
                                <div
                                  className="w-full max-w-[2rem] bg-primary/20 hover:bg-primary rounded-t-sm transition-all duration-300"
                                  style={{ height: `${(val / maxVal) * 100}%`, minHeight: "4px" }}
                                  aria-hidden="true"
                                />
                                <div className="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {formatCurrency(val)}
                                </div>
>>>>>>> f4f6938 (Feat: Pasada de calidad final al frontend (SEO, A11y, textos, tests))
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
<<<<<<< HEAD
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
=======
              <h2 className="font-bold text-slate-900">Directorio de Tiendas</h2>
              <div className="flex items-center gap-3">
                <label htmlFor="store-status-filter" className="sr-only">Filtrar por estado</label>
                <select
                  id="store-status-filter"
                  value={storesStatusFilter}
                  onChange={(e) => { setStoresStatusFilter(e.target.value); setStoresPage(1); }}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="approved">Aprobadas</option>
                  <option value="rejected">Rechazadas</option>
                </select>
                <button
                  onClick={() => fetchStores(storesPage, storesStatusFilter)}
                  className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  title="Actualizar lista de tiendas"
                  aria-label="Actualizar lista de tiendas"
                >
                  <RefreshCw size={16} className={storesLoading ? "animate-spin" : ""} aria-hidden="true" />
                </button>
              </div>
            </div>

            {storesLoading && (
              <div className="flex items-center justify-center py-20" role="status">
                <RefreshCw size={28} className="animate-spin text-primary" aria-hidden="true" />
                <span className="ml-3 text-slate-500">Cargando tiendas...</span>
              </div>
            )}

            {storesError && (
              <div className="p-6 flex items-center gap-3 text-red-600 bg-red-50" role="alert">
                <AlertCircle size={18} aria-hidden="true" />
                <span>{storesError}</span>
                <button onClick={() => fetchStores(storesPage, storesStatusFilter)} className="ml-auto text-sm font-medium underline text-red-700 hover:text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded">
                  Reintentar
                </button>
              </div>
            )}

            {!storesLoading && !storesError && (
              <>
                {storesList.length === 0 ? (
                  <div className="p-16 text-center text-slate-400">
                    <StoreIcon size={40} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
                    <p className="font-medium">No hay tiendas registradas</p>
                    <p className="text-sm mt-1">
                      {storesStatusFilter ? `No hay tiendas con estado "${storesStatusFilter}"` : "Aún no se han creado tiendas en la plataforma"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left" role="table" aria-label="Directorio de tiendas">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                          <th scope="col" className="px-6 py-4">Tienda</th>
                          <th scope="col" className="px-6 py-4">Propietario</th>
                          <th scope="col" className="px-6 py-4">Ciudad</th>
                          <th scope="col" className="px-6 py-4">Estado</th>
                          <th scope="col" className="px-6 py-4">Registro</th>
                          <th scope="col" className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {storesList.map((store) => (
                          <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-sm shrink-0" aria-hidden="true">
                                  {store.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{store.name}</p>
                                  <p className="text-xs text-slate-400">{store.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-700">{store.owner_name ?? "—"}</p>
                              <p className="text-xs text-slate-400">{store.owner_email ?? ""}</p>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{store.city ?? "—"}</td>
                            <td className="px-6 py-4">{getStoreStatusBadge(store.status)}</td>
                            <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(store.created_at)}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                {store.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => handleStoreAction(store.id, "approve")}
                                      disabled={actionLoading === store.id}
                                      className="px-3 py-1.5 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                                    >
                                      {actionLoading === store.id ? "Aprobando..." : "Aprobar"}
                                    </button>
                                    <button
                                      onClick={() => handleStoreAction(store.id, "reject")}
                                      disabled={actionLoading === store.id}
                                      className="px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                    >
                                      {actionLoading === store.id ? "Rechazando..." : "Rechazar"}
                                    </button>
                                  </>
                                )}
                                {store.status === "approved" && (
                                  <button
                                    onClick={() => handleStoreAction(store.id, "reject")}
                                    disabled={actionLoading === store.id}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                  >
                                    {actionLoading === store.id ? "Rechazando..." : "Rechazar"}
                                  </button>
                                )}
                                {store.status === "rejected" && (
                                  <button
                                    onClick={() => handleStoreAction(store.id, "approve")}
                                    disabled={actionLoading === store.id}
                                    className="px-3 py-1.5 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                                  >
                                    {actionLoading === store.id ? "Aprobando..." : "Aprobar"}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {storesPagination.pages > 1 && (
                  <div className="p-6 flex justify-end items-center gap-4 border-t border-slate-100">
                    <span className="text-sm text-slate-600">Página {storesPagination.page} de {storesPagination.pages}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setStoresPage(prev => Math.max(1, prev - 1))}
                        disabled={storesPagination.page === 1}
                        className="p-2 bg-slate-100 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Página anterior"
                      >
                        <ChevronLeft size={16} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setStoresPage(prev => Math.min(storesPagination.pages, prev + 1))}
                        disabled={storesPagination.page === storesPagination.pages}
                        className="p-2 bg-slate-100 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Página siguiente"
                      >
                        <ChevronRight size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </>
>>>>>>> f4f6938 (Feat: Pasada de calidad final al frontend (SEO, A11y, textos, tests))
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in duration-300 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
<<<<<<< HEAD
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
=======
              <h2 className="font-bold text-slate-900">Historial de Pedidos</h2>
              <div className="flex items-center gap-3">
                <label htmlFor="order-status-filter" className="sr-only">Filtrar por estado</label>
                <select
                  id="order-status-filter"
                  value={ordersStatusFilter}
                  onChange={(e) => { setOrdersStatusFilter(e.target.value); setOrdersPage(1); }}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="delivered">Entregados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
                <button
                  onClick={() => fetchOrders(ordersPage, ordersStatusFilter)}
                  className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  title="Actualizar lista de pedidos"
                  aria-label="Actualizar lista de pedidos"
                >
                  <RefreshCw size={16} className={ordersLoading ? "animate-spin" : ""} aria-hidden="true" />
                </button>
              </div>
            </div>

            {ordersLoading && (
              <div className="flex items-center justify-center py-20" role="status">
                <RefreshCw size={28} className="animate-spin text-primary" aria-hidden="true" />
                <span className="ml-3 text-slate-500">Cargando pedidos...</span>
              </div>
            )}

            {ordersError && (
              <div className="p-6 flex items-center gap-3 text-red-600 bg-red-50" role="alert">
                <AlertCircle size={18} aria-hidden="true" />
                <span>{ordersError}</span>
                <button onClick={() => fetchOrders(ordersPage, ordersStatusFilter)} className="ml-auto text-sm font-medium underline text-red-700 hover:text-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded">
                  Reintentar
                </button>
              </div>
            )}

            {!ordersLoading && !ordersError && (
              <>
                {ordersList.length === 0 ? (
                  <div className="p-16 text-center text-slate-400">
                    <Package size={40} className="mx-auto mb-4 opacity-30" aria-hidden="true" />
                    <p className="font-medium">No hay pedidos registrados</p>
                    <p className="text-sm mt-1">
                      {ordersStatusFilter ? `No hay pedidos con estado "${ordersStatusFilter}"` : "Aún no se han realizado pedidos en la plataforma"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left" role="table" aria-label="Historial de pedidos">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                          <th scope="col" className="px-6 py-4">ID</th>
                          <th scope="col" className="px-6 py-4">Cliente</th>
                          <th scope="col" className="px-6 py-4">Tienda</th>
                          <th scope="col" className="px-6 py-4">Total</th>
                          <th scope="col" className="px-6 py-4">Estado</th>
                          <th scope="col" className="px-6 py-4">Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {ordersList.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
                            <td className="px-6 py-4 text-slate-700">{order.user_name ?? "—"}</td>
                            <td className="px-6 py-4 text-slate-600">{order.store_name ?? "—"}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(order.total_amount)}</td>
                            <td className="px-6 py-4">{getOrderStatusBadge(order.status)}</td>
                            <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(order.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {ordersPagination.pages > 1 && (
                  <div className="p-6 flex justify-end items-center gap-4 border-t border-slate-100">
                    <span className="text-sm text-slate-600">Página {ordersPagination.page} de {ordersPagination.pages}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOrdersPage(prev => Math.max(1, prev - 1))}
                        disabled={ordersPagination.page === 1}
                        className="p-2 bg-slate-100 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Página anterior"
                      >
                        <ChevronLeft size={16} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setOrdersPage(prev => Math.min(ordersPagination.pages, prev + 1))}
                        disabled={ordersPagination.page === ordersPagination.pages}
                        className="p-2 bg-slate-100 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Página siguiente"
                      >
                        <ChevronRight size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
>>>>>>> f4f6938 (Feat: Pasada de calidad final al frontend (SEO, A11y, textos, tests))
    </div>
  );
}
