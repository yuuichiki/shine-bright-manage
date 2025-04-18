
import React, { useState } from 'react';
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from 'lucide-react';

type Service = {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: number;
};

const Services = () => {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Basic Car Wash', category: 'Exterior', price: 25, duration: 30 },
    { id: 2, name: 'Full Car Detailing', category: 'Complete', price: 150, duration: 180 },
    { id: 3, name: 'Oil Change', category: 'Maintenance', price: 50, duration: 45 }
  ]);

  const [newService, setNewService] = useState<Partial<Service>>({});

  const handleAddService = () => {
    if (newService.name && newService.category && newService.price) {
      const serviceToAdd = {
        ...newService,
        id: services.length + 1
      } as Service;
      setServices([...services, serviceToAdd]);
      setNewService({});
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Services Management</h1>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Service List</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Service</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input 
                    placeholder="Service Name" 
                    value={newService.name || ''}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                  />
                  <Input 
                    placeholder="Category" 
                    value={newService.category || ''}
                    onChange={(e) => setNewService({...newService, category: e.target.value})}
                  />
                  <Input 
                    type="number" 
                    placeholder="Price" 
                    value={newService.price || ''}
                    onChange={(e) => setNewService({...newService, price: Number(e.target.value)})}
                  />
                  <Input 
                    type="number" 
                    placeholder="Duration (minutes)" 
                    value={newService.duration || ''}
                    onChange={(e) => setNewService({...newService, duration: Number(e.target.value)})}
                  />
                  <Button onClick={handleAddService}>Save Service</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>${service.price}</TableCell>
                  <TableCell>{service.duration} min</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
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
    </div>
  );
};

export default Services;
