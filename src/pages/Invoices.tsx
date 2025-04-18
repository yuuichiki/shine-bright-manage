
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FilePlus, Download, Printer } from 'lucide-react';
import NewInvoiceForm from '@/components/NewInvoiceForm';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

const Invoices = () => {
  const demoInvoices = [
    { id: 1, date: '2025-04-18', customer: 'Nguyễn Văn A', total: 250000, services: 'Rửa xe cơ bản' },
    { id: 2, date: '2025-04-18', customer: 'Trần Thị B', total: 750000, services: 'Rửa xe + Thay dầu' },
  ];

  const handleExportInvoice = (id: number) => {
    console.log('Xuất hóa đơn:', id);
  };

  const handlePrintInvoice = (id: number) => {
    console.log('In hóa đơn:', id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Hóa đơn</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <FilePlus className="mr-2 h-4 w-4" />
              Tạo Hóa đơn Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <NewInvoiceForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Hóa đơn</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số HĐ</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Dịch vụ</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.services}</TableCell>
                  <TableCell>{invoice.total.toLocaleString('vi-VN')} đ</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleExportInvoice(invoice.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(invoice.id)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;
