import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Ticket, Copy } from 'lucide-react';
import useApi from '@/hooks/useApi';

interface PromotionVoucherDialogProps {
  promotionId: number;
  promotionName: string;
}

const PromotionVoucherDialog: React.FC<PromotionVoucherDialogProps> = ({ 
  promotionId, 
  promotionName 
}) => {
  const { callApi } = useApi();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    quantity: 1,
    usage_limit_per_customer: 1,
    min_order_amount: 0,
    max_discount_amount: null,
    valid_from: '',
    valid_to: '',
    applicable_customer_groups: '',
  });

  const generateVoucherCode = () => {
    const prefix = 'PROMO';
    const randomNum = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `${prefix}${randomNum}`;
    setFormData(prev => ({ ...prev, code }));
  };

  const copyVoucherCode = () => {
    navigator.clipboard.writeText(formData.code);
    toast({
      title: "Đã sao chép",
      description: "Mã voucher đã được sao chép vào clipboard",
    });
  };

  const handleSaveVoucher = async () => {
    if (!formData.code || !formData.name || !formData.valid_from || !formData.valid_to) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin voucher",
        variant: "destructive"
      });
      return;
    }

    try {
      const voucherData = {
        ...formData,
        promotion_id: promotionId,
        is_active: true,
        used_count: 0
      };

      const result = await callApi({
        url: '/vouchers',
        method: 'POST',
        body: voucherData
      });

      if (result) {
        toast({
          title: "Thành công",
          description: "Voucher đã được tạo thành công",
        });
        setIsOpen(false);
        setFormData({
          code: '',
          name: '',
          description: '',
          discount_type: 'percentage',
          discount_value: 0,
          quantity: 1,
          usage_limit_per_customer: 1,
          min_order_amount: 0,
          max_discount_amount: null,
          valid_from: '',
          valid_to: '',
          applicable_customer_groups: '',
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo voucher",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Ticket className="mr-2 h-4 w-4" />
          Tạo Voucher
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo Voucher từ Khuyến mãi: {promotionName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <Label htmlFor="code">Mã Voucher</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Nhập mã voucher"
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button type="button" variant="outline" onClick={generateVoucherCode}>
                Tự động
              </Button>
              {formData.code && (
                <Button type="button" variant="ghost" size="sm" onClick={copyVoucherCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên Voucher</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tên voucher"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                min="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Mô tả voucher"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount_type">Loại giảm giá</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, discount_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                  <SelectItem value="fixed">Số tiền cố định</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discount_value">
                Giá trị giảm {formData.discount_type === 'percentage' ? '(%)' : '(VND)'}
              </Label>
              <Input
                id="discount_value"
                type="number"
                value={formData.discount_value}
                onChange={(e) => setFormData(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))}
                min="0"
                max={formData.discount_type === 'percentage' ? "100" : undefined}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min_order_amount">Đơn hàng tối thiểu (VND)</Label>
              <Input
                id="min_order_amount"
                type="number"
                value={formData.min_order_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, min_order_amount: parseFloat(e.target.value) || 0 }))}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="max_discount_amount">Giảm tối đa (VND)</Label>
              <Input
                id="max_discount_amount"
                type="number"
                value={formData.max_discount_amount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, max_discount_amount: e.target.value ? parseFloat(e.target.value) : null }))}
                min="0"
                placeholder="Không giới hạn"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valid_from">Có hiệu lực từ</Label>
              <Input
                id="valid_from"
                type="datetime-local"
                value={formData.valid_from}
                onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="valid_to">Có hiệu lực đến</Label>
              <Input
                id="valid_to"
                type="datetime-local"
                value={formData.valid_to}
                onChange={(e) => setFormData(prev => ({ ...prev, valid_to: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="usage_limit_per_customer">Giới hạn sử dụng/khách hàng</Label>
            <Input
              id="usage_limit_per_customer"
              type="number"
              value={formData.usage_limit_per_customer}
              onChange={(e) => setFormData(prev => ({ ...prev, usage_limit_per_customer: parseInt(e.target.value) || 1 }))}
              min="1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button type="button" onClick={handleSaveVoucher}>
            Tạo Voucher
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionVoucherDialog;