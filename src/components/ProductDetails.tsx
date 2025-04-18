
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type BatchInfo = {
  id: number;
  code: string;
  importDate: string;
  quantity: number;
  remainingQuantity: number;
  expiryDate?: string;
  landedCost: number;
};

type ProductDetailProps = {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    category: string;
    type: string;
    description?: string;
    specification?: string;
    batches?: BatchInfo[];
  } | null;
};

const ProductDetails = ({ isOpen, onClose, product }: ProductDetailProps) => {
  if (!product) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN').format(date);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Chi Tiết Sản Phẩm: {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Tên sản phẩm:</p>
              <p>{product.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Phân loại:</p>
              <p>{product.category}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Loại sản phẩm:</p>
            <Badge>{product.type === 'consumable' ? 'Vật tư hao phí' : 'Thiết bị'}</Badge>
          </div>
          
          {product.description && (
            <div>
              <p className="text-sm font-medium mb-1">Mô tả:</p>
              <p className="text-sm">{product.description}</p>
            </div>
          )}
          
          {product.specification && (
            <div>
              <p className="text-sm font-medium mb-1">Thông số kỹ thuật:</p>
              <p className="text-sm">{product.specification}</p>
            </div>
          )}
          
          {product.batches && product.batches.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Thông tin lô hàng</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Lô</TableHead>
                    <TableHead>Ngày Nhập</TableHead>
                    <TableHead>Số Lượng</TableHead>
                    <TableHead>Còn Lại</TableHead>
                    <TableHead>Landed Cost</TableHead>
                    {product.batches.some(b => b.expiryDate) && (
                      <TableHead>Hạn Sử Dụng</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.batches.map(batch => (
                    <TableRow key={batch.id}>
                      <TableCell>{batch.code}</TableCell>
                      <TableCell>{formatDate(batch.importDate)}</TableCell>
                      <TableCell>{batch.quantity}</TableCell>
                      <TableCell>{batch.remainingQuantity}</TableCell>
                      <TableCell>{formatCurrency(batch.landedCost)}</TableCell>
                      {product.batches?.some(b => b.expiryDate) && (
                        <TableCell>
                          {batch.expiryDate ? formatDate(batch.expiryDate) : '-'}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
