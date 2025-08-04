
import React, { useState, useEffect } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import useApi from '@/hooks/useApi';
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
  description?: string;
  price: number;
  duration: number;
  carTypeSpecificPrices?: {
    carTypeId: number;
    price: number;
  }[];
};

type CarCategory = {
  id: number;
  name: string;
  description?: string;
  service_multiplier: number;
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [carCategories, setCarCategories] = useState<CarCategory[]>([]);
  const { callApi, loading, error } = useApi();

  // Load data from API
  useEffect(() => {
    loadCarCategories();
  }, []);

  useEffect(() => {
    if (carCategories.length > 0) {
      loadServices();
    }
  }, [carCategories]);

  const loadServices = async () => {
    const data = await callApi<null, Service[]>({
      url: '/services',
      method: 'GET'
    });
    if (data) {
      // Transform database services to include car-specific pricing
      const servicesWithPricing = data.map(service => ({
        ...service,
        carTypeSpecificPrices: carCategories.map(category => ({
          carTypeId: category.id,
          price: Math.round(service.price * category.service_multiplier / 1000) * 1000
        }))
      }));
      setServices(servicesWithPricing);
    }
  };

  const loadCarCategories = async () => {
    const data = await callApi<null, CarCategory[]>({
      url: '/car-categories',
      method: 'GET'
    });
    if (data) {
      setCarCategories(data);
    }
  };

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
    } else if (service.price) {
      carCategories.forEach(category => {
        prices[category.id] = Math.round((service.price || 0) * category.service_multiplier / 1000) * 1000;
      });
    }
    setCustomPrices(prices);
  };

  const handleAddService = async () => {
    if (newService.name && newService.description && newService.price) {
      const data = await callApi<Partial<Service>, Service>({
        url: '/services',
        method: 'POST',
        body: {
          name: newService.name,
          description: newService.description,
          price: newService.price,
          duration: newService.duration
        }
      });

      if (data) {
        // Add car-specific pricing to the new service
        const serviceWithPricing = {
          ...data,
          carTypeSpecificPrices: carCategories.map(category => ({
            carTypeId: category.id,
            price: customPrices[category.id] || Math.round((data.price || 0) * category.service_multiplier / 1000) * 1000
          }))
        };

        setServices([...services, serviceWithPricing]);
        setNewService({ carTypeSpecificPrices: [] });
        setCustomPrices({});
        setIsDialogOpen(false);
        toast({
          title: "Thành công",
          description: "Dịch vụ mới đã được thêm vào danh sách."
        });
      }
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    initializeCustomPrices(service);
    setIsEditDialogOpen(true);
  };

  const handleUpdateService = async () => {
    if (editingService && editingService.name && editingService.description && editingService.price) {
      const data = await callApi<Partial<Service>, Service>({
        url: `/services/${editingService.id}`,
        method: 'PUT',
        body: {
          name: editingService.name,
          description: editingService.description,
          price: editingService.price,
          duration: editingService.duration
        }
      });

      if (data) {
        const updatedService = {
          ...data,
          carTypeSpecificPrices: carCategories.map(category => ({
            carTypeId: category.id,
            price: customPrices[category.id] || Math.round((data.price || 0) * category.service_multiplier / 1000) * 1000
          }))
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
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    const success = await callApi<null, any>({
      url: `/services/${serviceId}`,
      method: 'DELETE'
    });

    if (success) {
      setServices(services.filter(s => s.id !== serviceId));
      toast({
        title: "Thành công",
        description: "Dịch vụ đã được xóa khỏi danh sách."
      });
    }
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
      newPrices[category.id] = Math.round(basePrice * category.service_multiplier / 1000) * 1000;
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
                    placeholder="Mô tả" 
                    value={newService.description || ''}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                  />
                  <Input 
                    type="number" 
                    placeholder="Giá cơ bản (VNĐ)" 
                    value={newService.price || ''}
                    onChange={(e) => setNewService({...newService, price: Number(e.target.value)})}
                  />
                  <Input 
                    type="number" 
                    placeholder="Thời gian thực hiện (phút)" 
                    value={newService.duration || ''}
                    onChange={(e) => setNewService({...newService, duration: Number(e.target.value)})}
                  />
                  {newService.price && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Giá theo loại xe</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => resetPricesToDefault(newService.price || 0)}
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
                            value={customPrices[category.id] || Math.round((newService.price || 0) * category.service_multiplier / 1000) * 1000}
                            onChange={(e) => updateCustomPrice(category.id, Number(e.target.value))}
                            onFocus={() => {
                              if (!customPrices[category.id]) {
                                updateCustomPrice(category.id, Math.round((newService.price || 0) * category.service_multiplier / 1000) * 1000);
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
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">Đang tải dữ liệu...</div>
            </div>
          )}
          {error && (
            <div className="text-center py-8 text-red-500">
              Lỗi: {error}
            </div>
          )}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Dịch Vụ</TableHead>
                  <TableHead>Mô Tả</TableHead>
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
                    <TableCell>{service.description}</TableCell>
                    <TableCell>{formatCurrency(service.price)}</TableCell>
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
          )}
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
                placeholder="Mô tả" 
                value={editingService.description || ''}
                onChange={(e) => setEditingService({...editingService, description: e.target.value})}
              />
              <Input 
                type="number" 
                placeholder="Giá cơ bản (VNĐ)" 
                value={editingService.price || ''}
                onChange={(e) => setEditingService({...editingService, price: Number(e.target.value)})}
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
                    onClick={() => resetPricesToDefault(editingService.price || 0)}
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
