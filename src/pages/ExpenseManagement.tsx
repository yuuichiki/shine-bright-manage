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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, TrendingDown, TrendingUp, Calculator } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, name: 'Thuê mặt bằng', amount: 15000000, type: 'fixed', description: 'Chi phí thuê cửa hàng hàng tháng', frequency: 'monthly', isActive: true },
    { id: 2, name: 'Lương nhân viên', amount: 25000000, type: 'fixed', description: 'Tổng lương nhân viên/tháng', frequency: 'monthly', isActive: true },
    { id: 3, name: 'Điện nước', amount: 3000000, type: 'variable', description: 'Chi phí điện nước hàng tháng', frequency: 'monthly', isActive: true },
    { id: 4, name: 'Thuế VAT', amount: 0.1, type: 'tax', description: 'Thuế VAT 10%', frequency: 'daily', isActive: true },
    { id: 5, name: 'Chiết khấu khách hàng VIP', amount: 0.05, type: 'discount', description: 'Giảm giá 5% cho khách VIP', frequency: 'daily', isActive: true }
  ]);

  const [newExpense, setNewExpense] = useState<Partial<Expense>>({});
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock daily revenue for calculation
  const todayRevenue = 2500000; // Example revenue

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount && newExpense.type && newExpense.frequency) {
      const expenseToAdd = {
        ...newExpense,
        id: Math.max(...expenses.map(e => e.id), 0) + 1,
        isActive: true
      } as Expense;
      setExpenses([...expenses, expenseToAdd]);
      setNewExpense({});
      setIsDialogOpen(false);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense({ ...expense });
    setIsEditDialogOpen(true);
  };

  const handleUpdateExpense = () => {
    if (editingExpense) {
      setExpenses(expenses.map(exp => 
        exp.id === editingExpense.id ? editingExpense : exp
      ));
      setEditingExpense(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const toggleExpenseStatus = (id: number) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, isActive: !exp.isActive } : exp
    ));
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
  );
};

export default ExpenseManagement;