
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Search, Percent } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type FormData = {
  customerName: string;
  customerPhone: string;
  carType: string;
  serviceIds: string[];
  includeVAT: boolean;
  discountPercent: number;
  note: string;
};

type ServiceItem = {
  id: string;
  name: string;
  basePrice: number;
  selected?: boolean;
  quantity?: number;
  price?: number; // price with car type multiplier
};

type Customer = {
  id: number;
  name: string;
  phone: string;
  discountPercent: number;
};

const carTypes = [
  { id: "1", name: "Xe con 4 chỗ", multiplier: 1 },
  { id: "2", name: "Xe con 7 chỗ", multiplier: 1.3 },
  { id: "3", name: "Xe bán tải", multiplier: 1.5 },
  { id: "4", name: "Xe sang", multiplier: 2 }
];

const servicesList = [
  { id: "1", name: "Rửa xe cơ bản", basePrice: 50000 },
  { id: "2", name: "Rửa xe + hút bụi", basePrice: 100000 },
  { id: "3", name: "Đánh bóng toàn bộ xe", basePrice: 500000 },
  { id: "4", name: "Thay dầu máy", basePrice: 300000 },
  { id: "5", name: "Vệ sinh khoang máy", basePrice: 200000 },
  { id: "6", name: "Làm mới nội thất", basePrice: 400000 },
];

// Demo customers data
const demoCustomers: Customer[] = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0912345678', discountPercent: 10 },
  { id: 2, name: 'Trần Thị B', phone: '0987654321', discountPercent: 5 },
];

const NewInvoiceForm = () => {
  const { toast } = useToast();
  const form = useForm<FormData>({
    defaultValues: {
      customerName: '',
      customerPhone: '',
      carType: '',
      serviceIds: [],
      includeVAT: true,
      discountPercent: 0,
      note: '',
    }
  });
  
  const [services, setServices] = useState<ServiceItem[]>(servicesList);
  const [selectedCarType, setSelectedCarType] = useState<string>("");
  const [subtotal, setSubtotal] = useState<number>(0);
  const [vatAmount, setVatAmount] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Calculate totals whenever selections change
  useEffect(() => {
    const carType = carTypes.find(c => c.id === selectedCarType);
    const multiplier = carType ? carType.multiplier : 1;

    // Calculate subtotal
    const calculatedSubtotal = services
      .filter(s => s.selected && s.quantity && s.quantity > 0)
      .reduce((sum, service) => {
        const price = Math.round((service.basePrice * multiplier) / 1000) * 1000;
        const quantity = service.quantity || 0;
        return sum + (price * quantity);
      }, 0);
    
    setSubtotal(calculatedSubtotal);
    
    // Calculate VAT (10%)
    const includeVAT = form.watch('includeVAT');
    const calculatedVAT = includeVAT ? calculatedSubtotal * 0.1 : 0;
    setVatAmount(calculatedVAT);
    
    // Calculate discount
    const discountPercent = form.watch('discountPercent') || (selectedCustomer?.discountPercent || 0);
    const calculatedDiscount = (calculatedSubtotal + calculatedVAT) * (discountPercent / 100);
    setDiscount(calculatedDiscount);
    
    // Calculate total
    setTotal(calculatedSubtotal + calculatedVAT - calculatedDiscount);
  }, [services, selectedCarType, form.watch('includeVAT'), form.watch('discountPercent'), selectedCustomer]);

  const handleCarTypeChange = (value: string) => {
    setSelectedCarType(value);

    // Update service prices based on car type
    const carType = carTypes.find(c => c.id === value);
    if (carType) {
      const updatedServices = services.map(service => {
        const price = Math.round((service.basePrice * carType.multiplier) / 1000) * 1000;
        return {
          ...service,
          price
        };
      });
      setServices(updatedServices);
    }
  };

  const toggleServiceSelection = (serviceId: string) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { 
            ...service, 
            selected: !service.selected,
            quantity: !service.selected ? 1 : service.quantity 
          } 
        : service
    ));
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    if (quantity < 1) quantity = 1;
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, quantity } 
        : service
    ));
  };

  const searchCustomer = () => {
    if (!searchPhone) {
      toast({
        title: "Vui lòng nhập số điện thoại",
        description: "Nhập số điện thoại khách hàng để tìm kiếm.",
        variant: "destructive"
      });
      return;
    }
    
    // Find customer by phone number (demo)
    const customer = demoCustomers.find(c => c.phone === searchPhone);
    
    if (customer) {
      setSelectedCustomer(customer);
      form.setValue('customerName', customer.name);
      form.setValue('customerPhone', customer.phone);
      form.setValue('discountPercent', customer.discountPercent);
      
      toast({
        title: "Đã tìm thấy khách hàng",
        description: `Khách hàng thường xuyên: ${customer.name}`
      });
    } else {
      setSelectedCustomer(null);
      toast({
        title: "Không tìm thấy khách hàng",
        description: "Không tìm thấy khách hàng với số điện thoại này."
      });
    }
  };

  const onSubmit = (data: FormData) => {
    // Get selected services details
    const selectedServices = services
      .filter(s => s.selected && s.quantity && s.quantity > 0)
      .map(s => ({
        id: s.id,
        name: s.name,
        quantity: s.quantity,
        unitPrice: s.price,
        total: s.price ? (s.price * (s.quantity || 0)) : 0
      }));
    
    if (selectedServices.length === 0) {
      toast({
        title: "Chưa chọn dịch vụ",
        description: "Vui lòng chọn ít nhất một dịch vụ.",
        variant: "destructive"
      });
      return;
    }

    const invoiceData = {
      ...data,
      customer: selectedCustomer ? {
        id: selectedCustomer.id,
        name: selectedCustomer.name,
        phone: selectedCustomer.phone,
        discountPercent: selectedCustomer.discountPercent
      } : {
        name: data.customerName,
        phone: data.customerPhone,
        discountPercent: data.discountPercent
      },
      services: selectedServices,
      subtotal,
      vatAmount,
      discount,
      total,
      date: new Date()
    };
    
    console.log('Hóa đơn mới:', invoiceData);
    
    toast({
      title: "Đã tạo hóa đơn",
      description: `Hóa đơn cho ${data.customerName} đã được tạo thành công.`
    });
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Tạo Hóa Đơn Mới</DialogTitle>
        <DialogDescription>
          Nhập thông tin chi tiết cho hóa đơn mới
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="border rounded-lg p-4 mb-2">
            <h3 className="text-base font-medium mb-3">Thông tin khách hàng</h3>
            
            {!isSearching ? (
              <div className="flex items-center gap-2 mb-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsSearching(true)}
                >
                  <Search className="h-4 w-4 mr-1" /> Tìm khách hàng
                </Button>
                <span className="text-sm text-muted-foreground">hoặc nhập thông tin mới</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-4">
                <Input
                  placeholder="Nhập số điện thoại"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="w-48"
                />
                <Button type="button" onClick={searchCustomer}>
                  <Search className="h-4 w-4 mr-1" /> Tìm
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsSearching(false)}
                >
                  Hủy
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên khách hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên khách hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 mb-2">
            <h3 className="text-base font-medium mb-3">Thông tin xe và dịch vụ</h3>
            
            <FormField
              control={form.control}
              name="carType"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Loại xe</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCarTypeChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại xe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="mb-4">
              <FormLabel>Dịch vụ</FormLabel>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">Chọn</TableHead>
                    <TableHead>Tên dịch vụ</TableHead>
                    <TableHead>Đơn giá</TableHead>
                    <TableHead className="w-24 text-center">Số lượng</TableHead>
                    <TableHead>Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={service.selected}
                          onCheckedChange={() => toggleServiceSelection(service.id)}
                        />
                      </TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>
                        {service.price?.toLocaleString('vi-VN') || service.basePrice.toLocaleString('vi-VN')} đ
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          disabled={!service.selected}
                          value={service.quantity || 1}
                          onChange={(e) => updateServiceQuantity(service.id, parseInt(e.target.value, 10))}
                          className="h-8 w-16 mx-auto text-center"
                        />
                      </TableCell>
                      <TableCell>
                        {service.selected && service.price && service.quantity 
                          ? (service.price * service.quantity).toLocaleString('vi-VN') + ' đ'
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 mb-2">
            <h3 className="text-base font-medium mb-3">Thanh toán</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-2">
              <FormField
                control={form.control}
                name="includeVAT"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Tính VAT (10%)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="discountPercent"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel className="mr-2">Chiết khấu</FormLabel>
                      {selectedCustomer && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          Khách quen: {selectedCustomer.discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                          className="w-20 mr-2"
                        />
                      </FormControl>
                      <Percent className="h-4 w-4 opacity-50" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Input placeholder="Thêm ghi chú cho hóa đơn (nếu có)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (10%):</span>
                <span>{vatAmount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between">
                <span>Chiết khấu:</span>
                <span>- {discount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button">Hủy</Button>
            <Button type="submit">Tạo Hóa đơn</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewInvoiceForm;
