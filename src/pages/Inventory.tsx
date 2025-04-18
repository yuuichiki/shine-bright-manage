
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

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
};

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Car Wash Soap', category: 'Cleaning', quantity: 50, unit: 'Liters', reorderPoint: 20 },
    { id: 2, name: 'Engine Oil 5W-30', category: 'Maintenance', quantity: 30, unit: 'Quarts', reorderPoint: 15 },
    { id: 3, name: 'Microfiber Towels', category: 'Cleaning Supplies', quantity: 100, unit: 'Pieces', reorderPoint: 50 }
  ]);

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.quantity) {
      const itemToAdd = {
        ...newItem,
        id: inventory.length + 1
      } as InventoryItem;
      setInventory([...inventory, itemToAdd]);
      setNewItem({});
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Inventory List</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input 
                    placeholder="Item Name" 
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                  <Input 
                    placeholder="Category" 
                    value={newItem.category || ''}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  />
                  <Input 
                    type="number" 
                    placeholder="Quantity" 
                    value={newItem.quantity || ''}
                    onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                  />
                  <Input 
                    placeholder="Unit" 
                    value={newItem.unit || ''}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  />
                  <Input 
                    type="number" 
                    placeholder="Reorder Point" 
                    value={newItem.reorderPoint || ''}
                    onChange={(e) => setNewItem({...newItem, reorderPoint: Number(e.target.value)})}
                  />
                  <Button onClick={handleAddItem}>Save Item</Button>
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
                <TableHead>Quantity</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                  <TableCell>{item.reorderPoint}</TableCell>
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

export default Inventory;
