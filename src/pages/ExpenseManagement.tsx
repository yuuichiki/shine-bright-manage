import React, { useState, useEffect } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import useApi from '@/hooks/useApi';
import { generatePDFReport, downloadPDF, formatCurrency } from '@/utils/pdfGenerator';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, TrendingDown, TrendingUp, Calculator, FileDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type ExpenseType = 'fixed' | 'variable' | 'tax' | 'discount';

type Expense = {
  id: number;
  name: string;
  amount: number;
  type: ExpenseType;
  description: string;
  frequency: 'daily' | 'monthly' | 'yearly';
  isActive: boolean;
};

const ExpenseManagement = () => {
  const { callApi } = useApi();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [newExpense, setNewExpense] = useState<Partial<Expense>>({});
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const [todayRevenue, setTodayRevenue] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      // Load expenses from DB
      const exp = await callApi<null, any[]>({ url: '/expenses' });
      if (Array.isArray(exp)) {
        setExpenses(exp.map((e: any) => ({
          id: e.id,
          name: e.name,
          amount: Number(e.amount),
          type: e.type,
          description: e.description || '',
          frequency: e.frequency,
          isActive: e.is_active ?? e.isActive ?? true,
        })));
      }

      // Load invoices to compute today's revenue
      const invs = await callApi<null, any[]>({ url: '/invoices' });
      if (Array.isArray(invs)) {
        const today = new Date().toISOString().split('T')[0];
        const revenue = invs
          .filter((inv: any) => {
            const d = (inv.date || inv.invoice_date || '').toString().slice(0, 10);
            return d === today && (inv.status ? inv.status === 'paid' : true);
          })
          .reduce((sum: number, inv: any) => {
            const total = Number(inv.total ?? inv.total_amount ?? inv.grand_total ?? inv.amount ?? 0);
            return sum + (isNaN(total) ? 0 : total);
          }, 0);
        setTodayRevenue(revenue);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddExpense = async () => {
    if (newExpense.name && newExpense.amount !== undefined && newExpense.type && newExpense.frequency) {
      const payload: any = {
        name: newExpense.name,
        amount: Number(newExpense.amount),
        type: newExpense.type,
        description: newExpense.description || '',
        frequency: newExpense.frequency,
        is_active: true,
      };
      const created = await callApi<any, any>({ url: '/expenses', method: 'POST', body: payload });
      if (created) {
        setExpenses(prev => [...prev, {
          id: created.id,
          name: created.name,
          amount: Number(created.amount),
          type: created.type,
          description: created.description || '',
          frequency: created.frequency,
          isActive: created.is_active ?? true,
        }]);
        setNewExpense({});
        setIsDialogOpen(false);
        toast({ title: 'Thành công', description: 'Đã thêm chi phí.' });
      }
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense({ ...expense });
    setIsEditDialogOpen(true);
  };

  const handleUpdateExpense = async () => {
    if (editingExpense) {
      const payload: any = {
        name: editingExpense.name,
        amount: editingExpense.amount,
        type: editingExpense.type,
        description: editingExpense.description,
        frequency: editingExpense.frequency,
        is_active: editingExpense.isActive,
      };
      const updated = await callApi<any, any>({ url: `/expenses/${editingExpense.id}`, method: 'PUT', body: payload });
      if (updated) {
        setExpenses(prev => prev.map(exp => 
          exp.id === editingExpense.id 
            ? { id: updated.id, name: updated.name, amount: Number(updated.amount), type: updated.type, description: updated.description || '', frequency: updated.frequency, isActive: updated.is_active ?? editingExpense.isActive }
            : exp
        ));
        setEditingExpense(null);
        setIsEditDialogOpen(false);
        toast({ title: 'Đã cập nhật', description: 'Cập nhật chi phí thành công.' });
      }
    }
  };

  const handleDeleteExpense = async (id: number) => {
    const res = await callApi<null, any>({ url: `/expenses/${id}`, method: 'DELETE' });
    if (res !== null) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast({ title: 'Đã xóa', description: 'Đã xóa chi phí.' });
    }
  };

  const toggleExpenseStatus = async (id: number) => {
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;
    const updated = await callApi<any, any>({ url: `/expenses/${id}`, method: 'PUT', body: {
      name: exp.name,
      amount: exp.amount,
      type: exp.type,
      description: exp.description,
      frequency: exp.frequency,
      is_active: !exp.isActive,
    }});
    if (updated) {
      setExpenses(prev => prev.map(e => e.id === id ? { ...e, isActive: !e.isActive } : e));
    }
  };

  // Calculate daily expenses
  const calculateDailyExpenses = () => {
    return expenses
      .filter(exp => exp.isActive)
      .reduce((total, expense) => {
        let dailyAmount = 0;
        if (expense.frequency === 'daily') {
          dailyAmount = expense.amount;
        } else if (expense.frequency === 'monthly') {
          dailyAmount = expense.amount / 30;
        } else if (expense.frequency === 'yearly') {
          dailyAmount = expense.amount / 365;
        }
        
        if (expense.type === 'tax' || expense.type === 'discount') {
          // For percentage-based expenses, calculate based on revenue
          return total + (todayRevenue * dailyAmount);
        }
        
        return total + dailyAmount;
      }, 0);
  };

  const dailyExpenses = calculateDailyExpenses();
  const netProfit = todayRevenue - dailyExpenses;
  const breakEvenPoint = dailyExpenses;

  const getExpenseTypeLabel = (type: ExpenseType) => {
    switch (type) {
      case 'fixed': return 'Chi phí cố định';
      case 'variable': return 'Chi phí biến đổi';
      case 'tax': return 'Thuế';
      case 'discount': return 'Chiết khấu';
      default: return type;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Hàng ngày';
      case 'monthly': return 'Hàng tháng';
      case 'yearly': return 'Hàng năm';
      default: return frequency;
    }
  };

  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quản Lý Chi Phí</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {todayRevenue.toLocaleString('vi-VN')} đ
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chi phí hôm nay</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {dailyExpenses.toLocaleString('vi-VN')} đ
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lợi nhuận ròng</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('vi-VN')} đ
            </div>
            <p className="text-xs text-muted-foreground">
              {netProfit < 0 ? `Cần thêm ${Math.abs(netProfit).toLocaleString('vi-VN')} đ để hòa vốn` : 'Đã hòa vốn'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm hòa vốn</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {breakEvenPoint.toLocaleString('vi-VN')} đ
            </div>
            <p className="text-xs text-muted-foreground">
              Doanh thu tối thiểu/ngày
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Danh Sách Chi Phí</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {}}><FileDown className="mr-2 h-4 w-4" />Xuất Báo Cáo</Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Thêm Chi Phí
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm Chi Phí Mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input 
                    placeholder="Tên chi phí" 
                    value={newExpense.name || ''}
                    onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                  />
                  <Input 
                    placeholder="Mô tả" 
                    value={newExpense.description || ''}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  />
                  <Input 
                    type="number" 
                    placeholder="Số tiền (đ hoặc % cho thuế/chiết khấu)" 
                    value={newExpense.amount || ''}
                    onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                  />
                  <Select value={newExpense.type} onValueChange={(value: ExpenseType) => setNewExpense({...newExpense, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Loại chi phí" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Chi phí cố định</SelectItem>
                      <SelectItem value="variable">Chi phí biến đổi</SelectItem>
                      <SelectItem value="tax">Thuế</SelectItem>
                      <SelectItem value="discount">Chiết khấu</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newExpense.frequency} onValueChange={(value: 'daily' | 'monthly' | 'yearly') => setNewExpense({...newExpense, frequency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tần suất" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Hàng ngày</SelectItem>
                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                      <SelectItem value="yearly">Hàng năm</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddExpense}>Lưu Chi Phí</Button>
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </div>
        </CardHeader>
        
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh Sửa Chi Phí</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input 
                placeholder="Tên chi phí" 
                value={editingExpense?.name || ''}
                onChange={(e) => setEditingExpense(prev => prev ? {...prev, name: e.target.value} : null)}
              />
              <Input 
                placeholder="Mô tả" 
                value={editingExpense?.description || ''}
                onChange={(e) => setEditingExpense(prev => prev ? {...prev, description: e.target.value} : null)}
              />
              <Input 
                type="number" 
                placeholder="Số tiền" 
                value={editingExpense?.amount || ''}
                onChange={(e) => setEditingExpense(prev => prev ? {...prev, amount: Number(e.target.value)} : null)}
              />
              <Select value={editingExpense?.type} onValueChange={(value: ExpenseType) => setEditingExpense(prev => prev ? {...prev, type: value} : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Loại chi phí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Chi phí cố định</SelectItem>
                  <SelectItem value="variable">Chi phí biến đổi</SelectItem>
                  <SelectItem value="tax">Thuế</SelectItem>
                  <SelectItem value="discount">Chiết khấu</SelectItem>
                </SelectContent>
              </Select>
              <Select value={editingExpense?.frequency} onValueChange={(value: 'daily' | 'monthly' | 'yearly') => setEditingExpense(prev => prev ? {...prev, frequency: value} : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tần suất" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Hàng ngày</SelectItem>
                  <SelectItem value="monthly">Hàng tháng</SelectItem>
                  <SelectItem value="yearly">Hàng năm</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleUpdateExpense}>Cập Nhật</Button>
            </div>
          </DialogContent>
        </Dialog>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Chi Phí</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số Tiền</TableHead>
                <TableHead>Tần Suất</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{expense.name}</div>
                      <div className="text-sm text-muted-foreground">{expense.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getExpenseTypeLabel(expense.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {expense.type === 'tax' || expense.type === 'discount' 
                      ? `${(expense.amount * 100).toFixed(1)}%` 
                      : `${expense.amount.toLocaleString('vi-VN')} đ`
                    }
                  </TableCell>
                  <TableCell>{getFrequencyLabel(expense.frequency)}</TableCell>
                  <TableCell>
                    <Badge variant={expense.isActive ? 'default' : 'secondary'}>
                      {expense.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditExpense(expense)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={expense.isActive ? "secondary" : "default"} 
                        size="icon" 
                        onClick={() => toggleExpenseStatus(expense.id)}
                      >
                        {expense.isActive ? 'Tắt' : 'Bật'}
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
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
    </>
  );
};

export default ExpenseManagement;