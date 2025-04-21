
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Plus } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InventoryTableAll } from "@/components/inventory/InventoryTableAll";
import { InventoryTableConsumable } from "@/components/inventory/InventoryTableConsumable";
import { InventoryTableEquipment } from "@/components/inventory/InventoryTableEquipment";
import { InventoryAddEditDialog } from "@/components/inventory/InventoryAddEditDialog";
import { InvoiceImageDialog } from "@/components/inventory/InvoiceImageDialog";
import type { InventoryItem } from "@/components/inventory/types";

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
          setEditingItem({ ...editingItem, invoiceImage: base64String });
        } else {
          // In add dialog
          setNewItem({ ...newItem, invoiceImage: base64String });
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
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Thêm Sản Phẩm
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <InventoryTableAll
                inventory={inventory}
                formatCurrency={formatCurrency}
                viewInvoiceImage={viewInvoiceImage}
                handleImageUpload={handleImageUpload}
                handleEditClick={handleEditClick}
                handleDeleteItem={handleDeleteItem}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="consumable">
          <Card>
            <CardHeader>
              <CardTitle>Vật Tư Hao Phí</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryTableConsumable
                inventory={inventory}
                formatCurrency={formatCurrency}
                viewInvoiceImage={viewInvoiceImage}
                handleImageUpload={handleImageUpload}
                handleEditClick={handleEditClick}
                handleDeleteItem={handleDeleteItem}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Thiết Bị</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryTableEquipment
                inventory={inventory}
                formatCurrency={formatCurrency}
                viewInvoiceImage={viewInvoiceImage}
                handleImageUpload={handleImageUpload}
                handleEditClick={handleEditClick}
                handleDeleteItem={handleDeleteItem}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <InventoryAddEditDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        isEdit={false}
        item={newItem}
        setItem={setNewItem}
        onSave={handleAddItem}
        handleImageUpload={(e) => handleImageUpload(e)}
      />
      <InventoryAddEditDialog
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
        isEdit={true}
        item={editingItem}
        setItem={(item) => setEditingItem(item as InventoryItem)}
        onSave={handleEditSave}
        handleImageUpload={(e) => handleImageUpload(e)}
      />
      <InvoiceImageDialog
        open={isImageDialogOpen}
        setOpen={setIsImageDialogOpen}
        image={selectedInvoiceImage}
      />
    </div>
  );
};

export default Inventory;
