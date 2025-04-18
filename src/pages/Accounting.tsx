
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, FileText, BarChart, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

const Accounting = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Quản Lý Kế Toán</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thu Chi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Quản lý các khoản thu chi của doanh nghiệp</p>
            <Button className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Xem Thu Chi
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Báo Cáo Tài Chính</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Xem báo cáo tài chính của doanh nghiệp</p>
            <Link to="/reports">
              <Button className="w-full">
                <BarChart className="mr-2 h-4 w-4" />
                Xem Báo Cáo
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hóa Đơn VAT</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Quản lý và xuất hóa đơn VAT</p>
            <Button className="w-full" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Quản Lý Hóa Đơn VAT
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Landed Cost</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Quản lý chi phí nhập hàng bao gồm giá vốn và các chi phí phát sinh</p>
            <Button className="w-full" variant="outline">
              <Receipt className="mr-2 h-4 w-4" />
              Quản Lý Chi Phí
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accounting;
