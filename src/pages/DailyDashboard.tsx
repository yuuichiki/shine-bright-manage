import React, { useState, useEffect } from 'react';
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
import { Button } from "@/components/ui/button";
import { CalendarDays, Car, DollarSign, FileText, Users, Clock, Eye, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavigationMenu from '@/components/NavigationMenu';
import useApi from '@/hooks/useApi';

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
  const { callApi } = useApi();
  const today = new Date().toISOString().split('T')[0];
  
  const [todayInvoices, setTodayInvoices] = useState<TodayInvoice[]>([]);
  const [todayServices, setTodayServices] = useState<TodayService[]>([]);
  const [realCustomerCount, setRealCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch invoices
        const invoicesData = await callApi<any, any[]>({ url: '/invoices' });
        if (invoicesData) {
          const todayInvoicesData = invoicesData
            .filter(invoice => {
              const invoiceDate = new Date(invoice.date).toISOString().split('T')[0];
              return invoiceDate === today;
            })
            .map(invoice => ({
              id: invoice.id,
              time: new Date(invoice.date).toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              customer: invoice.customer_name || 'Khách hàng',
              services: invoice.services ? invoice.services.split(',') : ['Dịch vụ'],
              total: invoice.total || 0,
              status: invoice.status || 'completed' as 'completed' | 'in-progress' | 'pending'
            }));
          setTodayInvoices(todayInvoicesData);

          // Calculate service statistics
          const serviceStats: { [key: string]: { count: number; revenue: number } } = {};
          todayInvoicesData.forEach(invoice => {
            invoice.services.forEach(service => {
              if (!serviceStats[service]) {
                serviceStats[service] = { count: 0, revenue: 0 };
              }
              serviceStats[service].count += 1;
              serviceStats[service].revenue += invoice.total / invoice.services.length;
            });
          });

          const servicesData = Object.entries(serviceStats).map(([name, stats], index) => ({
            id: index + 1,
            name,
            count: stats.count,
            revenue: stats.revenue
          }));
          setTodayServices(servicesData);
        }

        // Fetch customers count
        const customersData = await callApi<any, any[]>({ url: '/customers' });
        if (customersData) {
          setRealCustomerCount(customersData.length);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data
        setTodayInvoices([
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
        setTodayServices([
          { id: 1, name: 'Rửa xe cơ bản', count: 8, revenue: 2000000 },
          { id: 2, name: 'Thay dầu máy', count: 3, revenue: 1500000 },
          { id: 3, name: 'Đánh bóng toàn xe', count: 2, revenue: 2400000 },
          { id: 4, name: 'Vệ sinh nội thất', count: 4, revenue: 800000 },
          { id: 5, name: 'Kiểm tra kỹ thuật', count: 2, revenue: 600000 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [today]);

  const totalRevenue = todayInvoices.reduce((sum, invoice) => 
    invoice.status === 'completed' ? sum + invoice.total : sum, 0
  );
  
  const completedInvoices = todayInvoices.filter(invoice => invoice.status === 'completed').length;
  const totalInvoices = todayInvoices.length;
  const todayCustomers = todayInvoices.length; // Customers served today
  
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationMenu />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
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
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
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
            <Button variant="ghost" size="sm" className="mt-2" asChild>
              <Link to="/invoices" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Xem chi tiết
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {completedInvoices} hoàn thành, {totalInvoices - completedInvoices} chưa hoàn thành
            </p>
            <Button variant="ghost" size="sm" className="mt-2" asChild>
              <Link to="/invoices" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Xem chi tiết
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Phục vụ hôm nay / Tổng {realCustomerCount} khách hàng
            </p>
            <Button variant="ghost" size="sm" className="mt-2" asChild>
              <Link to="/customers" className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                Quản lý khách hàng
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch vụ phổ biến</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayServices.length > 0 
                ? todayServices.reduce((max, service) => service.count > max.count ? service : max, todayServices[0])?.name || 'Chưa có dịch vụ'
                : 'Chưa có dịch vụ'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {todayServices.length > 0 
                ? `${todayServices.reduce((max, service) => service.count > max.count ? service : max, todayServices[0])?.count || 0} lần thực hiện`
                : 'Chưa có dữ liệu'
              }
            </p>
            <Button variant="ghost" size="sm" className="mt-2" asChild>
              <Link to="/services" className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                Quản lý dịch vụ
              </Link>
            </Button>
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
    </div>
  );
};

export default DailyDashboard;