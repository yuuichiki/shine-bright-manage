
import React, { useEffect, useMemo, useState } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import useApi from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types
interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number | null;
}

const Services = () => {
  const { callApi, loading, error } = useApi();
  const { toast } = useToast();

  // Data state
  const [services, setServices] = useState<Service[]>([]);

  // UI state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form state
  const [newService, setNewService] = useState<Partial<Service>>({});
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Effects
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await callApi<null, Service[]>({ url: '/services', method: 'GET' });
    if (data) setServices(data);
  };

  // Handlers
  const handleCreate = async () => {
    if (!newService.name || !newService.price) return;
    const payload = {
      name: newService.name,
      description: newService.description || '',
      price: Number(newService.price),
      duration: newService.duration ?? null,
    };

    const created = await callApi<typeof payload, Service>({ url: '/services', method: 'POST', body: payload });
    if (created) {
      setServices((prev) => [...prev, created]);
      setNewService({});
      setIsCreateOpen(false);
      toast({ title: 'Thành công', description: 'Đã thêm dịch vụ.' });
    }
  };

  const startEdit = (svc: Service) => {
    setEditingService({ ...svc });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingService) return;
    const payload = {
      name: editingService.name,
      description: editingService.description || '',
      price: Number(editingService.price),
      duration: editingService.duration ?? null,
    };

    const updated = await callApi<typeof payload, Service>({
      url: `/services/${editingService.id}`,
      method: 'PUT',
      body: payload,
    });

    if (updated) {
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setIsEditOpen(false);
      setEditingService(null);
      toast({ title: 'Thành công', description: 'Đã cập nhật dịch vụ.' });
    }
  };

  const handleDelete = async (id: number) => {
    const ok = await callApi<null, { message: string }>({ url: `/services/${id}`, method: 'DELETE' });
    if (ok) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast({ title: 'Thành công', description: 'Đã xóa dịch vụ.' });
    }
  };

  const formatCurrency = useMemo(
    () => (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount),
    []
  );

  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quản Lý Dịch Vụ</h1>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh Sách Dịch Vụ</CardTitle>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Thêm Dịch Vụ
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Thêm Dịch Vụ Mới</DialogTitle>
                    <DialogDescription>Nhập thông tin dịch vụ và lưu lại.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      placeholder="Tên dịch vụ"
                      value={newService.name || ''}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    />
                    <Input
                      placeholder="Mô tả"
                      value={newService.description || ''}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Giá (VNĐ)"
                      value={newService.price ?? ''}
                      onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                    />
                    <Input
                      type="number"
                      placeholder="Thời gian (phút)"
                      value={newService.duration ?? ''}
                      onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                    />
                    <Button onClick={handleCreate}>Lưu Dịch Vụ</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="text-center">Đang tải dữ liệu...</div>
              </div>
            )}
            {error && (
              <div className="text-center py-8 text-red-500">Lỗi: {error}</div>
            )}
            {!loading && !error && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Dịch Vụ</TableHead>
                    <TableHead>Mô Tả</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Thời Gian</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>{formatCurrency(service.price)}</TableCell>
                      <TableCell>{service.duration ? `${service.duration} phút` : '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => startEdit(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(service.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh Sửa Dịch Vụ</DialogTitle>
              <DialogDescription>Cập nhật thông tin dịch vụ.</DialogDescription>
            </DialogHeader>
            {editingService && (
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Tên dịch vụ"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                />
                <Input
                  placeholder="Mô tả"
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Giá (VNĐ)"
                  value={editingService.price}
                  onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Thời gian (phút)"
                  value={editingService.duration ?? 0}
                  onChange={(e) => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                />
                <Button onClick={handleUpdate}>Cập Nhật Dịch Vụ</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Services;
