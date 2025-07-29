import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket, Tag, Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import useApi from '@/hooks/useApi';

type Promotion = {
  id: number;
  name: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  used_count: number;
  usage_limit?: number;
};

type Voucher = {
  id: number;
  code: string;
  name: string;
  discount_type: string;
  discount_value: number;
  quantity: number;
  used_count: number;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
};

const PromotionVoucherWidget = () => {
  const { callApi } = useApi();
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([]);
  const [activeVouchers, setActiveVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch active promotions
      const promotionsData = await callApi<null, Promotion[]>({ url: '/promotions' });
      if (promotionsData) {
        const now = new Date();
        const active = promotionsData.filter(promo => {
          const start = new Date(promo.start_date);
          const end = new Date(promo.end_date);
          return promo.is_active && now >= start && now <= end;
        });
        setActivePromotions(active.slice(0, 3)); // Show max 3
      }

      // Fetch active vouchers
      const vouchersData = await callApi<null, Voucher[]>({ url: '/vouchers' });
      if (vouchersData) {
        const now = new Date();
        const active = vouchersData.filter(voucher => {
          const start = new Date(voucher.valid_from);
          const end = new Date(voucher.valid_to);
          return voucher.is_active && 
                 now >= start && 
                 now <= end && 
                 voucher.used_count < voucher.quantity;
        });
        setActiveVouchers(active.slice(0, 3)); // Show max 3
      }
    } catch (error) {
      console.error('Error fetching promotions/vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDiscountDisplay = (type: string, value: number) => {
    return type === 'percentage' 
      ? `${value}%` 
      : `${value.toLocaleString('vi-VN')}đ`;
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Đang tải...</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Đang tải...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Active Promotions Widget */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-orange-500" />
              Khuyến mãi đang hoạt động
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/promotions" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Xem tất cả
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activePromotions.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Không có khuyến mãi nào đang hoạt động
            </div>
          ) : (
            activePromotions.map((promotion) => {
              const daysRemaining = getDaysRemaining(promotion.end_date);
              return (
                <div key={promotion.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{promotion.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        Giảm {getDiscountDisplay(promotion.discount_type, promotion.discount_value)}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {daysRemaining > 0 ? `${daysRemaining} ngày` : 'Sắp hết hạn'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {promotion.used_count}
                      {promotion.usage_limit ? `/${promotion.usage_limit}` : ''} đã dùng
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Active Vouchers Widget */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-blue-500" />
              Voucher có sẵn
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/vouchers" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Xem tất cả
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeVouchers.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Không có voucher nào có sẵn
            </div>
          ) : (
            activeVouchers.map((voucher) => {
              const daysRemaining = getDaysRemaining(voucher.valid_to);
              const remainingQty = voucher.quantity - voucher.used_count;
              return (
                <div key={voucher.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm font-mono">{voucher.code}</div>
                    <div className="text-xs text-muted-foreground mb-1">{voucher.name}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Giảm {getDiscountDisplay(voucher.discount_type, voucher.discount_value)}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {daysRemaining > 0 ? `${daysRemaining} ngày` : 'Sắp hết hạn'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      Còn {remainingQty}/{voucher.quantity}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionVoucherWidget;