import React, { useState, useEffect } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Clock, UserCheck, FileDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import useApi from '@/hooks/useApi';

type Employee = {
  id: number;
  name: string;
  employee_id: string;
  card_id: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  hire_date: string;
  is_active: boolean;
  created_at: string;
};

type AttendanceRecord = {
  id: number;
  employee_id: number;
  employee_name: string;
  card_id: string;
  check_in: string;
  check_out?: string;
  work_hours?: number;
  date: string;
  status: string;
};

const HRManagement = () => {
  const { toast } = useToast();
  const { callApi, loading } = useApi();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [selectedDate]);

  const fetchEmployees = async () => {
    const data = await callApi<null, Employee[]>({ url: '/employees' });
    if (data) setEmployees(data);
  };

  const fetchAttendance = async () => {
    const data = await callApi<null, AttendanceRecord[]>({ 
      url: `/attendance?date=${selectedDate}` 
    });
    if (data) setAttendanceRecords(data);
  };

  const handleSaveEmployee = async () => {
    if (!editingEmployee.name || !editingEmployee.employee_id || !editingEmployee.card_id) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive"
      });
      return;
    }

    if (isEditing) {
      const success = await callApi({
        url: `/employees/${editingEmployee.id}`,
        method: 'PUT',
        body: editingEmployee
      });
      if (success) {
        toast({ title: "Đã cập nhật nhân viên" });
        fetchEmployees();
      }
    } else {
      const data = await callApi<Partial<Employee>, Employee>({
        url: '/employees',
        method: 'POST',
        body: editingEmployee
      });
      if (data) {
        toast({ title: "Đã thêm nhân viên mới" });
        fetchEmployees();
      }
    }

    setIsEmployeeDialogOpen(false);
    setEditingEmployee({});
    setIsEditing(false);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditing(true);
    setIsEmployeeDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const success = await callApi({ url: `/employees/${id}`, method: 'DELETE' });
    if (success) {
      toast({ title: "Đã xóa nhân viên" });
      fetchEmployees();
    }
  };

  const simulateCardSwipe = async (cardId: string) => {
    const success = await callApi({
      url: '/attendance/swipe',
      method: 'POST',
      body: { card_id: cardId }
    });
    if (success) {
      toast({ title: "Đã chấm công thành công" });
      fetchAttendance();
    }
  };

  const exportAttendanceReport = () => {
    toast({ title: "Đã xuất báo cáo chấm công" });
  };

  const getAttendanceStatus = (record: AttendanceRecord) => {
    if (!record.check_out) return { label: 'Đang làm việc', color: 'default' };
    if (record.work_hours && record.work_hours >= 8) return { label: 'Đủ giờ', color: 'default' };
    return { label: 'Thiếu giờ', color: 'destructive' };
  };

  return (
    <>
      <NavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Quản Lý Nhân Sự</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quản lý nhân viên */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Danh Sách Nhân Viên</CardTitle>
                <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Thêm Nhân Viên
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{isEditing ? 'Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Họ tên *</label>
                          <Input
                            value={editingEmployee.name || ''}
                            onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                            placeholder="Nhập họ tên"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Mã nhân viên *</label>
                          <Input
                            value={editingEmployee.employee_id || ''}
                            onChange={(e) => setEditingEmployee({...editingEmployee, employee_id: e.target.value})}
                            placeholder="NV001"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Mã thẻ *</label>
                          <Input
                            value={editingEmployee.card_id || ''}
                            onChange={(e) => setEditingEmployee({...editingEmployee, card_id: e.target.value})}
                            placeholder="Nhập mã thẻ"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Chức vụ</label>
                          <Input
                            value={editingEmployee.position || ''}
                            onChange={(e) => setEditingEmployee({...editingEmployee, position: e.target.value})}
                            placeholder="Nhập chức vụ"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Phòng ban</label>
                          <Input
                            value={editingEmployee.department || ''}
                            onChange={(e) => setEditingEmployee({...editingEmployee, department: e.target.value})}
                            placeholder="Nhập phòng ban"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Ngày vào làm</label>
                          <Input
                            type="date"
                            value={editingEmployee.hire_date || ''}
                            onChange={(e) => setEditingEmployee({...editingEmployee, hire_date: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Số điện thoại</label>
                          <Input
                            value={editingEmployee.phone || ''}
                            onChange={(e) => setEditingEmployee({...editingEmployee, phone: e.target.value})}
                            placeholder="Nhập số điện thoại"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            value={editingEmployee.email || ''}
                            onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                            placeholder="Nhập email"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>Hủy</Button>
                        <Button onClick={handleSaveEmployee} disabled={loading}>
                          {isEditing ? 'Cập nhật' : 'Thêm'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Chức vụ</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.employee_id} • {employee.card_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{employee.position || 'Chưa xác định'}</div>
                          <div className="text-sm text-muted-foreground">{employee.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => simulateCardSwipe(employee.card_id)}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Chấm công
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleEdit(employee)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(employee.id)}>
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

          {/* Chấm công */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Bảng Chấm Công</CardTitle>
                <div className="flex gap-2 items-center">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                  <Button onClick={exportAttendanceReport} variant="outline">
                    <FileDown className="mr-2 h-4 w-4" /> Xuất báo cáo
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead>Giờ vào/ra</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record) => {
                    const status = getAttendanceStatus(record);
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.employee_name}</div>
                            <div className="text-sm text-muted-foreground">{record.card_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Vào: {new Date(record.check_in).toLocaleTimeString('vi-VN')}</div>
                            {record.check_out && (
                              <div>Ra: {new Date(record.check_out).toLocaleTimeString('vi-VN')}</div>
                            )}
                            {record.work_hours && (
                              <div className="text-muted-foreground">{record.work_hours.toFixed(1)} giờ</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.color as any}>{status.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HRManagement;