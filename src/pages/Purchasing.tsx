
import React, { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Truck, PackageCheck, Boxes, Plus, Edit, Trash2, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import NavigationMenu from '@/components/NavigationMenu';
import useApi from '@/hooks/useApi';
import ImageUpload from '@/components/ImageUpload';
import { generatePDFReport, downloadPDF, formatCurrency } from '@/utils/pdfGenerator';

const Purchasing = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', phone: '', address: '', email: '' });
  const [newOrder, setNewOrder] = useState({ supplier_id: 0, total_amount: 0, status: 'Đang chờ', packaging_images: [], notes: '' });
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const { toast } = useToast();
  const { callApi } = useApi();

  useEffect(() => {
    loadSuppliers();
    loadOrders();
  }, []);

  const loadSuppliers = async () => {
    const data = await callApi({ url: '/suppliers' });
    if (data && Array.isArray(data)) setSuppliers(data);
  };

  const loadOrders = async () => {
    const data = await callApi({ url: '/purchase-orders' });
    if (data && Array.isArray(data)) setOrders(data);
  };

  const handleAddSupplier = async () => {
    if (newSupplier.name && newSupplier.contact) {
      const data = await callApi({
        url: '/suppliers',
        method: 'POST',
        body: newSupplier
      });
      if (data) {
        setSuppliers([...suppliers, data]);
        setNewSupplier({ name: '', contact: '', phone: '', address: '', email: '' });
        setIsSupplierDialogOpen(false);
        toast({ title: "Thành công", description: "Nhà cung cấp đã được thêm." });
      }
    }
  };

  const handleEditSupplier = async () => {
    if (editingSupplier && editingSupplier.name && editingSupplier.contact) {
      const data = await callApi({
        url: `/suppliers/${editingSupplier.id}`,
        method: 'PUT',
        body: editingSupplier
      });
      if (data) {
        setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? data : s));
        setEditingSupplier(null);
        toast({ title: "Thành công", description: "Nhà cung cấp đã được cập nhật." });
      }
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    const success = await callApi({
      url: `/suppliers/${id}`,
      method: 'DELETE'
    });
    if (success) {
      setSuppliers(suppliers.filter(s => s.id !== id));
      toast({ title: "Thành công", description: "Nhà cung cấp đã được xóa." });
    }
  };

  const handleAddOrder = async () => {
    if (newOrder.supplier_id && newOrder.total_amount) {
      const data = await callApi({
        url: '/purchase-orders',
        method: 'POST',
        body: newOrder
      });
      if (data) {
        setOrders([...orders, data]);
        setNewOrder({ supplier_id: 0, total_amount: 0, status: 'Đang chờ', packaging_images: [], notes: '' });
        setIsOrderDialogOpen(false);
        toast({ title: "Thành công", description: "Đơn đặt hàng đã được tạo." });
      }
    }
  };

  const handleEditOrder = async () => {
    if (editingOrder && editingOrder.supplier_id && editingOrder.total_amount) {
      const data = await callApi({
        url: `/purchase-orders/${editingOrder.id}`,
        method: 'PUT',
        body: editingOrder
      });
      if (data) {
        setOrders(orders.map(o => o.id === editingOrder.id ? data : o));
        setEditingOrder(null);
        toast({ title: "Thành công", description: "Đơn đặt hàng đã được cập nhật." });
      }
    }
  };

  const handleDeleteOrder = async (id: number) => {
    const success = await callApi({
      url: `/purchase-orders/${id}`,
      method: 'DELETE'
    });
    if (success) {
      setOrders(orders.filter(o => o.id !== id));
      toast({ title: "Thành công", description: "Đơn đặt hàng đã được xóa." });
    }
  };

  const exportSuppliersReport = () => {
    const reportData = {
      title: 'Báo Cáo Nhà Cung Cấp',
      headers: ['Tên công ty', 'Liên hệ', 'Điện thoại', 'Email', 'Địa chỉ'],
      data: suppliers.map(s => [s.name, s.contact, s.phone || '', s.email || '', s.address || '']),
      summary: [
        { label: 'Tổng số nhà cung cấp', value: suppliers.length.toString() }
      ]
    };
    
    const doc = generatePDFReport(reportData);
    downloadPDF(doc, 'bao_cao_nha_cung_cap');
  };

  const exportOrdersReport = () => {
    const reportData = {
      title: 'Báo Cáo Đơn Đặt Hàng',
      headers: ['Mã đơn', 'Nhà cung cấp', 'Ngày đặt', 'Tổng giá trị', 'Trạng thái'],
      data: orders.map(o => [
        `DH${o.id}`,
        suppliers.find(s => s.id === o.supplier_id)?.name || '',
        o.order_date,
        formatCurrency(o.total_amount),
        o.status
      ]),
      summary: [
        { label: 'Tổng số đơn hàng', value: orders.length.toString() },
        { label: 'Tổng giá trị', value: formatCurrency(orders.reduce((sum, o) => sum + o.total_amount, 0)) }
      ]
    };
    
    const doc = generatePDFReport(reportData);
    downloadPDF(doc, 'bao_cao_don_dat_hang');
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
                          value={newOrder.supplier_id} 
                          onChange={(e) => setNewOrder({...newOrder, supplier_id: Number(e.target.value)})}
                        >
                          <option value={0}>Chọn nhà cung cấp</option>
                          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <Input type="number" placeholder="Tổng giá trị" value={newOrder.total_amount} onChange={(e) => setNewOrder({...newOrder, total_amount: Number(e.target.value)})} />
                        <Input placeholder="Ghi chú" value={newOrder.notes} onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})} />
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Ảnh chụp đóng gói (tối đa 6 ảnh/video)</label>
                          <ImageUpload 
                            images={newOrder.packaging_images} 
                            onImagesChange={(images) => setNewOrder({...newOrder, packaging_images: images})}
                            maxImages={6}
                          />
                        </div>
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
                  <Button variant="outline" onClick={exportSuppliersReport}><FileDown className="mr-2 h-4 w-4" />Xuất BC Nhà CC</Button>
                  <Button variant="outline" onClick={exportOrdersReport}><FileDown className="mr-2 h-4 w-4" />Xuất BC Đơn Hàng</Button>
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
                    <TableHead>Ảnh đóng gói</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const supplier = suppliers.find(s => s.id === order.supplier_id);
                    return (
                      <TableRow key={order.id}>
                        <TableCell>DH{order.id}</TableCell>
                        <TableCell>{supplier?.name}</TableCell>
                        <TableCell>{order.order_date}</TableCell>
                        <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                        <TableCell><span className={`px-2 py-1 rounded text-xs ${order.status === 'Đã giao' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {order.packaging_images?.slice(0, 3).map((img: string, idx: number) => (
                              <img key={idx} src={img} alt={`Package ${idx + 1}`} className="w-8 h-8 rounded object-cover" />
                            ))}
                            {order.packaging_images?.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{order.packaging_images.length - 3}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon" onClick={() => setEditingOrder(order)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteOrder(order.id)}><Trash2 className="h-4 w-4" /></Button>
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
