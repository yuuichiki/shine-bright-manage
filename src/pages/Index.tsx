
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Wrench, 
  BarChart, 
  Package, 
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardMetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend = 0,
  variant = 'default' 
}: { 
  title: string, 
  value: string, 
  icon: React.ElementType,
  trend?: number,
  variant?: 'default' | 'secondary' | 'destructive'
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend !== 0 && (
        <p className={`text-xs flex items-center mt-1 ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
          {trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {Math.abs(trend)}% so với tháng trước
        </p>
      )}
    </CardContent>
  </Card>
);

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Phần Mềm Quản Lý Rửa Xe</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <DashboardMetricCard 
          title="Dịch Vụ Hôm Nay" 
          value="24" 
          icon={Car} 
          trend={12}
        />
        <DashboardMetricCard 
          title="Doanh Thu" 
          value="5.680.000₫" 
          icon={DollarSign} 
          variant="secondary"
          trend={8} 
        />
        <DashboardMetricCard 
          title="Chi Phí" 
          value="1.250.000₫" 
          icon={TrendingDown} 
          trend={-5}
        />
        <DashboardMetricCard 
          title="Lợi Nhuận" 
          value="4.430.000₫" 
          icon={TrendingUp} 
          variant="destructive"
          trend={15} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Tồn Kho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.450.000₫</div>
            <p className="text-sm text-muted-foreground mt-2">Tổng giá trị hàng tồn kho</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Vật tư hao phí:</span>
                <span className="font-medium">3.450.000₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Thiết bị:</span>
                <span className="font-medium">5.000.000₫</span>
              </div>
              <div className="flex justify-between text-sm text-red-500">
                <span>Cần nhập thêm:</span>
                <span className="font-medium">3 mặt hàng</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dịch Vụ Phổ Biến</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Rửa xe cơ bản</span>
                  <span className="text-sm text-muted-foreground">42%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Rửa xe + hút bụi</span>
                  <span className="text-sm text-muted-foreground">28%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Thay nhớt</span>
                  <span className="text-sm text-muted-foreground">18%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Khách Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <Users className="mr-2 h-6 w-6 text-blue-500" /> 120
            </div>
            <p className="text-sm text-muted-foreground mt-2">Tổng số khách hàng thường xuyên</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Khách mới (tháng này):</span>
                <span className="font-medium text-green-600">+12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tỷ lệ quay lại:</span>
                <span className="font-medium">68%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thao Tác Nhanh</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link to="/services" className="w-full">
              <Button variant="outline" className="w-full">
                <Wrench className="mr-2 h-4 w-4" /> Quản Lý Dịch Vụ
              </Button>
            </Link>
            <Link to="/inventory" className="w-full">
              <Button variant="outline" className="w-full">
                <Package className="mr-2 h-4 w-4" /> Quản Lý Kho Hàng
              </Button>
            </Link>
            <Link to="/price-history" className="w-full">
              <Button variant="outline" className="w-full">
                <BarChart className="mr-2 h-4 w-4" /> Lịch Sử Giá
              </Button>
            </Link>
            <Link to="/invoices" className="w-full">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" /> Quản Lý Hóa Đơn
              </Button>
            </Link>
            <Link to="/car-categories" className="w-full">
              <Button variant="outline" className="w-full">
                <Car className="mr-2 h-4 w-4" /> Quản Lý Danh Mục Xe
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dịch Vụ Gần Đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span>Rửa xe đầy đủ - Xe 4 chỗ</span>
                <span className="text-muted-foreground">09:30</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Thay dầu - Xe SUV</span>
                <span className="text-muted-foreground">10:15</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Đánh bóng nội thất</span>
                <span className="text-muted-foreground">11:00</span>
              </div>
              <div className="flex justify-between">
                <span>Rửa xe nhanh - Xe bán tải</span>
                <span className="text-muted-foreground">11:45</span>
              </div>
            </div>
            <Button variant="link" className="mt-4 px-0">
              Xem tất cả dịch vụ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
