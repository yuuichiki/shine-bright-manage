
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sales = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quản Lý Bán Hàng</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hóa Đơn Bán Hàng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Quản lý và tạo hóa đơn bán hàng cho khách hàng</p>
            <Link to="/invoices">
              <Button className="w-full">
                <FilePlus className="mr-2 h-4 w-4" />
                Xem Hóa Đơn
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Báo Cáo Bán Hàng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Xem báo cáo doanh thu và lợi nhuận từ bán hàng</p>
            <Link to="/reports">
              <Button className="w-full">
                Xem Báo Cáo
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Đơn Đặt Hàng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Quản lý các đơn đặt hàng từ khách hàng</p>
            <Button className="w-full" variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Quản Lý Đơn Hàng
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sales;
