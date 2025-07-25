
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Truck, PackageCheck, Boxes, Plus, Edit, Trash2, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import NavigationMenu from '@/components/NavigationMenu';

const Purchasing = () => {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Công ty ABC', contact: '0123456789', address: 'Hà Nội', email: 'abc@email.com' },
    { id: 2, name: 'Công ty XYZ', contact: '0987654321', address: 'TP.HCM', email: 'xyz@email.com' }
  ]);
  const [orders, setOrders] = useState([
    { id: 1, supplierId: 1, orderDate: '2024-07-20', totalAmount: 5000000, status: 'Đang chờ' },
    { id: 2, supplierId: 2, orderDate: '2024-07-18', totalAmount: 3000000, status: 'Đã giao' }
  ]);
  
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', address: '', email: '' });
  const [newOrder, setNewOrder] = useState({ supplierId: 0, totalAmount: 0, status: 'Đang chờ' });
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.contact) {
      const supplier = { ...newSupplier, id: Date.now() };
      setSuppliers([...suppliers, supplier]);
      setNewSupplier({ name: '', contact: '', address: '', email: '' });
      setIsSupplierDialogOpen(false);
      toast({ title: "Thành công", description: "Nhà cung cấp đã được thêm." });
    }
  };

  const handleDeleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    toast({ title: "Thành công", description: "Nhà cung cấp đã được xóa." });
  };

  const handleAddOrder = () => {
    if (newOrder.supplierId && newOrder.totalAmount) {
      const order = { ...newOrder, id: Date.now(), orderDate: new Date().toISOString().split('T')[0] };
      setOrders([...orders, order]);
      setNewOrder({ supplierId: 0, totalAmount: 0, status: 'Đang chờ' });
      setIsOrderDialogOpen(false);
      toast({ title: "Thành công", description: "Đơn đặt hàng đã được tạo." });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quản Lý Mua Hàng</h1>
        
        <div className="grid gap-6">
          {/* Nhà cung cấp */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Nhà Cung Cấp</CardTitle>
                <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" />Thêm Nhà Cung Cấp</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm Nhà Cung Cấp Mới</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input placeholder="Tên công ty" value={newSupplier.name} onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})} />
                      <Input placeholder="Số điện thoại" value={newSupplier.contact} onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})} />
                      <Input placeholder="Địa chỉ" value={newSupplier.address} onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})} />
                      <Input placeholder="Email" value={newSupplier.email} onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})} />
                      <Button onClick={handleAddSupplier}>Lưu</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên công ty</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>{supplier.address}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteSupplier(supplier.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Đơn đặt hàng */}
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
                        <DialogTitle>Tạo Đơn Đặt Hàng Mới</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <select 
                          className="p-2 border rounded" 
                          value={newOrder.supplierId} 
                          onChange={(e) => setNewOrder({...newOrder, supplierId: Number(e.target.value)})}
                        >
                          <option value={0}>Chọn nhà cung cấp</option>
                          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <Input type="number" placeholder="Tổng giá trị" value={newOrder.totalAmount} onChange={(e) => setNewOrder({...newOrder, totalAmount: Number(e.target.value)})} />
                        <select 
                          className="p-2 border rounded" 
                          value={newOrder.status} 
                          onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
                        >
                          <option value="Đang chờ">Đang chờ</option>
                          <option value="Đã xác nhận">Đã xác nhận</option>
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
                    <TableHead>Nhà cung cấp</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Tổng giá trị</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const supplier = suppliers.find(s => s.id === order.supplierId);
                    return (
                      <TableRow key={order.id}>
                        <TableCell>DH{order.id}</TableCell>
                        <TableCell>{supplier?.name}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                        <TableCell><span className={`px-2 py-1 rounded text-xs ${order.status === 'Đã giao' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span></TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                            <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick access cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản Lý Lô Hàng</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p>Quản lý thông tin chi tiết về các lô hàng và nguồn gốc</p>
                <Link to="/batches">
                  <Button className="w-full">
                    <Boxes className="mr-2 h-4 w-4" />
                    Xem Lô Hàng
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Nhập Hàng</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p>Quản lý việc nhập hàng vào kho</p>
                <Link to="/enhanced-inventory">
                  <Button className="w-full" variant="outline">
                    <PackageCheck className="mr-2 h-4 w-4" />
                    Quản Lý Kho Hàng
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

export default Purchasing;
