
import React, { useState } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Service = {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  duration: number;
  carTypeSpecificPrices?: {
    carTypeId: number;
    price: number;
  }[];
};

type CarCategory = {
  id: number;
  name: string;
  serviceMultiplier: number;
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([
    { 
      id: 1, 
      name: 'Rửa xe cơ bản', 
      category: 'Ngoại thất', 
      basePrice: 50000, 
      duration: 30,
      carTypeSpecificPrices: [
        { carTypeId: 1, price: 50000 },
        { carTypeId: 2, price: 65000 },
        { carTypeId: 3, price: 75000 },
        { carTypeId: 4, price: 100000 },
      ]
    },
    { 
      id: 2, 
      name: 'Đánh bóng toàn bộ xe', 
      category: 'Hoàn thiện', 
      basePrice: 500000, 
      duration: 180,
      carTypeSpecificPrices: [
        { carTypeId: 1, price: 500000 },
        { carTypeId: 2, price: 650000 },
        { carTypeId: 3, price: 750000 },
        { carTypeId: 4, price: 1000000 },
      ]
    },
    { 
      id: 3, 
      name: 'Thay dầu máy', 
      category: 'Bảo dưỡng', 
      basePrice: 300000, 
      duration: 45,
      carTypeSpecificPrices: [
        { carTypeId: 1, price: 300000 },
        { carTypeId: 2, price: 390000 },
        { carTypeId: 3, price: 450000 },
        { carTypeId: 4, price: 600000 },
      ]
    }
  ]);

  const [carCategories] = useState<CarCategory[]>([
    { id: 1, name: 'Xe con 4 chỗ', serviceMultiplier: 1 },
    { id: 2, name: 'Xe con 7 chỗ', serviceMultiplier: 1.3 },
    { id: 3, name: 'Xe bán tải', serviceMultiplier: 1.5 },
    { id: 4, name: 'Xe sang', serviceMultiplier: 2 }
  ]);

  const [newService, setNewService] = useState<Partial<Service>>({
    carTypeSpecificPrices: []
  });
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [customPrices, setCustomPrices] = useState<{[key: number]: number}>({});

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const initializeCustomPrices = (service: Partial<Service>) => {
    const prices: {[key: number]: number} = {};
    if (service.carTypeSpecificPrices) {
      service.carTypeSpecificPrices.forEach(price => {
        prices[price.carTypeId] = price.price;
      });
    } else if (service.basePrice) {
      carCategories.forEach(category => {
        prices[category.id] = Math.round((service.basePrice || 0) * category.serviceMultiplier / 1000) * 1000;
      });
    }
    setCustomPrices(prices);
  };

  const handleAddService = () => {
    if (newService.name && newService.category && newService.basePrice) {
      const carTypeSpecificPrices = carCategories.map(category => ({
        carTypeId: category.id,
        price: customPrices[category.id] || Math.round((newService.basePrice || 0) * category.serviceMultiplier / 1000) * 1000
      }));

      const serviceToAdd = {
        ...newService,
        id: Math.max(...services.map(s => s.id), 0) + 1,
        carTypeSpecificPrices
      } as Service;

      setServices([...services, serviceToAdd]);
      setNewService({ carTypeSpecificPrices: [] });
      setCustomPrices({});
      setIsDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Dịch vụ mới đã được thêm vào danh sách."
      });
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    initializeCustomPrices(service);
    setIsEditDialogOpen(true);
  };

  const handleUpdateService = () => {
    if (editingService && editingService.name && editingService.category && editingService.basePrice) {
      const carTypeSpecificPrices = carCategories.map(category => ({
        carTypeId: category.id,
        price: customPrices[category.id] || Math.round((editingService.basePrice || 0) * category.serviceMultiplier / 1000) * 1000
      }));

      const updatedService = {
        ...editingService,
        carTypeSpecificPrices
      };

      setServices(services.map(s => s.id === editingService.id ? updatedService : s));
      setEditingService(null);
      setCustomPrices({});
      setIsEditDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Dịch vụ đã được cập nhật."
      });
    }
  };

  const handleDeleteService = (serviceId: number) => {
    setServices(services.filter(s => s.id !== serviceId));
    toast({
      title: "Thành công",
      description: "Dịch vụ đã được xóa khỏi danh sách."
    });
  };

  const updateCustomPrice = (carTypeId: number, price: number) => {
    setCustomPrices(prev => ({
      ...prev,
      [carTypeId]: price
    }));
  };

  const resetPricesToDefault = (basePrice: number) => {
    const newPrices: {[key: number]: number} = {};
    carCategories.forEach(category => {
      newPrices[category.id] = Math.round(basePrice * category.serviceMultiplier / 1000) * 1000;
    });
    setCustomPrices(newPrices);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quản Lý Dịch Vụ</h1>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Danh Sách Dịch Vụ</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Thêm Dịch Vụ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Thêm Dịch Vụ Mới</DialogTitle>
                  <DialogDescription>
                    Giá dịch vụ cho các loại xe sẽ được tính tự động dựa trên giá cơ bản và hệ số giá của mỗi loại xe
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input 
                    placeholder="Tên dịch vụ" 
                    value={newService.name || ''}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                  />
                  <Input 
                    placeholder="Phân loại" 
                    value={newService.category || ''}
                    onChange={(e) => setNewService({...newService, category: e.target.value})}
                  />
                  <Input 
                    type="number" 
                    placeholder="Giá cơ bản (VNĐ)" 
                    value={newService.basePrice || ''}
                    onChange={(e) => setNewService({...newService, basePrice: Number(e.target.value)})}
                  />
                  <Input 
                    type="number" 
                    placeholder="Thời gian thực hiện (phút)" 
                    value={newService.duration || ''}
                    onChange={(e) => setNewService({...newService, duration: Number(e.target.value)})}
                  />
                  {newService.basePrice && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Giá theo loại xe</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => resetPricesToDefault(newService.basePrice || 0)}
                        >
                          Tính lại giá tự động
                        </Button>
                      </div>
                      {carCategories.map(category => (
                        <div key={category.id} className="flex justify-between items-center">
                          <Label className="text-sm">{category.name}:</Label>
                          <Input
                            type="number"
                            className="w-32"
                            value={customPrices[category.id] || Math.round((newService.basePrice || 0) * category.serviceMultiplier / 1000) * 1000}
                            onChange={(e) => updateCustomPrice(category.id, Number(e.target.value))}
                            onFocus={() => {
                              if (!customPrices[category.id]) {
                                updateCustomPrice(category.id, Math.round((newService.basePrice || 0) * category.serviceMultiplier / 1000) * 1000);
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <Button onClick={handleAddService}>Lưu Dịch Vụ</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Dịch Vụ</TableHead>
                <TableHead>Phân Loại</TableHead>
                <TableHead>Giá Cơ Bản</TableHead>
                <TableHead>Thời Gian</TableHead>
                <TableHead>Chi Tiết</TableHead>
                <TableHead>Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{formatCurrency(service.basePrice)}</TableCell>
                  <TableCell>{service.duration} phút</TableCell>
                  <TableCell>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="prices">
                        <AccordionTrigger>Giá theo loại xe</AccordionTrigger>
                        <AccordionContent>
                          <div className="text-sm space-y-1">
                            {service.carTypeSpecificPrices?.map((pricing) => {
                              const carType = carCategories.find(c => c.id === pricing.carTypeId);
                              return (
                                <div key={pricing.carTypeId} className="flex justify-between">
                                  <span>{carType?.name}:</span>
                                  <span className="font-medium">{formatCurrency(pricing.price)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditService(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteService(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Dịch Vụ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin dịch vụ và giá theo loại xe
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <div className="grid gap-4 py-4">
              <Input 
                placeholder="Tên dịch vụ" 
                value={editingService.name || ''}
                onChange={(e) => setEditingService({...editingService, name: e.target.value})}
              />
              <Input 
                placeholder="Phân loại" 
                value={editingService.category || ''}
                onChange={(e) => setEditingService({...editingService, category: e.target.value})}
              />
              <Input 
                type="number" 
                placeholder="Giá cơ bản (VNĐ)" 
                value={editingService.basePrice || ''}
                onChange={(e) => setEditingService({...editingService, basePrice: Number(e.target.value)})}
              />
              <Input 
                type="number" 
                placeholder="Thời gian thực hiện (phút)" 
                value={editingService.duration || ''}
                onChange={(e) => setEditingService({...editingService, duration: Number(e.target.value)})}
              />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Giá theo loại xe</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => resetPricesToDefault(editingService.basePrice || 0)}
                  >
                    Tính lại giá tự động
                  </Button>
                </div>
                {carCategories.map(category => (
                  <div key={category.id} className="flex justify-between items-center">
                    <Label className="text-sm">{category.name}:</Label>
                    <Input
                      type="number"
                      className="w-32"
                      value={customPrices[category.id] || 0}
                      onChange={(e) => updateCustomPrice(category.id, Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleUpdateService}>Cập Nhật Dịch Vụ</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
};

export default Services;
