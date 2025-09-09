import React, { useEffect, useState } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import useApi from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';

interface Batch {
  id: number;
  batchCode: string;
  importDate: string;
  supplierId?: number;
  supplier?: {
    id: number;
    name: string;
    contact: string;
    phone: string;
    email: string;
    address: string;
  };
  notes?: string;
}

const Batches: React.FC = () => {
  const { callApi } = useApi();
  const { toast } = useToast();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBatch, setNewBatch] = useState<Partial<Batch>>({
    importDate: new Date().toISOString().slice(0, 10),
  });

  const loadBatches = async () => {
    const data = await callApi<null, any[]>({ url: '/batches' });
    if (Array.isArray(data)) {
      setBatches(
        data.map((b: any) => ({
          id: b.id,
          batchCode: b.batchCode,
          importDate: b.importDate,
          supplierId: b.supplierId,
          supplier: b.supplier,
          notes: b.notes,
        }))
      );
    }
  };

  useEffect(() => {
    loadBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddBatch = async () => {
    if (!newBatch.batchCode || !newBatch.importDate) {
      toast({ title: 'Thiếu thông tin', description: 'Vui lòng nhập mã lô hàng và ngày nhập.', variant: 'destructive' });
      return;
    }
    const payload: any = {
      batchCode: newBatch.batchCode,
      supplierId: newBatch.supplierId || null,
      importDate: newBatch.importDate,
      notes: newBatch.notes || '',
    };
    const created = await callApi<any, any>({ url: '/batches', method: 'POST', body: payload });
    if (created) {
      toast({ title: 'Thành công', description: 'Đã thêm lô hàng mới.' });
      setIsDialogOpen(false);
      setNewBatch({ importDate: new Date().toISOString().slice(0, 10) });
      loadBatches();
    }
  };

  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quản Lý Lô Hàng</h1>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Danh Sách Lô Hàng</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Thêm Lô Hàng Mới
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Thêm Lô Hàng Mới</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Mã Lô Hàng</label>
                        <Input
                          placeholder="Ví dụ: LH-2025-004"
                          value={newBatch.batchCode || ''}
                          onChange={(e) => setNewBatch({ ...newBatch, batchCode: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Ngày Nhập</label>
                        <Input
                          type="date"
                          value={newBatch.importDate || ''}
                          onChange={(e) => setNewBatch({ ...newBatch, importDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Nhà Cung Cấp (ID)</label>
                        <Input
                          type="number"
                          placeholder="ID nhà cung cấp (tùy chọn)"
                          value={newBatch.supplierId ?? ''}
                          onChange={(e) => setNewBatch({ ...newBatch, supplierId: e.target.value ? Number(e.target.value) : undefined })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Ghi chú</label>
                        <Input
                          placeholder="Ghi chú (tùy chọn)"
                          value={newBatch.notes || ''}
                          onChange={(e) => setNewBatch({ ...newBatch, notes: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button className="mt-2" onClick={handleAddBatch}>Lưu Lô Hàng</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Lô</TableHead>
                  <TableHead>Ngày Nhập</TableHead>
                  <TableHead>Nhà Cung Cấp</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>{batch.batchCode}</TableCell>
                    <TableCell>{new Date(batch.importDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{batch.supplier?.name || batch.supplierId || '—'}</TableCell>
                    <TableCell>{batch.notes || '—'}</TableCell>
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

export default Batches;
