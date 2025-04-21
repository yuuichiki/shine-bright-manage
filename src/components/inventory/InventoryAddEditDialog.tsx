
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon } from "lucide-react";
import type { InventoryItem } from "./types";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  isEdit: boolean;
  item: Partial<InventoryItem> | null;
  setItem: (item: Partial<InventoryItem> | null) => void;
  onSave: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InventoryAddEditDialog: React.FC<Props> = ({
  open,
  setOpen,
  isEdit,
  item,
  setItem,
  onSave,
  handleImageUpload
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}</DialogTitle>
      </DialogHeader>
      {item && (
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Tên sản phẩm"
            value={item.name || ''}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
          />
          <Input
            placeholder="Phân loại"
            value={item.category || ''}
            onChange={(e) => setItem({ ...item, category: e.target.value })}
          />
          <Select
            value={item.type}
            onValueChange={(value) => setItem({ ...item, type: value as 'consumable' | 'equipment' })}
          >
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
            value={item.quantity ?? ''}
            onChange={(e) => setItem({ ...item, quantity: Number(e.target.value) })}
          />
          <Input
            placeholder="Đơn vị"
            value={item.unit || ''}
            onChange={(e) => setItem({ ...item, unit: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Giá đơn vị (VNĐ)"
            value={item.unitPrice ?? ''}
            onChange={(e) => setItem({ ...item, unitPrice: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Mức cần đặt hàng"
            value={item.reorderPoint ?? ''}
            onChange={(e) => setItem({ ...item, reorderPoint: Number(e.target.value) })}
          />
          <Input
            type="date"
            placeholder="Ngày nhập hàng"
            value={item.importDate || ''}
            onChange={(e) => setItem({ ...item, importDate: e.target.value })}
          />
          {item.type === 'consumable' && (
            <Input
              placeholder="Định mức sử dụng (vd: 0.2 Lít/xe)"
              value={item.usageRate || ''}
              onChange={(e) => setItem({ ...item, usageRate: e.target.value })}
            />
          )}
          <div className="grid gap-2">
            <label htmlFor={isEdit ? "edit-invoice-image" : "invoice-image"} className="text-sm font-medium">
              Hình ảnh hóa đơn nhập hàng
            </label>
            <Input
              id={isEdit ? "edit-invoice-image" : "invoice-image"}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {item.invoiceImage && (
              <div className="mt-2">
                <p className="text-sm text-green-600 mb-1">Đã tải lên hình ảnh hóa đơn</p>
                <Button variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-1" /> Xem hình ảnh
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
        <Button onClick={onSave}>Lưu {isEdit ? "Thay Đổi" : "Sản Phẩm"}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

