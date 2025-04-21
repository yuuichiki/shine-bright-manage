
import React, { useState } from 'react';
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
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Edit, Trash2, AlertCircle, ImageIcon } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
  unitPrice: number;
  type: 'consumable' | 'equipment';
  usageRate?: string;
  importDate: string;
  invoiceImage?: string;
};

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Nước rửa xe', category: 'Hóa chất', quantity: 50, unit: 'Lít', reorderPoint: 20, unitPrice: 40000, type: 'consumable', usageRate: '0.2 Lít/xe con, 0.3 Lít/xe lớn', importDate: '2025-04-10' },
    { id: 2, name: 'Dầu động cơ 5W-30', category: 'Bảo dưỡng', quantity: 30, unit: 'Lít', reorderPoint: 15, unitPrice: 180000, type: 'consumable', usageRate: '4 Lít/xe con, 6 Lít/xe lớn', importDate: '2025-04-10' },
    { id: 3, name: 'Khăn lau microfiber', category: 'Dụng cụ lau chùi', quantity: 100, unit: 'Chiếc', reorderPoint: 50, unitPrice: 15000, type: 'consumable', usageRate: '2 Chiếc/xe', importDate: '2025-04-12' },
    { id: 4, name: 'Máy rửa xe áp lực cao', category: 'Thiết bị', quantity: 2, unit: 'Chiếc', reorderPoint: 1, unitPrice: 5000000, type: 'equipment', importDate: '2025-03-15' },
    { id: 5, name: 'Máy hút bụi công nghiệp', category: 'Thiết bị', quantity: 2, unit: 'Chiếc', reorderPoint: 1, unitPrice: 3000000, type: 'equipment', importDate: '2025-03-20' },
  ]);

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    type: 'consumable',
    importDate: new Date().toISOString().split('T')[0]
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInvoiceImage, setSelectedInvoiceImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.quantity !== undefined) {
      const itemToAdd = {
        ...newItem,
        id: inventory.length + 1,
        importDate: newItem.importDate || new Date().toISOString().split('T')[0]
      } as InventoryItem;
      setInventory([...inventory, itemToAdd]);
      setNewItem({ type: 'consumable', importDate: new Date().toISOString().split('T')[0] });
      setIsDialogOpen(false);
    }
  };

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (editingItem) {
      const updatedInventory = inventory.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
      setInventory(updatedInventory);
      setIsEditDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: number) => {
    const updatedInventory = inventory.filter(item => item.id !== id);
    setInventory(updatedInventory);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, item?: InventoryItem) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (item) {
          // Updating existing item
          const updatedItem = { ...item, invoiceImage: base64String };
          const updatedInventory = inventory.map(i => 
            i.id === item.id ? updatedItem : i
          );
          setInventory(updatedInventory);
        } else if (editingItem) {
          // In edit dialog
          setEditingItem({...editingItem, invoiceImage: base64String});
        } else {
          // In add dialog
          setNewItem({...newItem, invoiceImage: base64String});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const viewInvoiceImage = (image: string) => {
    setSelectedInvoiceImage(image);
    setIsImageDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.reorderPoint);
  };

  const lowStockItems = getLowStockItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quản Lý Kho Hàng</h1>

      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
            <p className="font-medium text-amber-700">
              Có {lowStockItems.length} sản phẩm cần nhập thêm hàng
            </p>
          </div>
        </div>
      )}

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="consumable">Vật tư hao phí</TabsTrigger>
          <TabsTrigger value="equipment">Thiết bị</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Danh Sách Hàng Tồn Kho</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Thêm Sản Phẩm
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input 
                        placeholder="Tên sản phẩm" 
                        value={newItem.name || ''}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      />
                      <Input 
                        placeholder="Phân loại" 
                        value={newItem.category || ''}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      />
                      <Select
                        value={newItem.type}
                        onValueChange={(value) => setNewItem({...newItem, type: value as 'consumable' | 'equipment'})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Loại sản phẩm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consumable">Vật tư hao phí</SelectItem>
                          <SelectItem value="equipment">Thiết bị</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        type="number" 
                        placeholder="Số lượng" 
                        value={newItem.quantity || ''}
                        onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                      />
                      <Input 
                        placeholder="Đơn vị" 
                        value={newItem.unit || ''}
                        onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      />
                      <Input 
                        type="number" 
                        placeholder="Giá đơn vị (VNĐ)" 
                        value={newItem.unitPrice || ''}
                        onChange={(e) => setNewItem({...newItem, unitPrice: Number(e.target.value)})}
                      />
                      <Input 
                        type="number" 
                        placeholder="Mức cần đặt hàng" 
                        value={newItem.reorderPoint || ''}
                        onChange={(e) => setNewItem({...newItem, reorderPoint: Number(e.target.value)})}
                      />
                      <Input 
                        type="date" 
                        placeholder="Ngày nhập hàng" 
                        value={newItem.importDate || ''}
                        onChange={(e) => setNewItem({...newItem, importDate: e.target.value})}
                      />
                      {newItem.type === 'consumable' && (
                        <Input 
                          placeholder="Định mức sử dụng (vd: 0.2 Lít/xe)" 
                          value={newItem.usageRate || ''}
                          onChange={(e) => setNewItem({...newItem, usageRate: e.target.value})}
                        />
                      )}
                      <div className="grid gap-2">
                        <label htmlFor="invoice-image" className="text-sm font-medium">
                          Hình ảnh hóa đơn nhập hàng
                        </label>
                        <Input 
                          id="invoice-image"
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e)}
                        />
                      </div>
                      <Button onClick={handleAddItem}>Lưu Sản Phẩm</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Phân Loại</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Số Lượng</TableHead>
                    <TableHead>Giá Đơn Vị</TableHead>
                    <TableHead>Ngày Nhập</TableHead>
                    <TableHead>Hóa Đơn</TableHead>
                    <TableHead>Tổng Giá Trị</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id} className={item.quantity <= item.reorderPoint ? "bg-amber-50" : ""}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.type === 'consumable' ? 'Vật tư hao phí' : 'Thiết bị'}</TableCell>
                      <TableCell className={item.quantity <= item.reorderPoint ? "text-red-600 font-medium" : ""}>
                        {item.quantity} {item.unit} {item.quantity <= item.reorderPoint && "(Cần nhập thêm)"}
                      </TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>{item.importDate}</TableCell>
                      <TableCell>
                        {item.invoiceImage ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewInvoiceImage(item.invoiceImage!)}
                          >
                            <ImageIcon className="h-4 w-4 mr-1" /> Xem
                          </Button>
                        ) : (
                          <label className="cursor-pointer">
                            <Input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleImageUpload(e, item)}
                            />
                            <div className="flex items-center text-sm text-blue-500 hover:underline">
                              <ImageIcon className="h-4 w-4 mr-1" /> Tải lên
                            </div>
                          </label>
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditClick(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                          >
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
        </TabsContent>

        <TabsContent value="consumable">
          <Card>
            <CardHeader>
              <CardTitle>Vật Tư Hao Phí</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Phân Loại</TableHead>
                    <TableHead>Số Lượng</TableHead>
                    <TableHead>Định Mức Sử Dụng</TableHead>
                    <TableHead>Ngày Nhập</TableHead>
                    <TableHead>Giá Đơn Vị</TableHead>
                    <TableHead>Hóa Đơn</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.filter(item => item.type === 'consumable').map((item) => (
                    <TableRow key={item.id} className={item.quantity <= item.reorderPoint ? "bg-amber-50" : ""}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>{item.usageRate}</TableCell>
                      <TableCell>{item.importDate}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>
                        {item.invoiceImage ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewInvoiceImage(item.invoiceImage!)}
                          >
                            <ImageIcon className="h-4 w-4 mr-1" /> Xem
                          </Button>
                        ) : (
                          <label className="cursor-pointer">
                            <Input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleImageUpload(e, item)}
                            />
                            <div className="flex items-center text-sm text-blue-500 hover:underline">
                              <ImageIcon className="h-4 w-4 mr-1" /> Tải lên
                            </div>
                          </label>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditClick(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                          >
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
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Thiết Bị</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Thiết Bị</TableHead>
                    <TableHead>Phân Loại</TableHead>
                    <TableHead>Số Lượng</TableHead>
                    <TableHead>Ngày Nhập</TableHead>
                    <TableHead>Giá Trị</TableHead>
                    <TableHead>Hóa Đơn</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.filter(item => item.type === 'equipment').map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>{item.importDate}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>
                        {item.invoiceImage ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => viewInvoiceImage(item.invoiceImage!)}
                          >
                            <ImageIcon className="h-4 w-4 mr-1" /> Xem
                          </Button>
                        ) : (
                          <label className="cursor-pointer">
                            <Input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleImageUpload(e, item)}
                            />
                            <div className="flex items-center text-sm text-blue-500 hover:underline">
                              <ImageIcon className="h-4 w-4 mr-1" /> Tải lên
                            </div>
                          </label>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditClick(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                          >
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
        </TabsContent>
      </Tabs>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Sản Phẩm</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <Input 
                placeholder="Tên sản phẩm" 
                value={editingItem.name}
                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              />
              <Input 
                placeholder="Phân loại" 
                value={editingItem.category}
                onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
              />
              <Select
                value={editingItem.type}
                onValueChange={(value) => setEditingItem({...editingItem, type: value as 'consumable' | 'equipment'})}>
                <SelectTrigger>
                  <SelectValue placeholder="Loại sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumable">Vật tư hao phí</SelectItem>
                  <SelectItem value="equipment">Thiết bị</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="number" 
                placeholder="Số lượng" 
                value={editingItem.quantity}
                onChange={(e) => setEditingItem({...editingItem, quantity: Number(e.target.value)})}
              />
              <Input 
                placeholder="Đơn vị" 
                value={editingItem.unit}
                onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
              />
              <Input 
                type="number" 
                placeholder="Giá đơn vị (VNĐ)" 
                value={editingItem.unitPrice}
                onChange={(e) => setEditingItem({...editingItem, unitPrice: Number(e.target.value)})}
              />
              <Input 
                type="number" 
                placeholder="Mức cần đặt hàng" 
                value={editingItem.reorderPoint}
                onChange={(e) => setEditingItem({...editingItem, reorderPoint: Number(e.target.value)})}
              />
              <Input 
                type="date" 
                placeholder="Ngày nhập hàng" 
                value={editingItem.importDate}
                onChange={(e) => setEditingItem({...editingItem, importDate: e.target.value})}
              />
              {editingItem.type === 'consumable' && (
                <Input 
                  placeholder="Định mức sử dụng (vd: 0.2 Lít/xe)" 
                  value={editingItem.usageRate || ''}
                  onChange={(e) => setEditingItem({...editingItem, usageRate: e.target.value})}
                />
              )}
              <div className="grid gap-2">
                <label htmlFor="edit-invoice-image" className="text-sm font-medium">
                  Hình ảnh hóa đơn nhập hàng
                </label>
                <Input 
                  id="edit-invoice-image"
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                />
                {editingItem.invoiceImage && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600 mb-1">Đã tải lên hình ảnh hóa đơn</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => viewInvoiceImage(editingItem.invoiceImage!)}
                    >
                      <ImageIcon className="h-4 w-4 mr-1" /> Xem hình ảnh
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleEditSave}>Lưu Thay Đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image View Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Hình Ảnh Hóa Đơn</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {selectedInvoiceImage && (
              <img 
                src={selectedInvoiceImage} 
                alt="Hóa đơn nhập hàng" 
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsImageDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
