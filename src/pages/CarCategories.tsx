
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
  DialogTrigger
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from 'lucide-react';

type CarCategory = {
  id: number;
  name: string;
  description: string;
  serviceMultiplier: number; // Hệ số giá cho loại xe này
};

const CarCategories = () => {
  const [categories, setCategories] = useState<CarCategory[]>([
    { id: 1, name: 'Xe con 4 chỗ', description: 'Xe sedan, hatchback kích thước nhỏ', serviceMultiplier: 1 },
    { id: 2, name: 'Xe con 7 chỗ', description: 'Xe SUV, MPV kích thước trung bình', serviceMultiplier: 1.3 },
    { id: 3, name: 'Xe bán tải', description: 'Xe pickup, bán tải các loại', serviceMultiplier: 1.5 },
    { id: 4, name: 'Xe sang', description: 'Xe hạng sang, siêu xe', serviceMultiplier: 2 }
  ]);

  const [newCategory, setNewCategory] = useState<Partial<CarCategory>>({});
  const [editingCategory, setEditingCategory] = useState<CarCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.serviceMultiplier) {
      const categoryToAdd = {
        ...newCategory,
        id: Math.max(...categories.map(c => c.id), 0) + 1
      } as CarCategory;
      setCategories([...categories, categoryToAdd]);
      setNewCategory({});
      setIsDialogOpen(false);
    }
  };

  const handleEditCategory = (category: CarCategory) => {
    setEditingCategory({ ...category });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name && editingCategory.serviceMultiplier) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      ));
      setEditingCategory(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

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
                    value={newCategory.serviceMultiplier || ''}
                    onChange={(e) => setNewCategory({...newCategory, serviceMultiplier: Number(e.target.value)})}
                  />
                  <Button onClick={handleAddCategory}>Lưu Loại Xe</Button>
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
                value={editingCategory?.serviceMultiplier || ''}
                onChange={(e) => setEditingCategory(prev => prev ? {...prev, serviceMultiplier: Number(e.target.value)} : null)}
              />
              <Button onClick={handleUpdateCategory}>Cập Nhật</Button>
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
                  <TableCell>{category.serviceMultiplier}</TableCell>
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
