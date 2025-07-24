import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Car, DollarSign, FileText, Users, Clock } from 'lucide-react';

type TodayInvoice = {
  id: number;
  time: string;
  customer: string;
  services: string[];
  total: number;
  status: 'completed' | 'in-progress' | 'pending';
};

type TodayService = {
  id: number;
  name: string;
  count: number;
  revenue: number;
};

const DailyDashboard = () => {
  const today = new Date().toISOString().split('T')[0];
  
  // Mock data for today's invoices
  const [todayInvoices] = useState<TodayInvoice[]>([
    {
      id: 1,
      time: '08:30',
      customer: 'Nguyễn Văn A',
      services: ['Rửa xe cơ bản'],
      total: 250000,
      status: 'completed'
    },
    {
      id: 2,
      time: '09:15',
      customer: 'Trần Thị B',
      services: ['Rửa xe cơ bản', 'Thay dầu máy'],
      total: 750000,
      status: 'completed'
    },
    {
      id: 3,
      time: '10:00',
      customer: 'Lê Văn C',
      services: ['Đánh bóng toàn xe'],
      total: 1200000,
      status: 'in-progress'
    },
    {
      id: 4,
      time: '10:30',
      customer: 'Phạm Thị D',
      services: ['Rửa xe cơ bản', 'Vệ sinh nội thất'],
      total: 450000,
      status: 'pending'
    },
    {
      id: 5,
      time: '11:00',
      customer: 'Hoàng Văn E',
      services: ['Thay dầu máy', 'Kiểm tra kỹ thuật'],
      total: 800000,
      status: 'pending'
    }
  ]);

  // Mock data for today's services
  const [todayServices] = useState<TodayService[]>([
    { id: 1, name: 'Rửa xe cơ bản', count: 8, revenue: 2000000 },
    { id: 2, name: 'Thay dầu máy', count: 3, revenue: 1500000 },
    { id: 3, name: 'Đánh bóng toàn xe', count: 2, revenue: 2400000 },
    { id: 4, name: 'Vệ sinh nội thất', count: 4, revenue: 800000 },
    { id: 5, name: 'Kiểm tra kỹ thuật', count: 2, revenue: 600000 }
  ]);

  const totalRevenue = todayInvoices.reduce((sum, invoice) => 
    invoice.status === 'completed' ? sum + invoice.total : sum, 0
  );
  
  const completedInvoices = todayInvoices.filter(invoice => invoice.status === 'completed').length;
  const totalInvoices = todayInvoices.length;
  const totalCustomers = todayInvoices.length; // Assuming each invoice is a unique customer
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">Đang thực hiện</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <CalendarDays className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Dashboard Hôm Nay</h1>
        <span className="text-lg text-muted-foreground">
          ({new Date().toLocaleDateString('vi-VN')})
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalRevenue.toLocaleString('vi-VN')} đ
            </div>
            <p className="text-xs text-muted-foreground">
              Từ {completedInvoices} hóa đơn hoàn thành
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {completedInvoices} hoàn thành, {totalInvoices - completedInvoices} chưa hoàn thành
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Khách hàng được phục vụ hôm nay
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch vụ phổ biến</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayServices.reduce((max, service) => service.count > max.count ? service : max, todayServices[0])?.name}
            </div>
            <p className="text-xs text-muted-foreground">
              {todayServices.reduce((max, service) => service.count > max.count ? service : max, todayServices[0])?.count} lần thực hiện
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hóa đơn hôm nay ({todayInvoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.time}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>
                      <div className="max-w-[150px]">
                        {invoice.services[0]}
                        {invoice.services.length > 1 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            +{invoice.services.length - 1} khác
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {invoice.total.toLocaleString('vi-VN')} đ
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Today's Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Thống kê dịch vụ hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên dịch vụ</TableHead>
                  <TableHead className="text-right">Số lần</TableHead>
                  <TableHead className="text-right">Doanh thu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayServices
                  .sort((a, b) => b.count - a.count)
                  .map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="text-right">{service.count}</TableCell>
                    <TableCell className="text-right font-medium">
                      {service.revenue.toLocaleString('vi-VN')} đ
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center font-bold">
                <span>Tổng cộng:</span>
                <span className="text-green-600">
                  {todayServices.reduce((sum, service) => sum + service.revenue, 0).toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyDashboard;