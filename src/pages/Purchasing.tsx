
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Truck, PackageCheck, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';

const Purchasing = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quản Lý Mua Hàng</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Đơn Đặt Hàng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Tạo và quản lý đơn đặt hàng với nhà cung cấp</p>
            <Button className="w-full">
              <Package className="mr-2 h-4 w-4" />
              Quản Lý Đơn Đặt Hàng
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Nhà Cung Cấp</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Quản lý thông tin các nhà cung cấp hàng hóa</p>
            <Button className="w-full" variant="outline">
              <Truck className="mr-2 h-4 w-4" />
              Quản Lý Nhà Cung Cấp
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Nhập Hàng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Quản lý việc nhập hàng vào kho</p>
            <Button className="w-full" variant="outline">
              <PackageCheck className="mr-2 h-4 w-4" />
              Quản Lý Nhập Hàng
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quản Lý Lô Hàng</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Quản lý thông tin chi tiết về các lô hàng và nguồn gốc</p>
            <Link to="/batches">
              <Button className="w-full">
                <Boxes className="mr-2 h-4 w-4" />
                Xem Lô Hàng
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Purchasing;
