
import React from 'react';
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

type FormData = {
  customerName: string;
  services: string;
  total: number;
};

const NewInvoiceForm = () => {
  const form = useForm<FormData>();

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
            name="services"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dịch vụ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập dịch vụ sử dụng" {...field} />
                </FormControl>
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
                  <Input type="number" placeholder="Nhập tổng tiền" {...field} />
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
