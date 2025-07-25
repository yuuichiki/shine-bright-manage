
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilePlus, ShoppingCart, Plus, Edit, Trash2, FileDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import NavigationMenu from '@/components/NavigationMenu';

const Sales = () => {
  const [salesOrders, setSalesOrders] = useState([
    { id: 1, customerName: 'Nguyễn Văn A', orderDate: '2024-07-20', totalAmount: 2000000, status: 'Đã giao', items: 3 },
    { id: 2, customerName: 'Trần Thị B', orderDate: '2024-07-19', totalAmount: 1500000, status: 'Đang xử lý', items: 2 }
  ]);
  
  const [salesReports] = useState([
    { period: 'Hôm nay', revenue: 5000000, orders: 12, avgOrder: 416667 },
    { period: 'Tuần này', revenue: 25000000, orders: 65, avgOrder: 384615 },
    { period: 'Tháng này', revenue: 120000000, orders: 280, avgOrder: 428571 }
  ]);

  const [newOrder, setNewOrder] = useState({ customerName: '', totalAmount: 0, items: 1, status: 'Đang xử lý' });
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddOrder = () => {
    if (newOrder.customerName && newOrder.totalAmount) {
      const order = { 
        ...newOrder, 
        id: Date.now(), 
        orderDate: new Date().toISOString().split('T')[0] 
      };
      setSalesOrders([...salesOrders, order]);
      setNewOrder({ customerName: '', totalAmount: 0, items: 1, status: 'Đang xử lý' });
      setIsOrderDialogOpen(false);
      toast({ title: "Thành công", description: "Đơn hàng đã được tạo." });
    }
  };

  const handleDeleteOrder = (id: number) => {
    setSalesOrders(salesOrders.filter(o => o.id !== id));
    toast({ title: "Thành công", description: "Đơn hàng đã được xóa." });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quản Lý Bán Hàng</h1>
        
        <div className="grid gap-6">
          {/* Sales Reports Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {salesReports.map((report, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{report.period}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(report.revenue)}</div>
                  <p className="text-xs text-muted-foreground">{report.orders} đơn hàng</p>
                  <p className="text-xs text-muted-foreground">TB: {formatCurrency(report.avgOrder)}/đơn</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sales Orders Management */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Đơn Đặt Hàng</CardTitle>
                <div className="flex gap-2">
                  <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                    <DialogTrigger asChild>
                      <Button><Plus className="mr-2 h-4 w-4" />Thêm Đơn Hàng</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tạo Đơn Hàng Mới</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Input placeholder="Tên khách hàng" value={newOrder.customerName} onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})} />
                        <Input type="number" placeholder="Tổng giá trị" value={newOrder.totalAmount} onChange={(e) => setNewOrder({...newOrder, totalAmount: Number(e.target.value)})} />
                        <Input type="number" placeholder="Số lượng sản phẩm" value={newOrder.items} onChange={(e) => setNewOrder({...newOrder, items: Number(e.target.value)})} />
                        <select 
                          className="p-2 border rounded" 
                          value={newOrder.status} 
                          onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
                        >
                          <option value="Đang xử lý">Đang xử lý</option>
                          <option value="Đã xác nhận">Đã xác nhận</option>
                          <option value="Đang giao">Đang giao</option>
                          <option value="Đã giao">Đã giao</option>
                        </select>
                        <Button onClick={handleAddOrder}>Tạo Đơn Hàng</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline"><FileDown className="mr-2 h-4 w-4" />Xuất Báo Cáo</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Số SP</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>DH{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'Đã giao' ? 'bg-green-100 text-green-800' :
                          order.status === 'Đang giao' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteOrder(order.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Access Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hóa Đơn Bán Hàng</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p>Quản lý và tạo hóa đơn bán hàng cho khách hàng</p>
                <Link to="/invoices">
                  <Button className="w-full">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Xem Hóa Đơn
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Báo Cáo Chi Tiết</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p>Xem báo cáo doanh thu và lợi nhuận chi tiết</p>
                <Link to="/reports">
                  <Button className="w-full">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Xem Báo Cáo
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quản Lý Chi Phí</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p>Quản lý chi phí và tính toán lợi nhuận</p>
                <Link to="/expense-management">
                  <Button className="w-full" variant="outline">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Quản Lý Chi Phí
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sales;
