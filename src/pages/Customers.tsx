
import React, { useState } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Phone, User, Percent } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

type Customer = {
  id: number;
  name: string;
  phone: string;
  visitCount: number;
  discountPercent: number;
  totalSpent: number;
};

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'Nguyễn Văn A', phone: '0912345678', visitCount: 12, discountPercent: 10, totalSpent: 4500000 },
    { id: 2, name: 'Trần Thị B', phone: '0987654321', visitCount: 5, discountPercent: 5, totalSpent: 1800000 },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleAddCustomer = () => {
    if (editingCustomer.name && editingCustomer.phone) {
      if (isEditing) {
        // Update existing customer
        setCustomers(customers.map(c => 
          c.id === editingCustomer.id ? { ...c, ...editingCustomer } : c
        ));
        toast({
          title: "Khách hàng đã được cập nhật",
          description: `Thông tin khách hàng ${editingCustomer.name} đã được cập nhật thành công.`,
        });
      } else {
        // Add new customer
        const newCustomer = {
          id: customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1,
          name: editingCustomer.name,
          phone: editingCustomer.phone,
          visitCount: 0,
          discountPercent: editingCustomer.discountPercent || 0,
          totalSpent: 0
        };
        setCustomers([...customers, newCustomer]);
        toast({
          title: "Đã thêm khách hàng mới",
          description: `Khách hàng ${newCustomer.name} đã được thêm thành công.`,
        });
      }
      
      setIsDialogOpen(false);
      setEditingCustomer({});
      setIsEditing(false);
    } else {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ tên và số điện thoại của khách hàng.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    const customerToDelete = customers.find(c => c.id === id);
    if (customerToDelete) {
      setCustomers(customers.filter(c => c.id !== id));
      toast({
        title: "Đã xóa khách hàng",
        description: `Khách hàng ${customerToDelete.name} đã được xóa thành công.`,
      });
    }
  };

  const handleDialogOpen = () => {
    if (!isEditing) {
      setEditingCustomer({});
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCustomer({});
    setIsEditing(false);
  };

  return (
    <>
    <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quản Lý Khách Hàng</h1>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Danh Sách Khách Hàng</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Thêm Khách Hàng
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isEditing ? 'Sửa Thông Tin Khách Hàng' : 'Thêm Khách Hàng Mới'}</DialogTitle>
                  <DialogDescription>
                    {isEditing ? 'Cập nhật thông tin khách hàng' : 'Nhập thông tin khách hàng mới'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Tên khách hàng</label>
                    <Input 
                      className="col-span-3"
                      value={editingCustomer.name || ''}
                      onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                      placeholder="Nhập tên khách hàng"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Số điện thoại</label>
                    <Input 
                      className="col-span-3"
                      value={editingCustomer.phone || ''}
                      onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  {isEditing && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right">Chiết khấu (%)</label>
                      <Input 
                        className="col-span-3"
                        type="number"
                        min="0"
                        max="100"
                        value={editingCustomer.discountPercent || 0}
                        onChange={(e) => setEditingCustomer({...editingCustomer, discountPercent: parseInt(e.target.value, 10)})}
                        placeholder="Nhập % chiết khấu"
                      />
                    </div>
                  )}
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" onClick={handleDialogClose}>Hủy</Button>
                    <Button onClick={handleAddCustomer}>{isEditing ? 'Cập nhật' : 'Thêm'}</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên khách hàng</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Số lần ghé</TableHead>
                <TableHead>Chiết khấu</TableHead>
                <TableHead>Tổng chi tiêu</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.visitCount}</TableCell>
                  <TableCell>{customer.discountPercent}%</TableCell>
                  <TableCell>{customer.totalSpent.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(customer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(customer.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default Customers;
