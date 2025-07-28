import React, { useState, useEffect } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Ticket, FileDown, Copy } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import useApi from '@/hooks/useApi';
import { generateVoucherReport } from '@/utils/pdfGenerator';

type Voucher = {
  id: number;
  code: string;
  promotion_id?: number;
  customer_id?: number;
  customer_group_id?: number;
  discount_type: string;
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount?: number;
  valid_from: string;
  valid_until: string;
  is_used: boolean;
  used_date?: string;
  used_invoice_id?: number;
  customer_name?: string;
  group_name?: string;
  promotion_name?: string;
  created_at: string;
};

type Customer = {
  id: number;
  name: string;
  phone: string;
};

type CustomerGroup = {
  id: number;
  name: string;
};

type Promotion = {
  id: number;
  name: string;
};

const Vouchers = () => {
  const { toast } = useToast();
  const { callApi, loading } = useApi();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Partial<Voucher>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchVouchers();
    fetchCustomers();
    fetchCustomerGroups();
    fetchPromotions();
  }, []);

  const fetchVouchers = async () => {
    const data = await callApi<null, Voucher[]>({ url: '/vouchers' });
    if (data) setVouchers(data);
  };

  const fetchCustomers = async () => {
    const data = await callApi<null, Customer[]>({ url: '/customers' });
    if (data) setCustomers(data);
  };

  const fetchCustomerGroups = async () => {
    const data = await callApi<null, CustomerGroup[]>({ url: '/customer-groups' });
    if (data) setCustomerGroups(data);
  };

  const fetchPromotions = async () => {
    const data = await callApi<null, Promotion[]>({ url: '/promotions' });
    if (data) setPromotions(data);
  };

  const generateVoucherCode = () => {
    const prefix = 'VC';
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${randomString}`;
  };

  const handleSaveVoucher = async () => {
    if (!editingVoucher.code || !editingVoucher.discount_type || !editingVoucher.discount_value) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive"
      });
      return;
    }

    const voucherData = {
      ...editingVoucher,
      min_purchase_amount: editingVoucher.min_purchase_amount || 0,
    };

    if (isEditing) {
      const success = await callApi({
        url: `/vouchers/${editingVoucher.id}`,
        method: 'PUT',
        body: voucherData
      });
      if (success) {
        toast({ title: "Đã cập nhật voucher" });
        fetchVouchers();
      }
    } else {
      const data = await callApi<Partial<Voucher>, Voucher>({
        url: '/vouchers',
        method: 'POST',
        body: voucherData
      });
      if (data) {
        toast({ title: "Đã tạo voucher mới" });
        fetchVouchers();
      }
    }

    setIsDialogOpen(false);
    setEditingVoucher({});
    setIsEditing(false);
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const success = await callApi({ url: `/vouchers/${id}`, method: 'DELETE' });
    if (success) {
      toast({ title: "Đã xóa voucher" });
      fetchVouchers();
    }
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Đã sao chép mã voucher" });
  };

  const exportReport = () => {
    generateVoucherReport(vouchers);
    toast({ title: "Đã xuất báo cáo" });
  };

  const getVoucherStatus = (voucher: Voucher) => {
    if (voucher.is_used) return { label: 'Đã sử dụng', color: 'secondary' };
    
    const now = new Date();
    const validFrom = new Date(voucher.valid_from);
    const validUntil = new Date(voucher.valid_until);
    
    if (now < validFrom) return { label: 'Chưa có hiệu lực', color: 'secondary' };
    if (now > validUntil) return { label: 'Đã hết hạn', color: 'destructive' };
    return { label: 'Có hiệu lực', color: 'default' };
  };

  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quản Lý Voucher</h1>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh Sách Voucher</CardTitle>
              <div className="flex gap-2">
                <Button onClick={exportReport} variant="outline">
                  <FileDown className="mr-2 h-4 w-4" /> Xuất báo cáo
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Thêm Voucher
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{isEditing ? 'Sửa Voucher' : 'Thêm Voucher Mới'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Mã voucher *</label>
                          <div className="flex gap-2">
                            <Input
                              value={editingVoucher.code || ''}
                              onChange={(e) => setEditingVoucher({...editingVoucher, code: e.target.value})}
                              placeholder="Nhập mã voucher"
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setEditingVoucher({...editingVoucher, code: generateVoucherCode()})}
                            >
                              Tạo mã
                            </Button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Khuyến mãi gốc</label>
                          <Select
                            value={editingVoucher.promotion_id?.toString() || ''}
                            onValueChange={(value) => setEditingVoucher({...editingVoucher, promotion_id: value ? parseInt(value) : undefined})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn khuyến mãi" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Không liên kết</SelectItem>
                              {promotions.map((promotion) => (
                                <SelectItem key={promotion.id} value={promotion.id.toString()}>
                                  {promotion.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Khách hàng cụ thể</label>
                          <Select
                            value={editingVoucher.customer_id?.toString() || ''}
                            onValueChange={(value) => setEditingVoucher({...editingVoucher, customer_id: value ? parseInt(value) : undefined})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn khách hàng" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Tất cả khách hàng</SelectItem>
                              {customers.map((customer) => (
                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                  {customer.name} - {customer.phone}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Nhóm khách hàng</label>
                          <Select
                            value={editingVoucher.customer_group_id?.toString() || ''}
                            onValueChange={(value) => setEditingVoucher({...editingVoucher, customer_group_id: value ? parseInt(value) : undefined})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Không áp dụng</SelectItem>
                              {customerGroups.map((group) => (
                                <SelectItem key={group.id} value={group.id.toString()}>
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">Loại giảm giá *</label>
                          <Select
                            value={editingVoucher.discount_type || ''}
                            onValueChange={(value) => setEditingVoucher({...editingVoucher, discount_type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                              <SelectItem value="fixed">Số tiền cố định</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Giá trị giảm *</label>
                          <Input
                            type="number"
                            value={editingVoucher.discount_value || ''}
                            onChange={(e) => setEditingVoucher({...editingVoucher, discount_value: parseFloat(e.target.value)})}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Giảm tối đa</label>
                          <Input
                            type="number"
                            value={editingVoucher.max_discount_amount || ''}
                            onChange={(e) => setEditingVoucher({...editingVoucher, max_discount_amount: parseFloat(e.target.value)})}
                            placeholder="Không giới hạn"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">Đơn hàng tối thiểu</label>
                          <Input
                            type="number"
                            value={editingVoucher.min_purchase_amount || ''}
                            onChange={(e) => setEditingVoucher({...editingVoucher, min_purchase_amount: parseFloat(e.target.value)})}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Có hiệu lực từ *</label>
                          <Input
                            type="date"
                            value={editingVoucher.valid_from || ''}
                            onChange={(e) => setEditingVoucher({...editingVoucher, valid_from: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Có hiệu lực đến *</label>
                          <Input
                            type="date"
                            value={editingVoucher.valid_until || ''}
                            onChange={(e) => setEditingVoucher({...editingVoucher, valid_until: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSaveVoucher} disabled={loading}>
                          {isEditing ? 'Cập nhật' : 'Thêm'}
                        </Button>
                      </div>
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
                  <TableHead>Mã voucher</TableHead>
                  <TableHead>Giảm giá</TableHead>
                  <TableHead>Áp dụng cho</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouchers.map((voucher) => {
                  const status = getVoucherStatus(voucher);
                  return (
                    <TableRow key={voucher.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {voucher.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyVoucherCode(voucher.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        {voucher.promotion_name && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Từ: {voucher.promotion_name}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {voucher.discount_type === 'percentage' 
                          ? `${voucher.discount_value}%` 
                          : `${voucher.discount_value.toLocaleString('vi-VN')}đ`
                        }
                        {voucher.min_purchase_amount > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Tối thiểu: {voucher.min_purchase_amount.toLocaleString('vi-VN')}đ
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {voucher.customer_name && (
                          <div className="text-sm">{voucher.customer_name}</div>
                        )}
                        {voucher.group_name && (
                          <div className="text-sm">Nhóm: {voucher.group_name}</div>
                        )}
                        {!voucher.customer_name && !voucher.group_name && (
                          <div className="text-sm text-muted-foreground">Tất cả khách hàng</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(voucher.valid_from).toLocaleDateString('vi-VN')}</div>
                          <div>{new Date(voucher.valid_until).toLocaleDateString('vi-VN')}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.color as any}>{status.label}</Badge>
                        {voucher.is_used && voucher.used_date && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(voucher.used_date).toLocaleDateString('vi-VN')}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(voucher)} disabled={voucher.is_used}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(voucher.id)} disabled={voucher.is_used}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Vouchers;