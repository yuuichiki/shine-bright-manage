import React, { useState, useEffect } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Tag, FileDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import useApi from '@/hooks/useApi';
import { generatePromotionReport } from '@/utils/pdfGenerator';

type Promotion = {
  id: number;
  name: string;
  description: string;
  type: string;
  discount_type: string;
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit?: number;
  used_count: number;
  applicable_products?: string;
  applicable_services?: string;
  created_at: string;
};

const Promotions = () => {
  const { toast } = useToast();
  const { callApi, loading } = useApi();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Partial<Promotion>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    const data = await callApi<null, Promotion[]>({ url: '/promotions' });
    if (data) setPromotions(data);
  };

  const handleSavePromotion = async () => {
    if (!editingPromotion.name || !editingPromotion.discount_type || !editingPromotion.discount_value) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive"
      });
      return;
    }

    const promotionData = {
      ...editingPromotion,
      type: editingPromotion.type || 'general',
      min_purchase_amount: editingPromotion.min_purchase_amount || 0,
    };

    if (isEditing) {
      const success = await callApi({
        url: `/promotions/${editingPromotion.id}`,
        method: 'PUT',
        body: promotionData
      });
      if (success) {
        toast({ title: "Đã cập nhật khuyến mãi" });
        fetchPromotions();
      }
    } else {
      const data = await callApi<Partial<Promotion>, Promotion>({
        url: '/promotions',
        method: 'POST',
        body: promotionData
      });
      if (data) {
        toast({ title: "Đã thêm khuyến mãi mới" });
        fetchPromotions();
      }
    }

    setIsDialogOpen(false);
    setEditingPromotion({});
    setIsEditing(false);
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const success = await callApi({ url: `/promotions/${id}`, method: 'DELETE' });
    if (success) {
      toast({ title: "Đã xóa khuyến mãi" });
      fetchPromotions();
    }
  };

  const togglePromotionStatus = async (promotion: Promotion) => {
    const success = await callApi({
      url: `/promotions/${promotion.id}`,
      method: 'PUT',
      body: { ...promotion, is_active: !promotion.is_active }
    });
    if (success) {
      toast({ title: promotion.is_active ? "Đã tắt khuyến mãi" : "Đã bật khuyến mãi" });
      fetchPromotions();
    }
  };

  const exportReport = () => {
    generatePromotionReport(promotions);
    toast({ title: "Đã xuất báo cáo" });
  };

  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);
    
    if (!promotion.is_active) return { label: 'Tạm dừng', color: 'secondary' };
    if (now < start) return { label: 'Chưa bắt đầu', color: 'secondary' };
    if (now > end) return { label: 'Đã kết thúc', color: 'destructive' };
    return { label: 'Đang hoạt động', color: 'default' };
  };

  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quản Lý Khuyến Mãi</h1>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh Sách Khuyến Mãi</CardTitle>
              <div className="flex gap-2">
                <Button onClick={exportReport} variant="outline">
                  <FileDown className="mr-2 h-4 w-4" /> Xuất báo cáo
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Thêm Khuyến Mãi
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{isEditing ? 'Sửa Khuyến Mãi' : 'Thêm Khuyến Mãi Mới'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Tên khuyến mãi *</label>
                          <Input
                            value={editingPromotion.name || ''}
                            onChange={(e) => setEditingPromotion({...editingPromotion, name: e.target.value})}
                            placeholder="Nhập tên khuyến mãi"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Loại khuyến mãi</label>
                          <Select
                            value={editingPromotion.type || 'general'}
                            onValueChange={(value) => setEditingPromotion({...editingPromotion, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">Chung</SelectItem>
                              <SelectItem value="birthday">Sinh nhật</SelectItem>
                              <SelectItem value="seasonal">Theo mùa</SelectItem>
                              <SelectItem value="loyalty">Khách hàng thân thiết</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Mô tả</label>
                        <Textarea
                          value={editingPromotion.description || ''}
                          onChange={(e) => setEditingPromotion({...editingPromotion, description: e.target.value})}
                          placeholder="Mô tả khuyến mãi"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">Loại giảm giá *</label>
                          <Select
                            value={editingPromotion.discount_type || ''}
                            onValueChange={(value) => setEditingPromotion({...editingPromotion, discount_type: value})}
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
                            value={editingPromotion.discount_value || ''}
                            onChange={(e) => setEditingPromotion({...editingPromotion, discount_value: parseFloat(e.target.value)})}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Giảm tối đa</label>
                          <Input
                            type="number"
                            value={editingPromotion.max_discount_amount || ''}
                            onChange={(e) => setEditingPromotion({...editingPromotion, max_discount_amount: parseFloat(e.target.value)})}
                            placeholder="Không giới hạn"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">Đơn hàng tối thiểu</label>
                          <Input
                            type="number"
                            value={editingPromotion.min_purchase_amount || ''}
                            onChange={(e) => setEditingPromotion({...editingPromotion, min_purchase_amount: parseFloat(e.target.value)})}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Ngày bắt đầu *</label>
                          <Input
                            type="date"
                            value={editingPromotion.start_date || ''}
                            onChange={(e) => setEditingPromotion({...editingPromotion, start_date: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Ngày kết thúc *</label>
                          <Input
                            type="date"
                            value={editingPromotion.end_date || ''}
                            onChange={(e) => setEditingPromotion({...editingPromotion, end_date: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Giới hạn sử dụng</label>
                        <Input
                          type="number"
                          value={editingPromotion.usage_limit || ''}
                          onChange={(e) => setEditingPromotion({...editingPromotion, usage_limit: parseInt(e.target.value)})}
                          placeholder="Không giới hạn"
                        />
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSavePromotion} disabled={loading}>
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
                  <TableHead>Tên khuyến mãi</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giảm giá</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Sử dụng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promotion) => {
                  const status = getPromotionStatus(promotion);
                  return (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{promotion.name}</div>
                          {promotion.description && (
                            <div className="text-sm text-muted-foreground">{promotion.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{promotion.type}</TableCell>
                      <TableCell>
                        {promotion.discount_type === 'percentage' 
                          ? `${promotion.discount_value}%` 
                          : `${promotion.discount_value.toLocaleString('vi-VN')}đ`
                        }
                        {promotion.max_discount_amount && (
                          <div className="text-sm text-muted-foreground">
                            Tối đa: {promotion.max_discount_amount.toLocaleString('vi-VN')}đ
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(promotion.start_date).toLocaleDateString('vi-VN')}</div>
                          <div>{new Date(promotion.end_date).toLocaleDateString('vi-VN')}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {promotion.used_count}
                        {promotion.usage_limit && ` / ${promotion.usage_limit}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={status.color as any}>{status.label}</Badge>
                          <Switch
                            checked={promotion.is_active}
                            onCheckedChange={() => togglePromotionStatus(promotion)}
                            
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(promotion)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(promotion.id)}>
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

export default Promotions;