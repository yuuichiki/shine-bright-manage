
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, FileText } from 'lucide-react';

type Batch = {
  id: number;
  code: string;
  productName: string;
  productCode: string;
  quantity: number;
  importDate: string;
  basePrice: number;
  shippingCost: number;
  handlingCost: number;
  totalCost: number;
  supplier: string;
  status: 'active' | 'depleted';
};

const Batches = () => {
  const [batches, setBatches] = useState<Batch[]>([
    {
      id: 1,
      code: 'LH-2025-001',
      productName: 'Nước rửa xe cao cấp',
      productCode: 'NRX-01',
      quantity: 50,
      importDate: '2025-04-10',
      basePrice: 35000,
      shippingCost: 2000,
      handlingCost: 500,
      totalCost: 37500,
      supplier: 'Công ty TNHH Hóa Chất ABC',
      status: 'active'
    },
    {
      id: 2,
      code: 'LH-2025-002',
      productName: 'Dầu động cơ 5W-30',
      productCode: 'DDC-02',
      quantity: 30,
      importDate: '2025-04-12',
      basePrice: 150000,
      shippingCost: 5000,
      handlingCost: 1000,
      totalCost: 156000,
      supplier: 'Công ty CP Dầu Nhớt XYZ',
      status: 'active'
    },
    {
      id: 3,
      code: 'LH-2025-003',
      productName: 'Foam bọt rửa xe',
      productCode: 'FBR-03',
      quantity: 20,
      importDate: '2025-03-15',
      basePrice: 70000,
      shippingCost: 3000,
      handlingCost: 500,
      totalCost: 73500,
      supplier: 'Công ty TNHH Hóa Chất ABC',
      status: 'depleted'
    }
  ]);

  const [newBatch, setNewBatch] = useState<Partial<Batch>>({});

  const calculateTotalCost = (basePrice: number = 0, shippingCost: number = 0, handlingCost: number = 0) => {
    return basePrice + shippingCost + handlingCost;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quản Lý Lô Hàng</h1>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Danh Sách Lô Hàng</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Thêm Lô Hàng Mới
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Thêm Lô Hàng Mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Mã Lô Hàng</label>
                      <Input 
                        placeholder="Ví dụ: LH-2025-004" 
                        value={newBatch.code || ''} 
                        onChange={(e) => setNewBatch({...newBatch, code: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Ngày Nhập</label>
                      <Input 
                        type="date" 
                        value={newBatch.importDate || ''} 
                        onChange={(e) => setNewBatch({...newBatch, importDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tên Sản Phẩm</label>
                      <Input 
                        placeholder="Tên sản phẩm" 
                        value={newBatch.productName || ''} 
                        onChange={(e) => setNewBatch({...newBatch, productName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Mã Sản Phẩm</label>
                      <Input 
                        placeholder="Mã hiệu sản phẩm" 
                        value={newBatch.productCode || ''} 
                        onChange={(e) => setNewBatch({...newBatch, productCode: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nhà Cung Cấp</label>
                    <Input 
                      placeholder="Tên nhà cung cấp" 
                      value={newBatch.supplier || ''} 
                      onChange={(e) => setNewBatch({...newBatch, supplier: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Số Lượng</label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={newBatch.quantity || ''} 
                        onChange={(e) => setNewBatch({...newBatch, quantity: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Giá Vốn (VNĐ)</label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={newBatch.basePrice || ''} 
                        onChange={(e) => setNewBatch({
                          ...newBatch, 
                          basePrice: Number(e.target.value),
                          totalCost: calculateTotalCost(
                            Number(e.target.value), 
                            newBatch.shippingCost, 
                            newBatch.handlingCost
                          )
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Chi Phí Vận Chuyển</label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={newBatch.shippingCost || ''} 
                        onChange={(e) => setNewBatch({
                          ...newBatch, 
                          shippingCost: Number(e.target.value),
                          totalCost: calculateTotalCost(
                            newBatch.basePrice, 
                            Number(e.target.value), 
                            newBatch.handlingCost
                          )
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Chi Phí Xếp Dỡ</label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        value={newBatch.handlingCost || ''} 
                        onChange={(e) => setNewBatch({
                          ...newBatch, 
                          handlingCost: Number(e.target.value),
                          totalCost: calculateTotalCost(
                            newBatch.basePrice, 
                            newBatch.shippingCost, 
                            Number(e.target.value)
                          )
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tổng Chi Phí</label>
                      <Input 
                        type="number" 
                        readOnly 
                        value={calculateTotalCost(newBatch.basePrice, newBatch.shippingCost, newBatch.handlingCost) || 0} 
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                  
                  <Button className="mt-2">Lưu Lô Hàng</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Lô</TableHead>
                <TableHead>Sản Phẩm</TableHead>
                <TableHead>Mã Hiệu SP</TableHead>
                <TableHead>Ngày Nhập</TableHead>
                <TableHead>Số Lượng</TableHead>
                <TableHead>Chi Phí</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>{batch.code}</TableCell>
                  <TableCell>{batch.productName}</TableCell>
                  <TableCell>{batch.productCode}</TableCell>
                  <TableCell>{batch.importDate}</TableCell>
                  <TableCell>{batch.quantity}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Giá vốn: {formatCurrency(batch.basePrice)}</div>
                      <div>Tổng chi phí: {formatCurrency(batch.totalCost)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      batch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {batch.status === 'active' ? 'Còn hàng' : 'Đã hết'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
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
  );
};

export default Batches;
