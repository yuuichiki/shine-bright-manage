import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider, RequireAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

import Services from "./pages/Services";
import Inventory from "./pages/Inventory";
import EnhancedInventory from "./pages/EnhancedInventory"; // New enhanced inventory
import PriceHistory from "./pages/PriceHistory";
import Invoices from "./pages/Invoices";
import CarCategories from "./pages/CarCategories";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales"; // New sales module
import Accounting from "./pages/Accounting"; // New accounting module
import Purchasing from "./pages/Purchasing"; // New purchasing module
import Batches from "./pages/Batches"; // New batches management

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
            <Route path="/services" element={<RequireAuth><Services /></RequireAuth>} />
            <Route path="/inventory" element={<RequireAuth><Inventory /></RequireAuth>} />
            <Route path="/enhanced-inventory" element={<RequireAuth><EnhancedInventory /></RequireAuth>} />
            <Route path="/price-history" element={<RequireAuth><PriceHistory /></RequireAuth>} />
            <Route path="/invoices" element={<RequireAuth><Invoices /></RequireAuth>} />
            <Route path="/car-categories" element={<RequireAuth><CarCategories /></RequireAuth>} />
            <Route path="/customers" element={<RequireAuth><Customers /></RequireAuth>} />
            <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
            <Route path="/sales" element={<RequireAuth><Sales /></RequireAuth>} />
            <Route path="/accounting" element={<RequireAuth><Accounting /></RequireAuth>} />
            <Route path="/purchasing" element={<RequireAuth><Purchasing /></RequireAuth>} />
            <Route path="/batches" element={<RequireAuth><Batches /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
