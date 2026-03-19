import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
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
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useAuth, API_URL } from "@/lib/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ============================================================================
// TIPOS
// ============================================================================
interface DashboardStores {  
total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface DashboardOrders {
  total: number;
  pending: number;
  confirmed: number;
  delivered: number;
  cancelled: number;
}

interface RecentOrder {
  id: number;
  status: string;
  total_amount: string;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
  store_name: string | null;
  store_id: number;
  user_id: number;
}

interface DailyRevenue {
  day: string;
  total: string;
  count: number;
}

interface DashboardData {
  stores: DashboardStore;
  orders: DashboardOrders;
  revenue: { total: number };
  users: { total: number };
  products: { total: number };
  recentOrders: RecentOrder[];
  dailyRevenue: DailyRevenue[];
}

interface AdminStore {
  id: number;
  name: string;
  description: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  logo_url: string | null;
  status: "pending" | "approved" | "rejected";
  is_active: boolean;
  created_at: string;
  owner_id: number;
  owner_name: string | null;
  owner_email: string | null;
}

interface AdminOrder {
  id: number;
  status: string;
  total_amount: string;
  shipping_address: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  store_id: number;
  user_name: string | null;
  user_email: string | null;
  store_name: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ============================================================================
// HELPERS
// ============================================================================
const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options,
  });
  
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(`Error del servidor: Se esperaba JSON pero se recibió ${contentType || 'nada'}. Verifica la URL de la API.`);
  }

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
      return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 size={12} /> Entregado</span>;
    case "confirmed":
      return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Activity size={12} /> Confirmado</span>;
    case "shipped":
      return <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Package size={12} /> Enviado</span>;
    case "pending":
      return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Clock size={12} /> Pendiente</span>;
    case "cancelled":
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><XCircle size={12} /> Cancelado</span>;
    default:
      return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold w-max">{status}</span>;
  }
};

const getStoreStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><CheckCircle2 size={12} /> Aprobada</span>;
    case "pending":
      return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><Clock size={12} /> Pendiente</span>;
    case "rejected":
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold flex items-center gap-1 w-max"><XCircle size={12} /> Rechazada</span>;
    default:
      return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold w-max">{status}</span>;
  }
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function AdminPage() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"dashboard" | "stores" | "orders">("dashboard");

  // Dashboard
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Stores
  const [storesList, setStoresList] = useState<AdminStore[]>([]);
  const [storesPagination, setStoresPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, pages: 1 });
  const [storesLoading, setStoresLoading] = useState(false);
  const [storesError, setStoresError] = useState<string | null>(null);
  const [storesPage, setStoresPage] = useState(1);
  const [storesStatusFilter, setStoresStatusFilter] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Store Editing
  const [editingStore, setEditingStore] = useState<AdminStore | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Orders
  const [ordersList, setOrdersList] = useState<AdminOrder[]>([]);
  const [ordersPagination, setOrdersPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, pages: 1 });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersStatusFilter, setOrdersStatusFilter] = useState<string>("");

  // ============================================================================
  // FETCH FUNCTIONS
  // ============================================================================
  const fetchDashboard = useCallback(async () => {
    setDashboardLoading(true);
    setDashboardError(null);
    try {
      const data = await apiFetch("/api/admin/dashboard");
      setDashboardData(data.data);
    } catch (err: any) {
      setDashboardError(err.message ?? "Error al cargar el dashboard");
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const fetchStores = useCallback(async (page: number, status: string) => {
    setStoresLoading(true);
    setStoresError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (status) params.set("status", status);
      const data = await apiFetch(`/api/admin/stores?${params.toString()}`);
      setStoresList(data.data);
      setStoresPagination(data.pagination);
    } catch (err: any) {
      setStoresError(err.message ?? "Error al cargar tiendas");
    } finally {
      setStoresLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async (page: number, status: string) => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (status) params.set("status", status);
      const data = await apiFetch(`/api/admin/orders?${params.toString()}`);
      setOrdersList(data.data);
      setOrdersPagination(data.pagination);
    } catch (err: any) {
      setOrdersError(err.message ?? "Error al cargar pedidos");
      } finally {
      setActionLoading(false);
    }
  },[]);

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;

    setEditLoading(true);
    try {
      await apiFetch(`/api/admin/stores/${editingStore.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editingStore.name,
          description: editingStore.description,
          email: editingStore.email,
          phone: editingStore.phone,
          address: editingStore.address,
          city: editingStore.city,
          country: editingStore.country,
          is_active: editingStore.is_active,
        }),
      });

      toast({
        title: "Tienda actualizada",
        description: "Los cambios han sido guardados correctamente.",
      });

      // Actualizar lista local
      setStoresList((prev) =>
        prev.map((s) => (s.id === editingStore.id ? editingStore : s))
      );
      setIsEditModalOpen(false);
      setEditingStore(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message ?? "No se pudo actualizar la tienda",
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================
  useEffect(() => {
    if (activeTab === "dashboard") fetchDashboard();
  }, [activeTab, fetchDashboard]);

  useEffect(() => {
    if (activeTab === "stores") fetchStores(storesPage, storesStatusFilter);
  }, [activeTab, storesPage, storesStatusFilter, fetchStores]);

  useEffect(() => {
    if (activeTab === "orders") fetchOrders(ordersPage, ordersStatusFilter);
  }, [activeTab, ordersPage, ordersStatusFilter, fetchOrders]);

  // ============================================================================
  // ACTIONS
  // ============================================================================
  const handleStoreAction = async (storeId: number, action: "approve" | "reject") => {
    setActionLoading(storeId);
    try {
      await apiFetch(`/api/admin/stores/${storeId}/${action}`, { method: "PATCH" });
      toast({
        title: action === "approve" ? "Tienda aprobada" : "Tienda rechazada",
        description: action === "approve"
          ? "La tienda ha sido aprobada exitosamente."
          : "La tienda ha sido rechazada.",
      });
      // Actualizar la lista localmente para respuesta inmediata
      setStoresList((prev) =>
        prev.map((s) =>
          s.id === storeId ? { ...s, status: action === "approve" ? "approved" : "rejected" } : s
        )
      );
      // Refrescar dashboard si está activo
      if (activeTab === "dashboard") fetchDashboard();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message ?? "No se pudo completar la acción",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // ============================================================================
  // CHART DATA
  // ============================================================================
  const chartData = dashboardData?.dailyRevenue ?? [];
  const chartValues = chartData.map((d) => parseFloat(d.total));
  const maxVal = Math.max(...chartValues, 1);
  const dayLabels = ["D", "L", "M", "M", "J", "V", "S"];

  // Stats para el dashboard
  const stats = dashboardData
    ? [
        {
          label: "Pedidos totales",
          value: String(dashboardData.orders.total),
          icon: <ShoppingCart size={20} />,
          trend: `${dashboardData.orders.pending} pendientes`,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          label: "Ingresos totales",
          value: formatCurrency(dashboardData.revenue.total),
          icon: <DollarSign size={20} />,
          trend: `${dashboardData.orders.delivered} entregados`,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          label: "Tiendas activas",
          value: String(dashboardData.stores.approved),
          icon: <StoreIcon size={20} />,
          trend: `${dashboardData.stores.pending} pendientes`,
          color: "text-purple-600",
          bg: "bg-purple-100",
        },
        {
          label: "Usuarios",
          value: String(dashboardData.users.total),
          icon: <Users size={20} />,
          trend: `${dashboardData.products.total} productos`,
          color: "text-orange-600",
          bg: "bg-orange-100",
        },
      ]
    : [];

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="text-white hover:text-white flex items-center gap-2 font-display font-bold text-xl mb-4 group">
            <div className="bg-primary text-white p-1 rounded-lg group-hover:scale-105 transition-transform">
              <ShoppingCart size={20} />
            </div>
            mercanto{" "}
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-sans tracking-wide">
              ADMIN
            </span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Volver a la tienda
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "dashboard"
                ? "bg-primary text-white font-medium shadow-md shadow-primary/20"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("stores")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "stores"
                ? "bg-primary text-white font-medium shadow-md shadow-primary/20"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <StoreIcon size={20} /> Tiendas
            {dashboardData && dashboardData.stores.pending > 0 && (
              <span className="ml-auto bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {dashboardData.stores.pending}
              </span>
            )}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 hover:text-white">
            <Package size={20} /> Productos
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "orders"
                ? "bg-primary text-white font-medium shadow-md shadow-primary/20"
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <ShoppingCart size={20} /> Pedidos
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 hover:text-white">
            <Users size={20} /> Usuarios
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800 hover:text-white">
            <Settings size={20} /> Configuración
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-red-900/40 hover:text-red-400 text-slate-400"
          >
            <LogOut size={20} /> Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-screen p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize font-display">
              {activeTab === "dashboard" ? "Dashboard" : activeTab === "stores" ? "Tiendas" : "Pedidos"}
            </h1>
            <p className="text-slate-500 text-sm">Resumen y gestión de la plataforma</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Sistema Operativo
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold text-sm">
              {user?.name?.slice(0, 2).toUpperCase() ?? "AD"}
            </div>
          </div>
        </div>

        {/* ================================================================
            DASHBOARD TAB
        ================================================================ */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in duration-300 space-y-6">
            {dashboardLoading && (
              <div className="flex items-center justify-center py-20">
                <RefreshCw size={32} className="animate-spin text-primary" />
                <span className="ml-3 text-slate-500">Cargando métricas...</span>
              </div>
            )}

            {dashboardError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3 text-red-700">
                <AlertCircle size={20} />
                <div>
                  <p className="font-semibold">Error al cargar el dashboard</p>
                  <p className="text-sm">{dashboardError}</p>
                </div>
                <button
                  onClick={fetchDashboard}
                  className="ml-auto px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

            {!dashboardLoading && !dashboardError && dashboardData && (
              <>
                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
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

                {/* Stores Status Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Tiendas pendientes</p>
                      <p className="text-2xl font-bold text-slate-900">{dashboardData.stores.pending}</p>
                    </div>
                    {dashboardData.stores.pending > 0 && (
                      <button
                        onClick={() => { setActiveTab("stores"); setStoresStatusFilter("pending"); }}
                        className="ml-auto text-xs text-primary font-semibold hover:underline"
                      >
                        Revisar
                      </button>
                    )}
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-green-100 text-green-600">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Tiendas aprobadas</p>
                      <p className="text-2xl font-bold text-slate-900">{dashboardData.stores.approved}</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-red-100 text-red-600">
                      <XCircle size={20} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm">Tiendas rechazadas</p>
                      <p className="text-2xl font-bold text-slate-900">{dashboardData.stores.rejected}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Orders Table */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="font-bold text-slate-900">Pedidos Recientes</h2>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-sm text-primary font-semibold hover:underline"
                      >
                        Ver todos
                      </button>
                    </div>
                    {dashboardData.recentOrders.length === 0 ? (
                      <div className="p-10 text-center text-slate-400">
                        <ShoppingCart size={32} className="mx-auto mb-3 opacity-40" />
                        <p>No hay pedidos registrados</p>
                      </div>
                    ) : (
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
                            {dashboardData.recentOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
                                <td className="px-6 py-4 text-slate-700">{order.user_name ?? "—"}</td>
                                <td className="px-6 py-4 text-slate-600">{order.store_name ?? "—"}</td>
                                <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(order.total_amount)}</td>
                                <td className="px-6 py-4">{getOrderStatusBadge(order.status)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Chart */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                    <h2 className="font-bold text-slate-900 mb-6">Ventas por Día (Últimos 7 días)</h2>
                    {chartData.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                        Sin datos de ventas
                      </div>
                    ) : (
                      <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-auto pt-4 border-b border-slate-100 pb-2">
                        {chartData.map((d, i) => {
                          const val = parseFloat(d.total);
                          const date = new Date(d.day);
                          const dayLabel = dayLabels[date.getDay()] ?? String(i);
                          return (
                            <div key={i} className="flex flex-col items-center gap-2 w-full group">
                              <div className="relative w-full flex justify-center h-full items-end">
                                <div
                                  className="w-full max-w-[2rem] bg-primary/20 hover:bg-primary rounded-t-sm transition-all duration-300"
                                  style={{ height: `${(val / maxVal) * 100}%`, minHeight: "4px" }}
                                />
                                <div className="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {formatCurrency(val)}
                                </div>
                              </div>
                              <span className="text-xs text-slate-400 font-medium">{dayLabel}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================================================================
            STORES TAB
        ================================================================ */}
        {activeTab === "stores" && (
          <div className="animate-in fade-in duration-300 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="font-bold text-slate-900">Directorio de Tiendas</h2>
              <div className="flex items-center gap-3">
                <select
                  value={storesStatusFilter}
                  onChange={(e) => { setStoresStatusFilter(e.target.value); setStoresPage(1); }}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary"
                >
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="approved">Aprobadas</option>
                  <option value="rejected">Rechazadas</option>
                </select>
                <button
                  onClick={() => fetchStores(storesPage, storesStatusFilter)}
                  className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg hover:bg-slate-100"
                  title="Actualizar"
                >
                  <RefreshCw size={16} className={storesLoading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {storesLoading && (
              <div className="flex items-center justify-center py-20">
                <RefreshCw size={28} className="animate-spin text-primary" />
                <span className="ml-3 text-slate-500">Cargando tiendas...</span>
              </div>
            )}

            {storesError && (
              <div className="p-6 flex items-center gap-3 text-red-600 bg-red-50">
                <AlertCircle size={18} />
                <span>{storesError}</span>
                <button onClick={() => fetchStores(storesPage, storesStatusFilter)} className="ml-auto text-sm font-medium underline">
                  Reintentar
                </button>
              </div>
            )}

            {!storesLoading && !storesError && (
              <>
                {storesList.length === 0 ? (
                  <div className="p-16 text-center text-slate-400">
                    <StoreIcon size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="font-medium">No hay tiendas registradas</p>
                    <p className="text-sm mt-1">
                      {storesStatusFilter ? `No hay tiendas con estado "${storesStatusFilter}"` : "Aún no se han creado tiendas en la plataforma"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4">Tienda</th>
                          <th className="px-6 py-4">Propietario</th>
                          <th className="px-6 py-4">Ciudad</th>
                          <th className="px-6 py-4">Estado</th>
                          <th className="px-6 py-4">Registro</th>
                          <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {storesList.map((store) => (
                          <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-bold text-sm shrink-0">
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
                              <div className="flex items-center justify-end gap-2">
                                {store.status !== "approved" && (
                                  <button
                                    onClick={() => handleStoreAction(store.id, "approve")}
                                    disabled={actionLoading === store.id}
                                    className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                                  >
                                    {actionLoading === store.id ? (
                                      <RefreshCw size={12} className="animate-spin" />
                                    ) : (
                                      <CheckCircle2 size={12} />
                                    )}
                                    Aprobar
                                  </button>
                                )}
                                {store.status !== "rejected" && (
                                  <button
                                    onClick={() => handleStoreAction(store.id, "reject")}
                                    disabled={actionLoading === store.id}
                                    className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                                  >
                                    {actionLoading === store.id ? (
                                      <RefreshCw size={12} className="animate-spin" />
                                    ) : (
                                      <XCircle size={12} />
                                    )}
                                    Rechazar
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingStore(store);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                                  title="Editar ubicación y datos"
                                >
                                  <Edit2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {storesPagination.pages > 1 && (
                  <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <span>
                      Mostrando {(storesPagination.page - 1) * storesPagination.limit + 1}–
                      {Math.min(storesPagination.page * storesPagination.limit, storesPagination.total)} de{" "}
                      {storesPagination.total} tiendas
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setStoresPage((p) => Math.max(1, p - 1))}
                        disabled={storesPage === 1}
                        className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="font-medium text-slate-700">
                        {storesPage} / {storesPagination.pages}
                      </span>
                      <button
                        onClick={() => setStoresPage((p) => Math.min(storesPagination.pages, p + 1))}
                        disabled={storesPage === storesPagination.pages}
                        className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ================================================================
            ORDERS TAB
        ================================================================ */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in duration-300 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="font-bold text-slate-900">Gestión de Pedidos</h2>
              <div className="flex items-center gap-3">
                <select
                  value={ordersStatusFilter}
                  onChange={(e) => { setOrdersStatusFilter(e.target.value); setOrdersPage(1); }}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-primary"
                >
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="shipped">Enviados</option>
                  <option value="delivered">Entregados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
                <button
                  onClick={() => fetchOrders(ordersPage, ordersStatusFilter)}
                  className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg hover:bg-slate-100"
                  title="Actualizar"
                >
                  <RefreshCw size={16} className={ordersLoading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {ordersLoading && (
              <div className="flex items-center justify-center py-20">
                <RefreshCw size={28} className="animate-spin text-primary" />
                <span className="ml-3 text-slate-500">Cargando pedidos...</span>
              </div>
            )}

            {ordersError && (
              <div className="p-6 flex items-center gap-3 text-red-600 bg-red-50">
                <AlertCircle size={18} />
                <span>{ordersError}</span>
                <button onClick={() => fetchOrders(ordersPage, ordersStatusFilter)} className="ml-auto text-sm font-medium underline">
                  Reintentar
                </button>
              </div>
            )}

            {!ordersLoading && !ordersError && (
              <>
                {ordersList.length === 0 ? (
                  <div className="p-16 text-center text-slate-400">
                    <ShoppingCart size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="font-medium">No hay pedidos registrados</p>
                    <p className="text-sm mt-1">
                      {ordersStatusFilter ? `No hay pedidos con estado "${ordersStatusFilter}"` : "Aún no se han realizado pedidos en la plataforma"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4">ID / Fecha</th>
                          <th className="px-6 py-4">Cliente</th>
                          <th className="px-6 py-4">Tienda</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4">Estado</th>
                          <th className="px-6 py-4 text-right">Dirección</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {ordersList.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-900">#{order.id}</div>
                              <div className="text-xs text-slate-500">{formatDate(order.created_at)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-700">{order.user_name ?? "—"}</p>
                              <p className="text-xs text-slate-400">{order.user_email ?? ""}</p>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{order.store_name ?? "—"}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(order.total_amount)}</td>
                            <td className="px-6 py-4">{getOrderStatusBadge(order.status)}</td>
                            <td className="px-6 py-4 text-right text-xs text-slate-500 max-w-[180px] truncate">
                              {order.shipping_address}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {ordersPagination.pages > 1 && (
                  <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                    <span>
                      Mostrando {(ordersPagination.page - 1) * ordersPagination.limit + 1}–
                      {Math.min(ordersPagination.page * ordersPagination.limit, ordersPagination.total)} de{" "}
                      {ordersPagination.total} pedidos
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                        disabled={ordersPage === 1}
                        className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="font-medium text-slate-700">
                        {ordersPage} / {ordersPagination.pages}
                      </span>
                      <button
                        onClick={() => setOrdersPage((p) => Math.min(ordersPagination.pages, p + 1))}
                        disabled={ordersPage === ordersPagination.pages}
                        className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Edit Store Modal */}
      {isEditModalOpen && editingStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <StoreIcon size={18} className="text-primary" />
                Editar Tienda: {editingStore.name}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStore} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</label>
                  <input
                    type="text"
                    value={editingStore.name}
                    onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={editingStore.email}
                    onChange={(e) => setEditingStore({ ...editingStore, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</label>
                <textarea
                  value={editingStore.description ?? ""}
                  onChange={(e) => setEditingStore({ ...editingStore, description: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ciudad / Ubicación</label>
                  <input
                    type="text"
                    value={editingStore.city ?? ""}
                    onChange={(e) => setEditingStore({ ...editingStore, city: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Ej: San Ramón, Chanchamayo, Junín"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dirección</label>
                  <input
                    type="text"
                    value={editingStore.address ?? ""}
                    onChange={(e) => setEditingStore({ ...editingStore, address: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teléfono</label>
                  <input
                    type="text"
                    value={editingStore.phone ?? ""}
                    onChange={(e) => setEditingStore({ ...editingStore, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={editingStore.is_active}
                    onChange={(e) => setEditingStore({ ...editingStore, is_active: e.target.checked })}
                    className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Tienda Activa
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {editLoading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
