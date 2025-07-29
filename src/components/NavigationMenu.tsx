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
  Archive,
  ChevronDown,
  Tag,
  Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const navigationGroups = [
  {
    name: 'Tổng quan',
    items: [
      { name: 'Trang chủ', path: '/', icon: Home },
      { name: 'Dashboard hôm nay', path: '/daily-dashboard', icon: CalendarDays },
      { name: 'Báo cáo', path: '/reports', icon: BarChart3 },
    ]
  },
  {
    name: 'Quản lý dịch vụ',
    items: [
      { name: 'Dịch vụ', path: '/services', icon: Settings },
      { name: 'Quản lý chi phí dịch vụ', path: '/service-cost-management', icon: Calculator },
      { name: 'Danh mục xe', path: '/car-categories', icon: Car },
    ]
  },
  {
    name: 'Khách hàng & Hóa đơn',
    items: [
      { name: 'Khách hàng', path: '/customers', icon: Users },
      { name: 'Hóa đơn', path: '/invoices', icon: FileText },
    ]
  },
  {
    name: 'Kho hàng',
    items: [
      { name: 'Kho hàng cơ bản', path: '/inventory', icon: Package },
      { name: 'Kho hàng nâng cao', path: '/enhanced-inventory', icon: Archive },
      { name: 'Lịch sử giá', path: '/price-history', icon: TrendingUp },
      { name: 'Quản lý lô hàng', path: '/batches', icon: Archive },
    ]
  },
  {
    name: 'Mua bán',
    items: [
      { name: 'Bán hàng', path: '/sales', icon: ShoppingCart },
      { name: 'Mua hàng', path: '/purchasing', icon: Receipt },
    ]
  },
  {
    name: 'Tài chính',
    items: [
      { name: 'Kế toán', path: '/accounting', icon: Calculator },
      { name: 'Quản lý chi phí', path: '/expense-management', icon: DollarSign },
    ]
  },
  {
    name: 'Marketing',
    items: [
      { name: 'Khuyến mãi', path: '/promotions', icon: Tag },
      { name: 'Nhóm khách hàng', path: '/customer-groups', icon: Users },
      { name: 'Voucher', path: '/vouchers', icon: Ticket },
    ]
  },
  {
    name: 'Nhân sự',
    items: [
      { name: 'Quản lý nhân viên', path: '/hr-management', icon: Users },
    ]
  },
];

const NavigationMenu = () => {
  const location = useLocation();

  const isActiveGroup = (group: typeof navigationGroups[0]) => {
    return group.items.some(item => location.pathname === item.path);
  };

  const isActiveItem = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-1 py-2 overflow-x-auto">
          {navigationGroups.map((group) => {
            const hasActiveItem = isActiveGroup(group);
            
            return (
              <DropdownMenu key={group.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={hasActiveItem ? "default" : "ghost"}
                    className={cn(
                      "whitespace-nowrap text-xs h-8 flex items-center gap-1",
                      hasActiveItem && "bg-primary text-primary-foreground"
                    )}
                  >
                    <span className="hidden sm:inline">{group.name}</span>
                    <span className="sm:hidden">{group.name.charAt(0)}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveItem(item.path);
                    
                    return (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link 
                          to={item.path} 
                          className={cn(
                            "flex items-center gap-2 w-full cursor-pointer",
                            isActive && "bg-accent text-accent-foreground font-medium"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;