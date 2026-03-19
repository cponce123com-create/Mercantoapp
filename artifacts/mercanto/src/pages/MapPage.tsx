import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { CATEGORIES } from "@/data/mock";
import { Search, MapPin, Store as StoreIcon, Navigation, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useListStores } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Leaflet imports
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Create custom colored markers based on category
const createCustomIcon = (colorClass: string, icon: string) => {
  let bgColor = "#e11d48"; // default primary
  if (colorClass.includes("orange")) bgColor = "#f97316";
  if (colorClass.includes("green")) bgColor = "#22c55e";
  if (colorClass.includes("blue")) bgColor = "#3b82f6";
  if (colorClass.includes("pink")) bgColor = "#ec4899";
  if (colorClass.includes("amber")) bgColor = "#f59e0b";
  if (colorClass.includes("slate")) bgColor = "#64748b";
  if (colorClass.includes("teal")) bgColor = "#14b8a6";

  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${bgColor}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border: 2px solid white;">${icon}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function MapPage() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  // Lima, Peru coordinates
  const defaultCenter: [number, number] = [-12.0646, -77.0465];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);

  const { data, isLoading, error, refetch } = useListStores({
    status: 'approved',
    is_active: true,
    limit: 100
  });

  const stores = data?.data || [];

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      // Mapeo simple de categorías para el mock visual
      const categoryMap: Record<string, string> = {
        'restaurants': 'Restaurante',
        'fruits': 'Frutas y Verduras',
        'stores': 'Minimarket',
        'clothes': 'Ropa',
        'home': 'Hogar',
        'tech': 'Tecnología',
        'pharmacy': 'Salud'
      };
      
      const matchesCategory = activeCategory === "all" || 
                             (store.description || "").includes(categoryMap[activeCategory] || "");
      
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (store.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [stores, activeCategory, searchQuery]);

  const handleStoreSelect = (store: any) => {
    setSelectedStoreId(store.id);
    // En un escenario real, la API devolvería lat/lng. Aquí usamos valores por defecto o simulados.
    const lat = -12.0646 + (Math.random() - 0.5) * 0.05;
    const lng = -77.0465 + (Math.random() - 0.5) * 0.05;
    setMapCenter([lat, lng]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background overflow-hidden">
      {/* Top Bar - Filters */}
      <div className="flex-shrink-0 bg-white border-b border-border shadow-sm p-4 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Buscar tiendas en el mapa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl text-sm transition-all outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full hide-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                  activeCategory === cat.id 
                    ? "bg-primary text-white border-primary shadow-sm" 
                    : "bg-white text-foreground hover:bg-muted border-border"
                )}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar (Stores List) */}
        <div className="hidden md:flex w-96 flex-col bg-white border-r border-border h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-4 border-b border-border bg-muted/20">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <MapPin size={18} className="text-primary" /> 
              {isLoading ? 'Cargando...' : `${filteredStores.length} Tiendas encontradas`}
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
            ) : error ? (
              <div className="p-4">
                <Alert variant="destructive" className="rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    No se pudieron cargar las tiendas.
                    <button onClick={() => refetch()} className="block mt-2 underline font-bold">Reintentar</button>
                  </AlertDescription>
                </Alert>
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <StoreIcon size={40} className="mx-auto mb-3 opacity-20" />
                <p>No se encontraron tiendas</p>
              </div>
            ) : (
              filteredStores.map(store => (
                <div 
                  key={store.id}
                  onClick={() => handleStoreSelect(store)}
                  className={cn(
                    "p-3 rounded-xl cursor-pointer transition-all border",
                    selectedStoreId === store.id 
                      ? "bg-primary/5 border-primary shadow-sm" 
                      : "bg-white hover:bg-muted/50 border-border"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden`}>
                      {store.logo_url ? (
                        <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                      ) : (
                        '🏪'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{store.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">Tienda</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-md font-medium">Abierto</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/tienda/${store.id}`);
                          }}
                          className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                        >
                          Ver tienda <Navigation size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 h-full z-0 relative">
          <MapContainer 
            center={defaultCenter} 
            zoom={14} 
            className="w-full h-full"
            zoomControl={false}
          >
            <MapUpdater center={mapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            {filteredStores.map(store => {
              // Simular coordenadas si no existen
              const lat = -12.0646 + (Math.random() - 0.5) * 0.05;
              const lng = -77.0465 + (Math.random() - 0.5) * 0.05;
              
              const customIcon = createCustomIcon("bg-slate-700", '🏪');
              
              return (
                <Marker 
                  key={store.id} 
                  position={[lat, lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedStoreId(store.id);
                    }
                  }}
                >
                  <Popup className="rounded-xl overflow-hidden shadow-xl border-none">
                    <div className="p-1 -m-1">
                      <div className={`h-16 -mx-4 -mt-4 bg-gradient-to-r from-slate-700 to-slate-900 mb-3 flex items-center justify-center relative overflow-hidden`}>
                        {store.logo_url && <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover opacity-50" />}
                        <div className="absolute -bottom-4 bg-white rounded-full p-1 shadow-sm">
                           <div className="w-8 h-8 flex items-center justify-center text-lg">
                             {store.logo_url ? '' : '🏪'}
                           </div>
                        </div>
                      </div>
                      <h3 className="font-bold text-base text-center mt-3 mb-1">{store.name}</h3>
                      <p className="text-xs text-muted-foreground text-center mb-3">Tienda</p>
                      <button 
                        onClick={() => setLocation(`/tienda/${store.id}`)}
                        className="w-full py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Ver productos
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
