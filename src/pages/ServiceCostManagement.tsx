
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
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Calculator, Package, Zap, Users, Home } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

type CostComponent = {
  id: number;
  name: string;
  type: 'material' | 'utility' | 'labor' | 'overhead';
  unitCost: number;
  usagePerService: number;
  unit: string;
  description?: string;
};

type ServiceCost = {
  id: number;
  serviceName: string;
  components: CostComponent[];
  totalCostPerService: number;
  suggestedPrice: number;
  profitMargin: number;
};

const ServiceCostManagement = () => {
  const { toast } = useToast();
  const [serviceCosts, setServiceCosts] = useState<ServiceCost[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingServiceCost, setEditingServiceCost] = useState<ServiceCost | null>(null);
  const [newServiceForm, setNewServiceForm] = useState({
    serviceName: '',
    components: [] as CostComponent[]
  });
  const [newComponent, setNewComponent] = useState({
    name: '',
    type: 'material' as const,
    unitCost: 0,
    usagePerService: 0,
    unit: '',
    description: ''
  });

  const calculateTotalCost = (components: CostComponent[]) => {
    return components.reduce((total, component) => 
      total + (component.unitCost * component.usagePerService), 0
    );
  };

  const calculateProfitMargin = (totalCost: number, suggestedPrice: number) => {
    if (suggestedPrice === 0) return 0;
    return ((suggestedPrice - totalCost) / suggestedPrice * 100);
  };

  const addComponentToForm = () => {
    if (!newComponent.name || newComponent.unitCost <= 0 || newComponent.usagePerService <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin hợp lệ",
        variant: "destructive"
      });
      return;
    }

    const component: CostComponent = {
      id: Date.now(),
      ...newComponent
    };

    setNewServiceForm(prev => ({
      ...prev,
      components: [...prev.components, component]
    }));

    setNewComponent({
      name: '',
      type: 'material',
      unitCost: 0,
      usagePerService: 0,
      unit: '',
      description: ''
    });
  };

  const removeComponentFromForm = (componentId: number) => {
    setNewServiceForm(prev => ({
      ...prev,
      components: prev.components.filter(c => c.id !== componentId)
    }));
  };

  const handleAddServiceCost = () => {
    if (!newServiceForm.serviceName || newServiceForm.components.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên dịch vụ và thêm ít nhất một thành phần chi phí",
        variant: "destructive"
      });
      return;
    }

    const totalCost = calculateTotalCost(newServiceForm.components);
    const suggestedPrice = totalCost * 1.8; // Đề xuất giá với lợi nhuận 80%

    const newServiceCost: ServiceCost = {
      id: Date.now(),
      serviceName: newServiceForm.serviceName,
      components: newServiceForm.components,
      totalCostPerService: totalCost,
      suggestedPrice: suggestedPrice,
      profitMargin: calculateProfitMargin(totalCost, suggestedPrice)
    };

    setServiceCosts([...serviceCosts, newServiceCost]);
    setNewServiceForm({ serviceName: '', components: [] });
    setIsAddDialogOpen(false);

    toast({
      title: "Thành công",
      description: "Đã thêm cấu trúc chi phí dịch vụ mới"
    });
  };

  const handleDeleteServiceCost = (id: number) => {
    setServiceCosts(serviceCosts.filter(sc => sc.id !== id));
    toast({
      title: "Thành công",
      description: "Đã xóa cấu trúc chi phí dịch vụ"
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'material': return <Package className="h-4 w-4" />;
      case 'utility': return <Zap className="h-4 w-4" />;
      case 'labor': return <Users className="h-4 w-4" />;
      case 'overhead': return <Home className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'material': return 'Nguyên vật liệu';
      case 'utility': return 'Tiện ích (điện, nước)';
      case 'labor': return 'Nhân công';
      case 'overhead': return 'Chi phí chung';
      default: return type;
    }
  };

  return (
    <>
    <NavigationMenu />
    <div className="min-h-screen bg-background">
      
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calculator className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Quản Lý Chi Phí Dịch Vụ</h1>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm dịch vụ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm cấu trúc chi phí dịch vụ mới</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="serviceName">Tên dịch vụ</Label>
                  <Input
                    id="serviceName"
                    value={newServiceForm.serviceName}
                    onChange={(e) => setNewServiceForm(prev => ({
                      ...prev,
                      serviceName: e.target.value
                    }))}
                    placeholder="Nhập tên dịch vụ"
                  />
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-4">Thêm thành phần chi phí</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="componentName">Tên thành phần</Label>
                      <Input
                        id="componentName"
                        value={newComponent.name}
                        onChange={(e) => setNewComponent(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                        placeholder="VD: Nước rửa xe"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="componentType">Loại chi phí</Label>
                      <Select 
                        value={newComponent.type} 
                        onValueChange={(value: any) => setNewComponent(prev => ({
                          ...prev,
                          type: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="material">Nguyên vật liệu</SelectItem>
                          <SelectItem value="utility">Tiện ích (điện, nước)</SelectItem>
                          <SelectItem value="labor">Nhân công</SelectItem>
                          <SelectItem value="overhead">Chi phí chung</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="unitCost">Giá đơn vị (đ)</Label>
                      <Input
                        id="unitCost"
                        type="number"
                        value={newComponent.unitCost}
                        onChange={(e) => setNewComponent(prev => ({
                          ...prev,
                          unitCost: Number(e.target.value)
                        }))}
                        placeholder="VD: 1000000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="usagePerService">Lượng dùng/lần</Label>
                      <Input
                        id="usagePerService"
                        type="number"
                        step="0.01"
                        value={newComponent.usagePerService}
                        onChange={(e) => setNewComponent(prev => ({
                          ...prev,
                          usagePerService: Number(e.target.value)
                        }))}
                        placeholder="VD: 0.02"
                      />
                    </div>

                    <div>
                      <Label htmlFor="unit">Đơn vị</Label>
                      <Input
                        id="unit"
                        value={newComponent.unit}
                        onChange={(e) => setNewComponent(prev => ({
                          ...prev,
                          unit: e.target.value
                        }))}
                        placeholder="VD: chai, lít, kg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Mô tả</Label>
                      <Input
                        id="description"
                        value={newComponent.description}
                        onChange={(e) => setNewComponent(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        placeholder="VD: 1 chai pha được 50 lần"
                      />
                    </div>
                  </div>

                  <Button onClick={addComponentToForm} className="mb-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm thành phần
                  </Button>

                  {newServiceForm.components.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Các thành phần đã thêm:</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tên</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Giá đơn vị</TableHead>
                            <TableHead>Lượng dùng</TableHead>
                            <TableHead>Chi phí/lần</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {newServiceForm.components.map((component) => (
                            <TableRow key={component.id}>
                              <TableCell>{component.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(component.type)}
                                  {getTypeName(component.type)}
                                </div>
                              </TableCell>
                              <TableCell>{component.unitCost.toLocaleString('vi-VN')} đ</TableCell>
                              <TableCell>{component.usagePerService} {component.unit}</TableCell>
                              <TableCell className="font-medium">
                                {(component.unitCost * component.usagePerService).toLocaleString('vi-VN')} đ
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeComponentFromForm(component.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center font-bold">
                          <span>Tổng chi phí mỗi lần dịch vụ:</span>
                          <span className="text-lg text-red-600">
                            {calculateTotalCost(newServiceForm.components).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                          <span>Giá đề xuất (lợi nhuận 80%):</span>
                          <span className="text-green-600 font-medium">
                            {(calculateTotalCost(newServiceForm.components) * 1.8).toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleAddServiceCost}>
                    Thêm dịch vụ
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Service Cost List */}
        {serviceCosts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Chưa có cấu trúc chi phí nào</h3>
              <p className="text-muted-foreground">Bắt đầu bằng cách thêm cấu trúc chi phí dịch vụ đầu tiên</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {serviceCosts.map((serviceCost) => (
              <Card key={serviceCost.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{serviceCost.serviceName}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteServiceCost(serviceCost.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thành phần chi phí</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Giá đơn vị</TableHead>
                        <TableHead>Lượng dùng/lần</TableHead>
                        <TableHead>Chi phí/lần dịch vụ</TableHead>
                        <TableHead>Mô tả</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceCost.components.map((component) => (
                        <TableRow key={component.id}>
                          <TableCell className="font-medium">{component.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(component.type)}
                              {getTypeName(component.type)}
                            </div>
                          </TableCell>
                          <TableCell>{component.unitCost.toLocaleString('vi-VN')} đ</TableCell>
                          <TableCell>{component.usagePerService} {component.unit}</TableCell>
                          <TableCell className="font-medium">
                            {(component.unitCost * component.usagePerService).toLocaleString('vi-VN')} đ
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {component.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {serviceCost.totalCostPerService.toLocaleString('vi-VN')} đ
                          </div>
                          <div className="text-sm text-muted-foreground">Tổng chi phí</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {serviceCost.suggestedPrice.toLocaleString('vi-VN')} đ
                          </div>
                          <div className="text-sm text-muted-foreground">Giá đề xuất</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {serviceCost.profitMargin.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Tỷ lệ lợi nhuận</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ServiceCostManagement;
