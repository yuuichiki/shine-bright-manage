
import React, { useState, useEffect } from 'react';
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
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useApi } from '@/hooks/useApi';

type Customer = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  discount_rate: number;
  notes?: string;
};

const Customers = () => {
  const { toast } = useToast();
  const { callApi, loading } = useApi();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Load customers from database
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await callApi<void, Customer[]>({
      url: '/customers',
      method: 'GET'
    });
    if (data) {
      setCustomers(data);
    }
  };

  const handleAddCustomer = async () => {
    if (editingCustomer.name && editingCustomer.phone) {
      if (isEditing) {
        // Update existing customer
        const updatedCustomer = await callApi<Partial<Customer>, Customer>({
          url: `/customers/${editingCustomer.id}`,
          method: 'PUT',
          body: editingCustomer
        });
        
        if (updatedCustomer) {
          setCustomers(customers.map(c => 
            c.id === editingCustomer.id ? updatedCustomer : c
          ));
          toast({
            title: "Khách hàng đã được cập nhật",
            description: `Thông tin khách hàng ${editingCustomer.name} đã được cập nhật thành công.`,
          });
        }
      } else {
        // Add new customer
        const newCustomer = await callApi<Partial<Customer>, Customer>({
          url: '/customers',
          method: 'POST',
          body: {
            name: editingCustomer.name,
            phone: editingCustomer.phone,
            email: editingCustomer.email || '',
            discount_rate: editingCustomer.discount_rate || 0,
            notes: editingCustomer.notes || ''
          }
        });
        
        if (newCustomer) {
          setCustomers([...customers, newCustomer]);
          toast({
            title: "Đã thêm khách hàng mới",
            description: `Khách hàng ${newCustomer.name} đã được thêm thành công.`,
          });
        }
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

  const handleDelete = async (id: number) => {
    const customerToDelete = customers.find(c => c.id === id);
    if (customerToDelete) {
      const success = await callApi<void, void>({
        url: `/customers/${id}`,
        method: 'DELETE'
      });
      
      if (success !== null) {
        setCustomers(customers.filter(c => c.id !== id));
        toast({
          title: "Đã xóa khách hàng",
          description: `Khách hàng ${customerToDelete.name} đã được xóa thành công.`,
        });
      }
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

  if (loading && customers.length === 0) {
    return (
      <>
        <NavigationMenu />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải dữ liệu khách hàng...</span>
          </div>
        </div>
      </>
    );
  }

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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Email</label>
                    <Input 
                      className="col-span-3"
                      value={editingCustomer.email || ''}
                      onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                      placeholder="Nhập email (tùy chọn)"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Chiết khấu (%)</label>
                    <Input 
                      className="col-span-3"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={editingCustomer.discount_rate || 0}
                      onChange={(e) => setEditingCustomer({...editingCustomer, discount_rate: parseFloat(e.target.value)})}
                      placeholder="Nhập % chiết khấu"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right">Ghi chú</label>
                    <Input 
                      className="col-span-3"
                      value={editingCustomer.notes || ''}
                      onChange={(e) => setEditingCustomer({...editingCustomer, notes: e.target.value})}
                      placeholder="Nhập ghi chú (tùy chọn)"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" onClick={handleDialogClose}>Hủy</Button>
                    <Button onClick={handleAddCustomer} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isEditing ? 'Cập nhật' : 'Thêm'}
                    </Button>
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
                <TableHead>Email</TableHead>
                <TableHead>Chiết khấu</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email || '-'}</TableCell>
                  <TableCell>{(customer.discount_rate * 100).toFixed(1)}%</TableCell>
                  <TableCell>{customer.notes || '-'}</TableCell>
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
