
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
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Edit, Trash2, AlertCircle, ImageIcon, Loader2, FileDown } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import useApi from "@/hooks/useApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Định nghĩa kiểu dữ liệu
interface InventoryItem {
  id: number;
  name: string;
  category_id?: number;
  category_name?: string;
  category?: string;
  type: 'consumable' | 'equipment';
  quantity: number;
  unit: string;
  reorder_point: number;
  unit_price: number;
  usage_rate?: string;
  import_date: string;
  invoice_image?: string;
  batch_id?: number;
  batch_code?: string;
}

interface Batch {
  id: number;
  batch_code: string;
  supplier_id?: number;
  supplier_name?: string;
  import_date: string;
  notes?: string;
}

const EnhancedInventory = () => {
  const { toast } = useToast();
  const { callApi } = useApi();
  const queryClient = useQueryClient();

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    type: 'consumable',
    import_date: new Date().toISOString().split('T')[0]
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedInvoiceImage, setSelectedInvoiceImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  // Fetch inventory data
  const { data: inventory = [], isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await callApi<null, InventoryItem[]>({ url: '/api/inventory' });
      return response || [];
    }
  });

  // Fetch batches data
  const { data: batches = [] } = useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      const response = await callApi<null, Batch[]>({ url: '/api/batches' });
      return response || [];
    }
  });

  // Mutation for adding new item
  const addItemMutation = useMutation({
    mutationFn: (item: Partial<InventoryItem>) => 
      callApi<Partial<InventoryItem>, InventoryItem>({ 
        url: '/api/inventory', 
        method: 'POST', 
        body: item 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setIsAddDialogOpen(false);
      setNewItem({ 
        type: 'consumable',
        import_date: new Date().toISOString().split('T')[0]
      });
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được thêm vào kho",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm sản phẩm",
        variant: "destructive",
      });
    }
  });

  // Mutation for updating item
  const updateItemMutation = useMutation({
    mutationFn: (item: InventoryItem) => 
      callApi<InventoryItem, InventoryItem>({ 
        url: `/api/inventory/${item.id}`, 
        method: 'PUT', 
        body: item 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được cập nhật",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật sản phẩm",
        variant: "destructive",
      });
    }
  });

  // Mutation for deleting item
  const deleteItemMutation = useMutation({
    mutationFn: (id: number) => 
      callApi<null, { message: string }>({ 
        url: `/api/inventory/${id}`, 
        method: 'DELETE' 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được xóa",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa sản phẩm",
        variant: "destructive",
      });
    }
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.quantity !== undefined) {
      addItemMutation.mutate(newItem as Partial<InventoryItem>);
    } else {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin sản phẩm",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem({
      ...item,
      category: item.category_name || item.category
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (editingItem) {
      updateItemMutation.mutate(editingItem);
    }
  };

  const handleDeleteItem = (id: number) => {
    deleteItemMutation.mutate(id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        if (isEdit && editingItem) {
          setEditingItem({...editingItem, invoice_image: base64String});
        } else {
          setNewItem({...newItem, invoice_image: base64String});
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
    return inventory.filter(item => item.quantity <= item.reorder_point);
  };

  const lowStockItems = getLowStockItems();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="font-medium text-red-700">
              Lỗi kết nối API: {(error as Error).message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quản Lý Kho Hàng (SQLite)</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <>
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
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <FileDown className="mr-2 h-4 w-4" />
                        Xuất Báo Cáo
                      </Button>
                      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" /> Thêm Sản Phẩm
                          </Button>
                        </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
                          <DialogDescription>
                            Thêm sản phẩm mới vào cơ sở dữ liệu
                          </DialogDescription>
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
                            value={newItem.unit_price || ''}
                            onChange={(e) => setNewItem({...newItem, unit_price: Number(e.target.value)})}
                          />
                          <Input 
                            type="number" 
                            placeholder="Mức cần đặt hàng" 
                            value={newItem.reorder_point || ''}
                            onChange={(e) => setNewItem({...newItem, reorder_point: Number(e.target.value)})}
                          />
                          <Input 
                            type="date" 
                            placeholder="Ngày nhập hàng" 
                            value={newItem.import_date || ''}
                            onChange={(e) => setNewItem({...newItem, import_date: e.target.value})}
                          />
                          {newItem.type === 'consumable' && (
                            <Input 
                              placeholder="Định mức sử dụng (vd: 0.2 Lít/xe)" 
                              value={newItem.usage_rate || ''}
                              onChange={(e) => setNewItem({...newItem, usage_rate: e.target.value})}
                            />
                          )}
                          <Select
                            value={newItem.batch_id?.toString()}
                            onValueChange={(value) => setNewItem({...newItem, batch_id: Number(value)})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn lô hàng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">-- Không thuộc lô hàng nào --</SelectItem>
                              {batches.map(batch => (
                                <SelectItem key={batch.id} value={batch.id.toString()}>
                                  {batch.batch_code} - {batch.import_date}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          
                          <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
                            <Button 
                              onClick={handleAddItem}
                              disabled={addItemMutation.isPending}
                            >
                              {addItemMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Lưu Sản Phẩm
                            </Button>
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>
                    </div>
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
                        <TableHead>Lô Hàng</TableHead>
                        <TableHead>Hóa Đơn</TableHead>
                        <TableHead>Tổng Giá Trị</TableHead>
                        <TableHead>Thao Tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.map((item) => (
                        <TableRow key={item.id} className={item.quantity <= item.reorder_point ? "bg-amber-50" : ""}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category_name || item.category}</TableCell>
                          <TableCell>{item.type === 'consumable' ? 'Vật tư hao phí' : 'Thiết bị'}</TableCell>
                          <TableCell className={item.quantity <= item.reorder_point ? "text-red-600 font-medium" : ""}>
                            {item.quantity} {item.unit} {item.quantity <= item.reorder_point && "(Cần nhập thêm)"}
                          </TableCell>
                          <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell>{item.import_date}</TableCell>
                          <TableCell>{item.batch_code || "—"}</TableCell>
                          <TableCell>
                            {item.invoice_image ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => viewInvoiceImage(item.invoice_image!)}
                              >
                                <ImageIcon className="h-4 w-4 mr-1" /> Xem
                              </Button>
                            ) : (
                              <span className="text-gray-500">Chưa có</span>
                            )}
                          </TableCell>
                          <TableCell>{formatCurrency(item.quantity * item.unit_price)}</TableCell>
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
                                disabled={deleteItemMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                      {inventory.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                            Không có sản phẩm nào trong kho
                          </TableCell>
                        </TableRow>
                      )}
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
                        <TableHead>Lô Hàng</TableHead>
                        <TableHead>Giá Đơn Vị</TableHead>
                        <TableHead>Thao Tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.filter(item => item.type === 'consumable').map((item) => (
                        <TableRow key={item.id} className={item.quantity <= item.reorder_point ? "bg-amber-50" : ""}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category_name || item.category}</TableCell>
                          <TableCell>{item.quantity} {item.unit}</TableCell>
                          <TableCell>{item.usage_rate || "—"}</TableCell>
                          <TableCell>{item.import_date}</TableCell>
                          <TableCell>{item.batch_code || "—"}</TableCell>
                          <TableCell>{formatCurrency(item.unit_price)}</TableCell>
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

                      {inventory.filter(item => item.type === 'consumable').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            Không có vật tư hao phí nào trong kho
                          </TableCell>
                        </TableRow>
                      )}
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
                        <TableHead>Lô Hàng</TableHead>
                        <TableHead>Giá Trị</TableHead>
                        <TableHead>Thao Tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.filter(item => item.type === 'equipment').map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category_name || item.category}</TableCell>
                          <TableCell>{item.quantity} {item.unit}</TableCell>
                          <TableCell>{item.import_date}</TableCell>
                          <TableCell>{item.batch_code || "—"}</TableCell>
                          <TableCell>{formatCurrency(item.unit_price)}</TableCell>
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

                      {inventory.filter(item => item.type === 'equipment').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Không có thiết bị nào trong kho
                          </TableCell>
                        </TableRow>
                      )}
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
                <DialogDescription>
                  Cập nhật thông tin sản phẩm trong cơ sở dữ liệu
                </DialogDescription>
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
                    value={editingItem.category || editingItem.category_name || ''}
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
                    value={editingItem.unit_price}
                    onChange={(e) => setEditingItem({...editingItem, unit_price: Number(e.target.value)})}
                  />
                  <Input 
                    type="number" 
                    placeholder="Mức cần đặt hàng" 
                    value={editingItem.reorder_point}
                    onChange={(e) => setEditingItem({...editingItem, reorder_point: Number(e.target.value)})}
                  />
                  <Input 
                    type="date" 
                    placeholder="Ngày nhập hàng" 
                    value={editingItem.import_date}
                    onChange={(e) => setEditingItem({...editingItem, import_date: e.target.value})}
                  />
                  {editingItem.type === 'consumable' && (
                    <Input 
                      placeholder="Định mức sử dụng (vd: 0.2 Lít/xe)" 
                      value={editingItem.usage_rate || ''}
                      onChange={(e) => setEditingItem({...editingItem, usage_rate: e.target.value})}
                    />
                  )}
                  <Select
                    value={editingItem.batch_id?.toString()}
                    onValueChange={(value) => setEditingItem({...editingItem, batch_id: Number(value) || undefined})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lô hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-- Không thuộc lô hàng nào --</SelectItem>
                      {batches.map(batch => (
                        <SelectItem key={batch.id} value={batch.id.toString()}>
                          {batch.batch_code} - {batch.import_date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid gap-2">
                    <label htmlFor="edit-invoice-image" className="text-sm font-medium">
                      Hình ảnh hóa đơn nhập hàng
                    </label>
                    <Input 
                      id="edit-invoice-image"
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                    />
                    {editingItem.invoice_image && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600 mb-1">Đã tải lên hình ảnh hóa đơn</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => viewInvoiceImage(editingItem.invoice_image!)}
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
                <Button 
                  onClick={handleEditSave}
                  disabled={updateItemMutation.isPending}
                >
                  {updateItemMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Lưu Thay Đổi
                </Button>
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
        </>
      )}
      </div>
    </>
  );
};

export default EnhancedInventory;
