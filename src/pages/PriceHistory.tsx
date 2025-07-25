
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from 'lucide-react';

type PriceHistoryEntry = {
  id: number;
  serviceName: string;
  oldPrice: number;
  newPrice: number;
  changeDate: string;
  reason: string;
};

const PriceHistory = () => {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([
    { 
      id: 1, 
      serviceName: 'Basic Car Wash', 
      oldPrice: 20, 
      newPrice: 25, 
      changeDate: '2024-04-15', 
      reason: 'Operational Cost Increase' 
    },
    { 
      id: 2, 
      serviceName: 'Full Detailing', 
      oldPrice: 125, 
      newPrice: 150, 
      changeDate: '2024-03-20', 
      reason: 'Premium Service Update' 
    }
  ]);

  const [newEntry, setNewEntry] = useState<Partial<PriceHistoryEntry>>({});

  const handleAddPriceChange = () => {
    if (newEntry.serviceName && newEntry.oldPrice && newEntry.newPrice) {
      const entryToAdd = {
        ...newEntry,
        id: priceHistory.length + 1,
        changeDate: new Date().toISOString().split('T')[0]
      } as PriceHistoryEntry;
      setPriceHistory([...priceHistory, entryToAdd]);
      setNewEntry({});
    }
  };

  return (
     <>
        <NavigationMenu />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Price History</h1>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Price Change Log</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Log Price Change
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Price Change Entry</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input 
                    placeholder="Service Name" 
                    value={newEntry.serviceName || ''}
                    onChange={(e) => setNewEntry({...newEntry, serviceName: e.target.value})}
                  />
                  <Input 
                    type="number" 
                    placeholder="Old Price" 
                    value={newEntry.oldPrice || ''}
                    onChange={(e) => setNewEntry({...newEntry, oldPrice: Number(e.target.value)})}
                  />
                  <Input 
                    type="number" 
                    placeholder="New Price" 
                    value={newEntry.newPrice || ''}
                    onChange={(e) => setNewEntry({...newEntry, newPrice: Number(e.target.value)})}
                  />
                  <Input 
                    placeholder="Reason for Change" 
                    value={newEntry.reason || ''}
                    onChange={(e) => setNewEntry({...newEntry, reason: e.target.value})}
                  />
                  <Button onClick={handleAddPriceChange}>Save Price Change</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Old Price</TableHead>
                <TableHead>New Price</TableHead>
                <TableHead>Change Date</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.serviceName}</TableCell>
                  <TableCell>${entry.oldPrice}</TableCell>
                  <TableCell>${entry.newPrice}</TableCell>
                  <TableCell>{entry.changeDate}</TableCell>
                  <TableCell>{entry.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default PriceHistory;
