import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { CategoryProvider } from "@/lib/CategoryContext";
import { CartProvider } from "@/lib/CartContext";
// Custom components
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import Home from "@/pages/Home";
import Stores from "@/pages/Stores";
import StoreDetail from "@/pages/StoreDetail";
import Tacora from "@/pages/Tacora";
import MapPage from "@/pages/MapPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminPage from "@/pages/AdminPage";
import CheckoutPage from "@/pages/CheckoutPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tiendas" component={Stores} />
      <Route path="/tienda/:id" component={StoreDetail} />
      <Route path="/tacora" component={Tacora} />
      <Route path="/mapa" component={MapPage} />
      <Route path="/perfil" component={ProfilePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/pedido" component={CheckoutPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/registro" component={RegisterPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CategoryProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <CartDrawer />
                <main className="flex-grow">
                  <Router />
                </main>
                <Footer />
              </div>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </CategoryProvider>
    </QueryClientProvider>
  );
}

export default App;
