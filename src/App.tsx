import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Inventory from "./pages/Inventory";
import CarCategories from "./pages/CarCategories";
import DailyDashboard from "./pages/DailyDashboard";
import PriceHistory from "./pages/PriceHistory";
import EnhancedInventory from "./pages/EnhancedInventory";
import Batches from "./pages/Batches";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import Accounting from "./pages/Accounting";
import ExpenseManagement from "./pages/ExpenseManagement";
import Purchasing from "./pages/Purchasing";
import ServiceCostManagement from "./pages/ServiceCostManagement";
import Promotions from "./pages/Promotions";
import CustomerGroups from "./pages/CustomerGroups";
import Vouchers from "./pages/Vouchers";
import HRManagement from "./pages/HRManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/car-categories" element={<CarCategories />} />
            <Route path="/daily-dashboard" element={<DailyDashboard />} />
            <Route path="/price-history" element={<PriceHistory />} />
            <Route path="/enhanced-inventory" element={<EnhancedInventory />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/expense-management" element={<ExpenseManagement />} />
            <Route path="/purchasing" element={<Purchasing />} />
            <Route path="/service-cost-management" element={<ServiceCostManagement />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/customer-groups" element={<CustomerGroups />} />
          <Route path="/vouchers" element={<Vouchers />} />
          <Route path="/hr-management" element={<HRManagement />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;