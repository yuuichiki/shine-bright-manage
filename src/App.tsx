import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

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
import ExpenseManagement from "./pages/ExpenseManagement"; // New expense management
import DailyDashboard from "./pages/DailyDashboard"; // New daily dashboard

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/enhanced-inventory" element={<EnhancedInventory />} />
          <Route path="/price-history" element={<PriceHistory />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/car-categories" element={<CarCategories />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/purchasing" element={<Purchasing />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/expense-management" element={<ExpenseManagement />} />
          <Route path="/daily-dashboard" element={<DailyDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
