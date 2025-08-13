
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
  DialogTrigger
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useApi } from '@/hooks/useApi';

type CarCategory = {
  id: number;
  name: string;
  description: string;
  service_multiplier: number;
};

const CarCategories = () => {
  const { toast } = useToast();
  const { callApi, loading } = useApi();
  const [categories, setCategories] = useState<CarCategory[]>([]);
  const [newCategory, setNewCategory] = useState<Partial<CarCategory>>({});
  const [editingCategory, setEditingCategory] = useState<CarCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Load car categories from database
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await callApi<void, CarCategory[]>({
      url: '/car-categories',
      method: 'GET'
    });
    if (data) {
      setCategories(data);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.name && newCategory.service_multiplier) {
      const createdCategory = await callApi<Partial<CarCategory>, CarCategory>({
        url: '/car-categories',
        method: 'POST',
        body: {
          name: newCategory.name,
          description: newCategory.description || '',
          service_multiplier: newCategory.service_multiplier
        }
      });

      if (createdCategory) {
        await loadCategories();
        setNewCategory({});
        setIsDialogOpen(false);
        toast({
          title: "Đã thêm loại xe mới",
          description: `Loại xe ${createdCategory.name} đã được thêm thành công.`,
        });
      }
    } else {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ tên và hệ số giá dịch vụ.",
        variant: "destructive"
      });
    }
  };

  const handleEditCategory = (category: CarCategory) => {
    setEditingCategory({ ...category });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (editingCategory && editingCategory.name && editingCategory.service_multiplier) {
      const updatedCategory = await callApi<Partial<CarCategory>, CarCategory>({
        url: `/car-categories/${editingCategory.id}`,
        method: 'PUT',
        body: {
          name: editingCategory.name,
          description: editingCategory.description || '',
          service_multiplier: editingCategory.service_multiplier
        }
      });

      if (updatedCategory) {
        await loadCategories();
        setEditingCategory(null);
        setIsEditDialogOpen(false);
        toast({
          title: "Đã cập nhật loại xe",
          description: `Loại xe ${updatedCategory.name} đã được cập nhật thành công.`,
        });
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    if (categoryToDelete) {
      const success = await callApi<void, void>({
        url: `/car-categories/${id}`,
        method: 'DELETE'
      });
      
      if (success !== null) {
        setCategories(categories.filter(cat => cat.id !== id));
        toast({
          title: "Đã xóa loại xe",
          description: `Loại xe ${categoryToDelete.name} đã được xóa thành công.`,
        });
      }
    }
  };

  if (loading && categories.length === 0) {
    return (
      <>
        <NavigationMenu />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Đang tải dữ liệu loại xe...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <NavigationMenu />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quản Lý Danh Mục Xe</h1>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Danh Sách Loại Xe</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Thêm Loại Xe
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm Loại Xe Mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input 
                    placeholder="Tên loại xe" 
                    value={newCategory.name || ''}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  />
                  <Input 
                    placeholder="Mô tả" 
                    value={newCategory.description || ''}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  />
                  <Input 
                    type="number" 
                    step="0.1"
                    placeholder="Hệ số giá dịch vụ" 
                    value={newCategory.service_multiplier || ''}
                    onChange={(e) => setNewCategory({...newCategory, service_multiplier: Number(e.target.value)})}
                  />
                  <Button onClick={handleAddCategory} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Lưu Loại Xe
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh Sửa Loại Xe</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input 
                placeholder="Tên loại xe" 
                value={editingCategory?.name || ''}
                onChange={(e) => setEditingCategory(prev => prev ? {...prev, name: e.target.value} : null)}
              />
              <Input 
                placeholder="Mô tả" 
                value={editingCategory?.description || ''}
                onChange={(e) => setEditingCategory(prev => prev ? {...prev, description: e.target.value} : null)}
              />
              <Input 
                type="number" 
                step="0.1"
                placeholder="Hệ số giá dịch vụ" 
                value={editingCategory?.service_multiplier || ''}
                onChange={(e) => setEditingCategory(prev => prev ? {...prev, service_multiplier: Number(e.target.value)} : null)}
              />
              <Button onClick={handleUpdateCategory} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập Nhật
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Loại Xe</TableHead>
                <TableHead>Mô Tả</TableHead>
                <TableHead>Hệ Số Giá</TableHead>
                <TableHead>Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.service_multiplier}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteCategory(category.id)}>
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

export default CarCategories;
