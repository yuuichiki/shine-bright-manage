
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FilePlus, Download, Printer, Eye, Search, Filter, Calendar } from 'lucide-react';
import NewInvoiceForm from '@/components/NewInvoiceForm';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import InvoicePDF from '@/components/InvoicePDF';

type Invoice = {
  id: number;
  date: string;
  customer: {
    name: string;
    phone?: string;
    address?: string;
  };
  services: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'paid' | 'pending' | 'cancelled';
  paymentMethod?: string;
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { 
      id: 1, 
      date: '2025-04-18', 
      customer: {
        name: 'Nguyễn Văn A',
        phone: '0912345678',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      },
      services: [
        { name: 'Rửa xe cơ bản', quantity: 1, price: 250000 }
      ],
      total: 250000,
      status: 'paid',
      paymentMethod: 'cash'
    },
    { 
      id: 2, 
      date: '2025-04-18', 
      customer: {
        name: 'Trần Thị B',
        phone: '0987654321',
        address: '456 Đường XYZ, Quận 2, TP.HCM'
      },
      services: [
        { name: 'Rửa xe cơ bản', quantity: 1, price: 250000 },
        { name: 'Thay dầu máy', quantity: 1, price: 500000 }
      ],
      total: 750000,
      status: 'paid',
      paymentMethod: 'transfer'
    },
    { 
      id: 3, 
      date: '2025-04-17', 
      customer: {
        name: 'Phạm Văn C',
        phone: '0977777777',
        address: '789 Đường DEF, Quận 3, TP.HCM'
      },
      services: [
        { name: 'Đánh bóng toàn xe', quantity: 1, price: 1200000 }
      ],
      total: 1200000,
      status: 'pending'
    },
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleExportInvoice = (id: number) => {
    console.log('Xuất hóa đơn:', id);
    toast({
      title: "Đang xuất hóa đơn",
      description: `Đang chuẩn bị xuất hóa đơn #${id}`,
    });
  };

  const handlePrintInvoice = (id: number) => {
    console.log('In hóa đơn:', id);
    toast({
      title: "Đang in hóa đơn",
      description: `Đang gửi hóa đơn #${id} đến máy in`,
    });
  };

  const viewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  // Filter invoices based on search and filters
  const filteredInvoices = invoices.filter(invoice => {
    // Search filter
    if (searchQuery && !invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !(invoice.customer.phone && invoice.customer.phone.includes(searchQuery))) {
      return false;
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date().toISOString().split('T')[0];
      if (dateFilter === "today" && invoice.date !== today) {
        return false;
      }
      // Add more date filters as needed
    }

    // Status filter
    if (statusFilter !== "all" && invoice.status !== statusFilter) {
      return false;
    }

    return true;
  });

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
          <DialogContent className="sm:max-w-[800px]">
            <NewInvoiceForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-4">
        <CardHeader className="py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc số điện thoại"
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex gap-1" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4" /> Bộ lọc
              </Button>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px] flex gap-1">
                  <Calendar className="h-4 w-4" />
                  <SelectValue placeholder="Tất cả thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thời gian</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isFilterOpen && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                    <SelectItem value="pending">Chưa thanh toán</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Add more filters as needed */}
            </div>
          )}
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
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>#{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                     <TableCell>
                       <div>{invoice.customer.name}</div>
                       <div className="text-xs text-muted-foreground">{invoice.customer.phone}</div>
                     </TableCell>
                     <TableCell>
                       {invoice.services[0]?.name}
                       {invoice.services.length > 1 && (
                         <span className="text-xs text-muted-foreground ml-1">
                           +{invoice.services.length - 1} dịch vụ khác
                         </span>
                       )}
                     </TableCell>
                    <TableCell>{invoice.total.toLocaleString('vi-VN')} đ</TableCell>
                    <TableCell>
                      <Badge variant={
                        invoice.status === 'paid' ? 'default' : 
                        invoice.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {invoice.status === 'paid' && 'Đã thanh toán'}
                        {invoice.status === 'pending' && 'Chưa thanh toán'}
                        {invoice.status === 'cancelled' && 'Đã hủy'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewInvoice(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExportInvoice(invoice.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(invoice.id)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Không tìm thấy hóa đơn nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Invoice Detail Drawer */}
      {selectedInvoice && (
        <Drawer open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Chi tiết Hóa đơn #{selectedInvoice.id}</DrawerTitle>
              <DrawerDescription>Xem thông tin chi tiết của hóa đơn</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium">Thông tin khách hàng</h3>
                  <p className="text-sm">{selectedInvoice.customer.name}</p>
                  <p className="text-sm">{selectedInvoice.customer.phone}</p>
                  {selectedInvoice.customer.address && (
                    <p className="text-sm">{selectedInvoice.customer.address}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium">Thông tin hóa đơn</h3>
                  <p className="text-sm">Ngày: {selectedInvoice.date}</p>
                  <p className="text-sm">
                    Trạng thái: 
                    <Badge variant={
                      selectedInvoice.status === 'paid' ? 'default' : 
                      selectedInvoice.status === 'pending' ? 'secondary' : 'destructive'
                    } className="ml-2">
                      {selectedInvoice.status === 'paid' && 'Đã thanh toán'}
                      {selectedInvoice.status === 'pending' && 'Chưa thanh toán'}
                      {selectedInvoice.status === 'cancelled' && 'Đã hủy'}
                    </Badge>
                  </p>
                  {selectedInvoice.paymentMethod && (
                    <p className="text-sm">
                      Phương thức thanh toán: {selectedInvoice.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
                    </p>
                  )}
                </div>
              </div>
              
              <h3 className="text-sm font-medium mb-2">Dịch vụ</h3>
              <div className="border rounded-md p-3 mb-4 space-y-2">
                {selectedInvoice.services.map((service, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{service.name} x {service.quantity}</span>
                    <span>{(service.price * service.quantity).toLocaleString('vi-VN')} đ</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span>{selectedInvoice.total.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
            <DrawerFooter>
              <div className="mb-4">
                <InvoicePDF invoice={selectedInvoice} />
              </div>
              <DrawerClose asChild>
                <Button variant="outline">Đóng</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default Invoices;
