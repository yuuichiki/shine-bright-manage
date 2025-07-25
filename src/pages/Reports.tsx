
import React, { useState } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, User, Calendar, BarChart, Filter } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

const Reports = () => {
  const [reportType, setReportType] = useState("invoices");
  const [dateRange, setDateRange] = useState("month");
  
  // Demo data for reports
  const invoiceData = [
    { id: 1, date: '2025-04-18', customer: 'Nguyễn Văn A', services: 'Rửa xe cơ bản', total: 250000 },
    { id: 2, date: '2025-04-18', customer: 'Trần Thị B', services: 'Rửa xe + Thay dầu', total: 750000 },
    { id: 3, date: '2025-04-17', customer: 'Nguyễn Văn A', services: 'Đánh bóng', total: 500000 },
    { id: 4, date: '2025-04-16', customer: 'Lê Văn C', services: 'Rửa xe cơ bản', total: 250000 },
    { id: 5, date: '2025-04-15', customer: 'Phạm Văn D', services: 'Thay dầu + Kiểm tra', total: 650000 },
  ];
  
  const customerData = [
    { name: 'Nguyễn Văn A', visits: 12, total: 4500000 },
    { name: 'Trần Thị B', visits: 5, total: 1800000 },
    { name: 'Lê Văn C', visits: 3, total: 850000 },
    { name: 'Phạm Văn D', visits: 2, total: 980000 },
  ];
  
  const serviceData = [
    { name: 'Rửa xe cơ bản', count: 45, revenue: 7500000 },
    { name: 'Thay dầu', count: 22, revenue: 6600000 },
    { name: 'Đánh bóng', count: 15, revenue: 7500000 },
    { name: 'Kiểm tra định kỳ', count: 10, revenue: 2500000 },
  ];

  // Chart data
  const revenueData = [
    { name: 'T1', revenue: 5600000, cost: 2100000, profit: 3500000 },
    { name: 'T2', revenue: 6200000, cost: 2300000, profit: 3900000 },
    { name: 'T3', revenue: 5800000, cost: 2200000, profit: 3600000 },
    { name: 'T4', revenue: 7500000, cost: 2500000, profit: 5000000 },
    { name: 'T5', revenue: 8300000, cost: 2800000, profit: 5500000 },
    { name: 'T6', revenue: 8800000, cost: 3000000, profit: 5800000 },
  ];

  const servicePieData = [
    { name: 'Rửa xe cơ bản', value: 45 },
    { name: 'Thay dầu', value: 22 },
    { name: 'Đánh bóng', value: 15 },
    { name: 'Kiểm tra định kỳ', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleExportReport = () => {
    console.log('Xuất báo cáo');
  };

  return (
    <>
    <NavigationMenu />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Báo Cáo & Thống Kê</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle>Bộ lọc báo cáo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 text-sm font-medium">Loại báo cáo</div>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoices">Hóa đơn</SelectItem>
                  <SelectItem value="customers">Khách hàng</SelectItem>
                  <SelectItem value="services">Dịch vụ</SelectItem>
                  <SelectItem value="revenue">Doanh thu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="mb-2 text-sm font-medium">Khoảng thời gian</div>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khoảng thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="year">Năm nay</SelectItem>
                  <SelectItem value="custom">Tùy chỉnh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-2 text-sm font-medium">Từ ngày</div>
                  <Input type="date" />
                </div>
                <div>
                  <div className="mb-2 text-sm font-medium">Đến ngày</div>
                  <Input type="date" />
                </div>
              </div>
            )}
            
            <Button className="w-full">
              <Filter className="mr-2 h-4 w-4" /> Áp dụng bộ lọc
            </Button>
            
            <Button variant="outline" className="w-full" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
            </Button>
          </CardContent>
        </Card>

        <div className="col-span-3 md:col-span-2">
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Bảng dữ liệu</TabsTrigger>
              <TabsTrigger value="chart">Biểu đồ</TabsTrigger>
            </TabsList>
            <TabsContent value="table" className="p-0 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {reportType === 'invoices' && 'Báo cáo hóa đơn'}
                    {reportType === 'customers' && 'Báo cáo khách hàng'}
                    {reportType === 'services' && 'Báo cáo dịch vụ'}
                    {reportType === 'revenue' && 'Báo cáo doanh thu'}
                  </CardTitle>
                  <CardDescription>
                    {dateRange === 'day' && 'Dữ liệu hôm nay'}
                    {dateRange === 'week' && 'Dữ liệu tuần này'}
                    {dateRange === 'month' && 'Dữ liệu tháng này'}
                    {dateRange === 'year' && 'Dữ liệu năm nay'}
                    {dateRange === 'custom' && 'Dữ liệu trong khoảng thời gian đã chọn'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportType === 'invoices' && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Số HĐ</TableHead>
                          <TableHead>Ngày</TableHead>
                          <TableHead>Khách hàng</TableHead>
                          <TableHead>Dịch vụ</TableHead>
                          <TableHead>Tổng tiền</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoiceData.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell>{invoice.id}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>{invoice.customer}</TableCell>
                            <TableCell>{invoice.services}</TableCell>
                            <TableCell>{invoice.total.toLocaleString('vi-VN')} đ</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  
                  {reportType === 'customers' && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên khách hàng</TableHead>
                          <TableHead>Số lần ghé</TableHead>
                          <TableHead>Tổng chi tiêu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerData.map((customer, index) => (
                          <TableRow key={index}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.visits}</TableCell>
                            <TableCell>{customer.total.toLocaleString('vi-VN')} đ</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  
                  {reportType === 'services' && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dịch vụ</TableHead>
                          <TableHead>Số lần sử dụng</TableHead>
                          <TableHead>Doanh thu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceData.map((service, index) => (
                          <TableRow key={index}>
                            <TableCell>{service.name}</TableCell>
                            <TableCell>{service.count}</TableCell>
                            <TableCell>{service.revenue.toLocaleString('vi-VN')} đ</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  
                  {reportType === 'revenue' && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tháng</TableHead>
                          <TableHead>Doanh thu</TableHead>
                          <TableHead>Chi phí</TableHead>
                          <TableHead>Lợi nhuận</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {revenueData.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.revenue.toLocaleString('vi-VN')} đ</TableCell>
                            <TableCell>{data.cost.toLocaleString('vi-VN')} đ</TableCell>
                            <TableCell>{data.profit.toLocaleString('vi-VN')} đ</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chart" className="p-0 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {reportType === 'invoices' && 'Biểu đồ hóa đơn'}
                    {reportType === 'customers' && 'Biểu đồ khách hàng'}
                    {reportType === 'services' && 'Biểu đồ dịch vụ'}
                    {reportType === 'revenue' && 'Biểu đồ doanh thu'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {(reportType === 'revenue') && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={revenueData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => value.toLocaleString('vi-VN') + ' đ'} 
                        />
                        <Legend />
                        <Bar dataKey="revenue" name="Doanh thu" fill="#8884d8" />
                        <Bar dataKey="cost" name="Chi phí" fill="#82ca9d" />
                        <Bar dataKey="profit" name="Lợi nhuận" fill="#ffc658" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  )}
                  
                  {reportType === 'services' && (
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={servicePieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {servicePieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={serviceData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" name="Số lượng" fill="#8884d8" />
                        </ReBarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  
                  {reportType === 'customers' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={customerData}>
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="visits" name="Số lần ghé" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="total" name="Tổng chi tiêu" fill="#82ca9d" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  )}
                  
                  {reportType === 'invoices' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={invoiceData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => value.toLocaleString('vi-VN') + ' đ'} />
                        <Legend />
                        <Bar dataKey="total" name="Giá trị hóa đơn" fill="#8884d8" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </>
  );
};

export default Reports;
