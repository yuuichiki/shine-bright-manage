
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ImageIcon, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { InventoryItem } from "./types";

interface Props {
  inventory: InventoryItem[];
  formatCurrency: (amount: number) => string;
  viewInvoiceImage: (img: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, item?: InventoryItem) => void;
  handleEditClick: (item: InventoryItem) => void;
  handleDeleteItem: (id: number) => void;
}

export const InventoryTableEquipment: React.FC<Props> = ({
  inventory,
  formatCurrency,
  viewInvoiceImage,
  handleImageUpload,
  handleEditClick,
  handleDeleteItem,
}) => (
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
      {inventory
        .filter((item) => item.type === "equipment")
        .map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.quantity} {item.unit}</TableCell>
            <TableCell>{item.importDate}</TableCell>
            <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
            <TableCell>
              {item.invoiceImage ? (
                <Button variant="outline" size="sm" onClick={() => viewInvoiceImage(item.invoiceImage!)}>
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
                <Button variant="outline" size="icon" onClick={() => handleEditClick(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
);
