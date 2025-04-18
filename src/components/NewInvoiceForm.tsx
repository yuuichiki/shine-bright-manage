
import React, { useState } from 'react';
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
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = {
  customerName: string;
  carType: string;
  services: string;
  total: number;
};

const carTypes = [
  { id: "1", name: "Xe con 4 chỗ", multiplier: 1 },
  { id: "2", name: "Xe con 7 chỗ", multiplier: 1.3 },
  { id: "3", name: "Xe bán tải", multiplier: 1.5 },
  { id: "4", name: "Xe sang", multiplier: 2 }
];

const services = [
  { id: "1", name: "Rửa xe cơ bản", basePrice: 50000 },
  { id: "2", name: "Đánh bóng toàn bộ xe", basePrice: 500000 },
  { id: "3", name: "Thay dầu máy", basePrice: 300000 },
];

const NewInvoiceForm = () => {
  const form = useForm<FormData>();
  const [selectedCarType, setSelectedCarType] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);

  const calculateTotal = (serviceId: string, carTypeId: string) => {
    if (!serviceId || !carTypeId) return 0;
    
    const service = services.find(s => s.id === serviceId);
    const carType = carTypes.find(c => c.id === carTypeId);
    
    if (!service || !carType) return 0;
    
    return Math.round(service.basePrice * carType.multiplier / 1000) * 1000; // Làm tròn đến 1000 VND
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    const total = calculateTotal(value, selectedCarType);
    setCalculatedTotal(total);
    form.setValue("total", total);
  };

  const handleCarTypeChange = (value: string) => {
    setSelectedCarType(value);
    const total = calculateTotal(selectedService, value);
    setCalculatedTotal(total);
    form.setValue("total", total);
  };

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Tạo Hóa đơn Mới</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
            name="carType"
            render={({ field }) => (
              <FormItem>
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

          <FormField
            control={form.control}
            name="services"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dịch vụ</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleServiceChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn dịch vụ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tổng tiền</FormLabel>
                <FormControl>
                  <Input 
                    type="text" 
                    readOnly
                    value={field.value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(field.value) : ""} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
