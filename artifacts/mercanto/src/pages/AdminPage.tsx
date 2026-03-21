import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/AuthContext";
import {
  LayoutDashboard,
  Store as StoreIcon,
  ShoppingCart,
  Users,
  ArrowLeft,
  TrendingUp,
  Activity,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader,
  Check,
  X,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  UserPlus,
  ShieldCheck,
  Trash2,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Settings,
  Bell,
  Menu,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
  address?: string;
  city?: string;
}

interface Order {
  id: number;
  user_id: number;
  store_id: number;
  status: string;
  total_amount: string;
  created_at: string;
  user_name?: string;
  store_name?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "stores" | "orders" | "users" | "settings">("dashboard");

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, setLocation]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (res.ok) {
        const d = data.data;
        setMetrics({
          totalOrdersToday: d.orders.total,
          totalRevenueToday: d.revenue.total,
          totalActiveStores: d.stores.approved,
          totalUsers: d.users.total,
          pendingStores: d.stores.pending,
          statusBreakdown: [],
          salesByDay: d.dailyRevenue.map((r: any) => ({ date: r.day, total: parseFloat(r.total) }))
        });
      }
      else toast.error(data.error || "Error al cargar métricas");
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stores?limit=100");
      const data = await res.json();
      if (res.ok) setStores(data.data);
      else toast.error(data.error || "Error al cargar tiendas");
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders?limit=50");
      const data = await res.json();
      if (res.ok) setOrders(data.data);
      else toast.error(data.error || "Error al cargar pedidos");
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users?limit=50");
      const data = await res.json();
      if (res.ok) setUsersList(data.data);
      else toast.error(data.error || "Error al cargar usuarios");
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "dashboard") fetchMetrics();
    else if (activeTab === "stores") fetchStores();
    else if (activeTab === "orders") fetchOrders();
    else if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  const updateStoreStatus = async (storeId: number, status: string) => {
    try {
      setActionLoading(storeId);
      const endpoint = status === "approved" ? "approve" : "reject";
      const res = await fetch(`/api/admin/stores/${storeId}/${endpoint}`, { method: "PATCH" });
      if (res.ok) {
        toast.success(`Tienda ${status === "approved" ? "aprobada" : "rechazada"} con éxito`);
        setStores(stores.map((s) => (s.id === storeId ? { ...s, status } : s)));
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al actualizar estado");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setActionLoading(null);
    }
  };

  const updateUserRole = async (userId: number, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        toast.success("Rol actualizado correctamente");
        setUsersList(usersList.map((u) => (u.id === userId ? { ...u, role } : u)));
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al actualizar rol");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: { label: "Completado", className: "bg-green-100 text-green-700 border-green-200" },
      pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      confirmed: { label: "Confirmado", className: "bg-blue-100 text-blue-700 border-blue-200" },
      shipped: { label: "Enviado", className: "bg-purple-100 text-purple-700 border-purple-200" },
      delivered: { label: "Entregado", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      cancelled: { label: "Cancelado", className: "bg-red-100 text-red-700 border-red-200" },
      approved: { label: "Aprobada", className: "bg-green-100 text-green-700 border-green-200" },
      rejected: { label: "Rechazada", className: "bg-red-100 text-red-700 border-red-200" },
    };
    const config = variants[status] || { label: status, className: "bg-gray-100 text-gray-700" };
    return <Badge variant="outline" className={`${config.className} font-semibold`}>{config.label}</Badge>;
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col shrink-0 z-50 fixed md:relative h-full`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <Link href="/" className={`flex items-center gap-3 font-bold text-xl text-white ${!sidebarOpen && "hidden"}`}>
            <div className="bg-primary p-1.5 rounded-lg"><ShoppingCart size={20} /></div>
            mercanto <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 tracking-tighter">SAAS</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Menu size={20} />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "stores", icon: StoreIcon, label: "Tiendas" },
            { id: "orders", icon: ShoppingCart, label: "Pedidos" },
            { id: "users", icon: Users, label: "Usuarios" },
            { id: "settings", icon: Settings, label: "Configuración" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-white"} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">Administrador</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Buscar en la plataforma..." 
                className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded-full h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-slate-500">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <Button variant="outline" size="sm" className="rounded-full gap-2 border-slate-200 text-slate-600" asChild>
              <Link href="/"><ArrowLeft size={16} /> Ver Tienda</Link>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize">{activeTab}</h1>
                <p className="text-slate-500 mt-1">Gestiona tu ecosistema Mercanto desde un solo lugar.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="rounded-xl gap-2 border-slate-200 shadow-sm">
                  <Calendar size={16} /> {new Date().toLocaleDateString('es-PE', { month: 'long', day: 'numeric' })}
                </Button>
                <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
                  <TrendingUp size={16} /> Exportar Reporte
                </Button>
              </div>
            </div>

            {activeTab === "dashboard" && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Ventas Hoy", value: `S/ ${metrics?.totalRevenueToday.toFixed(2) || '0.00'}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12.5%", trendUp: true },
                    { label: "Pedidos Hoy", value: metrics?.totalOrdersToday || 0, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50", trend: "+5.2%", trendUp: true },
                    { label: "Tiendas Activas", value: metrics?.totalActiveStores || 0, icon: StoreIcon, color: "text-purple-600", bg: "bg-purple-50", trend: "0%", trendUp: true },
                    { label: "Usuarios Totales", value: metrics?.totalUsers || 0, icon: Users, color: "text-orange-600", bg: "bg-orange-50", trend: "+2.1%", trendUp: true },
                  ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                            <stat.icon size={24} />
                          </div>
                          <Badge variant="secondary" className={`rounded-full ${stat.trendUp ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
                            {stat.trendUp ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                            {stat.trend}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                          <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Chart Placeholder */}
                  <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold">Rendimiento de Ventas</CardTitle>
                        <CardDescription>Ingresos generados en los últimos 7 días</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" className="text-slate-400"><MoreVertical size={20} /></Button>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end gap-2 px-6 pb-8">
                      {metrics?.salesByDay.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div 
                            className="w-full bg-primary/10 group-hover:bg-primary/30 transition-colors rounded-t-lg relative"
                            style={{ height: `${Math.max(10, (day.total / (Math.max(...metrics.salesByDay.map(d => d.total)) || 1)) * 100)}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              S/ {day.total.toFixed(2)}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{day.date.split('-')[2]}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Pending Approvals */}
                  <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">Alertas de Gestión</CardTitle>
                      <CardDescription>Acciones que requieren tu atención</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {metrics?.pendingStores && metrics.pendingStores > 0 ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-2xl flex items-start gap-4">
                          <div className="bg-yellow-500 text-white p-2 rounded-xl"><StoreIcon size={20} /></div>
                          <div>
                            <p className="font-bold text-yellow-900">{metrics.pendingStores} Tiendas Pendientes</p>
                            <p className="text-xs text-yellow-700 mt-1">Nuevos negocios esperan aprobación para vender.</p>
                            <Button variant="link" onClick={() => setActiveTab("stores")} className="p-0 h-auto text-xs font-bold text-yellow-800 mt-2">Revisar ahora <ChevronRight size={12} /></Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                          <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                          <p className="text-sm text-slate-500">Todo al día. No hay tareas pendientes.</p>
                        </div>
                      )}
                      
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                        <div className="bg-blue-500 text-white p-2 rounded-xl"><Activity size={20} /></div>
                        <div>
                          <p className="font-bold text-blue-900">Sistema Estable</p>
                          <p className="text-xs text-blue-700 mt-1">Todos los servicios están operando normalmente.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeTab === "stores" && (
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-white p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl font-bold">Directorio de Tiendas</CardTitle>
                      <CardDescription>Administra los comercios registrados en la plataforma.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl border-slate-200"><Filter size={16} className="mr-2" /> Filtros</Button>
                      <Button size="sm" className="rounded-xl"><UserPlus size={16} className="mr-2" /> Invitar Tienda</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="pl-6">Tienda</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Registro</TableHead>
                        <TableHead className="text-right pr-6">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stores.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((store) => (
                        <TableRow key={store.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                {store.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{store.name}</p>
                                <p className="text-xs text-slate-500">{store.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600 text-sm">
                            {store.city || "No especificada"}
                          </TableCell>
                          <TableCell>{getStatusBadge(store.status)}</TableCell>
                          <TableCell className="text-slate-500 text-xs">
                            {new Date(store.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical size={18} /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl w-48">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {store.status === "pending" && (
                                  <>
                                    <DropdownMenuItem onClick={() => updateStoreStatus(store.id, "approved")} className="text-emerald-600 font-medium">
                                      <Check size={16} className="mr-2" /> Aprobar Tienda
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateStoreStatus(store.id, "rejected")} className="text-red-600 font-medium">
                                      <X size={16} className="mr-2" /> Rechazar Tienda
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem><ExternalLink size={16} className="mr-2" /> Ver Perfil Público</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600"><Trash2 size={16} className="mr-2" /> Eliminar</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {stores.length === 0 && !loading && (
                    <div className="p-12 text-center">
                      <StoreIcon size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-slate-500 font-medium">No se encontraron tiendas.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "orders" && (
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-white p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl font-bold">Flujo de Pedidos</CardTitle>
                      <CardDescription>Monitorea todas las transacciones en tiempo real.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="pl-6">ID Pedido</TableHead>
                        <TableHead>Cliente / Tienda</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right pr-6">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="pl-6 py-4 font-bold text-slate-900">#{order.id}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium text-slate-900">{order.user_name || `Usuario #${order.user_id}`}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1"><StoreIcon size={10} /> {order.store_name || `Tienda #${order.store_id}`}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-slate-900">S/ {parseFloat(order.total_amount).toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-slate-500 text-xs">{new Date(order.created_at).toLocaleString()}</TableCell>
                          <TableCell className="text-right pr-6">
                            <Button variant="ghost" size="sm" className="rounded-lg text-primary font-bold">Detalles</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "users" && (
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-white p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl font-bold">Gestión de Usuarios</CardTitle>
                      <CardDescription>Controla los accesos y roles de la plataforma.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="pl-6">Usuario</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Fecha Registro</TableHead>
                        <TableHead className="text-right pr-6">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersList.map((u) => (
                        <TableRow key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{u.name}</p>
                                <p className="text-xs text-slate-500">{u.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={`rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'store_owner' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                              {u.role === 'admin' ? 'Admin' : u.role === 'store_owner' ? 'Dueño' : 'Cliente'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right pr-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical size={18} /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl w-48">
                                <DropdownMenuLabel>Cambiar Rol</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => updateUserRole(u.id, "admin")}><ShieldCheck size={16} className="mr-2" /> Hacer Admin</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateUserRole(u.id, "store_owner")}><StoreIcon size={16} className="mr-2" /> Hacer Dueño</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateUserRole(u.id, "customer")}><Users size={16} className="mr-2" /> Hacer Cliente</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600"><Trash2 size={16} className="mr-2" /> Eliminar Usuario</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Configuración Global</CardTitle>
                    <CardDescription>Ajustes generales de la plataforma SaaS.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Nombre de la Plataforma</label>
                      <Input defaultValue="Mercanto SaaS" className="rounded-xl border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Comisión por Venta (%)</label>
                      <Input type="number" defaultValue="5" className="rounded-xl border-slate-200" />
                    </div>
                    <Button className="w-full rounded-xl font-bold">Guardar Cambios</Button>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Mantenimiento</CardTitle>
                    <CardDescription>Acciones críticas del sistema.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                      <p className="text-sm font-bold text-red-900">Modo Mantenimiento</p>
                      <p className="text-xs text-red-700 mt-1">Desactiva el acceso a todos los usuarios excepto administradores.</p>
                      <Button variant="destructive" size="sm" className="mt-3 rounded-lg font-bold">Activar Modo</Button>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <p className="text-sm font-bold text-slate-900">Limpiar Caché</p>
                      <p className="text-xs text-slate-600 mt-1">Fuerza la actualización de datos en tiempo real.</p>
                      <Button variant="outline" size="sm" className="mt-3 rounded-lg font-bold border-slate-200">Ejecutar Limpieza</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
