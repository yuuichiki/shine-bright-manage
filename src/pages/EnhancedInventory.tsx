
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
  DialogTrigger 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Edit, Trash2, AlertCircle, Eye, FileBox } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import ProductDetails from '@/components/ProductDetails';

type BatchInfo = {
  id: number;
  code: string;
  importDate: string;
  quantity: number;
  remainingQuantity: number;
  expiryDate?: string;
  landedCost: number;
};

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
  description?: string;
  specification?: string;
  productCode?: string;
  batches?: BatchInfo[];
};

const EnhancedInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { 
      id: 1, 
      name: 'Nước rửa xe', 
      category: 'Hóa chất', 
      quantity: 50, 
      unit: 'Lít', 
      reorderPoint: 20, 
      unitPrice: 40000, 
      type: 'consumable', 
      usageRate: '0.2 Lít/xe con, 0.3 Lít/xe lớn',
      description: 'Nước rửa xe không làm hại bề mặt sơn, an toàn cho xe',
      productCode: 'NRX-001',
      batches: [
        {
          id: 1,
          code: 'LH-2025-001',
          importDate: '2025-04-10',
          quantity: 30,
          remainingQuantity: 30,
          landedCost: 37500
        },
        {
          id: 2,
          code: 'LH-2025-004',
          importDate: '2025-04-18',
          quantity: 20,
          remainingQuantity: 20,
          landedCost: 38000
        }
      ]
    },
    { 
      id: 2, 
      name: 'Dầu động cơ 5W-30', 
      category: 'Bảo dưỡng', 
      quantity: 30, 
      unit: 'Lít', 
      reorderPoint: 15, 
      unitPrice: 180000, 
      type: 'consumable', 
      usageRate: '4 Lít/xe con, 6 Lít/xe lớn',
      description: 'Dầu động cơ tổng hợp cao cấp',
      specification: 'API SN, ILSAC GF-5',
      productCode: 'DDC-001',
      batches: [
        {
          id: 3,
          code: 'LH-2025-002',
          importDate: '2025-04-12',
          quantity: 30,
          remainingQuantity: 30,
          expiryDate: '2027-04-12',
          landedCost: 156000
        }
      ]
    },
    { 
      id: 3, 
      name: 'Khăn lau microfiber', 
      category: 'Dụng cụ lau chùi', 
      quantity: 100, 
      unit: 'Chiếc', 
      reorderPoint: 50, 
      unitPrice: 15000, 
      type: 'consumable', 
      usageRate: '2 Chiếc/xe',
      productCode: 'KLM-001'
    },
    { 
      id: 4, 
      name: 'Máy rửa xe áp lực cao', 
      category: 'Thiết bị', 
      quantity: 2, 
      unit: 'Chiếc', 
      reorderPoint: 1, 
      unitPrice: 5000000, 
      type: 'equipment',
      specification: 'Áp lực: 150 bar, Công suất: 2200W',
      productCode: 'MRX-001'
    },
    { 
      id: 5, 
      name: 'Máy hút bụi công nghiệp', 
      category: 'Thiết bị', 
      quantity: 2, 
      unit: 'Chiếc', 
      reorderPoint: 1, 
      unitPrice: 3000000, 
      type: 'equipment',
      specification: 'Công suất: 1800W, Dung tích: 30L',
      productCode: 'MHB-001'
    },
    {
      id: 6,
      name: 'Foam bọt rửa xe',
      category: 'Hóa chất',
      quantity: 40,
      unit: 'Lít',
      reorderPoint: 15,
      unitPrice: 75000,
      type: 'consumable',
      usageRate: '0.1 Lít/xe con, 0.15 Lít/xe lớn',
      description: 'Tạo bọt dày, bám dính lâu, làm sạch hiệu quả',
      productCode: 'FBR-001',
      batches: [
        {
          id: 4,
          code: 'LH-2025-003',
          importDate: '2025-03-15',
          quantity: 40,
          remainingQuantity: 40,
          landedCost: 73500
        }
      ]
    },
    {
      id: 7,
      name: 'Nước rửa kính xe',
      category: 'Hóa chất',
      quantity: 30,
      unit: 'Chai',
      reorderPoint: 10,
      unitPrice: 35000,
      type: 'consumable',
      description: 'Làm sạch kính xe không để lại vệt',
      productCode: 'NRK-001'
    },
    {
      id: 8,
      name: 'Chất tẩy vành',
      category: 'Hóa chất',
      quantity: 25,
      unit: 'Chai',
      reorderPoint: 10,
      unitPrice: 45000,
      type: 'consumable',
      description: 'Làm sạch mâm và lốp xe',
      productCode: 'CTV-001'
    }
  ]);

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    type: 'consumable'
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [showBatchField, setShowBatchField] = useState(false);

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.quantity !== undefined) {
      const itemToAdd = {
        ...newItem,
        id: inventory.length + 1
      } as InventoryItem;
      
      if (showBatchField && newItem.batches && newItem.batches.length > 0) {
        // Ensure the batch is properly formatted
        itemToAdd.batches = newItem.batches;
      }
      
      setInventory([...inventory, itemToAdd]);
      setNewItem({ type: 'consumable' });
      setIsDialogOpen(false);
      setShowBatchField(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.reorderPoint);
  };

  const lowStockItems = getLowStockItems();

  const viewProductDetails = (product: InventoryItem) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

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
          <TabsTrigger value="cleaning">Hóa chất tẩy rửa</TabsTrigger>
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
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                          placeholder="Tên sản phẩm" 
                          value={newItem.name || ''}
                          onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        />
                        <Input 
                          placeholder="Mã sản phẩm" 
                          value={newItem.productCode || ''}
                          onChange={(e) => setNewItem({...newItem, productCode: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          placeholder="Mức cần đặt hàng" 
                          value={newItem.reorderPoint || ''}
                          onChange={(e) => setNewItem({...newItem, reorderPoint: Number(e.target.value)})}
                        />
                      </div>
                      
                      <Input 
                        type="number" 
                        placeholder="Giá đơn vị (VNĐ)" 
                        value={newItem.unitPrice || ''}
                        onChange={(e) => setNewItem({...newItem, unitPrice: Number(e.target.value)})}
                      />
                      
                      {newItem.type === 'consumable' && (
                        <Input 
                          placeholder="Định mức sử dụng (vd: 0.2 Lít/xe)" 
                          value={newItem.usageRate || ''}
                          onChange={(e) => setNewItem({...newItem, usageRate: e.target.value})}
                        />
                      )}
                      
                      <Input 
                        placeholder="Mô tả sản phẩm" 
                        value={newItem.description || ''}
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      />
                      
                      <Input 
                        placeholder="Thông số kỹ thuật" 
                        value={newItem.specification || ''}
                        onChange={(e) => setNewItem({...newItem, specification: e.target.value})}
                      />
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="batch-info" 
                          checked={showBatchField} 
                          onCheckedChange={(checked) => setShowBatchField(checked as boolean)}
                        />
                        <label htmlFor="batch-info" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Thêm thông tin lô hàng
                        </label>
                      </div>
                      
                      {showBatchField && (
                        <div className="border p-4 rounded-md">
                          <h3 className="text-sm font-medium mb-2">Thông tin lô hàng</h3>
                          <div className="grid gap-3">
                            <div className="grid grid-cols-2 gap-3">
                              <Input 
                                placeholder="Mã lô" 
                                onChange={(e) => setNewItem({
                                  ...newItem, 
                                  batches: [{
                                    id: Date.now(),
                                    code: e.target.value,
                                    importDate: "",
                                    quantity: 0,
                                    remainingQuantity: 0,
                                    landedCost: 0
                                  }]
                                })}
                              />
                              <Input 
                                type="date" 
                                placeholder="Ngày nhập" 
                                onChange={(e) => {
                                  if (newItem.batches && newItem.batches.length > 0) {
                                    const updatedBatches = [...newItem.batches];
                                    updatedBatches[0] = {...updatedBatches[0], importDate: e.target.value};
                                    setNewItem({...newItem, batches: updatedBatches});
                                  }
                                }}
                              />
                            </div>
                            <Input 
                              type="number" 
                              placeholder="Chi phí landed cost (bao gồm giá vốn, vận chuyển, xếp dỡ)" 
                              onChange={(e) => {
                                if (newItem.batches && newItem.batches.length > 0) {
                                  const updatedBatches = [...newItem.batches];
                                  updatedBatches[0] = {
                                    ...updatedBatches[0], 
                                    landedCost: Number(e.target.value),
                                    quantity: newItem.quantity || 0,
                                    remainingQuantity: newItem.quantity || 0
                                  };
                                  setNewItem({...newItem, batches: updatedBatches});
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}
                      
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
                    <TableHead>Mã SP</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Phân Loại</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Số Lượng</TableHead>
                    <TableHead>Giá Đơn Vị</TableHead>
                    <TableHead>Tổng Giá Trị</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id} className={item.quantity <= item.reorderPoint ? "bg-amber-50" : ""}>
                      <TableCell>{item.productCode}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.type === 'consumable' ? 'Vật tư hao phí' : 'Thiết bị'}</TableCell>
                      <TableCell className={item.quantity <= item.reorderPoint ? "text-red-600 font-medium" : ""}>
                        {item.quantity} {item.unit} {item.quantity <= item.reorderPoint && "(Cần nhập thêm)"}
                      </TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => viewProductDetails(item)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon">
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
                    <TableHead>Mã SP</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Phân Loại</TableHead>
                    <TableHead>Số Lượng</TableHead>
                    <TableHead>Định Mức Sử Dụng</TableHead>
                    <TableHead>Giá Đơn Vị</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.filter(item => item.type === 'consumable').map((item) => (
                    <TableRow key={item.id} className={item.quantity <= item.reorderPoint ? "bg-amber-50" : ""}>
                      <TableCell>{item.productCode}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>{item.usageRate}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => viewProductDetails(item)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
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
                    <TableHead>Mã SP</TableHead>
                    <TableHead>Tên Thiết Bị</TableHead>
                    <TableHead>Phân Loại</TableHead>
                    <TableHead>Số Lượng</TableHead>
                    <TableHead>Thông Số</TableHead>
                    <TableHead>Giá Trị</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.filter(item => item.type === 'equipment').map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productCode}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>{item.specification}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => viewProductDetails(item)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="cleaning">
          <Card>
            <CardHeader>
              <CardTitle>Hóa Chất Tẩy Rửa</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã SP</TableHead>
                    <TableHead>Tên Sản Phẩm</TableHead>
                    <TableHead>Công Dụng</TableHead>
                    <TableHead>Số Lượng</TableHead>
                    <TableHead>Định Mức Sử Dụng</TableHead>
                    <TableHead>Giá Đơn Vị</TableHead>
                    <TableHead>Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.filter(item => item.category === 'Hóa chất').map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productCode}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>{item.usageRate}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => viewProductDetails(item)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
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
      
      <ProductDetails 
        isOpen={isProductDetailOpen} 
        onClose={() => setIsProductDetailOpen(false)} 
        product={selectedProduct} 
      />
    </div>
  );
};

export default EnhancedInventory;
