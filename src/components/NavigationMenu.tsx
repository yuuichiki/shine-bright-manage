import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  FileText, 
  Car, 
  Users, 
  Package, 
  BarChart3, 
  ShoppingCart, 
  Calculator, 
  Receipt,
  DollarSign,
  CalendarDays,
  TrendingUp,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Trang chủ', path: '/', icon: Home },
  { name: 'Dashboard hôm nay', path: '/daily-dashboard', icon: CalendarDays },
  { name: 'Quản lý dịch vụ', path: '/services', icon: Settings },
  { name: 'Hóa đơn', path: '/invoices', icon: FileText },
  { name: 'Khách hàng', path: '/customers', icon: Users },
  { name: 'Danh mục xe', path: '/car-categories', icon: Car },
  { name: 'Kho hàng', path: '/inventory', icon: Package },
  { name: 'Kho hàng nâng cao', path: '/enhanced-inventory', icon: Archive },
  { name: 'Lịch sử giá', path: '/price-history', icon: TrendingUp },
  { name: 'Bán hàng', path: '/sales', icon: ShoppingCart },
  { name: 'Kế toán', path: '/accounting', icon: Calculator },
  { name: 'Mua hàng', path: '/purchasing', icon: Receipt },
  { name: 'Quản lý lô hàng', path: '/batches', icon: Archive },
  { name: 'Quản lý chi phí', path: '/expense-management', icon: DollarSign },
  { name: 'Báo cáo', path: '/reports', icon: BarChart3 },
];

const NavigationMenu = () => {
  const location = useLocation();

  return (
    <div className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-1 py-2 overflow-x-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                asChild
                className={cn(
                  "whitespace-nowrap text-xs h-8",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Link to={item.path} className="flex items-center gap-1">
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;